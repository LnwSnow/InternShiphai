import React, { useState } from 'react';
import { FileText, ArrowRight, MapPin, Phone, Globe, Mail, PlusCircle, Edit } from 'lucide-react';
import { INITIAL_APPLICATIONS } from '../constants';
import { Modal } from './Modal';

export const ResourcesPage = ({ applications = [], onUpdate }) => {
  const [selectedApp, setSelectedApp] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({ phone: '', website: '', email: '' });

  const handleAddInfoClick = (app) => {
    setSelectedApp(app);
    setEditData({
      phone: app.phone || '',
      website: app.website || '',
      email: app.email || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveInfo = () => {
    onUpdate({
      ...selectedApp,
      ...editData
    });
    setIsEditModalOpen(false);
  };

  const templates = [
    {
      title: 'Resume Template', 
      format: 'PDF Format', 
      size: '240KB', 
      icon: <FileText className="w-8 h-8" />, 
      color: 'bg-blue-100 text-blue-600', 
      btnColor: 'bg-primary',
      link: 'https://bettercv.com/lp/templates?utm_source=google&utm_medium=cpc&utm_campaign=22911826023&utm_term=kwd-297275067248&utm_content=189835036248&network=g&utm_keyword=resume%20pdf%20template&gad_source=1&gad_campaignid=22911826023&gbraid=0AAAAAoNLxStVjlWToAgLz6SpdyY7rEeKu&gclid=CjwKCAjw1tLOBhAMEiwAiPkRHjuy9MkjXgtPkMWNN5aDOCgRbXLnJQIAzjbpyTArd5S0dshn0wwt6xoChAsQAvD_BwE'
    },
    { 
      title: 'Cover Letter Template', 
      format: 'DOCX Format', 
      size: '185KB', 
      icon: <FileText className="w-8 h-8" />, 
      color: 'bg-purple-100 text-purple-600', 
      btnColor: 'bg-tertiary',
      link: 'https://zety.com/lp/cv-maker?utm_source=google&utm_medium=sem&utm_campaign=13070247276&utm_term=cv%20template&network=g&device=c&adposition=&adgroupid=127892187811&placement=&gad_source=1&gad_campaignid=13070247276&gbraid=0AAAAADKztBYq8eu9RTCQq7tto-jMko-Ql&gclid=CjwKCAjw1tLOBhAMEiwAiPkRHoLVWruE5W6PNdh1Q9P8D7EeGY1Srjz-Hrp7bb_na_am5TRYt3gc8xoCMb0QAvD_BwE'
    }
  ];

  return (
    <div className="pt-28 pb-20 px-6 max-w-screen-xl mx-auto min-h-screen">
      <section className="mb-20">
        <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface mb-2 text-center md:text-left">Template Library</h1>
        <p className="text-on-surface-variant mb-12 text-center md:text-left">Standardized formats recognized by top-tier hiring systems.</p>
        
        <div className="flex flex-col md:flex-row justify-center gap-8">
          {templates.map((template, idx) => (
            <div key={idx} className="bg-surface-container-low rounded-[40px] p-12 flex flex-col items-center text-center shadow-sm border border-outline-variant/5 w-full md:w-[400px]">
              <div className={`w-16 h-16 ${template.color} rounded-2xl flex items-center justify-center mb-6`}>
                {template.icon}
              </div>
              <h3 className="text-2xl font-bold text-on-surface mb-2">{template.title}</h3>
              <p className="text-sm text-on-surface-variant mb-8">{template.format} • {template.size}</p>
              <a 
                href={template.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${template.btnColor} text-on-primary px-10 py-4 rounded-full font-bold text-lg flex items-center gap-2 hover:opacity-90 transition-all shadow-md`}
              >
                Create yours <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold tracking-tighter text-on-surface mb-2">Company Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {applications.length > 0 ? (
            applications.map((app) => (
              <div key={app.id} className="bg-surface-container-low rounded-lg p-8 flex flex-col gap-6 transition-all hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-surface-container-lowest rounded-md flex items-center justify-center shadow-sm overflow-hidden">
                    {app.logo ? (
                      <img src={app.logo} alt={app.company} className="w-full h-full object-contain p-3" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary/40">{app.initial || app.company.substring(0, 1).toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-on-surface truncate">{app.company}</h3>
                </div>

                {!app.phone && !app.website && !app.email ? (
                  <div className="flex flex-col items-center justify-center py-10 px-4 bg-surface-container-low/50 rounded-2xl border border-dashed border-outline-variant/30 text-center">
                    <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                      No data found.<br />Add your own notes about this company.
                    </p>
                    <button 
                      onClick={() => handleAddInfoClick(app)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-bold hover:bg-primary hover:text-on-primary transition-all active:scale-95"
                    >
                      <PlusCircle className="w-3 h-3" />
                      Add Info
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-on-surface-variant">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium">{app.location || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-4 text-on-surface-variant">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <Phone className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium">{app.phone || 'No phone provided'}</span>
                    </div>
                    <div className="flex items-center gap-4 text-on-surface-variant">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <Globe className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium truncate italic hover:text-primary transition-colors cursor-pointer">
                        {app.website || 'No website provided'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-on-surface-variant">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <Mail className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium truncate italic hover:text-primary transition-colors cursor-pointer">
                        {app.email || 'No email provided'}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleAddInfoClick(app)}
                      className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-full text-[10px] font-bold bg-outline-variant text-on-surface hover:bg-surface-container-highest hover:text-surface-container-low transition-all"
                      /*className="mt-4 flex items-center justify-center gap-2 w-full py-2 bg-surface-container-highest rounded-full text-[10px] font-bold text-on-surface-variant hover:bg-outline-variant hover:text-on-surface transition-all"*/
                    >
                      <Edit className="w-3 h-3" />
                      Edit info
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant/20">
              <p className="text-on-surface-variant">No company details yet. Add your first application to see resources here.</p>
            </div>
          )}
        </div>
      </section>

      <Modal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Add info for ${selectedApp?.company}`}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant px-1">Phone</label>
            <div className="relative">
              <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
              <input 
                type="text" 
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                className="w-full bg-surface-container border-none rounded-2xl pl-14 pr-6 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="000-0000000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant px-1">Website</label>
            <div className="relative">
              <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
              <input 
                type="text" 
                value={editData.website}
                onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                className="w-full bg-surface-container border-none rounded-2xl pl-14 pr-6 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="www.company.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant px-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
              <input 
                type="email" 
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="w-full bg-surface-container border-none rounded-2xl pl-14 pr-6 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="hr@company.com"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 bg-blue-100/50 text-blue-900 py-4 rounded-full font-bold text-lg hover:bg-blue-100 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveInfo}
              className="flex-1 bg-blue-800 text-white py-4 rounded-full font-bold text-lg hover:bg-blue-900 shadow-lg transition-all"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
