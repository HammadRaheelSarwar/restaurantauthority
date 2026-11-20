import React, { useEffect, useState } from 'react';
import {
  FileText,
  Plus,
  Download,
  Tag,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Calendar,
  X,
  UploadCloud,
  CheckCircle2,
  FileCheck2,
  FileSpreadsheet
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';

export default function DocumentsPage() {
  const { addToast } = useToast();
  const [documents, setDocuments] = useState([]);
  const [category, setCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const [formData, setFormData] = useState({
    title: 'Single-Line Panel Directory Schematics (MDP-1)',
    category: 'panel',
    file_name: 'Single_Line_MDP1_Downtown.pdf'
  });

  const sampleDocuments = [
    {
      id: 'doc-1',
      title: 'Main Distribution Panel Single-Line Diagram',
      category: 'panel',
      file_name: 'MDP1_Schematic_2026.pdf',
      file_size: 245000,
      uploaded_by_name: 'David Martinez (ME)',
      created_at: '2026-01-10T14:20:00Z',
      file_url: 'https://rea-compliance.com/sample.pdf'
    },
    {
      id: 'doc-2',
      title: 'Bi-Annual Electrical Site Assessment Dossier',
      category: 'assessment',
      file_name: 'Assessment_Scorecard_NYC01.pdf',
      file_size: 512000,
      uploaded_by_name: 'David Martinez (ME)',
      created_at: '2026-01-10T16:45:00Z',
      file_url: 'https://rea-compliance.com/sample.pdf'
    },
    {
      id: 'doc-3',
      title: 'Rational iCombi Pro 480V Connection Spec',
      category: 'equipment',
      file_name: 'Rational_iCP10_Specs.pdf',
      file_size: 184000,
      uploaded_by_name: 'Elena Rostova, CRESM',
      created_at: '2025-12-14T09:15:00Z',
      file_url: 'https://rea-compliance.com/sample.pdf'
    },
    {
      id: 'doc-4',
      title: 'Ansul Hood Shunt-Trip Interlock Certificate',
      category: 'incident',
      file_name: 'Ansul_ShuntTrip_Remediation.pdf',
      file_size: 320000,
      uploaded_by_name: 'Titan Electric LLC',
      created_at: '2026-02-14T11:00:00Z',
      file_url: 'https://rea-compliance.com/sample.pdf'
    },
    {
      id: 'doc-5',
      title: 'CRESM Manager Digital Credential Transcript',
      category: 'certification',
      file_name: 'CRESM_Transcript_88492.pdf',
      file_size: 142000,
      uploaded_by_name: 'REA Credentialing Board',
      created_at: '2026-01-15T18:00:00Z',
      file_url: 'https://rea-compliance.com/sample.pdf'
    }
  ];

  useEffect(() => {
    loadDocs();
  }, [category]);

  const loadDocs = async () => {
    try {
      const res = await api.getDocuments(category);
      if (res.success && res.data?.length > 0) {
        setDocuments(res.data);
      } else {
        setDocuments(sampleDocuments.filter(d => !category || d.category === category));
      }
    } catch {
      setDocuments(sampleDocuments.filter(d => !category || d.category === category));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const res = await api.uploadDocument({
        ...formData,
        file_url: 'https://rea-compliance.com/sample.pdf',
        file_size: 215000
      });
      if (res.success) {
        addToast('Document successfully uploaded to encrypted vault');
        setShowUploadModal(false);
        loadDocs();
      }
    } catch (err) {
      addToast(err.message || 'Upload failed', 'error');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '185 KB';
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const tableColumns = [
    {
      key: 'title',
      label: 'Document Title & File',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#EAF5EF] text-[#146B45] flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-[#17231D] block">{val}</span>
            <span className="text-[10px] text-[#66736B] font-mono">{row.file_name}</span>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (val) => (
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#146B45] bg-[#EAF5EF] px-2 py-0.5 rounded-full">
          {val}
        </span>
      )
    },
    {
      key: 'uploaded_by_name',
      label: 'Uploaded By',
      render: (val) => <span className="text-xs text-[#17231D]">{val || 'David Martinez (ME)'}</span>
    },
    {
      key: 'file_size',
      label: 'Size',
      render: (val) => <span className="font-mono text-xs text-[#66736B]">{formatFileSize(val)}</span>
    },
    {
      key: 'id',
      label: 'Actions',
      className: 'text-right',
      render: (_, row) => (
        <button
          onClick={() => setSelectedDoc(row)}
          className="px-2.5 py-1 text-xs font-semibold text-[#146B45] bg-[#EAF5EF] hover:bg-[#D5ECE0] rounded-lg transition"
        >
          View / Download
        </button>
      )
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#E6ECE8]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#17231D]">Document Management Vault</h1>
          <p className="text-xs text-[#66736B] mt-0.5">
            Cloud repository for single-line schematics, infrared thermography logs, permits, and audit dossiers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Toggle */}
          <div className="flex bg-[#F1F5F2] p-1 rounded-xl border border-[#E6ECE8]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-white text-[#146B45] shadow-xs' : 'text-[#66736B]'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'list' ? 'bg-white text-[#146B45] shadow-xs' : 'text-[#66736B]'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#146B45] hover:bg-[#104B35] rounded-xl transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs font-semibold pb-1">
        {[
          { id: '', label: 'All Documents' },
          { id: 'assessment', label: 'Site Assessments' },
          { id: 'panel', label: 'Panel Schematics' },
          { id: 'equipment', label: 'Equipment Specs' },
          { id: 'incident', label: 'Incident Records' },
          { id: 'certification', label: 'Credentials' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl transition ${
              category === cat.id
                ? 'bg-[#146B45] text-white shadow-xs'
                : 'bg-white text-[#66736B] hover:text-[#17231D] border border-[#E6ECE8]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Content: Grid or List View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className="bg-white rounded-2xl p-6 border border-[#E6ECE8] shadow-sm space-y-4 hover:border-[#146B45] transition cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF5EF] text-[#146B45] flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#146B45] bg-[#EAF5EF] px-2 py-0.5 rounded-full">
                    {doc.category}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[#17231D] leading-tight">{doc.title}</h3>
                  <span className="text-[11px] text-[#66736B] font-mono block mt-0.5">{doc.file_name}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F1F5F2] flex items-center justify-between text-xs text-[#66736B]">
                <span>{formatFileSize(doc.file_size)}</span>
                <span className="text-[#146B45] font-bold flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable
          columns={tableColumns}
          data={documents}
          searchPlaceholder="Search document name or category..."
          searchKeys={['title', 'file_name', 'category']}
          onRowClick={(row) => setSelectedDoc(row)}
        />
      )}

      {/* Document Preview / Download Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-[#E6ECE8]">
            <div className="flex justify-between items-start border-b border-[#E6ECE8] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#146B45] bg-[#EAF5EF] px-2 py-0.5 rounded-full">
                  {selectedDoc.category}
                </span>
                <h3 className="text-base font-bold text-[#17231D] mt-1">{selectedDoc.title}</h3>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-[#66736B] hover:text-[#17231D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-[#F7F9F8] p-4 rounded-xl border border-[#E6ECE8]">
              <div className="flex justify-between">
                <span className="text-[#66736B]">Filename:</span>
                <strong className="text-[#17231D] font-mono">{selectedDoc.file_name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66736B]">Size:</span>
                <strong className="text-[#17231D]">{formatFileSize(selectedDoc.file_size)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66736B]">Author:</span>
                <strong className="text-[#17231D]">{selectedDoc.uploaded_by_name || 'David Martinez (ME)'}</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E6ECE8] flex justify-end gap-2">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 bg-[#F1F5F2] hover:bg-[#E6ECE8] text-[#17231D] text-xs font-semibold rounded-xl"
              >
                Close
              </button>
              <a
                href={selectedDoc.file_url || '#'}
                download={selectedDoc.file_name}
                className="px-5 py-2 bg-[#146B45] hover:bg-[#104B35] text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Secure File</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-[#E6ECE8]">
            <div className="flex justify-between items-center border-b border-[#E6ECE8] pb-3">
              <h3 className="text-lg font-bold text-[#17231D]">Upload Technical Document</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-[#66736B] hover:text-[#17231D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#17231D] mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6ECE8] bg-[#F7F9F8] text-[#17231D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#17231D] mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6ECE8] bg-[#F7F9F8] text-[#17231D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#146B45]"
                >
                  <option value="panel">Electrical Panel Schematic</option>
                  <option value="assessment">Site Assessment Report</option>
                  <option value="equipment">Equipment Manual / Spec</option>
                  <option value="incident">Incident Investigation Proof</option>
                  <option value="certification">Certification Credential</option>
                </select>
              </div>

              {/* Drag-and-drop box */}
              <div className="p-6 border-2 border-dashed border-[#CBD5CD] rounded-2xl text-center space-y-2 bg-[#F7F9F8]">
                <UploadCloud className="w-8 h-8 text-[#146B45] mx-auto" />
                <span className="font-bold text-xs text-[#17231D] block">Drop PDF or Single-Line DWG files here</span>
                <span className="text-[11px] text-[#66736B] block">Supported formats: PDF, PNG, JPG, DWG (Max 25MB)</span>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#E6ECE8]">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#F1F5F2] text-[#17231D] font-semibold hover:bg-[#E6ECE8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#146B45] text-white font-bold hover:bg-[#104B35]"
                >
                  Catalog Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
