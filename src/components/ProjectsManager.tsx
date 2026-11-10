import React, { useState } from 'react';
import type { Project, ProjectMilestone, CustomerRecord } from '../types';
import {
  HardHat,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
  AlertCircle,
  FileCheck,
  CheckSquare,
  Square,
  Sparkles,
} from 'lucide-react';

interface Props {
  projects: Record<string, Project>;
  customers: Record<string, CustomerRecord>;
  onSaveProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  editorName: string;
}

const DEFAULT_MILESTONES = [
  'Scope approval & planning',
  'Site readiness & procurement',
  'Implementation & installation',
  'Quality checks & validation',
  'Client sign-off & handover',
  'Final documentation & closure',
];

export const ProjectsManager: React.FC<Props> = ({
  projects,
  customers,
  onSaveProject,
  onDeleteProject,
  editorName,
}) => {
  const projectList = Object.values(projects);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(
    projectList[0]?.id || null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [projectName, setProjectName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [scope, setScope] = useState('Business project implementation and delivery scope');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetDate, setTargetDate] = useState(
    new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0]
  );
  const [leadEngineer, setLeadEngineer] = useState(editorName || 'Senior Project Lead');

  const activeProject = activeProjectId ? projects[activeProjectId] : projectList[0];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `proj_${Date.now()}`;
    const cust = customers[customerId];

    const milestones: ProjectMilestone[] = DEFAULT_MILESTONES.map((title, idx) => ({
      id: `ms_${idx}_${Date.now()}`,
      title,
      completed: false,
    }));

    const newProj: Project = {
      id,
      bizId: 'mourish_developers_hq',
      name: projectName.trim(),
      customerId,
      customerName: cust?.name || 'Business Client',
      scope: scope.trim(),
      startDate,
      targetDate,
      status: 'PLANNING',
      progress: 0,
      leadEngineer: leadEngineer.trim(),
      milestones,
      createdAt: Date.now(),
    };

    onSaveProject(newProj);
    setActiveProjectId(id);
    setIsCreateModalOpen(false);
  };

  const handleToggleMilestone = (milestoneId: string) => {
    if (!activeProject) return;
    const updatedMilestones = (activeProject.milestones || []).map((m) => {
      if (m.id === milestoneId) {
        return {
          ...m,
          completed: !m.completed,
          completedAt: !m.completed ? new Date().toISOString().split('T')[0] : undefined,
        };
      }
      return m;
    });

    const completedCount = updatedMilestones.filter((m) => m.completed).length;
    const progress = Math.round((completedCount / updatedMilestones.length) * 100);

    let status = activeProject.status;
    if (progress === 100) status = 'COMMISSIONED';
    else if (progress >= 75) status = 'PRESSURE_TESTING';
    else if (progress > 10) status = 'EXECUTION';
    else status = 'PLANNING';

    onSaveProject({
      ...activeProject,
      milestones: updatedMilestones,
      progress,
      status,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <HardHat className="w-5 h-5 text-amber-500" />
            <span>Project Portfolio & Work Orders</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track project milestones, execution progress, engineering lead assignments, and handover status.
          </p>
        </div>

        <button
          onClick={() => {
            const firstCust = Object.keys(customers)[0] || '';
            setCustomerId(firstCust);
            setProjectName('');
            setIsCreateModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-600/20 transition"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-4 p-5 rounded-[28px] liquid-card border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Active Projects</h3>
            <span className="text-xs text-slate-400 font-semibold">{projectList.length} Total</span>
          </div>

          <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
            {projectList.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No active projects. Click <strong>New Project</strong> to launch a work order.
              </div>
            ) : (
              projectList.map((p) => {
                const isSelected = activeProject?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setActiveProjectId(p.id)}
                    className={`p-3.5 rounded-2xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-900 dark:text-white truncate max-w-[180px]">{p.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] uppercase ${
                          p.status === 'COMMISSIONED'
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                            : p.status === 'PRESSURE_TESTING'
                            ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400'
                            : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 mt-1 truncate">
                      {p.customerName}
                    </div>

                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400">
                        <span>Milestones: {(p.milestones || []).filter((m) => m.completed).length}/{(p.milestones || []).length}</span>
                        <span className="text-amber-600 dark:text-amber-400">{p.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-300"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {activeProject ? (
          <div className="xl:col-span-8 p-6 lg:p-8 rounded-[32px] liquid-card border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {activeProject.status} · {activeProject.progress}% Handover Progress
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {activeProject.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Client: <strong className="text-slate-800 dark:text-slate-200">{activeProject.customerName}</strong> · Lead: <strong className="text-indigo-600">{activeProject.leadEngineer}</strong>
                </p>
              </div>

              <button
                onClick={() => onDeleteProject(activeProject.id)}
                className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs transition"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-slate-400">Scope & Deliverables</div>
                <div className="text-slate-800 dark:text-slate-200">{activeProject.scope}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-slate-400">Project Timeline</div>
                <div className="text-slate-700 dark:text-slate-300">
                  Started: <strong>{activeProject.startDate}</strong> · Target Handover: <strong>{activeProject.targetDate}</strong>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Project Execution Milestones
                </h4>
                <span className="text-xs text-amber-500 font-bold">
                  {(activeProject.milestones || []).filter((m) => m.completed).length} of {(activeProject.milestones || []).length} Verified
                </span>
              </div>

              <div className="space-y-2">
                {(activeProject.milestones || []).map((m, idx) => (
                  <div
                    key={m.id}
                    onClick={() => handleToggleMilestone(m.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between text-xs ${
                      m.completed
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {m.completed ? (
                        <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                      <div>
                        <span className={`font-semibold ${m.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                          Step {idx + 1}: {m.title}
                        </span>
                        {m.completedAt && (
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                            Completed on {m.completedAt}
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-slate-400">
                      {m.completed ? 'COMPLETED' : 'PENDING'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="xl:col-span-8 p-16 text-center rounded-[32px] liquid-card border border-slate-200 dark:border-slate-800 space-y-4">
            <HardHat className="w-12 h-12 text-slate-400 mx-auto" />
            <h4 className="font-bold text-base text-slate-900 dark:text-white">No Project Selected</h4>
            <p className="text-xs text-slate-500">Select a project from the list or launch a new one.</p>
          </div>
        )}

      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                New Project
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 text-xs font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Project Name *</label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Business Expansion Project"
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Business Client *</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  {Object.values(customers).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.company || c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Project Scope & Deliverables</label>
                <textarea
                  rows={2}
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  placeholder="e.g. Business implementation, onboarding, and delivery scope"
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Target Handover Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Lead Project Engineer</label>
                <input
                  type="text"
                  value={leadEngineer}
                  onChange={(e) => setLeadEngineer(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold"
                >
                  Create Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

