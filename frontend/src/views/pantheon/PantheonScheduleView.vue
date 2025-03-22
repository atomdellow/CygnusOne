<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePantheonStore } from '@/stores/pantheon';

const router = useRouter();
const pantheonStore = usePantheonStore();

const loading = ref(true);
const sources = ref([]);
const schedules = ref([]);
const isCreating = ref(false);
const editingSchedule = ref(null);

// Form for new/edit schedule
const scheduleForm = ref({
  sourceId: null,
  frequency: 'daily',
  time: '08:00',
  daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
  dayOfMonth: 1,
  active: true
});

// Days of the week for selection
const daysOfWeek = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
];

// Methods
const goBack = () => {
  router.push({ name: 'pantheon' });
};

const formatDateTime = (dateString) => {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleString();
};

const formatScheduleTime = (time) => {
  return time || 'Not set';
};

const formatScheduleDays = (schedule) => {
  if (schedule.frequency === 'daily') {
    return 'Every day';
  } else if (schedule.frequency === 'weekly' && schedule.daysOfWeek) {
    return schedule.daysOfWeek.map(day => 
      daysOfWeek.find(d => d.value === day)?.label
    ).join(', ');
  } else if (schedule.frequency === 'monthly' && schedule.dayOfMonth) {
    return `Day ${schedule.dayOfMonth} of each month`;
  }
  return 'Custom';
};

const getSourceName = (sourceId) => {
  const source = sources.value.find(s => s.id === sourceId);
  return source ? source.name : 'Unknown source';
};

const openCreateForm = () => {
  // Reset form
  scheduleForm.value = {
    sourceId: sources.value.length > 0 ? sources.value[0].id : null,
    frequency: 'daily',
    time: '08:00',
    daysOfWeek: [1, 2, 3, 4, 5],
    dayOfMonth: 1,
    active: true
  };
  
  editingSchedule.value = null;
  isCreating.value = true;
};

const openEditForm = (schedule) => {
  // Clone the schedule to the form
  scheduleForm.value = {
    sourceId: schedule.sourceId,
    frequency: schedule.frequency,
    time: schedule.time,
    daysOfWeek: schedule.daysOfWeek ? [...schedule.daysOfWeek] : [],
    dayOfMonth: schedule.dayOfMonth || 1,
    active: schedule.active
  };
  
  editingSchedule.value = schedule;
  isCreating.value = false;
};

const cancelForm = () => {
  editingSchedule.value = null;
  isCreating.value = false;
};

const saveSchedule = async () => {
  // Form validation
  if (!scheduleForm.value.sourceId || !scheduleForm.value.time) {
    return; // Basic validation
  }
  
  if (isCreating.value) {
    // Create new schedule
    await pantheonStore.addSchedule(scheduleForm.value);
  } else if (editingSchedule.value) {
    // Update existing schedule - would be implemented in a real app
    alert('Schedule updated!');
  }
  
  // Refresh the schedules list
  await loadData();
  
  // Close the form
  cancelForm();
};

const toggleDaySelection = (day) => {
  const index = scheduleForm.value.daysOfWeek.indexOf(day);
  
  if (index === -1) {
    scheduleForm.value.daysOfWeek.push(day);
  } else {
    scheduleForm.value.daysOfWeek.splice(index, 1);
  }
};

// Load data
const loadData = async () => {
  const sourcesData = await pantheonStore.fetchSources();
  sources.value = sourcesData.filter(s => s.active); // Only show active sources
  
  const schedulesData = await pantheonStore.fetchSchedules();
  schedules.value = schedulesData;
  
  loading.value = false;
};

onMounted(async () => {
  await loadData();
});
</script>

<template>
  <div class="pantheon-wrapper">
    <div class="pantheon-container">
      <div class="pantheon-header">
        <button @click="goBack" class="btn btn-back">← Back to Pantheon</button>
        <h1>Schedule Management</h1>
        <p class="pantheon-description">Configure automatic scraping schedules for your sources</p>
      </div>

      <div class="pantheon-content">
        <div v-if="loading" class="loading">
          Loading schedules...
        </div>
        
        <div v-else class="schedules-management">
          <div class="schedules-actions">
            <button @click="openCreateForm" class="btn btn-primary">Create New Schedule</button>
          </div>
          
          <div v-if="isCreating || editingSchedule" class="schedule-form-container">
            <div class="schedule-form">
              <h2>{{ isCreating ? 'Create Schedule' : 'Edit Schedule' }}</h2>
              
              <div class="form-group">
                <label for="sourceId">Source</label>
                <select 
                  id="sourceId" 
                  v-model="scheduleForm.sourceId"
                  class="form-control"
                  required
                >
                  <option v-for="source in sources" :key="source.id" :value="source.id">
                    {{ source.name }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="frequency">Frequency</label>
                <select 
                  id="frequency" 
                  v-model="scheduleForm.frequency"
                  class="form-control"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="time">Time</label>
                <input 
                  type="time" 
                  id="time" 
                  v-model="scheduleForm.time"
                  class="form-control"
                  required
                />
              </div>
              
              <div class="form-group" v-if="scheduleForm.frequency === 'weekly'">
                <label>Days of Week</label>
                <div class="days-selection">
                  <div 
                    v-for="day in daysOfWeek" 
                    :key="day.value"
                    class="day-option"
                    :class="{ selected: scheduleForm.daysOfWeek.includes(day.value) }"
                    @click="toggleDaySelection(day.value)"
                  >
                    {{ day.label.substring(0, 3) }}
                  </div>
                </div>
              </div>
              
              <div class="form-group" v-if="scheduleForm.frequency === 'monthly'">
                <label for="dayOfMonth">Day of Month</label>
                <input 
                  type="number" 
                  id="dayOfMonth" 
                  v-model.number="scheduleForm.dayOfMonth"
                  class="form-control"
                  min="1"
                  max="31"
                  required
                />
              </div>
              
              <div class="form-group checkbox-group">
                <input 
                  type="checkbox" 
                  id="active" 
                  v-model="scheduleForm.active"
                />
                <label for="active">Active</label>
              </div>
              
              <div class="form-actions">
                <button @click="cancelForm" class="btn btn-secondary">Cancel</button>
                <button @click="saveSchedule" class="btn btn-primary">
                  {{ isCreating ? 'Create Schedule' : 'Update Schedule' }}
                </button>
              </div>
            </div>
          </div>

          <div v-if="schedules.length === 0 && !isCreating" class="no-schedules">
            <p>No schedules found. Create a schedule to automate content scraping.</p>
          </div>
          
          <div v-else-if="!isCreating && !editingSchedule" class="schedules-list">
            <h2>Active Schedules</h2>
            
            <div class="schedules-table-container">
              <table class="schedules-table">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Frequency</th>
                    <th>Time</th>
                    <th>Next Run</th>
                    <th>Last Run</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="schedule in schedules.filter(s => s.active)" 
                    :key="schedule.id"
                    class="schedule-row"
                  >
                    <td>{{ getSourceName(schedule.sourceId) }}</td>
                    <td>{{ schedule.frequency }}</td>
                    <td>{{ formatScheduleTime(schedule.time) }}</td>
                    <td>{{ formatDateTime(schedule.nextRun) }}</td>
                    <td>{{ formatDateTime(schedule.lastRun) }}</td>
                    <td>
                      <span class="status-badge active">Active</span>
                    </td>
                    <td>
                      <button @click="openEditForm(schedule)" class="btn-icon">✏️</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div v-if="schedules.some(s => !s.active)">
              <h2>Inactive Schedules</h2>
              
              <div class="schedules-table-container">
                <table class="schedules-table">
                  <thead>
                    <tr>
                      <th>Source</th>
                      <th>Frequency</th>
                      <th>Time</th>
                      <th>Last Run</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr 
                      v-for="schedule in schedules.filter(s => !s.active)" 
                      :key="schedule.id"
                      class="schedule-row inactive"
                    >
                      <td>{{ getSourceName(schedule.sourceId) }}</td>
                      <td>{{ schedule.frequency }}</td>
                      <td>{{ formatScheduleTime(schedule.time) }}</td>
                      <td>{{ formatDateTime(schedule.lastRun) }}</td>
                      <td>
                        <span class="status-badge inactive">Inactive</span>
                      </td>
                      <td>
                        <button @click="openEditForm(schedule)" class="btn-icon">✏️</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pantheon-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.pantheon-container {
  width: 100%;
  max-width: 1160px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.pantheon-header {
  margin-bottom: 2rem;
}

.pantheon-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.pantheon-description {
  color: var(--text-color-muted);
}

.btn-back {
  background-color: transparent;
  color: var(--primary-color);
  padding: 0.5rem 0;
  margin-bottom: 1rem;
  display: inline-flex;
  align-items: center;
}

.btn-back:hover {
  background-color: transparent;
  color: #3c6bcf;
}

.pantheon-content {
  background-color: var(--bg-color-light);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 2rem;
}

.schedules-actions {
  margin-bottom: 2rem;
}

.schedule-form-container {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.schedule-form h2 {
  margin-bottom: 1.5rem;
}

.days-selection {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.day-option {
  padding: 0.5rem;
  border-radius: var(--border-radius);
  background-color: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all var(--transition-speed);
}

.day-option:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.day-option.selected {
  background-color: rgba(67, 255, 175, 0.1);
  color: var(--highlight-color);
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.checkbox-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.schedules-table-container {
  overflow-x: auto;
  margin-bottom: 2rem;
}

.schedules-table {
  width: 100%;
  border-collapse: collapse;
  color: white;
}

.schedules-table th,
.schedules-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.schedules-table th {
  background-color: rgba(0, 0, 0, 0.2);
}

.schedule-row.inactive {
  opacity: 0.7;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--border-radius);
  transition: background-color var(--transition-speed);
}

.btn-icon:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.status-badge {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: var(--border-radius);
  font-size: 0.8rem;
}

.status-badge.active {
  background-color: rgba(67, 255, 175, 0.1);
  color: var(--highlight-color);
}

.status-badge.inactive {
  background-color: rgba(255, 107, 107, 0.1);
  color: var(--accent-color);
}

.no-schedules {
  text-align: center;
  padding: 3rem 0;
  color: var(--text-color-muted);
}

.loading {
  text-align: center;
  padding: 3rem 0;
  color: var(--text-color-muted);
}

@media (max-width: 992px) {
  .schedules-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .schedules-actions button {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions button {
    width: 100%;
  }
  
  .days-selection {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
