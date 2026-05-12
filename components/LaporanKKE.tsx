'use client';
import { useEffect, useRef, useState } from 'react';
import './LaporanKKE.css';

export default function LaporanKKE({ onSaveSuccess }: { onSaveSuccess?: () => void }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;

        // Generate unique storage key for each input based on its position and type
        function generateStorageKey(element: HTMLInputElement | HTMLTextAreaElement, index: number) {
            const className = element.className || element.type || 'input';
            const parentRow = element.closest('tr');
            let rowIdentifier = '';

            if (parentRow) {
                const questionNumber = parentRow.querySelector('.question-number');
                if (questionNumber) {
                    rowIdentifier = questionNumber.textContent?.trim() || '';
                }
            }

            return `${className}_${rowIdentifier}_${index}`;
        }

        // Save and load data for all inputs
        function setupInputStorage(inputs: NodeListOf<HTMLInputElement | HTMLTextAreaElement>) {
            inputs.forEach((input, index) => {
                const storageKey = generateStorageKey(input, index);

                // Load saved value
                const savedValue = localStorage.getItem(storageKey);
                if (savedValue) {
                    input.value = savedValue;
                }

                // Save on input
                const handler = function() {
                    localStorage.setItem(storageKey, input.value);
                };
                input.addEventListener('input', handler);
                (input as any)._handler = handler;
            });
        }

        // Setup storage for all text inputs
        const textInputs = container.querySelectorAll<HTMLInputElement>('input[type="text"], input[type="tel"], input[type="number"], input[type="date"]');
        setupInputStorage(textInputs);

        // Setup storage for all textareas and selects
        const textareas = container.querySelectorAll<HTMLTextAreaElement | HTMLSelectElement>('textarea, select');
        setupInputStorage(textareas as any);

        // Setup storage for radio buttons
        const radioGroups: Record<string, HTMLInputElement[]> = {};
        container.querySelectorAll<HTMLInputElement>('input[type="radio"]').forEach(radio => {
            const name = radio.name;
            if (!radioGroups[name]) {
                radioGroups[name] = [];
            }
            radioGroups[name].push(radio);
        });

        // Load and save radio button values
        Object.keys(radioGroups).forEach(groupName => {
            const storageKey = `radio_${groupName}`;
            const savedValue = localStorage.getItem(storageKey);

            // Load saved value
            if (savedValue) {
                radioGroups[groupName].forEach(radio => {
                    if (radio.value === savedValue) {
                        radio.checked = true;
                    }
                });
            }

            // Save on change
            radioGroups[groupName].forEach(radio => {
                const handler = function() {
                    if (radio.checked) {
                        localStorage.setItem(storageKey, radio.value);
                    }
                };
                radio.addEventListener('change', handler);
                (radio as any)._handler = handler;
            });
        });

        return () => {
            textInputs.forEach(input => {
                if ((input as any)._handler) {
                    input.removeEventListener('input', (input as any)._handler);
                }
            });
            textareas.forEach(input => {
                if ((input as any)._handler) {
                    input.removeEventListener('input', (input as any)._handler);
                }
            });
                Object.keys(radioGroups).forEach(groupName => {
                radioGroups[groupName].forEach(radio => {
                    if ((radio as any)._handler) {
                        radio.removeEventListener('change', (radio as any)._handler);
                    }
                });
            });
        };
    }, []);

    const handleSimpanMonitoring = async () => {
        const lokasi = (document.getElementById('kke-desa') as HTMLInputElement)?.value || 'Lokasi Belum Dinamai';
        const kabupaten = (document.getElementById('kke-kabupaten') as HTMLInputElement)?.value || '';
        const provinsi = (document.getElementById('kke-provinsi') as HTMLInputElement)?.value || '';
        const tahun = (document.getElementById('kke-tahun') as HTMLInputElement)?.value || '';
        const survivalRate = (document.getElementById('kke-sr') as HTMLInputElement)?.value || '';
        const kerapatan = (document.getElementById('kke-kerapatan') as HTMLInputElement)?.value || '';
        const tinggiTanaman = (document.getElementById('kke-tinggi') as HTMLInputElement)?.value || '';
        const fotoUrl = (document.getElementById('kke-foto') as HTMLInputElement)?.value || '';
        const status = (document.getElementById('kke-status') as HTMLSelectElement)?.value || 'Dalam Pemantauan';
        const catatan = (document.getElementById('kke-catatan') as HTMLTextAreaElement)?.value || '';

        try {
            // Upload PDF if present
            const fileInput = document.getElementById('kke-pdf') as HTMLInputElement;
            if (fileInput?.files?.length) {
                const formData = new FormData();
                formData.append('judulLaporan', `Laporan KKE - ${lokasi}`);
                formData.append('file', fileInput.files[0]);
                const uploadRes = await fetch('/api/laporan', { method: 'POST', body: formData });
                if (!uploadRes.ok) {
                    alert('Peringatan: Gagal mengupload file PDF, namun akan mencoba menyimpan data monitoring.');
                }
            }

            const res = await fetch('/api/monitoring/lapangan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lokasi, kabupaten, provinsi, tahun: tahun ? Number(tahun) : null,
                    survivalRate: survivalRate ? Number(survivalRate) : null,
                    kerapatan: kerapatan ? Number(kerapatan) : null,
                    tinggiTanaman: tinggiTanaman ? Number(tinggiTanaman) : null,
                    fotoUrl, status, catatan
                })
            });
            if (res.ok) {
                alert('Data berhasil disimpan dan PDF telah diupload (jika ada)!');
                
                // Clear DOM elements
                if (containerRef.current) {
                    const inputs = containerRef.current.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select');
                    inputs.forEach(input => {
                        if (input.type === 'radio' || input.type === 'checkbox') {
                            (input as HTMLInputElement).checked = false;
                        } else if (input.type === 'select-one') {
                            (input as HTMLSelectElement).selectedIndex = 0;
                        } else {
                            input.value = '';
                        }
                    });
                }
                
                // Clear all Local Storage for this form
                localStorage.clear();

                if (onSaveSuccess) onSaveSuccess();
            } else {
                alert('Gagal menyimpan data.');
            }
        } catch (e) {
            alert('Terjadi kesalahan.');
        }
    };

    return (
        <div className="laporan-kke-wrapper" ref={containerRef}>
            <div className="kke-container">
                {/* Header */}
                <div className="header">
                    <h1>KERTAS KERJA EVALUASI</h1>
                    <h2>EFEKTIVITAS PELAKSANAAN KEGIATAN PRIORITAS / BANTUAN PEMERINTAH</h2>
                    <div className="jenis-bantuan">Jenis Bantuan: Penanaman/Penyulaman Mangrove</div>
                </div>

                {/* Form Information Section */}
                <div className="info-section">
                    <div className="info-row">
                        <div className="info-label">1. Nama / NIK</div>
                        <div className="info-input"><input type="text" placeholder="Masukkan nama dan NIK" /></div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">2. Jabatan</div>
                        <div className="info-input"><input type="text" placeholder="Masukkan jabatan" /></div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">3. Nama Kelompok</div>
                        <div className="info-input"><input type="text" placeholder="Masukkan nama kelompok" /></div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">4. Nama Ketua Kelompok</div>
                        <div className="info-input"><input type="text" placeholder="Masukkan nama ketua kelompok" /></div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">5. Jumlah Anggota</div>
                        <div className="info-input">
                            <div className="member-count">
                                <div className="member-item">
                                    <span>Total</span>
                                    <input type="number" placeholder="0" />
                                </div>
                                <div className="member-item">
                                    <span>Laki-laki</span>
                                    <input type="number" placeholder="0" />
                                </div>
                                <div className="member-item">
                                    <span>Perempuan</span>
                                    <input type="number" placeholder="0" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">6. Alamat</div>
                        <div className="info-input">
                            <div className="address-section">
                                <input type="text" placeholder="Alamat lengkap" />
                                <input type="text" id="kke-desa" placeholder="Desa/Kelurahan" />
                                <input type="text" placeholder="Kecamatan" />
                                <input type="text" id="kke-kabupaten" placeholder="Kabupaten/Kota" />
                                <input type="text" id="kke-provinsi" placeholder="Provinsi" />
                            </div>
                        </div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">7. Koordinat Lokasi</div>
                        <div className="info-input"><input type="text" placeholder="Latitude, Longitude" /></div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">8. Nomor Telepon</div>
                        <div className="info-input"><input type="tel" placeholder="Masukkan nomor telepon" /></div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">9. Spesifikasi / item bantuan</div>
                        <div className="info-input"><textarea placeholder="Masukkan spesifikasi atau item bantuan"></textarea></div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">10. Tahun Bantuan</div>
                        <div className="info-input"><input type="number" id="kke-tahun" placeholder="YYYY" /></div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">11. Nilai Bantuan</div>
                        <div className="info-input"><input type="text" placeholder="Rp" /></div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">12. BAST</div>
                        <div className="info-input">
                            <div className="bast-section">
                                <input type="text" placeholder="Nomor BAST" />
                                <input type="date" />
                            </div>
                        </div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">13. Tanggal Pelaporan/Evaluasi</div>
                        <div className="info-input"><input type="date" /></div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">14. Kontak Person</div>
                        <div className="info-input">
                            <div className="contact-section">
                                <input type="text" placeholder="Nama" />
                                <input type="tel" placeholder="No HP / Telp" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Predikat Section */}
                <div className="predikat-section">
                    <h3>Kategori Predikat Efektivitas Pelaksanaan Kegiatan Prioritas / Bantuan Pemerintah</h3>
                    <table className="predikat-table">
                        <thead>
                            <tr>
                                <th>Predikat</th>
                                <th>Nilai</th>
                                <th>Interpretasi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>AA</strong></td>
                                <td>{'>'} 90 - 100</td>
                                <td>Memuaskan - Tujuan kegiatan prioritas/bantuan pemerintah tercapai dan patut menjadi percontohan</td>
                            </tr>
                            <tr>
                                <td><strong>A</strong></td>
                                <td>{'>'} 80 - 90</td>
                                <td>Efektif - Tujuan kegiatan prioritas/bantuan pemerintah tercapai dan perlu dilakukan pemantauan untuk mendorong pengembangan pemanfaatan</td>
                            </tr>
                            <tr>
                                <td><strong>B</strong></td>
                                <td>{'>'} 60 - 80</td>
                                <td>Cukup Efektif - Sebagian besar tujuan kegiatan prioritas/ bantuan pemerintah tercapai namun perlu upaya untuk menjamin pemanfaatan berkelanjutan</td>
                            </tr>
                            <tr>
                                <td><strong>C</strong></td>
                                <td>{'>'} 40 - 60</td>
                                <td>Kurang Efektif - Kegiatan prioritas/bantuan pemerintah hanya mencapai sebagian kecil tujuan dan pemanfaatan berpotensi tidak berkelanjutan</td>
                            </tr>
                            <tr>
                                <td><strong>D</strong></td>
                                <td>0 - 40</td>
                                <td>Tidak Efektif - Kegiatan prioritas/bantuan pemerintah tidak mencapai seluruh tujuan serta tidak bermanfaat bagi penerima, perlu dipertimbangkan untuk tidak melanjutkan kegiatan prioritas/bantuan pemerintah tersebut</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Evaluation Section */}
                <div className="evaluation-section">
                    <table className="evaluation-table">
                        <thead>
                            <tr>
                                <th>NO</th>
                                <th>UNSUR</th>
                                <th>BOBOT</th>
                                <th>Y/T</th>
                                <th>NILAI</th>
                                <th>PENJELASAN</th>
                                <th>KETERANGAN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Category A: Pencapaian Tujuan */}
                            <tr className="category-header">
                                <td colSpan={7}>A. Pencapaian Tujuan (80)</td>
                            </tr>
                            <tr>
                                <td className="question-number">1</td>
                                <td>
                                    Apakah keberadaan bibit mangrove terjaga atau tumbuh?
                                    <div className="category-details">
                                        <p>Jika jawaban Y maka pemberian nilai disesuaikan dengan kategori di bawah (huruf b – e) dan diberikan penjelasan.</p>
                                        <p><strong>Kategori:</strong></p>
                                        <ul>
                                            <li>a. 0, jika kondisi mangrove tidak tumbuh sama sekali;</li>
                                            <li>b. 10, jika kondisi mangrove tumbuh dibawah 25%;</li>
                                            <li>c. 15, jika kondisi mangrove tumbuh antara 25-50%;</li>
                                            <li>d. 25, jika kondisi mangrove tumbuh antara 50-75%;</li>
                                            <li>e. 30, jika kondisi mangrove tumbuh antara 75-100%.</li>
                                        </ul>
                                        <div className="data-support">
                                            <strong>Data Dukung:</strong> Dokumentasi lapangan, Foto udara
                                        </div>
                                        <p className="note">*Disebutkan penyebab atau kendala bibit yang tidak tumbuh atau mati maupun berhasil tumbuh.</p>
                                    </div>
                                </td>
                                <td className="bobot">30</td>
                                <td className="yes-no">
                                    <div className="yes-no-group">
                                        <label><input type="radio" name="q1" value="Y" /> Y</label>
                                        <label><input type="radio" name="q1" value="T" /> T</label>
                                    </div>
                                </td>
                                <td className="nilai"><input type="number" className="score" placeholder="Nilai" min="0" max="30" /></td>
                                <td className="penjelasan"><textarea className="explanation" placeholder="Penjelasan"></textarea></td>
                                <td className="keterangan"><textarea className="remark" placeholder="Keterangan"></textarea></td>
                            </tr>
                            <tr>
                                <td className="question-number">2</td>
                                <td>
                                    Apakah dengan diberikannya bantuan dapat meningkatkan keterlibatan masyarakat dalam kegiatan rehabilitasi kawasan mangrove?
                                    <div className="category-details">
                                        <p><strong>Kategori:</strong></p>
                                        <ul>
                                            <li>a. 0, jika masyarakat tidak melakukan kegiatan pemantauan dan/atau penyulaman;</li>
                                            <li>b. 15, jika masyarakat melakukan pemantauan mangrove atau melakukan penyulaman;</li>
                                            <li>c. 25, jika masyarakat melakukan pemantauan mangrove dan melakukan penyulaman.</li>
                                        </ul>
                                        <p className="note">*Disebutkan kegiatan apa yang dilakukan oleh masyarakat dan frekuensi/berapa kali pemantauan dan penyulaman</p>
                                        <div className="data-support">
                                            <strong>Data dukung:</strong> Laporan monitoring penanaman/penyulaman mangrove, Informasi dari UPT atau Direktorat atau Interviu dengan penerima bantuan.
                                        </div>
                                    </div>
                                </td>
                                <td className="bobot">25</td>
                                <td className="yes-no">
                                    <div className="yes-no-group">
                                        <label><input type="radio" name="q2" value="Y" /> Y</label>
                                        <label><input type="radio" name="q2" value="T" /> T</label>
                                    </div>
                                </td>
                                <td className="nilai"><input type="number" className="score" placeholder="Nilai" min="0" max="25" /></td>
                                <td className="penjelasan"><textarea className="explanation" placeholder="Penjelasan"></textarea></td>
                                <td className="keterangan"><textarea className="remark" placeholder="Keterangan"></textarea></td>
                            </tr>
                            <tr>
                                <td className="question-number">3</td>
                                <td>
                                    Apakah melalui kegiatan penanaman mangrove dapat meningkatkan pemahaman dan kesadaran masyarakat akan pentingnya kawasan mangrove?
                                    <div className="category-details">
                                        <p><strong>Kuisioner</strong></p>
                                        <ul>
                                            <li>a. 0, jika responden tidak memahami sama sekali;</li>
                                            <li>b. 5, jika dibawah 25% responden memahami;</li>
                                            <li>c. 10, jika 25-50% responden memahami;</li>
                                            <li>d. 15, jika 50-75% responden memahami;</li>
                                            <li>e. 25, jika 75-100% responden memahami.</li>
                                        </ul>
                                    </div>
                                </td>
                                <td className="bobot">25</td>
                                <td className="yes-no">
                                    <div className="yes-no-group">
                                        <label><input type="radio" name="q3" value="Y" /> Y</label>
                                        <label><input type="radio" name="q3" value="T" /> T</label>
                                    </div>
                                </td>
                                <td className="nilai"><input type="number" className="score" placeholder="Nilai" min="0" max="25" /></td>
                                <td className="penjelasan"><textarea className="explanation" placeholder="Penjelasan"></textarea></td>
                                <td className="keterangan"><textarea className="remark" placeholder="Keterangan"></textarea></td>
                            </tr>

                            {/* Category B: Integrasi */}
                            <tr className="category-header">
                                <td colSpan={7}>B. Integrasi (10)</td>
                            </tr>
                            <tr>
                                <td className="question-number">1</td>
                                <td>
                                    Apakah pernah mendapatkan pembinaan/peningkatan kompetensi terkait pengelolaan mangrove yang diterima baik dari instansi pusat atau lainnya?
                                    <div className="category-details">
                                        <p className="note">Disebutkan jenis pembinaan/peningkatan kompetensi diselenggarakan oleh siapa, kapan dan tentang apa.</p>
                                    </div>
                                </td>
                                <td className="bobot">2</td>
                                <td className="yes-no">
                                    <div className="yes-no-group">
                                        <label><input type="radio" name="b1" value="Y" /> Y</label>
                                        <label><input type="radio" name="b1" value="T" /> T</label>
                                    </div>
                                </td>
                                <td className="nilai"><input type="number" className="score" placeholder="Nilai" min="0" max="2" /></td>
                                <td className="penjelasan"><textarea className="explanation" placeholder="Penjelasan"></textarea></td>
                                <td className="keterangan"><textarea className="remark" placeholder="Keterangan"></textarea></td>
                            </tr>
                            <tr>
                                <td className="question-number">2</td>
                                <td>
                                    Apakah penerima bantuan memahami cara memantau kawasan mangrove?
                                    <div className="category-details">
                                        <p className="note">Interviu</p>
                                    </div>
                                </td>
                                <td className="bobot">2</td>
                                <td className="yes-no">
                                    <div className="yes-no-group">
                                        <label><input type="radio" name="b2" value="Y" /> Y</label>
                                        <label><input type="radio" name="b2" value="T" /> T</label>
                                    </div>
                                </td>
                                <td className="nilai"><input type="number" className="score" placeholder="Nilai" min="0" max="2" /></td>
                                <td className="penjelasan"><textarea className="explanation" placeholder="Penjelasan"></textarea></td>
                                <td className="keterangan"><textarea className="remark" placeholder="Keterangan"></textarea></td>
                            </tr>
                            <tr>
                                <td className="question-number">3</td>
                                <td>
                                    Apakah pernah dilakukan monev oleh pemberi bantuan atau pihak lainnya?
                                    <div className="category-details">
                                        <p className="note">Laporan Monev</p>
                                        <p className="note">Monitoring dilakukan terhadap:</p>
                                        <ul>
                                            <li>a. kesesuaian antara pelaksanaan penyaluran bantuan dan petunjuk teknis yang telah ditetapkan serta ketentuan peraturan terkait lainnya; kesesuaian antara target capaian dan realisasi; dan pasca/manfaat hasil penanaman mangrove</li>
                                            <li>b. untuk mengetahui perkembangan pasca atau manfaat penanaman mangrove dan permasalahan yang dihadapai selama 2 (dua) tahun serta mengambil langkah-langkah upaya penyelesaiannya.</li>
                                            <li>c. Aspek yang dimonev:
                                                <ol>
                                                    <li>status dan kondisi mangrove;</li>
                                                    <li>pemenuhan kewajiban dari kelompok penerima bantuan; dan</li>
                                                    <li>manfaat bantuan pemerintah, antara lain manfaat terhadap sosial ekonomi, manfaat terhadap kualitas sumberdaya atau lingkungan, dan manfaat bagi pemerintah daerah.</li>
                                                </ol>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                                <td className="bobot">1</td>
                                <td className="yes-no">
                                    <div className="yes-no-group">
                                        <label><input type="radio" name="b3" value="Y" /> Y</label>
                                        <label><input type="radio" name="b3" value="T" /> T</label>
                                    </div>
                                </td>
                                <td className="nilai"><input type="number" className="score" placeholder="Nilai" min="0" max="1" /></td>
                                <td className="penjelasan"><textarea className="explanation" placeholder="Penjelasan"></textarea></td>
                                <td className="keterangan"><textarea className="remark" placeholder="Keterangan"></textarea></td>
                            </tr>
                            <tr>
                                <td className="question-number">4</td>
                                <td>
                                    Apakah monev memberikan saran?
                                    <div className="category-details">
                                        <p className="note">Laporan Monev</p>
                                    </div>
                                </td>
                                <td className="bobot">1</td>
                                <td className="yes-no">
                                    <div className="yes-no-group">
                                        <label><input type="radio" name="b4" value="Y" /> Y</label>
                                        <label><input type="radio" name="b4" value="T" /> T</label>
                                    </div>
                                </td>
                                <td className="nilai"><input type="number" className="score" placeholder="Nilai" min="0" max="1" /></td>
                                <td className="penjelasan"><textarea className="explanation" placeholder="Penjelasan"></textarea></td>
                                <td className="keterangan"><textarea className="remark" placeholder="Keterangan"></textarea></td>
                            </tr>
                            <tr>
                                <td className="question-number">5</td>
                                <td>
                                    Apakah saran monev telah ditindaklanjuti?
                                    <div className="category-details">
                                        <p className="note">Laporan Monev</p>
                                    </div>
                                </td>
                                <td className="bobot">1</td>
                                <td className="yes-no">
                                    <div className="yes-no-group">
                                        <label><input type="radio" name="b5" value="Y" /> Y</label>
                                        <label><input type="radio" name="b5" value="T" /> T</label>
                                    </div>
                                </td>
                                <td className="nilai"><input type="number" className="score" placeholder="Nilai" min="0" max="1" /></td>
                                <td className="penjelasan"><textarea className="explanation" placeholder="Penjelasan"></textarea></td>
                                <td className="keterangan"><textarea className="remark" placeholder="Keterangan"></textarea></td>
                            </tr>
                            <tr>
                                <td className="question-number">6</td>
                                <td>
                                    Apakah sudah dialokasikan biaya pemeliharaan?
                                    <div className="category-details">
                                        <p className="note">Interviu</p>
                                    </div>
                                </td>
                                <td className="bobot">1</td>
                                <td className="yes-no">
                                    <div className="yes-no-group">
                                        <label><input type="radio" name="b6" value="Y" /> Y</label>
                                        <label><input type="radio" name="b6" value="T" /> T</label>
                                    </div>
                                </td>
                                <td className="nilai"><input type="number" className="score" placeholder="Nilai" min="0" max="1" /></td>
                                <td className="penjelasan"><textarea className="explanation" placeholder="Penjelasan"></textarea></td>
                                <td className="keterangan"><textarea className="remark" placeholder="Keterangan"></textarea></td>
                            </tr>
                            <tr>
                                <td className="question-number">7</td>
                                <td>
                                    Apakah penerima bantuan memberikan laporan pengelolaan bantuan sesuai ketentuan?
                                    <div className="category-details">
                                        <p className="note">Laporan penerima bantuan kepada pemberi bantuan</p>
                                    </div>
                                </td>
                                <td className="bobot">2</td>
                                <td className="yes-no">
                                    <div className="yes-no-group">
                                        <label><input type="radio" name="b7" value="Y" /> Y</label>
                                        <label><input type="radio" name="b7" value="T" /> T</label>
                                    </div>
                                </td>
                                <td className="nilai"><input type="number" className="score" placeholder="Nilai" min="0" max="2" /></td>
                                <td className="penjelasan"><textarea className="explanation" placeholder="Penjelasan"></textarea></td>
                                <td className="keterangan"><textarea className="remark" placeholder="Keterangan"></textarea></td>
                            </tr>

                            {/* Category C: Adaptasi */}
                            <tr className="category-header">
                                <td colSpan={7}>C. Adaptasi (10)</td>
                            </tr>
                            <tr>
                                <td className="question-number">1</td>
                                <td>
                                    Apakah ada kegiatan pengembangan/pengelolaan mangrove?
                                    <div className="category-details">
                                        <p className="note">Disebutkan jenis kegiatan pengembangan/pengelolaan (seperti kemitraan, pengembangan wisata maupun kegiatan lain)</p>
                                    </div>
                                </td>
                                <td className="bobot">10</td>
                                <td className="yes-no">
                                    <div className="yes-no-group">
                                        <label><input type="radio" name="c1" value="Y" /> Y</label>
                                        <label><input type="radio" name="c1" value="T" /> T</label>
                                    </div>
                                </td>
                                <td className="nilai"><input type="number" className="score" placeholder="Nilai" min="0" max="10" /></td>
                                <td className="penjelasan"><textarea className="explanation" placeholder="Penjelasan"></textarea></td>
                                <td className="keterangan"><textarea className="remark" placeholder="Keterangan"></textarea></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Data Teknis Monitoring Section */}
                <div className="info-section" style={{ marginTop: '24px' }}>
                    <h3 style={{ marginBottom: '16px', color: '#10b981' }}>Data Teknis Monitoring Lapangan</h3>
                    <div className="info-row">
                        <div className="info-label">Survival Rate (%)</div>
                        <div className="info-input"><input type="number" id="kke-sr" placeholder="0-100" /></div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">Kerapatan (pohon/Ha)</div>
                        <div className="info-input"><input type="number" id="kke-kerapatan" placeholder="1500" /></div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">Tinggi Tanaman (cm)</div>
                        <div className="info-input"><input type="number" id="kke-tinggi" placeholder="120" /></div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">Status Lokasi</div>
                        <div className="info-input">
                            <select id="kke-status" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                                <option>Berhasil</option>
                                <option>Perlu Rehabilitasi</option>
                                <option>Dalam Pemantauan</option>
                            </select>
                        </div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">URL Foto Dokumentasi</div>
                        <div className="info-input"><input type="url" id="kke-foto" placeholder="https://..." /></div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">Upload Laporan (PDF)</div>
                        <div className="info-input">
                            <input type="file" id="kke-pdf" accept=".pdf" style={{
                                width: '100%', padding: '8px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #d1d5db',
                                fontSize: '0.85rem'
                            }} />
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                                Hanya file berektensi .pdf yang diperbolehkan.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Problems and Recommendations Section */}
                <div className="problems-section">
                    <h3>Kendala / Permasalahan</h3>
                    <div className="problem-item">
                        <textarea id="kke-catatan" placeholder="Tuliskan kendala atau permasalahan yang dihadapi..."></textarea>
                    </div>

                    <h3>Rekomendasi</h3>
                    <div className="problem-item">
                        <textarea placeholder="Tuliskan rekomendasi atau saran perbaikan..."></textarea>
                    </div>
                </div>

                {/* Signatures Section */}
                <div className="signatures-section">
                    <h3>Tanda Tangan</h3>
                    <div className="signatures-grid">
                        <div className="signature-item">
                            <h4>Perwakilan Kelompok</h4>
                            <div className="date-location">
                                <p>tempat, tanggal, bulan, dan tahun</p>
                            </div>
                            <div className="signature-line">
                                <p>..................</p>
                            </div>
                        </div>
                        <div className="signature-item">
                            <h4>Perwakilan Pemberi Bantuan</h4>
                            <div className="date-location">
                                <p>tempat, tanggal, bulan, dan tahun</p>
                            </div>
                            <div className="signature-line">
                                <p>..................</p>
                            </div>
                        </div>
                        <div className="signature-item">
                            <h4>Inspektorat III</h4>
                            <div className="date-location">
                                <p>tempat, tanggal, bulan, dan tahun</p>
                            </div>
                            <div className="signature-line">
                                <p>..................</p>
                            </div>
                        </div>
                        <div className="signature-item">
                            <h4>Sekretariat DJPRL</h4>
                            <div className="date-location">
                                <p>tempat, tanggal, bulan, dan tahun</p>
                            </div>
                            <div className="signature-line">
                                <p>..................</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes Section */}
                <div className="notes-section">
                    <h3>Catatan:</h3>
                    <ul>
                        <li>Penjelasan diisi juga dengan permasalahan atau kendala, serta rencana tindak lanjut maupun rekomendasi.</li>
                        <li>Dokumentasi kegiatan penerima bantuan dilampirkan dalam KKE (foto kondisi barang, foto kegiatan pemanfaatan bantuan dan/atau link video).</li>
                        <li>Dokumen kelengkapan evaluasi tersedia di bit.ly/BPDJPRL2023</li>
                        <li>Tanda tangan disesuaikan dengan perwakilan pihak yang terlibat.</li>
                    </ul>
                </div>

                <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px' }}>
                    <button
                        onClick={handleSimpanMonitoring}
                        style={{
                            padding: '14px 28px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
                        }}
                    >
                        💾 Simpan Laporan & Update Monitoring Lapangan
                    </button>
                </div>
            </div>
        </div>
    );
}
