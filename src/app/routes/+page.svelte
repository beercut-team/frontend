<script lang="ts">
  import { onMount } from 'svelte';

  let code = $state('');
  let statusDone = $state(false);

  const districts = [
    'Мирнинский','Нюрбинский','Ленский','Верхоянский','Оймяконский',
    'Алданский','Нерюнгринский','Намский','Хангаласский','Амгинский',
    'Олёкминский','Сунтарский','Вилюйский','Горный','Таттинский',
    'Усть-Алданский','Мегино-Кангаласский'
  ];

  const faqs = [
    { q: 'Нужно ли специальное оборудование?', a: 'Нет. Достаточно любого смартфона или компьютера с браузером. Система работает даже при низкой скорости интернета и поддерживает офлайн-режим.' },
    { q: 'Как пациент узнаёт о готовности?', a: 'Система отправляет уведомление через Telegram-бот. Пациент также может самостоятельно проверить статус по коду, выданному районным врачом.' },
    { q: 'Кто имеет доступ к медицинским данным?', a: 'Только авторизованные врачи: районный офтальмолог и куратор-хирург ЯРОКБ. Все данные хранятся в соответствии с 152-ФЗ и 323-ФЗ.' },
    { q: 'Что делать, если районный врач не выдал маршрутный лист?', a: 'Обратитесь в регистратуру ЯРОКБ по телефону +7 (4112) 40-12-70 или напишите на электронную почту поддержки.' },
  ];

  let openFaq = $state<number | null>(null);

  // Eye cursor tracking
  let eyeContainer: HTMLDivElement | null = $state(null);
  let pupilOffsetX = $state(0);
  let pupilOffsetY = $state(0);

  onMount(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!eyeContainer) return;

      const rect = eyeContainer.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      // Calculate vector from eye center to cursor
      const deltaX = e.clientX - eyeCenterX;
      const deltaY = e.clientY - eyeCenterY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Maximum pupil movement (iris radius - pupil radius, scaled to SVG coordinates)
      const maxMovement = 38;

      if (distance > 0) {
        // Normalize and scale to max movement
        const scale = Math.min(distance / 200, 1);
        pupilOffsetX = (deltaX / distance) * maxMovement * scale;
        pupilOffsetY = (deltaY / distance) * maxMovement * scale;
      }
    };

    const handleMouseLeave = () => {
      pupilOffsetX = 0;
      pupilOffsetY = 0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  });
</script>

<svelte:head>
  <title>Окулус-Фельдшер — ЯРОКБ Якутия</title>
  <meta name="description" content="Цифровая платформа для удалённой подготовки пациентов к офтальмологическим операциям. ЯРОКБ, Республика Саха (Якутия)."/>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link href="https://fonts.googleapis.com/css2?family=Onest:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
</svelte:head>

<!-- ═══ HERO ═══ -->
<section class="relative overflow-hidden bg-background" style="min-height:calc(100vh - 62px); font-family: 'Onest', sans-serif;">

  <!-- BG dot grid -->
  <svg class="absolute inset-0 w-full h-full pointer-events-none" style="opacity:.028" xmlns="http://www.w3.org/2000/svg">
    <defs><pattern id="hd" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" class="text-primary"/></pattern></defs>
    <rect width="100%" height="100%" fill="url(#hd)"/>
  </svg>
  <!-- BG blobs -->
  <div class="absolute pointer-events-none opacity-40" style="width:620px;height:620px;top:-180px;left:-160px;border-radius:60% 40% 70% 30%/50% 60% 40% 50%;background:radial-gradient(circle,oklch(0.8 0.1 250) 0%,transparent 68%)"></div>
  <div class="absolute pointer-events-none opacity-30" style="width:500px;height:500px;bottom:-130px;right:-120px;border-radius:70% 30% 55% 45%/40% 65% 35% 60%;background:radial-gradient(circle,oklch(0.9 0.05 250) 0%,transparent 68%)"></div>

  <div class="relative z-10 max-w-7xl mx-auto px-5 lg:px-12 w-full grid lg:grid-cols-2 gap-16 items-center" style="min-height:calc(100vh - 62px)">

    <!-- LEFT -->
    <div class="flex flex-col gap-8 py-16">
      <div class="flex gap-2 flex-wrap">
        <span class="pill"><span class="w-1.5 h-1.5 rounded-full bg-primary blink inline-block"></span>ЯРОКБ · Якутия</span>
        <span class="pill pill-green"><span class="w-1.5 h-1.5 rounded-full bg-success inline-block blink"></span>Система онлайн</span>
      </div>

      <div>
        <h1 class="font-black text-foreground mb-4" style="font-size:clamp(38px,4.6vw,62px);line-height:1.06;letter-spacing:-.025em">
          Офтальмология<br>
          <span class="relative inline-block text-primary">
            без поездок
            <svg class="absolute w-full" style="bottom:-3px;left:0;height:10px" viewBox="0 0 300 12" fill="none" preserveAspectRatio="none">
              <path d="M3 9Q40 3 78 9Q116 15 154 9Q192 3 230 9Q268 15 297 9" stroke="oklch(0.8 0.1 250)" stroke-width="3" stroke-linecap="round" fill="none"/>
            </svg>
          </span><br>в Якутск
        </h1>
        <p class="text-muted-foreground text-[17px] leading-relaxed max-w-[430px]">
          Районный врач готовит пациента на месте — хирург ЯРОКБ проверяет данные онлайн. В город только на саму операцию.
        </p>
      </div>

      <div class="flex gap-3 flex-wrap">
        <a href="#login" class="btn btn-primary btn-lg">
          Войти в систему
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
        </a>
        <a href="#status" class="btn btn-ghost btn-lg">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7 7 0 1010 17a7 7 0 006.65-4.35z"/></svg>
          Статус пациента
        </a>
      </div>

      <div class="flex items-center gap-6 pt-1">
        <div>
          <div class="font-black text-primary leading-none" style="font-size:34px">36<span style="font-size:22px">+</span></div>
          <div class="text-[12px] text-muted-foreground mt-1 font-medium">районов Якутии</div>
        </div>
        <div class="w-px h-11 bg-border"></div>
        <div>
          <div class="font-black text-foreground leading-none" style="font-size:34px">3 000</div>
          <div class="text-[12px] text-muted-foreground mt-1 font-medium">пациентов в год</div>
        </div>
        <div class="w-px h-11 bg-border"></div>
        <div>
          <div class="font-black text-foreground leading-none" style="font-size:34px">×3</div>
          <div class="text-[12px] text-muted-foreground mt-1 font-medium">быстрее маршрут</div>
        </div>
      </div>
    </div>

    <!-- RIGHT: 3D Eye -->
    <div class="flex flex-col items-center gap-4 py-10">
      <div bind:this={eyeContainer} class="relative" style="width:420px;height:420px;flex-shrink:0">

        <!-- Orbit ring -->
        <div class="absolute inset-4 rounded-full pointer-events-none border border-dashed border-primary/30"></div>

        <!-- Orbit dots -->
        <div class="hero-orb hero-orb1"></div>
        <div class="hero-orb hero-orb2"></div>
        <div class="hero-orb hero-orb3"></div>

        <!-- SVG Eye -->
        <svg class="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 420 420" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="hsg" cx="38%" cy="32%" r="62%"><stop offset="0%" stop-color="#ffffff"/><stop offset="45%" stop-color="#f5f8ff"/><stop offset="80%" stop-color="#e8f0ff"/><stop offset="100%" stop-color="#d8e6ff"/></radialGradient>
            <radialGradient id="hig" cx="38%" cy="32%" r="65%"><stop offset="0%" stop-color="#5B8FF8"/><stop offset="25%" stop-color="#2563EB"/><stop offset="55%" stop-color="#1A56DB"/><stop offset="78%" stop-color="#1038A8"/><stop offset="100%" stop-color="#071E6E"/></radialGradient>
            <radialGradient id="hir" cx="50%" cy="50%" r="50%"><stop offset="70%" stop-color="transparent"/><stop offset="100%" stop-color="rgba(4,12,50,0.55)"/></radialGradient>
            <radialGradient id="hpg" cx="38%" cy="32%" r="65%"><stop offset="0%" stop-color="#1e2d5a"/><stop offset="60%" stop-color="#0a1530"/><stop offset="100%" stop-color="#020509"/></radialGradient>
            <radialGradient id="hprg" cx="50%" cy="50%" r="50%"><stop offset="60%" stop-color="transparent"/><stop offset="100%" stop-color="rgba(26,86,219,0.5)"/></radialGradient>
            <radialGradient id="hhl" cx="28%" cy="22%" r="55%"><stop offset="0%" stop-color="rgba(255,255,255,1)"/><stop offset="45%" stop-color="rgba(255,255,255,0.5)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></radialGradient>
            <radialGradient id="hlmb" cx="50%" cy="50%" r="50%"><stop offset="72%" stop-color="transparent"/><stop offset="100%" stop-color="rgba(8,20,80,0.7)"/></radialGradient>
            <filter id="heshadow" x="-20%" y="-15%" width="140%" height="145%"><feDropShadow dx="0" dy="16" stdDeviation="22" flood-color="rgba(26,86,219,0.22)"/><feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(15,21,35,0.10)"/></filter>
            <filter id="higlow" x="-15%" y="-15%" width="130%" height="130%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <clipPath id="hec"><path d="M55,210 Q105,108 210,108 Q315,108 365,210 Q315,312 210,312 Q105,312 55,210Z"/></clipPath>
            <clipPath id="hic"><circle cx="210" cy="210" r="80"/></clipPath>
          </defs>
          <circle cx="210" cy="210" r="156" fill="rgba(195,217,255,0.28)" class="hero-ring-p"/>
          <path d="M55,210 Q105,108 210,108 Q315,108 365,210 Q315,312 210,312 Q105,312 55,210Z" fill="url(#hsg)" filter="url(#heshadow)"/>
          <g clip-path="url(#hec)" opacity=".14">
            <path d="M75,205 Q108,192 140,200" stroke="#DC2626" stroke-width=".9" fill="none"/>
            <path d="M72,217 Q106,228 138,218" stroke="#DC2626" stroke-width=".7" fill="none"/>
            <path d="M295,198 Q322,186 350,196" stroke="#DC2626" stroke-width=".8" fill="none"/>
          </g>
          <g clip-path="url(#hec)">
            <circle cx="210" cy="210" r="82" fill="url(#hig)" filter="url(#higlow)"/>
            <g class="hero-iris-r" style="transform-origin:210px 210px" opacity=".28">
              <line x1="210" y1="210" x2="292" y2="210" stroke="rgba(255,255,255,.9)" stroke-width=".9"/>
              <line x1="210" y1="210" x2="281" y2="257" stroke="rgba(255,255,255,.9)" stroke-width=".9"/>
              <line x1="210" y1="210" x2="251" y2="291" stroke="rgba(255,255,255,.9)" stroke-width=".9"/>
              <line x1="210" y1="210" x2="210" y2="292" stroke="rgba(255,255,255,.9)" stroke-width=".9"/>
              <line x1="210" y1="210" x2="169" y2="291" stroke="rgba(255,255,255,.9)" stroke-width=".9"/>
              <line x1="210" y1="210" x2="139" y2="257" stroke="rgba(255,255,255,.9)" stroke-width=".9"/>
              <line x1="210" y1="210" x2="128" y2="210" stroke="rgba(255,255,255,.9)" stroke-width=".9"/>
              <line x1="210" y1="210" x2="139" y2="163" stroke="rgba(255,255,255,.9)" stroke-width=".9"/>
              <line x1="210" y1="210" x2="169" y2="129" stroke="rgba(255,255,255,.9)" stroke-width=".9"/>
              <line x1="210" y1="210" x2="210" y2="128" stroke="rgba(255,255,255,.9)" stroke-width=".9"/>
              <line x1="210" y1="210" x2="251" y2="129" stroke="rgba(255,255,255,.9)" stroke-width=".9"/>
              <line x1="210" y1="210" x2="281" y2="163" stroke="rgba(255,255,255,.9)" stroke-width=".9"/>
            </g>
            <g class="hero-iris-r2" style="transform-origin:210px 210px" opacity=".18">
              <line x1="210" y1="210" x2="292" y2="196" stroke="rgba(255,255,255,.8)" stroke-width=".7"/>
              <line x1="210" y1="210" x2="272" y2="248" stroke="rgba(255,255,255,.8)" stroke-width=".7"/>
              <line x1="210" y1="210" x2="234" y2="286" stroke="rgba(255,255,255,.8)" stroke-width=".7"/>
              <line x1="210" y1="210" x2="175" y2="284" stroke="rgba(255,255,255,.8)" stroke-width=".7"/>
              <line x1="210" y1="210" x2="140" y2="258" stroke="rgba(255,255,255,.8)" stroke-width=".7"/>
              <line x1="210" y1="210" x2="128" y2="200" stroke="rgba(255,255,255,.8)" stroke-width=".7"/>
              <line x1="210" y1="210" x2="148" y2="162" stroke="rgba(255,255,255,.8)" stroke-width=".7"/>
              <line x1="210" y1="210" x2="186" y2="132" stroke="rgba(255,255,255,.8)" stroke-width=".7"/>
              <line x1="210" y1="210" x2="248" y2="134" stroke="rgba(255,255,255,.8)" stroke-width=".7"/>
              <line x1="210" y1="210" x2="280" y2="162" stroke="rgba(255,255,255,.8)" stroke-width=".7"/>
            </g>
            <g class="hero-iris-r" style="transform-origin:210px 210px">
              <circle cx="210" cy="210" r="56" fill="none" stroke="rgba(255,255,255,.20)" stroke-width="2.5" stroke-dasharray="7 5"/>
            </g>
            <circle cx="210" cy="210" r="82" fill="url(#hlmb)"/>
            <circle cx="210" cy="210" r="82" fill="none" stroke="rgba(6,18,76,0.65)" stroke-width="4"/>
            <g class="hero-pupil-b" style="transform-origin:210px 210px; transform: translate({pupilOffsetX}, {pupilOffsetY}); transition: transform 0.15s ease-out;">
              <circle cx="210" cy="210" r="44" fill="url(#hpg)"/>
              <circle cx="210" cy="210" r="44" fill="url(#hprg)"/>
              <circle cx="210" cy="210" r="36" fill="rgba(2,5,10,0.5)"/>
            </g>
            <g clip-path="url(#hic)">
              <g class="hero-scan" style="transform-origin:210px 210px; transform: translate({pupilOffsetX}, {pupilOffsetY}); transition: transform 0.15s ease-out;">
                <rect x="130" y="209" width="160" height="2" rx="1" fill="rgba(147,197,253,0.75)"/>
                <rect x="130" y="205" width="160" height="10" rx="5" fill="rgba(147,197,253,0.15)"/>
              </g>
            </g>
            <g style="transform: translate({pupilOffsetX}, {pupilOffsetY}); transition: transform 0.15s ease-out;">
              <ellipse cx="186" cy="182" rx="22" ry="14" fill="url(#hhl)" transform="rotate(-25,186,182)"/>
              <circle cx="196" cy="186" r="3.5" fill="rgba(255,255,255,0.9)"/>
            </g>
          </g>
          <path d="M55,210 Q105,108 210,108 Q315,108 365,210" fill="none" stroke="rgba(15,21,35,0.08)" stroke-width="20" stroke-linecap="round"/>
          <path d="M55,210 Q105,108 210,108 Q315,108 365,210" fill="none" stroke="rgba(15,21,35,0.13)" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M55,210 Q105,312 210,312 Q315,312 365,210" fill="none" stroke="rgba(15,21,35,0.09)" stroke-width="1.5" stroke-linecap="round"/>
          <ellipse cx="55" cy="210" rx="6" ry="5" fill="rgba(220,100,100,0.18)"/>
          <ellipse cx="365" cy="210" rx="5" ry="4" fill="rgba(200,90,90,0.12)"/>
        </svg>

        <!-- Floating cards -->
        <div class="card-white hero-fa" style="position:absolute;top:28px;left:-24px;padding:11px 14px;display:flex;align-items:center;gap:9px;box-shadow:0 6px 24px rgba(15,21,35,.09);min-width:158px">
          <div class="w-2 h-2 rounded-full bg-success flex-shrink-0 blink"></div>
          <div><div class="font-bold text-[12px] text-foreground">Готов к операции</div><div class="text-[10px] text-muted-foreground">15 мая · 10:00</div></div>
        </div>
        <div class="card-white hero-fb" style="position:absolute;top:24px;right:-20px;padding:11px 16px;box-shadow:0 6px 24px rgba(15,21,35,.09)">
          <div class="text-[10px] text-muted-foreground font-bold uppercase tracking-wide mb-1" style="letter-spacing:.06em">ИОЛ · SRK/T</div>
          <div class="font-black text-primary" style="font-size:24px;line-height:1">+21.5 D</div>
        </div>
        <div class="card-white hero-fc" style="position:absolute;bottom:36px;right:-28px;padding:11px 14px;display:flex;align-items:center;gap:10px;box-shadow:0 6px 24px rgba(15,21,35,.09)">
          <div class="ibox-sm bg-primary/10 shrink-0">
            <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
          <div><div class="font-black text-primary" style="font-size:20px;line-height:1">36+</div><div class="text-[10px] text-muted-foreground">районов</div></div>
        </div>
        <div class="card-white hero-fd" style="position:absolute;bottom:44px;left:-22px;padding:11px 14px;display:flex;align-items:center;gap:9px;box-shadow:0 6px 24px rgba(15,21,35,.09);max-width:170px">
          <div style="width:30px;height:30px;border-radius:50%;background:#2AABEE;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.448 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.834.941z"/></svg>
          </div>
          <div class="text-[11px] text-foreground leading-snug">✅ Приезжайте<br><strong>15 мая</strong> в 10:00</div>
        </div>
      </div>

      <!-- Bottom widgets -->
      <div class="grid grid-cols-2 gap-3" style="width:420px">
        <div id="status" class="card p-4 flex flex-col gap-2.5">
          <div><div class="font-bold text-[13px] text-foreground">Статус пациента</div><div class="text-[11px] text-muted-foreground">Код от врача</div></div>
          <div class="flex gap-1.5">
            <input bind:value={code} type="text" placeholder="KOD-XXXX" maxlength="8"
                   class="inp font-mono tracking-widest uppercase flex-1" style="font-size:12px;padding:9px 12px"/>
            <button onclick={() => statusDone = true} class="btn btn-primary shrink-0" style="padding:9px 11px;border-radius:10px" aria-label="Проверить статус">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </button>
          </div>
          {#if statusDone}
          <div class="flex items-center gap-2 p-2.5 rounded-xl border border-emerald-500 bg-emerald-500/10">
            <div class="w-2 h-2 rounded-full bg-success shrink-0"></div>
            <div><div class="font-bold text-[11px] text-foreground">Готов к операции</div><div class="text-[10px] text-muted-foreground">15 мая, 10:00</div></div>
            <span class="pill pill-green ml-auto" style="font-size:9px;padding:2px 7px">Зелёный</span>
          </div>
          {/if}
        </div>
        <div class="card-white p-4 flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <div class="font-bold text-[13px] text-foreground">ИОЛ-калькулятор</div>
            <span class="pill text-[9px]" style="padding:2px 8px">SRK/T</span>
          </div>
          <div class="grid gap-0.5" style="grid-template-columns:auto auto;font-size:11px">
            <span class="text-muted-foreground">K1/K2</span><span class="font-mono font-semibold text-foreground text-right">43.5/44.2</span>
            <span class="text-muted-foreground">Ось</span><span class="font-mono font-semibold text-foreground text-right">23.8 мм</span>
          </div>
          <div class="flex items-center justify-between rounded-xl bg-primary/10 p-2.5">
            <span class="text-[11px] text-primary font-semibold">Результат</span>
            <span class="font-black text-[20px] text-primary">+21.5 D</span>
          </div>
        </div>
      </div>
    </div><!-- end right -->
  </div>
</section>


<!-- ═══ HOW IT WORKS ═══ -->
<section id="how" class="sec bg-surface">
  <div class="max-w-7xl mx-auto px-5 lg:px-8">
    <div class="mb-10">
      <div class="pill mb-3">Как работает</div>
      <h2 class="font-black text-[28px] lg:text-[34px] text-foreground">Три шага к операции</h2>
      <p class="text-muted-foreground text-[14px] mt-2 max-w-lg">Единый цифровой маршрут от сбора анализов в районе до операционного стола в Якутске</p>
    </div>

    <div class="grid md:grid-cols-3 gap-5">
      <!-- Step 1 -->
      <div class="card-white p-7 flex flex-col gap-5">
        <div class="flex items-center gap-3">
          <div class="step-n">01</div>
          <div>
            <div class="text-[11px] text-primary font-bold uppercase tracking-widest">Район</div>
            <div class="font-bold text-[16px] text-foreground">Районный врач</div>
          </div>
        </div>
        <p class="text-muted-foreground text-[14px] leading-relaxed">
          Офтальмолог в районной больнице регистрирует пациента, заполняет цифровой чек-лист и загружает результаты обследований прямо через браузер.
        </p>
        <div class="space-y-2">
          <div class="check-row"><span class="dot-blue"></span>Регистрация пациента</div>
          <div class="check-row"><span class="dot-blue"></span>Чек-лист подготовки</div>
          <div class="check-row"><span class="dot-blue"></span>Загрузка анализов и снимков</div>
          <div class="check-row"><span class="dot-blue"></span>Офлайн-режим — синхронизация при сети</div>
        </div>
        <div class="pt-4 border-t border-border">
          <div class="text-[12px] text-muted-foreground mb-2">Цветовой статус пациента:</div>
          <div class="flex gap-2 flex-wrap">
            <span class="pill pill-red text-[11px]">Красный — неполные данные</span>
            <span class="pill pill-amber text-[11px]">Жёлтый — в подготовке</span>
            <span class="pill pill-green text-[11px]">Зелёный — готов</span>
          </div>
        </div>
      </div>

      <!-- Step 2 — highlighted -->
      <div class="flex flex-col gap-0 rounded-[20px] overflow-hidden border-2 border-primary/30">
        <div class="bg-primary/10 px-7 pt-7 pb-5 flex flex-col gap-4 flex-1">
          <div class="flex items-center gap-3">
            <div class="step-n step-n-active">02</div>
            <div>
              <div class="text-[11px] text-primary font-bold uppercase tracking-widest">ЯРОКБ, Якутск</div>
              <div class="font-bold text-[16px] text-foreground">Хирург-куратор</div>
            </div>
          </div>
          <p class="text-muted-foreground text-[14px] leading-relaxed">
            Видит ленту пациентов из всех районов. Просматривает загруженные документы. Подтверждает готовность или пишет замечания районному коллеге.
          </p>
          <div class="space-y-2">
            <div class="check-row"><span class="dot-blue"></span>Лента всех районов в одном окне</div>
            <div class="check-row"><span class="dot-blue"></span>Просмотр снимков и результатов</div>
            <div class="check-row"><span class="dot-blue"></span>Подтверждение и назначение даты</div>
            <div class="check-row"><span class="dot-blue"></span>Комментарии — обратная связь врачу</div>
          </div>
        </div>
        <div class="bg-background px-7 py-5 border-t border-primary/30">
          <div class="bg-muted rounded-2xl p-4 flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div>
              <div class="text-[13px] font-bold text-foreground">Подтвердить готовность</div>
              <div class="text-[12px] text-muted-foreground">Назначить дату: 15 мая, 10:00</div>
            </div>
            <button class="btn btn-primary ml-auto text-[12px] px-3 py-2 rounded-[10px]">✓</button>
          </div>
        </div>
      </div>

      <!-- Step 3 -->
      <div class="card-white p-7 flex flex-col gap-5">
        <div class="flex items-center gap-3">
          <div class="step-n">03</div>
          <div>
            <div class="text-[11px] text-primary font-bold uppercase tracking-widest">Пациент</div>
            <div class="font-bold text-[16px] text-foreground">Житель района</div>
          </div>
        </div>
        <p class="text-muted-foreground text-[14px] leading-relaxed">
          Видит статус в личном кабинете или по коду. Получает уведомление в Telegram. Едет в Якутск один раз — сразу на операцию.
        </p>
        <div class="bg-muted rounded-2xl p-4 flex-1">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-7 h-7 rounded-full bg-[#2AABEE] flex items-center justify-center shrink-0">
              <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.448 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.834.941z"/>
              </svg>
            </div>
            <div class="text-[12px] font-bold text-foreground">Окулус-Фельдшер</div>
            <div class="text-[11px] text-muted-foreground ml-auto">бот</div>
          </div>
          <div class="space-y-2.5">
            <div>
              <div class="tg-bubble">✅ <strong>Готовы к операции!</strong><br/>Приезжайте <span class="text-primary font-semibold">15 мая в 10:00</span>. Возьмите паспорт и полис ОМС.</div>
              <div class="text-[10px] text-muted-foreground mt-1 pl-1">14:23</div>
            </div>
            <div>
              <div class="tg-bubble">⏰ Напоминание: завтра операция.<br/>Не ешьте с 22:00 сегодня.</div>
              <div class="text-[10px] text-muted-foreground mt-1 pl-1">20:00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


<!-- ═══ FEATURES ═══ -->
<section id="features" class="sec bg-background">
  <div class="max-w-7xl mx-auto px-5 lg:px-8">
    <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10">
      <div>
        <div class="pill mb-3">Возможности</div>
        <h2 class="font-black text-[28px] lg:text-[34px] text-foreground">Всё нужное — в одной системе</h2>
      </div>
      <p class="text-muted-foreground text-[14px] max-w-xs">Создано для условий Якутии: слабый интернет, большие расстояния, возрастные врачи</p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div class="card-white p-6 flex flex-col gap-4">
        <div class="ibox">
          <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
          </svg>
        </div>
        <div>
          <div class="font-bold text-[15px] text-foreground mb-1">Цифровой чек-лист подготовки</div>
          <p class="text-muted-foreground text-[13px] leading-relaxed">Протокол под каждый тип операции: факоэмульсификация, антиглаукоматозная и другие. Анализы, ЭКГ, флюорография — с загрузкой файлов.</p>
        </div>
      </div>

      <!-- Highlighted -->
      <div class="flex flex-col gap-4 rounded-[20px] p-6 border-2 border-primary bg-primary/10">
        <div class="flex items-start justify-between gap-3">
          <div class="ibox" style="background:oklch(0.8 0.1 250)">
            <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
          </div>
          <span class="pill text-[11px] shrink-0">Ключевая функция</span>
        </div>
        <div>
          <div class="font-bold text-[15px] text-foreground mb-1">Калькулятор ИОЛ</div>
          <p class="text-muted-foreground text-[13px] leading-relaxed">Вводите K1, K2, ACD, осевую длину — система считает диоптрии по <strong class="text-primary">SRK/T, Haigis</strong>. Исключает ошибки ручного расчёта на местах.</p>
        </div>
        <div class="bg-background rounded-2xl p-3.5 border border-primary/30">
          <div class="grid grid-cols-2 gap-1.5 text-[12px]">
            <div class="text-muted-foreground">K1 / K2</div><div class="font-mono font-semibold text-foreground text-right">43.5 / 44.2 D</div>
            <div class="text-muted-foreground">Осевая длина</div><div class="font-mono font-semibold text-foreground text-right">23.8 мм</div>
            <div class="text-muted-foreground">ACD</div><div class="font-mono font-semibold text-foreground text-right">3.12 мм</div>
            <div class="text-muted-foreground font-semibold">Результат ИОЛ</div><div class="font-mono font-bold text-primary text-right">+21.5 D</div>
          </div>
        </div>
      </div>

      <div class="card-white p-6 flex flex-col gap-4">
        <div class="ibox">
          <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
          </svg>
        </div>
        <div>
          <div class="font-bold text-[15px] text-foreground mb-1">Офлайн-режим</div>
          <p class="text-muted-foreground text-[13px] leading-relaxed">Работает даже при слабом интернете. Данные сохраняются локально и синхронизируются автоматически при появлении связи.</p>
        </div>
      </div>

      <div class="card-white p-6 flex flex-col gap-4">
        <div class="ibox">
          <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
        </div>
        <div>
          <div class="font-bold text-[15px] text-foreground mb-1">Telegram-уведомления</div>
          <p class="text-muted-foreground text-[13px] leading-relaxed">Пациент получает сообщения о готовности, дате операции и напоминания через привычный мессенджер.</p>
        </div>
      </div>

      <div class="card-white p-6 flex flex-col gap-4">
        <div class="ibox">
          <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <div>
          <div class="font-bold text-[15px] text-foreground mb-1">Электронный маршрутный лист</div>
          <p class="text-muted-foreground text-[13px] leading-relaxed">Вся история пациента в одном месте: от первичного осмотра до выписки. Доступ у районного врача и хирурга ЯРОКБ.</p>
        </div>
      </div>

      <div class="card-white p-6 flex flex-col gap-4">
        <div class="ibox">
          <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
        <div>
          <div class="font-bold text-[15px] text-foreground mb-1">Безопасность данных</div>
          <p class="text-muted-foreground text-[13px] leading-relaxed">Соответствие 152-ФЗ и 323-ФЗ. Разграничение доступа по ролям. Шифрование передачи данных.</p>
        </div>
      </div>
    </div>
  </div>
</section>


<!-- ═══ DISTRICTS ═══ -->
<section id="districts" class="sec bg-surface">
  <div class="max-w-7xl mx-auto px-5 lg:px-8">
    <div class="mb-10 text-center">
      <div class="pill mb-3 inline-flex">География</div>
      <h2 class="font-black text-[28px] lg:text-[34px] text-foreground">Охват всей республики</h2>
      <p class="text-muted-foreground text-[14px] mt-2 max-w-lg mx-auto">Система работает во всех районах Якутии — от Мирного до Оймякона</p>
    </div>
    <div class="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
      {#each districts as district}
        <span class="pill text-[11px]">{district}</span>
      {/each}
    </div>
  </div>
</section>


<!-- ═══ CTA ═══ -->
<section class="sec bg-background">
  <div class="max-w-7xl mx-auto px-5 lg:px-8">
    <div class="card-blue relative z-10 px-8 py-12 lg:px-16 lg:py-16 flex flex-col lg:flex-row items-center justify-between gap-8">
      <div class="relative z-10 flex flex-col gap-4 max-w-xl">
        <h2 class="font-black text-[28px] lg:text-[38px] leading-tight">Начните работу с системой</h2>
        <p class="text-white/65 text-[14px]">Для районных врачей, хирургов ЯРОКБ и пациентов — бесплатный доступ.</p>
      </div>
      <div class="relative z-10 flex flex-col sm:flex-row gap-3 shrink-0">
        <a href="#login"  class="btn btn-white btn-lg">Войти как врач</a>
        <a href="#status" class="btn btn-lg text-white border border-white/25 transition-colors" style="background:rgba(255,255,255,.12)">Статус пациента</a>
      </div>
    </div>
  </div>
</section>


<!-- ═══ FAQ ═══ -->
<section id="faq" class="sec bg-surface">
  <div class="max-w-7xl mx-auto px-5 lg:px-8">
    <div class="mb-10">
      <div class="pill mb-3">Частые вопросы</div>
      <h2 class="font-black text-[28px] lg:text-[34px] text-foreground mb-1">Вопросы и ответы</h2>
    </div>
    <div class="grid md:grid-cols-2 gap-4 max-w-4xl">
      {#each faqs as faq, i}
        <div class="card-white p-6">
          <button class="w-full text-left flex items-start justify-between gap-3"
                  onclick={() => openFaq = openFaq === i ? null : i}>
            <div class="font-semibold text-[14px] text-foreground leading-snug">{faq.q}</div>
            <div class="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-primary hover:bg-primary/10 transition-colors font-bold flex-shrink-0">
              {openFaq === i ? '−' : '›'}
            </div>
          </button>
          {#if openFaq === i}
            <p class="mt-3 text-[13px] text-muted-foreground leading-relaxed">{faq.a}</p>
          {/if}
        </div>
      {/each}
    </div>
    <div class="mt-6"><a href="#contacts" class="btn btn-ghost">Все вопросы</a></div>
  </div>
</section>


<!-- ═══ CONTACTS ═══ -->
<section id="contacts" class="sec bg-background">
  <div class="max-w-7xl mx-auto px-5 lg:px-8">
    <div class="mb-10">
      <div class="pill mb-3">Контакты</div>
      <h2 class="font-black text-[28px] lg:text-[34px] text-foreground">Адреса и поддержка</h2>
    </div>
    <div class="grid lg:grid-cols-3 gap-5">
      <div class="card-white p-6 lg:col-span-2">
        <div class="font-bold text-[16px] text-foreground mb-1">ГБУЗ РС(Я) «ЯРОКБ»</div>
        <div class="text-muted-foreground text-[13px] mb-5">Якутская республиканская офтальмологическая клиническая больница — головное учреждение системы</div>
        <div class="grid sm:grid-cols-2 gap-4 text-[13px]">
          <div>
            <div class="text-muted-foreground mb-1 text-[11px] uppercase tracking-wider font-semibold">Адрес</div>
            <div class="font-medium text-foreground">г. Якутск, ул. Лермонтова, 94</div>
          </div>
          <div>
            <div class="text-muted-foreground mb-1 text-[11px] uppercase tracking-wider font-semibold">Регистратура</div>
            <a href="tel:+74112401270" class="font-semibold text-primary hover:underline">+7 (4112) 40-12-70</a>
          </div>
          <div>
            <div class="text-muted-foreground mb-1 text-[11px] uppercase tracking-wider font-semibold">Техподдержка</div>
            <a href="mailto:support@yarokb.ru" class="font-semibold text-primary hover:underline">support@yarokb.ru</a>
          </div>
          <div>
            <div class="text-muted-foreground mb-1 text-[11px] uppercase tracking-wider font-semibold">Режим работы</div>
            <div class="font-medium text-foreground">Пн–Пт: 8:00–17:00</div>
          </div>
        </div>
        <div class="mt-5 pt-5 border-t border-border flex flex-wrap gap-3">
          <a href="#login" class="btn btn-primary">Войти в систему</a>
          <a href="https://yarokb.ru" class="btn btn-ghost" target="_blank" rel="noopener noreferrer">Сайт ЯРОКБ</a>
        </div>
      </div>
      <div class="card-white p-6">
        <div class="font-bold text-[15px] text-foreground mb-4">Безопасность данных</div>
        <div class="space-y-3.5">
          <div class="flex items-start gap-3">
            <div class="ibox-sm" style="background:oklch(0.95 0.05 150)">
              <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <div>
              <div class="font-semibold text-[13px] text-foreground">323-ФЗ</div>
              <div class="text-muted-foreground text-[12px]">Врачебная тайна и охрана здоровья</div>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="ibox-sm" style="background:oklch(0.9 0.05 250)">
              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <div>
              <div class="font-semibold text-[13px] text-foreground">152-ФЗ</div>
              <div class="text-muted-foreground text-[12px]">Персональные данные</div>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="ibox-sm">
              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/>
              </svg>
            </div>
            <div>
              <div class="font-semibold text-[13px] text-foreground">RBAC</div>
              <div class="text-muted-foreground text-[12px]">Разграничение доступа по ролям</div>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="ibox-sm" style="background:oklch(0.95 0.01 250)">
              <svg class="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
            <div>
              <div class="font-semibold text-[13px] text-foreground">ЕМИАС</div>
              <div class="text-muted-foreground text-[12px]">Совместимость в разработке</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
