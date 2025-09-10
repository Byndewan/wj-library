import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserManual } from '../utils/createUserManual';
import type { UserRole } from '../types';
import { FiBook, FiUser, FiMail, FiLock, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'SISWA' as UserRole,
    className: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-sm p-8 animate-fadeIn border border-gray-200">
          <div className="text-center">
            <div className="w-30 h-30 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <img src="/WJ.png" alt="LOGO" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Daftar Akun
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Buat akun baru untuk mengakses WJLRC Library
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-center">
                  <FiAlertCircle className="h-5 w-5 mr-2" />
                  {error}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="form-label relative">
                  <FiUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  Nama Lengkap *
                </label>
                {/* <div className="relative"> */}
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="form-input pl-10"
                    placeholder="Masukkan nama lengkap"
                    value={formData.name}
                    onChange={handleChange}
                  />
                {/* </div> */}
              </div>

              <div>
                <label htmlFor="email" className="form-label relative">
                  <FiMail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  Email *
                </label>
                {/* <div className="relative"> */}
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="form-input pl-10"
                    placeholder="email@contoh.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                {/* </div> */}
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
                  <option value="ADMIN">Admin WJLRC</option>
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
                    placeholder="Contoh: X RPL 1"
                    value={formData.className}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div>
                <label htmlFor="password" className="form-label relative">
                  <FiLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  Password *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="form-input pl-10 pr-10"
                    placeholder="Minimal 6 karakter"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="form-label relative">
                  <FiLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  Konfirmasi Password *
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="form-input pl-10 pr-10"
                    placeholder="Ulangi password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
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
                <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
                  Masuk di sini
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2025 WJLRC Library. Supported by <a href="https://instagram.com/username_ig_kamu" target="_blank" class="text-blue-600 hover:underline ml-1">@Abyan</a>. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;