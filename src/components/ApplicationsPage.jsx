import React, { useState } from 'react';
import { MapPin, CircleDollarSign, Calendar, Clock, X, Plus, ChevronDown } from 'lucide-react';

export const ApplicationsPage = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    location: '',
    salary: '',
    notes: '',
    status: 'Applied'
  });
  const [activities, setActivities] = useState([{ id: 1, name: 'Close Applied', date: '', time: '' }]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addActivity = () => {
    setActivities([...activities, { id: Date.now(), name: '', date: '', time: '' }]);
  };

  const removeActivity = (id) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.role || !formData.company) return;

    const newApp = {
      ...formData,
      initial: formData.company.substring(0, 3).toUpperCase(),
      activities: activities
    };

    onAdd(newApp);
  };

  return (
    <div className="pt-28 pb-20 px-6 max-w-5xl mx-auto min-h-screen">
      <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface mb-10">Add Internship</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Info */}
        <div className="bg-surface-container-low rounded-3xl p-8 md:p-12 shadow-sm space-y-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant px-1">Position</label>
            <input 
              type="text" 
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              placeholder="Product design"
              className="w-full bg-surface-container border-none rounded-2xl px-6 py-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant px-1">Company</label>
            <input 
              type="text" 
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Adobe"
              className="w-full bg-surface-container border-none rounded-2xl px-6 py-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant px-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Bangkok"
                  className="w-full bg-surface-container border-none rounded-2xl pl-14 pr-6 py-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant px-1">Salary</label>
              <div className="relative">
                <CircleDollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                <input 
                  type="text" 
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="9,000,000"
                  className="w-full bg-surface-container border-none rounded-2xl pl-14 pr-6 py-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface-variant px-1">Notes</label>
            <textarea 
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Notes anything about company"
              rows={3}
              className="w-full bg-surface-container border-none rounded-2xl px-6 py-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
            />
          </div>
        </div>

        {/* Status & Activity */}
        <div className="bg-surface-container-low rounded-3xl p-8 md:p-12 shadow-sm space-y-8">
          <div className="space-y-4">
            <label className="text-sm font-medium text-on-surface-variant px-1">Status</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Applied', class: 'bg-blue-100 text-blue-900 border-blue-200' },
                { name: 'Interviewing', class: 'bg-purple-100 text-purple-900 border-purple-200' },
                { name: 'Accepted', class: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
                { name: 'Rejected', class: 'bg-red-100 text-red-900 border-red-200' }
              ].map((status) => (
                <button
                  key={status.name}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status: status.name }))}
                  className={`px-4 py-4 rounded-3xl text-sm font-bold transition-all border-2 flex items-center justify-center text-center ${
                    formData.status === status.name 
                      ? `${status.class} shadow-sm scale-[1.02]` 
                      : 'bg-surface-container border-transparent text-on-surface-variant hover:border-outline-variant/30'
                  }`}
                >
                  {status.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {activities.map((activity, index) => (
              <div key={activity.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                <div className="md:col-span-5 space-y-2">
                  {index === 0 && <label className="text-sm font-medium text-on-surface-variant px-1">Activity</label>}
                  <input 
                    type="text" 
                    value={activity.name}
                    onChange={(e) => {
                      const newActivities = [...activities];
                      newActivities[index].name = e.target.value;
                      setActivities(newActivities);
                    }}
                    placeholder="Activity name"
                    className="w-full bg-surface-container border-none rounded-2xl px-6 py-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  />
                </div>
                <div className="md:col-span-3 space-y-2">
                  {index === 0 && <label className="text-sm font-medium text-on-surface-variant px-1">Date</label>}
                  <div className="relative">
                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                    <input 
                      type="text" 
                      value={activity.date}
                      onChange={(e) => {
                        const newActivities = [...activities];
                        newActivities[index].date = e.target.value;
                        setActivities(newActivities);
                      }}
                      placeholder="DD/MM/YYYY"
                      className="w-full bg-surface-container border-none rounded-2xl pl-14 pr-6 py-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="md:col-span-3 space-y-2">
                  {index === 0 && <label className="text-sm font-medium text-on-surface-variant px-1">Time</label>}
                  <div className="relative">
                    <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
                    <input 
                      type="text" 
                      value={activity.time}
                      onChange={(e) => {
                        const newActivities = [...activities];
                        newActivities[index].time = e.target.value;
                        setActivities(newActivities);
                      }}
                      placeholder="00:00"
                      className="w-full bg-surface-container border-none rounded-2xl pl-14 pr-6 py-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="md:col-span-1 flex justify-center pb-4">
                  <button type="button" onClick={() => removeActivity(activity.id)} className="text-on-surface-variant hover:text-red-500 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
            
            <div className="flex justify-center pt-4">
              <button 
                type="button"
                onClick={addActivity}
                className="w-12 h-12 rounded-full bg-primary-container text-primary flex items-center justify-center hover:bg-primary-container/80 transition-all shadow-sm"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <button type="submit" className="bg-primary text-on-primary px-16 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:scale-105 transition-all shadow-md">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
