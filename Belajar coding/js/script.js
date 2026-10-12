// === HALAMAN LOGIN ===
var formLogin = document.getElementById('formLoginUtama');

if (formLogin) {
    formLogin.addEventListener('submit', function (e) {
        e.preventDefault();

        // Pengecekan ekstra untuk memastikan file data.js terbaca
        if (typeof dataPengguna === 'undefined') {
            alert("File data.js belum terbaca! Pastikan posisinya di dalam folder js.");
            return;
        }

        var emailInput = document.getElementById('inputEmail').value.trim();
        var passwordInput = document.getElementById('inputPassword').value.trim();
        var user = null;

        for (var i = 0; i < dataPengguna.length; i++) {
            if (dataPengguna[i].email === emailInput && dataPengguna[i].password === passwordInput) {
                user = dataPengguna[i];
                break;
            }
        }

        if (user) {
            localStorage.setItem('namaUser', user.nama);
            alert("Login Berhasil! Selamat datang, " + user.nama);
            window.location.href = 'dashboard.html';
        } else {
            alert('email/password yang anda masukkan salah');
        }
    });
}

// === MODAL BOX (LUPA PASSWORD & DAFTAR) ===
var btnLupaPass = document.getElementById('btnLupaPass');
var modalLupaPass = document.getElementById('modalLupaPassword');
var closeLupaPass = document.getElementById('closeLupaPass');

if (btnLupaPass && modalLupaPass) {
    btnLupaPass.addEventListener('click', function() { modalLupaPass.style.display = 'flex'; });
    closeLupaPass.addEventListener('click', function() { modalLupaPass.style.display = 'none'; });
}

var btnDaftar = document.getElementById('btnDaftar');
var modalDaftar = document.getElementById('modalDaftarAkun');
var closeDaftar = document.getElementById('closeDaftar');

if (btnDaftar && modalDaftar) {
    btnDaftar.addEventListener('click', function() { modalDaftar.style.display = 'flex'; });
    closeDaftar.addEventListener('click', function() { modalDaftar.style.display = 'none'; });
}

// Menutup modal jika klik layar luar
window.addEventListener('click', function(e) {
    if (e.target === modalLupaPass) modalLupaPass.style.display = 'none';
    if (e.target === modalDaftar) modalDaftar.style.display = 'none';
});

// === HALAMAN DASHBOARD ===
var greeting = document.getElementById('greeting');
if (greeting) {
    var namaUser = localStorage.getItem('namaUser');
    var hour = new Date().getHours();
    var timeOfDay = 'Selamat Malam';
    
    if (hour < 11) timeOfDay = 'Selamat Pagi';
    else if (hour < 15) timeOfDay = 'Selamat Siang';
    else if (hour < 19) timeOfDay = 'Selamat Sore';

    greeting.textContent = namaUser ? timeOfDay + ", " + namaUser + "! \nSelamat datang di Portal SITTA UT" : timeOfDay + "!";
}

var logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) { 
    logoutBtn.addEventListener('click', function() {
        if(confirm("Yakin ingin keluar dari sistem?")) {
            localStorage.removeItem('namaUser');
            window.location.href = 'index.html';
        }
    });
}

// === HALAMAN TRACKING PENGIRIMAN ==
var findBtn = document.getElementById('findBtn');
if (findBtn) {
    findBtn.addEventListener('click', function() {
        var doNumber = document.getElementById('inputDO').value.trim();
        var resultContainer = document.getElementById('trackingResult');

        if (!doNumber) {
            alert('Harap ketik nomor DO terlebih dahulu.');
            return;
        }

        var data = (typeof dataTracking !== 'undefined') ? dataTracking[doNumber] : null;
        if (!data) {
            alert("Sistem tidak menemukan resi: " + doNumber);
            return;
        }

        var perjalananHTML = '';
        for (var i = 0; i < data.perjalanan.length; i++) {
            perjalananHTML += `
                <li>
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <span class="time">${data.perjalanan[i].waktu}</span>
                        <p class="desc">${data.perjalanan[i].keterangan}</p>
                    </div>
                </li>`;
        }

        // --- BAGIAN YANG DIREVISI: Menambahkan Jenis Paket & Total Pembayaran ---
        resultContainer.innerHTML = `
        <div class="status-card">
            <h3 style="color: #0A3A82; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">
                Rincian Pemesanan - ${data.nomorDO}
            </h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px;">
                <div><p style="font-size: 13px; color: #7F8C8D;">Penerima</p><p style="font-weight: 600;">${data.nama}</p></div>
                <div><p style="font-size: 13px; color: #7F8C8D;">Status Terkini</p><p><span class="status-badge">${data.status}</span></p></div>
                <div><p style="font-size: 13px; color: #7F8C8D;">Layanan Pengiriman</p><p>${data.ekspedisi}</p></div>
                <div><p style="font-size: 13px; color: #7F8C8D;">Tanggal Kirim</p><p>${data.tanggalKirim}</p></div>
                
                <!-- Data Tambahan Sesuai Permintaan Soal -->
                <div><p style="font-size: 13px; color: #7F8C8D;">Jenis/Kode Paket</p><p>${data.paket}</p></div>
                <div><p style="font-size: 13px; color: #7F8C8D;">Total Pembayaran</p><p style="color: #27ae60; font-weight: bold; font-size: 16px;">${data.total}</p></div>
            </div>

            <h4 style="color: #0A3A82; margin-bottom: 15px;">Aktivitas Perjalanan</h4>
            <ul class="modern-timeline">
                ${perjalananHTML}
            </ul>
        </div>`;
    });
}

// === HALAMAN STOK BAHAN AJAR ===
var tbody = document.querySelector('#tabelStok tbody');

if (typeof dataBahanAjar !== 'undefined' && tbody) {
    
    // ---------------------------------------------------------
    // BAGIAN 1: Menampilkan Tabel dan Foto Buku
    // ---------------------------------------------------------
    function renderTable() {
        tbody.innerHTML = '';
        
        for (var i = 0; i < dataBahanAjar.length; i++) {
            var item = dataBahanAjar[i];
            var tr = document.createElement('tr');
            
            // Kode modifikasi untuk menampilkan foto buku langsung di tabel
            tr.innerHTML = `
                <td style="vertical-align: middle;"><strong>${item.kodeBarang}</strong></td>
                <td style="vertical-align: middle;">${item.namaBarang}</td>
                <td style="vertical-align: middle;">
                    <span style="background: #E3F2FD; color:#0A3A82; padding: 4px 10px; border-radius: 12px; font-weight:600;">
                        ${item.stok}
                    </span>
                </td>
                <td style="vertical-align: middle;">${item.kodeLokasi}</td>
                <td style="text-align: center; vertical-align: middle;">
                    <!-- Tag IMG untuk menampilkan foto buku -->
                    <img src="${item.cover}" alt="Sampul ${item.namaBarang}" onerror="this.src='img/ut.png'" style="width: 70px; height: 100px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.15); display: block; margin: 0 auto 8px auto;">
                    
                    <a href="${item.cover}" target="_blank" class="action-link" style="font-size: 12px;">
                        <i class="fa-solid fa-expand"></i> Perbesar
                    </a>
                </td>
            `;
            tbody.appendChild(tr);
        }
    }
    
    // Memanggil fungsi agar tabel langsung muncul saat halaman dibuka
    renderTable(); 


    // ---------------------------------------------------------
    // BAGIAN 2: Mencegah Loading (Muter) & Registrasi Bahan Ajar Baru
    // ---------------------------------------------------------
    var formTambah = document.getElementById('formTambah');
    
    if (formTambah) {
        formTambah.addEventListener('submit', function(e) {
            e.preventDefault(); // KUNCI PENTING: Mencegah halaman me-reload

            // Mengambil nilai dari kolom input form
            var kodeBarang = document.getElementById('kode').value.trim();
            var namaBarang = document.getElementById('nama').value.trim();
            var stok = parseInt(document.getElementById('stok').value);
            var kodeLokasi = document.getElementById('lokasi').value.trim();
            
            // Logika gambar jika user mengunggah foto
            var coverPath = 'img/ut.png'; 
            var fileInput = document.getElementById('cover');
            
            if (fileInput && fileInput.files.length > 0) {
                // Mengambil nama file gambar yang dipilih dari komputer
                coverPath = 'img/' + fileInput.files[0].name; 
            }

            // Memasukkan data baru ke dalam sistem/tabel
            dataBahanAjar.push({
                kodeLokasi: kodeLokasi,
                kodeBarang: kodeBarang,
                namaBarang: namaBarang,
                jenisBarang: "BMP",
                edisi: "-",
                stok: stok,
                cover: coverPath
            });

            // Perbarui tampilan tabel dengan data baru
            renderTable(); 
            
            // Munculkan notifikasi dan kosongkan isian form
            alert('Sukses! Bahan Ajar Baru Berhasil Ditambahkan.');
            e.target.reset(); 
        });
    }
}