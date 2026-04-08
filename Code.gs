// =========================================================================
// KONFIGURASI
// =========================================================================
// Ganti dengan ID Google Spreadsheet milik Anda
var SPREADSHEET_ID = "1FbdIMEHbY5PY61kx3SFTLjq2CZUISmeQObuO_qPJ5MM";

// Konfigurasi tabel jadwal
var SCHEDULE_CONFIGS = [
  { sheetName: "Jadwal Rabu", key: "petugas", headers: ["Tanggal", "Pemimpin Acara", "Renungan", "Tempat", "Persembahan Kas", "Lagu Pujian"] },
  { sheetName: "Jadwal SS", key: "sekolahSabat", headers: ["Tanggal", "Pianis", "Presider", "Ayat Inti & Doa Buka", "Berita Misi", "Doa Tutup"] },
  { sheetName: "Jadwal Khotbah", key: "khotbah", headers: ["Tanggal", "Pianis", "Khotbah", "Doa Syafaat", "Presider", "Cerita Anak-anak", "Song Leader", "Lagu Pujian"] },
  { sheetName: "Jadwal Diakon", key: "diakon", headers: ["Tanggal", "Diakon"] },
  { sheetName: "Jadwal Musik", key: "musik", headers: ["Tanggal", "Pianis SS", "Pianis Khotbah"] },
  { sheetName: "Jadwal Perjamuan", key: "perjamuan", headers: ["Tanggal", "Pelayan Perjamuan (L1)", "Pelayan Perjamuan (L2)", "Pelayan Perjamuan (P1)", "Pelayan Perjamuan (P2)"] }
];

// =========================================================================
// INISIALISASI SHEET (otomatis buat jika belum ada)
// =========================================================================
function checkAndInitSheets() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // 1. Sheet Pengaturan
  var sPengaturan = ss.getSheetByName("Pengaturan");
  if (!sPengaturan) {
    sPengaturan = ss.insertSheet("Pengaturan");
    sPengaturan.appendRow(["Konfigurasi", "Nilai"]);
    sPengaturan.appendRow(["PASSWORD", "admin"]);
    sPengaturan.appendRow(["YOUTUBE_URL", "https://www.youtube-nocookie.com/embed?listType=playlist&list=UUz6rQ_5zP0Y0c8V7aKx2jLQ"]);
    sPengaturan.appendRow(["PENGUMUMAN", ""]);
    sPengaturan.appendRow(["KATEGORI_PEJABAT", JSON.stringify(["Gembala", "Officers", "Departemen & Pelayanan", "Lainnya"])]);
    sPengaturan.getRange("A1:B1").setFontWeight("bold");
    sPengaturan.setColumnWidth(1, 150);
    sPengaturan.setColumnWidth(2, 400);
  }
  
  // 2. Sheet Pejabat (dengan kolom kategori)
  var sPejabat = ss.getSheetByName("Pejabat");
  if (!sPejabat) {
    sPejabat = ss.insertSheet("Pejabat");
    sPejabat.appendRow(["ID", "Jabatan", "Nama", "WhatsApp", "Link Foto", "Kategori"]);
    sPejabat.getRange("A1:F1").setFontWeight("bold");
    sPejabat.setFrozenRows(1);
    
    var initialPejabat = [
      ["gembala", "Gembala Jemaat", "Pdt. [Nama Gembala]", "62800000000", "https://ui-avatars.com/api/?name=Gembala+Jemaat&background=eff6ff&color=1e3a8a&size=128", "Gembala"],
      ["ketua", "Ketua Jemaat", "Bpk. [Nama Ketua]", "62800000000", "https://ui-avatars.com/api/?name=Ketua+Jemaat&background=eff6ff&color=1e3a8a&size=128", "Officers"],
      ["sekertaris", "Sekertaris", "Bpk. [Nama Sekertaris]", "62800000000", "https://ui-avatars.com/api/?name=Sekertaris&background=eff6ff&color=1e3a8a&size=128", "Officers"],
      ["bendahara", "Bendahara", "Ibu [Nama Bendahara]", "62800000000", "https://ui-avatars.com/api/?name=Bendahara&background=f0fdf4&color=14532d&size=128", "Officers"],
      ["penginjilan", "Penginjilan", "Bpk. [Nama Penginjilan]", "62800000000", "https://ui-avatars.com/api/?name=Penginjilan+2&background=f0fdf4&color=14532d&size=128", "Departemen & Pelayanan"],
      ["ss", "Sekolah Sabat", "Ibu. [Nama Sekolah Sabat]", "62800000000", "https://ui-avatars.com/api/?name=Sekolah+Sabat&background=fffbeb&color=78350f&size=128", "Departemen & Pelayanan"],
      ["diakon", "Ketua Diakon", "Ibu. [Nama Ketua Diakon]", "62800000000", "https://ui-avatars.com/api/?name=Ketua+Diakon&background=fffbeb&color=78350f&size=128", "Departemen & Pelayanan"],
      ["rumah", "Rumah Tangga", "Sdr. [Nama Rumah Tangga]", "62800000000", "https://ui-avatars.com/api/?name=Rumah+Tangga&background=e0e7ff&color=3730a3&size=128", "Departemen & Pelayanan"],
      ["pemuda", "Pemuda", "Sdr. [Nama Pemuda]", "62800000000", "https://ui-avatars.com/api/?name=Pemuda&background=e0e7ff&color=3730a3&size=128", "Departemen & Pelayanan"],
      ["hotline", "Hotline", "Bpk. [Nama Hotline]", "62800000000", "https://ui-avatars.com/api/?name=Hotline&background=f3f4f6&color=1f2937&size=128", "Lainnya"],
      ["komunikasi", "Komunikasi", "Sdr. [Nama Komunikasi]", "62800000000", "https://ui-avatars.com/api/?name=Kominikasi&background=faf5ff&color=581c87&size=128", "Lainnya"]
    ];
    sPejabat.getRange(2, 1, initialPejabat.length, 6).setValues(initialPejabat);
  }
  
  // 3. Buat semua sheet jadwal jika belum ada
  for (var i = 0; i < SCHEDULE_CONFIGS.length; i++) {
    var conf = SCHEDULE_CONFIGS[i];
    var sheet = ss.getSheetByName(conf.sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(conf.sheetName);
      sheet.appendRow(conf.headers);
      sheet.getRange(1, 1, 1, conf.headers.length).setFontWeight("bold").setBackground("#eef2f6");
      sheet.setFrozenRows(1);
    }
  }
  
  // 4. Sheet Susunan Lagu
  var sSusunan = ss.getSheetByName("Susunan_Lagu");
  if (!sSusunan) {
    sSusunan = ss.insertSheet("Susunan_Lagu");
    sSusunan.appendRow([
      "Tanggal", "SS Lagu Buka", "SS Lagu Tutup", "Khotbah Ayat Bersahutan",
      "Khotbah Lagu Buka", "Pujian 1 Tampil", "Pujian 1 Judul",
      "Pujian 2 Tampil", "Pujian 2 Judul", "Pujian 3 Tampil", "Pujian 3 Judul",
      "Ayat Inti", "Lagu Tutup"
    ]);
    sSusunan.setFrozenRows(1);
  }
  
  // 5. Sheet Warta (jika belum ada)
  var sWarta = ss.getSheetByName("Warta");
  if (!sWarta) {
    sWarta = ss.insertSheet("Warta");
    sWarta.appendRow(["Tanggal", "Judul", "Isi", "URL Gambar"]);
    sWarta.getRange(1, 1, 1, 4).setFontWeight("bold");
  }
  
  return ss;
}

// =========================================================================
// MENANGANI PERMINTAAN GET (mengirim data ke frontend)
// =========================================================================
function doGet(e) {
  var ss = checkAndInitSheets();
  
  // Baca Pengaturan
  var sPengaturan = ss.getSheetByName("Pengaturan");
  var pengData = sPengaturan.getDataRange().getValues();
  var youtubeUrl = "https://www.youtube-nocookie.com/embed?listType=playlist&list=UUz6rQ_5zP0Y0c8V7aKx2jLQ";
  var pengumuman = "";
  var kategoriPejabat = ["Gembala", "Officers", "Departemen & Pelayanan", "Lainnya"];
  
  for (var i = 1; i < pengData.length; i++) {
    var key = pengData[i][0];
    var val = pengData[i][1];
    if (key === "YOUTUBE_URL") youtubeUrl = val.toString();
    if (key === "PENGUMUMAN") pengumuman = val.toString();
    if (key === "KATEGORI_PEJABAT") {
      try { kategoriPejabat = JSON.parse(val); } catch(e) {}
    }
  }
  
  // Baca Pejabat
  var sPejabat = ss.getSheetByName("Pejabat");
  var pData = sPejabat.getDataRange().getValues();
  var dataPejabat = [];
  for (var i = 1; i < pData.length; i++) {
    if (pData[i][0]) {
      dataPejabat.push({
        id: pData[i][0].toString(),
        jabatan: pData[i][1].toString(),
        nama: pData[i][2].toString(),
        wa: pData[i][3].toString().replace(/'/g, ''),
        img: pData[i][4].toString(),
        kategori: pData[i][5] ? pData[i][5].toString() : "Lainnya"
      });
    }
  }
  
  // Baca Jadwal dari semua sheet
  var jadwalDB = {};
  for (var i = 0; i < SCHEDULE_CONFIGS.length; i++) {
    var conf = SCHEDULE_CONFIGS[i];
    var sheet = ss.getSheetByName(conf.sheetName);
    if (!sheet) continue;
    var data = sheet.getDataRange().getValues();
    for (var r = 1; r < data.length; r++) {
      var tglObj = data[r][0];
      if (!tglObj || tglObj === "") continue;
      var dateStr = typeof tglObj === 'object' ? Utilities.formatDate(tglObj, Session.getScriptTimeZone(), "yyyy-MM-dd") : String(tglObj);
      if (!jadwalDB[dateStr]) {
        var isRabu = new Date(dateStr + "T00:00:00").getDay() === 3;
        if (isRabu) {
          jadwalDB[dateStr] = { title: "Ibadah Permintaan Doa (Rabu)", time: "19:30 WIB - selesai", petugas: [] };
        } else {
          jadwalDB[dateStr] = { title: "Ibadah Sabat (Sabtu)", time: "10:00 - 13:00 WIB", sekolahSabatTime: "11:45 - 12:40 WIB", khotbahTime: "10:00 - 11:40 WIB", sekolahSabat: [], khotbah: [], diakon: [], musik: [], perjamuan: [] };
        }
      }
      var taskArray = [];
      for (var c = 1; c < conf.headers.length; c++) {
        taskArray.push({
          tugas: conf.headers[c],
          nama: data[r][c] ? data[r][c].toString() : ""
        });
      }
      jadwalDB[dateStr][conf.key] = taskArray;
    }
  }
  
  // Baca Susunan Lagu
  var sSusunan = ss.getSheetByName("Susunan_Lagu");
  if (sSusunan) {
    var susData = sSusunan.getDataRange().getValues();
    for (var r = 1; r < susData.length; r++) {
      var tglObj = susData[r][0];
      if (!tglObj || tglObj === "") continue;
      var dateStr = typeof tglObj === 'object' ? Utilities.formatDate(tglObj, Session.getScriptTimeZone(), "yyyy-MM-dd") : String(tglObj);
      if (!jadwalDB[dateStr]) {
        var isRabu = new Date(dateStr + "T00:00:00").getDay() === 3;
        if (isRabu) {
          jadwalDB[dateStr] = { title: "Ibadah Permintaan Doa (Rabu)", time: "19:30 WIB - selesai", petugas: [] };
        } else {
          jadwalDB[dateStr] = { title: "Ibadah Sabat (Sabtu)", time: "10:00 - 13:00 WIB", sekolahSabatTime: "11:45 - 12:40 WIB", khotbahTime: "10:00 - 11:40 WIB", sekolahSabat: [], khotbah: [], diakon: [], musik: [], perjamuan: [] };
        }
      }
      jadwalDB[dateStr].susunan = {
        ssLaguBuka: susData[r][1] ? String(susData[r][1]) : "",
        ssLaguTutup: susData[r][2] ? String(susData[r][2]) : "",
        kAyatBersahutan: susData[r][3] ? String(susData[r][3]) : "",
        kLaguBuka: susData[r][4] ? String(susData[r][4]) : "",
        kLaguPujian1_show: susData[r][5] === "YA",
        kLaguPujian1_judul: susData[r][6] ? String(susData[r][6]) : "",
        kLaguPujian2_show: susData[r][7] === "YA",
        kLaguPujian2_judul: susData[r][8] ? String(susData[r][8]) : "",
        kLaguPujian3_show: susData[r][9] === "YA",
        kLaguPujian3_judul: susData[r][10] ? String(susData[r][10]) : "",
        kAyatInti: susData[r][11] ? String(susData[r][11]) : "",
        kLaguTutup: susData[r][12] ? String(susData[r][12]) : ""
      };
    }
  }

  // Baca Warta
  var sWarta = ss.getSheetByName("Warta");
var daftarWarta = [];
if (sWarta) {
  var wartaData = sWarta.getDataRange().getValues();
  for (var i = 1; i < wartaData.length; i++) {
    if (wartaData[i][0]) {
      daftarWarta.push({
        tanggal: wartaData[i][0] instanceof Date ? Utilities.formatDate(wartaData[i][0], Session.getScriptTimeZone(), "yyyy-MM-dd") : String(wartaData[i][0]),
        judul: wartaData[i][1] || "",
        isi: wartaData[i][2] || "",
        gambarUrl: wartaData[i][3] || ""
      });
    }
  }
}

  return ContentService.createTextOutput(JSON.stringify({
    dataPejabat: dataPejabat,
    jadwalDB: jadwalDB,
    youtubeUrl: youtubeUrl,
    pengumuman: pengumuman,
    kategoriPejabat: kategoriPejabat,
    daftarWarta: daftarWarta
  })).setMimeType(ContentService.MimeType.JSON);
}

// =========================================================================
// MENANGANI PERMINTAAN POST (menyimpan data dari frontend)
// =========================================================================
function doPost(e) {
  var ss = checkAndInitSheets();
  var payload = JSON.parse(e.postData.contents);
  var action = payload.action;
  
  var sPengaturan = ss.getSheetByName("Pengaturan");
  var currentPassword = sPengaturan.getRange("B2").getValue().toString();
  
  // Verifikasi password (untuk semua action kecuali verifyPassword dan changePassword)
  if (action !== "verifyPassword" && action !== "changePassword") {
    if (payload.password !== currentPassword) {
      return ContentService.createTextOutput(JSON.stringify({success: false, message: "Akses ditolak, password salah"})).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // 1. Verify password
  if (action === "verifyPassword") {
    var success = (payload.password === currentPassword);
    return ContentService.createTextOutput(JSON.stringify({success: success})).setMimeType(ContentService.MimeType.JSON);
  }
  
  // 2. Change password
  if (action === "changePassword") {
    if (payload.password === currentPassword) {
      sPengaturan.getRange("B2").setValue(payload.newPassword);
      return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService.createTextOutput(JSON.stringify({success: false, message: "Password lama salah"})).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // 3. Save YouTube URL
  if (action === "saveYoutubeUrl") {
    var pengData = sPengaturan.getDataRange().getValues();
    var found = false;
    for (var i = 1; i < pengData.length; i++) {
      if (pengData[i][0] === "YOUTUBE_URL") {
        sPengaturan.getRange(i+1, 2).setValue(payload.youtubeUrl);
        found = true;
        break;
      }
    }
    if (!found) sPengaturan.appendRow(["YOUTUBE_URL", payload.youtubeUrl]);
    return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
  }
  
  // 4. Save Pengumuman
  if (action === "savePengumuman") {
    var pengData = sPengaturan.getDataRange().getValues();
    var found = false;
    for (var i = 1; i < pengData.length; i++) {
      if (pengData[i][0] === "PENGUMUMAN") {
        sPengaturan.getRange(i+1, 2).setValue(payload.pengumuman);
        found = true;
        break;
      }
    }
    if (!found) sPengaturan.appendRow(["PENGUMUMAN", payload.pengumuman]);
    return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
  }
  
  // 5. Save Jadwal
  if (action === "saveJadwal") {
    var tanggal = payload.date;
    var dataJadwal = payload.data;
    
    // Simpan susunan acara jika ada
    if (dataJadwal.susunan) {
      simpanSusunanAcara(ss, tanggal, dataJadwal.susunan);
    }
    
    var targetDateObj = new Date(tanggal + "T00:00:00");
    var isRabu = targetDateObj.getDay() === 3;
    
    for (var i = 0; i < SCHEDULE_CONFIGS.length; i++) {
      var conf = SCHEDULE_CONFIGS[i];
      if (isRabu && conf.key !== "petugas") continue;
      if (!isRabu && conf.key === "petugas") continue;
      
      var sheet = ss.getSheetByName(conf.sheetName);
      if (!sheet) continue;
      
      var tasksFromPayload = dataJadwal[conf.key] || [];
      var rowData = ["'" + tanggal];
      for (var c = 1; c < conf.headers.length; c++) {
        var taskHeader = conf.headers[c];
        var personName = "";
        for (var p = 0; p < tasksFromPayload.length; p++) {
          if (tasksFromPayload[p].tugas === taskHeader) {
            personName = tasksFromPayload[p].nama;
            break;
          }
        }
        rowData.push(personName);
      }
      
      // Cari apakah tanggal sudah ada di sheet
      var sheetData = sheet.getDataRange().getValues();
      var foundRow = -1;
      for (var r = 1; r < sheetData.length; r++) {
        var dStr = typeof sheetData[r][0] === 'object' ? Utilities.formatDate(sheetData[r][0], Session.getScriptTimeZone(), "yyyy-MM-dd") : String(sheetData[r][0]);
        if (dStr === tanggal) {
          foundRow = r+1;
          break;
        }
      }
      
      if (foundRow > -1) {
        sheet.getRange(foundRow, 1, 1, rowData.length).setValues([rowData]);
      } else {
        sheet.appendRow(rowData);
      }
    }
    return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
  }
  
  // 6. Save Data Pejabat (action = "saveDataPejabat")
  if (action === "saveDataPejabat") {
    var sPejabat = ss.getSheetByName("Pejabat");
    // Bersihkan isi (kecuali header)
    if (sPejabat.getLastRow() > 1) {
      sPejabat.getRange(2, 1, sPejabat.getLastRow() - 1, 6).clearContent();
    }
    var newRows = [];
    for (var i = 0; i < payload.dataPejabat.length; i++) {
      var p = payload.dataPejabat[i];
      newRows.push([p.id, p.jabatan, p.nama, "'" + p.wa, p.img, p.kategori || "Lainnya"]);
    }
    if (newRows.length > 0) {
      sPejabat.getRange(2, 1, newRows.length, 6).setValues(newRows);
    }
    
    // Simpan kategori pejabat
    if (payload.kategoriPejabat) {
      var pengData = sPengaturan.getDataRange().getValues();
      var foundKat = false;
      for (var i = 1; i < pengData.length; i++) {
        if (pengData[i][0] === "KATEGORI_PEJABAT") {
          sPengaturan.getRange(i+1, 2).setValue(JSON.stringify(payload.kategoriPejabat));
          foundKat = true;
          break;
        }
      }
      if (!foundKat) sPengaturan.appendRow(["KATEGORI_PEJABAT", JSON.stringify(payload.kategoriPejabat)]);
    }
    
    return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
  }
  
  // 7. Save Warta
  if (action === "saveWarta") {
  var sWarta = ss.getSheetByName("Warta");
  if (!sWarta) {
    sWarta = ss.insertSheet("Warta");
    sWarta.appendRow(["Tanggal", "Judul", "Isi", "URL Gambar"]);
    sWarta.getRange(1,1,1,4).setFontWeight("bold");
  }
  var tanggal = new Date();
  sWarta.appendRow([tanggal, payload.judul, payload.isi, payload.gambarUrl || ""]);
  return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
}
  
  return ContentService.createTextOutput(JSON.stringify({success: false, message: "Aksi tidak dikenal"})).setMimeType(ContentService.MimeType.JSON);
}

// =========================================================================
// FUNGSI BANTU: Simpan Susunan Acara ke sheet "Susunan_Lagu"
// =========================================================================
function simpanSusunanAcara(ss, tanggal, susunan) {
  var sheet = ss.getSheetByName("Susunan_Lagu");
  if (!sheet) return;
  
  var data = sheet.getDataRange().getValues();
  var rowIndex = -1;
  for (var i = 1; i < data.length; i++) {
    var dStr = typeof data[i][0] === 'object' ? Utilities.formatDate(data[i][0], Session.getScriptTimeZone(), "yyyy-MM-dd") : String(data[i][0]);
    if (dStr === tanggal) {
      rowIndex = i+1;
      break;
    }
  }
  
  var rowData = [
    "'" + tanggal,
    susunan.ssLaguBuka || "",
    susunan.ssLaguTutup || "",
    susunan.kAyatBersahutan || "",
    susunan.kLaguBuka || "",
    susunan.kLaguPujian1_show ? "YA" : "TIDAK",
    susunan.kLaguPujian1_judul || "",
    susunan.kLaguPujian2_show ? "YA" : "TIDAK",
    susunan.kLaguPujian2_judul || "",
    susunan.kLaguPujian3_show ? "YA" : "TIDAK",
    susunan.kLaguPujian3_judul || "",
    susunan.kAyatInti || "",
    susunan.kLaguTutup || ""
  ];
  
  if (rowIndex > -1) {
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
}