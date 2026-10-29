<template>
  <div class="flex items-center gap-2.5 select-none cursor-pointer group">
    <!-- Modern Green Location Pin with Medical Cross -->
    <div class="relative w-9 h-9 flex items-center justify-center rounded-xl bg-brand-50 border border-brand-100 shadow-2xs group-hover:bg-brand-100/70 transition-all shrink-0">
      <svg
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-5.5 h-5.5 text-brand-600 transition-transform group-hover:scale-105"
      >
        <path
          d="M14 2.5C8.75 2.5 4.5 6.75 4.5 12C4.5 18.25 14 25.5 14 25.5C14 25.5 23.5 18.25 23.5 12C23.5 6.75 19.25 2.5 14 2.5Z"
          fill="#1E7E34"
        />
        <path
          d="M14 7.5V16.5M9.5 12H18.5"
          stroke="white"
          stroke-width="2.5"
          stroke-linecap="round"
        />
        <circle cx="14" cy="12" r="1.2" fill="#ECFDF5" />
      </svg>
    </div>

    <!-- Green Script "ფარმაგიდი" + Subtitle (NO CUTOFF / NO OVERFLOW CLIP) -->
    <div class="flex flex-col justify-center leading-none">
      <div class="flex items-center overflow-visible">
        <svg
          class="h-7 w-48 overflow-visible"
          viewBox="0 0 220 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            x="2"
            y="25"
            font-family="'Caveat', 'Noto Sans Georgian', sans-serif"
            font-size="28"
            font-weight="700"
            letter-spacing="0.2px"
            fill="#1E7E34"
          >
            ფარმაგიდი
          </text>
        </svg>
      </div>
      <span class="text-[9px] font-bold tracking-[0.24em] text-slate-400 uppercase -mt-0.5 pl-0.5">
        PHARMAGUIDE
      </span>
    </div>
  </div>
</template>
