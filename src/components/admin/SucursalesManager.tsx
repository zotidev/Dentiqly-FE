import React, { useState, useEffect } from 'react';
import { MapPin as MapIcon, MapPin, Plus, Trash2, Edit2, Phone, Mail, Loader2, Search, X } from 'lucide-react';
import { sucursalesApi } from '../../api';
import { useToast } from '../../hooks/use-toast';

interface Sucursal {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  activo: boolean;
}

export const SucursalesManager: React.FC = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
  });

  const fetchSucursales = async () => {
    try {
      setLoading(true);
      const data = await sucursalesApi.listar();
      setSucursales(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las sucursales.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSucursales();
  }, []);

  const handleEdit = (sucursal: Sucursal) => {
    setEditingId(sucursal.id);
    setFormData({
      nombre: sucursal.nombre,
      direccion: sucursal.direccion || '',
      telefono: sucursal.telefono || '',
      email: sucursal.email || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta sucursal?')) return;
    try {
      await sucursalesApi.eliminar(id);
      toast({ title: "Éxito", description: "Sucursal eliminada correctamente." });
      fetchSucursales();
    } catch (error) {
      toast({ title: "Error", description: "No se pudo eliminar la sucursal.", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await sucursalesApi.actualizar(editingId, formData);
        toast({ title: "Éxito", description: "Sucursal actualizada correctamente." });
      } else {
        await sucursalesApi.crear(formData);
        toast({ title: "Éxito", description: "Sucursal creada correctamente." });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ nombre: '', direccion: '', telefono: '', email: '' });
      fetchSucursales();
    } catch (error) {
      toast({ title: "Error", description: "Hubo un problema al guardar la sucursal.", variant: "destructive" });
    }
  };

  const filteredSucursales = (Array.isArray(sucursales) ? sucursales : []).filter(s => 
    (s.nombre?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (s.direccion?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Sucursales</h2>
          <p className="text-gray-500">Administra las diferentes sedes de tu clínica dental.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ nombre: '', direccion: '', telefono: '', email: '' });
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 bg-[#2563FF] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1D4ED8] transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={20} />
          Nueva Sucursal
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre o dirección..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Cargando sucursales...</p>
          </div>
        ) : filteredSucursales.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapIcon className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No se encontraron sucursales</h3>
            <p className="text-gray-500">Comienza creando tu primera sede para que los pacientes puedan elegirla.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredSucursales.map((sucursal) => (
              <div 
                key={sucursal.id}
                className="group relative bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:border-blue-100 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 text-[#2563FF] rounded-xl group-hover:bg-[#2563FF] group-hover:text-white transition-colors duration-300">
                    <MapPin size={24} />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(sucursal)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(sucursal.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-gray-900 mb-2">{sucursal.nombre}</h4>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapIcon size={16} className="text-gray-400 shrink-0" />
                    <span className="line-clamp-1">{sucursal.direccion || 'Sin dirección'}</span>
                  </div>
                  {sucursal.telefono && (
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400 shrink-0" />
                      <span>{sucursal.telefono}</span>
                    </div>
                  )}
                  {sucursal.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400 shrink-0" />
                      <span className="line-clamp-1">{sucursal.email}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Formulario */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900">
                {editingId ? 'Editar Sucursal' : 'Nueva Sucursal'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nombre de la Sede *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Ej: Sede Lomas de Zamora"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Dirección</label>
                <div className="relative">
                  <MapIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Calle, Número, Localidad"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Teléfono</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="+54 ..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="sede@ejemplo.com"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#2563FF] text-white font-bold rounded-xl hover:bg-[#1D4ED8] transition-all shadow-lg shadow-blue-100"
                >
                  {editingId ? 'Guardar Cambios' : 'Crear Sucursal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
