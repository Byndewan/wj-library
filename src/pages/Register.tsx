import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserManual } from '../utils/createUserManual';
import type { UserRole } from '../types';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'SISWA' as UserRole,
    className: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validasi
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    if (formData.role === 'SISWA' && !formData.className.trim()) {
      setError('Kelas harus diisi untuk siswa');
      return;
    }

    setLoading(true);
    
    try {
      const success = await createUserManual(
        formData.email,
        formData.password,
        formData.name,
        formData.role,
        formData.className
      );
      
      if (success) {
        alert('Akun berhasil dibuat! Silakan login.');
        navigate('/login');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">📚</span>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Daftar Akun
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Buat akun baru untuk mengakses sistem perpustakaan
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="form-label">
                  Nama Lengkap *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="form-input"
                  placeholder="Masukkan nama lengkap"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="form-label">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="form-input"
                  placeholder="email@contoh.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="role" className="form-label">
                  Peran *
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  className="form-input"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="SISWA">Siswa</option>
                  <option value="PETUGAS">Petugas Perpustakaan</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>

              {formData.role === 'SISWA' && (
                <div>
                  <label htmlFor="className" className="form-label">
                    Kelas *
                  </label>
                  <input
                    id="className"
                    name="className"
                    type="text"
                    required
                    className="form-input"
                    placeholder="Contoh: XII IPA 1"
                    value={formData.className}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div>
                <label htmlFor="password" className="form-label">
                  Password *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="form-input"
                  placeholder="Minimal 6 karakter"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="form-label">
                  Konfirmasi Password *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="form-input"
                  placeholder="Ulangi password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Mendaftarkan...</span>
                  </div>
                ) : (
                  'Daftar'
                )}
              </button>
            </div>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Sudah punya akun?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Masuk di sini
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2024 Sistem Manajemen Perpustakaan. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;