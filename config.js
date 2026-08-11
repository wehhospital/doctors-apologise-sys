// ==========================================
// 1. إعدادات الربط المباشر بـ Supabase
// ==========================================
const SUPABASE_URL = "https://nzdcdhjxpevtbfjbjviy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56ZGNkaGp4cGV2dGJmamJqdml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5NDk1OTEsImV4cCI6MjEwMTUyNTU5MX0.9Ne6YpZOONVyvqyaH66-MBJpsPw67rAqP_5ELZqJ-1Q";

function getSupabase() {
    if (window.supabaseClient) {
      return window.supabaseClient;
    }
  
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: {
            persistSession: true,
            autoRefreshToken: true
          }
        });
        return window.supabaseClient;
      } catch (err) {
        console.error("❌ حدث خطأ أثناء إنشاء اتصال Supabase:", err);
        return null;
      }
    }
    return null;
  }
  
  // الشارات الملونة
  const clinicBadges = {
      'عياده': '<span class="bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-1 rounded-full font-black text-xs md:text-sm shadow-sm inline-block">🟦 عياده</span>',
      'فحص': '<span class="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-full font-black text-xs md:text-sm shadow-sm inline-block">🟨 فحص</span>',
      'عمليات': '<span class="bg-purple-100 text-purple-800 border border-purple-300 px-2.5 py-1 rounded-full font-black text-xs md:text-sm shadow-sm inline-block">🟪 عمليات</span>'
  };
  
  const branchBadges = {
      'فرع الثورة': '<span class="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full font-black text-xs md:text-sm shadow-sm inline-block">🟩 فرع الثورة</span>',
      'فرع الحجاز': '<span class="bg-indigo-100 text-indigo-800 border border-indigo-300 px-2.5 py-1 rounded-full font-black text-xs md:text-sm shadow-sm inline-block">🟦 فرع الحجاز</span>',
      'فرع الغردقه': '<span class="bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-1 rounded-full font-black text-xs md:text-sm shadow-sm inline-block">🟥 فرع الغردقه</span>'
  };
  
  const rolesBadges = {
      admin: '<span class="text-red-700 bg-red-100 border border-red-200 px-2.5 py-1 rounded-full text-xs">🔴 مدير النظام</span>',
      editor: '<span class="text-blue-700 bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-full text-xs">🔵 مدخل بيانات</span>',
      callcenter: '<span class="text-purple-700 bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-full text-xs">🟣 كول سينتر</span>',
      viewer: '<span class="text-green-700 bg-green-100 border border-green-200 px-2.5 py-1 rounded-full text-xs">🟢 عرض فقط</span>'
  };
  
  // 2. دالة تشغيل صوت الإشعارات الافتراضي مع المانع الذكي للتكرار
  let lastSoundPlayTime = 0;
  
  function playNotificationSound() {
      const now = Date.now();
      // يمنع إعادة تشغيل الصوت إذا صدر أمر جديد خلال أقل من ثانيتين (2000ms)
      if (now - lastSoundPlayTime < 2000) {
          return;
      }
      lastSoundPlayTime = now;
  
      try {
          const audio = new Audio('./assets/mixkit-software-interface-start-2574.wav');
          audio.volume = 0.6;
          audio.play().catch(() => playFallbackChime());
      } catch (e) {
          playFallbackChime();
      }
  }
  
  function playFallbackChime() {
      try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return;
          const ctx = new AudioCtx();
  
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(1046.50, ctx.currentTime);
          gain1.gain.setValueAtTime(0.2, ctx.currentTime);
          gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
          osc1.connect(gain1);
          gain1.connect(ctx.destination);
          osc1.start(ctx.currentTime);
          osc1.stop(ctx.currentTime + 0.15);
  
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08);
          gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.08);
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start(ctx.currentTime + 0.08);
          osc2.stop(ctx.currentTime + 0.35);
      } catch (err) {
          console.log("Audio play error:", err);
      }
  }
  
  // 3. دالة إظهار البوب أب الملون
  function showToast(message, type = 'success') {
      const container = document.getElementById('toastContainer');
      if (!container) return;
  
      const toast = document.createElement('div');
      const bgClass = type === 'success' ? 'bg-emerald-600' : 'bg-red-600';
      toast.className = `${bgClass} text-white px-5 py-3 rounded-xl shadow-2xl font-bold text-sm flex items-center gap-2 transform transition-all duration-300 translate-y-5 opacity-0 border border-white/20`;
      toast.innerHTML = `<span>🔔</span> <span>${message}</span>`;
  
      container.appendChild(toast);
  
      setTimeout(() => toast.classList.remove('translate-y-5', 'opacity-0'), 50);
      setTimeout(() => {
          toast.classList.add('translate-y-5', 'opacity-0');
          setTimeout(() => toast.remove(), 300);
      }, 4000);
  }
  
  // 4. دالة فتح وإغلاق قائمة الإشعارات
  document.addEventListener('click', function(e) {
      const notifContainer = document.getElementById('notifContainer');
      const notifMenu = document.getElementById('notifMenu');
      if (notifContainer && notifMenu && !notifMenu.classList.contains('hidden')) {
          if (!notifContainer.contains(e.target)) {
              notifMenu.classList.add('hidden');
          }
      }
  });
  
  function toggleNotificationsMenu(e) {
      if (e) {
          e.preventDefault();
          e.stopPropagation();
      }
      const menu = document.getElementById('notifMenu');
      if (menu) {
          menu.classList.toggle('hidden');
      }
  }
  
  // 5. دالة التحقق من الجلسة والصلاحيات
  function checkAuth(requiredRole = null) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser) {
          window.location.href = 'login.html';
          return null;
      }
      if (requiredRole && currentUser.role !== requiredRole) {
          alert('عذراً، هذه الصفحة مخصصة لمدير النظام فقط!');
          window.location.href = 'index.html';
          return null;
      }
      return currentUser;
  }
  
  // تسجيل الخروج
  async function logout() {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser) {
          await createLog('تسجيل خروج', `قام (${currentUser.name}) بتسجيل الخروج من النظام`);
      }
      localStorage.removeItem('currentUser');
      window.location.href = 'login.html';
  }
  
  // 6. دالة تسجيل السجلات الشاملة
  async function createLog(actionType, details) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const userName = currentUser ? currentUser.name : (document.getElementById('username')?.value || 'مستخدم');
      
      const logEntry = {
          id: Date.now(),
          user_name: userName,
          action: actionType,
          details: details,
          created_at: new Date().toISOString()
      };
  
      let logs = JSON.parse(localStorage.getItem('appLogs')) || [];
      logs.unshift(logEntry);
      localStorage.setItem('appLogs', JSON.stringify(logs));
  
      const client = getSupabase();
      if (client) {
          const { error } = await client.from('audit_logs').insert([{
              user_name: userName,
              action: actionType,
              details: details
          }]);
          if (error) console.error("⚠️ خطأ حفظ اللوج:", error.message);
      }
  }
  
  // 7. إضافة إشعار أونلاين
  async function addNotification(text) {
      playNotificationSound();
      showToast(text, 'success');
  
      const client = getSupabase();
      if (client) {
          await client.from('notifications').insert([{
              text: text,
              is_read: false
          }]);
      }
  }
  
  async function fetchNotifications() {
      const client = getSupabase();
      let localNotifs = JSON.parse(localStorage.getItem('appNotifications')) || [];
  
      if (client) {
          const { data, error } = await client
              .from('notifications')
              .select('*')
              .order('created_at', { ascending: false });
  
          if (!error && data && data.length > 0) {
              notifications = data;
              localStorage.setItem('appNotifications', JSON.stringify(notifications));
          } else {
              notifications = localNotifs;
          }
      } else {
          notifications = localNotifs;
      }
  
      renderNotifications();
  }
  
  async function markAllNotificationsRead() {
      notifications.forEach(n => n.is_read = true);
      localStorage.setItem('appNotifications', JSON.stringify(notifications));
      renderNotifications();
  
      const client = getSupabase();
      if (client) {
          await client.from('notifications').update({ is_read: true }).neq('id', 0);
      }
  }
  
  function renderNotifications() {
      const list = document.getElementById('notifList');
      const badge = document.getElementById('notifBadge');
      if (!list) return;
  
      const unreadCount = notifications.filter(n => !n.is_read).length;
  
      if (unreadCount > 0) {
          badge.innerText = unreadCount;
          badge.classList.remove('hidden');
      } else {
          badge.classList.add('hidden');
      }
  
      list.innerHTML = '';
      if (notifications.length === 0) {
          list.innerHTML = `<div class="p-3 text-center text-gray-400 font-bold">لا توجد إشعارات حالياً</div>`;
          return;
      }
  
      notifications.forEach(n => {
          const timeFormatted = n.created_at ? new Date(n.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : '';
          const item = document.createElement('div');
          item.className = `p-2.5 rounded-lg border-b ${n.is_read ? 'bg-white text-gray-600' : 'bg-red-50 text-gray-900 font-bold border-red-100'}`;
          item.innerHTML = `
              <div class="flex justify-between items-start">
                  <span>${n.text}</span>
                  <span class="text-[10px] text-gray-400 mr-2">${timeFormatted}</span>
              </div>
          `;
          list.appendChild(item);
      });
  }