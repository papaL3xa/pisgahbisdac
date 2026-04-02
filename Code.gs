// ========================================================
// GOOGLE APPS SCRIPT - PISGAH BISDAC
// ========================================================
// File ini harus ditempatkan di Google Apps Script project
// dan di-deploy sebagai Web App dengan akses "Anyone"

// ========================================================
// KONFIGURASI SHEETS ID
// ========================================================
// Ganti dengan ID Google Sheets Anda
const SPREADSHEET_ID = '1YOUR_SPREADSHEET_ID_HERE';
const SHEET_JADWAL = 'JadwalIbadah';
const SHEET_PEJABAT = 'DataPejabat';
const SHEET_KATEGORI = 'KategoriPejabat';
const SHEET_SETTINGS = 'Settings';
const SHEET_USERS = 'Users';

// ========================================================
// FUNGSI UTAMA DO GET & DO POST
// ========================================================
function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    const params = e.parameter || {};
    const postData = e.postData ? JSON.parse(e.postData.contents) : {};
    const action = params.action || postData.action || 'getData';
    
    switch(action) {
      case 'getData':
        return getData();
      case 'verifyPassword':
        return verifyPassword(postData);
      case 'saveJadwal':
        return saveJadwal(postData);
      case 'savePejabat':
        return savePejabat(postData);
      case 'saveYoutubeUrl':
        return saveYoutubeUrl(postData);
      case 'changePassword':
        return changePassword(postData);
      case 'getUsers':
        return getUsers(postData);
      case 'saveUser':
        return saveUser(postData);
      case 'deleteUser':
        return deleteUser(postData);
      default:
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          message: 'Action tidak dikenal'
        })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ========================================================
// FUNGSI GET DATA (LOAD SEMUA DATA)
// ========================================================
function getData() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Load jadwal ibadah
  let jadwalDB = {};
  const jadwalSheet = ss.getSheetByName(SHEET_JADWAL);
  if (jadwalSheet) {
    const data = jadwalSheet.getDataRange().getValues();
    if (data.length > 1) {
      for (let i = 1; i < data.length; i++) {
        const tanggal = data[i][0];
        const jsonData = data[i][1];
        if (tanggal && jsonData) {
          try {
            jadwalDB[tanggal] = JSON.parse(jsonData);
          } catch(e) {}
        }
      }
    }
  }
  
  // Load data pejabat
  let dataPejabat = [];
  const pejabatSheet = ss.getSheetByName(SHEET_PEJABAT);
  if (pejabatSheet) {
    const data = pejabatSheet.getDataRange().getValues();
    if (data.length > 1) {
      const headers = data[0];
      for (let i = 1; i < data.length; i++) {
        let obj = {};
        headers.forEach((header, idx) => {
          obj[header] = data[i][idx];
        });
        dataPejabat.push(obj);
      }
    }
  }
  
  // Load kategori pejabat
  let kategoriPejabat = ["Gembala", "Officers", "Departemen & Pelayanan", "Lainnya"];
  const kategoriSheet = ss.getSheetByName(SHEET_KATEGORI);
  if (kategoriSheet) {
    const data = kategoriSheet.getDataRange().getValues();
    if (data.length > 0) {
      kategoriPejabat = data.flat().filter(v => v);
    }
  }
  
  // Load settings (YouTube URL)
  let youtubeUrl = "https://www.youtube.com/embed/EAO55pnNsgs";
  const settingsSheet = ss.getSheetByName(SHEET_SETTINGS);
  if (settingsSheet) {
    const data = settingsSheet.getDataRange().getValues();
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === 'youtubeUrl' && data[i][1]) {
        youtubeUrl = data[i][1];
        break;
      }
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    jadwalDB: jadwalDB,
    dataPejabat: dataPejabat,
    kategoriPejabat: kategoriPejabat,
    youtubeUrl: youtubeUrl
  })).setMimeType(ContentService.MimeType.JSON);
}

// ========================================================
// FUNGSI VERIFIKASI PASSWORD (LOGIN)
// ========================================================
function verifyPassword(data) {
  const password = data.password;
  const username = data.username;
  
  // Cek di sheet Users
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const usersSheet = ss.getSheetByName(SHEET_USERS);
  
  if (!usersSheet) {
    // Jika sheet belum ada, buat default admin
    initializeSheets();
    return verifyPassword(data);
  }
  
  const users = usersSheet.getDataRange().getValues();
  
  // Cari user
  for (let i = 1; i < users.length; i++) {
    if (users[i][0] === username && users[i][1] === password) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        role: users[i][2] || 'editor',
        username: username
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    message: 'Username atau password salah'
  })).setMimeType(ContentService.MimeType.JSON);
}

// ========================================================
// FUNGSI SIMPAN JADWAL
// ========================================================
function saveJadwal(data) {
  // Verifikasi akses (admin atau editor bisa simpan jadwal)
  const authResult = verifyAccess(data.password);
  if (!authResult.success) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Akses ditolak'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const tanggal = data.tanggal;
  const jadwalData = data.data;
  
  if (!tanggal || !jadwalData) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Data tidak lengkap'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_JADWAL);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_JADWAL);
    sheet.appendRow(['Tanggal', 'DataJadwal', 'LastUpdated']);
  }
  
  // Cek apakah tanggal sudah ada
  const dataRange = sheet.getDataRange().getValues();
  let found = false;
  
  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0] === tanggal) {
      sheet.getRange(i + 1, 2).setValue(JSON.stringify(jadwalData));
      sheet.getRange(i + 1, 3).setValue(new Date().toISOString());
      found = true;
      break;
    }
  }
  
  if (!found) {
    sheet.appendRow([tanggal, JSON.stringify(jadwalData), new Date().toISOString()]);
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Jadwal berhasil disimpan'
  })).setMimeType(ContentService.MimeType.JSON);
}

// ========================================================
// FUNGSI SIMPAN DATA PEJABAT
// ========================================================
function savePejabat(data) {
  // Hanya admin yang bisa menyimpan pejabat
  const authResult = verifyAccess(data.password, 'admin');
  if (!authResult.success) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Akses ditolak. Hanya Admin yang dapat mengelola pejabat.'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const pejabatData = data.data;
  const kategoriData = data.kategoriPejabat;
  
  if (!pejabatData) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Data tidak lengkap'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Simpan data pejabat
  let sheet = ss.getSheetByName(SHEET_PEJABAT);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_PEJABAT);
  }
  
  // Hapus semua data lama
  sheet.clear();
  
  // Tulis header
  if (pejabatData.length > 0) {
    const headers = Object.keys(pejabatData[0]);
    sheet.appendRow(headers);
    
    // Tulis data
    pejabatData.forEach(row => {
      const rowData = headers.map(h => row[h] || '');
      sheet.appendRow(rowData);
    });
  }
  
  // Simpan kategori
  if (kategoriData && kategoriData.length > 0) {
    let kategoriSheet = ss.getSheetByName(SHEET_KATEGORI);
    if (!kategoriSheet) {
      kategoriSheet = ss.insertSheet(SHEET_KATEGORI);
    }
    kategoriSheet.clear();
    kategoriData.forEach(kat => {
      kategoriSheet.appendRow([kat]);
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Data pejabat berhasil disimpan'
  })).setMimeType(ContentService.MimeType.JSON);
}

// ========================================================
// FUNGSI SIMPAN YOUTUBE URL
// ========================================================
function saveYoutubeUrl(data) {
  // Hanya admin yang bisa mengubah URL
  const authResult = verifyAccess(data.password, 'admin');
  if (!authResult.success) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Akses ditolak. Hanya Admin yang dapat mengubah URL.'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const url = data.url;
  
  if (!url) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'URL tidak boleh kosong'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_SETTINGS);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_SETTINGS);
    sheet.appendRow(['Setting', 'Value']);
  }
  
  // Cek apakah sudah ada
  const dataRange = sheet.getDataRange().getValues();
  let found = false;
  
  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0] === 'youtubeUrl') {
      sheet.getRange(i + 1, 2).setValue(url);
      found = true;
      break;
    }
  }
  
  if (!found) {
    sheet.appendRow(['youtubeUrl', url]);
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'URL YouTube berhasil disimpan'
  })).setMimeType(ContentService.MimeType.JSON);
}

// ========================================================
// FUNGSI GANTI PASSWORD
// ========================================================
function changePassword(data) {
  const oldPassword = data.oldPassword;
  const newPassword = data.newPassword;
  
  // Verifikasi password lama (harus admin)
  const authResult = verifyAccess(oldPassword, 'admin');
  if (!authResult.success) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Password lama salah atau Anda bukan admin'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const usersSheet = ss.getSheetByName(SHEET_USERS);
  
  if (!usersSheet) {
    initializeSheets();
    return changePassword(data);
  }
  
  const users = usersSheet.getDataRange().getValues();
  
  // Update password admin
  for (let i = 1; i < users.length; i++) {
    if (users[i][0] === authResult.username && users[i][2] === 'admin') {
      usersSheet.getRange(i + 1, 2).setValue(newPassword);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Password berhasil diubah'
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    message: 'Admin tidak ditemukan'
  })).setMimeType(ContentService.MimeType.JSON);
}

// ========================================================
// FUNGSI GET USERS (UNTUK MANAJEMEN USER)
// ========================================================
function getUsers(data) {
  // Hanya admin yang bisa melihat daftar user
  const authResult = verifyAccess(data.password, 'admin');
  if (!authResult.success) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Akses ditolak'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const usersSheet = ss.getSheetByName(SHEET_USERS);
  
  if (!usersSheet) {
    initializeSheets();
    return getUsers(data);
  }
  
  const users = usersSheet.getDataRange().getValues();
  const userList = [];
  
  for (let i = 1; i < users.length; i++) {
    userList.push({
      username: users[i][0],
      password: users[i][1],
      role: users[i][2] || 'editor'
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    users: userList
  })).setMimeType(ContentService.MimeType.JSON);
}

// ========================================================
// FUNGSI SIMPAN USER (TAMBAH/EDIT)
// ========================================================
function saveUser(data) {
  // Hanya admin yang bisa mengelola user
  const authResult = verifyAccess(data.password, 'admin');
  if (!authResult.success) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Akses ditolak. Hanya Admin yang dapat mengelola user.'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const { username, password, role, oldUsername } = data;
  
  if (!username || !password) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Username dan password harus diisi'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let usersSheet = ss.getSheetByName(SHEET_USERS);
  
  if (!usersSheet) {
    initializeSheets();
    usersSheet = ss.getSheetByName(SHEET_USERS);
  }
  
  const users = usersSheet.getDataRange().getValues();
  
  if (oldUsername) {
    // Edit user
    for (let i = 1; i < users.length; i++) {
      if (users[i][0] === oldUsername) {
        usersSheet.getRange(i + 1, 1).setValue(username);
        usersSheet.getRange(i + 1, 2).setValue(password);
        usersSheet.getRange(i + 1, 3).setValue(role || 'editor');
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          message: 'User berhasil diperbarui'
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
  } else {
    // Cek duplikat
    for (let i = 1; i < users.length; i++) {
      if (users[i][0] === username) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          message: 'Username sudah ada'
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Tambah user baru
    usersSheet.appendRow([username, password, role || 'editor']);
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: oldUsername ? 'User berhasil diperbarui' : 'User berhasil ditambahkan'
  })).setMimeType(ContentService.MimeType.JSON);
}

// ========================================================
// FUNGSI HAPUS USER
// ========================================================
function deleteUser(data) {
  // Hanya admin yang bisa menghapus user
  const authResult = verifyAccess(data.password, 'admin');
  if (!authResult.success) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Akses ditolak. Hanya Admin yang dapat menghapus user.'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const { username } = data;
  
  if (!username) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Username harus diisi'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const usersSheet = ss.getSheetByName(SHEET_USERS);
  
  if (!usersSheet) {
    initializeSheets();
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Data user tidak ditemukan'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const users = usersSheet.getDataRange().getValues();
  
  for (let i = 1; i < users.length; i++) {
    if (users[i][0] === username) {
      if (users[i][2] === 'admin') {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          message: 'Tidak dapat menghapus user admin'
        })).setMimeType(ContentService.MimeType.JSON);
      }
      usersSheet.deleteRow(i + 1);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'User berhasil dihapus'
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    message: 'User tidak ditemukan'
  })).setMimeType(ContentService.MimeType.JSON);
}

// ========================================================
// FUNGSI VERIFIKASI AKSES (HELPER)
// ========================================================
function verifyAccess(password, requiredRole = null) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const usersSheet = ss.getSheetByName(SHEET_USERS);
  
  if (!usersSheet) {
    initializeSheets();
    return verifyAccess(password, requiredRole);
  }
  
  const users = usersSheet.getDataRange().getValues();
  
  for (let i = 1; i < users.length; i++) {
    if (users[i][1] === password) {
      const role = users[i][2] || 'editor';
      if (requiredRole && role !== requiredRole) {
        return { success: false, message: 'Role tidak sesuai' };
      }
      return { success: true, username: users[i][0], role: role };
    }
  }
  
  return { success: false, message: 'Password tidak valid' };
}

// ========================================================
// FUNGSI INISIALISASI SHEETS (DEFAULT)
// ========================================================
function initializeSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Create Users sheet
  let usersSheet = ss.getSheetByName(SHEET_USERS);
  if (!usersSheet) {
    usersSheet = ss.insertSheet(SHEET_USERS);
    usersSheet.appendRow(['Username', 'Password', 'Role']);
    usersSheet.appendRow(['admin', 'admin123', 'admin']);
  }
  
  // Create Settings sheet
  let settingsSheet = ss.getSheetByName(SHEET_SETTINGS);
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet(SHEET_SETTINGS);
    settingsSheet.appendRow(['Setting', 'Value']);
    settingsSheet.appendRow(['youtubeUrl', 'https://www.youtube.com/embed/EAO55pnNsgs']);
  }
  
  // Create Kategori sheet
  let kategoriSheet = ss.getSheetByName(SHEET_KATEGORI);
  if (!kategoriSheet) {
    kategoriSheet = ss.insertSheet(SHEET_KATEGORI);
    const defaultKategori = ['Gembala', 'Officers', 'Departemen & Pelayanan', 'Lainnya'];
    defaultKategori.forEach(kat => {
      kategoriSheet.appendRow([kat]);
    });
  }
  
  // Create Jadwal sheet
  let jadwalSheet = ss.getSheetByName(SHEET_JADWAL);
  if (!jadwalSheet) {
    jadwalSheet = ss.insertSheet(SHEET_JADWAL);
    jadwalSheet.appendRow(['Tanggal', 'DataJadwal', 'LastUpdated']);
  }
  
  // Create Pejabat sheet
  let pejabatSheet = ss.getSheetByName(SHEET_PEJABAT);
  if (!pejabatSheet) {
    pejabatSheet = ss.insertSheet(SHEET_PEJABAT);
    const defaultPejabat = [
      { id: 'gembala', jabatan: "Gembala Jemaat", nama: "Pdt. [Nama Gembala]", wa: "62800000000", img: "https://ui-avatars.com/api/?name=Gembala+Jemaat&background=eff6ff&color=1e3a8a&size=128", kategori: "Gembala" },
      { id: 'ketua', jabatan: "Ketua Jemaat", nama: "Bpk. [Nama Ketua]", wa: "62800000000", img: "https://ui-avatars.com/api/?name=Ketua+Jemaat&background=eff6ff&color=1e3a8a&size=128", kategori: "Officers" }
    ];
    
    const headers = Object.keys(defaultPejabat[0]);
    pejabatSheet.appendRow(headers);
    defaultPejabat.forEach(row => {
      const rowData = headers.map(h => row[h] || '');
      pejabatSheet.appendRow(rowData);
    });
  }
}

// ========================================================
// FUNGSI UNTUK RESET DATA (OPSIONAL)
// ========================================================
function resetAllData() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Hapus semua sheet yang ada
  const sheets = ss.getSheets();
  sheets.forEach(sheet => {
    if (sheet.getName() !== 'Sheet1') {
      ss.deleteSheet(sheet);
    }
  });
  
  // Inisialisasi ulang
  initializeSheets();
  
  Logger.log('Semua data telah direset');
}

// ========================================================
// FUNGSI UNTUK TESTING
// ========================================================
function testConnection() {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Koneksi ke Google Apps Script berhasil!',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}