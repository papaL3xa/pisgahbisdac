// =========================================================================
// KONFIGURASI TABEL JADWAL
// Menyimpan peta antara nama Tab di Sheets dengan format data di Web App
// =========================================================================
var SCHEDULE_CONFIGS = [
  { sheetName: "Jadwal Rabu", key: "petugas", headers: ["Tanggal", "Pemimpin Acara", "Renungan", "Doa Syafaat", "Diakon"] },
  { sheetName: "Jadwal SS", key: "sekolahSabat", headers: ["Tanggal", "Pianist", "Pembawa Acara", "Ayat Inti & Doa Buka", "Berita Misi", "Pelayanan Perorangan"] },
  { sheetName: "Jadwal Khotbah", key: "khotbah", headers: ["Tanggal", "Khotbah", "Pendamping 1", "Pendamping 2", "Cerita Anak-anak", "Song Leader", "Lagu Pujian"] },
  { sheetName: "Jadwal Diakon", key: "diakon", headers: ["Tanggal", "Diakon 1", "Diakon 2", "Diakones 1", "Diakones 2"] },
  { sheetName: "Jadwal Musik", key: "musik", headers: ["Tanggal", "Pianis", "Keyboardis", "Gitaris", "Bassist", "Saxophonist", "Violinist"] },
  { sheetName: "Jadwal Perjamuan", key: "perjamuan", headers: [
    "Tanggal",
    "P. Roti & Anggur 1", "P. Roti & Anggur 2", "P. Roti & Anggur 3", "P. Roti & Anggur 4", "P. Roti & Anggur 5",
    "P. Basuh Kaki 1", "P. Basuh Kaki 2", "P. Basuh Kaki 3",
    "Pelayan Basuh Kaki 1", "Pelayan Basuh Kaki 2", "Pelayan Basuh Kaki 3",
    "Pelayan Perjamuan (L1)", "Pelayan Perjamuan (L2)", "Pelayan Perjamuan (P1)", "Pelayan Perjamuan (P2)",
    "Cuci Baskom 1", "Cuci Baskom 2", "Cuci Baskom 3", "Cuci Baskom 4",
    "Cuci Alat Perjamuan"
  ]}
];

// =========================================================================
// FUNGSI INISIALISASI: Membuat format tabel otomatis jika belum ada
// =========================================================================
function checkAndInitSheets() {
  // Mengarahkan database langsung ke ID Google Sheet spesifik milikmu
  var ss = SpreadsheetApp.openById("1PKgBirWyy3HFtfmWJc1P2jkN5ZaxwMWraApductXMn0");
  
  // 1. Sheet Pengaturan
  var sPengaturan = ss.getSheetByName("Pengaturan");
  if (!sPengaturan) {
    sPengaturan = ss.insertSheet("Pengaturan");
    sPengaturan.appendRow(["Konfigurasi", "Nilai"]);
    sPengaturan.appendRow(["PASSWORD", "admin954"]);
    sPengaturan.appendRow(["YOUTUBE_URL", "https://www.youtube-nocookie.com/embed?listType=playlist&list=UUz6rQ_5zP0Y0c8V7aKx2jLQ"]);
    sPengaturan.getRange("A1:B1").setFontWeight("bold");
    sPengaturan.setColumnWidth(1, 150);
    sPengaturan.setColumnWidth(2, 400);
  }
  
  // 2. Sheet Pejabat
  var sPejabat = ss.getSheetByName("Pejabat");
  if (!sPejabat) {
    sPejabat = ss.insertSheet("Pejabat");
    sPejabat.appendRow(["ID", "Jabatan", "Nama", "WhatsApp", "Link Foto"]);
    sPejabat.getRange("A1:E1").setFontWeight("bold");
    sPejabat.setFrozenRows(1);
    
    var initialPejabat = [
      ["gembala", "Gembala Jemaat", "Pdt. [Nama Gembala]", "62800000000", "https://ui-avatars.com/api/?name=Gembala+Jemaat&background=eff6ff&color=1e3a8a&size=128"],
      ["ketua1", "Ketua Jemaat 1", "Bpk. [Nama Ketua 1]", "62800000000", "https://ui-avatars.com/api/?name=Ketua+1&background=eff6ff&color=1e3a8a&size=128"],
      ["ketua2", "Ketua Jemaat 2", "Bpk. [Nama Ketua 2]", "62800000000", "https://ui-avatars.com/api/?name=Ketua+2&background=eff6ff&color=1e3a8a&size=128"],
      ["sekretaris1", "Sekretaris 1", "Ibu [Nama Sekretaris 1]", "62800000000", "https://ui-avatars.com/api/?name=Sekretaris+1&background=f0fdf4&color=14532d&size=128"],
      ["sekretaris2", "Sekretaris 2", "Bpk. [Nama Sekretaris 2]", "62800000000", "https://ui-avatars.com/api/?name=Sekretaris+2&background=f0fdf4&color=14532d&size=128"],
      ["bendahara1", "Bendahara 1", "Ibu Ari Pahlawani", "62800000000", "https://ui-avatars.com/api/?name=Ari+Pahlawani&background=fffbeb&color=78350f&size=128"],
      ["bendahara2", "Bendahara 2", "Ibu Kasfia Naibaho", "62800000000", "https://ui-avatars.com/api/?name=Kasfia+Naibaho&background=fffbeb&color=78350f&size=128"],
      ["multimedia", "Multimedia", "Sdr. [Nama Multimedia]", "62800000000", "https://ui-avatars.com/api/?name=Multimedia&background=e0e7ff&color=3730a3&size=128"],
      ["sound_system", "Sound System", "Sdr. [Nama Sound System]", "62800000000", "https://ui-avatars.com/api/?name=Sound+System&background=e0e7ff&color=3730a3&size=128"],
      ["diakon", "Ketua Diakon & Diakones", "Bpk. [Nama Ketua Diakon]", "62800000000", "https://ui-avatars.com/api/?name=Diakon+Diakones&background=f3f4f6&color=1f2937&size=128"],
      ["pemuda", "Ketua Pemuda", "Sdr. [Nama Ketua Pemuda]", "62800000000", "https://ui-avatars.com/api/?name=Ketua+Pemuda&background=faf5ff&color=581c87&size=128"]
    ];
    sPejabat.getRange(2, 1, initialPejabat.length, 5).setValues(initialPejabat);
  }
  
  // 3. Loop untuk membuat semua Tab Jadwal jika belum ada
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

  // Jika Sheet JSON lama bernama "Jadwal" masih ada, biarkan saja (jangan dihapus otomatis demi keamanan), 
  // admin bisa menghapusnya secara manual nanti di Google Sheets.
  
  return ss;
}

// =========================================================================
// MENGAMBIL DATA: Membaca tabel dan mengubahnya jadi objek JSON ke Web
// =========================================================================
function doGet(e) {
  var ss = checkAndInitSheets();
  
  // --- Baca Pengaturan ---
  var sPengaturan = ss.getSheetByName("Pengaturan");
  var pengData = sPengaturan.getDataRange().getValues();
  var youtubeUrl = "https://www.youtube-nocookie.com/embed?listType=playlist&list=UUz6rQ_5zP0Y0c8V7aKx2jLQ";
  for (var i = 1; i < pengData.length; i++) {
    if (pengData[i][0] === "YOUTUBE_URL") youtubeUrl = pengData[i][1].toString();
  }
  
  // --- Baca Data Pejabat ---
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
        img: pData[i][4].toString()
      });
    }
  }
  
  // --- Baca Data Jadwal dari Berbagai Tab ---
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
      
      // Setup objek default untuk hari ini jika belum ada
      if (!jadwalDB[dateStr]) {
        var isRabu = new Date(dateStr + "T00:00:00").getDay() === 3;
        if (isRabu) {
          jadwalDB[dateStr] = { title: "Ibadah Permintaan Doa (Rabu)", time: "19:00 WIB - selesai", petugas: [] };
        } else {
          jadwalDB[dateStr] = { title: "Ibadah Sabat (Sabtu)", time: "09:00 - 12:00 WIB", sekolahSabatTime: "09:00 - 10:30 WIB", khotbahTime: "10:30 - 12:00 WIB", sekolahSabat: [], khotbah: [], diakon: [], musik: [], perjamuan: [] };
        }
      }
      
      // Ambil nilai setiap kolom dan hubungkan kembali dengan nama tugasnya
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
  
  return ContentService.createTextOutput(JSON.stringify({
    dataPejabat: dataPejabat,
    jadwalDB: jadwalDB,
    youtubeUrl: youtubeUrl
  })).setMimeType(ContentService.MimeType.JSON);
}

// =========================================================================
// MENYIMPAN DATA: Menerima JSON dari Web dan menuliskannya di Tabel Sheets
// =========================================================================
function doPost(e) {
  var ss = checkAndInitSheets();
  var payload = JSON.parse(e.postData.contents);
  var action = payload.action;
  
  var sPengaturan = ss.getSheetByName("Pengaturan");
  var currentPassword = sPengaturan.getRange("B2").getValue().toString();
  
  // --- Aksi: Verifikasi Login ---
  if (action === "verifyPassword") {
    if (payload.password === currentPassword) {
      return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService.createTextOutput(JSON.stringify({success: false, message: "Password salah"})).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // --- Aksi: Ganti Password ---
  if (action === "changePassword") {
    if (payload.oldPassword === currentPassword) {
      sPengaturan.getRange("B2").setValue(payload.newPassword);
      return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService.createTextOutput(JSON.stringify({success: false, message: "Password lama salah"})).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // --- Aksi: Simpan URL YouTube ---
  if (action === "saveYoutubeUrl") {
    if (payload.password !== currentPassword) { return ContentService.createTextOutput(JSON.stringify({success: false, message: "Akses Ditolak"})).setMimeType(ContentService.MimeType.JSON); }
    
    var pengData = sPengaturan.getDataRange().getValues();
    var found = false;
    for (var i = 1; i < pengData.length; i++) {
      if (pengData[i][0] === "YOUTUBE_URL") {
        sPengaturan.getRange(i + 1, 2).setValue(payload.url);
        found = true;
        break;
      }
    }
    if (!found) { sPengaturan.appendRow(["YOUTUBE_URL", payload.url]); }
    
    return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
  }
  
  // --- Aksi: Simpan Jadwal (Memisahkan data ke tab yang tepat) ---
  if (action === "saveJadwal") {
    if (payload.password !== currentPassword) { return ContentService.createTextOutput(JSON.stringify({success: false, message: "Akses Ditolak"})).setMimeType(ContentService.MimeType.JSON); }
    
    // PERBAIKAN: Menggunakan 'payload' (karena variabelnya bernama payload di baris 150)
    // dan menyertakan 'ss' ke dalam fungsi
    if (payload.data && payload.data.susunan) {
      simpanSusunanAcaraKeTab(ss, payload.tanggal, payload.data.susunan);
    }

    var targetDateObj = new Date(payload.tanggal + "T00:00:00");
    var isRabu = targetDateObj.getDay() === 3;
    
    // Loop melalui semua konfigurasi tab
    for (var i = 0; i < SCHEDULE_CONFIGS.length; i++) {
      var conf = SCHEDULE_CONFIGS[i];
      
      // Skip tab yang tidak sesuai harinya (Rabu hanya update 'petugas', Sabat update yang lain)
      if (isRabu && conf.key !== "petugas") continue;
      if (!isRabu && conf.key === "petugas") continue;
      
      var sheet = ss.getSheetByName(conf.sheetName);
      if (!sheet) continue;
      
      // Ambil array tugas dari payload frontend, jika tidak ada (kosong) jadikan array kosong
      var tasksFromPayload = payload.data[conf.key] || [];
      
      // Siapkan baris data baru sesuai urutan header kolom
      var rowDataToSave = ["'" + payload.tanggal];
      
      // Mulai dari indeks 1 karena indeks 0 adalah Tanggal
      for (var c = 1; c < conf.headers.length; c++) {
        var taskHeader = conf.headers[c];
        var personName = "";
        
        // Cari nama petugas berdasarkan nama tugasnya di array payload
        for (var p = 0; p < tasksFromPayload.length; p++) {
          if (tasksFromPayload[p].tugas === taskHeader) {
            personName = tasksFromPayload[p].nama;
            break;
          }
        }
        rowDataToSave.push(personName);
      }
      
      // Cari apakah tanggal ini sudah ada di dalam Sheet (untuk Update)
      var sheetData = sheet.getDataRange().getValues();
      var foundRow = -1;
      for (var r = 1; r < sheetData.length; r++) {
        var dStr = typeof sheetData[r][0] === 'object' ? Utilities.formatDate(sheetData[r][0], Session.getScriptTimeZone(), "yyyy-MM-dd") : String(sheetData[r][0]);
        if (dStr === payload.tanggal) {
          foundRow = r + 1; // Ditambah 1 karena array mulai dari 0, baris sheet mulai dari 1
          break;
        }
      }
      
      // Jika ketemu tanggalnya, timpa barisnya. Jika belum ada, append baris baru.
      if (foundRow > -1) {
        sheet.getRange(foundRow, 1, 1, rowDataToSave.length).setValues([rowDataToSave]);
      } else {
        sheet.appendRow(rowDataToSave);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
  }
  
  // --- Aksi: Simpan Pejabat ---
  if (action === "savePejabat") {
    if (payload.password !== currentPassword) { return ContentService.createTextOutput(JSON.stringify({success: false, message: "Akses Ditolak"})).setMimeType(ContentService.MimeType.JSON); }
    
    var sPejabat = ss.getSheetByName("Pejabat");
    
    // Bersihkan isi sheet Pejabat kecuali Header
    if (sPejabat.getLastRow() > 1) {
      sPejabat.getRange(2, 1, sPejabat.getLastRow() - 1, 5).clearContent();
    }
    
    var newRows = [];
    for (var i = 0; i < payload.data.length; i++) {
      var p = payload.data[i];
      newRows.push([p.id, p.jabatan, p.nama, "'" + p.wa, p.img]);
    }
    
    if (newRows.length > 0) {
      sPejabat.getRange(2, 1, newRows.length, 5).setValues(newRows);
    }
    
    return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({success: false, message: "Aksi tidak dikenali"})).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Fungsi untuk menyimpan atau memperbarui data Susunan Acara ke tab terpisah
 * PERBAIKAN: Menambahkan parameter `ss` agar fungsi ini memakai koneksi spreadsheet yang sama
 */
function simpanSusunanAcaraKeTab(ss, tanggal, susunan) {
  var sheetName = "Susunan_Lagu";
  var sheet = ss.getSheetByName(sheetName);
  
  // Jika tab "Susunan_Lagu" belum ada, buat otomatis beserta Header kolomnya
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow([
      "Tanggal", 
      "SS Lagu Buka", 
      "SS Lagu Tutup", 
      "Khotbah Ayat Bersahutan", 
      "Khotbah Lagu Buka", 
      "Pujian 1 Tampil", 
      "Pujian 1 Judul", 
      "Pujian 2 Tampil", 
      "Pujian 2 Judul", 
      "Pujian 3 Tampil", 
      "Pujian 3 Judul", 
      "Ayat Inti", 
      "Lagu Tutup"
    ]);
    // Bekukan baris pertama agar rapi saat di-scroll
    sheet.setFrozenRows(1);
  }
  
  var data = sheet.getDataRange().getValues();
  var rowIndex = -1;
  
  // Cek apakah tanggal ini sudah ada di database
  for (var i = 1; i < data.length; i++) {
    var rowDate = typeof data[i][0] === 'object' ? Utilities.formatDate(data[i][0], Session.getScriptTimeZone(), "yyyy-MM-dd") : String(data[i][0]);
    if (rowDate === tanggal) {
      rowIndex = i + 1; // +1 karena index array dari 0, sedangkan baris sheet dari 1
      break;
    }
  }
  
  // Susun data per kolom yang akan dimasukkan ke spreadsheet
  var rowData = [
    "'" + tanggal, // Gunakan tanda kutip agar diformat sebagai text/string murni di Sheets
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
  
  // Jika tanggal sudah ada, timpa (update) baris tersebut.
  // Jika belum ada, tambahkan baris baru di bawah.
  if (rowIndex > -1) {
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
}