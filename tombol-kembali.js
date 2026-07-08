// tombol-kembali.js (Versi Final - Hanya Tampil di Halaman Utama + Responsive)
// Untuk repository: 2026-My-Tools

// ---------- FUNGSI TRACKING ----------
function trackUserInfo() {
    const userAgent = navigator.userAgent || '';
    const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent) && !isMobile;
    
    let browser = 'Unknown';
    if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edg') === -1) browser = 'Chrome';
    else if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';
    else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) browser = 'Safari';
    else if (userAgent.indexOf('Edg') > -1) browser = 'Edge';
    else if (userAgent.indexOf('OPR') > -1 || userAgent.indexOf('Opera') > -1) browser = 'Opera';

    let os = 'Unknown';
    if (userAgent.indexOf('Windows NT') > -1) os = 'Windows';
    else if (userAgent.indexOf('Mac OS X') > -1) os = 'macOS';
    else if (userAgent.indexOf('Android') > -1) os = 'Android';
    else if (userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) os = 'iOS';

    let visitorCount = parseInt(localStorage.getItem('visitorCount') || '0', 10);
    visitorCount += 1;
    localStorage.setItem('visitorCount', visitorCount);

    return {
        device: isTablet ? 'Tablet' : (isMobile ? 'Mobile' : 'Desktop'),
        browser: browser,
        os: os,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        visitTime: new Date().toISOString(),
        estimatedVisitorCount: visitorCount,
        url: window.location.href,
        userAgent: userAgent
    };
}

// ---------- FUNGSI MENAMPILKAN LAPORAN (toggle panel) ----------
function tampilkanLaporan() {
    const data = trackUserInfo();

    let panel = document.getElementById('panelLaporan');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'panelLaporan';
        panel.style.cssText = `
            position: fixed;
            bottom: 150px;
            right: 20px;
            background: #1e1e1e;
            color: #d4d4d4;
            padding: 20px;
            border-radius: 10px;
            font-family: 'Segoe UI', monospace;
            font-size: 14px;
            max-width: 400px;
            max-height: 70vh;
            overflow-y: auto;
            z-index: 9998;
            border: 1px solid #444;
            box-shadow: 0 8px 24px rgba(0,0,0,0.6);
            display: none;
        `;
        document.body.appendChild(panel);
    }

    // Toggle tampilan
    if (panel.style.display === 'block') {
        panel.style.display = 'none';
        return;
    }

    // Format laporan (markdown sederhana ke HTML)
    const md = `
# 📊 Laporan Tracking Pengunjung
**Waktu:** ${new Date().toLocaleString('id-ID')}

## 🖥️ Informasi Perangkat & Browser
| Properti | Nilai |
|----------|-------|
| Perangkat | ${data.device} |
| Browser | ${data.browser} |
| OS | ${data.os} |
| Resolusi Layar | ${data.screenWidth} x ${data.screenHeight} px |
| Halaman Saat Ini | ${data.url} |
| Total Kunjungan (local) | ${data.estimatedVisitorCount} |

> *Data dikumpulkan secara lokal di perangkat Anda.*
    `;

    let html = md
        .replace(/^# (.+)$/gm, '<h1 style="color:#58a6ff;border-bottom:1px solid #333;padding-bottom:8px;">$1</h1>')
        .replace(/^## (.+)$/gm, '<h2 style="color:#79c0ff;margin-top:16px;">$1</h2>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/^> (.+)$/gm, '<blockquote style="border-left:4px solid #58a6ff;padding-left:12px;color:#8b949e;margin:12px 0;">$1</blockquote>')
        .replace(/^\|(.+)\|$/gm, (match) => {
            const cells = match.split('|').filter(c => c.trim() !== '');
            if (cells.length === 0) return '';
            if (cells.every(c => /^-+$/.test(c.trim()))) return '';
            return '<tr>' + cells.map(c => `<td style="padding:6px 12px;border:1px solid #444;">${c.trim()}</td>`).join('') + '</tr>';
        })
        .replace(/(<tr>.*<\/tr>)/gs, (match) => {
            return `<table style="width:100%;border-collapse:collapse;margin:10px 0;">${match}</table>`;
        })
        .replace(/\n/g, '<br>');

    panel.innerHTML = html;
    panel.style.display = 'block';
}

// ---------- FUNGSI MEMBUAT TOMBOL KEMBALI (HANYA UNTUK NON-INDEX) ----------
function buatTombolKembali() {
    const tombol = document.createElement('button');
    tombol.textContent = '🏠 Home';
    tombol.id = 'tombolKembali';
    tombol.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 24px;
        background: #0366d6;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        cursor: pointer;
        z-index: 9999;
        transition: all 0.3s ease;
    `;

    // Hover efek (desktop)
    tombol.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.backgroundColor = '#024bb3';
    });
    tombol.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.backgroundColor = '#0366d6';
    });

    // Aksi kembali ke halaman utama repo
    tombol.addEventListener('click', function() {
        console.log('🖱️ Klik kembali - data:', trackUserInfo());
        const seg = window.location.pathname.split('/').filter(p => p);
        // Untuk repository 2026-My-Tools
        if (seg.length === 0 || seg[0] === '2026-My-Tools') {
            window.location.href = '/2026-My-Tools/';
        } else {
            window.location.href = '../'.repeat(seg.length);
        }
    });

    document.body.appendChild(tombol);
}

// ---------- FUNGSI MEMBUAT TOMBOL LAPORAN (HANYA UNTUK INDEX) ----------
function buatTombolLaporan() {
    const tombol = document.createElement('button');
    tombol.textContent = '📊 Lihat Laporan';
    tombol.id = 'tombolLaporan';
    tombol.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 24px;
        background: #28a745;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        cursor: pointer;
        z-index: 9999;
        transition: all 0.3s ease;
    `;

    tombol.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.backgroundColor = '#218838';
    });
    tombol.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.backgroundColor = '#28a745';
    });

    tombol.addEventListener('click', tampilkanLaporan);

    document.body.appendChild(tombol);
}

// ---------- TAMBAHKAN CSS RESPONSIVE UNTUK KEDUA TOMBOL ----------
function tambahkanCSSResponsive() {
    const style = document.createElement('style');
    style.textContent = `
        /* Untuk layar kecil (mobile) */
        @media (max-width: 480px) {
            #tombolKembali, #tombolLaporan {
                bottom: 15px !important;
                right: 15px !important;
                padding: 8px 14px !important;
                font-size: 12px !important;
                border-radius: 6px !important;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
            }
        }
        /* Tablet */
        @media (min-width: 481px) and (max-width: 768px) {
            #tombolKembali, #tombolLaporan {
                bottom: 20px !important;
                right: 20px !important;
                padding: 10px 18px !important;
                font-size: 14px !important;
            }
        }
        /* Jika layar sangat kecil (handphone lipat) */
        @media (max-width: 360px) {
            #tombolKembali, #tombolLaporan {
                bottom: 10px !important;
                right: 10px !important;
                padding: 6px 10px !important;
                font-size: 10px !important;
                border-radius: 4px !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// ---------- FUNGSI UTAMA (MENENTUKAN TOMBOL MANA YANG MUNCUL) ----------
function init() {
    const currentPath = window.location.pathname;
    const isIndexPage = currentPath === '/' ||
                        currentPath === '/index.html' ||
                        currentPath === '/2026-My-Tools/' ||
                        currentPath === '/2026-My-Tools/index.html';

    // Tambahkan CSS responsive (sekali saja)
    tambahkanCSSResponsive();

    if (isIndexPage) {
        // Halaman utama → tampilkan tombol laporan saja
        console.log('✅ Halaman utama (2026-My-Tools): menampilkan tombol laporan');
        buatTombolLaporan();
        // (Tombol kembali tidak dibuat)
    } else {
        // Halaman lain → tampilkan tombol kembali saja
        console.log('✅ Halaman non-index: menampilkan tombol kembali');
        buatTombolKembali();
        // (Tombol laporan tidak dibuat)
    }
}

// Jalankan saat DOM siap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
