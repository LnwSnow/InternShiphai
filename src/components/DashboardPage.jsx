import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  ChevronDown, 
  Plus, 
  MapPin, 
  CircleDollarSign, 
  Clock, 
  MoreHorizontal, 
  Edit2, 
  Presentation, 
  Trash,
  MessageSquare,
  X,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { Modal } from './Modal';

export const DashboardPage = ({ applications, searchQuery, onAddClick, onUpdate, onDelete }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [activities, setActivities] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [updateStatus, setUpdateStatus] = useState('');
  const [now, setNow] = useState(new Date());

  // Keep "now" updated every minute to ensure dynamic reminders
  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Reminder Logic
  const getUpcomingActivities = () => {
    const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
    
    const allActivities = [];
    applications.forEach(app => {
      if (app.activities && Array.isArray(app.activities)) {
        app.activities.forEach(activity => {
          if (activity.date) {
            const [day, month, year] = activity.date.split('/').map(Number);
            const [hours, minutes] = (activity.time || '00:00').split(':').map(Number);
            
            // Treat user input as Bangkok Time (UTC+7)
            // Subtract 7 hours from input hours to get UTC representation
            const activityDate = new Date(Date.UTC(year, month - 1, day, hours - 7, minutes));
            
            if (!activity.completed && activityDate > now && activityDate <= threeDaysFromNow) {
              allActivities.push({
                ...activity,
                company: app.company,
                role: app.role,
                fullDate: activityDate
              });
            }
          }
        });
      }
    });

    return allActivities.sort((a, b) => a.fullDate - b.fullDate);
  };

  const upcomingActivities = getUpcomingActivities();

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const timeA = (a.updatedAt || a.createdAt)?.seconds || 0;
    const timeB = (b.updatedAt || b.createdAt)?.seconds || 0;
    return timeB - timeA;
  });

  const handleEditClick = (app) => {
    setSelectedApp(app);
    setEditFormData({
      company: app.company,
      role: app.role,
      location: app.location || '',
      salary: app.salary || '',
      notes: app.notes || ''
    });
    setActiveModal('edit');
    setActiveMenu(null);
  };

  const handleUpdateClick = (app) => {
    setSelectedApp(app);
    setUpdateStatus(app.status);
    setActivities(app.activities || [{ id: Date.now(), name: '', date: '', time: '', completed: false }]);
    setActiveModal('update');
    setActiveMenu(null);
  };

  const addActivity = () => {
    setActivities([...activities, { id: Date.now(), name: '', date: '', time: '', completed: false }]);
  };

  const removeActivity = (id) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const handleActivityChange = (id, field, value) => {
    setActivities(activities.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const handleEditSave = () => {
    onUpdate({
      ...selectedApp,
      ...editFormData,
      initial: editFormData.company.substring(0, 3).toUpperCase()
    });
    setActiveModal(null);
  };

  const handleStatusSave = () => {
    onUpdate({
      ...selectedApp,
      status: updateStatus,
      activities
    });
    setActiveModal(null);
  };

  const handleDeleteConfirm = () => {
    onDelete(selectedApp.id);
    setActiveModal(null);
  };

  return (
    <div className="pt-28 pb-20 px-6 max-w-screen-xl mx-auto min-h-screen">
      {/* Notification Banner */}
      {upcomingActivities.length > 0 && (
        <section className="mb-12 space-y-4">
          {upcomingActivities.map((activity, idx) => (
            <motion.div 
              key={activity.id || idx}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="signature-gradient p-6 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="bg-surface-container-lowest/20 p-3 rounded-full text-on-primary">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-on-primary font-bold text-lg">
                    {activity.name} {
                      (() => {
                        // Get current time in Bangkok
                        const bkkNow = new Date(now.getTime() + (7 * 60 * 60 * 1000));
                        const bkkActivity = new Date(activity.fullDate.getTime() + (7 * 60 * 60 * 1000));
                        
                        // Compare dates at midnight to determine day difference
                        const bkkNowMidnight = new Date(bkkNow.getUTCFullYear(), bkkNow.getUTCMonth(), bkkNow.getUTCDate());
                        const bkkActivityMidnight = new Date(bkkActivity.getUTCFullYear(), bkkActivity.getUTCMonth(), bkkActivity.getUTCDate());
                        
                        const dayDiff = Math.round((bkkActivityMidnight - bkkNowMidnight) / (1000 * 60 * 60 * 24));
                        
                        if (dayDiff === 0) return 'Today';
                        if (dayDiff === 1) return 'Tomorrow';
                        return `in ${dayDiff} days`;
                      })()
                    } at {activity.company}
                  </h4>
                  <p className="text-on-primary/80 text-sm">{activity.role} • {activity.time || 'All day'}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  const app = applications.find(a => a.company === activity.company);
                  if (app) handleUpdateClick(app);
                }}
                className="bg-surface-container-lowest text-primary font-bold py-3 px-8 rounded-full hover:opacity-90 transition-all text-sm whitespace-nowrap"
              >
                Update Status
              </button>
            </motion.div>
          ))}
        </section>
      )}

      {/* Header Actions */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface mb-2">My Applications</h1>
          <p className="text-on-surface-variant">Manage your journey to your dream career.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all shadow-sm border border-outline-variant/10 ${
                statusFilter === 'Applied' ? 'bg-blue-100 text-blue-900' :
                statusFilter === 'Interviewing' ? 'bg-purple-100 text-purple-900' :
                statusFilter === 'Accepted' ? 'bg-emerald-100 text-emerald-900' :
                statusFilter === 'Rejected' ? 'bg-red-100 text-red-900' :
                'bg-surface-container-low text-on-surface'
              }`}
            >
              {statusFilter}
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-surface rounded-2xl shadow-xl border border-outline-variant/10 p-4 z-20 space-y-1"
                  >
                    {[
                      { name: 'All Statuses', class: 'bg-surface-container-low text-on-surface' },
                      { name: 'Applied', class: 'bg-blue-100 text-blue-900' },
                      { name: 'Interviewing', class: 'bg-purple-100 text-purple-900' },
                      { name: 'Accepted', class: 'bg-emerald-100 text-emerald-900' },
                      { name: 'Rejected', class: 'bg-red-100 text-red-900' }
                    ].map((status) => (
                      <button
                        key={status.name}
                        onClick={() => {
                          setStatusFilter(status.name);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-80 active:scale-95 ${status.class}`}
                      >
                        {status.name}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          <button 
            onClick={onAddClick}
            className="bg-secondary text-on-primary px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:opacity-90 transition-all text-sm"
          >
            <Plus className="w-5 h-5" />
            Add Internship
          </button>
        </div>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredApplications.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant/20">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-on-surface mb-2">
              {searchQuery || statusFilter !== 'All Statuses' ? 'No matches found' : 'No applications yet'}
            </h3>
            <p className="text-on-surface-variant mb-8">
              {searchQuery || statusFilter !== 'All Statuses' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Start your journey by adding your first internship application.'}
            </p>
            {!(searchQuery || statusFilter !== 'All Statuses') && (
              <button 
                onClick={onAddClick}
                className="bg-primary text-on-primary px-10 py-4 rounded-full font-bold hover:shadow-lg transition-all"
              >
                Add Internship
              </button>
            )}
          </div>
        ) : (
          filteredApplications.map((app) => (
          <motion.div 
            key={app.id}
            whileHover={{ y: -4 }}
            className={`bg-surface-container-low rounded-lg p-8 flex flex-col gap-6 transition-all hover:bg-surface-container ${app.id === '4' ? 'lg:col-span-2' : ''}`}
          >
            <div className="flex justify-between items-start relative">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-surface-container-lowest rounded-md flex items-center justify-center shadow-sm overflow-hidden">
                  {app.logo ? (
                    <img src={app.logo} alt={app.company} className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                      <span className={`text-xl font-bold ${app.id === '3' ? 'text-red-500' : 'text-primary'}`}>{app.initial}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <span className={`text-xs font-bold px-4 py-1.5 rounded-full w-fit ${
                    app.status === 'Applied' ? 'bg-blue-100 text-blue-900 border border-blue-200' :
                    app.status === 'Interviewing' ? 'bg-purple-100 text-purple-900 border border-purple-200' :
                    app.status === 'Accepted' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                    app.status === 'Rejected' ? 'bg-red-100 text-red-900 border border-red-200' :
                    'bg-primary-container text-on-primary-container'
                  }`}>
                    {app.status}
                  </span>
                </div>
              </div>
              
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(activeMenu === app.id ? null : app.id);
                  }}
                  className="p-2 hover:bg-surface-container-highest rounded-full transition-colors text-on-surface-variant"
                >
                  <MoreHorizontal className="w-6 h-6" />
                </button>

                <AnimatePresence>
                  {activeMenu === app.id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/10 py-2 z-20 overflow-hidden"
                      >
                        <button 
                          onClick={() => handleEditClick(app)}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-surface-container transition-colors text-on-surface font-medium"
                        >
                          <Edit2 className="w-5 h-5 text-on-surface-variant" />
                          Edit
                        </button>
                        <button 
                          onClick={() => handleUpdateClick(app)}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-surface-container transition-colors text-on-surface font-medium"
                        >
                          <Presentation className="w-5 h-5 text-on-surface-variant" />
                          Update
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedApp(app);
                            setActiveModal('delete');
                            setActiveMenu(null);
                          }}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-surface-container transition-colors text-red-700 font-medium"
                        >
                          <Trash className="w-5 h-5" />
                          Delete
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className={app.id === '4' ? 'md:flex md:gap-8' : ''}>
              <div className={app.id === '4' ? 'md:w-1/3' : ''}>
                <h3 className="text-xl font-bold text-on-surface mb-1">{app.role}</h3>
                <p className="text-on-surface-variant text-sm font-medium mb-4">{app.company}</p>
                
                <div className="flex flex-wrap gap-4 text-xs font-medium text-on-surface-variant">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {app.location?.trim() || '-'}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CircleDollarSign className="w-3.5 h-3.5 " />
                    {app.salary?.trim() || '-'}
                  </div>
                  {app.schedule && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {app.schedule}
                    </div>
                  )}
                </div>
              </div>

              <div className={`mt-6 ${app.id === '4' ? 'md:mt-0 md:w-2/3' : ''}`}>
                <div className="bg-surface-container-lowest/60 rounded-md p-4 h-full">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Internal Notes</p>
                  <p className={`text-sm text-on-surface leading-relaxed word-wrap: break-word overflow-wrap: break-word ${app.id === '4' ? 'italic' : ''}`}>
                    {app.notes}
                  </p>
                  {app.tags && (
                    <div className="mt-4 flex gap-2">
                      {app.tags.map(tag => (
                        <span key={tag} className="inline-block px-3 py-1 bg-surface-container rounded-full text-[10px] font-bold text-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )))}
      </section>


      {/* Modals */}
      <Modal 
        isOpen={activeModal === 'edit'} 
        onClose={() => setActiveModal(null)} 
        title="Edit job details"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant px-1">Company</label>
            <input 
              type="text" 
              value={editFormData.company || ''}
              onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
              className="w-full bg-surface-container border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant px-1">Position</label>
            <input 
              type="text" 
              value={editFormData.role || ''}
              onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
              className="w-full bg-surface-container border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant px-1">Location</label>
            <div className="relative">
              <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
              <input 
                type="text" 
                value={editFormData.location || ''}
                onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                className="w-full bg-surface-container border-none rounded-2xl pl-14 pr-6 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant px-1">Salary</label>
            <div className="relative">
              <CircleDollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
              <input 
                type="text" 
                value={editFormData.salary || ''}
                onChange={(e) => setEditFormData({ ...editFormData, salary: e.target.value })}
                className="w-full bg-surface-container border-none rounded-2xl pl-14 pr-6 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant px-1">Notes</label>
            <textarea 
              value={editFormData.notes || ''}
              onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
              rows={3}
              className="w-full bg-surface-container border-none rounded-2xl px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
            />
          </div>
          <div className="flex gap-4 pt-6">
            <button 
              onClick={() => setActiveModal(null)}
              className="flex-1 bg-blue-100/50 text-blue-900 py-4 rounded-full font-bold text-lg hover:bg-blue-100 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleEditSave}
              className="flex-1 bg-blue-800 text-white py-4 rounded-full font-bold text-lg hover:bg-blue-900 shadow-lg transition-all"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'update'} 
        onClose={() => setActiveModal(null)} 
        title="Update status"
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-sm font-medium text-on-surface-variant px-1">Status</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Applied', class: 'bg-blue-100 text-blue-900 border-blue-200' },
                { name: 'Interviewing', class: 'bg-purple-100 text-purple-900 border-purple-200' },
                { name: 'Accepted', class: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
                { name: 'Rejected', class: 'bg-red-100 text-red-900 border-red-200' }
              ].map((status) => (
                <button
                  key={status.name}
                  type="button"
                  onClick={() => setUpdateStatus(status.name)}
                  className={`px-4 py-3 rounded-full text-sm font-bold transition-all border-2 ${
                    updateStatus === status.name 
                      ? `${status.class} shadow-md transform scale-[1.02]` 
                      : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container'
                  }`}
                >
                  {status.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {activities.map((activity, index) => (
              <div key={activity.id} className={`space-y-4 p-6 rounded-3xl transition-all ${activity.completed ? 'bg-surface-container-low opacity-60' : 'bg-surface-container'}`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <div className="flex items-center gap-3">
                      <button 
                        type="button"
                        onClick={() => handleActivityChange(activity.id, 'completed', !activity.completed)}
                        className={`transition-all hover:scale-110 active:scale-95 ${activity.completed ? 'text-emerald-700' : 'text-on-surface-variant/40'}`}
                      >
                        {activity.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                      </button>
                      <label className={`text-sm font-bold transition-all ${activity.completed ? 'text-emerald-700' : 'text-on-surface-variant'}`}>
                        {activity.completed ? 'Completed' : 'Upcoming Activity'}
                      </label>
                    </div>
                    <button onClick={() => removeActivity(activity.id)} className="text-on-surface-variant hover:text-red-500 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <input 
                    type="text" 
                    value={activity.name}
                    onChange={(e) => handleActivityChange(activity.id, 'name', e.target.value)}
                    placeholder="Activity name"
                    className={`w-full border-none rounded-full px-6 py-4 transition-all outline-none bg-surface-container-lowest ${activity.completed ? 'line-through text-on-surface-variant' : 'text-on-surface focus:ring-2 focus:ring-primary/20'}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface-variant px-1">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                      <input 
                        type="text" 
                        value={activity.date}
                        disabled={activity.completed}
                        onChange={(e) => handleActivityChange(activity.id, 'date', e.target.value)}
                        placeholder="DD/MM/YYYY"
                        className={`w-full border-none rounded-full pl-14 pr-6 py-4 transition-all outline-none bg-surface-container-lowest ${activity.completed ? 'text-on-surface-variant' : 'text-on-surface focus:ring-2 focus:ring-primary/20'}`}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface-variant px-1">Time</label>
                    <div className="relative">
                      <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                      <input 
                        type="text" 
                        value={activity.time}
                        disabled={activity.completed}
                        onChange={(e) => handleActivityChange(activity.id, 'time', e.target.value)}
                        placeholder="00:00"
                        className={`w-full border-none rounded-full pl-14 pr-6 py-4 transition-all outline-none bg-surface-container-lowest ${activity.completed ? 'text-on-surface-variant' : 'text-on-surface focus:ring-2 focus:ring-primary/20'}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-center pt-2">
              <button 
                onClick={addActivity}
                className="w-12 h-12 rounded-full bg-blue-100/50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-all shadow-sm"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => setActiveModal(null)}
              className="flex-1 bg-blue-100/50 text-blue-900 py-4 rounded-full font-bold text-lg hover:bg-blue-100 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleStatusSave}
              className="flex-1 bg-blue-800 text-white py-4 rounded-full font-bold text-lg hover:bg-blue-900 shadow-lg transition-all"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'delete'} 
        onClose={() => setActiveModal(null)} 
        title="Delete"
      >
        <div className="text-center space-y-8">
          <p className="text-xl text-on-surface-variant leading-relaxed">
            Are you sure you want to delete his career?<br />
            This action cannot be undone.
          </p>
          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => setActiveModal(null)}
              className="flex-1 bg-blue-100/50 text-blue-900 py-4 rounded-full font-bold text-lg hover:bg-blue-100 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleDeleteConfirm}
              className="flex-1 bg-red-500 text-white py-4 rounded-full font-bold text-lg hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
