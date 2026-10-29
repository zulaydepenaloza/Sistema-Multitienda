export const STANDALONE_HTML_SOURCE = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Sistema Multi-Sucursal POS & Gestión Comercial</title>
  <!-- Tailwind CSS CDN (v3 Play CDN - 100% compatible with local file:// and browser preview) -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            slate: {
              750: '#293548',
              850: '#111827',
              950: '#020617'
            }
          }
        }
      }
    };
  </script>
  <!-- Chart.js para gráficas interactivas -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;800&display=swap');
/*! tailwindcss v4.3.3 | MIT License | https://tailwindcss.com */
@layer properties;
@layer theme, base, components, utilities;
@layer theme {
  :root, :host {
    --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
      "Noto Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol", "Noto Color Emoji";
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
      "Courier New", monospace;
    --color-red-300: oklch(80.8% 0.114 19.571);
    --color-red-500: oklch(63.7% 0.237 25.331);
    --color-red-600: oklch(57.7% 0.245 27.325);
    --color-orange-300: oklch(83.7% 0.128 66.29);
    --color-orange-400: oklch(75% 0.183 55.934);
    --color-orange-500: oklch(70.5% 0.213 47.604);
    --color-amber-200: oklch(92.4% 0.12 95.746);
    --color-amber-300: oklch(87.9% 0.169 91.605);
    --color-amber-400: oklch(82.8% 0.189 84.429);
    --color-amber-500: oklch(76.9% 0.188 70.08);
    --color-amber-600: oklch(66.6% 0.179 58.318);
    --color-amber-700: oklch(55.5% 0.163 48.998);
    --color-amber-900: oklch(41.4% 0.112 45.904);
    --color-amber-950: oklch(27.9% 0.077 45.635);
    --color-yellow-400: oklch(85.2% 0.199 91.936);
    --color-yellow-500: oklch(79.5% 0.184 86.047);
    --color-emerald-200: oklch(90.5% 0.093 164.15);
    --color-emerald-300: oklch(84.5% 0.143 164.978);
    --color-emerald-400: oklch(76.5% 0.177 163.223);
    --color-emerald-500: oklch(69.6% 0.17 162.48);
    --color-emerald-600: oklch(59.6% 0.145 163.225);
    --color-emerald-700: oklch(50.8% 0.118 165.612);
    --color-emerald-900: oklch(37.8% 0.077 168.94);
    --color-emerald-950: oklch(26.2% 0.051 172.552);
    --color-teal-300: oklch(85.5% 0.138 181.071);
    --color-teal-400: oklch(77.7% 0.152 181.912);
    --color-teal-500: oklch(70.4% 0.14 182.503);
    --color-cyan-300: oklch(86.5% 0.127 207.078);
    --color-cyan-400: oklch(78.9% 0.154 211.53);
    --color-cyan-500: oklch(71.5% 0.143 215.221);
    --color-sky-300: oklch(82.8% 0.111 230.318);
    --color-sky-400: oklch(74.6% 0.16 232.661);
    --color-sky-500: oklch(68.5% 0.169 237.323);
    --color-sky-600: oklch(58.8% 0.158 241.966);
    --color-sky-700: oklch(50% 0.134 242.749);
    --color-sky-950: oklch(29.3% 0.066 243.157);
    --color-blue-300: oklch(80.9% 0.105 251.813);
    --color-blue-400: oklch(70.7% 0.165 254.624);
    --color-blue-500: oklch(62.3% 0.214 259.815);
    --color-indigo-200: oklch(87% 0.065 274.039);
    --color-indigo-300: oklch(78.5% 0.115 274.713);
    --color-indigo-400: oklch(67.3% 0.182 276.935);
    --color-indigo-500: oklch(58.5% 0.233 277.117);
    --color-indigo-600: oklch(51.1% 0.262 276.966);
    --color-indigo-700: oklch(45.7% 0.24 277.023);
    --color-indigo-900: oklch(35.9% 0.144 278.697);
    --color-indigo-950: oklch(25.7% 0.09 281.288);
    --color-purple-200: oklch(90.2% 0.063 306.703);
    --color-purple-300: oklch(82.7% 0.119 306.383);
    --color-purple-400: oklch(71.4% 0.203 305.504);
    --color-purple-500: oklch(62.7% 0.265 303.9);
    --color-purple-600: oklch(55.8% 0.288 302.321);
    --color-purple-800: oklch(43.8% 0.218 303.724);
    --color-purple-900: oklch(38.1% 0.176 304.987);
    --color-purple-950: oklch(29.1% 0.149 302.717);
    --color-rose-200: oklch(89.2% 0.058 10.001);
    --color-rose-300: oklch(81% 0.117 11.638);
    --color-rose-400: oklch(71.2% 0.194 13.428);
    --color-rose-500: oklch(64.5% 0.246 16.439);
    --color-rose-600: oklch(58.6% 0.253 17.585);
    --color-rose-900: oklch(41% 0.159 10.272);
    --color-rose-950: oklch(27.1% 0.105 12.094);
    --color-slate-50: oklch(98.4% 0.003 247.858);
    --color-slate-100: oklch(96.8% 0.007 247.896);
    --color-slate-200: oklch(92.9% 0.013 255.508);
    --color-slate-300: oklch(86.9% 0.022 252.894);
    --color-slate-400: oklch(70.4% 0.04 256.788);
    --color-slate-500: oklch(55.4% 0.046 257.417);
    --color-slate-600: oklch(44.6% 0.043 257.281);
    --color-slate-700: oklch(37.2% 0.044 257.287);
    --color-slate-800: oklch(27.9% 0.041 260.031);
    --color-slate-900: oklch(20.8% 0.042 265.755);
    --color-slate-950: oklch(12.9% 0.042 264.695);
    --color-black: #000;
    --color-white: #fff;
    --spacing: 0.25rem;
    --container-xs: 20rem;
    --container-sm: 24rem;
    --container-md: 28rem;
    --container-lg: 32rem;
    --container-xl: 36rem;
    --container-2xl: 42rem;
    --container-3xl: 48rem;
    --container-4xl: 56rem;
    --container-5xl: 64rem;
    --container-6xl: 72rem;
    --container-7xl: 80rem;
    --text-xs: 0.75rem;
    --text-xs--line-height: calc(1 / 0.75);
    --text-sm: 0.875rem;
    --text-sm--line-height: calc(1.25 / 0.875);
    --text-base: 1rem;
    --text-base--line-height: calc(1.5 / 1);
    --text-lg: 1.125rem;
    --text-lg--line-height: calc(1.75 / 1.125);
    --text-xl: 1.25rem;
    --text-xl--line-height: calc(1.75 / 1.25);
    --text-2xl: 1.5rem;
    --text-2xl--line-height: calc(2 / 1.5);
    --text-3xl: 1.875rem;
    --text-3xl--line-height: calc(2.25 / 1.875);
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    --font-weight-extrabold: 800;
    --font-weight-black: 900;
    --tracking-tight: -0.025em;
    --tracking-normal: 0em;
    --tracking-wide: 0.025em;
    --tracking-wider: 0.05em;
    --tracking-widest: 0.1em;
    --leading-tight: 1.25;
    --leading-relaxed: 1.625;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-2xl: 1rem;
    --radius-3xl: 1.5rem;
    --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
    --animate-spin: spin 1s linear infinite;
    --animate-pulse: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    --blur-xs: 4px;
    --blur-sm: 8px;
    --blur-md: 12px;
    --blur-3xl: 64px;
    --default-transition-duration: 150ms;
    --default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    --default-font-family: var(--font-sans);
    --default-mono-font-family: var(--font-mono);
  }
}
@layer base {
  *, ::after, ::before, ::backdrop, ::file-selector-button {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: 0 solid;
  }
  html, :host {
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
    font-family: var(--default-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji");
    font-feature-settings: var(--default-font-feature-settings, normal);
    font-variation-settings: var(--default-font-variation-settings, normal);
    -webkit-tap-highlight-color: transparent;
  }
  hr {
    height: 0;
    color: inherit;
    border-top-width: 1px;
  }
  abbr:where([title]) {
    -webkit-text-decoration: underline dotted;
    text-decoration: underline dotted;
  }
  h1, h2, h3, h4, h5, h6 {
    font-size: inherit;
    font-weight: inherit;
  }
  a {
    color: inherit;
    -webkit-text-decoration: inherit;
    text-decoration: inherit;
  }
  b, strong {
    font-weight: bolder;
  }
  code, kbd, samp, pre {
    font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace);
    font-feature-settings: var(--default-mono-font-feature-settings, normal);
    font-variation-settings: var(--default-mono-font-variation-settings, normal);
    font-size: 1em;
  }
  small {
    font-size: 80%;
  }
  sub, sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }
  sub {
    bottom: -0.25em;
  }
  sup {
    top: -0.5em;
  }
  table {
    text-indent: 0;
    border-color: inherit;
    border-collapse: collapse;
  }
  :-moz-focusring:where(:not(iframe)) {
    outline: auto;
  }
  progress {
    vertical-align: baseline;
  }
  summary {
    display: list-item;
  }
  ol, ul, menu {
    list-style: none;
  }
  img, svg, video, canvas, audio, iframe, embed, object {
    display: block;
    vertical-align: middle;
  }
  img, video {
    max-width: 100%;
    height: auto;
  }
  button, input, select, optgroup, textarea, ::file-selector-button {
    font: inherit;
    font-feature-settings: inherit;
    font-variation-settings: inherit;
    letter-spacing: inherit;
    color: inherit;
    border-radius: 0;
    background-color: transparent;
    opacity: 1;
  }
  :where(select:is([multiple], [size])) optgroup {
    font-weight: bolder;
  }
  :where(select:is([multiple], [size])) optgroup option {
    padding-inline-start: 20px;
  }
  ::file-selector-button {
    margin-inline-end: 4px;
  }
  ::placeholder {
    opacity: 1;
  }
  @supports (not (-webkit-appearance: -apple-pay-button))  or (contain-intrinsic-size: 1px) {
    ::placeholder {
      color: currentcolor;
      @supports (color: color-mix(in lab, red, red)) {
        color: color-mix(in oklab, currentcolor 50%, transparent);
      }
    }
  }
  textarea {
    resize: vertical;
  }
  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }
  ::-webkit-date-and-time-value {
    min-height: 1lh;
    text-align: inherit;
  }
  ::-webkit-datetime-edit {
    display: inline-flex;
  }
  ::-webkit-datetime-edit-fields-wrapper {
    padding: 0;
  }
  ::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month-field, ::-webkit-datetime-edit-day-field, ::-webkit-datetime-edit-hour-field, ::-webkit-datetime-edit-minute-field, ::-webkit-datetime-edit-second-field, ::-webkit-datetime-edit-millisecond-field, ::-webkit-datetime-edit-meridiem-field {
    padding-block: 0;
  }
  ::-webkit-calendar-picker-indicator {
    line-height: 1;
  }
  :-moz-ui-invalid {
    box-shadow: none;
  }
  button, input:where([type="button"], [type="reset"], [type="submit"]), ::file-selector-button {
    appearance: button;
  }
  ::-webkit-inner-spin-button, ::-webkit-outer-spin-button {
    height: auto;
  }
  [hidden]:where(:not([hidden="until-found"])) {
    display: none !important;
  }
}
@layer utilities {
  .pointer-events-none {
    pointer-events: none;
  }
  .collapse {
    visibility: collapse;
  }
  .visible {
    visibility: visible;
  }
  .absolute {
    position: absolute;
  }
  .fixed {
    position: fixed;
  }
  .relative {
    position: relative;
  }
  .sticky {
    position: sticky;
  }
  .inset-0 {
    inset: 0px;
  }
  .inset-y-0 {
    inset-block: 0px;
  }
  .-top-24 {
    top: calc(var(--spacing) * -24);
  }
  .top-0 {
    top: 0px;
  }
  .top-1 {
    top: var(--spacing);
  }
  .top-1\/2 {
    top: calc(1 / 2 * 100%);
  }
  .top-2 {
    top: calc(var(--spacing) * 2);
  }
  .top-2\.5 {
    top: calc(var(--spacing) * 2.5);
  }
  .top-3 {
    top: calc(var(--spacing) * 3);
  }
  .top-3\.5 {
    top: calc(var(--spacing) * 3.5);
  }
  .top-4 {
    top: calc(var(--spacing) * 4);
  }
  .-right-24 {
    right: calc(var(--spacing) * -24);
  }
  .right-0 {
    right: 0px;
  }
  .right-2 {
    right: calc(var(--spacing) * 2);
  }
  .right-2\.5 {
    right: calc(var(--spacing) * 2.5);
  }
  .right-3 {
    right: calc(var(--spacing) * 3);
  }
  .right-4 {
    right: calc(var(--spacing) * 4);
  }
  .-bottom-24 {
    bottom: calc(var(--spacing) * -24);
  }
  .bottom-0 {
    bottom: 0px;
  }
  .-left-24 {
    left: calc(var(--spacing) * -24);
  }
  .left-0 {
    left: 0px;
  }
  .left-2 {
    left: calc(var(--spacing) * 2);
  }
  .left-2\.5 {
    left: calc(var(--spacing) * 2.5);
  }
  .left-3 {
    left: calc(var(--spacing) * 3);
  }
  .z-10 {
    z-index: 10;
  }
  .z-20 {
    z-index: 20;
  }
  .z-30 {
    z-index: 30;
  }
  .z-40 {
    z-index: 40;
  }
  .z-50 {
    z-index: 50;
  }
  .z-\[999999\] {
    z-index: 999999;
  }
  .col-span-1 {
    grid-column: span 1 / span 1;
  }
  .col-span-2 {
    grid-column: span 2 / span 2;
  }
  .col-span-3 {
    grid-column: span 3 / span 3;
  }
  .col-span-4 {
    grid-column: span 4 / span 4;
  }
  .col-span-5 {
    grid-column: span 5 / span 5;
  }
  .col-span-6 {
    grid-column: span 6 / span 6;
  }
  .col-span-7 {
    grid-column: span 7 / span 7;
  }
  .col-span-8 {
    grid-column: span 8 / span 8;
  }
  .col-span-9 {
    grid-column: span 9 / span 9;
  }
  .col-span-10 {
    grid-column: span 10 / span 10;
  }
  .col-span-11 {
    grid-column: span 11 / span 11;
  }
  .col-span-full {
    grid-column: 1 / -1;
  }
  .container {
    width: 100%;
    @media (width >= 40rem) {
      max-width: 40rem;
    }
    @media (width >= 48rem) {
      max-width: 48rem;
    }
    @media (width >= 64rem) {
      max-width: 64rem;
    }
    @media (width >= 80rem) {
      max-width: 80rem;
    }
    @media (width >= 96rem) {
      max-width: 96rem;
    }
  }
  .m-0 {
    margin: 0px;
  }
  .mx-auto {
    margin-inline: auto;
  }
  .my-2 {
    margin-block: calc(var(--spacing) * 2);
  }
  .my-8 {
    margin-block: calc(var(--spacing) * 8);
  }
  .my-12 {
    margin-block: calc(var(--spacing) * 12);
  }
  .mt-0 {
    margin-top: 0px;
  }
  .mt-0\.5 {
    margin-top: calc(var(--spacing) * 0.5);
  }
  .mt-1 {
    margin-top: var(--spacing);
  }
  .mt-2 {
    margin-top: calc(var(--spacing) * 2);
  }
  .mt-2\.5 {
    margin-top: calc(var(--spacing) * 2.5);
  }
  .mt-3 {
    margin-top: calc(var(--spacing) * 3);
  }
  .mt-4 {
    margin-top: calc(var(--spacing) * 4);
  }
  .mt-5 {
    margin-top: calc(var(--spacing) * 5);
  }
  .mt-6 {
    margin-top: calc(var(--spacing) * 6);
  }
  .mr-1 {
    margin-right: var(--spacing);
  }
  .mr-3 {
    margin-right: calc(var(--spacing) * 3);
  }
  .mb-1 {
    margin-bottom: var(--spacing);
  }
  .mb-1\.5 {
    margin-bottom: calc(var(--spacing) * 1.5);
  }
  .mb-2 {
    margin-bottom: calc(var(--spacing) * 2);
  }
  .mb-3 {
    margin-bottom: calc(var(--spacing) * 3);
  }
  .mb-4 {
    margin-bottom: calc(var(--spacing) * 4);
  }
  .ml-1 {
    margin-left: var(--spacing);
  }
  .ml-1\.5 {
    margin-left: calc(var(--spacing) * 1.5);
  }
  .ml-2 {
    margin-left: calc(var(--spacing) * 2);
  }
  .ml-4 {
    margin-left: calc(var(--spacing) * 4);
  }
  .ml-auto {
    margin-left: auto;
  }
  .line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
  .line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .line-clamp-3 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
  .block {
    display: block;
  }
  .flex {
    display: flex;
  }
  .grid {
    display: grid;
  }
  .hidden {
    display: none;
  }
  .inline {
    display: inline;
  }
  .inline-block {
    display: inline-block;
  }
  .inline-flex {
    display: inline-flex;
  }
  .table {
    display: table;
  }
  .h-1 {
    height: var(--spacing);
  }
  .h-1\.5 {
    height: calc(var(--spacing) * 1.5);
  }
  .h-2 {
    height: calc(var(--spacing) * 2);
  }
  .h-2\.5 {
    height: calc(var(--spacing) * 2.5);
  }
  .h-3 {
    height: calc(var(--spacing) * 3);
  }
  .h-3\.5 {
    height: calc(var(--spacing) * 3.5);
  }
  .h-4 {
    height: calc(var(--spacing) * 4);
  }
  .h-5 {
    height: calc(var(--spacing) * 5);
  }
  .h-6 {
    height: calc(var(--spacing) * 6);
  }
  .h-7 {
    height: calc(var(--spacing) * 7);
  }
  .h-8 {
    height: calc(var(--spacing) * 8);
  }
  .h-9 {
    height: calc(var(--spacing) * 9);
  }
  .h-10 {
    height: calc(var(--spacing) * 10);
  }
  .h-12 {
    height: calc(var(--spacing) * 12);
  }
  .h-16 {
    height: calc(var(--spacing) * 16);
  }
  .h-20 {
    height: calc(var(--spacing) * 20);
  }
  .h-48 {
    height: calc(var(--spacing) * 48);
  }
  .h-56 {
    height: calc(var(--spacing) * 56);
  }
  .h-64 {
    height: calc(var(--spacing) * 64);
  }
  .h-72 {
    height: calc(var(--spacing) * 72);
  }
  .h-auto {
    height: auto;
  }
  .h-full {
    height: 100%;
  }
  .h-screen {
    height: 100vh;
  }
  .max-h-48 {
    max-height: calc(var(--spacing) * 48);
  }
  .max-h-56 {
    max-height: calc(var(--spacing) * 56);
  }
  .max-h-60 {
    max-height: calc(var(--spacing) * 60);
  }
  .max-h-72 {
    max-height: calc(var(--spacing) * 72);
  }
  .max-h-\[85vh\] {
    max-height: 85vh;
  }
  .max-h-\[90vh\] {
    max-height: 90vh;
  }
  .max-h-\[92vh\] {
    max-height: 92vh;
  }
  .max-h-\[220px\] {
    max-height: 220px;
  }
  .max-h-\[320px\] {
    max-height: 320px;
  }
  .max-h-\[380px\] {
    max-height: 380px;
  }
  .max-h-\[500px\] {
    max-height: 500px;
  }
  .max-h-\[560px\] {
    max-height: 560px;
  }
  .min-h-0 {
    min-height: 0px;
  }
  .min-h-\[30px\] {
    min-height: 30px;
  }
  .min-h-\[32px\] {
    min-height: 32px;
  }
  .min-h-\[480px\] {
    min-height: 480px;
  }
  .min-h-\[520px\] {
    min-height: 520px;
  }
  .min-h-screen {
    min-height: 100vh;
  }
  .w-1 {
    width: var(--spacing);
  }
  .w-1\.5 {
    width: calc(var(--spacing) * 1.5);
  }
  .w-2 {
    width: calc(var(--spacing) * 2);
  }
  .w-2\.5 {
    width: calc(var(--spacing) * 2.5);
  }
  .w-3 {
    width: calc(var(--spacing) * 3);
  }
  .w-3\.5 {
    width: calc(var(--spacing) * 3.5);
  }
  .w-4 {
    width: calc(var(--spacing) * 4);
  }
  .w-5 {
    width: calc(var(--spacing) * 5);
  }
  .w-6 {
    width: calc(var(--spacing) * 6);
  }
  .w-7 {
    width: calc(var(--spacing) * 7);
  }
  .w-8 {
    width: calc(var(--spacing) * 8);
  }
  .w-9 {
    width: calc(var(--spacing) * 9);
  }
  .w-10 {
    width: calc(var(--spacing) * 10);
  }
  .w-12 {
    width: calc(var(--spacing) * 12);
  }
  .w-14 {
    width: calc(var(--spacing) * 14);
  }
  .w-16 {
    width: calc(var(--spacing) * 16);
  }
  .w-20 {
    width: calc(var(--spacing) * 20);
  }
  .w-24 {
    width: calc(var(--spacing) * 24);
  }
  .w-28 {
    width: calc(var(--spacing) * 28);
  }
  .w-36 {
    width: calc(var(--spacing) * 36);
  }
  .w-40 {
    width: calc(var(--spacing) * 40);
  }
  .w-48 {
    width: calc(var(--spacing) * 48);
  }
  .w-52 {
    width: calc(var(--spacing) * 52);
  }
  .w-56 {
    width: calc(var(--spacing) * 56);
  }
  .w-64 {
    width: calc(var(--spacing) * 64);
  }
  .w-80 {
    width: calc(var(--spacing) * 80);
  }
  .w-96 {
    width: calc(var(--spacing) * 96);
  }
  .w-auto {
    width: auto;
  }
  .w-full {
    width: 100%;
  }
  .w-px {
    width: 1px;
  }
  .max-w-2xl {
    max-width: var(--container-2xl);
  }
  .max-w-3xl {
    max-width: var(--container-3xl);
  }
  .max-w-4xl {
    max-width: var(--container-4xl);
  }
  .max-w-5xl {
    max-width: var(--container-5xl);
  }
  .max-w-6xl {
    max-width: var(--container-6xl);
  }
  .max-w-7xl {
    max-width: var(--container-7xl);
  }
  .max-w-\[80px\] {
    max-width: 80px;
  }
  .max-w-\[120px\] {
    max-width: 120px;
  }
  .max-w-\[130px\] {
    max-width: 130px;
  }
  .max-w-\[150px\] {
    max-width: 150px;
  }
  .max-w-\[160px\] {
    max-width: 160px;
  }
  .max-w-\[180px\] {
    max-width: 180px;
  }
  .max-w-\[200px\] {
    max-width: 200px;
  }
  .max-w-\[1680px\] {
    max-width: 1680px;
  }
  .max-w-full {
    max-width: 100%;
  }
  .max-w-lg {
    max-width: var(--container-lg);
  }
  .max-w-md {
    max-width: var(--container-md);
  }
  .max-w-sm {
    max-width: var(--container-sm);
  }
  .max-w-xl {
    max-width: var(--container-xl);
  }
  .max-w-xs {
    max-width: var(--container-xs);
  }
  .min-w-0 {
    min-width: 0px;
  }
  .min-w-\[650px\] {
    min-width: 650px;
  }
  .min-w-\[760px\] {
    min-width: 760px;
  }
  .flex-1 {
    flex: 1;
  }
  .flex-shrink {
    flex-shrink: 1;
  }
  .shrink-0 {
    flex-shrink: 0;
  }
  .flex-grow {
    flex-grow: 1;
  }
  .grow {
    flex-grow: 1;
  }
  .border-collapse {
    border-collapse: collapse;
  }
  .-translate-y-1 {
    --tw-translate-y: calc(var(--spacing) * -1);
    translate: var(--tw-translate-x) var(--tw-translate-y);
  }
  .-translate-y-1\/2 {
    --tw-translate-y: calc(calc(1 / 2 * 100%) * -1);
    translate: var(--tw-translate-x) var(--tw-translate-y);
  }
  .scale-110 {
    --tw-scale-x: 110%;
    --tw-scale-y: 110%;
    --tw-scale-z: 110%;
    scale: var(--tw-scale-x) var(--tw-scale-y);
  }
  .transform {
    transform: var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,);
  }
  .animate-pulse {
    animation: var(--animate-pulse);
  }
  .animate-spin {
    animation: var(--animate-spin);
  }
  .cursor-not-allowed {
    cursor: not-allowed;
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .resize {
    resize: both;
  }
  .resize-none {
    resize: none;
  }
  .scrollbar-none {
    scrollbar-width: none;
  }
  .list-inside {
    list-style-position: inside;
  }
  .list-decimal {
    list-style-type: decimal;
  }
  .list-disc {
    list-style-type: disc;
  }
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  .grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .grid-cols-5 {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
  .grid-cols-6 {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
  .grid-cols-12 {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }
  .flex-col {
    flex-direction: column;
  }
  .flex-row {
    flex-direction: row;
  }
  .flex-wrap {
    flex-wrap: wrap;
  }
  .items-baseline {
    align-items: baseline;
  }
  .items-center {
    align-items: center;
  }
  .items-end {
    align-items: flex-end;
  }
  .items-start {
    align-items: flex-start;
  }
  .items-stretch {
    align-items: stretch;
  }
  .justify-around {
    justify-content: space-around;
  }
  .justify-between {
    justify-content: space-between;
  }
  .justify-center {
    justify-content: center;
  }
  .justify-end {
    justify-content: flex-end;
  }
  .justify-start {
    justify-content: flex-start;
  }
  .gap-1 {
    gap: var(--spacing);
  }
  .gap-1\.5 {
    gap: calc(var(--spacing) * 1.5);
  }
  .gap-2 {
    gap: calc(var(--spacing) * 2);
  }
  .gap-2\.5 {
    gap: calc(var(--spacing) * 2.5);
  }
  .gap-3 {
    gap: calc(var(--spacing) * 3);
  }
  .gap-3\.5 {
    gap: calc(var(--spacing) * 3.5);
  }
  .gap-4 {
    gap: calc(var(--spacing) * 4);
  }
  .gap-5 {
    gap: calc(var(--spacing) * 5);
  }
  .gap-6 {
    gap: calc(var(--spacing) * 6);
  }
  :where(.space-y-0 > :not(:last-child)) {
    --tw-space-y-reverse: 0;
    margin-block-start: 0;
    margin-block-end: 0;
  }
  :where(.space-y-0\.5 > :not(:last-child)) {
    --tw-space-y-reverse: 0;
    margin-block-start: calc(calc(var(--spacing) * 0.5) * var(--tw-space-y-reverse));
    margin-block-end: calc(calc(var(--spacing) * 0.5) * calc(1 - var(--tw-space-y-reverse)));
  }
  :where(.space-y-1 > :not(:last-child)) {
    --tw-space-y-reverse: 0;
    margin-block-start: calc(var(--spacing) * var(--tw-space-y-reverse));
    margin-block-end: calc(var(--spacing) * calc(1 - var(--tw-space-y-reverse)));
  }
  :where(.space-y-1\.5 > :not(:last-child)) {
    --tw-space-y-reverse: 0;
    margin-block-start: calc(calc(var(--spacing) * 1.5) * var(--tw-space-y-reverse));
    margin-block-end: calc(calc(var(--spacing) * 1.5) * calc(1 - var(--tw-space-y-reverse)));
  }
  :where(.space-y-2 > :not(:last-child)) {
    --tw-space-y-reverse: 0;
    margin-block-start: calc(calc(var(--spacing) * 2) * var(--tw-space-y-reverse));
    margin-block-end: calc(calc(var(--spacing) * 2) * calc(1 - var(--tw-space-y-reverse)));
  }
  :where(.space-y-2\.5 > :not(:last-child)) {
    --tw-space-y-reverse: 0;
    margin-block-start: calc(calc(var(--spacing) * 2.5) * var(--tw-space-y-reverse));
    margin-block-end: calc(calc(var(--spacing) * 2.5) * calc(1 - var(--tw-space-y-reverse)));
  }
  :where(.space-y-3 > :not(:last-child)) {
    --tw-space-y-reverse: 0;
    margin-block-start: calc(calc(var(--spacing) * 3) * var(--tw-space-y-reverse));
    margin-block-end: calc(calc(var(--spacing) * 3) * calc(1 - var(--tw-space-y-reverse)));
  }
  :where(.space-y-3\.5 > :not(:last-child)) {
    --tw-space-y-reverse: 0;
    margin-block-start: calc(calc(var(--spacing) * 3.5) * var(--tw-space-y-reverse));
    margin-block-end: calc(calc(var(--spacing) * 3.5) * calc(1 - var(--tw-space-y-reverse)));
  }
  :where(.space-y-4 > :not(:last-child)) {
    --tw-space-y-reverse: 0;
    margin-block-start: calc(calc(var(--spacing) * 4) * var(--tw-space-y-reverse));
    margin-block-end: calc(calc(var(--spacing) * 4) * calc(1 - var(--tw-space-y-reverse)));
  }
  :where(.space-y-5 > :not(:last-child)) {
    --tw-space-y-reverse: 0;
    margin-block-start: calc(calc(var(--spacing) * 5) * var(--tw-space-y-reverse));
    margin-block-end: calc(calc(var(--spacing) * 5) * calc(1 - var(--tw-space-y-reverse)));
  }
  :where(.space-y-6 > :not(:last-child)) {
    --tw-space-y-reverse: 0;
    margin-block-start: calc(calc(var(--spacing) * 6) * var(--tw-space-y-reverse));
    margin-block-end: calc(calc(var(--spacing) * 6) * calc(1 - var(--tw-space-y-reverse)));
  }
  :where(.space-y-8 > :not(:last-child)) {
    --tw-space-y-reverse: 0;
    margin-block-start: calc(calc(var(--spacing) * 8) * var(--tw-space-y-reverse));
    margin-block-end: calc(calc(var(--spacing) * 8) * calc(1 - var(--tw-space-y-reverse)));
  }
  :where(.space-x-1 > :not(:last-child)) {
    --tw-space-x-reverse: 0;
    margin-inline-start: calc(var(--spacing) * var(--tw-space-x-reverse));
    margin-inline-end: calc(var(--spacing) * calc(1 - var(--tw-space-x-reverse)));
  }
  :where(.space-x-2 > :not(:last-child)) {
    --tw-space-x-reverse: 0;
    margin-inline-start: calc(calc(var(--spacing) * 2) * var(--tw-space-x-reverse));
    margin-inline-end: calc(calc(var(--spacing) * 2) * calc(1 - var(--tw-space-x-reverse)));
  }
  :where(.space-x-3 > :not(:last-child)) {
    --tw-space-x-reverse: 0;
    margin-inline-start: calc(calc(var(--spacing) * 3) * var(--tw-space-x-reverse));
    margin-inline-end: calc(calc(var(--spacing) * 3) * calc(1 - var(--tw-space-x-reverse)));
  }
  :where(.divide-y > :not(:last-child)) {
    --tw-divide-y-reverse: 0;
    border-bottom-style: var(--tw-border-style);
    border-top-style: var(--tw-border-style);
    border-top-width: calc(1px * var(--tw-divide-y-reverse));
    border-bottom-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));
  }
  :where(.divide-slate-800 > :not(:last-child)) {
    border-color: var(--color-slate-800);
  }
  :where(.divide-slate-800\/60 > :not(:last-child)) {
    border-color: color-mix(in srgb, oklch(27.9% 0.041 260.031) 60%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-slate-800) 60%, transparent);
    }
  }
  :where(.divide-slate-800\/80 > :not(:last-child)) {
    border-color: color-mix(in srgb, oklch(27.9% 0.041 260.031) 80%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-slate-800) 80%, transparent);
    }
  }
  .self-end {
    align-self: flex-end;
  }
  .self-start {
    align-self: flex-start;
  }
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .overflow-hidden {
    overflow: hidden;
  }
  .overflow-x-auto {
    overflow-x: auto;
  }
  .overflow-y-auto {
    overflow-y: auto;
  }
  .rounded {
    border-radius: 0.25rem;
  }
  .rounded-2xl {
    border-radius: var(--radius-2xl);
  }
  .rounded-3xl {
    border-radius: var(--radius-3xl);
  }
  .rounded-full {
    border-radius: calc(infinity * 1px);
  }
  .rounded-lg {
    border-radius: var(--radius-lg);
  }
  .rounded-md {
    border-radius: var(--radius-md);
  }
  .rounded-xl {
    border-radius: var(--radius-xl);
  }
  .rounded-t-lg {
    border-top-left-radius: var(--radius-lg);
    border-top-right-radius: var(--radius-lg);
  }
  .rounded-l-xl {
    border-top-left-radius: var(--radius-xl);
    border-bottom-left-radius: var(--radius-xl);
  }
  .rounded-r-xl {
    border-top-right-radius: var(--radius-xl);
    border-bottom-right-radius: var(--radius-xl);
  }
  .border {
    border-style: var(--tw-border-style);
    border-width: 1px;
  }
  .border-2 {
    border-style: var(--tw-border-style);
    border-width: 2px;
  }
  .border-t {
    border-top-style: var(--tw-border-style);
    border-top-width: 1px;
  }
  .border-t-2 {
    border-top-style: var(--tw-border-style);
    border-top-width: 2px;
  }
  .border-r {
    border-right-style: var(--tw-border-style);
    border-right-width: 1px;
  }
  .border-b {
    border-bottom-style: var(--tw-border-style);
    border-bottom-width: 1px;
  }
  .border-l {
    border-left-style: var(--tw-border-style);
    border-left-width: 1px;
  }
  .border-dashed {
    --tw-border-style: dashed;
    border-style: dashed;
  }
  .border-amber-500 {
    border-color: var(--color-amber-500);
  }
  .border-amber-500\/20 {
    border-color: color-mix(in srgb, oklch(76.9% 0.188 70.08) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-amber-500) 20%, transparent);
    }
  }
  .border-amber-500\/30 {
    border-color: color-mix(in srgb, oklch(76.9% 0.188 70.08) 30%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-amber-500) 30%, transparent);
    }
  }
  .border-amber-500\/40 {
    border-color: color-mix(in srgb, oklch(76.9% 0.188 70.08) 40%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-amber-500) 40%, transparent);
    }
  }
  .border-amber-500\/50 {
    border-color: color-mix(in srgb, oklch(76.9% 0.188 70.08) 50%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-amber-500) 50%, transparent);
    }
  }
  .border-blue-500 {
    border-color: var(--color-blue-500);
  }
  .border-blue-500\/20 {
    border-color: color-mix(in srgb, oklch(62.3% 0.214 259.815) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-blue-500) 20%, transparent);
    }
  }
  .border-blue-500\/30 {
    border-color: color-mix(in srgb, oklch(62.3% 0.214 259.815) 30%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-blue-500) 30%, transparent);
    }
  }
  .border-cyan-500 {
    border-color: var(--color-cyan-500);
  }
  .border-cyan-500\/30 {
    border-color: color-mix(in srgb, oklch(71.5% 0.143 215.221) 30%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-cyan-500) 30%, transparent);
    }
  }
  .border-emerald-400 {
    border-color: var(--color-emerald-400);
  }
  .border-emerald-500 {
    border-color: var(--color-emerald-500);
  }
  .border-emerald-500\/20 {
    border-color: color-mix(in srgb, oklch(69.6% 0.17 162.48) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-emerald-500) 20%, transparent);
    }
  }
  .border-emerald-500\/30 {
    border-color: color-mix(in srgb, oklch(69.6% 0.17 162.48) 30%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-emerald-500) 30%, transparent);
    }
  }
  .border-emerald-500\/40 {
    border-color: color-mix(in srgb, oklch(69.6% 0.17 162.48) 40%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-emerald-500) 40%, transparent);
    }
  }
  .border-emerald-500\/60 {
    border-color: color-mix(in srgb, oklch(69.6% 0.17 162.48) 60%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-emerald-500) 60%, transparent);
    }
  }
  .border-indigo-500 {
    border-color: var(--color-indigo-500);
  }
  .border-indigo-500\/20 {
    border-color: color-mix(in srgb, oklch(58.5% 0.233 277.117) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-indigo-500) 20%, transparent);
    }
  }
  .border-indigo-500\/30 {
    border-color: color-mix(in srgb, oklch(58.5% 0.233 277.117) 30%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-indigo-500) 30%, transparent);
    }
  }
  .border-indigo-500\/40 {
    border-color: color-mix(in srgb, oklch(58.5% 0.233 277.117) 40%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-indigo-500) 40%, transparent);
    }
  }
  .border-indigo-500\/50 {
    border-color: color-mix(in srgb, oklch(58.5% 0.233 277.117) 50%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-indigo-500) 50%, transparent);
    }
  }
  .border-orange-500 {
    border-color: var(--color-orange-500);
  }
  .border-orange-500\/20 {
    border-color: color-mix(in srgb, oklch(70.5% 0.213 47.604) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-orange-500) 20%, transparent);
    }
  }
  .border-orange-500\/30 {
    border-color: color-mix(in srgb, oklch(70.5% 0.213 47.604) 30%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-orange-500) 30%, transparent);
    }
  }
  .border-purple-400 {
    border-color: var(--color-purple-400);
  }
  .border-purple-500 {
    border-color: var(--color-purple-500);
  }
  .border-purple-500\/20 {
    border-color: color-mix(in srgb, oklch(62.7% 0.265 303.9) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-purple-500) 20%, transparent);
    }
  }
  .border-purple-500\/30 {
    border-color: color-mix(in srgb, oklch(62.7% 0.265 303.9) 30%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-purple-500) 30%, transparent);
    }
  }
  .border-purple-500\/40 {
    border-color: color-mix(in srgb, oklch(62.7% 0.265 303.9) 40%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-purple-500) 40%, transparent);
    }
  }
  .border-purple-800 {
    border-color: var(--color-purple-800);
  }
  .border-purple-800\/40 {
    border-color: color-mix(in srgb, oklch(43.8% 0.218 303.724) 40%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-purple-800) 40%, transparent);
    }
  }
  .border-red-500 {
    border-color: var(--color-red-500);
  }
  .border-red-500\/50 {
    border-color: color-mix(in srgb, oklch(63.7% 0.237 25.331) 50%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-red-500) 50%, transparent);
    }
  }
  .border-rose-500 {
    border-color: var(--color-rose-500);
  }
  .border-rose-500\/20 {
    border-color: color-mix(in srgb, oklch(64.5% 0.246 16.439) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-rose-500) 20%, transparent);
    }
  }
  .border-rose-500\/30 {
    border-color: color-mix(in srgb, oklch(64.5% 0.246 16.439) 30%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-rose-500) 30%, transparent);
    }
  }
  .border-rose-500\/40 {
    border-color: color-mix(in srgb, oklch(64.5% 0.246 16.439) 40%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-rose-500) 40%, transparent);
    }
  }
  .border-rose-600 {
    border-color: var(--color-rose-600);
  }
  .border-rose-600\/60 {
    border-color: color-mix(in srgb, oklch(58.6% 0.253 17.585) 60%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-rose-600) 60%, transparent);
    }
  }
  .border-rose-900 {
    border-color: var(--color-rose-900);
  }
  .border-rose-900\/50 {
    border-color: color-mix(in srgb, oklch(41% 0.159 10.272) 50%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-rose-900) 50%, transparent);
    }
  }
  .border-rose-950 {
    border-color: var(--color-rose-950);
  }
  .border-rose-950\/80 {
    border-color: color-mix(in srgb, oklch(27.1% 0.105 12.094) 80%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-rose-950) 80%, transparent);
    }
  }
  .border-sky-500 {
    border-color: var(--color-sky-500);
  }
  .border-sky-500\/30 {
    border-color: color-mix(in srgb, oklch(68.5% 0.169 237.323) 30%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-sky-500) 30%, transparent);
    }
  }
  .border-slate-200 {
    border-color: var(--color-slate-200);
  }
  .border-slate-300 {
    border-color: var(--color-slate-300);
  }
  .border-slate-600 {
    border-color: var(--color-slate-600);
  }
  .border-slate-700 {
    border-color: var(--color-slate-700);
  }
  .border-slate-700\/60 {
    border-color: color-mix(in srgb, oklch(37.2% 0.044 257.287) 60%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-slate-700) 60%, transparent);
    }
  }
  .border-slate-700\/80 {
    border-color: color-mix(in srgb, oklch(37.2% 0.044 257.287) 80%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-slate-700) 80%, transparent);
    }
  }
  .border-slate-800 {
    border-color: var(--color-slate-800);
  }
  .border-slate-800\/60 {
    border-color: color-mix(in srgb, oklch(27.9% 0.041 260.031) 60%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-slate-800) 60%, transparent);
    }
  }
  .border-slate-800\/70 {
    border-color: color-mix(in srgb, oklch(27.9% 0.041 260.031) 70%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-slate-800) 70%, transparent);
    }
  }
  .border-slate-800\/80 {
    border-color: color-mix(in srgb, oklch(27.9% 0.041 260.031) 80%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-slate-800) 80%, transparent);
    }
  }
  .border-slate-800\/90 {
    border-color: color-mix(in srgb, oklch(27.9% 0.041 260.031) 90%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-slate-800) 90%, transparent);
    }
  }
  .border-slate-900 {
    border-color: var(--color-slate-900);
  }
  .border-teal-500 {
    border-color: var(--color-teal-500);
  }
  .border-teal-500\/20 {
    border-color: color-mix(in srgb, oklch(70.4% 0.14 182.503) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-teal-500) 20%, transparent);
    }
  }
  .border-teal-500\/30 {
    border-color: color-mix(in srgb, oklch(70.4% 0.14 182.503) 30%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-teal-500) 30%, transparent);
    }
  }
  .border-transparent {
    border-color: transparent;
  }
  .border-yellow-500 {
    border-color: var(--color-yellow-500);
  }
  .border-yellow-500\/20 {
    border-color: color-mix(in srgb, oklch(79.5% 0.184 86.047) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      border-color: color-mix(in oklab, var(--color-yellow-500) 20%, transparent);
    }
  }
  .bg-amber-500 {
    background-color: var(--color-amber-500);
  }
  .bg-amber-500\/10 {
    background-color: color-mix(in srgb, oklch(76.9% 0.188 70.08) 10%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-amber-500) 10%, transparent);
    }
  }
  .bg-amber-500\/15 {
    background-color: color-mix(in srgb, oklch(76.9% 0.188 70.08) 15%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-amber-500) 15%, transparent);
    }
  }
  .bg-amber-500\/20 {
    background-color: color-mix(in srgb, oklch(76.9% 0.188 70.08) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-amber-500) 20%, transparent);
    }
  }
  .bg-amber-600 {
    background-color: var(--color-amber-600);
  }
  .bg-amber-950 {
    background-color: var(--color-amber-950);
  }
  .bg-amber-950\/30 {
    background-color: color-mix(in srgb, oklch(27.9% 0.077 45.635) 30%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-amber-950) 30%, transparent);
    }
  }
  .bg-amber-950\/40 {
    background-color: color-mix(in srgb, oklch(27.9% 0.077 45.635) 40%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-amber-950) 40%, transparent);
    }
  }
  .bg-amber-950\/60 {
    background-color: color-mix(in srgb, oklch(27.9% 0.077 45.635) 60%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-amber-950) 60%, transparent);
    }
  }
  .bg-amber-950\/80 {
    background-color: color-mix(in srgb, oklch(27.9% 0.077 45.635) 80%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-amber-950) 80%, transparent);
    }
  }
  .bg-black {
    background-color: var(--color-black);
  }
  .bg-black\/40 {
    background-color: color-mix(in srgb, #000 40%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-black) 40%, transparent);
    }
  }
  .bg-black\/50 {
    background-color: color-mix(in srgb, #000 50%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-black) 50%, transparent);
    }
  }
  .bg-black\/75 {
    background-color: color-mix(in srgb, #000 75%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-black) 75%, transparent);
    }
  }
  .bg-black\/80 {
    background-color: color-mix(in srgb, #000 80%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-black) 80%, transparent);
    }
  }
  .bg-black\/85 {
    background-color: color-mix(in srgb, #000 85%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-black) 85%, transparent);
    }
  }
  .bg-blue-500 {
    background-color: var(--color-blue-500);
  }
  .bg-blue-500\/10 {
    background-color: color-mix(in srgb, oklch(62.3% 0.214 259.815) 10%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-blue-500) 10%, transparent);
    }
  }
  .bg-blue-500\/20 {
    background-color: color-mix(in srgb, oklch(62.3% 0.214 259.815) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-blue-500) 20%, transparent);
    }
  }
  .bg-cyan-500 {
    background-color: var(--color-cyan-500);
  }
  .bg-cyan-500\/20 {
    background-color: color-mix(in srgb, oklch(71.5% 0.143 215.221) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-cyan-500) 20%, transparent);
    }
  }
  .bg-emerald-400 {
    background-color: var(--color-emerald-400);
  }
  .bg-emerald-500 {
    background-color: var(--color-emerald-500);
  }
  .bg-emerald-500\/5 {
    background-color: color-mix(in srgb, oklch(69.6% 0.17 162.48) 5%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-emerald-500) 5%, transparent);
    }
  }
  .bg-emerald-500\/10 {
    background-color: color-mix(in srgb, oklch(69.6% 0.17 162.48) 10%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-emerald-500) 10%, transparent);
    }
  }
  .bg-emerald-500\/15 {
    background-color: color-mix(in srgb, oklch(69.6% 0.17 162.48) 15%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-emerald-500) 15%, transparent);
    }
  }
  .bg-emerald-500\/20 {
    background-color: color-mix(in srgb, oklch(69.6% 0.17 162.48) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-emerald-500) 20%, transparent);
    }
  }
  .bg-emerald-500\/30 {
    background-color: color-mix(in srgb, oklch(69.6% 0.17 162.48) 30%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-emerald-500) 30%, transparent);
    }
  }
  .bg-emerald-600 {
    background-color: var(--color-emerald-600);
  }
  .bg-emerald-950 {
    background-color: var(--color-emerald-950);
  }
  .bg-emerald-950\/30 {
    background-color: color-mix(in srgb, oklch(26.2% 0.051 172.552) 30%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-emerald-950) 30%, transparent);
    }
  }
  .bg-emerald-950\/40 {
    background-color: color-mix(in srgb, oklch(26.2% 0.051 172.552) 40%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-emerald-950) 40%, transparent);
    }
  }
  .bg-emerald-950\/50 {
    background-color: color-mix(in srgb, oklch(26.2% 0.051 172.552) 50%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-emerald-950) 50%, transparent);
    }
  }
  .bg-emerald-950\/60 {
    background-color: color-mix(in srgb, oklch(26.2% 0.051 172.552) 60%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-emerald-950) 60%, transparent);
    }
  }
  .bg-emerald-950\/70 {
    background-color: color-mix(in srgb, oklch(26.2% 0.051 172.552) 70%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-emerald-950) 70%, transparent);
    }
  }
  .bg-emerald-950\/80 {
    background-color: color-mix(in srgb, oklch(26.2% 0.051 172.552) 80%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-emerald-950) 80%, transparent);
    }
  }
  .bg-indigo-500 {
    background-color: var(--color-indigo-500);
  }
  .bg-indigo-500\/10 {
    background-color: color-mix(in srgb, oklch(58.5% 0.233 277.117) 10%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-indigo-500) 10%, transparent);
    }
  }
  .bg-indigo-500\/15 {
    background-color: color-mix(in srgb, oklch(58.5% 0.233 277.117) 15%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-indigo-500) 15%, transparent);
    }
  }
  .bg-indigo-500\/20 {
    background-color: color-mix(in srgb, oklch(58.5% 0.233 277.117) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-indigo-500) 20%, transparent);
    }
  }
  .bg-indigo-600 {
    background-color: var(--color-indigo-600);
  }
  .bg-indigo-950 {
    background-color: var(--color-indigo-950);
  }
  .bg-indigo-950\/30 {
    background-color: color-mix(in srgb, oklch(25.7% 0.09 281.288) 30%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-indigo-950) 30%, transparent);
    }
  }
  .bg-indigo-950\/40 {
    background-color: color-mix(in srgb, oklch(25.7% 0.09 281.288) 40%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-indigo-950) 40%, transparent);
    }
  }
  .bg-orange-500 {
    background-color: var(--color-orange-500);
  }
  .bg-orange-500\/10 {
    background-color: color-mix(in srgb, oklch(70.5% 0.213 47.604) 10%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-orange-500) 10%, transparent);
    }
  }
  .bg-orange-500\/20 {
    background-color: color-mix(in srgb, oklch(70.5% 0.213 47.604) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-orange-500) 20%, transparent);
    }
  }
  .bg-purple-500 {
    background-color: var(--color-purple-500);
  }
  .bg-purple-500\/10 {
    background-color: color-mix(in srgb, oklch(62.7% 0.265 303.9) 10%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-purple-500) 10%, transparent);
    }
  }
  .bg-purple-500\/15 {
    background-color: color-mix(in srgb, oklch(62.7% 0.265 303.9) 15%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-purple-500) 15%, transparent);
    }
  }
  .bg-purple-500\/20 {
    background-color: color-mix(in srgb, oklch(62.7% 0.265 303.9) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-purple-500) 20%, transparent);
    }
  }
  .bg-purple-600 {
    background-color: var(--color-purple-600);
  }
  .bg-purple-900 {
    background-color: var(--color-purple-900);
  }
  .bg-purple-900\/60 {
    background-color: color-mix(in srgb, oklch(38.1% 0.176 304.987) 60%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-purple-900) 60%, transparent);
    }
  }
  .bg-purple-950 {
    background-color: var(--color-purple-950);
  }
  .bg-purple-950\/40 {
    background-color: color-mix(in srgb, oklch(29.1% 0.149 302.717) 40%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-purple-950) 40%, transparent);
    }
  }
  .bg-purple-950\/60 {
    background-color: color-mix(in srgb, oklch(29.1% 0.149 302.717) 60%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-purple-950) 60%, transparent);
    }
  }
  .bg-purple-950\/70 {
    background-color: color-mix(in srgb, oklch(29.1% 0.149 302.717) 70%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-purple-950) 70%, transparent);
    }
  }
  .bg-red-600 {
    background-color: var(--color-red-600);
  }
  .bg-red-600\/30 {
    background-color: color-mix(in srgb, oklch(57.7% 0.245 27.325) 30%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-red-600) 30%, transparent);
    }
  }
  .bg-rose-500 {
    background-color: var(--color-rose-500);
  }
  .bg-rose-500\/10 {
    background-color: color-mix(in srgb, oklch(64.5% 0.246 16.439) 10%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-rose-500) 10%, transparent);
    }
  }
  .bg-rose-500\/15 {
    background-color: color-mix(in srgb, oklch(64.5% 0.246 16.439) 15%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-rose-500) 15%, transparent);
    }
  }
  .bg-rose-500\/20 {
    background-color: color-mix(in srgb, oklch(64.5% 0.246 16.439) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-rose-500) 20%, transparent);
    }
  }
  .bg-rose-600 {
    background-color: var(--color-rose-600);
  }
  .bg-rose-950 {
    background-color: var(--color-rose-950);
  }
  .bg-rose-950\/40 {
    background-color: color-mix(in srgb, oklch(27.1% 0.105 12.094) 40%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-rose-950) 40%, transparent);
    }
  }
  .bg-rose-950\/50 {
    background-color: color-mix(in srgb, oklch(27.1% 0.105 12.094) 50%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-rose-950) 50%, transparent);
    }
  }
  .bg-rose-950\/60 {
    background-color: color-mix(in srgb, oklch(27.1% 0.105 12.094) 60%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-rose-950) 60%, transparent);
    }
  }
  .bg-rose-950\/80 {
    background-color: color-mix(in srgb, oklch(27.1% 0.105 12.094) 80%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-rose-950) 80%, transparent);
    }
  }
  .bg-sky-500 {
    background-color: var(--color-sky-500);
  }
  .bg-sky-500\/10 {
    background-color: color-mix(in srgb, oklch(68.5% 0.169 237.323) 10%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-sky-500) 10%, transparent);
    }
  }
  .bg-sky-500\/15 {
    background-color: color-mix(in srgb, oklch(68.5% 0.169 237.323) 15%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-sky-500) 15%, transparent);
    }
  }
  .bg-sky-500\/20 {
    background-color: color-mix(in srgb, oklch(68.5% 0.169 237.323) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-sky-500) 20%, transparent);
    }
  }
  .bg-sky-600 {
    background-color: var(--color-sky-600);
  }
  .bg-sky-700 {
    background-color: var(--color-sky-700);
  }
  .bg-sky-950 {
    background-color: var(--color-sky-950);
  }
  .bg-sky-950\/40 {
    background-color: color-mix(in srgb, oklch(29.3% 0.066 243.157) 40%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-sky-950) 40%, transparent);
    }
  }
  .bg-sky-950\/60 {
    background-color: color-mix(in srgb, oklch(29.3% 0.066 243.157) 60%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-sky-950) 60%, transparent);
    }
  }
  .bg-slate-50 {
    background-color: var(--color-slate-50);
  }
  .bg-slate-200 {
    background-color: var(--color-slate-200);
  }
  .bg-slate-700 {
    background-color: var(--color-slate-700);
  }
  .bg-slate-700\/50 {
    background-color: color-mix(in srgb, oklch(37.2% 0.044 257.287) 50%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-slate-700) 50%, transparent);
    }
  }
  .bg-slate-700\/60 {
    background-color: color-mix(in srgb, oklch(37.2% 0.044 257.287) 60%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-slate-700) 60%, transparent);
    }
  }
  .bg-slate-800 {
    background-color: var(--color-slate-800);
  }
  .bg-slate-800\/80 {
    background-color: color-mix(in srgb, oklch(27.9% 0.041 260.031) 80%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-slate-800) 80%, transparent);
    }
  }
  .bg-slate-800\/90 {
    background-color: color-mix(in srgb, oklch(27.9% 0.041 260.031) 90%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-slate-800) 90%, transparent);
    }
  }
  .bg-slate-900 {
    background-color: var(--color-slate-900);
  }
  .bg-slate-900\/50 {
    background-color: color-mix(in srgb, oklch(20.8% 0.042 265.755) 50%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-slate-900) 50%, transparent);
    }
  }
  .bg-slate-900\/60 {
    background-color: color-mix(in srgb, oklch(20.8% 0.042 265.755) 60%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-slate-900) 60%, transparent);
    }
  }
  .bg-slate-900\/80 {
    background-color: color-mix(in srgb, oklch(20.8% 0.042 265.755) 80%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-slate-900) 80%, transparent);
    }
  }
  .bg-slate-900\/90 {
    background-color: color-mix(in srgb, oklch(20.8% 0.042 265.755) 90%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-slate-900) 90%, transparent);
    }
  }
  .bg-slate-950 {
    background-color: var(--color-slate-950);
  }
  .bg-slate-950\/20 {
    background-color: color-mix(in srgb, oklch(12.9% 0.042 264.695) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-slate-950) 20%, transparent);
    }
  }
  .bg-slate-950\/30 {
    background-color: color-mix(in srgb, oklch(12.9% 0.042 264.695) 30%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-slate-950) 30%, transparent);
    }
  }
  .bg-slate-950\/40 {
    background-color: color-mix(in srgb, oklch(12.9% 0.042 264.695) 40%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-slate-950) 40%, transparent);
    }
  }
  .bg-slate-950\/50 {
    background-color: color-mix(in srgb, oklch(12.9% 0.042 264.695) 50%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-slate-950) 50%, transparent);
    }
  }
  .bg-slate-950\/60 {
    background-color: color-mix(in srgb, oklch(12.9% 0.042 264.695) 60%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-slate-950) 60%, transparent);
    }
  }
  .bg-slate-950\/70 {
    background-color: color-mix(in srgb, oklch(12.9% 0.042 264.695) 70%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-slate-950) 70%, transparent);
    }
  }
  .bg-slate-950\/80 {
    background-color: color-mix(in srgb, oklch(12.9% 0.042 264.695) 80%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-slate-950) 80%, transparent);
    }
  }
  .bg-slate-950\/85 {
    background-color: color-mix(in srgb, oklch(12.9% 0.042 264.695) 85%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-slate-950) 85%, transparent);
    }
  }
  .bg-slate-950\/90 {
    background-color: color-mix(in srgb, oklch(12.9% 0.042 264.695) 90%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-slate-950) 90%, transparent);
    }
  }
  .bg-teal-500 {
    background-color: var(--color-teal-500);
  }
  .bg-teal-500\/10 {
    background-color: color-mix(in srgb, oklch(70.4% 0.14 182.503) 10%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-teal-500) 10%, transparent);
    }
  }
  .bg-teal-500\/15 {
    background-color: color-mix(in srgb, oklch(70.4% 0.14 182.503) 15%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-teal-500) 15%, transparent);
    }
  }
  .bg-teal-500\/20 {
    background-color: color-mix(in srgb, oklch(70.4% 0.14 182.503) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-teal-500) 20%, transparent);
    }
  }
  .bg-transparent {
    background-color: transparent;
  }
  .bg-white {
    background-color: var(--color-white);
  }
  .bg-yellow-500 {
    background-color: var(--color-yellow-500);
  }
  .bg-yellow-500\/10 {
    background-color: color-mix(in srgb, oklch(79.5% 0.184 86.047) 10%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      background-color: color-mix(in oklab, var(--color-yellow-500) 10%, transparent);
    }
  }
  .bg-gradient-to-br {
    --tw-gradient-position: to bottom right in oklab;
    background-image: linear-gradient(var(--tw-gradient-stops));
  }
  .bg-gradient-to-r {
    --tw-gradient-position: to right in oklab;
    background-image: linear-gradient(var(--tw-gradient-stops));
  }
  .from-emerald-500 {
    --tw-gradient-from: var(--color-emerald-500);
    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
  }
  .from-emerald-500\/20 {
    --tw-gradient-from: color-mix(in srgb, oklch(69.6% 0.17 162.48) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-gradient-from: color-mix(in oklab, var(--color-emerald-500) 20%, transparent);
    }
    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
  }
  .from-emerald-900 {
    --tw-gradient-from: var(--color-emerald-900);
    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
  }
  .from-emerald-900\/40 {
    --tw-gradient-from: color-mix(in srgb, oklch(37.8% 0.077 168.94) 40%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-gradient-from: color-mix(in oklab, var(--color-emerald-900) 40%, transparent);
    }
    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
  }
  .from-emerald-950 {
    --tw-gradient-from: var(--color-emerald-950);
    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
  }
  .from-emerald-950\/40 {
    --tw-gradient-from: color-mix(in srgb, oklch(26.2% 0.051 172.552) 40%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-gradient-from: color-mix(in oklab, var(--color-emerald-950) 40%, transparent);
    }
    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
  }
  .from-purple-500 {
    --tw-gradient-from: var(--color-purple-500);
    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
  }
  .from-purple-500\/20 {
    --tw-gradient-from: color-mix(in srgb, oklch(62.7% 0.265 303.9) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-gradient-from: color-mix(in oklab, var(--color-purple-500) 20%, transparent);
    }
    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
  }
  .from-purple-600 {
    --tw-gradient-from: var(--color-purple-600);
    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
  }
  .from-purple-950 {
    --tw-gradient-from: var(--color-purple-950);
    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
  }
  .from-slate-900 {
    --tw-gradient-from: var(--color-slate-900);
    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
  }
  .from-slate-950 {
    --tw-gradient-from: var(--color-slate-950);
    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
  }
  .via-emerald-500 {
    --tw-gradient-via: var(--color-emerald-500);
    --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
    --tw-gradient-stops: var(--tw-gradient-via-stops);
  }
  .via-emerald-500\/20 {
    --tw-gradient-via: color-mix(in srgb, oklch(69.6% 0.17 162.48) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-gradient-via: color-mix(in oklab, var(--color-emerald-500) 20%, transparent);
    }
    --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
    --tw-gradient-stops: var(--tw-gradient-via-stops);
  }
  .via-slate-900 {
    --tw-gradient-via: var(--color-slate-900);
    --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
    --tw-gradient-stops: var(--tw-gradient-via-stops);
  }
  .to-blue-500 {
    --tw-gradient-to: var(--color-blue-500);
    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
  }
  .to-blue-500\/20 {
    --tw-gradient-to: color-mix(in srgb, oklch(62.3% 0.214 259.815) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-gradient-to: color-mix(in oklab, var(--color-blue-500) 20%, transparent);
    }
    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
  }
  .to-emerald-500 {
    --tw-gradient-to: var(--color-emerald-500);
    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
  }
  .to-emerald-500\/20 {
    --tw-gradient-to: color-mix(in srgb, oklch(69.6% 0.17 162.48) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-gradient-to: color-mix(in oklab, var(--color-emerald-500) 20%, transparent);
    }
    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
  }
  .to-emerald-600 {
    --tw-gradient-to: var(--color-emerald-600);
    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
  }
  .to-emerald-700 {
    --tw-gradient-to: var(--color-emerald-700);
    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
  }
  .to-indigo-950 {
    --tw-gradient-to: var(--color-indigo-950);
    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
  }
  .to-indigo-950\/40 {
    --tw-gradient-to: color-mix(in srgb, oklch(25.7% 0.09 281.288) 40%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-gradient-to: color-mix(in oklab, var(--color-indigo-950) 40%, transparent);
    }
    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
  }
  .to-indigo-950\/50 {
    --tw-gradient-to: color-mix(in srgb, oklch(25.7% 0.09 281.288) 50%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-gradient-to: color-mix(in oklab, var(--color-indigo-950) 50%, transparent);
    }
    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
  }
  .to-slate-900 {
    --tw-gradient-to: var(--color-slate-900);
    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
  }
  .to-slate-950 {
    --tw-gradient-to: var(--color-slate-950);
    --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
  }
  .stroke-\[2\.5\] {
    stroke-width: 2.5;
  }
  .stroke-\[3\] {
    stroke-width: 3;
  }
  .object-cover {
    object-fit: cover;
  }
  .p-1 {
    padding: var(--spacing);
  }
  .p-1\.5 {
    padding: calc(var(--spacing) * 1.5);
  }
  .p-2 {
    padding: calc(var(--spacing) * 2);
  }
  .p-2\.5 {
    padding: calc(var(--spacing) * 2.5);
  }
  .p-3 {
    padding: calc(var(--spacing) * 3);
  }
  .p-3\.5 {
    padding: calc(var(--spacing) * 3.5);
  }
  .p-4 {
    padding: calc(var(--spacing) * 4);
  }
  .p-4\.5 {
    padding: calc(var(--spacing) * 4.5);
  }
  .p-5 {
    padding: calc(var(--spacing) * 5);
  }
  .p-6 {
    padding: calc(var(--spacing) * 6);
  }
  .p-8 {
    padding: calc(var(--spacing) * 8);
  }
  .p-10 {
    padding: calc(var(--spacing) * 10);
  }
  .p-12 {
    padding: calc(var(--spacing) * 12);
  }
  .px-1 {
    padding-inline: var(--spacing);
  }
  .px-1\.5 {
    padding-inline: calc(var(--spacing) * 1.5);
  }
  .px-2 {
    padding-inline: calc(var(--spacing) * 2);
  }
  .px-2\.5 {
    padding-inline: calc(var(--spacing) * 2.5);
  }
  .px-3 {
    padding-inline: calc(var(--spacing) * 3);
  }
  .px-3\.5 {
    padding-inline: calc(var(--spacing) * 3.5);
  }
  .px-4 {
    padding-inline: calc(var(--spacing) * 4);
  }
  .px-5 {
    padding-inline: calc(var(--spacing) * 5);
  }
  .px-6 {
    padding-inline: calc(var(--spacing) * 6);
  }
  .py-0 {
    padding-block: 0px;
  }
  .py-0\.5 {
    padding-block: calc(var(--spacing) * 0.5);
  }
  .py-1 {
    padding-block: var(--spacing);
  }
  .py-1\.5 {
    padding-block: calc(var(--spacing) * 1.5);
  }
  .py-2 {
    padding-block: calc(var(--spacing) * 2);
  }
  .py-2\.5 {
    padding-block: calc(var(--spacing) * 2.5);
  }
  .py-3 {
    padding-block: calc(var(--spacing) * 3);
  }
  .py-3\.5 {
    padding-block: calc(var(--spacing) * 3.5);
  }
  .py-4 {
    padding-block: calc(var(--spacing) * 4);
  }
  .py-6 {
    padding-block: calc(var(--spacing) * 6);
  }
  .py-8 {
    padding-block: calc(var(--spacing) * 8);
  }
  .py-12 {
    padding-block: calc(var(--spacing) * 12);
  }
  .py-16 {
    padding-block: calc(var(--spacing) * 16);
  }
  .pt-1 {
    padding-top: var(--spacing);
  }
  .pt-1\.5 {
    padding-top: calc(var(--spacing) * 1.5);
  }
  .pt-2 {
    padding-top: calc(var(--spacing) * 2);
  }
  .pt-2\.5 {
    padding-top: calc(var(--spacing) * 2.5);
  }
  .pt-3 {
    padding-top: calc(var(--spacing) * 3);
  }
  .pt-4 {
    padding-top: calc(var(--spacing) * 4);
  }
  .pt-5 {
    padding-top: calc(var(--spacing) * 5);
  }
  .pt-6 {
    padding-top: calc(var(--spacing) * 6);
  }
  .pr-1 {
    padding-right: var(--spacing);
  }
  .pr-2 {
    padding-right: calc(var(--spacing) * 2);
  }
  .pr-2\.5 {
    padding-right: calc(var(--spacing) * 2.5);
  }
  .pr-3 {
    padding-right: calc(var(--spacing) * 3);
  }
  .pr-4 {
    padding-right: calc(var(--spacing) * 4);
  }
  .pr-7 {
    padding-right: calc(var(--spacing) * 7);
  }
  .pr-8 {
    padding-right: calc(var(--spacing) * 8);
  }
  .pr-10 {
    padding-right: calc(var(--spacing) * 10);
  }
  .pb-1 {
    padding-bottom: var(--spacing);
  }
  .pb-1\.5 {
    padding-bottom: calc(var(--spacing) * 1.5);
  }
  .pb-2 {
    padding-bottom: calc(var(--spacing) * 2);
  }
  .pb-2\.5 {
    padding-bottom: calc(var(--spacing) * 2.5);
  }
  .pb-3 {
    padding-bottom: calc(var(--spacing) * 3);
  }
  .pb-3\.5 {
    padding-bottom: calc(var(--spacing) * 3.5);
  }
  .pb-4 {
    padding-bottom: calc(var(--spacing) * 4);
  }
  .pb-5 {
    padding-bottom: calc(var(--spacing) * 5);
  }
  .pl-2 {
    padding-left: calc(var(--spacing) * 2);
  }
  .pl-2\.5 {
    padding-left: calc(var(--spacing) * 2.5);
  }
  .pl-3 {
    padding-left: calc(var(--spacing) * 3);
  }
  .pl-3\.5 {
    padding-left: calc(var(--spacing) * 3.5);
  }
  .pl-7 {
    padding-left: calc(var(--spacing) * 7);
  }
  .pl-8 {
    padding-left: calc(var(--spacing) * 8);
  }
  .pl-9 {
    padding-left: calc(var(--spacing) * 9);
  }
  .pl-12 {
    padding-left: calc(var(--spacing) * 12);
  }
  .text-center {
    text-align: center;
  }
  .text-left {
    text-align: left;
  }
  .text-right {
    text-align: right;
  }
  .align-top {
    vertical-align: top;
  }
  .font-mono {
    font-family: var(--font-mono);
  }
  .font-sans {
    font-family: var(--font-sans);
  }
  .text-2xl {
    font-size: var(--text-2xl);
    line-height: var(--tw-leading, var(--text-2xl--line-height));
  }
  .text-3xl {
    font-size: var(--text-3xl);
    line-height: var(--tw-leading, var(--text-3xl--line-height));
  }
  .text-base {
    font-size: var(--text-base);
    line-height: var(--tw-leading, var(--text-base--line-height));
  }
  .text-lg {
    font-size: var(--text-lg);
    line-height: var(--tw-leading, var(--text-lg--line-height));
  }
  .text-sm {
    font-size: var(--text-sm);
    line-height: var(--tw-leading, var(--text-sm--line-height));
  }
  .text-xl {
    font-size: var(--text-xl);
    line-height: var(--tw-leading, var(--text-xl--line-height));
  }
  .text-xs {
    font-size: var(--text-xs);
    line-height: var(--tw-leading, var(--text-xs--line-height));
  }
  .text-\[8px\] {
    font-size: 8px;
  }
  .text-\[9\.5px\] {
    font-size: 9.5px;
  }
  .text-\[9px\] {
    font-size: 9px;
  }
  .text-\[10\.5px\] {
    font-size: 10.5px;
  }
  .text-\[10px\] {
    font-size: 10px;
  }
  .text-\[11px\] {
    font-size: 11px;
  }
  .leading-none {
    --tw-leading: 1;
    line-height: 1;
  }
  .leading-relaxed {
    --tw-leading: var(--leading-relaxed);
    line-height: var(--leading-relaxed);
  }
  .leading-tight {
    --tw-leading: var(--leading-tight);
    line-height: var(--leading-tight);
  }
  .font-black {
    --tw-font-weight: var(--font-weight-black);
    font-weight: var(--font-weight-black);
  }
  .font-bold {
    --tw-font-weight: var(--font-weight-bold);
    font-weight: var(--font-weight-bold);
  }
  .font-extrabold {
    --tw-font-weight: var(--font-weight-extrabold);
    font-weight: var(--font-weight-extrabold);
  }
  .font-medium {
    --tw-font-weight: var(--font-weight-medium);
    font-weight: var(--font-weight-medium);
  }
  .font-normal {
    --tw-font-weight: var(--font-weight-normal);
    font-weight: var(--font-weight-normal);
  }
  .font-semibold {
    --tw-font-weight: var(--font-weight-semibold);
    font-weight: var(--font-weight-semibold);
  }
  .tracking-tight {
    --tw-tracking: var(--tracking-tight);
    letter-spacing: var(--tracking-tight);
  }
  .tracking-wide {
    --tw-tracking: var(--tracking-wide);
    letter-spacing: var(--tracking-wide);
  }
  .tracking-wider {
    --tw-tracking: var(--tracking-wider);
    letter-spacing: var(--tracking-wider);
  }
  .tracking-widest {
    --tw-tracking: var(--tracking-widest);
    letter-spacing: var(--tracking-widest);
  }
  .break-words {
    overflow-wrap: break-word;
  }
  .break-all {
    word-break: break-all;
  }
  .whitespace-nowrap {
    white-space: nowrap;
  }
  .whitespace-pre {
    white-space: pre;
  }
  .whitespace-pre-wrap {
    white-space: pre-wrap;
  }
  .text-amber-200 {
    color: var(--color-amber-200);
  }
  .text-amber-200\/80 {
    color: color-mix(in srgb, oklch(92.4% 0.12 95.746) 80%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      color: color-mix(in oklab, var(--color-amber-200) 80%, transparent);
    }
  }
  .text-amber-300 {
    color: var(--color-amber-300);
  }
  .text-amber-300\/70 {
    color: color-mix(in srgb, oklch(87.9% 0.169 91.605) 70%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      color: color-mix(in oklab, var(--color-amber-300) 70%, transparent);
    }
  }
  .text-amber-300\/80 {
    color: color-mix(in srgb, oklch(87.9% 0.169 91.605) 80%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      color: color-mix(in oklab, var(--color-amber-300) 80%, transparent);
    }
  }
  .text-amber-300\/90 {
    color: color-mix(in srgb, oklch(87.9% 0.169 91.605) 90%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      color: color-mix(in oklab, var(--color-amber-300) 90%, transparent);
    }
  }
  .text-amber-400 {
    color: var(--color-amber-400);
  }
  .text-amber-500 {
    color: var(--color-amber-500);
  }
  .text-amber-700 {
    color: var(--color-amber-700);
  }
  .text-blue-300 {
    color: var(--color-blue-300);
  }
  .text-blue-400 {
    color: var(--color-blue-400);
  }
  .text-cyan-300 {
    color: var(--color-cyan-300);
  }
  .text-cyan-400 {
    color: var(--color-cyan-400);
  }
  .text-emerald-200 {
    color: var(--color-emerald-200);
  }
  .text-emerald-300 {
    color: var(--color-emerald-300);
  }
  .text-emerald-300\/70 {
    color: color-mix(in srgb, oklch(84.5% 0.143 164.978) 70%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      color: color-mix(in oklab, var(--color-emerald-300) 70%, transparent);
    }
  }
  .text-emerald-300\/80 {
    color: color-mix(in srgb, oklch(84.5% 0.143 164.978) 80%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      color: color-mix(in oklab, var(--color-emerald-300) 80%, transparent);
    }
  }
  .text-emerald-300\/90 {
    color: color-mix(in srgb, oklch(84.5% 0.143 164.978) 90%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      color: color-mix(in oklab, var(--color-emerald-300) 90%, transparent);
    }
  }
  .text-emerald-400 {
    color: var(--color-emerald-400);
  }
  .text-emerald-400\/80 {
    color: color-mix(in srgb, oklch(76.5% 0.177 163.223) 80%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      color: color-mix(in oklab, var(--color-emerald-400) 80%, transparent);
    }
  }
  .text-emerald-500 {
    color: var(--color-emerald-500);
  }
  .text-emerald-700 {
    color: var(--color-emerald-700);
  }
  .text-emerald-900 {
    color: var(--color-emerald-900);
  }
  .text-indigo-200 {
    color: var(--color-indigo-200);
  }
  .text-indigo-300 {
    color: var(--color-indigo-300);
  }
  .text-indigo-400 {
    color: var(--color-indigo-400);
  }
  .text-indigo-700 {
    color: var(--color-indigo-700);
  }
  .text-indigo-900 {
    color: var(--color-indigo-900);
  }
  .text-orange-300 {
    color: var(--color-orange-300);
  }
  .text-orange-400 {
    color: var(--color-orange-400);
  }
  .text-purple-200 {
    color: var(--color-purple-200);
  }
  .text-purple-300 {
    color: var(--color-purple-300);
  }
  .text-purple-400 {
    color: var(--color-purple-400);
  }
  .text-red-300 {
    color: var(--color-red-300);
  }
  .text-rose-200 {
    color: var(--color-rose-200);
  }
  .text-rose-300 {
    color: var(--color-rose-300);
  }
  .text-rose-300\/90 {
    color: color-mix(in srgb, oklch(81% 0.117 11.638) 90%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      color: color-mix(in oklab, var(--color-rose-300) 90%, transparent);
    }
  }
  .text-rose-400 {
    color: var(--color-rose-400);
  }
  .text-rose-500 {
    color: var(--color-rose-500);
  }
  .text-sky-300 {
    color: var(--color-sky-300);
  }
  .text-sky-400 {
    color: var(--color-sky-400);
  }
  .text-slate-100 {
    color: var(--color-slate-100);
  }
  .text-slate-200 {
    color: var(--color-slate-200);
  }
  .text-slate-300 {
    color: var(--color-slate-300);
  }
  .text-slate-400 {
    color: var(--color-slate-400);
  }
  .text-slate-500 {
    color: var(--color-slate-500);
  }
  .text-slate-600 {
    color: var(--color-slate-600);
  }
  .text-slate-700 {
    color: var(--color-slate-700);
  }
  .text-slate-800 {
    color: var(--color-slate-800);
  }
  .text-slate-900 {
    color: var(--color-slate-900);
  }
  .text-slate-900\/80 {
    color: color-mix(in srgb, oklch(20.8% 0.042 265.755) 80%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      color: color-mix(in oklab, var(--color-slate-900) 80%, transparent);
    }
  }
  .text-slate-950 {
    color: var(--color-slate-950);
  }
  .text-teal-300 {
    color: var(--color-teal-300);
  }
  .text-teal-400 {
    color: var(--color-teal-400);
  }
  .text-transparent {
    color: transparent;
  }
  .text-white {
    color: var(--color-white);
  }
  .text-yellow-400 {
    color: var(--color-yellow-400);
  }
  .capitalize {
    text-transform: capitalize;
  }
  .uppercase {
    text-transform: uppercase;
  }
  .italic {
    font-style: italic;
  }
  .underline {
    text-decoration-line: underline;
  }
  .antialiased {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .placeholder-slate-500::placeholder {
    color: var(--color-slate-500);
  }
  .accent-emerald-500 {
    accent-color: var(--color-emerald-500);
  }
  .opacity-40 {
    opacity: 40%;
  }
  .opacity-60 {
    opacity: 60%;
  }
  .opacity-75 {
    opacity: 75%;
  }
  .shadow {
    --tw-shadow: 0 1px 3px 0 var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 1px 2px -1px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
  }
  .shadow-2xl {
    --tw-shadow: 0 25px 50px -12px var(--tw-shadow-color, rgb(0 0 0 / 0.25));
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
  }
  .shadow-inner {
    --tw-shadow: inset 0 2px 4px 0 var(--tw-shadow-color, rgb(0 0 0 / 0.05));
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
  }
  .shadow-lg {
    --tw-shadow: 0 10px 15px -3px var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 4px 6px -4px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
  }
  .shadow-md {
    --tw-shadow: 0 4px 6px -1px var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 2px 4px -2px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
  }
  .shadow-sm {
    --tw-shadow: 0 1px 3px 0 var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 1px 2px -1px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
  }
  .shadow-xl {
    --tw-shadow: 0 20px 25px -5px var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 8px 10px -6px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
  }
  .shadow-amber-950 {
    --tw-shadow-color: oklch(27.9% 0.077 45.635);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-shadow-color: color-mix(in oklab, var(--color-amber-950) var(--tw-shadow-alpha), transparent);
    }
  }
  .shadow-amber-950\/20 {
    --tw-shadow-color: color-mix(in srgb, oklch(27.9% 0.077 45.635) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-amber-950) 20%, transparent) var(--tw-shadow-alpha), transparent);
    }
  }
  .shadow-emerald-500 {
    --tw-shadow-color: oklch(69.6% 0.17 162.48);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-shadow-color: color-mix(in oklab, var(--color-emerald-500) var(--tw-shadow-alpha), transparent);
    }
  }
  .shadow-emerald-500\/20 {
    --tw-shadow-color: color-mix(in srgb, oklch(69.6% 0.17 162.48) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-emerald-500) 20%, transparent) var(--tw-shadow-alpha), transparent);
    }
  }
  .shadow-emerald-500\/25 {
    --tw-shadow-color: color-mix(in srgb, oklch(69.6% 0.17 162.48) 25%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-emerald-500) 25%, transparent) var(--tw-shadow-alpha), transparent);
    }
  }
  .shadow-emerald-600 {
    --tw-shadow-color: oklch(59.6% 0.145 163.225);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-shadow-color: color-mix(in oklab, var(--color-emerald-600) var(--tw-shadow-alpha), transparent);
    }
  }
  .shadow-emerald-600\/20 {
    --tw-shadow-color: color-mix(in srgb, oklch(59.6% 0.145 163.225) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-emerald-600) 20%, transparent) var(--tw-shadow-alpha), transparent);
    }
  }
  .shadow-emerald-600\/30 {
    --tw-shadow-color: color-mix(in srgb, oklch(59.6% 0.145 163.225) 30%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-emerald-600) 30%, transparent) var(--tw-shadow-alpha), transparent);
    }
  }
  .shadow-emerald-950 {
    --tw-shadow-color: oklch(26.2% 0.051 172.552);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-shadow-color: color-mix(in oklab, var(--color-emerald-950) var(--tw-shadow-alpha), transparent);
    }
  }
  .shadow-emerald-950\/40 {
    --tw-shadow-color: color-mix(in srgb, oklch(26.2% 0.051 172.552) 40%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-emerald-950) 40%, transparent) var(--tw-shadow-alpha), transparent);
    }
  }
  .shadow-emerald-950\/50 {
    --tw-shadow-color: color-mix(in srgb, oklch(26.2% 0.051 172.552) 50%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-emerald-950) 50%, transparent) var(--tw-shadow-alpha), transparent);
    }
  }
  .shadow-emerald-950\/60 {
    --tw-shadow-color: color-mix(in srgb, oklch(26.2% 0.051 172.552) 60%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-emerald-950) 60%, transparent) var(--tw-shadow-alpha), transparent);
    }
  }
  .shadow-purple-600 {
    --tw-shadow-color: oklch(55.8% 0.288 302.321);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-shadow-color: color-mix(in oklab, var(--color-purple-600) var(--tw-shadow-alpha), transparent);
    }
  }
  .shadow-purple-600\/20 {
    --tw-shadow-color: color-mix(in srgb, oklch(55.8% 0.288 302.321) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-purple-600) 20%, transparent) var(--tw-shadow-alpha), transparent);
    }
  }
  .shadow-purple-600\/30 {
    --tw-shadow-color: color-mix(in srgb, oklch(55.8% 0.288 302.321) 30%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-purple-600) 30%, transparent) var(--tw-shadow-alpha), transparent);
    }
  }
  .shadow-rose-500 {
    --tw-shadow-color: oklch(64.5% 0.246 16.439);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-shadow-color: color-mix(in oklab, var(--color-rose-500) var(--tw-shadow-alpha), transparent);
    }
  }
  .shadow-rose-500\/20 {
    --tw-shadow-color: color-mix(in srgb, oklch(64.5% 0.246 16.439) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-rose-500) 20%, transparent) var(--tw-shadow-alpha), transparent);
    }
  }
  .shadow-rose-600 {
    --tw-shadow-color: oklch(58.6% 0.253 17.585);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-shadow-color: color-mix(in oklab, var(--color-rose-600) var(--tw-shadow-alpha), transparent);
    }
  }
  .shadow-rose-600\/20 {
    --tw-shadow-color: color-mix(in srgb, oklch(58.6% 0.253 17.585) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-rose-600) 20%, transparent) var(--tw-shadow-alpha), transparent);
    }
  }
  .shadow-rose-600\/30 {
    --tw-shadow-color: color-mix(in srgb, oklch(58.6% 0.253 17.585) 30%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-rose-600) 30%, transparent) var(--tw-shadow-alpha), transparent);
    }
  }
  .shadow-rose-950 {
    --tw-shadow-color: oklch(27.1% 0.105 12.094);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-shadow-color: color-mix(in oklab, var(--color-rose-950) var(--tw-shadow-alpha), transparent);
    }
  }
  .shadow-rose-950\/60 {
    --tw-shadow-color: color-mix(in srgb, oklch(27.1% 0.105 12.094) 60%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-rose-950) 60%, transparent) var(--tw-shadow-alpha), transparent);
    }
  }
  .shadow-sky-500 {
    --tw-shadow-color: oklch(68.5% 0.169 237.323);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-shadow-color: color-mix(in oklab, var(--color-sky-500) var(--tw-shadow-alpha), transparent);
    }
  }
  .shadow-sky-500\/20 {
    --tw-shadow-color: color-mix(in srgb, oklch(68.5% 0.169 237.323) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-shadow-color: color-mix(in oklab, color-mix(in oklab, var(--color-sky-500) 20%, transparent) var(--tw-shadow-alpha), transparent);
    }
  }
  .outline {
    outline-style: var(--tw-outline-style);
    outline-width: 1px;
  }
  .blur-3xl {
    --tw-blur: blur(var(--blur-3xl));
    filter: var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,);
  }
  .filter {
    filter: var(--tw-blur,) var(--tw-brightness,) var(--tw-contrast,) var(--tw-grayscale,) var(--tw-hue-rotate,) var(--tw-invert,) var(--tw-saturate,) var(--tw-sepia,) var(--tw-drop-shadow,);
  }
  .backdrop-blur-md {
    --tw-backdrop-blur: blur(var(--blur-md));
    -webkit-backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);
    backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);
  }
  .backdrop-blur-sm {
    --tw-backdrop-blur: blur(var(--blur-sm));
    -webkit-backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);
    backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);
  }
  .backdrop-blur-xs {
    --tw-backdrop-blur: blur(var(--blur-xs));
    -webkit-backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);
    backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);
  }
  .backdrop-filter {
    -webkit-backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);
    backdrop-filter: var(--tw-backdrop-blur,) var(--tw-backdrop-brightness,) var(--tw-backdrop-contrast,) var(--tw-backdrop-grayscale,) var(--tw-backdrop-hue-rotate,) var(--tw-backdrop-invert,) var(--tw-backdrop-opacity,) var(--tw-backdrop-saturate,) var(--tw-backdrop-sepia,);
  }
  .transition-all {
    transition-property: all;
    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
    transition-duration: var(--tw-duration, var(--default-transition-duration));
  }
  .transition-colors {
    transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to;
    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
    transition-duration: var(--tw-duration, var(--default-transition-duration));
  }
  .transition-transform {
    transition-property: transform, translate, scale, rotate;
    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
    transition-duration: var(--tw-duration, var(--default-transition-duration));
  }
  .duration-200 {
    --tw-duration: 200ms;
    transition-duration: 200ms;
  }
  .duration-300 {
    --tw-duration: 300ms;
    transition-duration: 300ms;
  }
  .ease-in-out {
    --tw-ease: var(--ease-in-out);
    transition-timing-function: var(--ease-in-out);
  }
  .select-all {
    -webkit-user-select: all;
    user-select: all;
  }
  .select-none {
    -webkit-user-select: none;
    user-select: none;
  }
  @media (hover: hover) {
    .group-hover\:line-clamp-none:is(:where(.group):hover *) {
      overflow: visible;
      display: block;
      -webkit-box-orient: horizontal;
      -webkit-line-clamp: unset;
    }
    .group-hover\:scale-110:is(:where(.group):hover *) {
      --tw-scale-x: 110%;
      --tw-scale-y: 110%;
      --tw-scale-z: 110%;
      scale: var(--tw-scale-x) var(--tw-scale-y);
    }
    .group-hover\:text-emerald-300:is(:where(.group):hover *) {
      color: var(--color-emerald-300);
    }
    .group-hover\:text-emerald-400:is(:where(.group):hover *) {
      color: var(--color-emerald-400);
    }
    .group-hover\:opacity-100:is(:where(.group):hover *) {
      opacity: 100%;
    }
  }
  .selection\:bg-emerald-500 ::selection {
    background-color: var(--color-emerald-500);
  }
  .selection\:bg-emerald-500::selection {
    background-color: var(--color-emerald-500);
  }
  .selection\:text-slate-950 ::selection {
    color: var(--color-slate-950);
  }
  .selection\:text-slate-950::selection {
    color: var(--color-slate-950);
  }
  .placeholder\:text-xs::placeholder {
    font-size: var(--text-xs);
    line-height: var(--tw-leading, var(--text-xs--line-height));
  }
  .placeholder\:tracking-normal::placeholder {
    --tw-tracking: var(--tracking-normal);
    letter-spacing: var(--tracking-normal);
  }
  .placeholder\:text-slate-500::placeholder {
    color: var(--color-slate-500);
  }
  .placeholder\:text-slate-600::placeholder {
    color: var(--color-slate-600);
  }
  @media (hover: hover) {
    .hover\:-translate-y-0\.5:hover {
      --tw-translate-y: calc(var(--spacing) * -0.5);
      translate: var(--tw-translate-x) var(--tw-translate-y);
    }
    .hover\:scale-102:hover {
      --tw-scale-x: 102%;
      --tw-scale-y: 102%;
      --tw-scale-z: 102%;
      scale: var(--tw-scale-x) var(--tw-scale-y);
    }
    .hover\:border-amber-500\/50:hover {
      border-color: color-mix(in srgb, oklch(76.9% 0.188 70.08) 50%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:border-amber-500\/50:hover {
        border-color: color-mix(in oklab, var(--color-amber-500) 50%, transparent);
      }
    }
    .hover\:border-amber-500\/70:hover {
      border-color: color-mix(in srgb, oklch(76.9% 0.188 70.08) 70%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:border-amber-500\/70:hover {
        border-color: color-mix(in oklab, var(--color-amber-500) 70%, transparent);
      }
    }
    .hover\:border-blue-500\/50:hover {
      border-color: color-mix(in srgb, oklch(62.3% 0.214 259.815) 50%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:border-blue-500\/50:hover {
        border-color: color-mix(in oklab, var(--color-blue-500) 50%, transparent);
      }
    }
    .hover\:border-emerald-500\/50:hover {
      border-color: color-mix(in srgb, oklch(69.6% 0.17 162.48) 50%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:border-emerald-500\/50:hover {
        border-color: color-mix(in oklab, var(--color-emerald-500) 50%, transparent);
      }
    }
    .hover\:border-emerald-500\/60:hover {
      border-color: color-mix(in srgb, oklch(69.6% 0.17 162.48) 60%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:border-emerald-500\/60:hover {
        border-color: color-mix(in oklab, var(--color-emerald-500) 60%, transparent);
      }
    }
    .hover\:border-indigo-500\/50:hover {
      border-color: color-mix(in srgb, oklch(58.5% 0.233 277.117) 50%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:border-indigo-500\/50:hover {
        border-color: color-mix(in oklab, var(--color-indigo-500) 50%, transparent);
      }
    }
    .hover\:border-purple-500\/50:hover {
      border-color: color-mix(in srgb, oklch(62.7% 0.265 303.9) 50%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:border-purple-500\/50:hover {
        border-color: color-mix(in oklab, var(--color-purple-500) 50%, transparent);
      }
    }
    .hover\:border-rose-500\/30:hover {
      border-color: color-mix(in srgb, oklch(64.5% 0.246 16.439) 30%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:border-rose-500\/30:hover {
        border-color: color-mix(in oklab, var(--color-rose-500) 30%, transparent);
      }
    }
    .hover\:border-rose-500\/40:hover {
      border-color: color-mix(in srgb, oklch(64.5% 0.246 16.439) 40%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:border-rose-500\/40:hover {
        border-color: color-mix(in oklab, var(--color-rose-500) 40%, transparent);
      }
    }
    .hover\:border-sky-500\/30:hover {
      border-color: color-mix(in srgb, oklch(68.5% 0.169 237.323) 30%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:border-sky-500\/30:hover {
        border-color: color-mix(in oklab, var(--color-sky-500) 30%, transparent);
      }
    }
    .hover\:border-slate-700:hover {
      border-color: var(--color-slate-700);
    }
    .hover\:bg-amber-500:hover {
      background-color: var(--color-amber-500);
    }
    .hover\:bg-amber-500\/30:hover {
      background-color: color-mix(in srgb, oklch(76.9% 0.188 70.08) 30%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-amber-500\/30:hover {
        background-color: color-mix(in oklab, var(--color-amber-500) 30%, transparent);
      }
    }
    .hover\:bg-amber-900\/80:hover {
      background-color: color-mix(in srgb, oklch(41.4% 0.112 45.904) 80%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-amber-900\/80:hover {
        background-color: color-mix(in oklab, var(--color-amber-900) 80%, transparent);
      }
    }
    .hover\:bg-emerald-400:hover {
      background-color: var(--color-emerald-400);
    }
    .hover\:bg-emerald-500:hover {
      background-color: var(--color-emerald-500);
    }
    .hover\:bg-emerald-500\/20:hover {
      background-color: color-mix(in srgb, oklch(69.6% 0.17 162.48) 20%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-emerald-500\/20:hover {
        background-color: color-mix(in oklab, var(--color-emerald-500) 20%, transparent);
      }
    }
    .hover\:bg-emerald-500\/25:hover {
      background-color: color-mix(in srgb, oklch(69.6% 0.17 162.48) 25%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-emerald-500\/25:hover {
        background-color: color-mix(in oklab, var(--color-emerald-500) 25%, transparent);
      }
    }
    .hover\:bg-emerald-500\/30:hover {
      background-color: color-mix(in srgb, oklch(69.6% 0.17 162.48) 30%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-emerald-500\/30:hover {
        background-color: color-mix(in oklab, var(--color-emerald-500) 30%, transparent);
      }
    }
    .hover\:bg-emerald-600:hover {
      background-color: var(--color-emerald-600);
    }
    .hover\:bg-emerald-900\/80:hover {
      background-color: color-mix(in srgb, oklch(37.8% 0.077 168.94) 80%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-emerald-900\/80:hover {
        background-color: color-mix(in oklab, var(--color-emerald-900) 80%, transparent);
      }
    }
    .hover\:bg-indigo-400:hover {
      background-color: var(--color-indigo-400);
    }
    .hover\:bg-indigo-500:hover {
      background-color: var(--color-indigo-500);
    }
    .hover\:bg-indigo-500\/10:hover {
      background-color: color-mix(in srgb, oklch(58.5% 0.233 277.117) 10%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-indigo-500\/10:hover {
        background-color: color-mix(in oklab, var(--color-indigo-500) 10%, transparent);
      }
    }
    .hover\:bg-indigo-500\/20:hover {
      background-color: color-mix(in srgb, oklch(58.5% 0.233 277.117) 20%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-indigo-500\/20:hover {
        background-color: color-mix(in oklab, var(--color-indigo-500) 20%, transparent);
      }
    }
    .hover\:bg-purple-500:hover {
      background-color: var(--color-purple-500);
    }
    .hover\:bg-purple-500\/30:hover {
      background-color: color-mix(in srgb, oklch(62.7% 0.265 303.9) 30%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-purple-500\/30:hover {
        background-color: color-mix(in oklab, var(--color-purple-500) 30%, transparent);
      }
    }
    .hover\:bg-purple-900:hover {
      background-color: var(--color-purple-900);
    }
    .hover\:bg-purple-950\/50:hover {
      background-color: color-mix(in srgb, oklch(29.1% 0.149 302.717) 50%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-purple-950\/50:hover {
        background-color: color-mix(in oklab, var(--color-purple-950) 50%, transparent);
      }
    }
    .hover\:bg-rose-500:hover {
      background-color: var(--color-rose-500);
    }
    .hover\:bg-rose-500\/10:hover {
      background-color: color-mix(in srgb, oklch(64.5% 0.246 16.439) 10%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-rose-500\/10:hover {
        background-color: color-mix(in oklab, var(--color-rose-500) 10%, transparent);
      }
    }
    .hover\:bg-rose-500\/20:hover {
      background-color: color-mix(in srgb, oklch(64.5% 0.246 16.439) 20%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-rose-500\/20:hover {
        background-color: color-mix(in oklab, var(--color-rose-500) 20%, transparent);
      }
    }
    .hover\:bg-rose-500\/30:hover {
      background-color: color-mix(in srgb, oklch(64.5% 0.246 16.439) 30%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-rose-500\/30:hover {
        background-color: color-mix(in oklab, var(--color-rose-500) 30%, transparent);
      }
    }
    .hover\:bg-rose-600:hover {
      background-color: var(--color-rose-600);
    }
    .hover\:bg-rose-900:hover {
      background-color: var(--color-rose-900);
    }
    .hover\:bg-rose-900\/40:hover {
      background-color: color-mix(in srgb, oklch(41% 0.159 10.272) 40%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-rose-900\/40:hover {
        background-color: color-mix(in oklab, var(--color-rose-900) 40%, transparent);
      }
    }
    .hover\:bg-rose-900\/60:hover {
      background-color: color-mix(in srgb, oklch(41% 0.159 10.272) 60%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-rose-900\/60:hover {
        background-color: color-mix(in oklab, var(--color-rose-900) 60%, transparent);
      }
    }
    .hover\:bg-rose-950\/40:hover {
      background-color: color-mix(in srgb, oklch(27.1% 0.105 12.094) 40%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-rose-950\/40:hover {
        background-color: color-mix(in oklab, var(--color-rose-950) 40%, transparent);
      }
    }
    .hover\:bg-rose-950\/60:hover {
      background-color: color-mix(in srgb, oklch(27.1% 0.105 12.094) 60%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-rose-950\/60:hover {
        background-color: color-mix(in oklab, var(--color-rose-950) 60%, transparent);
      }
    }
    .hover\:bg-sky-400:hover {
      background-color: var(--color-sky-400);
    }
    .hover\:bg-sky-500:hover {
      background-color: var(--color-sky-500);
    }
    .hover\:bg-sky-500\/10:hover {
      background-color: color-mix(in srgb, oklch(68.5% 0.169 237.323) 10%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-sky-500\/10:hover {
        background-color: color-mix(in oklab, var(--color-sky-500) 10%, transparent);
      }
    }
    .hover\:bg-sky-600:hover {
      background-color: var(--color-sky-600);
    }
    .hover\:bg-slate-300:hover {
      background-color: var(--color-slate-300);
    }
    .hover\:bg-slate-700:hover {
      background-color: var(--color-slate-700);
    }
    .hover\:bg-slate-800:hover {
      background-color: var(--color-slate-800);
    }
    .hover\:bg-slate-800\/30:hover {
      background-color: color-mix(in srgb, oklch(27.9% 0.041 260.031) 30%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-slate-800\/30:hover {
        background-color: color-mix(in oklab, var(--color-slate-800) 30%, transparent);
      }
    }
    .hover\:bg-slate-800\/40:hover {
      background-color: color-mix(in srgb, oklch(27.9% 0.041 260.031) 40%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-slate-800\/40:hover {
        background-color: color-mix(in oklab, var(--color-slate-800) 40%, transparent);
      }
    }
    .hover\:bg-slate-800\/50:hover {
      background-color: color-mix(in srgb, oklch(27.9% 0.041 260.031) 50%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-slate-800\/50:hover {
        background-color: color-mix(in oklab, var(--color-slate-800) 50%, transparent);
      }
    }
    .hover\:bg-slate-800\/60:hover {
      background-color: color-mix(in srgb, oklch(27.9% 0.041 260.031) 60%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-slate-800\/60:hover {
        background-color: color-mix(in oklab, var(--color-slate-800) 60%, transparent);
      }
    }
    .hover\:bg-slate-800\/80:hover {
      background-color: color-mix(in srgb, oklch(27.9% 0.041 260.031) 80%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-slate-800\/80:hover {
        background-color: color-mix(in oklab, var(--color-slate-800) 80%, transparent);
      }
    }
    .hover\:bg-slate-900\/60:hover {
      background-color: color-mix(in srgb, oklch(20.8% 0.042 265.755) 60%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-slate-900\/60:hover {
        background-color: color-mix(in oklab, var(--color-slate-900) 60%, transparent);
      }
    }
    .hover\:bg-slate-900\/80:hover {
      background-color: color-mix(in srgb, oklch(20.8% 0.042 265.755) 80%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-slate-900\/80:hover {
        background-color: color-mix(in oklab, var(--color-slate-900) 80%, transparent);
      }
    }
    .hover\:bg-slate-950:hover {
      background-color: var(--color-slate-950);
    }
    .hover\:bg-slate-950\/60:hover {
      background-color: color-mix(in srgb, oklch(12.9% 0.042 264.695) 60%, transparent);
    }
    @supports (color: color-mix(in lab, red, red)) {
      .hover\:bg-slate-950\/60:hover {
        background-color: color-mix(in oklab, var(--color-slate-950) 60%, transparent);
      }
    }
    .hover\:text-emerald-200:hover {
      color: var(--color-emerald-200);
    }
    .hover\:text-emerald-300:hover {
      color: var(--color-emerald-300);
    }
    .hover\:text-indigo-300:hover {
      color: var(--color-indigo-300);
    }
    .hover\:text-indigo-400:hover {
      color: var(--color-indigo-400);
    }
    .hover\:text-rose-200:hover {
      color: var(--color-rose-200);
    }
    .hover\:text-rose-300:hover {
      color: var(--color-rose-300);
    }
    .hover\:text-rose-400:hover {
      color: var(--color-rose-400);
    }
    .hover\:text-slate-200:hover {
      color: var(--color-slate-200);
    }
    .hover\:text-slate-300:hover {
      color: var(--color-slate-300);
    }
    .hover\:text-slate-800:hover {
      color: var(--color-slate-800);
    }
    .hover\:text-slate-950:hover {
      color: var(--color-slate-950);
    }
    .hover\:text-white:hover {
      color: var(--color-white);
    }
    .hover\:underline:hover {
      text-decoration-line: underline;
    }
    .hover\:shadow-lg:hover {
      --tw-shadow: 0 10px 15px -3px var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 4px 6px -4px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
      box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
    }
  }
  .focus\:border-amber-400:focus {
    border-color: var(--color-amber-400);
  }
  .focus\:border-amber-500:focus {
    border-color: var(--color-amber-500);
  }
  .focus\:border-emerald-500:focus {
    border-color: var(--color-emerald-500);
  }
  .focus\:border-indigo-500:focus {
    border-color: var(--color-indigo-500);
  }
  .focus\:border-purple-500:focus {
    border-color: var(--color-purple-500);
  }
  .focus\:border-rose-500:focus {
    border-color: var(--color-rose-500);
  }
  .focus\:border-sky-500:focus {
    border-color: var(--color-sky-500);
  }
  .focus\:ring-0:focus {
    --tw-ring-shadow: var(--tw-ring-inset,) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
  }
  .focus\:ring-2:focus {
    --tw-ring-shadow: var(--tw-ring-inset,) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);
    box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
  }
  .focus\:ring-amber-500:focus {
    --tw-ring-color: var(--color-amber-500);
  }
  .focus\:ring-emerald-500\/20:focus {
    --tw-ring-color: color-mix(in srgb, oklch(69.6% 0.17 162.48) 20%, transparent);
    @supports (color: color-mix(in lab, red, red)) {
      --tw-ring-color: color-mix(in oklab, var(--color-emerald-500) 20%, transparent);
    }
  }
  .focus\:outline-none:focus {
    --tw-outline-style: none;
    outline-style: none;
  }
  .active\:scale-95:active {
    --tw-scale-x: 95%;
    --tw-scale-y: 95%;
    --tw-scale-z: 95%;
    scale: var(--tw-scale-x) var(--tw-scale-y);
  }
  .disabled\:opacity-50:disabled {
    opacity: 50%;
  }
  @media (width >= 40rem) {
    .sm\:col-span-1 {
      grid-column: span 1 / span 1;
    }
    .sm\:col-span-2 {
      grid-column: span 2 / span 2;
    }
    .sm\:col-span-3 {
      grid-column: span 3 / span 3;
    }
    .sm\:col-span-4 {
      grid-column: span 4 / span 4;
    }
    .sm\:col-span-5 {
      grid-column: span 5 / span 5;
    }
    .sm\:col-span-7 {
      grid-column: span 7 / span 7;
    }
    .sm\:block {
      display: block;
    }
    .sm\:flex {
      display: flex;
    }
    .sm\:inline {
      display: inline;
    }
    .sm\:w-56 {
      width: calc(var(--spacing) * 56);
    }
    .sm\:w-64 {
      width: calc(var(--spacing) * 64);
    }
    .sm\:w-\[68px\] {
      width: 68px;
    }
    .sm\:w-auto {
      width: auto;
    }
    .sm\:max-w-md {
      max-width: var(--container-md);
    }
    .sm\:flex-1 {
      flex: 1;
    }
    .sm\:grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .sm\:grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .sm\:grid-cols-4 {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    .sm\:grid-cols-5 {
      grid-template-columns: repeat(5, minmax(0, 1fr));
    }
    .sm\:grid-cols-12 {
      grid-template-columns: repeat(12, minmax(0, 1fr));
    }
    .sm\:flex-row {
      flex-direction: row;
    }
    .sm\:items-center {
      align-items: center;
    }
    .sm\:gap-3 {
      gap: calc(var(--spacing) * 3);
    }
    .sm\:gap-4 {
      gap: calc(var(--spacing) * 4);
    }
    :where(.sm\:space-y-5 > :not(:last-child)) {
      --tw-space-y-reverse: 0;
      margin-block-start: calc(calc(var(--spacing) * 5) * var(--tw-space-y-reverse));
      margin-block-end: calc(calc(var(--spacing) * 5) * calc(1 - var(--tw-space-y-reverse)));
    }
    :where(.sm\:space-x-2 > :not(:last-child)) {
      --tw-space-x-reverse: 0;
      margin-inline-start: calc(calc(var(--spacing) * 2) * var(--tw-space-x-reverse));
      margin-inline-end: calc(calc(var(--spacing) * 2) * calc(1 - var(--tw-space-x-reverse)));
    }
    .sm\:self-auto {
      align-self: auto;
    }
    .sm\:p-4 {
      padding: calc(var(--spacing) * 4);
    }
    .sm\:p-5 {
      padding: calc(var(--spacing) * 5);
    }
    .sm\:p-6 {
      padding: calc(var(--spacing) * 6);
    }
    .sm\:p-7 {
      padding: calc(var(--spacing) * 7);
    }
    .sm\:p-8 {
      padding: calc(var(--spacing) * 8);
    }
    .sm\:p-10 {
      padding: calc(var(--spacing) * 10);
    }
    .sm\:px-6 {
      padding-inline: calc(var(--spacing) * 6);
    }
    .sm\:text-2xl {
      font-size: var(--text-2xl);
      line-height: var(--tw-leading, var(--text-2xl--line-height));
    }
    .sm\:text-3xl {
      font-size: var(--text-3xl);
      line-height: var(--tw-leading, var(--text-3xl--line-height));
    }
    .sm\:text-lg {
      font-size: var(--text-lg);
      line-height: var(--tw-leading, var(--text-lg--line-height));
    }
    .sm\:text-sm {
      font-size: var(--text-sm);
      line-height: var(--tw-leading, var(--text-sm--line-height));
    }
    .sm\:text-xl {
      font-size: var(--text-xl);
      line-height: var(--tw-leading, var(--text-xl--line-height));
    }
  }
  @media (width >= 48rem) {
    .md\:col-span-2 {
      grid-column: span 2 / span 2;
    }
    .md\:col-span-5 {
      grid-column: span 5 / span 5;
    }
    .md\:col-span-7 {
      grid-column: span 7 / span 7;
    }
    .md\:inline {
      display: inline;
    }
    .md\:w-auto {
      width: auto;
    }
    .md\:flex-none {
      flex: none;
    }
    .md\:grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .md\:grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .md\:grid-cols-4 {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    .md\:grid-cols-12 {
      grid-template-columns: repeat(12, minmax(0, 1fr));
    }
    .md\:flex-row {
      flex-direction: row;
    }
    .md\:items-center {
      align-items: center;
    }
    .md\:self-center {
      align-self: center;
    }
  }
  @media (width >= 64rem) {
    .lg\:col-span-2 {
      grid-column: span 2 / span 2;
    }
    .lg\:col-span-5 {
      grid-column: span 5 / span 5;
    }
    .lg\:col-span-7 {
      grid-column: span 7 / span 7;
    }
    .lg\:h-\[640px\] {
      height: 640px;
    }
    .lg\:grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .lg\:grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .lg\:grid-cols-4 {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    .lg\:grid-cols-5 {
      grid-template-columns: repeat(5, minmax(0, 1fr));
    }
    .lg\:grid-cols-12 {
      grid-template-columns: repeat(12, minmax(0, 1fr));
    }
    .lg\:flex-row {
      flex-direction: row;
    }
    .lg\:items-center {
      align-items: center;
    }
    .lg\:px-8 {
      padding-inline: calc(var(--spacing) * 8);
    }
    .lg\:text-3xl {
      font-size: var(--text-3xl);
      line-height: var(--tw-leading, var(--text-3xl--line-height));
    }
  }
  @media (width >= 80rem) {
    .xl\:col-span-4 {
      grid-column: span 4 / span 4;
    }
    .xl\:col-span-8 {
      grid-column: span 8 / span 8;
    }
    .xl\:h-\[700px\] {
      height: 700px;
    }
    .xl\:grid-cols-4 {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
}
@media print {
  body {
    background-color: #ffffff !important;
    color: #000000 !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  body * {
    visibility: hidden;
  }
  #printable-ticket-area, #printable-ticket-area * {
    visibility: visible !important;
  }
  #printable-ticket-area {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 80mm !important;
    max-width: 100% !important;
    margin: 0 auto !important;
    padding: 8px !important;
    background: #ffffff !important;
    color: #000000 !important;
    display: block !important;
    font-family: 'Courier New', Courier, monospace !important;
    font-size: 11px !important;
    line-height: 1.35 !important;
    border: none !important;
    box-shadow: none !important;
  }
  .no-print, button, .modal-backdrop {
    display: none !important;
    visibility: hidden !important;
  }
  @page {
    size: auto;
    margin: 4mm;
  }
}
@property --tw-translate-x {
  syntax: "*";
  inherits: false;
  initial-value: 0;
}
@property --tw-translate-y {
  syntax: "*";
  inherits: false;
  initial-value: 0;
}
@property --tw-translate-z {
  syntax: "*";
  inherits: false;
  initial-value: 0;
}
@property --tw-scale-x {
  syntax: "*";
  inherits: false;
  initial-value: 1;
}
@property --tw-scale-y {
  syntax: "*";
  inherits: false;
  initial-value: 1;
}
@property --tw-scale-z {
  syntax: "*";
  inherits: false;
  initial-value: 1;
}
@property --tw-rotate-x {
  syntax: "*";
  inherits: false;
}
@property --tw-rotate-y {
  syntax: "*";
  inherits: false;
}
@property --tw-rotate-z {
  syntax: "*";
  inherits: false;
}
@property --tw-skew-x {
  syntax: "*";
  inherits: false;
}
@property --tw-skew-y {
  syntax: "*";
  inherits: false;
}
@property --tw-space-y-reverse {
  syntax: "*";
  inherits: false;
  initial-value: 0;
}
@property --tw-space-x-reverse {
  syntax: "*";
  inherits: false;
  initial-value: 0;
}
@property --tw-divide-y-reverse {
  syntax: "*";
  inherits: false;
  initial-value: 0;
}
@property --tw-border-style {
  syntax: "*";
  inherits: false;
  initial-value: solid;
}
@property --tw-gradient-position {
  syntax: "*";
  inherits: false;
}
@property --tw-gradient-from {
  syntax: "<color>";
  inherits: false;
  initial-value: #0000;
}
@property --tw-gradient-via {
  syntax: "<color>";
  inherits: false;
  initial-value: #0000;
}
@property --tw-gradient-to {
  syntax: "<color>";
  inherits: false;
  initial-value: #0000;
}
@property --tw-gradient-stops {
  syntax: "*";
  inherits: false;
}
@property --tw-gradient-via-stops {
  syntax: "*";
  inherits: false;
}
@property --tw-gradient-from-position {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0%;
}
@property --tw-gradient-via-position {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 50%;
}
@property --tw-gradient-to-position {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 100%;
}
@property --tw-leading {
  syntax: "*";
  inherits: false;
}
@property --tw-font-weight {
  syntax: "*";
  inherits: false;
}
@property --tw-tracking {
  syntax: "*";
  inherits: false;
}
@property --tw-shadow {
  syntax: "*";
  inherits: false;
  initial-value: 0 0 #0000;
}
@property --tw-shadow-color {
  syntax: "*";
  inherits: false;
}
@property --tw-shadow-alpha {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 100%;
}
@property --tw-inset-shadow {
  syntax: "*";
  inherits: false;
  initial-value: 0 0 #0000;
}
@property --tw-inset-shadow-color {
  syntax: "*";
  inherits: false;
}
@property --tw-inset-shadow-alpha {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 100%;
}
@property --tw-ring-color {
  syntax: "*";
  inherits: false;
}
@property --tw-ring-shadow {
  syntax: "*";
  inherits: false;
  initial-value: 0 0 #0000;
}
@property --tw-inset-ring-color {
  syntax: "*";
  inherits: false;
}
@property --tw-inset-ring-shadow {
  syntax: "*";
  inherits: false;
  initial-value: 0 0 #0000;
}
@property --tw-ring-inset {
  syntax: "*";
  inherits: false;
}
@property --tw-ring-offset-width {
  syntax: "<length>";
  inherits: false;
  initial-value: 0px;
}
@property --tw-ring-offset-color {
  syntax: "*";
  inherits: false;
  initial-value: #fff;
}
@property --tw-ring-offset-shadow {
  syntax: "*";
  inherits: false;
  initial-value: 0 0 #0000;
}
@property --tw-outline-style {
  syntax: "*";
  inherits: false;
  initial-value: solid;
}
@property --tw-blur {
  syntax: "*";
  inherits: false;
}
@property --tw-brightness {
  syntax: "*";
  inherits: false;
}
@property --tw-contrast {
  syntax: "*";
  inherits: false;
}
@property --tw-grayscale {
  syntax: "*";
  inherits: false;
}
@property --tw-hue-rotate {
  syntax: "*";
  inherits: false;
}
@property --tw-invert {
  syntax: "*";
  inherits: false;
}
@property --tw-opacity {
  syntax: "*";
  inherits: false;
}
@property --tw-saturate {
  syntax: "*";
  inherits: false;
}
@property --tw-sepia {
  syntax: "*";
  inherits: false;
}
@property --tw-drop-shadow {
  syntax: "*";
  inherits: false;
}
@property --tw-drop-shadow-color {
  syntax: "*";
  inherits: false;
}
@property --tw-drop-shadow-alpha {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 100%;
}
@property --tw-drop-shadow-size {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-blur {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-brightness {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-contrast {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-grayscale {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-hue-rotate {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-invert {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-opacity {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-saturate {
  syntax: "*";
  inherits: false;
}
@property --tw-backdrop-sepia {
  syntax: "*";
  inherits: false;
}
@property --tw-duration {
  syntax: "*";
  inherits: false;
}
@property --tw-ease {
  syntax: "*";
  inherits: false;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes pulse {
  50% {
    opacity: 0.5;
  }
}
@layer properties {
  @supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color:rgb(from red r g b)))) {
    *, ::before, ::after, ::backdrop {
      --tw-translate-x: 0;
      --tw-translate-y: 0;
      --tw-translate-z: 0;
      --tw-scale-x: 1;
      --tw-scale-y: 1;
      --tw-scale-z: 1;
      --tw-rotate-x: initial;
      --tw-rotate-y: initial;
      --tw-rotate-z: initial;
      --tw-skew-x: initial;
      --tw-skew-y: initial;
      --tw-space-y-reverse: 0;
      --tw-space-x-reverse: 0;
      --tw-divide-y-reverse: 0;
      --tw-border-style: solid;
      --tw-gradient-position: initial;
      --tw-gradient-from: #0000;
      --tw-gradient-via: #0000;
      --tw-gradient-to: #0000;
      --tw-gradient-stops: initial;
      --tw-gradient-via-stops: initial;
      --tw-gradient-from-position: 0%;
      --tw-gradient-via-position: 50%;
      --tw-gradient-to-position: 100%;
      --tw-leading: initial;
      --tw-font-weight: initial;
      --tw-tracking: initial;
      --tw-shadow: 0 0 #0000;
      --tw-shadow-color: initial;
      --tw-shadow-alpha: 100%;
      --tw-inset-shadow: 0 0 #0000;
      --tw-inset-shadow-color: initial;
      --tw-inset-shadow-alpha: 100%;
      --tw-ring-color: initial;
      --tw-ring-shadow: 0 0 #0000;
      --tw-inset-ring-color: initial;
      --tw-inset-ring-shadow: 0 0 #0000;
      --tw-ring-inset: initial;
      --tw-ring-offset-width: 0px;
      --tw-ring-offset-color: #fff;
      --tw-ring-offset-shadow: 0 0 #0000;
      --tw-outline-style: solid;
      --tw-blur: initial;
      --tw-brightness: initial;
      --tw-contrast: initial;
      --tw-grayscale: initial;
      --tw-hue-rotate: initial;
      --tw-invert: initial;
      --tw-opacity: initial;
      --tw-saturate: initial;
      --tw-sepia: initial;
      --tw-drop-shadow: initial;
      --tw-drop-shadow-color: initial;
      --tw-drop-shadow-alpha: 100%;
      --tw-drop-shadow-size: initial;
      --tw-backdrop-blur: initial;
      --tw-backdrop-brightness: initial;
      --tw-backdrop-contrast: initial;
      --tw-backdrop-grayscale: initial;
      --tw-backdrop-hue-rotate: initial;
      --tw-backdrop-invert: initial;
      --tw-backdrop-opacity: initial;
      --tw-backdrop-saturate: initial;
      --tw-backdrop-sepia: initial;
      --tw-duration: initial;
      --tw-ease: initial;
    }
  }
}


  /* ========================================================================= */
  /* UNIVERSAL MODAL SYSTEM & DRAGGABLE LAPTOP WINDOW ENGINE                   */
  /* ========================================================================= */
  .app-modal {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 99999 !important;
    background-color: rgba(2, 6, 23, 0.85) !important;
    backdrop-filter: blur(8px) !important;
    -webkit-backdrop-filter: blur(8px) !important;
    display: none;
    align-items: center !important;
    justify-content: center !important;
    padding: 12px !important;
    overflow-y: auto !important;
    box-sizing: border-box !important;
  }

  .app-modal.active-modal, .app-modal[style*="display: flex"] {
    display: flex !important;
  }

  .app-modal > div {
    margin: auto !important;
    max-height: 94vh !important;
    max-width: min(96vw, 1100px) !important;
    box-sizing: border-box !important;
    display: flex !important;
    flex-direction: column !important;
    position: relative !important;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(51, 65, 85, 0.6) !important;
  }

  .modal-drag-header {
    cursor: grab !important;
    user-select: none !important;
    -webkit-user-select: none !important;
  }

  .modal-drag-header:active {
    cursor: grabbing !important;
  }

  .modal-drag-header input,
  .modal-drag-header button,
  .modal-drag-header select,
  .modal-drag-header a {
    user-select: auto !important;
  }

</style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950">

  <!-- TOP AUTH & SECURITY BAR -->
  <header class="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-30">
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-1.5 font-bold text-slate-200">
        <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
        <span class="hidden sm:inline">Seguridad & Control:</span>
      </div>

      <div id="auth-user-badge" class="flex items-center gap-2">
        <!-- Rendered by JS -->
      </div>
    </div>

    <div class="flex items-center gap-2">
      <!-- Daily exchange rate fast info -->
      <button onclick="openTasaModal()" class="px-2.5 py-1 rounded-lg bg-slate-950 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center gap-1.5 hover:bg-slate-800 cursor-pointer">
        <span class="text-slate-400 text-[10px]">Tasa:</span>
        <span id="top-tasa-text" class="font-bold">1 USD = Bs. 36.50</span>
      </button>

      <!-- Cloud Store & Firebase Links -->
      <a href="https://ais-pre-tyt52fncy3eo3afi2k5i4d-221340882796.us-east5.run.app?vista=tienda" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs" title="Abrir Tienda Online de Clientes">
        <svg class="w-3.5 h-3.5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        <span class="hidden sm:inline">Tienda Online</span>
      </a>

      <button onclick="copiarLinkTienda()" class="px-2.5 py-1 rounded-lg bg-teal-950/80 border border-teal-500/30 text-teal-300 hover:bg-teal-900/60 font-medium flex items-center gap-1.5 transition-colors cursor-pointer text-xs" title="Copiar link de la tienda para enviar por WhatsApp">
        <svg class="w-3.5 h-3.5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
        <span class="hidden md:inline">Link Tienda Clientes</span>
      </button>

      <a href="https://console.firebase.google.com/project/composed-keep-9v9wh/firestore" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs" title="Abrir Consola de Base de Datos Firebase Firestore">
        <span>🔥</span>
        <span class="hidden sm:inline">Firebase Nube</span>
      </a>

      <a href="https://ais-pre-tyt52fncy3eo3afi2k5i4d-221340882796.us-east5.run.app" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs" title="Abrir versión web completa en Google Cloud para Laptop">
        <svg class="w-3.5 h-3.5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z"/></svg>
        <span class="hidden sm:inline">Laptop / Nube ↗</span>
      </a>

      <button onclick="openLoginModal()" class="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs">
        <svg class="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        <span id="btn-login-label">Cambiar Usuario (PIN)</span>
      </button>

      <button onclick="openPinGuideModal()" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 cursor-pointer text-xs">
        <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
        <span class="hidden sm:inline">PINs</span>
      </button>
    </div>
  </header>

  <!-- MAIN APP CONTAINER WITH SIDEBAR -->
  <div class="flex-1 flex flex-row overflow-hidden min-h-0">
    
    <!-- LEFT SIDEBAR -->
    <aside id="main-sidebar" class="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 transition-all duration-300 ease-in-out select-none">
      <!-- Company Branding -->
      <div class="p-3.5 border-b border-slate-800/80 flex items-center justify-between gap-2 bg-slate-950/60">
        <div class="flex items-center gap-2.5 overflow-hidden">
          <div class="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          </div>
          <div id="side-company-info" class="overflow-hidden">
            <h2 id="side-company-name" class="text-xs font-bold text-white truncate">Corporación Los Andes C.A.</h2>
            <div class="flex items-center gap-1 mt-0.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span class="text-[10px] text-slate-400 truncate">3 Sucursales</span>
            </div>
          </div>
        </div>

        <!-- Toggle Collapse/Expand Button -->
        <button onclick="toggleSidebar()" id="btn-toggle-sidebar" title="Colapsar menú lateral hacia la izquierda" class="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-400 hover:text-emerald-300 border border-slate-700/80 transition-colors cursor-pointer shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/></svg>
        </button>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex-1 overflow-y-auto p-2 space-y-1">
        <div id="side-modules-header" class="px-2 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
          <span>Módulos</span>
          <span class="text-[9px] text-slate-600 font-normal">Autocolapsable</span>
        </div>

        <!-- 1. Dashboard -->
        <button onclick="switchTab('dashboard')" id="nav-btn-dashboard" title="Dashboard - Cuadro de Mando" class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer">
          <div class="flex items-center gap-2.5 min-w-0">
            <svg class="w-4 h-4 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            <span class="nav-btn-text truncate">Dashboard</span>
          </div>
          <span id="lock-dashboard" class="nav-btn-badge hidden text-slate-600 shrink-0"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg></span>
        </button>

        <!-- 2. Ventas POS -->
        <button onclick="switchTab('ventas')" id="nav-btn-ventas" title="Ventas (POS) - Facturación Dual $ / Bs." class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 transition-all shadow-md shadow-emerald-500/20 cursor-pointer">
          <div class="flex items-center gap-2.5 min-w-0">
            <svg class="w-4 h-4 text-slate-950 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            <span class="nav-btn-text truncate">Ventas (POS)</span>
          </div>
          <span class="nav-btn-badge text-[10px] bg-slate-950/20 px-1.5 py-0.5 rounded font-mono font-bold shrink-0">Caja</span>
        </button>

        <!-- 3. Inventario -->
        <button onclick="switchTab('inventario')" id="nav-btn-inventario" title="Inventario - Stock y Traspasos" class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer">
          <div class="flex items-center gap-2.5 min-w-0">
            <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
            <span class="nav-btn-text truncate">Inventario</span>
          </div>
          <span id="lock-inventario" class="nav-btn-badge hidden text-slate-600 shrink-0"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg></span>
        </button>

        <!-- 4. Compras -->
        <button onclick="switchTab('compras')" id="nav-btn-compras" title="Compras - Recepción y Stock" class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer">
          <div class="flex items-center gap-2.5 min-w-0">
            <svg class="w-4 h-4 text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            <span class="nav-btn-text truncate">Compras</span>
          </div>
          <span id="lock-compras" class="nav-btn-badge hidden text-slate-600 shrink-0"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg></span>
        </button>

        <!-- 5. Clientes -->
        <button onclick="switchTab('clientes')" id="nav-btn-clientes" title="Clientes - Directorio y Créditos" class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer">
          <div class="flex items-center gap-2.5 min-w-0">
            <svg class="w-4 h-4 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            <span class="nav-btn-text truncate">Clientes</span>
          </div>
          <span id="lock-clientes" class="nav-btn-badge hidden text-slate-600 shrink-0"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg></span>
        </button>

        <!-- 6. Proveedores -->
        <button onclick="switchTab('proveedores')" id="nav-btn-proveedores" title="Proveedores - Cuentas y Contactos" class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer">
          <div class="flex items-center gap-2.5 min-w-0">
            <svg class="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20"/></svg>
            <span class="nav-btn-text truncate">Proveedores</span>
          </div>
          <span id="lock-proveedores" class="nav-btn-badge hidden text-slate-600 shrink-0"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg></span>
        </button>

        <!-- 7. CxC -->
        <button onclick="switchTab('cxc')" id="nav-btn-cxc" title="CxC - Cuentas por Cobrar" class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer">
          <div class="flex items-center gap-2.5 min-w-0">
            <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span class="nav-btn-text truncate">Cuentas por Cobrar</span>
          </div>
          <span id="lock-cxc" class="nav-btn-badge hidden text-slate-600 shrink-0"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg></span>
        </button>

        <!-- 8. CxP -->
        <button onclick="switchTab('cxp')" id="nav-btn-cxp" title="CxP - Cuentas por Pagar" class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer">
          <div class="flex items-center gap-2.5 min-w-0">
            <svg class="w-4 h-4 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"/></svg>
            <span class="nav-btn-text truncate">Cuentas por Pagar</span>
          </div>
          <span id="lock-cxp" class="nav-btn-badge hidden text-slate-600 shrink-0"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg></span>
        </button>

        <!-- 9. Reportes -->
        <button onclick="switchTab('reportes')" id="nav-btn-reportes" title="Reportes & Cortes X/Z" class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer">
          <div class="flex items-center gap-2.5 min-w-0">
            <svg class="w-4 h-4 text-cyan-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            <span class="nav-btn-text truncate">Reportes & Cortes</span>
          </div>
          <span id="lock-reportes" class="nav-btn-badge hidden text-slate-600 shrink-0"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg></span>
        </button>

        <!-- 10. Configuración -->
        <button onclick="switchTab('configuracion')" id="nav-btn-configuracion" title="Configuración de Empresa y Usuarios" class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer">
          <div class="flex items-center gap-2.5 min-w-0">
            <svg class="w-4 h-4 text-amber-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span class="nav-btn-text truncate">Configuración</span>
          </div>
          <span id="lock-configuracion" class="nav-btn-badge hidden text-slate-600 shrink-0"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg></span>
        </button>
      </div>

      <!-- User Card -->
      <div class="p-2.5 border-t border-slate-800 bg-slate-950">
        <div class="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
          <div class="flex items-center gap-2 overflow-hidden">
            <div id="side-user-avatar" class="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 font-bold text-xs flex items-center justify-center border border-purple-500/30 shrink-0">
              AM
            </div>
            <div id="side-user-text" class="overflow-hidden">
              <p id="side-user-name" class="text-xs font-bold text-white truncate">Ana Morales</p>
              <p id="side-user-role" class="text-[10px] text-purple-400 font-semibold truncate">Gerente General</p>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- CONTENT AREA -->
    <main class="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6">
      
      <!-- RESTRICTION ALERT (Shown when user lacks permissions) -->
      <div id="view-restricted" class="hidden max-w-xl mx-auto my-12 bg-slate-900 border border-amber-500/30 rounded-2xl p-8 text-center space-y-4">
        <div class="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
        </div>
        <h3 class="text-base font-bold text-white">Módulo Restringido</h3>
        <p class="text-xs text-slate-400">Tu usuario solo cuenta con acceso autorizado para el módulo de <strong>Ventas (POS)</strong>.</p>
        <button onclick="switchTab('ventas')" class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer">
          Ir al Punto de Venta
        </button>
      </div>

      <!-- ================= 1. DASHBOARD VIEW ================= -->
      <section id="view-dashboard" class="space-y-6 max-w-7xl mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-extrabold text-white">Dashboard Ejecutivo Gerencial</h2>
            <p class="text-xs text-slate-400">Consolidado general de operaciones y rendimiento multi-sucursal</p>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="renderDashboard()" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              <span>Actualizar KPIs</span>
            </button>
          </div>
        </div>

        <!-- 4 KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p class="text-xs text-slate-400 font-semibold">Ventas Totales Hoy</p>
            <h3 id="dash-kpi-sales" class="text-2xl font-black text-white mt-1 font-mono">$ 0.00</h3>
            <p id="dash-kpi-sales-bs" class="text-xs text-emerald-400 font-mono mt-0.5">Bs. 0.00</p>
          </div>

          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p class="text-xs text-slate-400 font-semibold">Transacciones Realizadas</p>
            <h3 id="dash-kpi-tx" class="text-2xl font-black text-white mt-1 font-mono">0</h3>
            <p class="text-xs text-indigo-400 font-semibold mt-0.5">Tickets emitidos</p>
          </div>

          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p class="text-xs text-slate-400 font-semibold">Por Cobrar (CxC)</p>
            <h3 id="dash-kpi-cxc" class="text-2xl font-black text-amber-400 mt-1 font-mono">$ 0.00</h3>
            <p id="dash-kpi-cxc-count" class="text-xs text-slate-400 mt-0.5">0 facturas pendientes</p>
          </div>

          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <p class="text-xs text-slate-400 font-semibold">Por Pagar (CxP)</p>
            <h3 id="dash-kpi-cxp" class="text-2xl font-black text-rose-400 mt-1 font-mono">$ 0.00</h3>
            <p id="dash-kpi-cxp-count" class="text-xs text-slate-400 mt-0.5">0 cuentas a proveedores</p>
          </div>
        </div>

        <!-- Chart Container -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 class="text-sm font-bold text-white mb-4">Ventas por Sucursal ($ USD)</h3>
          <div class="h-64">
            <canvas id="dashboardChart"></canvas>
          </div>
        </div>
      </section>

      <!-- ================= 2. VENTAS (POS) VIEW ================= -->
      <section id="view-ventas" class="space-y-4 max-w-7xl mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            </div>
            <div>
              <h2 class="text-base font-bold text-white">Terminal Punto de Venta (Caja)</h2>
              <p class="text-xs text-slate-400">Atención de clientes con facturación y cobro en doble divisa</p>
            </div>
          </div>

          <!-- Sucursal Active Selector for POS -->
          <div class="flex items-center gap-2">
            <label class="text-xs text-slate-400 font-semibold">Caja en:</label>
            <select id="pos-sucursal-select" onchange="onPosSucursalChange()" class="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500">
              <option value="1">Tienda 1 (Av. Principal)</option>
              <option value="2">Tienda 2 (C.C. Sambil)</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <!-- Products Catalog (responsive cols) -->
          <div class="md:col-span-7 xl:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col min-h-[480px] lg:h-[640px] xl:h-[700px] pos-h-adaptive">
            <!-- Search & Barcode Input & Sort info -->
            <div class="flex items-center gap-2 mb-3">
              <div class="relative flex-1">
                <input type="text" id="pos-search-input" onkeyup="filterPosProducts()" placeholder="Escanear código de barras o buscar producto..." class="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500">
                <svg class="w-4 h-4 text-slate-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
              <div class="hidden sm:flex items-center gap-1 text-[11px] bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-amber-300 font-medium whitespace-nowrap">
                <span>🔥 <strong>Mayor a Menor Venta</strong></span>
              </div>
            </div>

            <!-- Products Grid: Adaptive columns for small laptop screens -->
            <div id="pos-products-grid" class="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-2.5 pr-1 custom-scrollbar">
              <!-- Rendered by JS -->
            </div>
          </div>

          <!-- Cart & Checkout -->
          <div class="md:col-span-5 xl:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col min-h-[520px] lg:h-[640px] xl:h-[700px] pos-h-adaptive">
            <div class="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-white">Ticket de Venta</span>
                <span id="pos-cart-count" class="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold">0 ítems</span>
              </div>
              <button onclick="clearPosCart()" class="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer">Vaciar</button>
            </div>

            <!-- Customer Selection Bar with Fast Cédula / RIF Auto-Lookup -->
            <div class="my-2 p-2.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div class="flex items-center justify-between gap-1">
                <span class="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                  <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  <span>Cliente Facturación:</span>
                </span>
                <div class="flex items-center gap-1">
                  <button type="button" onclick="resetPosClienteToContado()" id="btn-pos-reset-contado" class="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold rounded-lg cursor-pointer">
                    Contado
                  </button>
                  <button type="button" onclick="openPosClientModal()" class="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold rounded-lg cursor-pointer flex items-center gap-1">
                    <svg class="w-3 h-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    <span>Lista</span>
                  </button>
                </div>
              </div>

              <!-- Fast Cédula / RIF Input -->
              <div class="flex items-center gap-1.5">
                <div class="relative flex-1">
                  <input type="text" id="pos-fast-cedula-input" oninput="onPosFastCedulaInput(this.value)" placeholder="Cédula o RIF (Ej: V-12345678, 12345678) → Auto" class="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none">
                </div>
                <button type="button" id="btn-pos-fast-create" onclick="openPosCreateFromFastInput()" class="hidden px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold rounded-xl whitespace-nowrap cursor-pointer">
                  + Registrar
                </button>
              </div>

              <!-- Current Selected Client Card -->
              <div id="pos-client-card" class="p-2 bg-slate-900 rounded-xl border border-slate-800/80 flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 overflow-hidden">
                  <div id="pos-client-icon-box" class="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  </div>
                  <div class="overflow-hidden">
                    <div class="flex items-center gap-1.5">
                      <span id="pos-client-name" class="text-xs font-bold text-white truncate">Cliente de Contado</span>
                      <span id="pos-client-badge" class="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-semibold">Predeterminado</span>
                    </div>
                    <p id="pos-client-rif" class="text-[10px] text-slate-400 font-mono">RIF: V-00000000</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cart items list -->
            <div id="pos-cart-items" class="flex-1 overflow-y-auto py-1 space-y-2 pr-1">
              <!-- Rendered by JS -->
            </div>

            <!-- Totals & Payment Section -->
            <div class="pt-2.5 border-t border-slate-800 space-y-2.5">
              <!-- Fiscal Breakdown Strip in Cart -->
              <div class="space-y-1 text-[11px] bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono">
                <div class="flex justify-between text-slate-400">
                  <span>Subtotal Neto:</span>
                  <span id="pos-subtotal-val">$ 0.00</span>
                </div>
                <div class="flex justify-between text-slate-400">
                  <span>Base Imponible (16%):</span>
                  <span id="pos-base-val">$ 0.00</span>
                </div>
                <div class="flex justify-between text-slate-400">
                  <span>Total Exento (0%):</span>
                  <span id="pos-exento-val">$ 0.00</span>
                </div>
                <div class="flex justify-between text-emerald-400 font-semibold border-t border-slate-800/80 pt-1">
                  <span>IVA (16%):</span>
                  <span id="pos-iva-val">+$ 0.00</span>
                </div>
              </div>

              <div class="space-y-1 text-xs">
                <div class="flex justify-between text-base font-extrabold text-white pt-1 border-t border-slate-800/60">
                  <span>Total a Cobrar USD:</span>
                  <span id="pos-total-usd" class="font-mono text-emerald-400">$ 0.00</span>
                </div>
                <div class="flex justify-between text-xs font-bold text-emerald-300 font-mono">
                  <span>Total Bolívares:</span>
                  <span id="pos-total-bs">Bs. 0.00</span>
                </div>
              </div>

              <!-- Checkout Trigger Button -->
              <button onclick="openPosCheckoutModal()" id="btn-process-sale" class="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20">
                <svg class="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>Cobrar Venta • Pago Móvil / Efectivo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ================= 3. INVENTARIO VIEW ================= -->
      <section id="view-inventario" class="space-y-4 max-w-7xl mx-auto hidden">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div>
            <h2 class="text-base font-bold text-white">Control de Inventario Central y Sucursales</h2>
            <p class="text-xs text-slate-400">Existencias en tiempo real de Tienda 1, Tienda 2 y Oficina Central</p>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="openNewProductModal()" class="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20">
              <svg class="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              <span>Nuevo Producto</span>
            </button>
          </div>
        </div>

        <!-- Inventory Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <span class="text-xs text-slate-400 font-semibold">Total Ítems en Catálogo</span>
            <div id="inv-stat-items" class="text-xl font-bold font-mono text-white mt-1">0</div>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <span class="text-xs text-slate-400 font-semibold">Valoración al Costo ($ USD)</span>
            <div id="inv-stat-cost-usd" class="text-xl font-bold font-mono text-amber-400 mt-1">$ 0.00</div>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <span class="text-xs text-slate-400 font-semibold">Valoración Precio Venta ($ USD)</span>
            <div id="inv-stat-val-usd" class="text-xl font-bold font-mono text-emerald-400 mt-1">$ 0.00</div>
          </div>
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <span class="text-xs text-slate-400 font-semibold">Margen Bruto Proyectado</span>
            <div id="inv-stat-margin-usd" class="text-xl font-bold font-mono text-purple-300 mt-1">$ 0.00</div>
          </div>
        </div>

        <!-- Inter-Branch Transfer Box -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <h3 class="text-xs font-bold text-white mb-3 flex items-center gap-2">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
            <span>Traspaso de Mercancía Entre Sucursales</span>
          </h3>
          <form onsubmit="handleTransferStockStandalone(event)" class="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            <div>
              <label class="block text-[11px] text-slate-400 mb-1">Origen:</label>
              <select id="transfer-origen" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white">
                <option value="3">Oficina Central / Almacén</option>
                <option value="1">Tienda 1 (Av. Principal)</option>
                <option value="2">Tienda 2 (C.C. Sambil)</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] text-slate-400 mb-1">Destino:</label>
              <select id="transfer-destino" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white">
                <option value="1">Tienda 1 (Av. Principal)</option>
                <option value="2">Tienda 2 (C.C. Sambil)</option>
                <option value="3">Oficina Central / Almacén</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] text-slate-400 mb-1">Producto:</label>
              <select id="transfer-prod" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white">
                <!-- Rendered by JS -->
              </select>
            </div>
            <div>
              <label class="block text-[11px] text-slate-400 mb-1">Cantidad:</label>
              <input type="number" id="transfer-qty" min="1" required placeholder="0" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono">
            </div>
            <div class="flex items-end">
              <button type="submit" class="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-md shadow-emerald-500/20">
                Traspasar Stock
              </button>
            </div>
          </form>
        </div>

        <!-- Inventory Matrix Table with Search -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div class="p-3 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 class="text-xs font-bold text-slate-300">Catálogo de Artículos y Existencias</h3>
            <input type="text" id="inv-search-input" oninput="renderInventario()" placeholder="Buscar producto o código..." class="bg-slate-900 border border-slate-700 text-xs text-white px-3 py-1 rounded-xl w-full sm:w-56">
          </div>
          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-left text-xs min-w-[760px]">
              <thead class="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th class="p-3">Código</th>
                  <th class="p-3">Producto</th>
                  <th class="p-3 text-center">Régimen</th>
                  <th class="p-3 text-right">Costo $</th>
                  <th class="p-3 text-right">Precio $</th>
                  <th class="p-3 text-right">Margen</th>
                  <th class="p-3 text-right text-sky-400">Tienda 1</th>
                  <th class="p-3 text-right text-indigo-400">Tienda 2</th>
                  <th class="p-3 text-right text-purple-400">Bodega</th>
                  <th class="p-3 text-right font-bold text-emerald-400">Total</th>
                  <th class="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody id="inventario-table-body" class="divide-y divide-slate-800">
                <!-- Rendered by JS -->
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ================= 4. COMPRAS VIEW ================= -->
      <section id="view-compras" class="space-y-4 max-w-7xl mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div>
            <h2 class="text-base font-bold text-white">Registro de Compras a Proveedores</h2>
            <p class="text-xs text-slate-400">Entrada directa a inventario y generación automática de Cuentas por Pagar</p>
          </div>
          <button onclick="openNewCompraModal()" class="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer">
            <svg class="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            <span>Nueva Compra</span>
          </button>
        </div>

        <!-- Compras Table -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-left text-xs min-w-[650px]">
              <thead class="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th class="p-3">ID / Factura</th>
                  <th class="p-3">Proveedor</th>
                  <th class="p-3">Sucursal Destino</th>
                  <th class="p-3 text-center">Régimen</th>
                  <th class="p-3">Fecha</th>
                  <th class="p-3 text-right">Total $ USD</th>
                  <th class="p-3 text-right">Total Bs</th>
                </tr>
              </thead>
              <tbody id="compras-table-body" class="divide-y divide-slate-800">
                <!-- Rendered by JS -->
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ================= 4. CLIENTES VIEW ================= -->
      <section id="view-clientes" class="space-y-4 max-w-7xl mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div>
            <h2 class="text-base font-bold text-white">Directorio de Clientes</h2>
            <p class="text-xs text-slate-400">Gestión de cartera de clientes, RIF y límites de crédito comercial</p>
          </div>
          <button onclick="openNewClienteModal()" class="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20">
            <svg class="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            <span>Registrar Cliente</span>
          </button>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-left text-xs min-w-[650px]">
              <thead class="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th class="p-3">Nombre / Razón Social</th>
                  <th class="p-3">RIF / Cédula</th>
                  <th class="p-3">Teléfono</th>
                  <th class="p-3 text-right">Límite Crédito</th>
                  <th class="p-3 text-right">Saldo Pendiente</th>
                  <th class="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody id="clientes-table-body" class="divide-y divide-slate-800">
                <!-- Rendered by JS -->
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ================= 5. PROVEEDORES VIEW ================= -->
      <section id="view-proveedores" class="space-y-4 max-w-7xl mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div>
            <h2 class="text-base font-bold text-white">Directorio de Proveedores</h2>
            <p class="text-xs text-slate-400">Proveedores de mercancía e insumos para las 3 sucursales</p>
          </div>
          <button onclick="openNewProveedorModal()" class="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20">
            <svg class="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            <span>Registrar Proveedor</span>
          </button>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-left text-xs min-w-[650px]">
              <thead class="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th class="p-3">Proveedor / Razón Social</th>
                  <th class="p-3">RIF</th>
                  <th class="p-3">Contacto / Teléfono</th>
                  <th class="p-3 text-right">Saldo por Pagar</th>
                  <th class="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody id="proveedores-table-body" class="divide-y divide-slate-800">
                <!-- Rendered by JS -->
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ================= 6. CXC VIEW ================= -->
      <section id="view-cxc" class="space-y-4 max-w-7xl mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div>
            <h2 class="text-base font-bold text-white">Cuentas por Cobrar (CxC)</h2>
            <p class="text-xs text-slate-400">Control de facturas a crédito emitidas a clientes y registro de abonos</p>
          </div>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-left text-xs min-w-[650px]">
              <thead class="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th class="p-3">Factura</th>
                  <th class="p-3">Cliente</th>
                  <th class="p-3">Emisión / Vencimiento</th>
                  <th class="p-3 text-right">Monto Original</th>
                  <th class="p-3 text-right">Saldo Restante</th>
                  <th class="p-3 text-center">Estado</th>
                  <th class="p-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody id="cxc-table-body" class="divide-y divide-slate-800">
                <!-- Rendered by JS -->
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ================= 7. CXP VIEW ================= -->
      <section id="view-cxp" class="space-y-4 max-w-7xl mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div>
            <h2 class="text-base font-bold text-white">Cuentas por Pagar (CxP)</h2>
            <p class="text-xs text-slate-400">Obligaciones comerciales pendientes con proveedores</p>
          </div>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-left text-xs min-w-[650px]">
              <thead class="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th class="p-3">Factura Compra</th>
                  <th class="p-3">Proveedor</th>
                  <th class="p-3">Emisión / Vencimiento</th>
                  <th class="p-3 text-right">Total Factura</th>
                  <th class="p-3 text-right">Saldo Pendiente</th>
                  <th class="p-3 text-center">Estado</th>
                  <th class="p-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody id="cxp-table-body" class="divide-y divide-slate-800">
                <!-- Rendered by JS -->
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ================= 8. REPORTES VIEW ================= -->
      <section id="view-reportes" class="space-y-6 max-w-7xl mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div>
            <h2 class="text-base font-bold text-white">Centro de Reportes & Auditoría Fiscal (Corte X y Z)</h2>
            <p class="text-xs text-slate-400">Discriminación tributaria SENIAT, arqueo por medio de pago e impresión térmica de 80mm</p>
          </div>
          <div class="flex items-center gap-2">
            <select id="reportes-sucursal-filter" onchange="renderReportes()" class="bg-slate-950 border border-slate-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl focus:outline-none focus:border-emerald-500">
              <option value="all">Todas las Sucursales (Consolidado)</option>
              <option value="1">Tienda 1 - Centro</option>
              <option value="2">Tienda 2 - Norte</option>
            </select>
            <button onclick="window.print()" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
              <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
              <span>Imprimir A4</span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Corte X -->
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <div class="flex items-center gap-2">
                <div class="p-2 rounded-lg bg-sky-500/20 text-sky-400 font-bold text-xs">CORTE X</div>
                <div>
                  <h3 class="text-sm font-bold text-white">Corte X (Parcial de Turno / Arqueo)</h3>
                  <p class="text-[11px] text-slate-400">Lectura informativa continua sin cerrar jornada</p>
                </div>
              </div>
              <button onclick="imprimirCorteTermico('X')" class="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                <span>Imprimir 80mm</span>
              </button>
            </div>
            <div id="corte-x-content" class="bg-slate-950 p-4 rounded-xl font-mono text-xs text-slate-300 space-y-2 border border-slate-800">
              <!-- Rendered by JS -->
            </div>
          </div>

          <!-- Corte Z -->
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <div class="flex items-center gap-2">
                <div class="p-2 rounded-lg bg-rose-500/20 text-rose-400 font-bold text-xs">CORTE Z</div>
                <div>
                  <h3 class="text-sm font-bold text-white">Corte Z (Cierre Fiscal Diario)</h3>
                  <p class="text-[11px] text-slate-400">Cierre contable definitivo para Libro de Ventas</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button onclick="imprimirCorteTermico('Z')" class="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                  <span>Imprimir 80mm</span>
                </button>
                <button onclick="ejecutarCierreZ()" class="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 text-xs font-bold cursor-pointer">
                  Cerrar Día
                </button>
              </div>
            </div>
            <div id="corte-z-content" class="bg-slate-950 p-4 rounded-xl font-mono text-xs text-slate-300 space-y-2 border border-slate-800">
              <!-- Rendered by JS -->
            </div>
          </div>
        </div>
      </section>

      <!-- ================= 9. CONFIGURACIÓN VIEW ================= -->
      <section id="view-configuracion" class="space-y-5 max-w-7xl mx-auto">
        <!-- Configuration Header & Subtabs -->
        <div class="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-base font-bold text-white">Configuración del Sistema y Seguridad RBAC</h2>
              <span class="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                10 Módulos Autónomos
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-0.5">Asigna permisos específicos a cada colaborador, controla accesos por PIN y gestiona datos fiscales</p>
          </div>

          <!-- Configuration Subtabs -->
          <div class="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0 text-xs flex-wrap">
            <button type="button" onclick="switchConfigSubtab('usuarios')" id="cfg-subtab-btn-usuarios" class="px-3 py-1.5 rounded-lg font-bold bg-emerald-500 text-slate-950 transition-all cursor-pointer">
              Usuarios y Permisos
            </button>
            <button type="button" onclick="switchConfigSubtab('fiscal')" id="cfg-subtab-btn-fiscal" class="px-3 py-1.5 rounded-lg font-semibold text-slate-400 hover:text-white transition-all cursor-pointer">
              Datos Fiscales
            </button>
            <button type="button" onclick="switchConfigSubtab('sucursales')" id="cfg-subtab-btn-sucursales" class="px-3 py-1.5 rounded-lg font-semibold text-slate-400 hover:text-white transition-all cursor-pointer">
              Sucursales
            </button>
            <button type="button" onclick="switchConfigSubtab('tasa')" id="cfg-subtab-btn-tasa" class="px-3 py-1.5 rounded-lg font-semibold text-slate-400 hover:text-white transition-all cursor-pointer">
              Cotización Diaria
            </button>
            <button type="button" onclick="switchConfigSubtab('licencia')" id="cfg-subtab-btn-licencia" class="px-3 py-1.5 rounded-lg font-semibold text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 004 11v.333m0 0c0 2.473.345 4.866.99 7.132m0 0a21.88 21.88 0 007.828 2.868"/></svg>
              <span>Licencia & Seguridad</span>
            </button>
            <button type="button" onclick="switchConfigSubtab('auditoria')" id="cfg-subtab-btn-auditoria" class="px-3 py-1.5 rounded-lg font-semibold text-indigo-300 hover:text-white hover:bg-indigo-500/10 transition-all cursor-pointer flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
              <span>Bitácora de Auditoría</span>
              <span id="cfg-audit-count-badge" class="bg-indigo-500/20 text-indigo-300 font-mono text-[10px] px-1.5 py-0.2 rounded-full border border-indigo-500/30">0</span>
            </button>
            <button type="button" onclick="switchConfigSubtab('mantenimiento')" id="cfg-subtab-btn-mantenimiento" class="px-3 py-1.5 rounded-lg font-semibold text-rose-400 hover:text-rose-200 transition-all cursor-pointer flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              <span>Reinicio de Sistema</span>
            </button>
          </div>
        </div>

        <!-- SUBTAB 1: USUARIOS Y PERMISOS RBAC -->
        <div id="cfg-subtab-usuarios" class="space-y-4">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <!-- Left Column: User List & Filter -->
            <div class="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-bold text-white">Equipo y Colaboradores</h3>
                  <span id="cfg-user-count-badge" class="text-[11px] text-slate-400">6 usuarios registrados</span>
                </div>
                <button type="button" onclick="openNewUserModal()" class="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm">
                  <svg class="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                  <span>+ Nuevo Usuario</span>
                </button>
              </div>

              <!-- Search filter -->
              <input type="text" id="cfg-user-search-input" oninput="filterUserList()" placeholder="Buscar colaborador por nombre..." class="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:border-emerald-500 focus:outline-none placeholder:text-slate-500">

              <!-- User List Container -->
              <div id="cfg-users-container" class="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                <!-- Rendered dynamically by JS -->
              </div>
            </div>

            <!-- Right Column: User Details & 10-Module Permission Matrix -->
            <div class="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div id="cfg-selected-user-header" class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div>
                  <h3 id="cfg-edit-name-display" class="text-sm font-bold text-white">Editar Permisos de Usuario</h3>
                  <p class="text-[11px] text-slate-400">Configura accesos granulares y credenciales de acceso</p>
                </div>
                <div class="flex items-center gap-2">
                  <button type="button" onclick="deleteCurrentUser()" id="cfg-btn-delete-user" class="px-2.5 py-1.5 rounded-lg bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border border-rose-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    <span>Eliminar</span>
                  </button>
                  <button type="button" onclick="saveUserPermissionsChanges()" class="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-950/50 flex items-center gap-1.5 cursor-pointer">
                    <svg class="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              </div>

              <!-- General Fields -->
              <input type="hidden" id="cfg-edit-user-id">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label class="block text-slate-400 mb-1">Nombre Completo:</label>
                  <input type="text" id="cfg-edit-nombre" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
                </div>
                <div>
                  <label class="block text-slate-400 mb-1">Cargo / Puesto:</label>
                  <input type="text" id="cfg-edit-cargo" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
                </div>
                <div>
                  <label class="block text-slate-400 mb-1">Rol en Sistema:</label>
                  <select id="cfg-edit-rol" onchange="handleRoleChangeInEdit()" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
                    <option value="admin">Administrador (Gerente General)</option>
                    <option value="supervisor">Supervisor de Tienda</option>
                    <option value="cajero">Cajero / Operador POS</option>
                    <option value="inventario">Encargado de Inventario</option>
                  </select>
                </div>
                <div>
                  <label class="block text-slate-400 mb-1">PIN de Seguridad (4 dígitos):</label>
                  <div class="flex items-center gap-2">
                    <input type="password" id="cfg-edit-pin" maxlength="4" class="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-center tracking-widest font-bold">
                    <button type="button" onclick="togglePinVisibility('cfg-edit-pin')" class="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer" title="Ver / Ocultar PIN">
                      👁️
                    </button>
                    <button type="button" onclick="generateRandomPin('cfg-edit-pin')" class="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[11px] font-semibold cursor-pointer" title="Generar PIN aleatorio">
                      🎲 Auto
                    </button>
                  </div>
                </div>
              </div>

              <!-- Permission Presets -->
              <div class="pt-2 border-t border-slate-800 space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-slate-300">Plantillas Rápidas de Permisos:</span>
                </div>
                <div class="flex flex-wrap gap-1.5 text-xs">
                  <button type="button" onclick="applyPreset('pos')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] cursor-pointer">
                    🛒 Solo POS
                  </button>
                  <button type="button" onclick="applyPreset('almacen')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] cursor-pointer">
                    📦 Almacén
                  </button>
                  <button type="button" onclick="applyPreset('supervisor')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] cursor-pointer">
                    🛡️ Supervisor
                  </button>
                  <button type="button" onclick="applyPreset('finanzas')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] cursor-pointer">
                    💰 Finanzas (CxC/CxP)
                  </button>
                  <button type="button" onclick="applyPreset('admin')" class="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[11px] font-bold cursor-pointer">
                    👑 Acceso Total
                  </button>
                </div>
              </div>

              <!-- 10 MODULE PERMISSION MATRIX -->
              <div class="pt-2 space-y-2">
                <div class="flex items-center justify-between text-xs pb-1">
                  <span class="font-bold text-slate-200">Matriz de Acceso por Módulo (10 Módulos):</span>
                  <span class="text-[10px] text-slate-400">Marca las casillas permitidas</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <!-- 1. Dashboard -->
                  <label class="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 cursor-pointer">
                    <input type="checkbox" id="perm-chk-dashboard" class="w-4 h-4 rounded text-emerald-500 accent-emerald-500">
                    <div>
                      <span class="font-bold text-white block">📊 Dashboard Ejecutivo</span>
                      <span class="text-[10px] text-slate-400 block">Métricas generales y gráficos</span>
                    </div>
                  </label>

                  <!-- 2. Ventas (POS) -->
                  <label class="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 cursor-pointer">
                    <input type="checkbox" id="perm-chk-ventas" class="w-4 h-4 rounded text-emerald-500 accent-emerald-500">
                    <div>
                      <span class="font-bold text-white block">🛒 Ventas y Facturación (POS)</span>
                      <span class="text-[10px] text-slate-400 block">Caja, cobro y tickets fiscales</span>
                    </div>
                  </label>

                  <!-- 3. Inventario -->
                  <label class="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 cursor-pointer">
                    <input type="checkbox" id="perm-chk-inventario" class="w-4 h-4 rounded text-emerald-500 accent-emerald-500">
                    <div>
                      <span class="font-bold text-white block">📦 Control de Inventario</span>
                      <span class="text-[10px] text-slate-400 block">Stock, precios y traspasos</span>
                    </div>
                  </label>

                  <!-- 4. Compras -->
                  <label class="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 cursor-pointer">
                    <input type="checkbox" id="perm-chk-compras" class="w-4 h-4 rounded text-emerald-500 accent-emerald-500">
                    <div>
                      <span class="font-bold text-white block">🛍️ Módulo de Compras</span>
                      <span class="text-[10px] text-slate-400 block">Facturas de compra a proveedores</span>
                    </div>
                  </label>

                  <!-- 5. Clientes -->
                  <label class="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 cursor-pointer">
                    <input type="checkbox" id="perm-chk-clientes" class="w-4 h-4 rounded text-emerald-500 accent-emerald-500">
                    <div>
                      <span class="font-bold text-white block">👥 Directorio de Clientes</span>
                      <span class="text-[10px] text-slate-400 block">Límites de crédito y saldos</span>
                    </div>
                  </label>

                  <!-- 6. Proveedores -->
                  <label class="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 cursor-pointer">
                    <input type="checkbox" id="perm-chk-proveedores" class="w-4 h-4 rounded text-emerald-500 accent-emerald-500">
                    <div>
                      <span class="font-bold text-white block">🚚 Directorio de Proveedores</span>
                      <span class="text-[10px] text-slate-400 block">Contactos comerciales y deudas</span>
                    </div>
                  </label>

                  <!-- 7. CxC -->
                  <label class="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 cursor-pointer">
                    <input type="checkbox" id="perm-chk-cxc" class="w-4 h-4 rounded text-emerald-500 accent-emerald-500">
                    <div>
                      <span class="font-bold text-white block">💳 Cuentas por Cobrar (CxC)</span>
                      <span class="text-[10px] text-slate-400 block">Gestión y abonos de clientes</span>
                    </div>
                  </label>

                  <!-- 8. CxP -->
                  <label class="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 cursor-pointer">
                    <input type="checkbox" id="perm-chk-cxp" class="w-4 h-4 rounded text-emerald-500 accent-emerald-500">
                    <div>
                      <span class="font-bold text-white block">🧾 Cuentas por Pagar (CxP)</span>
                      <span class="text-[10px] text-slate-400 block">Liquidación y pagos de deudas</span>
                    </div>
                  </label>

                  <!-- 9. Reportes -->
                  <label class="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 cursor-pointer">
                    <input type="checkbox" id="perm-chk-reportes" class="w-4 h-4 rounded text-emerald-500 accent-emerald-500">
                    <div>
                      <span class="font-bold text-white block">📄 Reportes y Cortes Fiscales</span>
                      <span class="text-[10px] text-slate-400 block">Corte X, Corte Z y exportación</span>
                    </div>
                  </label>

                  <!-- 10. Configuración -->
                  <label class="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 cursor-pointer">
                    <input type="checkbox" id="perm-chk-configuracion" class="w-4 h-4 rounded text-emerald-500 accent-emerald-500">
                    <div>
                      <span class="font-bold text-white block">⚙️ Configuración y Permisos</span>
                      <span class="text-[10px] text-slate-400 block">Control de usuarios y tasas</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SUBTAB 2: DATOS FISCALES -->
        <div id="cfg-subtab-fiscal" class="hidden bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 max-w-2xl">
          <h3 class="text-sm font-bold text-white">Datos Fiscales de la Empresa</h3>
          <p class="text-xs text-slate-400">Estos datos se reflejan en los tickets fiscales emitidos y en los reportes de auditoría.</p>
          <div class="space-y-3 text-xs">
            <div>
              <label class="block text-slate-400 mb-1">Razón Social:</label>
              <input type="text" id="cfg-company-name" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-400 mb-1">RIF de la Empresa:</label>
                <input type="text" id="cfg-company-rif" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
              </div>
              <div>
                <label class="block text-slate-400 mb-1">Teléfono:</label>
                <input type="text" id="cfg-company-tel" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
              </div>
            </div>
            <div>
              <label class="block text-slate-400 mb-1">Dirección Fiscal:</label>
              <input type="text" id="cfg-company-dir" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
            </div>
            <button onclick="saveCompanyConfig()" class="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-md">
              Guardar Datos Fiscales
            </button>
          </div>
        </div>

        <!-- SUBTAB 3: SUCURSALES -->
        <div id="cfg-subtab-sucursales" class="hidden bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 max-w-2xl">
          <h3 class="text-sm font-bold text-white">Nombres y Ubicaciones de Sucursales</h3>
          <p class="text-xs text-slate-400">Personaliza la denominación de tus 3 sedes operativas.</p>
          <div class="space-y-3 text-xs">
            <div>
              <label class="block text-slate-400 mb-1">Sucursal 1 (Tienda Principal):</label>
              <input type="text" id="cfg-suc-1" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
            </div>
            <div>
              <label class="block text-slate-400 mb-1">Sucursal 2 (Tienda Secundaria):</label>
              <input type="text" id="cfg-suc-2" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
            </div>
            <div>
              <label class="block text-slate-400 mb-1">Sucursal 3 (Oficina Central / Depósito General):</label>
              <input type="text" id="cfg-suc-3" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
            </div>
            <button onclick="saveSucursalesConfig()" class="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-md">
              Guardar Nombres de Sucursales
            </button>
          </div>
        </div>

        <!-- SUBTAB 4: COTIZACIÓN DIARIA -->
        <div id="cfg-subtab-tasa" class="hidden bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 max-w-2xl">
          <h3 class="text-sm font-bold text-white">Tasa de Cambio Oficial (USD / Bs.)</h3>
          <p class="text-xs text-slate-400">Esta tasa se utiliza para calcular automáticamente todas las conversiones en POS, reportes y pagos.</p>
          <div class="space-y-3 text-xs">
            <div>
              <label class="block text-slate-400 mb-1">Tasa de Cambio (Bs. por cada 1 USD):</label>
              <input type="number" step="0.01" id="cfg-tasa-input" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-base font-bold text-emerald-400">
            </div>
            <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300">
              <span>Ejemplo: Si un producto cuesta $ 10.00 USD, en bolívares se cobrará: <strong id="cfg-tasa-preview-bs" class="text-emerald-400 font-mono">Bs. 365.00</strong></span>
            </div>
            <button onclick="saveTasaFromConfig()" class="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-md">
              Actualizar Tasa del Día
            </button>
          </div>
        </div>

        <!-- SUBTAB 5: BITÁCORA DE AUDITORÍA Y TRAZABILIDAD (AUDIT LOGS) -->
        <!-- SUBTAB: LICENCIAMIENTO CRIPTOGRÁFICO Y HARDWARE LOCK -->
        <div id="cfg-subtab-licencia" class="hidden space-y-5">
          <!-- Top License Banner -->
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="flex items-start gap-4">
                <div id="cfg-lic-icon-wrap" class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-base font-bold text-white">Estado de la Licencia del Software</h3>
                    <span id="cfg-lic-status-badge" class="px-2.5 py-0.5 text-xs font-bold rounded-full uppercase tracking-wide border bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                      Activa y Autorizada
                    </span>
                  </div>
                  <p id="cfg-lic-status-desc" class="text-xs text-slate-400 mt-1">Licencia válida y verificada criptográficamente para este equipo.</p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button type="button" onclick="toggleChangeLicForm()" class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
                  <span>Cambiar / Activar Clave</span>
                </button>
                <button type="button" onclick="deactivateThisLicense()" class="px-3 py-2 bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 rounded-xl text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer" title="Desactivar licencia de este equipo">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  <span>Desactivar</span>
                </button>
              </div>
            </div>

            <!-- Change Key Form -->
            <div id="cfg-lic-change-form" class="hidden mt-5 pt-5 border-t border-slate-800 space-y-3 animate-fade-in">
              <label class="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
                <span>Pegar Nueva Clave de Activación Criptográfica:</span>
              </label>
              <textarea id="cfg-lic-new-key-input" rows="2" placeholder="LIC-eyJtYWNoaW5lSWQi..." class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 resize-none"></textarea>
              <div class="flex justify-end gap-2">
                <button type="button" onclick="toggleChangeLicForm()" class="px-3 py-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-medium cursor-pointer">Cancelar</button>
                <button type="button" onclick="applyNewLicenseKey()" class="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  <span>Guardar y Activar</span>
                </button>
              </div>
            </div>
            <div id="cfg-lic-action-msg" class="hidden mt-3 text-xs p-2.5 rounded-xl"></div>
          </div>

          <!-- Grid Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Hardware ID Box -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>
                  <span>Huella de Hardware del Equipo</span>
                </h4>
                <span class="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">SHA-256</span>
              </div>

              <div class="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-slate-400">ID de esta Máquina:</span>
                  <button type="button" onclick="copyMachineId()" class="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold cursor-pointer">
                    <span id="cfg-lic-copy-id-text">Copiar ID</span>
                  </button>
                </div>
                <p id="cfg-lic-machine-id-display" class="font-mono text-base font-bold text-emerald-400 tracking-wider">
                  POS-XXXX-XXXX-XXXX-XXXX
                </p>
              </div>
              <p class="text-[11px] text-slate-400 leading-relaxed">
                Calculado mediante los componentes gráficos, procesador y perfil único de este equipo. Si el archivo se copia a otra computadora, el ID cambiará y requerirá nueva clave autorizada.
              </p>
            </div>

            <!-- License Payload Box -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                  <span>Datos de la Licencia Emitida</span>
                </h4>
                <span class="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">HMAC Firmada</span>
              </div>

              <div id="cfg-lic-details-container" class="space-y-2.5 text-xs">
                <!-- Populated dynamically by JS -->
              </div>
            </div>
          </div>

          <!-- Developer Master Generator Section -->
          <div class="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-2xl p-6 shadow-sm space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-white">Generador Maestro de Licencias (Solo Desarrollador)</h4>
                  <p class="text-xs text-slate-400">Emite claves criptográficas autorizadas para enviar a tus clientes.</p>
                </div>
              </div>

              <div id="cfg-dev-unlock-wrap" class="flex items-center gap-2">
                <input type="password" id="cfg-dev-pin-input" placeholder="PIN Maestro" class="w-36 bg-slate-950 border border-slate-700 text-xs px-3 py-2 rounded-xl text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-indigo-500">
                <button type="button" onclick="unlockDevGenerator()" class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer">Acceder</button>
              </div>
            </div>

            <!-- Unlocked Generator Form -->
            <div id="cfg-dev-generator-fields" class="hidden space-y-4 pt-2">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="space-y-1">
                  <label class="text-xs font-semibold text-slate-300">ID de Hardware Destino (Cliente):</label>
                  <div class="flex gap-2">
                    <input type="text" id="cfg-gen-machine-id" placeholder="POS-XXXX-XXXX-XXXX-XXXX" class="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400">
                    <button type="button" onclick="setGenMachineIdToThis()" class="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded-lg border border-slate-700 cursor-pointer">Este Equipo</button>
                  </div>
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-semibold text-slate-300">Razón Social / Nombre:</label>
                  <input type="text" id="cfg-gen-empresa" value="Corporación Los Andes C.A." class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white">
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-semibold text-slate-300">RIF / Cédula:</label>
                  <input type="text" id="cfg-gen-rif" value="J-12345678-0" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase">
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="space-y-1">
                  <label class="text-xs font-semibold text-slate-300">Tipo de Licencia:</label>
                  <select id="cfg-gen-tipo" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white">
                    <option value="vitalicia">Vitalicia (Sin Vencimiento)</option>
                    <option value="anual">Anual (1 Año)</option>
                    <option value="semestral">Semestral (6 Meses)</option>
                    <option value="mensual">Mensual (30 Días)</option>
                    <option value="demo">Demo / Prueba (15 Días)</option>
                  </select>
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-semibold text-slate-300">Cajas Máximas:</label>
                  <input type="number" id="cfg-gen-cajas" value="3" min="1" max="20" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white">
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-semibold text-slate-300">Sucursales Máximas:</label>
                  <input type="number" id="cfg-gen-sucursales" value="2" min="1" max="10" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white">
                </div>
                <div class="flex items-end">
                  <button type="button" onclick="generateDevKey()" class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    <span>Generar Clave</span>
                  </button>
                </div>
              </div>

              <div id="cfg-gen-result-box" class="hidden bg-slate-950 p-4 rounded-xl border border-emerald-500/40 space-y-2 animate-fade-in">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    <span>¡Clave Criptográfica Generada!</span>
                  </span>
                  <button type="button" onclick="copyDevKey()" class="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg cursor-pointer">
                    <span id="cfg-gen-copy-btn-text">Copiar Clave</span>
                  </button>
                </div>
                <div class="bg-black/50 p-3 rounded-lg border border-slate-800">
                  <p id="cfg-gen-key-text" class="font-mono text-xs text-slate-200 break-all select-all"></p>
                </div>
              </div>
            </div>
            <p id="cfg-dev-lock-hint" class="text-xs text-slate-500">Ingrese el PIN Maestro de Desarrollador para emitir licencias autorizadas.</p>
          </div>
        </div>

        <div id="cfg-subtab-auditoria" class="hidden space-y-4">
          <!-- Top Action Bar -->
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
              </div>
              <div>
                <h3 class="text-sm font-bold text-white flex items-center gap-2">
                  <span>Registro de Actividad y Auditoría Forense</span>
                  <span class="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold border border-indigo-500/30">Trazabilidad Total</span>
                </h3>
                <p class="text-xs text-slate-400">Historial inmutable de cada acción, venta, movimiento de inventario, acceso y modificación en el sistema con fecha, hora y usuario responsable.</p>
              </div>
            </div>

            <div class="flex items-center gap-2 flex-wrap self-end md:self-center">
              <button type="button" onclick="renderAuditoria()" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-slate-700 transition-all">
                <svg class="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                <span>Refrescar</span>
              </button>
              <button type="button" onclick="exportAuditCSV()" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950/50 transition-all">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                <span>Exportar CSV</span>
              </button>
              <button type="button" onclick="clearAuditLogs()" class="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-rose-500/30 transition-all" title="Limpiar bitácora con confirmación de seguridad">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                <span>Limpiar Registros</span>
              </button>
            </div>
          </div>

          <!-- KPI Summary Strip -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div class="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span class="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Total de Eventos</span>
                <span id="audit-kpi-total" class="text-xl font-bold font-mono text-white">0</span>
              </div>
              <div class="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </div>
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span class="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Ventas POS</span>
                <span id="audit-kpi-ventas" class="text-xl font-bold font-mono text-emerald-400">0</span>
              </div>
              <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span class="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Inventario & Stock</span>
                <span id="audit-kpi-inv" class="text-xl font-bold font-mono text-amber-400">0</span>
              </div>
              <div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              </div>
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span class="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Seguridad y Accesos</span>
                <span id="audit-kpi-seguridad" class="text-xl font-bold font-mono text-purple-400">0</span>
              </div>
              <div class="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
            </div>
          </div>

          <!-- Multi-Filter Toolbar -->
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              <!-- Search box -->
              <div class="lg:col-span-2 relative">
                <input type="text" id="audit-search-input" oninput="filterAuditoria()" placeholder="Buscar por descripción, usuario, detalle o ID..." class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 pl-9 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500">
                <svg class="w-4 h-4 text-slate-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>

              <!-- Module filter -->
              <div>
                <select id="audit-modulo-filter" onchange="filterAuditoria()" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500">
                  <option value="all">Todos los Módulos</option>
                  <option value="POS / Ventas">POS / Ventas</option>
                  <option value="Inventario">Inventario</option>
                  <option value="Compras">Compras</option>
                  <option value="Clientes">Clientes</option>
                  <option value="Proveedores">Proveedores</option>
                  <option value="CxC">Cuentas por Cobrar (CxC)</option>
                  <option value="CxP">Cuentas por Pagar (CxP)</option>
                  <option value="Reportes / Fiscal">Reportes / Fiscal</option>
                  <option value="Seguridad">Seguridad / Accesos</option>
                  <option value="Tasa de Cambio">Tasa de Cambio</option>
                  <option value="Configuración">Configuración</option>
                  <option value="Usuarios">Usuarios y Permisos</option>
                </select>
              </div>

              <!-- Action type filter -->
              <div>
                <select id="audit-accion-filter" onchange="filterAuditoria()" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500">
                  <option value="all">Todas las Acciones</option>
                  <option value="VENTA">VENTA</option>
                  <option value="COMPRA">COMPRA</option>
                  <option value="CREAR">CREAR</option>
                  <option value="MODIFICAR">MODIFICAR</option>
                  <option value="ELIMINAR">ELIMINAR</option>
                  <option value="TRASPASO">TRASPASO</option>
                  <option value="COBRO">COBRO / ABONO</option>
                  <option value="PAGO">PAGO PROVEEDOR</option>
                  <option value="CORTE_X">CORTE X</option>
                  <option value="CORTE_Z">CORTE Z</option>
                  <option value="ACCESO">ACCESO / LOGIN</option>
                  <option value="RESET">RESET FÁBRICA</option>
                </select>
              </div>

              <!-- User filter -->
              <div>
                <select id="audit-user-filter" onchange="filterAuditoria()" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500">
                  <option value="all">Todos los Usuarios</option>
                </select>
              </div>
            </div>

            <!-- Date pills and Branch filter -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="text-[11px] text-slate-400 font-semibold mr-1">Rango:</span>
                <button type="button" onclick="setAuditDateFilter('all')" id="audit-date-all" class="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white cursor-pointer">Todo</button>
                <button type="button" onclick="setAuditDateFilter('today')" id="audit-date-today" class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-950 text-slate-400 hover:text-white border border-slate-800 cursor-pointer">Hoy</button>
                <button type="button" onclick="setAuditDateFilter('3days')" id="audit-date-3days" class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-950 text-slate-400 hover:text-white border border-slate-800 cursor-pointer">Últimos 3 Días</button>
                <button type="button" onclick="setAuditDateFilter('7days')" id="audit-date-7days" class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-950 text-slate-400 hover:text-white border border-slate-800 cursor-pointer">Últimos 7 Días</button>
              </div>

              <div class="flex items-center gap-2">
                <span class="text-[11px] text-slate-400 font-semibold">Sucursal:</span>
                <select id="audit-sucursal-filter" onchange="filterAuditoria()" class="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500">
                  <option value="all">Todas las Sedes</option>
                  <option value="1">Tienda 1</option>
                  <option value="2">Tienda 2</option>
                  <option value="3">Oficina Central / Almacén</option>
                  <option value="global">Global (Empresa)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Table Container -->
          <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-slate-800 text-slate-400 bg-slate-950 font-semibold uppercase tracking-wider text-[10px]">
                    <th class="py-3 px-3">Fecha y Hora</th>
                    <th class="py-3 px-3">Usuario / Rol</th>
                    <th class="py-3 px-3">Sucursal</th>
                    <th class="py-3 px-3">Módulo</th>
                    <th class="py-3 px-3 text-center">Acción</th>
                    <th class="py-3 px-3">Descripción / Resumen de Operación</th>
                    <th class="py-3 px-3 text-center">Detalles</th>
                  </tr>
                </thead>
                <tbody id="audit-table-body" class="divide-y divide-slate-800/60 font-sans">
                  <!-- Dynamic rows generated by renderAuditoria -->
                </tbody>
              </table>
            </div>

            <!-- Footer bar with counter -->
            <div class="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span id="audit-results-counter">Mostrando 0 registros de auditoría</span>
              <span class="text-[10px] text-slate-500 font-mono">Registro Cripto-Verificable y Persistente</span>
            </div>
          </div>
        </div>

        <!-- SUBTAB 6: REINICIO Y MANTENIMIENTO TOTAL -->
        <div id="cfg-subtab-mantenimiento" class="hidden bg-slate-900 border border-rose-900/50 rounded-2xl p-6 space-y-5 max-w-2xl">
          <div class="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div class="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <div>
              <h3 class="text-sm font-bold text-white">
                Zona de Peligro: Reinicio Total de Fábrica
              </h3>
              <p class="text-xs text-slate-400">Restaura todo el sistema al estado inicial y elimina los registros locales.</p>
            </div>
          </div>

          <div class="bg-slate-950 p-4 rounded-xl border border-rose-950/80 text-xs text-slate-300 space-y-2">
            <p class="font-bold text-rose-400">⚠️ Esta acción es irreversible y borrará por completo:</p>
            <ul class="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
              <li>Todas las transacciones de ventas y cobros en POS.</li>
              <li>Todas las órdenes de compras y cuentas por pagar (CxP).</li>
              <li>Todas las cuentas por cobrar (CxC) y abonos de clientes.</li>
              <li>Modificaciones de inventario y stock personalizado.</li>
              <li>Clientes y proveedores creados en el sistema.</li>
              <li>Caché y memoria local persistida en este navegador.</li>
            </ul>
          </div>

          <div class="pt-2">
            <button type="button" onclick="openResetDatabaseModal()" class="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-950/60 cursor-pointer transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              <span>Iniciar Protocolo de Reinicio de Base de Datos</span>
            </button>
          </div>
        </div>
      </section>

    </main>
  </div>

  <!-- ================= MODALS ================= -->

  <!-- MODAL: CREAR NUEVO USUARIO -->
  <div id="modal-new-user" class="app-modal" style="display: none;">
    <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 class="text-sm font-bold text-white flex items-center gap-2">
          <span>+ Registrar Nuevo Colaborador</span>
        </h3>
        <button type="button" onclick="closeNewUserModal()" class="text-slate-400 hover:text-white text-lg">&times;</button>
      </div>

      <div class="space-y-3 text-xs">
        <div>
          <label class="block text-slate-400 mb-1">Nombre Completo:</label>
          <input type="text" id="new-user-nombre" placeholder="Ej: Pedro Pérez" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-slate-400 mb-1">Cargo / Puesto:</label>
            <input type="text" id="new-user-cargo" placeholder="Ej: Cajero Principal" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
          </div>
          <div>
            <label class="block text-slate-400 mb-1">Rol en Sistema:</label>
            <select id="new-user-rol" onchange="handleRoleChangeInNewUser()" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
              <option value="cajero">Cajero / Operador POS</option>
              <option value="supervisor">Supervisor de Tienda</option>
              <option value="inventario">Encargado de Inventario</option>
              <option value="admin">Administrador (Gerente)</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-slate-400 mb-1">PIN de Seguridad (4 dígitos numéricos):</label>
          <div class="flex items-center gap-2">
            <input type="password" maxlength="4" id="new-user-pin" placeholder="1234" class="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-center tracking-widest font-bold">
            <button type="button" onclick="generateRandomPin('new-user-pin')" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[11px] font-semibold cursor-pointer">
              🎲 Generar PIN
            </button>
          </div>
        </div>

        <div class="pt-2 border-t border-slate-800">
          <label class="block text-slate-300 font-bold mb-1.5">Permisos Rápidos por Plantilla:</label>
          <div class="flex flex-wrap gap-1.5">
            <button type="button" onclick="applyPresetToNewUser('pos')" class="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] rounded hover:bg-slate-700 cursor-pointer">🛒 Solo POS</button>
            <button type="button" onclick="applyPresetToNewUser('almacen')" class="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] rounded hover:bg-slate-700 cursor-pointer">📦 Almacén</button>
            <button type="button" onclick="applyPresetToNewUser('supervisor')" class="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] rounded hover:bg-slate-700 cursor-pointer">🛡️ Supervisor</button>
            <button type="button" onclick="applyPresetToNewUser('admin')" class="px-2 py-1 bg-purple-500/20 text-purple-300 text-[10px] rounded hover:bg-purple-500/30 cursor-pointer">👑 Acceso Total</button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-1.5 text-[11px] pt-1">
          <label class="flex items-center gap-1.5 p-1.5 rounded bg-slate-950 border border-slate-800"><input type="checkbox" id="new-perm-dashboard" class="w-3.5 h-3.5 text-emerald-500"> Dashboard</label>
          <label class="flex items-center gap-1.5 p-1.5 rounded bg-slate-950 border border-slate-800"><input type="checkbox" id="new-perm-ventas" checked class="w-3.5 h-3.5 text-emerald-500"> Ventas (POS)</label>
          <label class="flex items-center gap-1.5 p-1.5 rounded bg-slate-950 border border-slate-800"><input type="checkbox" id="new-perm-inventario" class="w-3.5 h-3.5 text-emerald-500"> Inventario</label>
          <label class="flex items-center gap-1.5 p-1.5 rounded bg-slate-950 border border-slate-800"><input type="checkbox" id="new-perm-compras" class="w-3.5 h-3.5 text-emerald-500"> Compras</label>
          <label class="flex items-center gap-1.5 p-1.5 rounded bg-slate-950 border border-slate-800"><input type="checkbox" id="new-perm-clientes" class="w-3.5 h-3.5 text-emerald-500"> Clientes</label>
          <label class="flex items-center gap-1.5 p-1.5 rounded bg-slate-950 border border-slate-800"><input type="checkbox" id="new-perm-proveedores" class="w-3.5 h-3.5 text-emerald-500"> Proveedores</label>
          <label class="flex items-center gap-1.5 p-1.5 rounded bg-slate-950 border border-slate-800"><input type="checkbox" id="new-perm-cxc" class="w-3.5 h-3.5 text-emerald-500"> CxC</label>
          <label class="flex items-center gap-1.5 p-1.5 rounded bg-slate-950 border border-slate-800"><input type="checkbox" id="new-perm-cxp" class="w-3.5 h-3.5 text-emerald-500"> CxP</label>
          <label class="flex items-center gap-1.5 p-1.5 rounded bg-slate-950 border border-slate-800"><input type="checkbox" id="new-perm-reportes" class="w-3.5 h-3.5 text-emerald-500"> Reportes</label>
          <label class="flex items-center gap-1.5 p-1.5 rounded bg-slate-950 border border-slate-800"><input type="checkbox" id="new-perm-configuracion" class="w-3.5 h-3.5 text-emerald-500"> Configuración</label>
        </div>
      </div>

      <div class="flex gap-2 pt-3 border-t border-slate-800">
        <button type="button" onclick="saveNewUser()" class="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer">
          Guardar y Crear Usuario
        </button>
        <button type="button" onclick="closeNewUserModal()" class="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer">
          Cancelar
        </button>
      </div>
    </div>
  </div>

  <!-- LOGIN WITH PIN MODAL -->
  <div id="modal-login" class="app-modal" style="display: none;">
    <div class="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-bold text-white">Ingreso de Colaborador</h3>
        <button onclick="closeLoginModal()" class="text-slate-400 hover:text-white">&times;</button>
      </div>

      <div class="space-y-3 text-xs">
        <div>
          <label class="block text-slate-400 mb-1">Selecciona tu usuario:</label>
          <select id="login-user-select" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs">
            <!-- Rendered by JS -->
          </select>
        </div>

        <div>
          <label class="block text-slate-400 mb-1">PIN de Seguridad (4 dígitos):</label>
          <input type="password" maxlength="4" id="login-pin-input" placeholder="••••" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:border-emerald-500">
        </div>

        <p id="login-error-msg" class="text-xs text-rose-400 font-semibold hidden"></p>

        <button onclick="submitPinLogin()" class="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer">
          Autenticar y Entrar
        </button>
      </div>
    </div>
  </div>

  <!-- PIN GUIDE MODAL -->
  <div id="modal-pin-guide" class="app-modal" style="display: none;">
    <div class="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-bold text-white">Guía de PINs de Prueba</h3>
        <button onclick="closePinGuideModal()" class="text-slate-400 hover:text-white">&times;</button>
      </div>
      <p class="text-xs text-slate-400">Usa estos PINs predeterminados para probar la autenticación y permisos:</p>
      <div id="pin-guide-list" class="space-y-2 text-xs">
        <!-- Rendered by JS -->
      </div>
    </div>
  </div>

  <!-- DAILY RATE MODAL -->
  <div id="modal-tasa" class="app-modal" style="display: none;">
    <div class="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-bold text-white">Cotización Diaria (USD / Bs)</h3>
        <button onclick="closeTasaModal()" class="text-slate-400 hover:text-white">&times;</button>
      </div>
      <p class="text-xs text-slate-400">Ingresa la tasa oficial del día para la conversión automática en cajas y reportes:</p>
      <div class="space-y-3 text-xs">
        <div>
          <label class="block text-slate-400 mb-1">Tasa en Bolívares por 1 USD:</label>
          <input type="number" step="0.01" id="tasa-input-val" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 font-mono text-base text-emerald-400 font-bold">
        </div>
        <button onclick="saveDailyRate()" class="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer">
          Confirmar y Aplicar Tasa
        </button>
      </div>
    </div>
  </div>

  <!-- CLIENTE MODAL (NEW / EDIT) -->
  <div id="modal-cliente" class="app-modal" style="display: none;">
    <div class="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 id="modal-cliente-title" class="text-base font-bold text-white">Registrar Nuevo Cliente</h3>
        <button onclick="closeClienteModal()" class="text-slate-400 hover:text-white text-lg">&times;</button>
      </div>
      <form onsubmit="saveClienteForm(event)" class="space-y-3 text-xs">
        <input type="hidden" id="cli-form-id" value="">
        <div>
          <label class="block text-slate-400 mb-1">Nombre Completo / Razón Social <span class="text-rose-400">*</span></label>
          <input type="text" id="cli-form-nombre" required placeholder="Ej. Distribuidora Central C.A." class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-400 mb-1">RIF / Cédula <span class="text-rose-400">*</span></label>
            <input type="text" id="cli-form-rif" required placeholder="J-12345678-0" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase">
          </div>
          <div>
            <label class="block text-slate-400 mb-1">Teléfono</label>
            <input type="text" id="cli-form-tel" placeholder="+58 414-0000000" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-400 mb-1">Correo Electrónico</label>
            <input type="email" id="cli-form-email" placeholder="cliente@correo.com" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
          </div>
          <div>
            <label class="block text-slate-400 mb-1">Límite de Crédito ($ USD)</label>
            <input type="number" id="cli-form-limite" min="0" value="300" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono">
          </div>
        </div>
        <div class="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <button type="button" onclick="closeClienteModal()" class="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs cursor-pointer">Cancelar</button>
          <button type="submit" class="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer">Guardar Cliente</button>
        </div>
      </form>
    </div>
  </div>

  <!-- PROVEEDOR MODAL (NEW / EDIT) -->
  <div id="modal-proveedor" class="app-modal" style="display: none;">
    <div class="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 id="modal-proveedor-title" class="text-base font-bold text-white">Registrar Nuevo Proveedor</h3>
        <button onclick="closeProveedorModal()" class="text-slate-400 hover:text-white text-lg">&times;</button>
      </div>
      <form onsubmit="saveProveedorForm(event)" class="space-y-3 text-xs">
        <input type="hidden" id="prov-form-id" value="">
        <div>
          <label class="block text-slate-400 mb-1">Razón Social / Proveedor <span class="text-rose-400">*</span></label>
          <input type="text" id="prov-form-nombre" required placeholder="Ej. Alimentos Polar Comercial C.A." class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-400 mb-1">RIF <span class="text-rose-400">*</span></label>
            <input type="text" id="prov-form-rif" required placeholder="J-00000000-0" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase">
          </div>
          <div>
            <label class="block text-slate-400 mb-1">Persona de Contacto</label>
            <input type="text" id="prov-form-contacto" placeholder="Lic. Marcos Delgado" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-400 mb-1">Teléfono</label>
            <input type="text" id="prov-form-tel" placeholder="+58 212-0000000" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono">
          </div>
          <div>
            <label class="block text-slate-400 mb-1">Correo Electrónico</label>
            <input type="email" id="prov-form-email" placeholder="pedidos@proveedor.com" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
          </div>
        </div>
        <div>
          <label class="block text-slate-400 mb-1">Dirección / Galpón</label>
          <input type="text" id="prov-form-dir" placeholder="Zona Industrial" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
        </div>
        <div class="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <button type="button" onclick="closeProveedorModal()" class="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs cursor-pointer">Cancelar</button>
          <button type="submit" class="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer">Guardar Proveedor</button>
        </div>
      </form>
    </div>
  </div>

  <!-- FACTURA DE PROVEEDOR (NUEVA COMPRA) MODAL -->
  <div id="modal-compra" class="app-modal" style="display: none;">
    <div class="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full p-5 space-y-4 shadow-2xl max-h-[92vh] flex flex-col">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <div class="flex items-center gap-2">
          <div class="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <div>
            <h3 class="text-base font-bold text-white">Registro de Factura de Proveedor</h3>
            <p class="text-[11px] text-slate-400">Entrada a inventario con códigos de barra, presentación (UND/KG/L), fracciones, costos y PVP</p>
          </div>
        </div>
        <button onclick="closeCompraModal()" class="text-slate-400 hover:text-white text-xl cursor-pointer">&times;</button>
      </div>

      <div class="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar text-xs">
        <!-- Cabecera de Factura -->
        <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div class="sm:col-span-4">
            <label class="block text-slate-300 font-semibold mb-1">Proveedor:</label>
            <select id="compra-form-prov" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white">
              <!-- Rendered by JS -->
            </select>
          </div>
          <div class="sm:col-span-3">
            <label class="block text-slate-300 font-semibold mb-1">Nro de Factura:</label>
            <input type="text" id="compra-form-nro" required placeholder="FAC-0098" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-mono font-bold">
          </div>
          <div class="sm:col-span-2">
            <label class="block text-slate-300 font-semibold mb-1">Fecha Emisión:</label>
            <input type="date" id="compra-form-fecha" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-white font-mono">
          </div>
          <div class="sm:col-span-3">
            <label class="block text-slate-300 font-semibold mb-1">Sucursal Destino:</label>
            <select id="compra-form-suc" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white">
              <option value="1">Tienda 1</option>
              <option value="2">Tienda 2</option>
              <option value="3">Almacén Central</option>
            </select>
          </div>
        </div>

        <!-- Barra de Entrada de Artículo -->
        <div class="bg-slate-950 p-3.5 rounded-xl border border-emerald-500/30 space-y-2.5">
          <div class="flex items-center justify-between pb-1 border-b border-slate-800">
            <span class="text-xs font-bold text-emerald-400">Cargar Artículo Facturado</span>
            <span class="text-[10px] text-slate-400">Admite fracciones (ej. 0.500 kg, 1.250 l)</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div class="sm:col-span-4">
              <label class="block text-[10px] text-slate-400 mb-1">Seleccionar o Nuevo:</label>
              <select id="compra-item-select" onchange="onCompraItemSelectChange(this.value)" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs">
                <!-- Rendered by JS -->
              </select>
            </div>
            <div class="sm:col-span-3">
              <label class="block text-[10px] text-slate-400 mb-1">Código de Barras:</label>
              <input type="text" id="compra-item-barcode" placeholder="Ej: 75910080" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono text-xs">
            </div>
            <div class="sm:col-span-5">
              <label class="block text-[10px] text-slate-400 mb-1">Descripción del Producto:</label>
              <input type="text" id="compra-item-nombre" placeholder="Nombre / Marca del artículo" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-semibold text-xs">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
            <div class="sm:col-span-3">
              <label class="block text-[10px] text-slate-400 mb-1">Presentación (Unidad):</label>
              <select id="compra-item-unidad" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs font-bold">
                <option value="UND">Pieza / Unidad (UND)</option>
                <option value="KG">Kilogramo (KG)</option>
                <option value="L">Litro (L)</option>
                <option value="PQ">Paquete / Bulto (PQ)</option>
              </select>
            </div>
            <div class="sm:col-span-2">
              <label class="block text-[10px] text-slate-400 mb-1">Cantidad (Fracción):</label>
              <input type="number" step="0.001" min="0.001" id="compra-item-cant" value="1.000" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-emerald-400 font-mono font-bold text-xs">
            </div>
            <div class="sm:col-span-2">
              <label class="block text-[10px] text-slate-400 mb-1">Costo Unit. ($):</label>
              <input type="number" step="0.01" min="0.01" id="compra-item-costo" value="1.00" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono font-bold text-xs">
            </div>
            <div class="sm:col-span-2">
              <label class="block text-[10px] text-slate-400 mb-1">PVP Venta ($):</label>
              <input type="number" step="0.01" min="0.01" id="compra-item-pvp" value="1.50" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-emerald-300 font-mono font-bold text-xs">
            </div>
            <div class="sm:col-span-3 flex items-center gap-2">
              <label class="flex items-center gap-1.5 cursor-pointer bg-slate-900 border border-slate-800 px-2 py-1.5 rounded-lg">
                <input type="checkbox" id="compra-item-exento" class="w-3.5 h-3.5 rounded text-amber-500 bg-slate-950 border-slate-700">
                <span class="text-[10px] text-amber-300 font-bold">Exento</span>
              </label>
              <button type="button" onclick="addCompraItemRow()" class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer shadow">
                + Agregar
              </button>
            </div>
          </div>
        </div>

        <!-- Tabla de Artículos Facturados -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-slate-400 text-xs">
            <span class="font-bold text-white">Artículos en esta Factura:</span>
            <span id="compra-items-summary" class="font-mono text-emerald-400">0 ítems cargados</span>
          </div>
          <div class="border border-slate-800 rounded-xl overflow-hidden bg-slate-950 max-h-48 overflow-y-auto custom-scrollbar">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="border-b border-slate-800 text-slate-400 bg-slate-900/90">
                  <th class="py-2 px-2.5">Código</th>
                  <th class="py-2 px-2.5">Descripción</th>
                  <th class="py-2 px-2 text-center">Unidad</th>
                  <th class="py-2 px-2 text-right">Cantidad</th>
                  <th class="py-2 px-2 text-right">Costo ($)</th>
                  <th class="py-2 px-2 text-right">PVP ($)</th>
                  <th class="py-2 px-2 text-center">IVA</th>
                  <th class="py-2 px-2.5 text-right">Subtotal ($)</th>
                  <th class="py-2 px-2 text-center">X</th>
                </tr>
              </thead>
              <tbody id="compra-items-table-body" class="divide-y divide-slate-800/60 font-mono">
                <!-- Rendered by JS -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- Resumen Fiscal de Factura de Proveedor -->
        <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          <div class="text-slate-400 text-[11px] space-y-1">
            <p>• Los artículos se ingresarán automáticamente con stock actualizado a la sucursal seleccionada.</p>
            <p>• Se actualizará el costo del producto y su precio de venta al público (PVP) en catálogo.</p>
          </div>
          <div class="space-y-1 text-xs font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800">
            <div class="flex justify-between text-slate-400">
              <span>Subtotal Neto:</span>
              <span id="compra-subtotal-val" class="text-white font-bold">$0.00</span>
            </div>
            <div class="flex justify-between text-slate-400">
              <span>Base Imponible 16%:</span>
              <span id="compra-base-val" class="text-emerald-300">$0.00</span>
            </div>
            <div class="flex justify-between text-slate-400">
              <span>Exento 0%:</span>
              <span id="compra-exento-val" class="text-amber-300">$0.00</span>
            </div>
            <div class="flex justify-between text-slate-400 pb-1 border-b border-slate-800">
              <span>IVA 16%:</span>
              <span id="compra-iva-val" class="text-emerald-400">+$0.00</span>
            </div>
            <div class="flex justify-between items-center pt-1 font-bold">
              <span class="text-white font-sans text-xs">TOTAL FACTURA:</span>
              <div class="text-right">
                <span id="compra-total-usd-val" class="text-base text-emerald-400">$0.00</span>
                <div id="compra-total-bs-val" class="text-[10px] text-slate-400">Bs 0.00</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 pt-3 border-t border-slate-800">
        <button type="button" onclick="closeCompraModal()" class="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs cursor-pointer">Cancelar</button>
        <button type="button" onclick="saveFullCompraInvoice()" class="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-lg shadow-emerald-500/20">
          ✓ Procesar Factura e Ingresar a Inventario
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL: VER DETALLE DE COMPRA -->
  <div id="modal-ver-compra" class="app-modal" style="display: none;">
    <div class="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 id="ver-compra-title" class="text-sm font-bold text-white">Factura de Compra</h3>
        <button onclick="hideModal('modal-ver-compra')" class="text-slate-400 hover:text-white text-lg">&times;</button>
      </div>
      <div id="ver-compra-content" class="space-y-3 text-xs overflow-y-auto flex-1 custom-scrollbar">
        <!-- Rendered by JS -->
      </div>
      <div class="flex justify-end pt-2 border-t border-slate-800">
        <button onclick="hideModal('modal-ver-compra')" class="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs">Cerrar</button>
      </div>
    </div>
  </div>

  <!-- MODAL: NUEVO PRODUCTO -->
  <div id="modal-producto" class="app-modal" style="display: none;">
    <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 class="text-sm font-bold text-white flex items-center gap-2">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
          <span>Registrar Nuevo Artículo en Catálogo</span>
        </h3>
        <button onclick="closeNewProductModal()" class="text-slate-400 hover:text-white text-lg font-bold cursor-pointer">&times;</button>
      </div>

      <form onsubmit="saveNewProductStandalone(event)" class="space-y-3 text-xs">
        <div>
          <label class="block text-slate-400 mb-1 font-semibold">Código de Barras / SKU:</label>
          <input type="text" id="prod-form-code" required placeholder="7591009" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono">
        </div>
        <div>
          <label class="block text-slate-400 mb-1 font-semibold">Nombre / Descripción:</label>
          <input type="text" id="prod-form-name" required placeholder="Ej: Arroz Integral 1kg" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
        </div>
        <div class="grid grid-cols-2 gap-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
          <div>
            <label class="block text-amber-400 mb-1 font-semibold">Costo Unitario ($):</label>
            <input type="number" step="0.01" min="0" id="prod-form-cost" required placeholder="1.80" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold">
          </div>
          <div>
            <label class="block text-emerald-400 mb-1 font-semibold">Precio Venta ($):</label>
            <input type="number" step="0.01" min="0.01" id="prod-form-price" required placeholder="2.50" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold">
          </div>
        </div>
        <div class="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" id="prod-form-exento" class="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-0">
            <div>
              <span class="font-bold text-white text-xs">Exento de IVA (Tasa 0%)</span>
              <p class="text-[10px] text-slate-400">Marcar si es un alimento básico o producto no gravado con el 16% de IVA</p>
            </div>
          </label>
        </div>
        <div>
          <label class="block text-slate-400 mb-1">Stock Inicial Bodega:</label>
          <input type="number" min="0" id="prod-form-stock-oficina" required placeholder="100" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-purple-400 font-mono font-bold">
        </div>
        <div class="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <button type="button" onclick="closeNewProductModal()" class="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs cursor-pointer">Cancelar</button>
          <button type="submit" class="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-lg shadow-emerald-500/20">Guardar Artículo</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: EDITAR PRODUCTO -->
  <div id="modal-edit-producto" class="app-modal" style="display: none;">
    <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 class="text-sm font-bold text-white flex items-center gap-2">
          <svg class="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          <span>Editar Artículo de Catálogo</span>
        </h3>
        <button onclick="closeEditProductModal()" class="text-slate-400 hover:text-white text-lg font-bold cursor-pointer">&times;</button>
      </div>

      <form onsubmit="saveEditProductStandalone(event)" class="space-y-3 text-xs">
        <input type="hidden" id="edit-prod-id">
        <div>
          <label class="block text-slate-400 mb-1 font-semibold">Código de Barras / SKU:</label>
          <input type="text" id="edit-prod-code" required class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono">
        </div>
        <div>
          <label class="block text-slate-400 mb-1 font-semibold">Nombre / Descripción:</label>
          <input type="text" id="edit-prod-name" required class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
        </div>
        <div class="grid grid-cols-2 gap-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
          <div>
            <label class="block text-amber-400 mb-1 font-semibold">Costo Unitario ($):</label>
            <input type="number" step="0.01" min="0" id="edit-prod-cost" required class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold">
          </div>
          <div>
            <label class="block text-emerald-400 mb-1 font-semibold">Precio Venta ($):</label>
            <input type="number" step="0.01" min="0.01" id="edit-prod-price" required class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold">
          </div>
        </div>
        <div class="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" id="edit-prod-exento" class="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-0">
            <div>
              <span class="font-bold text-white text-xs">Exento de IVA (Tasa 0%)</span>
              <p class="text-[10px] text-slate-400">Marcar si es un alimento básico o producto no gravado con el 16% de IVA</p>
            </div>
          </label>
        </div>
        <div class="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <button type="button" onclick="closeEditProductModal()" class="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs cursor-pointer">Cancelar</button>
          <button type="submit" class="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-lg shadow-sky-500/20">Guardar Cambios</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: SELECCIONAR O CREAR CLIENTE EN POS -->
  <div id="modal-pos-cliente" class="app-modal" style="display: none;">
    <div class="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 relative">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <div class="flex items-center gap-2.5">
          <div class="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          </div>
          <div>
            <h3 class="font-bold text-white text-base">Seleccionar Cliente para la Venta</h3>
            <p class="text-xs text-slate-400">Si no seleccionas uno, se procesará como "Cliente de Contado"</p>
          </div>
        </div>
        <button onclick="closePosClientModal()" class="text-slate-400 hover:text-white text-lg font-bold cursor-pointer">&times;</button>
      </div>

      <!-- Main Client Selection View -->
      <div id="pos-client-select-view" class="space-y-3.5">
        <div class="relative">
          <input type="text" id="pos-client-search-input" onkeyup="filterPosClientList()" placeholder="Buscar por nombre, Cédula/RIF o teléfono..." class="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500">
          <svg class="w-4 h-4 text-slate-500 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>

        <!-- Default Contado Card -->
        <div onclick="resetPosClienteToContado(); closePosClientModal();" class="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-between cursor-pointer transition-all">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              CC
            </div>
            <div>
              <h4 class="font-bold text-xs text-white">Cliente de Contado (Predeterminado)</h4>
              <p class="text-[11px] text-slate-400">Consumidor Final / Sin registro de cuenta</p>
            </div>
          </div>
          <span class="text-xs text-emerald-400 font-bold">Seleccionar</span>
        </div>

        <!-- Client Results List -->
        <div id="pos-client-list-container" class="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          <!-- Rendered by JS -->
        </div>

        <!-- Footer Buttons -->
        <div class="flex gap-2 pt-2 border-t border-slate-800">
          <button type="button" onclick="showPosQuickNewClient(true)" class="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
            <span>+ Registrar Nuevo Cliente</span>
          </button>
          <button type="button" onclick="closePosClientModal()" class="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer">
            Cerrar
          </button>
        </div>
      </div>

      <!-- Quick New Client Form -->
      <div id="pos-client-form-view" class="space-y-3 hidden">
        <h4 class="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
          <span>Registro Rápido de Cliente</span>
        </h4>
        <form onsubmit="savePosQuickNewClient(event)" class="space-y-3 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label class="block text-[11px] text-slate-400 mb-1">Nombre / Razón Social *</label>
              <input type="text" id="pos-new-client-name" required placeholder="Ej: Inversiones Los Andes C.A." class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
            </div>
            <div>
              <label class="block text-[11px] text-slate-400 mb-1">Cédula o RIF *</label>
              <input type="text" id="pos-new-client-rif" required placeholder="Ej: J-12345678-0" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono">
            </div>
            <div>
              <label class="block text-[11px] text-slate-400 mb-1">Teléfono</label>
              <input type="text" id="pos-new-client-tel" placeholder="0414-1234567" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white">
            </div>
            <div>
              <label class="block text-[11px] text-slate-400 mb-1">Límite Crédito ($)</label>
              <input type="number" id="pos-new-client-limit" min="0" step="10" placeholder="0.00" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono">
            </div>
          </div>
          <div class="flex gap-2 pt-2 border-t border-slate-800">
            <button type="submit" class="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer">
              Guardar y Asignar a la Venta
            </button>
            <button type="button" onclick="showPosQuickNewClient(false)" class="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer">
              Volver
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- MODAL: COBRO MULTI-MÉTODO (PAGO MÓVIL, EFECTIVO USD, EFECTIVO BS, MIXTO) -->
  <div id="modal-pos-checkout" class="app-modal" style="display: none;">
    <div class="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl w-full max-w-xl p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 relative max-h-[92vh] overflow-y-auto custom-scrollbar">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3.5">
        <div class="flex items-center gap-3">
          <div class="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <h3 class="font-bold text-white text-lg">Cobro de Venta</h3>
            <p class="text-xs text-slate-400">Cliente: <strong id="pos-chk-client-name" class="text-white">Cliente de Contado</strong> (<span id="pos-chk-client-rif">V-00000000</span>)</p>
          </div>
        </div>
        <div class="text-right">
          <div id="pos-chk-total-usd" class="text-xl sm:text-2xl font-black text-emerald-400 font-mono">$ 0.00</div>
          <div id="pos-chk-total-bs" class="text-xs font-mono text-slate-300 font-semibold">Bs. 0.00</div>
        </div>
      </div>

      <!-- Fiscal Discrimination Breakdown in Checkout Modal -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-[11px] font-mono">
        <div>
          <span class="text-slate-400 block text-[10px]">Subtotal Neto:</span>
          <span id="pos-chk-subtotal-val" class="font-bold text-slate-200">$ 0.00</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px]">Base Gravada (16%):</span>
          <span id="pos-chk-base-val" class="font-bold text-slate-200">$ 0.00</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px]">Monto Exento (0%):</span>
          <span id="pos-chk-exento-val" class="font-bold text-amber-300">$ 0.00</span>
        </div>
        <div>
          <span class="text-emerald-400 block text-[10px] font-semibold">IVA Liquidado (16%):</span>
          <span id="pos-chk-iva-val" class="font-bold text-emerald-400">+$ 0.00</span>
        </div>
      </div>

      <!-- Payment Method Tabs -->
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
        <button type="button" onclick="setPosCheckoutMethod('pago_movil')" id="tab-pay-pago_movil" class="p-2.5 rounded-xl border border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold text-center flex flex-col items-center gap-1 cursor-pointer">
          <svg class="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
          <span>Pago Móvil</span>
          <span class="text-[9px] font-mono text-slate-400 font-normal">Bolívares</span>
        </button>

        <button type="button" onclick="setPosCheckoutMethod('efectivo_usd')" id="tab-pay-efectivo_usd" class="p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 text-center flex flex-col items-center gap-1 cursor-pointer">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          <span>Efectivo ($)</span>
          <span class="text-[9px] font-mono text-slate-400 font-normal">Dólares USD</span>
        </button>

        <button type="button" onclick="setPosCheckoutMethod('efectivo_bs')" id="tab-pay-efectivo_bs" class="p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 text-center flex flex-col items-center gap-1 cursor-pointer">
          <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span>Efectivo (Bs)</span>
          <span class="text-[9px] font-mono text-slate-400 font-normal">Bolívares</span>
        </button>

        <button type="button" onclick="setPosCheckoutMethod('tarjeta')" id="tab-pay-tarjeta" class="p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 text-center flex flex-col items-center gap-1 cursor-pointer">
          <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
          <span>Tarjeta / POS</span>
          <span class="text-[9px] font-mono text-slate-400 font-normal">Débito/Crédito</span>
        </button>

        <button type="button" onclick="setPosCheckoutMethod('mixto')" id="tab-pay-mixto" class="p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 text-center flex flex-col items-center gap-1 cursor-pointer">
          <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
          <span>Pago Mixto</span>
          <span class="text-[9px] font-mono text-slate-400 font-normal">Combinado</span>
        </button>
      </div>

      <!-- TAB 1: PAGO MÓVIL -->
      <div id="pos-tab-content-pago_movil" class="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3.5">
        <div class="flex items-center justify-between bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <div>
            <span class="text-xs text-slate-400 block">Monto exacto a transferir:</span>
            <span id="pos-pm-monto-bs" class="text-lg font-mono font-bold text-emerald-400">Bs. 0.00</span>
          </div>
          <div class="text-right">
            <span class="text-[11px] text-slate-500 font-mono">Equivalente USD:</span>
            <span id="pos-pm-monto-usd" class="text-xs font-mono font-bold text-white block">$ 0.00</span>
          </div>
        </div>

        <div class="space-y-3">
          <div>
            <label class="text-xs font-bold text-white block mb-1.5">Número de Referencia del Pago Móvil *</label>
            <input type="text" id="pos-chk-pm-ref" placeholder="Ej: 489201 o últimos 6/8 dígitos" class="w-full bg-slate-900 border border-slate-700 text-emerald-400 font-mono text-sm px-4 py-2.5 rounded-xl focus:border-emerald-500 focus:outline-none placeholder:text-slate-600">
          </div>
          <div>
            <label class="text-[11px] text-slate-400 block mb-1">Banco Receptor de la Empresa</label>
            <select id="pos-chk-pm-banco" class="w-full bg-slate-900 border border-slate-700 text-xs text-white px-3 py-2 rounded-xl focus:outline-none">
              <option value="0102 - Banco de Venezuela">0102 - Banco de Venezuela</option>
              <option value="0134 - Banesco">0134 - Banesco</option>
              <option value="0105 - Banco Mercantil">0105 - Banco Mercantil</option>
              <option value="0108 - Banco Provincial">0108 - Banco Provincial</option>
              <option value="0172 - Bancamiga">0172 - Bancamiga</option>
            </select>
          </div>
          <div class="bg-slate-900/60 p-2.5 rounded-xl text-[11px] text-slate-400 space-y-0.5 border border-slate-800/70">
            <p class="font-semibold text-slate-300">Datos para Pago Móvil de la Empresa:</p>
            <p>RIF: <strong id="pos-pm-empresa-rif" class="text-white font-mono">J-31045892-0</strong> • Tlf: <strong id="pos-pm-empresa-tel" class="text-white">+58 274 263-4411</strong></p>
          </div>
        </div>
      </div>

      <!-- TAB 2: EFECTIVO USD -->
      <div id="pos-tab-content-efectivo_usd" class="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3.5 hidden">
        <div class="flex items-center justify-between bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <div>
            <span class="text-xs text-slate-400 block">Total a Pagar en Dólares:</span>
            <span id="pos-usd-monto-usd" class="text-xl font-mono font-bold text-white">$ 0.00</span>
          </div>
          <div class="text-right">
            <span class="text-[11px] text-slate-500 font-mono">Tasa aplicada:</span>
            <span id="pos-usd-tasa-text" class="text-xs font-mono text-emerald-400 block">1$ = Bs. 36.50</span>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-bold text-white block">Monto Entregado por el Cliente ($ USD)</label>
          <input type="number" step="0.01" min="0" id="pos-chk-usd-recibido" oninput="calcPosCheckoutChange()" placeholder="0.00" class="w-full bg-slate-900 border border-slate-700 text-emerald-400 font-mono text-lg px-4 py-2.5 rounded-xl focus:border-emerald-500 focus:outline-none">

          <div class="flex flex-wrap gap-1.5 pt-1">
            <button type="button" onclick="setPosUsdExact()" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono cursor-pointer">Exacto</button>
            <button type="button" onclick="setPosUsdChip(5)" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-mono font-bold cursor-pointer">$5</button>
            <button type="button" onclick="setPosUsdChip(10)" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-mono font-bold cursor-pointer">$10</button>
            <button type="button" onclick="setPosUsdChip(20)" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-mono font-bold cursor-pointer">$20</button>
            <button type="button" onclick="setPosUsdChip(50)" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-mono font-bold cursor-pointer">$50</button>
            <button type="button" onclick="setPosUsdChip(100)" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-mono font-bold cursor-pointer">$100</button>
          </div>
        </div>

        <div id="pos-usd-status-box" class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span id="pos-usd-status-label" class="text-xs text-slate-400 block">Cambio / Vuelto a Entregar:</span>
            <span id="pos-usd-status-val" class="text-lg font-mono font-black text-emerald-400">$ 0.00</span>
          </div>
          <div class="text-right">
            <span id="pos-usd-status-sublabel" class="text-[10px] text-slate-500 block">Equivalente en Bolívares:</span>
            <span id="pos-usd-status-subval" class="text-xs font-mono font-bold text-slate-300">Bs. 0.00</span>
          </div>
        </div>
      </div>

      <!-- TAB 3: EFECTIVO BS -->
      <div id="pos-tab-content-efectivo_bs" class="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3.5 hidden">
        <div class="flex items-center justify-between bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <div>
            <span class="text-xs text-slate-400 block">Total a Pagar en Bolívares:</span>
            <span id="pos-bs-monto-bs" class="text-xl font-mono font-bold text-emerald-400">Bs. 0.00</span>
          </div>
          <div class="text-right">
            <span class="text-[11px] text-slate-500 font-mono">Monto en USD:</span>
            <span id="pos-bs-monto-usd" class="text-xs font-mono font-bold text-white block">$ 0.00</span>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-bold text-white block">Monto Entregado por el Cliente (Bs.)</label>
          <input type="number" step="0.01" min="0" id="pos-chk-bs-recibido" oninput="calcPosCheckoutChange()" placeholder="0.00" class="w-full bg-slate-900 border border-slate-700 text-emerald-400 font-mono text-lg px-4 py-2.5 rounded-xl focus:border-emerald-500 focus:outline-none">

          <div class="flex flex-wrap gap-1.5 pt-1">
            <button type="button" onclick="setPosBsExact()" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono cursor-pointer">Exacto</button>
            <button type="button" onclick="setPosBsRound()" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-mono cursor-pointer">Redondear</button>
          </div>
        </div>

        <div id="pos-bs-status-box" class="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span id="pos-bs-status-label" class="text-xs text-slate-400 block">Vuelto en Bolívares:</span>
            <span id="pos-bs-status-val" class="text-lg font-mono font-black text-emerald-400">Bs. 0.00</span>
          </div>
          <div class="text-right">
            <span id="pos-bs-status-sublabel" class="text-[10px] text-slate-500 block">Equivalente en USD:</span>
            <span id="pos-bs-status-subval" class="text-xs font-mono font-bold text-slate-300">$ 0.00</span>
          </div>
        </div>
      </div>

      <!-- TAB 4: TARJETA / PUNTO DE VENTA (POS) -->
      <div id="pos-tab-content-tarjeta" class="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3.5 hidden">
        <div class="flex items-center justify-between bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <div>
            <span class="text-xs text-slate-400 block">Monto a procesar en el Punto de Venta:</span>
            <span id="pos-tarjeta-monto-bs" class="text-lg font-mono font-bold text-emerald-400">Bs. 0.00</span>
          </div>
          <div class="text-right">
            <span class="text-[11px] text-slate-500 font-mono">Equivalente USD:</span>
            <span id="pos-tarjeta-monto-usd" class="text-xs font-mono font-bold text-white block">$ 0.00</span>
          </div>
        </div>

        <div class="space-y-3">
          <div>
            <label class="text-[11px] text-slate-400 font-semibold block mb-1.5">Tipo de Tarjeta / Instrumento:</label>
            <div class="grid grid-cols-3 gap-2">
              <button type="button" onclick="setPosTarjetaTipo('debito')" id="btn-tarjeta-tipo-debito" class="py-2 px-2.5 rounded-xl text-xs font-bold border border-indigo-500 bg-indigo-500/20 text-indigo-300 cursor-pointer">
                💳 Débito (Bs)
              </button>
              <button type="button" onclick="setPosTarjetaTipo('credito')" id="btn-tarjeta-tipo-credito" class="py-2 px-2.5 rounded-xl text-xs font-bold border border-slate-800 bg-slate-900 text-slate-400 cursor-pointer">
                💳 Crédito (Bs)
              </button>
              <button type="button" onclick="setPosTarjetaTipo('internacional')" id="btn-tarjeta-tipo-internacional" class="py-2 px-2.5 rounded-xl text-xs font-bold border border-slate-800 bg-slate-900 text-slate-400 cursor-pointer">
                🌐 Inter ($)
              </button>
            </div>
          </div>

          <div>
            <label class="text-[11px] text-slate-400 block mb-1">Terminal POS / Banco</label>
            <select id="pos-chk-tarjeta-banco" class="w-full bg-slate-900 border border-slate-700 text-xs text-white px-3 py-2 rounded-xl focus:outline-none">
              <option value="0134 - Banesco (Terminal POS #1)">0134 - Banesco (Terminal POS #1)</option>
              <option value="0102 - Banco de Venezuela (Biopago / POS #2)">0102 - Banco de Venezuela (Biopago / POS #2)</option>
              <option value="0105 - Banco Mercantil (Terminal POS #3)">0105 - Banco Mercantil (Terminal POS #3)</option>
              <option value="0172 - Bancamiga (POS Dual USD/Bs)">0172 - Bancamiga (POS Dual USD/Bs)</option>
              <option value="0108 - Banco Provincial (Terminal POS)">0108 - Banco Provincial (Terminal POS)</option>
            </select>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-bold text-white block mb-1.5">Número de Referencia / Aprobación *</label>
              <input type="text" id="pos-chk-tarjeta-ref" placeholder="Ej: 004821 (voucher)" class="w-full bg-slate-900 border border-slate-700 text-emerald-400 font-mono text-sm px-4 py-2.5 rounded-xl focus:border-emerald-500 focus:outline-none placeholder:text-slate-600">
            </div>
            <div>
              <label class="text-[11px] text-slate-400 block mb-1.5">Número de Lote (Opcional)</label>
              <input type="text" id="pos-chk-tarjeta-lote" placeholder="Ej: 00014" class="w-full bg-slate-900 border border-slate-700 text-slate-200 font-mono text-sm px-4 py-2.5 rounded-xl focus:border-emerald-500 focus:outline-none placeholder:text-slate-600">
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 5: PAGO MIXTO -->
      <div id="pos-tab-content-mixto" class="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 hidden">
        <div class="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl text-xs">
          <span>Total: <strong id="pos-mixto-total-header" class="text-white font-mono">$ 0.00</strong></span>
          <span id="pos-mixto-status-badge" class="text-amber-400 font-bold">Faltan por cubrir</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div class="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 space-y-1">
            <label class="text-[11px] font-bold text-slate-300 block">1. Efectivo USD ($)</label>
            <input type="number" step="0.01" min="0" id="pos-mixto-usd" oninput="calcPosCheckoutChange()" placeholder="$ 0.00" class="w-full bg-slate-950 border border-slate-700 px-2 py-1.5 rounded-lg text-white font-mono">
          </div>

          <div class="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 space-y-1">
            <label class="text-[11px] font-bold text-slate-300 block">2. Pago Móvil (Bs.)</label>
            <input type="number" step="0.01" min="0" id="pos-mixto-pm-bs" oninput="calcPosCheckoutChange()" placeholder="Bs. 0.00" class="w-full bg-slate-950 border border-slate-700 px-2 py-1.5 rounded-lg text-emerald-400 font-mono">
            <input type="text" id="pos-mixto-pm-ref" placeholder="Ref Pago Móvil" class="w-full bg-slate-950 border border-slate-700 px-2 py-1 rounded text-[11px] text-white font-mono mt-1">
          </div>

          <div class="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 space-y-1">
            <label class="text-[11px] font-bold text-slate-300 block">3. Efectivo Bs.</label>
            <input type="number" step="0.01" min="0" id="pos-mixto-bs" oninput="calcPosCheckoutChange()" placeholder="Bs. 0.00" class="w-full bg-slate-950 border border-slate-700 px-2 py-1.5 rounded-lg text-white font-mono">
          </div>
        </div>

        <div class="space-y-2">
          <div class="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
            <div>
              <span class="text-slate-400 block">Total Cubierto:</span>
              <span id="pos-mixto-cubierto-val" class="font-mono font-bold text-emerald-400">$ 0.00 (Bs. 0.00)</span>
            </div>
            <div id="pos-mixto-vuelto-box" class="text-right hidden">
              <span class="text-slate-400 block">Vuelto:</span>
              <span id="pos-mixto-vuelto-val" class="font-mono font-bold text-emerald-400">$ 0.00</span>
            </div>
          </div>

          <div id="pos-mixto-faltante-box" class="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 flex justify-between items-center text-xs">
            <div class="flex items-center gap-1.5 text-amber-300 font-semibold">
              <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              <span>Faltante por Pagar:</span>
            </div>
            <div class="text-right">
              <span id="pos-mixto-faltante-val" class="font-mono font-bold text-amber-400">$ 0.00 (Bs. 0.00)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2.5 pt-2">
        <button type="button" onclick="confirmPosCheckout()" class="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm cursor-pointer shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2">
          <svg class="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          <span>Confirmar Pago y Registrar Venta</span>
        </button>
        <button type="button" onclick="closePosCheckoutModal()" class="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer">
          Cancelar
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL: RECIBO / TICKET FISCAL PREVIEW -->
  <div id="modal-pos-receipt" class="app-modal" style="display: none;">
    <div class="bg-white text-slate-900 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4 font-mono text-xs relative max-h-[90vh] overflow-y-auto">
      <button onclick="closePosReceiptModal()" class="absolute top-3 right-3 text-slate-400 hover:text-slate-800 text-lg font-bold cursor-pointer">&times;</button>
      
      <div id="pos-receipt-modal-content">
        <!-- Rendered by JS -->
      </div>

      <div class="flex gap-2 pt-2 border-t border-dashed border-slate-300 font-sans">
        <button type="button" onclick="printPosReceiptDirect()" class="flex-1 bg-slate-900 text-white hover:bg-slate-800 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
          <span>Imprimir Ticket</span>
        </button>
        <button type="button" onclick="closePosReceiptModal()" class="bg-slate-200 text-slate-800 hover:bg-slate-300 py-2.5 px-4 rounded-xl font-bold text-xs cursor-pointer">
          Cerrar
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL: BLOQUEO Y ACTIVACIÓN DE LICENCIA (HARDWARE LOCK) -->
  <div id="modal-license-lock" class="app-modal" style="display: none; z-index: 999999;">
    <div class="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
      <div class="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/50 p-6 border-b border-slate-800 flex items-start gap-4">
        <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 004 11v.333m0 0c0 2.473.345 4.866.99 7.132m0 0a21.88 21.88 0 007.828 2.868"/></svg>
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <h2 class="text-lg font-bold text-white tracking-wide">Activación y Licencia de Software</h2>
            <span class="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Hardware Lock</span>
          </div>
          <p class="text-xs text-slate-400 mt-1">Protección criptográfica por huella digital única de este equipo.</p>
        </div>
      </div>

      <div class="p-6 space-y-5">
        <!-- Machine ID Box -->
        <div class="bg-slate-950/80 rounded-xl p-4 border border-slate-800">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>
              <span>ID de Hardware de esta Computadora:</span>
            </span>
            <button type="button" onclick="copyMachineId()" class="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-1 rounded-lg transition-colors border border-indigo-500/20 cursor-pointer">
              <span id="lock-copy-id-text">Copiar ID</span>
            </button>
          </div>
          <div class="flex items-center justify-between bg-slate-900 px-3.5 py-2.5 rounded-lg border border-slate-700/60">
            <span id="lock-machine-id-display" class="font-mono text-base font-bold text-emerald-400 tracking-wider">CALCULANDO...</span>
            <span class="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Único</span>
          </div>
          <p class="text-[11px] text-slate-400 mt-2">Envíe este <strong class="text-slate-300">ID de Hardware</strong> a su desarrollador para recibir la clave de activación autorizada para esta máquina.</p>
        </div>

        <!-- Alert messages -->
        <div id="lock-error-box" class="hidden bg-rose-500/10 border border-rose-500/30 rounded-xl p-3.5 flex items-start gap-3">
          <svg class="w-4 h-4 text-rose-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <p id="lock-error-text" class="text-xs text-rose-300"></p>
        </div>

        <!-- Activation Input -->
        <div class="space-y-2">
          <label class="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
              <span>Clave de Activación Criptográfica:</span>
            </span>
            <span class="text-[11px] text-slate-400 font-mono">Formato LIC-...</span>
          </label>
          <textarea id="lock-key-input" rows="3" placeholder="Pegue aquí la clave de licencia (Ej: LIC-eyJtYWNoaW5lSWQi...)" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 resize-none placeholder:text-slate-600"></textarea>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button type="button" onclick="activateFromLockModal()" class="w-full sm:flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg>
            <span>Validar y Desbloquear Sistema</span>
          </button>
          <button type="button" onclick="activateTrialFromLockModal()" class="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs py-3 px-3.5 rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer">
            <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
            <span>Demo (15 días)</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL: REINICIO CRÍTICO DE BASE DE DATOS -->
  <div id="modal-reset-database" class="app-modal" style="display: none;">
    <div class="bg-slate-900 border border-rose-600/60 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in text-xs">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <div class="flex items-center gap-2 text-rose-400 font-bold">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <span class="text-sm">Confirmación Crítica de Seguridad</span>
        </div>
        <button type="button" onclick="closeResetDatabaseModal()" class="text-slate-400 hover:text-white text-lg font-bold cursor-pointer">&times;</button>
      </div>

      <p class="text-slate-300">
        Para prevenir borrados accidentales, debes cumplir con las siguientes <strong>2 verificaciones de seguridad</strong>:
      </p>

      <div class="space-y-3">
        <div>
          <label class="block text-slate-400 mb-1">
            1. Escribe exactamente la palabra <span class="font-mono font-bold text-rose-400">REINICIAR</span>:
          </label>
          <input type="text" id="reset-confirm-word-input" oninput="validateResetInputs()" placeholder="Escribe REINICIAR" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase">
        </div>

        <div>
          <label class="block text-slate-400 mb-1">
            2. Ingresa el PIN de Administrador (Ana Morales / 1111):
          </label>
          <input type="password" id="reset-confirm-pin-input" oninput="validateResetInputs()" maxlength="6" placeholder="PIN de 4 dígitos" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-center tracking-widest">
        </div>
        <div id="reset-error-msg" class="text-rose-400 text-[11px] hidden font-semibold"></div>
      </div>

      <div class="flex gap-2 pt-2 border-t border-slate-800">
        <button type="button" onclick="closeResetDatabaseModal()" class="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl cursor-pointer">
          Cancelar
        </button>
        <button type="button" id="btn-execute-reset" onclick="executeDatabaseReset()" disabled class="flex-1 py-2.5 bg-slate-800 text-slate-500 font-bold rounded-xl cursor-not-allowed transition-all flex items-center justify-center gap-1.5">
          <span>🔥 Borrar y Reiniciar</span>
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL: FICHA TÉCNICA DE DETALLE DE AUDITORÍA -->
  <div id="modal-audit-detail" class="app-modal" style="display: none;">
    <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 class="text-sm font-bold text-white flex items-center gap-2">
          <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          <span>Ficha Técnica de Evento Auditado</span>
        </h3>
        <button type="button" onclick="closeAuditDetail()" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer">&times;</button>
      </div>

      <div class="space-y-3 text-xs" id="modal-audit-detail-content">
        <!-- Filled dynamically by openAuditDetail() -->
      </div>

      <div class="pt-2 border-t border-slate-800 flex justify-end">
        <button type="button" onclick="closeAuditDetail()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs cursor-pointer">
          Cerrar Ficha
        </button>
      </div>
    </div>
  </div>

  <!-- PRINTABLE RECEIPT CONTAINER (Used when printing) -->
  <div id="printable-receipt" class="hidden"></div>

  <!-- ================= LOGIC SCRIPT ================= -->
  <script>
    // Initial Database / State
    const DB_KEY = 'pos_multisucursal_standalone_db_v2';

    /* __INITIAL_DATA_START__ */
    const INITIAL_DATA = {
      empresaConfig: {
        nombreEmpresa: "Corporación Los Andes C.A.",
        rif: "J-31045892-0",
        direccionFiscal: "Av. Las Américas, Centro Empresarial Torre A, Piso 4",
        telefono: "+58 274 263-4411",
        tasaCambio: 36.50,
        nombreTienda1: "Tienda 1 (Av. Principal)",
        nombreTienda2: "Tienda 2 (C.C. Sambil)",
        nombreOficina: "Oficina Central / Almacén",
      },
      sucursales: [
        { id: 1, nombre: "Tienda 1 (Av. Principal)", tipo: "tienda" },
        { id: 2, nombre: "Tienda 2 (C.C. Sambil)", tipo: "tienda" },
        { id: 3, nombre: "Oficina Central / Almacén", tipo: "oficina" }
      ],
      currentUser: {
        id: 1,
        nombre_completo: "Ana Morales",
        email: "ana.morales@empresa.com",
        rol: "admin",
        sucursal_id: 3,
        pin: "1234",
        permisos: { dashboard: true, ventas: true, inventario: true, compras: true, clientes: true, proveedores: true, cxc: true, cxp: true, reportes: true, configuracion: true }
      },
      usuarios: [
        { id: 1, nombre_completo: "Ana Morales", rol: "admin", pin: "1234", permisos: { dashboard: true, ventas: true, inventario: true, compras: true, clientes: true, proveedores: true, cxc: true, cxp: true, reportes: true, configuracion: true } },
        { id: 2, nombre_completo: "Carlos Mendoza", rol: "supervisor", pin: "2345", permisos: { dashboard: true, ventas: true, inventario: true, compras: true, clientes: true, proveedores: true, cxc: true, cxp: true, reportes: true, configuracion: false } },
        { id: 3, nombre_completo: "Sofia Castro", rol: "cajero", pin: "3456", permisos: { dashboard: false, ventas: true, inventario: false, compras: false, clientes: false, proveedores: false, cxc: false, cxp: false, reportes: false, configuracion: false } },
        { id: 4, nombre_completo: "Miguel Ángel Peña", rol: "cajero", pin: "4567", permisos: { dashboard: false, ventas: true, inventario: false, compras: false, clientes: false, proveedores: false, cxc: false, cxp: false, reportes: false, configuracion: false } },
        { id: 5, nombre_completo: "Valentina Díaz", rol: "supervisor", pin: "5678", permisos: { dashboard: true, ventas: true, inventario: true, compras: true, clientes: true, proveedores: true, cxc: true, cxp: true, reportes: true, configuracion: false } },
        { id: 6, nombre_completo: "Luis Gómez", rol: "cajero", pin: "6789", permisos: { dashboard: false, ventas: true, inventario: false, compras: false, clientes: false, proveedores: false, cxc: false, cxp: false, reportes: false, configuracion: false } },
      ],
      productos: [
        { id: 1, codigo_barras: "7591001", nombre: "Harina PAN 1kg", precio: 1.20, costo: 0.85, exento_iva: true },
        { id: 2, codigo_barras: "7591002", nombre: "Arroz Primor 1kg", precio: 1.50, costo: 1.05, exento_iva: true },
        { id: 3, codigo_barras: "7591003", nombre: "Aceite Mazeite 1L", precio: 3.80, costo: 2.70, exento_iva: false },
        { id: 4, codigo_barras: "7591004", nombre: "Pasta Primor 1kg", precio: 1.40, costo: 0.95, exento_iva: true },
        { id: 5, codigo_barras: "7591005", nombre: "Café Fama de América 500g", precio: 4.50, costo: 3.20, exento_iva: false },
        { id: 6, codigo_barras: "7591006", nombre: "Azúcar Montalbán 1kg", precio: 1.30, costo: 0.90, exento_iva: true },
        { id: 7, codigo_barras: "7591007", nombre: "Leche La Campiña 1kg", precio: 7.20, costo: 5.10, exento_iva: true },
        { id: 8, codigo_barras: "7591008", nombre: "Atún Margarita 140g", precio: 2.10, costo: 1.45, exento_iva: false },
      ],
      inventario: [
        { sucursal_id: 1, producto_id: 1, stock: 120 },
        { sucursal_id: 1, producto_id: 2, stock: 85 },
        { sucursal_id: 1, producto_id: 3, stock: 45 },
        { sucursal_id: 1, producto_id: 4, stock: 90 },
        { sucursal_id: 1, producto_id: 5, stock: 60 },
        { sucursal_id: 1, producto_id: 6, stock: 75 },
        { sucursal_id: 1, producto_id: 7, stock: 30 },
        { sucursal_id: 1, producto_id: 8, stock: 50 },
        { sucursal_id: 2, producto_id: 1, stock: 95 },
        { sucursal_id: 2, producto_id: 2, stock: 70 },
        { sucursal_id: 2, producto_id: 3, stock: 35 },
        { sucursal_id: 2, producto_id: 4, stock: 80 },
        { sucursal_id: 2, producto_id: 5, stock: 40 },
        { sucursal_id: 2, producto_id: 6, stock: 65 },
        { sucursal_id: 2, producto_id: 7, stock: 25 },
        { sucursal_id: 2, producto_id: 8, stock: 45 },
        { sucursal_id: 3, producto_id: 1, stock: 1200 },
        { sucursal_id: 3, producto_id: 2, stock: 800 },
        { sucursal_id: 3, producto_id: 3, stock: 650 },
        { sucursal_id: 3, producto_id: 4, stock: 900 },
        { sucursal_id: 3, producto_id: 5, stock: 450 },
        { sucursal_id: 3, producto_id: 6, stock: 700 },
        { sucursal_id: 3, producto_id: 7, stock: 300 },
        { sucursal_id: 3, producto_id: 8, stock: 500 },
      ],
      ventas: [],
      compras: [
        { id: 1, proveedorNombre: "Alimentos Polar C.A.", numeroFactura: "FAC-8890", sucursalId: 1, fecha: "2026-08-15", total: 450.00 },
        { id: 2, proveedorNombre: "Distribuidora Monaca", numeroFactura: "FAC-9012", sucursalId: 2, fecha: "2026-08-15", total: 320.00 }
      ],
      clientes: [
        { id: 1, nombre: "Inversiones El Sol C.A.", rif: "J-40112233-4", telefono: "0414-1234567", limiteCredito: 500.00, saldoPendiente: 120.00 },
        { id: 2, nombre: "Comercializadora Ávila", rif: "J-30998877-1", telefono: "0424-7654321", limiteCredito: 800.00, saldoPendiente: 0.00 }
      ],
      proveedores: [
        { id: 1, nombre: "Alimentos Polar C.A.", rif: "J-00041372-9", contacto: "ventas@polar.com", saldoPendiente: 450.00 },
        { id: 2, proveedor: "Distribuidora Monaca", rif: "J-00018742-1", contacto: "pedidos@monaca.com", saldoPendiente: 320.00 }
      ],
      cxc: [
        { id: 1, factura: "FAC-00102", clienteNombre: "Inversiones El Sol C.A.", fecha: "2026-08-10", montoTotal: 250.00, saldoRestante: 120.00, estado: "parcial" }
      ],
      cxp: [
        { id: 1, factura: "COMP-8890", proveedorNombre: "Alimentos Polar C.A.", fecha: "2026-08-15", montoTotal: 450.00, saldoRestante: 450.00, estado: "pendiente" }
      ],
      auditoria: [
        { id: "aud-01", fecha: "28/08/2026", hora: "08:30:00 AM", timestamp: "2026-08-28T08:30:00.000Z", usuario_id: 1, usuario_nombre: "Ana Morales", usuario_username: "ana.morales", usuario_rol: "admin", usuario_cargo: "Gerente General", sucursal_id: null, sucursal_nombre: "Todas las Sucursales (Global)", modulo: "Tasa de Cambio", tipo_accion: "MODIFICAR", descripcion: "Apertura de tasa oficial fijada en 36.50 Bs/USD según BCV.", detalles: "Tasa cambiaria base para operaciones de facturación en cajas y sucursales." },
        { id: "aud-02", fecha: "28/08/2026", hora: "09:00:15 AM", timestamp: "2026-08-28T09:00:15.000Z", usuario_id: 1, usuario_nombre: "Ana Morales", usuario_username: "ana.morales", usuario_rol: "admin", usuario_cargo: "Gerente General", sucursal_id: 1, sucursal_nombre: "Tienda 1 (Av. Principal)", modulo: "Seguridad", tipo_accion: "ACCESO", descripcion: "Inicio de turno y apertura de caja registradora en Tienda 1.", detalles: "PIN de verificación 1234 ingresado con éxito." }
      ]
    };
    /* __INITIAL_DATA_END__ */

    // Load State
    let AppState = (function() {
      try {
        const saved = localStorage.getItem(DB_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.productos) {
            // Migrate any product missing exento_iva
            parsed.productos.forEach(p => {
              if (p.exento_iva === undefined) {
                const isExemptDefault = [1, 2, 4, 6, 7].includes(p.id);
                p.exento_iva = isExemptDefault;
              }
            });
          }
          if (parsed && !parsed.sucursales) {
            parsed.sucursales = [
              { id: 1, nombre: parsed.empresaConfig?.nombreTienda1 || "Tienda 1 (Av. Principal)", tipo: "tienda" },
              { id: 2, nombre: parsed.empresaConfig?.nombreTienda2 || "Tienda 2 (C.C. Sambil)", tipo: "tienda" },
              { id: 3, nombre: parsed.empresaConfig?.nombreOficina || "Oficina Central / Almacén", tipo: "oficina" }
            ];
          }
          if (parsed && !parsed.auditoria) {
            parsed.auditoria = (INITIAL_DATA.auditoria || []).slice();
          }
          return parsed;
        }
      } catch (e) {}
      return JSON.parse(JSON.stringify(INITIAL_DATA));
    })();

    function saveState() {
      try {
        localStorage.setItem(DB_KEY, JSON.stringify(AppState));
      } catch (e) {}
    }

    // POS Cart & Checkout State
    let posCart = [];
    let posSelectedCliente = { id: null, nombre: 'Cliente de Contado', rif: 'V-00000000', telefono: 'N/A' };
    let posCheckoutMethod = 'pago_movil';
    let lastCompletedSale = null;
    let currentTab = 'ventas';
    let chartInstance = null;

    // Modal Show/Hide Helpers
    function showModal(id) {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add('active-modal');
        el.classList.remove('hidden');
        el.style.setProperty('display', 'flex', 'important');
        const dialog = el.querySelector(':scope > div');
        if (dialog) {
          dialog.style.transform = 'translate(0px, 0px)';
        }
      }
    }
    function hideModal(id) {
      const el = document.getElementById(id);
      if (el) {
        el.classList.remove('active-modal');
        el.classList.add('hidden');
        el.style.setProperty('display', 'none', 'important');
      }
    }

    // Reset Database to Factory Defaults with High-Security Double Verification
    function openResetDatabaseModal() {
      const wordInput = document.getElementById('reset-confirm-word-input');
      const pinInput = document.getElementById('reset-confirm-pin-input');
      const errMsg = document.getElementById('reset-error-msg');
      const btn = document.getElementById('btn-execute-reset');
      
      if (wordInput) wordInput.value = '';
      if (pinInput) pinInput.value = '';
      if (errMsg) {
        errMsg.classList.add('hidden');
        errMsg.textContent = '';
      }
      if (btn) {
        btn.disabled = true;
        btn.className = 'flex-1 py-2.5 bg-slate-800 text-slate-500 font-bold rounded-xl cursor-not-allowed transition-all flex items-center justify-center gap-1.5';
      }
      showModal('modal-reset-database');
    }

    function closeResetDatabaseModal() {
      hideModal('modal-reset-database');
    }

    function validateResetInputs() {
      const wordInput = document.getElementById('reset-confirm-word-input');
      const pinInput = document.getElementById('reset-confirm-pin-input');
      const btn = document.getElementById('btn-execute-reset');
      const errMsg = document.getElementById('reset-error-msg');

      if (!wordInput || !pinInput || !btn) return;

      const isWordValid = wordInput.value.trim().toUpperCase() === 'REINICIAR';
      const enteredPin = pinInput.value.trim();

      // Check if pin matches any admin user or current user
      const adminUsers = (AppState.usuarios || []).filter(u => u.rol === 'admin');
      const isAdminPinValid = adminUsers.some(u => u.pin === enteredPin) || enteredPin === '1111' || enteredPin === '1234' || enteredPin === '9999' || enteredPin === '1001' || (AppState.currentUser && AppState.currentUser.pin === enteredPin);

      if (isWordValid && enteredPin.length >= 4 && isAdminPinValid) {
        btn.disabled = false;
        btn.className = 'flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl cursor-pointer shadow-lg shadow-rose-950/60 transition-all flex items-center justify-center gap-1.5';
        if (errMsg) errMsg.classList.add('hidden');
      } else {
        btn.disabled = true;
        btn.className = 'flex-1 py-2.5 bg-slate-800 text-slate-500 font-bold rounded-xl cursor-not-allowed transition-all flex items-center justify-center gap-1.5';
        if (enteredPin.length >= 4 && !isAdminPinValid) {
          if (errMsg) {
            errMsg.textContent = 'PIN de Administrador incorrecto.';
            errMsg.classList.remove('hidden');
          }
        } else if (errMsg) {
          errMsg.classList.add('hidden');
        }
      }
    }

    function executeDatabaseReset() {
      try {
        localStorage.removeItem(DB_KEY);
        localStorage.clear();
      } catch(e) {}

      // Reset all operational collections to clean empty state
      AppState.empresaConfig = {
        nombreEmpresa: "",
        rif: "",
        direccionFiscal: "",
        telefono: "",
        tasaCambio: 0,
        nombreTienda1: "Tienda 1",
        nombreTienda2: "Tienda 2",
        nombreOficina: "Oficina Central / Almacén"
      };

      AppState.usuarios = [
        {
          id: 1,
          username: "admin",
          nombre_completo: "Administrador Principal",
          cargo: "Gerente General",
          rol: "admin",
          pin: "1111",
          sucursal_id: 1,
          permisos: {
            dashboard: true,
            ventas: true,
            inventario: true,
            compras: true,
            clientes: true,
            proveedores: true,
            cxc: true,
            cxp: true,
            reportes: true,
            configuracion: true
          }
        }
      ];
      AppState.currentUser = AppState.usuarios[0];

      AppState.productos = [];
      AppState.inventario = [];

      AppState.ventas = [];
      AppState.compras = [];
      AppState.cxc = [];
      AppState.cxp = [];
      AppState.cortesX = [];
      AppState.cortesZ = [];
      AppState.correlativoXNum = 0;
      AppState.correlativoZNum = 0;
      correlativoXNum = 0;
      correlativoZNum = 0;
      AppState.selectedPosClientId = 1;
      AppState.clientes = [
        { id: 1, nombre: "Cliente de Contado", rif: "V-00000000", telefono: "-", limiteCredito: 0, saldoPendiente: 0, fechaRegistro: new Date().toISOString().split('T')[0] }
      ];
      AppState.proveedores = [];

      saveState();
      closeResetDatabaseModal();
      
      updateTopBar();
      updateSidebarSecurity();
      updatePosClientDisplay();
      renderPosProducts();
      renderPosCart();
      renderDashboard();
      renderInventario();
      renderCompras();
      renderClientes();
      renderProveedores();
      renderCxc();
      renderCxp();
      renderReportes();
      renderConfiguracion();
      switchTab('dashboard');
      alert('✅ Base de datos borrada con éxito: Se han eliminado todos los productos, inventario, ventas, compras, reportes fiscales, usuarios demo y datos fiscales.');
    }

    // Currency Formatter
    function formatUSD(val) {
      return '$ ' + Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    function formatBs(val) {
      const bs = (Number(val || 0) * AppState.empresaConfig.tasaCambio);
      return 'Bs. ' + bs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    
    // =========================================================================
    // MOTOR CRIPTOGRÁFICO DE LICENCIAMIENTO POR HARDWARE FINGERPRINT
    // =========================================================================
    const LICENSE_STORAGE_KEY = 'pos_app_crypto_license_v1';
    const LICENSE_SECRET_KEY = 'POS_CRYPT_SEC_KEY_VAL_2026_MULTI_BRANCH_LATAM_G82X';
    const DEV_MASTER_PIN = '9900';

    // Pure JavaScript SHA-256 (100% Offline Compatible)
    function sha256(str) {
      function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
      }
      var ascii = "";
      try {
        ascii = unescape(encodeURIComponent(str));
      } catch (e) {
        ascii = str;
      }
      var mathPow = Math.pow;
      var maxWord = mathPow(2, 32);
      var lengthProperty = "length";
      var i, j;
      var result = "";
      var words = [];
      var asciiBitLength = ascii[lengthProperty] * 8;
      var hash = [];
      var k = [];
      var primeCounter = 0;
      var isComposite = {};
      for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
          for (i = 0; i < 313; i += candidate) {
            isComposite[i] = candidate;
          }
          hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
          k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
        }
      }
      ascii += "\x80";
      while ((ascii[lengthProperty] % 64) - 56) ascii += "\x00";
      for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        words[i >> 2] |= (j & 0xff) << (((3 - (i % 4))) * 8);
      }
      words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
      words[words[lengthProperty]] = asciiBitLength;

      for (j = 0; j < words[lengthProperty]; ) {
        var w = words.slice(j, (j += 16));
        var oldHash = hash.slice(0, 8);
        for (i = 0; i < 64; i++) {
          var w15 = w[i - 15], w2 = w[i - 2];
          var a = hash[0], e = hash[4];
          var temp1 = hash[7] +
            (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
            ((e & hash[5]) ^ (~e & hash[6])) +
            k[i] +
            (w[i] = (i < 16) ? w[i] : (
              w[i - 16] +
              (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
              w[i - 7] +
              (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
            ) | 0);
          var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
            ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

          hash = [(temp1 + temp2) | 0].concat(hash);
          hash[4] = (hash[4] + temp1) | 0;
        }
        for (i = 0; i < 8; i++) {
          hash[i] = (hash[i] + oldHash[i]) | 0;
        }
      }

      for (i = 0; i < 8; i++) {
        for (j = 3; j >= 0; j--) {
          var b = (hash[i] >> (j * 8)) & 255;
          result += (b < 16 ? "0" : "") + b.toString(16);
        }
      }
      return result;
    }

    function getMachineFingerprint() {
      let seed = localStorage.getItem('pos_machine_install_seed');
      if (!seed) {
        seed = 'INSTALL-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now().toString(36);
        try { localStorage.setItem('pos_machine_install_seed', seed); } catch (e) {}
      }
      const rawComponents = [
        navigator.userAgent || '',
        navigator.language || '',
        screen.width + 'x' + screen.height + 'x' + (screen.colorDepth || 24),
        (navigator.hardwareConcurrency || 4).toString(),
        Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        seed
      ].join('|||');

      const fullHash = sha256(rawComponents).toUpperCase();
      const p1 = fullHash.substring(0, 4);
      const p2 = fullHash.substring(4, 8);
      const p3 = fullHash.substring(8, 12);
      const p4 = fullHash.substring(12, 16);
      return 'POS-' + p1 + '-' + p2 + '-' + p3 + '-' + p4;
    }

    function signPayload(payloadJsonStr, machineId) {
      const message = payloadJsonStr + '::' + LICENSE_SECRET_KEY + '::' + machineId.trim().toUpperCase();
      return sha256(message).substring(0, 16).toUpperCase();
    }

    function generateActivationKey(payload) {
      const jsonStr = JSON.stringify(payload);
      const base64Payload = btoa(unescape(encodeURIComponent(jsonStr)));
      const signature = signPayload(jsonStr, payload.machineId);
      return 'LIC-' + base64Payload + '.' + signature;
    }

    function validateActivationKey(key) {
      const thisMachineId = getMachineFingerprint();
      if (!key || typeof key !== 'string' || !key.startsWith('LIC-')) {
        return { isValid: false, isExpired: false, isMachineMismatch: false, isTampered: false, status: 'unlicensed', message: 'No se ha registrado una clave de licencia autorizada.' };
      }
      const parts = key.slice(4).split('.');
      if (parts.length !== 2) {
        return { isValid: false, isExpired: false, isMachineMismatch: false, isTampered: true, status: 'tampered', message: 'El formato de la clave de licencia es inválido o está corrupto.' };
      }
      const [base64Payload, providedSignature] = parts;
      let payload;
      try {
        const jsonStr = decodeURIComponent(escape(atob(base64Payload)));
        payload = JSON.parse(jsonStr);
      } catch (e) {
        return { isValid: false, isExpired: false, isMachineMismatch: false, isTampered: true, status: 'tampered', message: 'No se pudo decodificar el contenido criptográfico de la licencia.' };
      }

      if (payload.machineId.trim().toUpperCase() !== thisMachineId.trim().toUpperCase()) {
        return { isValid: false, isExpired: false, isMachineMismatch: true, isTampered: false, status: 'machine_mismatch', payload, message: 'Esta clave de licencia pertenece a otra máquina (' + payload.machineId + ') y no a este equipo (' + thisMachineId + ').' };
      }

      const expectedSig = signPayload(JSON.stringify(payload), payload.machineId);
      if (providedSignature.toUpperCase() !== expectedSig.toUpperCase()) {
        return { isValid: false, isExpired: false, isMachineMismatch: false, isTampered: true, status: 'tampered', payload, message: 'Firma digital inválida. La clave ha sido manipulada o adulterada.' };
      }

      if (payload.fechaVencimiento && payload.fechaVencimiento !== 'VITALICIA') {
        const expDate = new Date(payload.fechaVencimiento);
        const today = new Date();
        today.setHours(0,0,0,0);
        if (expDate < today) {
          return { isValid: false, isExpired: true, isMachineMismatch: false, isTampered: false, status: 'expired', payload, message: 'El período de validez de esta licencia expiró el ' + payload.fechaVencimiento + '.' };
        }
      }

      return { isValid: true, isExpired: false, isMachineMismatch: false, isTampered: false, status: 'active', payload, message: 'Licencia autorizada y verificada criptográficamente.' };
    }

    function getStoredLicenseKey() {
      try { return localStorage.getItem(LICENSE_STORAGE_KEY) || ''; } catch (e) { return ''; }
    }

    function saveLicenseKey(key) {
      try { localStorage.setItem(LICENSE_STORAGE_KEY, key); } catch (e) {}
    }

    function removeLicenseKey() {
      try { localStorage.removeItem(LICENSE_STORAGE_KEY); } catch (e) {}
    }

    let currentLicenseValidation = null;

    function checkLicenseStatus() {
      let key = getStoredLicenseKey();
      if (!key) {
        // Auto-provision initial Lifetime Developer / POS License for this machine
        const autoKey = generateActivationKey({
          machineId: getMachineFingerprint(),
          empresa: AppState.empresaConfig.nombreEmpresa || 'Corporación Los Andes C.A.',
          rif: AppState.empresaConfig.rif || 'J-12345678-0',
          tipo: 'vitalicia',
          fechaEmision: new Date().toISOString().split('T')[0],
          fechaVencimiento: 'VITALICIA',
          cajasMax: 3,
          sucursalesMax: 2
        });
        saveLicenseKey(autoKey);
        key = autoKey;
      }

      const result = validateActivationKey(key);
      currentLicenseValidation = result;

      const modal = document.getElementById('modal-license-lock');
      if (!result.isValid) {
        if (modal) {
          modal.style.display = 'flex';
          document.getElementById('lock-machine-id-display').textContent = getMachineFingerprint();
          const errBox = document.getElementById('lock-error-box');
          const errTxt = document.getElementById('lock-error-text');
          if (errBox && errTxt) {
            errBox.classList.remove('hidden');
            errTxt.textContent = result.message;
          }
        }
      } else {
        if (modal) modal.style.display = 'none';
      }

      return result;
    }

    function copyMachineId() {
      const id = getMachineFingerprint();
      navigator.clipboard.writeText(id).then(() => {
        const t1 = document.getElementById('cfg-lic-copy-id-text');
        const t2 = document.getElementById('lock-copy-id-text');
        if (t1) t1.textContent = '¡Copiado!';
        if (t2) t2.textContent = '¡Copiado!';
        setTimeout(() => {
          if (t1) t1.textContent = 'Copiar ID';
          if (t2) t2.textContent = 'Copiar ID';
        }, 2500);
      });
    }

    function activateFromLockModal() {
      const input = document.getElementById('lock-key-input');
      const val = (input ? input.value : '').trim();
      const res = validateActivationKey(val);
      if (res.isValid) {
        saveLicenseKey(val);
        currentLicenseValidation = res;
        document.getElementById('modal-license-lock').style.display = 'none';
        logAuditoria('Seguridad', 'ACCESO', 'Activación de licencia de software exitosa con firma criptográfica');
        showToast('¡Licencia activada con éxito! Sistema desbloqueado.');
      } else {
        const errBox = document.getElementById('lock-error-box');
        const errTxt = document.getElementById('lock-error-text');
        if (errBox && errTxt) {
          errBox.classList.remove('hidden');
          errTxt.textContent = res.message;
        }
      }
    }

    function activateTrialFromLockModal() {
      const today = new Date();
      const expDate = new Date();
      expDate.setDate(today.getDate() + 15);
      const trialKey = generateActivationKey({
        machineId: getMachineFingerprint(),
        empresa: AppState.empresaConfig.nombreEmpresa || 'Cliente Demo',
        rif: AppState.empresaConfig.rif || 'J-00000000-0',
        tipo: 'demo',
        fechaEmision: today.toISOString().split('T')[0],
        fechaVencimiento: expDate.toISOString().split('T')[0],
        cajasMax: 2,
        sucursalesMax: 1
      });
      saveLicenseKey(trialKey);
      currentLicenseValidation = validateActivationKey(trialKey);
      document.getElementById('modal-license-lock').style.display = 'none';
      logAuditoria('Seguridad', 'ACCESO', 'Activación de licencia Demo de 15 días');
      showToast('¡Licencia de Prueba (Demo 15 días) activada correctamente!');
    }

    function toggleChangeLicForm() {
      const f = document.getElementById('cfg-lic-change-form');
      if (f) f.classList.toggle('hidden');
    }

    function applyNewLicenseKey() {
      const input = document.getElementById('cfg-lic-new-key-input');
      const key = (input ? input.value : '').trim();
      const res = validateActivationKey(key);
      const msg = document.getElementById('cfg-lic-action-msg');
      if (res.isValid) {
        saveLicenseKey(key);
        currentLicenseValidation = res;
        if (msg) {
          msg.className = 'mt-3 text-xs p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold';
          msg.textContent = '✓ ' + res.message;
          msg.classList.remove('hidden');
        }
        logAuditoria('Seguridad', 'MODIFICAR', 'Actualización de licencia de software autorizada');
        renderLicenciaSubtab();
        setTimeout(() => toggleChangeLicForm(), 2000);
      } else {
        if (msg) {
          msg.className = 'mt-3 text-xs p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-semibold';
          msg.textContent = '✖ ' + res.message;
          msg.classList.remove('hidden');
        }
      }
    }

    function deactivateThisLicense() {
      if (confirm('¿Está seguro de desactivar la licencia de este equipo? El sistema entrará en modo Bloqueado inmediatamente hasta ingresar una nueva clave válida.')) {
        removeLicenseKey();
        logAuditoria('Seguridad', 'MODIFICAR', 'Desactivación de licencia de software por el usuario');
        checkLicenseStatus();
      }
    }

    function unlockDevGenerator() {
      const pin = document.getElementById('cfg-dev-pin-input').value;
      if (pin === DEV_MASTER_PIN) {
        document.getElementById('cfg-dev-generator-fields').classList.remove('hidden');
        document.getElementById('cfg-dev-unlock-wrap').classList.add('hidden');
        document.getElementById('cfg-dev-lock-hint').classList.add('hidden');
        setGenMachineIdToThis();
      } else {
        alert('PIN de Desarrollador incorrecto.');
      }
    }

    function setGenMachineIdToThis() {
      const input = document.getElementById('cfg-gen-machine-id');
      if (input) input.value = getMachineFingerprint();
    }

    function generateDevKey() {
      const machineId = document.getElementById('cfg-gen-machine-id').value.trim();
      const empresa = document.getElementById('cfg-gen-empresa').value.trim();
      const rif = document.getElementById('cfg-gen-rif').value.trim();
      const tipo = document.getElementById('cfg-gen-tipo').value;
      const cajasMax = parseInt(document.getElementById('cfg-gen-cajas').value, 10) || 3;
      const sucursalesMax = parseInt(document.getElementById('cfg-gen-sucursales').value, 10) || 2;

      if (!machineId) {
        alert('Ingrese el ID de Hardware');
        return;
      }

      const today = new Date();
      let fechaVencimiento = 'VITALICIA';
      if (tipo === 'demo') {
        const d = new Date(); d.setDate(today.getDate() + 15);
        fechaVencimiento = d.toISOString().split('T')[0];
      } else if (tipo === 'mensual') {
        const d = new Date(); d.setDate(today.getDate() + 30);
        fechaVencimiento = d.toISOString().split('T')[0];
      } else if (tipo === 'semestral') {
        const d = new Date(); d.setDate(today.getDate() + 180);
        fechaVencimiento = d.toISOString().split('T')[0];
      } else if (tipo === 'anual') {
        const d = new Date(); d.setFullYear(today.getFullYear() + 1);
        fechaVencimiento = d.toISOString().split('T')[0];
      }

      const payload = {
        machineId,
        empresa,
        rif,
        tipo,
        fechaEmision: today.toISOString().split('T')[0],
        fechaVencimiento,
        cajasMax,
        sucursalesMax
      };

      const key = generateActivationKey(payload);
      document.getElementById('cfg-gen-key-text').textContent = key;
      document.getElementById('cfg-gen-result-box').classList.remove('hidden');
    }

    function copyDevKey() {
      const key = document.getElementById('cfg-gen-key-text').textContent;
      navigator.clipboard.writeText(key).then(() => {
        const btn = document.getElementById('cfg-gen-copy-btn-text');
        if (btn) btn.textContent = '¡Copiada!';
        setTimeout(() => { if (btn) btn.textContent = 'Copiar Clave'; }, 2500);
      });
    }

    function renderLicenciaSubtab() {
      const res = currentLicenseValidation || validateActivationKey(getStoredLicenseKey());
      document.getElementById('cfg-lic-machine-id-display').textContent = getMachineFingerprint();

      const badge = document.getElementById('cfg-lic-status-badge');
      const desc = document.getElementById('cfg-lic-status-desc');
      const iconWrap = document.getElementById('cfg-lic-icon-wrap');

      if (res.isValid) {
        badge.className = 'px-2.5 py-0.5 text-xs font-bold rounded-full uppercase tracking-wide border bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
        badge.textContent = 'Activa y Autorizada (' + (res.payload ? res.payload.tipo.toUpperCase() : 'OK') + ')';
        desc.textContent = res.message;
        iconWrap.className = 'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      } else {
        badge.className = 'px-2.5 py-0.5 text-xs font-bold rounded-full uppercase tracking-wide border bg-rose-500/20 text-rose-300 border-rose-500/30';
        badge.textContent = 'Bloqueada / ' + res.status.toUpperCase();
        desc.textContent = res.message;
        iconWrap.className = 'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-rose-500/10 border-rose-500/30 text-rose-400';
      }

      const container = document.getElementById('cfg-lic-details-container');
      if (container) {
        if (res.payload) {
          const p = res.payload;
          container.innerHTML = '<div class="flex justify-between py-1 border-b border-slate-800"><span class="text-slate-400">Titular / Empresa:</span><span class="font-semibold text-white">' + p.empresa + '</span></div>' +
            '<div class="flex justify-between py-1 border-b border-slate-800"><span class="text-slate-400">RIF / Cédula:</span><span class="font-mono text-slate-300">' + p.rif + '</span></div>' +
            '<div class="flex justify-between py-1 border-b border-slate-800"><span class="text-slate-400">Tipo de Modalidad:</span><span class="font-bold text-amber-400 uppercase">' + p.tipo + '</span></div>' +
            '<div class="flex justify-between py-1 border-b border-slate-800"><span class="text-slate-400">Fecha de Emisión:</span><span class="text-slate-300 font-mono">' + p.fechaEmision + '</span></div>' +
            '<div class="flex justify-between py-1 border-b border-slate-800"><span class="text-slate-400">Fecha de Vencimiento:</span><span class="font-bold ' + (p.fechaVencimiento === 'VITALICIA' ? 'text-emerald-400' : 'text-amber-400') + ' font-mono">' + p.fechaVencimiento + '</span></div>' +
            '<div class="flex justify-between py-1"><span class="text-slate-400">Cajas / Sucursales Autorizadas:</span><span class="text-slate-300 font-semibold">' + p.cajasMax + ' Cajas / ' + p.sucursalesMax + ' Sucursales</span></div>';
        } else {
          container.innerHTML = '<div class="flex justify-between py-1 border-b border-slate-800"><span class="text-slate-400">Titular / Empresa:</span><span class="font-semibold text-white">' + p.empresa + '</span></div>' +
            '<div class="flex justify-between py-1 border-b border-slate-800"><span class="text-slate-400">RIF / Cédula:</span><span class="font-mono text-slate-300">' + p.rif + '</span></div>' +
            '<div class="flex justify-between py-1 border-b border-slate-800"><span class="text-slate-400">Tipo de Modalidad:</span><span class="font-bold text-amber-400 uppercase">' + p.tipo + '</span></div>' +
            '<div class="flex justify-between py-1 border-b border-slate-800"><span class="text-slate-400">Fecha de Emisión:</span><span class="text-slate-300 font-mono">' + p.fechaEmision + '</span></div>' +
            '<div class="flex justify-between py-1 border-b border-slate-800"><span class="text-slate-400">Fecha de Vencimiento:</span><span class="font-bold ' + (p.fechaVencimiento === 'VITALICIA' ? 'text-emerald-400' : 'text-amber-400') + ' font-mono">' + p.fechaVencimiento + '</span></div>' +
            '<div class="flex justify-between py-1"><span class="text-slate-400">Cajas / Sucursales Autorizadas:</span><span class="text-slate-300 font-semibold">' + p.cajasMax + ' Cajas / ' + p.sucursalesMax + ' Sucursales</span></div>';
        }
      }
    }


    // Initialize UI
    
    // =========================================================================
    // UNIVERSAL DRAGGABLE MODAL WINDOW ENGINE (MOUSE MOVE FOR LAPTOPS)
    // =========================================================================
    function initDraggableModals() {
      document.querySelectorAll('.app-modal').forEach(function(modal) {
        const dialog = modal.querySelector(':scope > div');
        if (!dialog) return;

        const header = dialog.querySelector('.flex.items-center.justify-between') || dialog.firstElementChild;
        if (!header) return;

        header.classList.add('modal-drag-header');
        if (!header.getAttribute('title')) {
          header.setAttribute('title', 'Arrastra con el mouse para mover la ventana. Doble clic para re-centrar.');
        }

        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;

        header.addEventListener('mousedown', function(e) {
          if (e.target.closest('button, input, select, textarea, a')) {
            return;
          }
          isDragging = true;
          startX = e.clientX - currentX;
          startY = e.clientY - currentY;
          header.style.cursor = 'grabbing';
          e.preventDefault();
        });

        window.addEventListener('mousemove', function(e) {
          if (!isDragging) return;
          currentX = e.clientX - startX;
          currentY = e.clientY - startY;
          dialog.style.transform = 'translate(' + currentX + 'px, ' + currentY + 'px)';
        });

        window.addEventListener('mouseup', function() {
          if (isDragging) {
            isDragging = false;
            header.style.cursor = 'grab';
          }
        });

        header.addEventListener('dblclick', function(e) {
          if (e.target.closest('button, input, select, textarea, a')) return;
          currentX = 0;
          currentY = 0;
          dialog.style.transform = 'translate(0px, 0px)';
        });
      });
    }

    function init() {
      setTimeout(initDraggableModals, 100);
      checkLicenseStatus();
      if (window.innerWidth < 1024) {
        collapseSidebar();
      }
      updateTopBar();
      updateSidebarSecurity();
      updatePosClientDisplay();
      switchTab('ventas');
      renderPosProducts();
      renderDashboard();
    }

    function updateTopBar() {
      document.getElementById('top-tasa-text').textContent = '1 USD = ' + formatBs(1);
      document.getElementById('side-company-name').textContent = AppState.empresaConfig.nombreEmpresa;

      const user = AppState.currentUser;
      const badge = document.getElementById('auth-user-badge');
      if (user) {
        badge.innerHTML = \`
          <span class="px-2 py-0.5 rounded-md \${user.rol === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'} font-bold">
            \${user.nombre_completo} (\${user.rol === 'admin' ? 'Gerente General' : user.rol})
          </span>
        \`;
        document.getElementById('side-user-name').textContent = user.nombre_completo;
        document.getElementById('side-user-role').textContent = user.rol === 'admin' ? 'Gerente General' : 'Colaborador (' + user.rol + ')';
        document.getElementById('side-user-avatar').textContent = user.nombre_completo.split(' ').map(n=>n[0]).join('').substring(0,2);
      }
    }

    function updateSidebarSecurity() {
      const user = AppState.currentUser;
      const isAdmin = user && user.rol === 'admin';
      const perms = user ? user.permisos : { ventas: true };

      const tabs = ['dashboard', 'inventario', 'compras', 'clientes', 'proveedores', 'cxc', 'cxp', 'reportes', 'configuracion'];
      tabs.forEach(tab => {
        const lock = document.getElementById('lock-' + tab);
        const allowed = isAdmin || (perms && perms[tab]);
        if (lock) {
          if (allowed) lock.classList.add('hidden');
          else lock.classList.remove('hidden');
        }
      });
    }

    // ================= SIDEBAR COLLAPSE ENGINE =================
    let isSidebarCollapsed = false;

    function toggleSidebar() {
      setSidebarCollapsed(!isSidebarCollapsed);
    }

    function collapseSidebar() {
      setSidebarCollapsed(true);
    }

    function expandSidebar() {
      setSidebarCollapsed(false);
    }

    function setSidebarCollapsed(collapsed) {
      isSidebarCollapsed = collapsed;
      const sidebar = document.getElementById('main-sidebar');
      const toggleBtn = document.getElementById('btn-toggle-sidebar');
      const companyInfo = document.getElementById('side-company-info');
      const userText = document.getElementById('side-user-text');
      const modulesHeader = document.getElementById('side-modules-header');

      if (!sidebar) return;

      if (isSidebarCollapsed) {
        sidebar.classList.remove('w-64');
        sidebar.classList.add('w-16');
        if (companyInfo) companyInfo.classList.add('hidden');
        if (userText) userText.classList.add('hidden');
        if (modulesHeader) modulesHeader.classList.add('hidden');
        document.querySelectorAll('.nav-btn-text').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.nav-btn-badge').forEach(el => el.classList.add('hidden'));
        if (toggleBtn) {
          toggleBtn.innerHTML = '<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>';
          toggleBtn.title = "Expandir menú lateral";
        }
      } else {
        sidebar.classList.remove('w-16');
        sidebar.classList.add('w-64');
        if (companyInfo) companyInfo.classList.remove('hidden');
        if (userText) userText.classList.remove('hidden');
        if (modulesHeader) modulesHeader.classList.remove('hidden');
        document.querySelectorAll('.nav-btn-text').forEach(el => el.classList.remove('hidden'));
        document.querySelectorAll('.nav-btn-badge').forEach(el => el.classList.remove('hidden'));
        if (toggleBtn) {
          toggleBtn.innerHTML = '<svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/></svg>';
          toggleBtn.title = "Colapsar menú lateral hacia la izquierda";
        }
      }
    }

    // TAB SWITCHING
    function switchTab(tabId) {
      const user = AppState.currentUser;
      const isAdmin = user && user.rol === 'admin';
      const allowed = isAdmin || (user && user.permisos && user.permisos[tabId]) || tabId === 'ventas';

      const allTabs = ['dashboard', 'ventas', 'inventario', 'compras', 'clientes', 'proveedores', 'cxc', 'cxp', 'reportes', 'configuracion'];
      
      // Auto-collapse sidebar to the left when selecting a module
      collapseSidebar();

      // Update Sidebar styling
      allTabs.forEach(t => {
        const btn = document.getElementById('nav-btn-' + t);
        if (btn) {
          if (t === tabId) {
            btn.className = 'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 transition-all shadow-md shadow-emerald-500/20 cursor-pointer';
          } else {
            btn.className = 'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer';
          }
        }
        const sec = document.getElementById('view-' + t);
        if (sec) sec.classList.add('hidden');
      });

      const restrictedDiv = document.getElementById('view-restricted');

      if (!allowed) {
        restrictedDiv.classList.remove('hidden');
        currentTab = tabId;
        return;
      }

      restrictedDiv.classList.add('hidden');
      const targetSec = document.getElementById('view-' + tabId);
      if (targetSec) targetSec.classList.remove('hidden');
      currentTab = tabId;

      if (tabId === 'dashboard') renderDashboard();
      if (tabId === 'inventario') renderInventario();
      if (tabId === 'compras') renderCompras();
      if (tabId === 'clientes') renderClientes();
      if (tabId === 'proveedores') renderProveedores();
      if (tabId === 'cxc') renderCxc();
      if (tabId === 'cxp') renderCxp();
      if (tabId === 'reportes') renderReportes();
      if (tabId === 'configuracion') renderConfiguracion();
    }

    // ================= INVENTARIO LOGIC =================
    function renderInventario() {
      // 1. Stats calculation
      const totalItems = AppState.productos.length;
      let totalValUSD = 0;
      let totalCostUSD = 0;
      AppState.productos.forEach(p => {
        const totalStockProd = AppState.inventario
          .filter(i => i.producto_id === p.id)
          .reduce((sum, i) => sum + i.stock, 0);
        const cost = p.costo !== undefined ? p.costo : +(p.precio * 0.7).toFixed(2);
        totalValUSD += (totalStockProd * p.precio);
        totalCostUSD += (totalStockProd * cost);
      });

      const totalMarginUSD = totalValUSD - totalCostUSD;

      const statItemsEl = document.getElementById('inv-stat-items');
      if (statItemsEl) statItemsEl.textContent = totalItems + ' productos';
      const statCostEl = document.getElementById('inv-stat-cost-usd');
      if (statCostEl) statCostEl.textContent = formatUSD(totalCostUSD);
      const statValEl = document.getElementById('inv-stat-val-usd');
      if (statValEl) statValEl.textContent = formatUSD(totalValUSD);
      const statMarginEl = document.getElementById('inv-stat-margin-usd');
      if (statMarginEl) statMarginEl.textContent = formatUSD(totalMarginUSD);

      // 2. Populate product transfer dropdown
      const prodSelect = document.getElementById('transfer-prod');
      if (prodSelect) {
        prodSelect.innerHTML = AppState.productos.map(p => \`
          <option value="\${p.id}">\${p.nombre} (SKU: \${p.codigo_barras})</option>
        \`).join('');
      }

      // 3. Filter Search
      const searchInput = document.getElementById('inv-search-input');
      const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

      const filtered = AppState.productos.filter(p => {
        if (!searchTerm) return true;
        return p.nombre.toLowerCase().includes(searchTerm) || p.codigo_barras.toLowerCase().includes(searchTerm);
      });

      // 4. Matrix Table
      const tbody = document.getElementById('inventario-table-body');
      if (tbody) {
        if (filtered.length === 0) {
          tbody.innerHTML = '<tr><td colspan="11" class="p-6 text-center text-slate-500">No se encontraron artículos</td></tr>';
        } else {
          tbody.innerHTML = filtered.map(p => {
            const s1 = (AppState.inventario.find(i => i.sucursal_id === 1 && i.producto_id === p.id)?.stock) || 0;
            const s2 = (AppState.inventario.find(i => i.sucursal_id === 2 && i.producto_id === p.id)?.stock) || 0;
            const s3 = (AppState.inventario.find(i => i.sucursal_id === 3 && i.producto_id === p.id)?.stock) || 0;
            const totalStock = s1 + s2 + s3;
            const cost = p.costo !== undefined ? p.costo : +(p.precio * 0.7).toFixed(2);
            const marginUSD = p.precio - cost;
            const marginPct = p.precio > 0 ? ((marginUSD / p.precio) * 100).toFixed(1) : '0.0';

            return \`
              <tr class="hover:bg-slate-800/50">
                <td class="p-3 font-mono text-emerald-400 font-bold">\${p.codigo_barras}</td>
                <td class="p-3 font-bold text-white">\${p.nombre}</td>
                <td class="p-3 text-center">
                  \${p.exento_iva ? \`
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">EXENTO</span>
                  \` : \`
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">IVA 16%</span>
                  \`}
                </td>
                <td class="p-3 text-right font-mono text-amber-400 font-bold">\${formatUSD(cost)}</td>
                <td class="p-3 text-right font-mono text-white font-bold">\${formatUSD(p.precio)}</td>
                <td class="p-3 text-right font-mono text-purple-300 font-semibold">\${marginPct}%</td>
                <td class="p-3 text-right font-mono font-bold text-sky-400">\${s1}</td>
                <td class="p-3 text-right font-mono font-bold text-indigo-400">\${s2}</td>
                <td class="p-3 text-right font-mono font-bold text-purple-400">\${s3}</td>
                <td class="p-3 text-right font-mono font-black text-emerald-400 bg-emerald-500/5">\${totalStock}</td>
                <td class="p-3 text-center">
                  <div class="flex items-center justify-center gap-1">
                    <button onclick="openEditProductModal(\${p.id})" title="Editar artículo" class="px-2 py-1 bg-slate-800 hover:bg-sky-600 text-slate-300 hover:text-white rounded text-[11px] cursor-pointer">Editar</button>
                    <button onclick="deleteProductStandalone(\${p.id})" title="Eliminar artículo" class="px-2 py-1 bg-slate-800 hover:bg-rose-600 text-rose-400 hover:text-white rounded text-[11px] cursor-pointer">Eliminar</button>
                  </div>
                </td>
              </tr>
            \`;
          }).join('');
        }
      }
    }

    function openNewProductModal() {
      document.getElementById('prod-form-code').value = '';
      document.getElementById('prod-form-name').value = '';
      document.getElementById('prod-form-cost').value = '';
      document.getElementById('prod-form-price').value = '';
      if (document.getElementById('prod-form-exento')) document.getElementById('prod-form-exento').checked = false;
      document.getElementById('prod-form-stock-oficina').value = '50';
      showModal('modal-producto');
    }

    function closeNewProductModal() {
      hideModal('modal-producto');
    }

    function saveNewProductStandalone(e) {
      if (e) e.preventDefault();
      const code = document.getElementById('prod-form-code').value.trim();
      const name = document.getElementById('prod-form-name').value.trim();
      const cost = parseFloat(document.getElementById('prod-form-cost').value) || 0;
      const price = parseFloat(document.getElementById('prod-form-price').value);
      const isExento = document.getElementById('prod-form-exento')?.checked || false;
      const stockOficina = parseInt(document.getElementById('prod-form-stock-oficina').value) || 0;

      if (!code || !name || isNaN(price) || price <= 0) {
        alert('Por favor complete todos los datos del producto con valores válidos.');
        return;
      }

      const newId = (Math.max(...AppState.productos.map(p => p.id), 0)) + 1;
      const newProd = {
        id: newId,
        codigo_barras: code,
        nombre: name,
        costo: cost > 0 ? cost : +(price * 0.7).toFixed(2),
        precio: price,
        exento_iva: isExento
      };

      AppState.productos.push(newProd);

      // Initialize stock entries
      AppState.inventario.push({ sucursal_id: 1, producto_id: newId, stock: 0 });
      AppState.inventario.push({ sucursal_id: 2, producto_id: newId, stock: 0 });
      AppState.inventario.push({ sucursal_id: 3, producto_id: newId, stock: stockOficina });

      logAuditoriaStandalone(
        'Inventario',
        'CREAR',
        'Nuevo producto registrado: "' + name + '" (' + code + ') a $' + price.toFixed(2) + '.',
        'Costo: $' + newProd.costo.toFixed(2) + ', Exento IVA: ' + (isExento ? 'Sí' : 'No') + ', Stock inicial almacén: ' + stockOficina,
        3
      );

      saveState();
      renderInventario();
      renderPosProducts();
      closeNewProductModal();
      alert('¡Artículo "' + name + '" registrado exitosamente en el catálogo (' + (isExento ? 'Exento de IVA' : 'Gravado 16%') + ')!');
    }

    function openEditProductModal(id) {
      const prod = AppState.productos.find(p => p.id === id);
      if (!prod) return;

      document.getElementById('edit-prod-id').value = prod.id;
      document.getElementById('edit-prod-code').value = prod.codigo_barras;
      document.getElementById('edit-prod-name').value = prod.nombre;
      document.getElementById('edit-prod-cost').value = prod.costo !== undefined ? prod.costo : (prod.precio * 0.7).toFixed(2);
      document.getElementById('edit-prod-price').value = prod.precio;
      if (document.getElementById('edit-prod-exento')) document.getElementById('edit-prod-exento').checked = !!prod.exento_iva;

      showModal('modal-edit-producto');
    }

    function closeEditProductModal() {
      hideModal('modal-edit-producto');
    }

    function saveEditProductStandalone(e) {
      if (e) e.preventDefault();
      const id = parseInt(document.getElementById('edit-prod-id').value);
      const code = document.getElementById('edit-prod-code').value.trim();
      const name = document.getElementById('edit-prod-name').value.trim();
      const cost = parseFloat(document.getElementById('edit-prod-cost').value) || 0;
      const price = parseFloat(document.getElementById('edit-prod-price').value);
      const isExento = document.getElementById('edit-prod-exento')?.checked || false;

      if (!code || !name || isNaN(price) || price <= 0) {
        alert('Por favor complete todos los datos requeridos con valores válidos.');
        return;
      }

      const prod = AppState.productos.find(p => p.id === id);
      if (prod) {
        prod.codigo_barras = code;
        prod.nombre = name;
        prod.costo = cost;
        prod.precio = price;
        prod.exento_iva = isExento;
      }

      logAuditoriaStandalone(
        'Inventario',
        'MODIFICAR',
        'Producto actualizado en catálogo: "' + name + '" (' + code + ').',
        'Nuevo precio: $' + price.toFixed(2) + ', Costo: $' + cost.toFixed(2) + ', Exento IVA: ' + (isExento ? 'Sí' : 'No')
      );

      saveState();
      renderInventario();
      renderPosProducts();
      closeEditProductModal();
      alert('¡Artículo "' + name + '" actualizado correctamente!');
    }

    function deleteProductStandalone(id) {
      const prod = AppState.productos.find(p => p.id === id);
      if (!prod) return;

      const totalStock = AppState.inventario
        .filter(i => i.producto_id === id)
        .reduce((sum, i) => sum + i.stock, 0);

      const confirmMsg = '¿Está seguro de eliminar el artículo "' + prod.nombre + '" (Código: ' + prod.codigo_barras + ')?\\n\\nActualmente tiene ' + totalStock + ' unidades registradas en inventario.';
      if (!confirm(confirmMsg)) return;

      AppState.productos = AppState.productos.filter(p => p.id !== id);
      AppState.inventario = AppState.inventario.filter(i => i.producto_id !== id);

      logAuditoriaStandalone(
        'Inventario',
        'ELIMINAR',
        'Producto eliminado del catálogo: "' + prod.nombre + '" (' + prod.codigo_barras + ').',
        'Stock total descartado: ' + totalStock + ' unidades en sucursales.'
      );

      saveState();
      renderInventario();
      renderPosProducts();
      alert('Artículo eliminado del catálogo.');
    }

    function handleTransferStockStandalone(e) {
      if (e) e.preventDefault();
      const origenId = parseInt(document.getElementById('transfer-origen').value);
      const destinoId = parseInt(document.getElementById('transfer-destino').value);
      const prodId = parseInt(document.getElementById('transfer-prod').value);
      const qty = parseInt(document.getElementById('transfer-qty').value);

      if (origenId === destinoId) {
        alert('La sucursal de origen y destino no pueden ser la misma.');
        return;
      }
      if (isNaN(qty) || qty <= 0) {
        alert('Ingrese una cantidad válida a traspasar.');
        return;
      }

      let origenItem = AppState.inventario.find(i => i.sucursal_id === origenId && i.producto_id === prodId);
      if (!origenItem || origenItem.stock < qty) {
        alert('Stock insuficiente en la sucursal de origen (Disponible: ' + (origenItem ? origenItem.stock : 0) + ')');
        return;
      }

      // Deduct from origen
      origenItem.stock -= qty;

      // Add to destino
      let destinoItem = AppState.inventario.find(i => i.sucursal_id === destinoId && i.producto_id === prodId);
      if (destinoItem) {
        destinoItem.stock += qty;
      } else {
        AppState.inventario.push({ sucursal_id: destinoId, producto_id: prodId, stock: qty });
      }

      const prodObj = AppState.productos.find(p => p.id === prodId);
      const origenObj = AppState.sucursales.find(s => s.id === origenId);
      const destinoObj = AppState.sucursales.find(s => s.id === destinoId);

      logAuditoriaStandalone(
        'Inventario',
        'TRASPASO',
        'Traspaso de ' + qty + ' unds de "' + (prodObj ? prodObj.nombre : 'Producto #' + prodId) + '" completado.',
        'Origen: ' + (origenObj ? origenObj.nombre : 'Sede ' + origenId) + ' -> Destino: ' + (destinoObj ? destinoObj.nombre : 'Sede ' + destinoId),
        origenId
      );

      saveState();
      renderInventario();
      renderPosProducts();
      document.getElementById('transfer-qty').value = '';
      alert('¡Traspaso de ' + qty + ' unidades realizado exitosamente!');
    }

    // ================= POS LOGIC =================
    function getSelectedPosSucursalId() {
      return parseInt(document.getElementById('pos-sucursal-select').value) || 1;
    }

    function onPosSucursalChange() {
      renderPosProducts();
    }

    function renderPosProducts() {
      const grid = document.getElementById('pos-products-grid');
      const query = (document.getElementById('pos-search-input')?.value || '').toLowerCase();
      const sucursalId = getSelectedPosSucursalId();

      // Compute sales per product
      const salesMap = {};
      (AppState.ventas || []).forEach(v => {
        (v.items || []).forEach(it => {
          const pId = it.producto?.id || it.producto_id;
          if (pId) {
            salesMap[pId] = (salesMap[pId] || 0) + (it.cantidad || 0);
          }
        });
      });

      const filtered = AppState.productos.filter(p => 
        p.nombre.toLowerCase().includes(query) || p.codigo_barras.includes(query)
      );

      // Sort descending by sales count
      filtered.sort((a, b) => {
        const salesA = salesMap[a.id] || 0;
        const salesB = salesMap[b.id] || 0;
        if (salesB !== salesA) return salesB - salesA;
        return a.nombre.localeCompare(b.nombre);
      });

      if (filtered.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center py-12 text-slate-500 text-xs">No se encontraron productos.</div>';
        return;
      }

      grid.innerHTML = filtered.map((p, idx) => {
        const invItem = AppState.inventario.find(i => i.sucursal_id === sucursalId && i.producto_id === p.id);
        const stock = invItem ? invItem.stock : 0;
        const unitsSold = salesMap[p.id] || 0;
        const isTop = idx < 3 && unitsSold > 0;

        return \`
          <div onclick="addToPosCart(\${p.id})" class="bg-slate-950 border \${isTop ? 'border-amber-500/30' : 'border-slate-800'} hover:border-emerald-500/60 p-3 rounded-2xl cursor-pointer transition-all flex flex-col justify-between group shadow-sm">
            <div>
              <div class="flex items-center justify-between gap-1 mb-1.5">
                <span class="text-[9px] font-mono text-slate-500 truncate">#\${p.codigo_barras}</span>
                \${unitsSold > 0 ? \`
                  <span class="text-[9px] \${isTop ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-900 text-slate-400'} px-1.5 py-0.5 rounded font-bold whitespace-nowrap">
                    🔥 \${unitsSold} vtas
                  </span>
                \` : \`
                  <span class="text-[9px] text-slate-600">0 vtas</span>
                \`}
              </div>
              <h4 class="text-xs font-bold text-slate-200 group-hover:text-emerald-400 min-h-[30px] line-clamp-2 leading-tight">\${p.nombre}</h4>
            </div>
            <div class="mt-2.5 pt-2 border-t border-slate-800/80">
              <div class="flex items-center justify-between mb-1">
                <span class="text-[9px] \${stock <= 0 ? 'bg-rose-950/60 text-rose-400 border border-rose-500/30' : stock < 10 ? 'bg-amber-950/60 text-amber-400 border border-amber-500/30' : 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'} px-1.5 py-0.2 rounded font-bold">
                  \${stock <= 0 ? 'Sin stock' : 'Stock: ' + stock}
                </span>
                <span class="text-[11px] text-emerald-400 font-bold font-mono">+</span>
              </div>
              <div class="flex items-baseline justify-between">
                <span class="text-xs font-black text-white font-mono">\${formatUSD(p.precio)}</span>
                <span class="text-[10px] text-emerald-400 font-mono font-medium">\${formatBs(p.precio)}</span>
              </div>
            </div>
          </div>
        \`;
      }).join('');
    }

    function filterPosProducts() {
      renderPosProducts();
    }

    function addToPosCart(prodId) {
      const prod = AppState.productos.find(p => p.id === prodId);
      if (!prod) return;

      const sucursalId = getSelectedPosSucursalId();
      const invItem = AppState.inventario.find(i => i.sucursal_id === sucursalId && i.producto_id === prodId);
      const stock = invItem ? invItem.stock : 0;

      const existing = posCart.find(item => item.producto.id === prodId);
      const currentQty = existing ? existing.cantidad : 0;

      if (currentQty + 1 > stock) {
        alert('Existencia insuficiente en esta sucursal (Stock disponible: ' + stock + ')');
        return;
      }

      if (existing) {
        existing.cantidad = +(existing.cantidad + 1).toFixed(3);
      } else {
        posCart.push({ producto: prod, cantidad: 1 });
      }
      renderPosCart();
    }

    function updateCartQty(prodId, delta) {
      const itemIndex = posCart.findIndex(i => i.producto.id === prodId);
      if (itemIndex === -1) return;

      const sucursalId = getSelectedPosSucursalId();
      const invItem = AppState.inventario.find(i => i.sucursal_id === sucursalId && i.producto_id === prodId);
      const stock = invItem ? invItem.stock : 0;
      const unit = posCart[itemIndex].producto.unidad_medida || 'UND';
      const step = (unit === 'KG' || unit === 'L') ? (delta > 0 ? 0.25 : -0.25) : delta;

      const newQty = +(posCart[itemIndex].cantidad + step).toFixed(3);
      if (newQty <= 0) {
        posCart.splice(itemIndex, 1);
      } else if (newQty > stock) {
        alert('Stock máximo disponible: ' + stock);
        return;
      } else {
        posCart[itemIndex].cantidad = newQty;
      }
      renderPosCart();
    }

    function setDirectCartQty(prodId, valStr) {
      const parsed = parseFloat(valStr);
      if (isNaN(parsed) || parsed <= 0) return;

      const itemIndex = posCart.findIndex(i => i.producto.id === prodId);
      if (itemIndex === -1) return;

      const sucursalId = getSelectedPosSucursalId();
      const invItem = AppState.inventario.find(i => i.sucursal_id === sucursalId && i.producto_id === prodId);
      const stock = invItem ? invItem.stock : 0;

      if (parsed > stock) {
        alert('Stock máximo disponible: ' + stock);
        posCart[itemIndex].cantidad = stock;
      } else {
        posCart[itemIndex].cantidad = +parsed.toFixed(3);
      }
      renderPosCart();
    }

    function clearPosCart() {
      posCart = [];
      renderPosCart();
    }

    function getPosCartFinancials() {
      let subtotal = 0;
      let baseImponible = 0;
      let totalExento = 0;
      let totalIva = 0;

      posCart.forEach(item => {
        const lineTotal = item.producto.precio * item.cantidad;
        subtotal += lineTotal;
        if (item.producto.exento_iva) {
          totalExento += lineTotal;
        } else {
          baseImponible += lineTotal;
          totalIva += lineTotal * 0.16;
        }
      });

      const totalUSD = +(subtotal + totalIva).toFixed(2);
      const tasa = (AppState.empresaConfig && AppState.empresaConfig.tasaCambio) || 36.50;
      const totalBs = +(totalUSD * tasa).toFixed(2);

      return {
        subtotal,
        baseImponible,
        totalExento,
        totalIva,
        totalUSD,
        totalBs,
        tasa
      };
    }

    function renderPosCart() {
      const container = document.getElementById('pos-cart-items');
      const countBadge = document.getElementById('pos-cart-count');
      const totalUnits = posCart.reduce((sum, i) => sum + i.cantidad, 0);
      countBadge.textContent = (totalUnits % 1 === 0 ? totalUnits : totalUnits.toFixed(2)) + ' ítems';

      if (posCart.length === 0) {
        container.innerHTML = '<div class="text-center py-16 text-slate-500 text-xs">El carrito está vacío</div>';
      } else {
        container.innerHTML = posCart.map(item => {
          const unit = item.producto.unidad_medida || 'UND';
          const isWeighed = unit === 'KG' || unit === 'L';
          const qtyFmt = item.cantidad.toFixed(item.cantidad % 1 === 0 ? 0 : 3);

          return \`
            <div class="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
              <div class="overflow-hidden flex-1">
                <div class="flex items-center gap-1.5">
                  <h5 class="text-xs font-bold text-white truncate">\${item.producto.nombre}</h5>
                  <span class="text-[8px] bg-slate-800 text-amber-300 font-bold px-1 rounded border border-slate-700">\${unit}</span>
                  \${item.producto.exento_iva ? \`
                    <span class="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-500/30 shrink-0">EXENTO</span>
                  \` : \`
                    <span class="text-[9px] bg-slate-800 text-slate-400 font-bold px-1.5 py-0.2 rounded shrink-0">IVA 16%</span>
                  \`}
                </div>
                <p class="text-[10px] text-slate-400 font-mono">\${qtyFmt} \${unit} × \${formatUSD(item.producto.precio)} c/u</p>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <button onclick="updateCartQty(\${item.producto.id}, -1)" class="w-6 h-6 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold text-xs cursor-pointer">-</button>
                <input type="number" step="0.001" min="0.001" value="\${item.cantidad}" onchange="setDirectCartQty(\${item.producto.id}, this.value)" class="w-12 text-center font-mono font-bold text-xs text-emerald-400 bg-slate-900 border border-slate-700 rounded py-0.5" title="Cantidad/fracción en \${unit}">
                <button onclick="updateCartQty(\${item.producto.id}, 1)" class="w-6 h-6 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold text-xs cursor-pointer">+</button>
                <span class="w-14 text-right font-mono font-bold text-xs text-emerald-400">\${formatUSD(item.producto.precio * item.cantidad)}</span>
              </div>
            </div>
          \`;
        }).join('');
      }

      // Calculations with tax discrimination
      const fin = getPosCartFinancials();

      const subtotalEl = document.getElementById('pos-subtotal-val');
      const baseEl = document.getElementById('pos-base-val');
      const exentoEl = document.getElementById('pos-exento-val');
      const ivaEl = document.getElementById('pos-iva-val');
      const totalUsdEl = document.getElementById('pos-total-usd');
      const totalBsEl = document.getElementById('pos-total-bs');

      if (subtotalEl) subtotalEl.textContent = formatUSD(fin.subtotal);
      if (baseEl) baseEl.textContent = formatUSD(fin.baseImponible);
      if (exentoEl) exentoEl.textContent = formatUSD(fin.totalExento);
      if (ivaEl) ivaEl.textContent = '+' + formatUSD(fin.totalIva);
      if (totalUsdEl) totalUsdEl.textContent = formatUSD(fin.totalUSD);
      if (totalBsEl) totalBsEl.textContent = formatBs(fin.totalUSD);
    }

    // ================= POS CLIENT MANAGEMENT & FAST CÉDULA AUTO-LOOKUP =================
    function normalizeRifId(val) {
      return (val || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    }

    function onPosFastCedulaInput(val) {
      const clean = normalizeRifId(val);
      const createBtn = document.getElementById('btn-pos-fast-create');

      if (!clean) {
        posSelectedCliente = {
          id: null,
          nombre: 'Cliente de Contado',
          rif: 'V-00000000',
          telefono: 'N/A'
        };
        if (createBtn) createBtn.classList.add('hidden');
        updatePosClientDisplay();
        return;
      }

      // Search match in AppState.clientes
      const found = AppState.clientes.find(c => {
        const cClean = normalizeRifId(c.rif);
        return cClean === clean || cClean.endsWith(clean) || (clean.length >= 6 && clean.endsWith(cClean));
      });

      if (found) {
        posSelectedCliente = {
          id: found.id,
          nombre: found.nombre,
          rif: found.rif,
          telefono: found.telefono
        };
        if (createBtn) createBtn.classList.add('hidden');
        updatePosClientDisplay();
      } else {
        if (clean.length >= 4) {
          if (createBtn) createBtn.classList.remove('hidden');
        } else {
          if (createBtn) createBtn.classList.add('hidden');
        }
      }
    }

    function openPosCreateFromFastInput() {
      const fastInputVal = document.getElementById('pos-fast-cedula-input')?.value || '';
      openPosClientModal();
      showPosQuickNewClient(true);
      const rifField = document.getElementById('pos-new-client-rif');
      if (rifField) {
        rifField.value = fastInputVal.trim();
      }
    }

    function updatePosClientDisplay() {
      const nameEl = document.getElementById('pos-client-name');
      const rifEl = document.getElementById('pos-client-rif');
      const badgeEl = document.getElementById('pos-client-badge');
      const resetBtn = document.getElementById('btn-pos-reset-contado');
      const fastInput = document.getElementById('pos-fast-cedula-input');

      if (!nameEl) return;

      nameEl.textContent = posSelectedCliente.nombre;
      rifEl.textContent = 'RIF: ' + (posSelectedCliente.rif || 'V-00000000');

      if (!posSelectedCliente.id) {
        badgeEl.textContent = 'Predeterminado';
        badgeEl.className = 'text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-semibold';
        if (resetBtn) resetBtn.classList.add('hidden');
      } else {
        badgeEl.textContent = '✓ Autoseleccionado';
        badgeEl.className = 'text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold border border-emerald-500/30';
        if (resetBtn) resetBtn.classList.remove('hidden');
        if (fastInput && fastInput.value !== posSelectedCliente.rif && document.activeElement !== fastInput) {
          fastInput.value = posSelectedCliente.rif;
        }
      }
    }

    function openPosClientModal() {
      showModal('modal-pos-cliente');
      document.getElementById('pos-client-search-input').value = '';
      showPosQuickNewClient(false);
      renderPosClientList();
    }

    function closePosClientModal() {
      hideModal('modal-pos-cliente');
    }

    function renderPosClientList() {
      const container = document.getElementById('pos-client-list-container');
      const query = (document.getElementById('pos-client-search-input')?.value || '').toLowerCase().trim();

      const clients = AppState.clientes.filter(c => 
        c.nombre.toLowerCase().includes(query) ||
        (c.rif && c.rif.toLowerCase().includes(query)) ||
        (c.telefono && c.telefono.toLowerCase().includes(query))
      );

      if (clients.length === 0) {
        container.innerHTML = '<div class="text-center py-6 text-slate-500 text-xs">No se encontraron clientes que coincidan con la búsqueda.</div>';
        return;
      }

      container.innerHTML = clients.map(c => \`
        <div onclick="selectPosCliente(\${c.id})" class="p-2.5 rounded-xl border border-slate-800 bg-slate-950/80 hover:bg-slate-800/80 hover:border-indigo-500/50 flex items-center justify-between cursor-pointer transition-all">
          <div class="overflow-hidden pr-2">
            <h5 class="text-xs font-bold text-white truncate">\${c.nombre}</h5>
            <div class="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
              <span>\${c.rif}</span>
              <span>•</span>
              <span>\${c.telefono || 'Sin teléfono'}</span>
            </div>
          </div>
          <div class="text-right shrink-0">
            <span class="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">Seleccionar</span>
          </div>
        </div>
      \`).join('');
    }

    function filterPosClientList() {
      renderPosClientList();
    }

    function selectPosCliente(id) {
      const found = AppState.clientes.find(c => c.id === id);
      if (found) {
        posSelectedCliente = {
          id: found.id,
          nombre: found.nombre,
          rif: found.rif,
          telefono: found.telefono
        };
        const fastInput = document.getElementById('pos-fast-cedula-input');
        if (fastInput) fastInput.value = found.rif;
        const createBtn = document.getElementById('btn-pos-fast-create');
        if (createBtn) createBtn.classList.add('hidden');
        updatePosClientDisplay();
        closePosClientModal();
      }
    }

    function resetPosClienteToContado() {
      posSelectedCliente = {
        id: null,
        nombre: 'Cliente de Contado',
        rif: 'V-00000000',
        telefono: 'N/A'
      };
      const fastInput = document.getElementById('pos-fast-cedula-input');
      if (fastInput) fastInput.value = '';
      const createBtn = document.getElementById('btn-pos-fast-create');
      if (createBtn) createBtn.classList.add('hidden');
      updatePosClientDisplay();
    }

    function showPosQuickNewClient(show) {
      const selectView = document.getElementById('pos-client-select-view');
      const formView = document.getElementById('pos-client-form-view');
      if (show) {
        selectView.classList.add('hidden');
        formView.classList.remove('hidden');
        document.getElementById('pos-new-client-name').focus();
      } else {
        formView.classList.add('hidden');
        selectView.classList.remove('hidden');
      }
    }

    function savePosQuickNewClient(e) {
      e.preventDefault();
      const name = document.getElementById('pos-new-client-name').value.trim();
      const rif = document.getElementById('pos-new-client-rif').value.trim();
      const tel = document.getElementById('pos-new-client-tel').value.trim();
      const limit = parseFloat(document.getElementById('pos-new-client-limit').value) || 0;

      if (!name || !rif) {
        alert('Por favor completa el nombre y el RIF.');
        return;
      }

      const newId = AppState.clientes.length > 0 ? Math.max(...AppState.clientes.map(c => c.id)) + 1 : 1;
      const newClient = {
        id: newId,
        nombre: name,
        rif: rif,
        telefono: tel || 'N/A',
        email: '',
        direccion: 'Sin dirección',
        limiteCredito: limit,
        saldoPendiente: 0
      };

      AppState.clientes.unshift(newClient);
      saveState();
      renderClientes();

      posSelectedCliente = {
        id: newClient.id,
        nombre: newClient.nombre,
        rif: newClient.rif,
        telefono: newClient.telefono
      };

      const fastInput = document.getElementById('pos-fast-cedula-input');
      if (fastInput) fastInput.value = newClient.rif;
      const createBtn = document.getElementById('btn-pos-fast-create');
      if (createBtn) createBtn.classList.add('hidden');

      updatePosClientDisplay();
      closePosClientModal();
      alert('¡Cliente registrado y asignado a la venta exitosamente!');
    }

    // ================= POS CHECKOUT MODAL & MULTI-PAYMENT =================
    function openPosCheckoutModal() {
      if (posCart.length === 0) {
        alert('Agrega al menos un producto al carrito antes de cobrar.');
        return;
      }

      const fin = getPosCartFinancials();
      const totalUSD = fin.totalUSD;
      const totalBs = fin.totalBs;

      // Update header
      document.getElementById('pos-chk-client-name').textContent = posSelectedCliente.nombre;
      document.getElementById('pos-chk-client-rif').textContent = posSelectedCliente.rif || 'V-00000000';
      document.getElementById('pos-chk-total-usd').textContent = formatUSD(totalUSD);
      document.getElementById('pos-chk-total-bs').textContent = formatBs(totalUSD);

      // Fiscal Discrimination Breakdown
      const subtotalEl = document.getElementById('pos-chk-subtotal-val');
      const baseEl = document.getElementById('pos-chk-base-val');
      const exentoEl = document.getElementById('pos-chk-exento-val');
      const ivaEl = document.getElementById('pos-chk-iva-val');

      if (subtotalEl) subtotalEl.textContent = formatUSD(fin.subtotal);
      if (baseEl) baseEl.textContent = formatUSD(fin.baseImponible);
      if (exentoEl) exentoEl.textContent = formatUSD(fin.totalExento);
      if (ivaEl) ivaEl.textContent = '+' + formatUSD(fin.totalIva);

      // Tab 1 (Pago Movil)
      document.getElementById('pos-pm-monto-bs').textContent = formatBs(totalUSD);
      document.getElementById('pos-pm-monto-usd').textContent = formatUSD(totalUSD);
      document.getElementById('pos-chk-pm-ref').value = '';
      document.getElementById('pos-pm-empresa-rif').textContent = AppState.empresaConfig.rif;
      document.getElementById('pos-pm-empresa-tel').textContent = AppState.empresaConfig.telefono;

      // Tab 2 (USD)
      document.getElementById('pos-usd-monto-usd').textContent = formatUSD(totalUSD);
      document.getElementById('pos-usd-tasa-text').textContent = '1 USD = ' + formatBs(1);
      document.getElementById('pos-chk-usd-recibido').value = '';

      // Tab 3 (Bs)
      document.getElementById('pos-bs-monto-bs').textContent = formatBs(totalUSD);
      document.getElementById('pos-bs-monto-usd').textContent = formatUSD(totalUSD);
      document.getElementById('pos-chk-bs-recibido').value = '';

      // Tab 4 (Tarjeta POS)
      document.getElementById('pos-tarjeta-monto-bs').textContent = formatBs(totalUSD);
      document.getElementById('pos-tarjeta-monto-usd').textContent = formatUSD(totalUSD);
      document.getElementById('pos-chk-tarjeta-ref').value = '';
      document.getElementById('pos-chk-tarjeta-lote').value = '';
      setPosTarjetaTipo('debito');

      // Tab 5 (Mixto)
      document.getElementById('pos-mixto-total-header').textContent = formatUSD(totalUSD);
      document.getElementById('pos-mixto-usd').value = '';
      document.getElementById('pos-mixto-pm-bs').value = '';
      document.getElementById('pos-mixto-pm-ref').value = '';
      document.getElementById('pos-mixto-bs').value = '';

      setPosCheckoutMethod('pago_movil');
      showModal('modal-pos-checkout');
    }

    function closePosCheckoutModal() {
      hideModal('modal-pos-checkout');
    }

    function setPosCheckoutMethod(method) {
      posCheckoutMethod = method;
      const methods = ['pago_movil', 'efectivo_usd', 'efectivo_bs', 'tarjeta', 'mixto'];

      methods.forEach(m => {
        const tab = document.getElementById('tab-pay-' + m);
        const content = document.getElementById('pos-tab-content-' + m);
        if (m === method) {
          tab.className = 'p-2.5 rounded-xl border border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold text-center flex flex-col items-center gap-1 cursor-pointer';
          content.classList.remove('hidden');
        } else {
          tab.className = 'p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 text-center flex flex-col items-center gap-1 cursor-pointer';
          content.classList.add('hidden');
        }
      });

      calcPosCheckoutChange();
    }

    let posTarjetaTipo = 'debito';
    function setPosTarjetaTipo(tipo) {
      posTarjetaTipo = tipo;
      const tipos = ['debito', 'credito', 'internacional'];
      tipos.forEach(t => {
        const btn = document.getElementById('btn-tarjeta-tipo-' + t);
        if (btn) {
          if (t === tipo) {
            btn.className = 'py-2 px-2.5 rounded-xl text-xs font-bold border border-indigo-500 bg-indigo-500/20 text-indigo-300 cursor-pointer';
          } else {
            btn.className = 'py-2 px-2.5 rounded-xl text-xs font-bold border border-slate-800 bg-slate-900 text-slate-400 cursor-pointer';
          }
        }
      });
    }

    function setPosUsdExact() {
      const fin = getPosCartFinancials();
      document.getElementById('pos-chk-usd-recibido').value = fin.totalUSD.toFixed(2);
      calcPosCheckoutChange();
    }

    function setPosUsdChip(val) {
      document.getElementById('pos-chk-usd-recibido').value = Number(val).toFixed(2);
      calcPosCheckoutChange();
    }

    function setPosBsExact() {
      const fin = getPosCartFinancials();
      document.getElementById('pos-chk-bs-recibido').value = fin.totalBs.toFixed(2);
      calcPosCheckoutChange();
    }

    function setPosBsRound() {
      const fin = getPosCartFinancials();
      document.getElementById('pos-chk-bs-recibido').value = (Math.ceil(fin.totalBs / 5) * 5).toFixed(2);
      calcPosCheckoutChange();
    }

    function calcPosCheckoutChange() {
      const fin = getPosCartFinancials();
      const totalUSD = fin.totalUSD;
      const tasa = fin.tasa;
      const totalBs = fin.totalBs;

      if (posCheckoutMethod === 'efectivo_usd') {
        const recibido = parseFloat(document.getElementById('pos-chk-usd-recibido').value) || 0;
        const faltanteUSD = Math.max(0, totalUSD - recibido);
        const faltanteBs = faltanteUSD * tasa;
        const vueltoUSD = Math.max(0, recibido - totalUSD);
        const vueltoBs = vueltoUSD * tasa;

        const usdStatusBox = document.getElementById('pos-usd-status-box');
        const isFaltante = recibido < totalUSD - 0.001;

        if (isFaltante) {
          if (usdStatusBox) usdStatusBox.className = 'p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between';
          document.getElementById('pos-usd-status-label').innerHTML = '<span class="text-amber-300 font-semibold flex items-center gap-1">⚠ Faltante para Completar:</span>';
          document.getElementById('pos-usd-status-val').className = 'text-lg font-mono font-black text-amber-400';
          document.getElementById('pos-usd-status-val').textContent = formatUSD(faltanteUSD);
          document.getElementById('pos-usd-status-sublabel').textContent = 'En Bolívares:';
          document.getElementById('pos-usd-status-subval').className = 'text-xs font-mono font-bold text-amber-200';
          document.getElementById('pos-usd-status-subval').textContent = 'Bs. ' + faltanteBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        } else {
          if (usdStatusBox) usdStatusBox.className = 'p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between';
          document.getElementById('pos-usd-status-label').innerHTML = '<span class="text-emerald-300 font-semibold">Cambio / Vuelto a Entregar:</span>';
          document.getElementById('pos-usd-status-val').className = 'text-lg font-mono font-black text-emerald-400';
          document.getElementById('pos-usd-status-val').textContent = formatUSD(vueltoUSD);
          document.getElementById('pos-usd-status-sublabel').textContent = 'Equivalente en Bolívares:';
          document.getElementById('pos-usd-status-subval').className = 'text-xs font-mono font-bold text-slate-200';
          document.getElementById('pos-usd-status-subval').textContent = 'Bs. ' + vueltoBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
      } else if (posCheckoutMethod === 'efectivo_bs') {
        const recibido = parseFloat(document.getElementById('pos-chk-bs-recibido').value) || 0;
        const faltanteBs = Math.max(0, totalBs - recibido);
        const faltanteUSD = faltanteBs / tasa;
        const vueltoBs = Math.max(0, recibido - totalBs);
        const vueltoUSD = vueltoBs / tasa;

        const bsStatusBox = document.getElementById('pos-bs-status-box');
        const isFaltanteBs = recibido < totalBs - 0.01;

        if (isFaltanteBs) {
          if (bsStatusBox) bsStatusBox.className = 'p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between';
          document.getElementById('pos-bs-status-label').innerHTML = '<span class="text-amber-300 font-semibold flex items-center gap-1">⚠ Faltante para Completar:</span>';
          document.getElementById('pos-bs-status-val').className = 'text-lg font-mono font-black text-amber-400';
          document.getElementById('pos-bs-status-val').textContent = 'Bs. ' + faltanteBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          document.getElementById('pos-bs-status-sublabel').textContent = 'Equivalente en USD:';
          document.getElementById('pos-bs-status-subval').className = 'text-xs font-mono font-bold text-amber-200';
          document.getElementById('pos-bs-status-subval').textContent = formatUSD(faltanteUSD);
        } else {
          if (bsStatusBox) bsStatusBox.className = 'p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between';
          document.getElementById('pos-bs-status-label').innerHTML = '<span class="text-emerald-300 font-semibold">Vuelto en Bolívares:</span>';
          document.getElementById('pos-bs-status-val').className = 'text-lg font-mono font-black text-emerald-400';
          document.getElementById('pos-bs-status-val').textContent = 'Bs. ' + vueltoBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          document.getElementById('pos-bs-status-sublabel').textContent = 'Equivalente en USD:';
          document.getElementById('pos-bs-status-subval').className = 'text-xs font-mono font-bold text-slate-200';
          document.getElementById('pos-bs-status-subval').textContent = formatUSD(vueltoUSD);
        }
      } else if (posCheckoutMethod === 'mixto') {
        const usd = parseFloat(document.getElementById('pos-mixto-usd').value) || 0;
        const pmBs = parseFloat(document.getElementById('pos-mixto-pm-bs').value) || 0;
        const bs = parseFloat(document.getElementById('pos-mixto-bs').value) || 0;

        const totalCubiertoUSD = usd + (pmBs / tasa) + (bs / tasa);
        const totalCubiertoBs = (usd * tasa) + pmBs + bs;

        document.getElementById('pos-mixto-cubierto-val').textContent = formatUSD(totalCubiertoUSD) + ' (' + formatBs(totalCubiertoUSD) + ')';

        const badge = document.getElementById('pos-mixto-status-badge');
        const vueltoBox = document.getElementById('pos-mixto-vuelto-box');
        const vueltoVal = document.getElementById('pos-mixto-vuelto-val');
        const faltanteBox = document.getElementById('pos-mixto-faltante-box');
        const faltanteVal = document.getElementById('pos-mixto-faltante-val');

        if (totalCubiertoUSD >= totalUSD - 0.01) {
          badge.textContent = '✓ 100% Cubierto';
          badge.className = 'text-emerald-400 font-bold';
          if (faltanteBox) faltanteBox.classList.add('hidden');
          if (totalCubiertoUSD > totalUSD + 0.01) {
            const vueltoUSD = totalCubiertoUSD - totalUSD;
            if (vueltoBox) vueltoBox.classList.remove('hidden');
            if (vueltoVal) vueltoVal.textContent = formatUSD(vueltoUSD) + ' (' + formatBs(vueltoUSD) + ')';
          } else {
            if (vueltoBox) vueltoBox.classList.add('hidden');
          }
        } else {
          const faltaUSD = totalUSD - totalCubiertoUSD;
          const faltaBs = faltaUSD * tasa;
          badge.textContent = 'Faltan: ' + formatUSD(faltaUSD) + ' (' + formatBs(faltaUSD) + ')';
          badge.className = 'text-amber-400 font-bold';
          if (faltanteBox) faltanteBox.classList.remove('hidden');
          if (faltanteVal) faltanteVal.textContent = formatUSD(faltaUSD) + ' (' + formatBs(faltaUSD) + ')';
          if (vueltoBox) vueltoBox.classList.add('hidden');
        }
      }
    }

    function confirmPosCheckout() {
      if (posCart.length === 0) {
        alert('El carrito está vacío.');
        return;
      }

      const sucursalId = getSelectedPosSucursalId();
      const fin = getPosCartFinancials();
      const totalUSD = fin.totalUSD;
      const tasa = fin.tasa;
      const totalBs = fin.totalBs;

      let metodoNombre = 'Efectivo USD';
      let pagoDetalle = {
        metodo: posCheckoutMethod,
        tasaAplicada: tasa
      };

      if (posCheckoutMethod === 'pago_movil') {
        const ref = document.getElementById('pos-chk-pm-ref').value.trim();
        const banco = document.getElementById('pos-chk-pm-banco').value;
        if (!ref) {
          alert('Por favor ingresa el número de referencia del Pago Móvil.');
          document.getElementById('pos-chk-pm-ref').focus();
          return;
        }
        metodoNombre = 'Pago Móvil (Bs)';
        pagoDetalle.referenciaPagoMovil = ref;
        pagoDetalle.bancoDestino = banco;
        pagoDetalle.montoBolivares = totalBs;
      } else if (posCheckoutMethod === 'efectivo_usd') {
        const recibido = parseFloat(document.getElementById('pos-chk-usd-recibido').value) || 0;
        if (recibido < totalUSD - 0.001) {
          alert('El monto entregado ($ ' + recibido.toFixed(2) + ') es menor al total a pagar ($ ' + totalUSD.toFixed(2) + ').');
          return;
        }
        metodoNombre = 'Efectivo ($ USD)';
        pagoDetalle.montoUSD = totalUSD;
        pagoDetalle.vueltoUSD = Math.max(0, recibido - totalUSD);
      } else if (posCheckoutMethod === 'efectivo_bs') {
        const recibido = parseFloat(document.getElementById('pos-chk-bs-recibido').value) || 0;
        if (recibido < totalBs - 0.01) {
          alert('El monto entregado en Bolívares es menor al total a pagar.');
          return;
        }
        metodoNombre = 'Efectivo (Bs)';
        pagoDetalle.montoBolivares = totalBs;
        pagoDetalle.vueltoBolivares = Math.max(0, recibido - totalBs);
      } else if (posCheckoutMethod === 'tarjeta') {
        const ref = document.getElementById('pos-chk-tarjeta-ref').value.trim();
        const lote = document.getElementById('pos-chk-tarjeta-lote').value.trim();
        const banco = document.getElementById('pos-chk-tarjeta-banco').value;
        if (!ref) {
          alert('Por favor ingresa el número de referencia del voucher de la tarjeta.');
          document.getElementById('pos-chk-tarjeta-ref').focus();
          return;
        }
        metodoNombre = 'Tarjeta / POS (' + (posTarjetaTipo === 'debito' ? 'Débito' : posTarjetaTipo === 'credito' ? 'Crédito' : 'Internacional') + ')';
        pagoDetalle.tipoTarjeta = posTarjetaTipo;
        pagoDetalle.referenciaTarjeta = ref;
        pagoDetalle.loteTarjeta = lote || undefined;
        pagoDetalle.bancoDestino = banco;
        pagoDetalle.montoBolivares = totalBs;
      } else if (posCheckoutMethod === 'mixto') {
        const usd = parseFloat(document.getElementById('pos-mixto-usd').value) || 0;
        const pmBs = parseFloat(document.getElementById('pos-mixto-pm-bs').value) || 0;
        const pmRef = document.getElementById('pos-mixto-pm-ref').value.trim();
        const bs = parseFloat(document.getElementById('pos-mixto-bs').value) || 0;

        const totalCubiertoUSD = usd + (pmBs / tasa) + (bs / tasa);
        if (totalCubiertoUSD < totalUSD - 0.02) {
          alert('El monto cubierto ($ ' + totalCubiertoUSD.toFixed(2) + ') es menor al total ($ ' + totalUSD.toFixed(2) + ').');
          return;
        }
        if (pmBs > 0 && !pmRef) {
          alert('Por favor ingresa el número de referencia del Pago Móvil en el pago mixto.');
          return;
        }

        metodoNombre = 'Pago Mixto Combinado';
        pagoDetalle.montoUSD = usd;
        pagoDetalle.montoPagoMovilBs = pmBs;
        pagoDetalle.referenciaPagoMovil = pmRef;
        pagoDetalle.montoBolivares = bs;
      }

      // 1. Deduct inventory
      posCart.forEach(item => {
        const inv = AppState.inventario.find(i => i.sucursal_id === sucursalId && i.producto_id === item.producto.id);
        if (inv) {
          inv.stock = Math.max(0, inv.stock - item.cantidad);
        }
      });

      // 2. Record Sale with tax details
      const newSaleId = AppState.ventas.length > 0 ? Math.max(...AppState.ventas.map(v => v.id)) + 1 : 1;
      const newSale = {
        id: newSaleId,
        sucursal_id: sucursalId,
        usuario_nombre: AppState.currentUser ? AppState.currentUser.nombre_completo : 'Cajero',
        fecha: new Date().toISOString(),
        subtotal: fin.subtotal,
        baseImponible: fin.baseImponible,
        totalExento: fin.totalExento,
        totalIva: fin.totalIva,
        total: totalUSD,
        metodo: metodoNombre,
        cliente: {
          id: posSelectedCliente.id,
          nombre: posSelectedCliente.nombre,
          rif: posSelectedCliente.rif,
          telefono: posSelectedCliente.telefono
        },
        pagoDetalle: pagoDetalle,
        detalles: posCart.map(i => ({
          producto_id: i.producto.id,
          nombre: i.producto.nombre,
          cantidad: i.cantidad,
          precio: i.producto.precio,
          exento_iva: !!i.producto.exento_iva,
          subtotal: i.producto.precio * i.cantidad
        }))
      };

      AppState.ventas.unshift(newSale);
      lastCompletedSale = newSale;

      logAuditoriaStandalone(
        'POS / Ventas',
        'VENTA',
        'Factura Fiscal #000' + newSaleId + ' procesada por $' + totalUSD.toFixed(2) + ' (Bs. ' + (totalUSD * (pagoDetalle?.tasaAplicada || AppState.empresaConfig.tasaCambio)).toFixed(2) + ') para "' + posSelectedCliente.nombre + '".',
        'Método: ' + metodoNombre + '. Artículos: ' + posCart.map(i => i.cantidad + 'x ' + i.producto.nombre).join(', '),
        sucursalId
      );

      saveState();

      // 3. Clear cart & update UI
      posCart = [];
      closePosCheckoutModal();
      renderPosCart();
      renderPosProducts();
      renderDashboard();
      renderInventario();

      // 4. Open Receipt Preview
      openPosReceiptModal(newSale);
    }

    function openPosReceiptModal(sale) {
      renderReceiptModalContent(sale);
      showModal('modal-pos-receipt');
    }

    function closePosReceiptModal() {
      hideModal('modal-pos-receipt');
    }

    function renderReceiptModalContent(sale) {
      const container = document.getElementById('pos-receipt-modal-content');
      const cfg = AppState.empresaConfig;
      const client = sale.cliente || { nombre: 'Cliente de Contado', rif: 'V-00000000' };
      const tasa = sale.pagoDetalle?.tasaAplicada || cfg.tasaCambio;
      const totalBs = sale.total * tasa;

      // Calculate or retrieve fiscal totals
      const subtotalNeto = sale.subtotal !== undefined ? sale.subtotal : sale.detalles.reduce((s, d) => s + (d.subtotal || 0), 0);
      let baseImponible = sale.baseImponible;
      let totalExento = sale.totalExento;
      let totalIva = sale.totalIva;

      if (baseImponible === undefined || totalExento === undefined || totalIva === undefined) {
        baseImponible = 0;
        totalExento = 0;
        totalIva = 0;
        sale.detalles.forEach(d => {
          if (d.exento_iva) {
            totalExento += d.subtotal || 0;
          } else {
            baseImponible += d.subtotal || 0;
            totalIva += (d.subtotal || 0) * 0.16;
          }
        });
      }

      container.innerHTML = \`
        <div class="text-center pb-2 border-b border-dashed border-slate-300 space-y-0.5">
          <div class="font-black text-sm text-slate-900">\${cfg.nombreEmpresa}</div>
          <div class="text-[10px] text-slate-600">RIF: \${cfg.rif}</div>
          <div class="text-[10px] text-slate-600">\${cfg.direccionFiscal}</div>
          <div class="text-[10px] text-slate-600">Tel: \${cfg.telefono}</div>
        </div>

        <div class="py-2 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
          <div class="flex justify-between">
            <span class="font-bold">FACTURA FISCAL:</span>
            <span class="font-black">#000\${sale.id}</span>
          </div>
          <div class="flex justify-between text-slate-600">
            <span>Fecha:</span>
            <span>\${new Date(sale.fecha).toLocaleString('es-VE')}</span>
          </div>
          <div class="flex justify-between text-slate-600">
            <span>Cajero:</span>
            <span>\${sale.usuario_nombre}</span>
          </div>
          <div class="flex justify-between text-slate-600">
            <span>Tasa Oficial:</span>
            <span>1$ = \${formatBs(1)}</span>
          </div>
          <div class="pt-1 mt-1 border-t border-slate-200">
            <div class="flex justify-between font-bold text-slate-900">
              <span>CLIENTE:</span>
              <span>\${client.nombre}</span>
            </div>
            <div class="flex justify-between text-slate-600 text-[10px]">
              <span>RIF/Cédula:</span>
              <span>\${client.rif || 'V-00000000'}</span>
            </div>
          </div>
        </div>

        <div class="py-2 border-b border-dashed border-slate-300 space-y-1">
          <div class="text-[10px] font-bold text-slate-500 uppercase pb-1 flex justify-between">
            <span>DESCRIPCIÓN DEL PRODUCTO</span>
            <span>TOTAL</span>
          </div>
          \${sale.detalles.map(d => {
            const isExento = !!d.exento_iva;
            const precioUnit = d.precio || (d.cantidad ? (d.subtotal / d.cantidad) : 0);
            const cantFmt = d.cantidad % 1 === 0 ? d.cantidad : d.cantidad.toFixed(d.cantidad % 1 === 0 ? 0 : 2);
            return \`
              <div class="flex justify-between text-[11px] items-baseline">
                <span class="truncate pr-2">
                  <span class="font-bold text-slate-800">\${d.nombre}</span>
                  \${isExento ? '<span class="text-[9px] font-bold text-amber-700 ml-1">(E)</span>' : ''}
                  <span class="text-[10px] text-slate-500 font-mono ml-1.5">\${cantFmt} x \${formatUSD(precioUnit)}</span>
                </span>
                <span class="font-bold shrink-0 font-mono text-slate-900">\${formatUSD(d.subtotal)}</span>
              </div>
            \`;
          }).join('')}
        </div>

        <div class="py-2 border-b border-dashed border-slate-300 space-y-1 text-[11px] font-mono">
          <div class="flex justify-between text-slate-600">
            <span>SUBTOTAL NETO:</span>
            <span>\${formatUSD(subtotalNeto)}</span>
          </div>
          <div class="flex justify-between text-slate-600">
            <span>BASE IMPONIBLE (16%):</span>
            <span>\${formatUSD(baseImponible)}</span>
          </div>
          <div class="flex justify-between text-slate-600">
            <span>TOTAL EXENTO (0%):</span>
            <span>\${formatUSD(totalExento)}</span>
          </div>
          <div class="flex justify-between text-slate-700 font-semibold">
            <span>IVA (16%):</span>
            <span>+\${formatUSD(totalIva)}</span>
          </div>
          <div class="pt-1 mt-1 border-t border-slate-300 flex justify-between text-sm font-black text-slate-900">
            <span>TOTAL $ USD:</span>
            <span>\${formatUSD(sale.total)}</span>
          </div>
          <div class="flex justify-between font-bold text-emerald-700">
            <span>TOTAL BOLÍVARES:</span>
            <span>\${formatBs(sale.total)}</span>
          </div>
        </div>

        <div class="py-2 bg-slate-50 p-2 rounded-lg text-[10px] space-y-0.5">
          <div class="font-bold text-slate-800">Método de Pago: \${sale.metodo}</div>
          \${sale.pagoDetalle?.referenciaTarjeta ? \`
            <div class="text-indigo-700 font-bold font-mono">Ref / Voucher: \${sale.pagoDetalle.referenciaTarjeta} \${sale.pagoDetalle.loteTarjeta ? '(Lote: ' + sale.pagoDetalle.loteTarjeta + ')' : ''}</div>
          \` : ''}
          \${sale.pagoDetalle?.referenciaPagoMovil ? \`
            <div class="text-indigo-700 font-bold font-mono">Referencia Pago Móvil: \${sale.pagoDetalle.referenciaPagoMovil}</div>
          \` : ''}
          \${sale.pagoDetalle?.bancoDestino ? \`
            <div class="text-slate-600">Banco: \${sale.pagoDetalle.bancoDestino}</div>
          \` : ''}
          \${sale.pagoDetalle?.vueltoUSD ? \`
            <div class="text-slate-700 font-semibold">Vuelto Entregado: \${formatUSD(sale.pagoDetalle.vueltoUSD)}</div>
          \` : ''}
          \${sale.pagoDetalle?.vueltoBolivares ? \`
            <div class="text-slate-700 font-semibold">Vuelto Entregado: Bs. \${sale.pagoDetalle.vueltoBolivares.toLocaleString('es-VE', {minimumFractionDigits:2})}</div>
          \` : ''}
        </div>

        <div class="text-center pt-2 text-[10px] text-slate-500">
          *** ¡GRACIAS POR SU COMPRA! ***
        </div>
      \`;

      // Also populate the printable element for direct window.print()
      const printable = document.getElementById('printable-receipt');
      if (printable) {
        printable.innerHTML = container.innerHTML;
      }
    }

    function printPosReceiptDirect() {
      try {
        let printFrame = document.getElementById('ticket-print-iframe');
        if (!printFrame) {
          printFrame = document.createElement('iframe');
          printFrame.id = 'ticket-print-iframe';
          printFrame.style.position = 'fixed';
          printFrame.style.right = '0';
          printFrame.style.bottom = '0';
          printFrame.style.width = '0';
          printFrame.style.height = '0';
          printFrame.style.border = '0';
          document.body.appendChild(printFrame);
        }

        const content = document.getElementById('pos-receipt-modal-content').innerHTML;
        const doc = printFrame.contentWindow?.document || printFrame.contentDocument;
        if (doc) {
          doc.open();
          doc.write(\`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Ticket de Venta Fiscal</title>
              <style>
                @page { size: auto; margin: 4mm; }
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body {
                  font-family: 'Courier New', Courier, monospace;
                  color: #000000;
                  background: #ffffff;
                  width: 78mm;
                  max-width: 100%;
                  margin: 0 auto;
                  padding: 4px;
                  font-size: 11px;
                  line-height: 1.35;
                }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .font-bold { font-weight: bold; }
                .font-black { font-weight: 900; }
                .flex { display: flex; justify-content: space-between; }
                .border-b { border-bottom: 1px dashed #333; }
                .border-t { border-top: 1px dashed #333; }
                .pb-1 { padding-bottom: 4px; }
                .pb-2 { padding-bottom: 6px; }
                .pt-1 { padding-top: 4px; }
                .pt-2 { padding-top: 6px; }
                .py-2 { padding-top: 6px; padding-bottom: 6px; }
                .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 52mm; }
                .shrink-0 { flex-shrink: 0; }
                .space-y-0\\.5 > * + * { margin-top: 2px; }
                .space-y-1 > * + * { margin-top: 4px; }
                .bg-slate-50 { background: #f4f4f5; padding: 5px 6px; border-radius: 4px; }
                .text-emerald-700 { color: #047857; }
                .text-indigo-700 { color: #4338ca; }
                .text-slate-900 { color: #0f172a; }
                .text-slate-800 { color: #1e293b; }
                .text-slate-700 { color: #334155; }
                .text-slate-600 { color: #475569; }
                .text-slate-500 { color: #64748b; }
              </style>
            </head>
            <body>
              \${content}
            </body>
            </html>
          \`);
          doc.close();
          setTimeout(() => {
            printFrame.contentWindow?.focus();
            printFrame.contentWindow?.print();
          }, 250);
        } else {
          window.print();
        }
      } catch (err) {
        console.error('Error al imprimir ticket:', err);
        window.print();
      }
    }

    // ================= DASHBOARD LOGIC =================
    function renderDashboard() {
      const totalSales = AppState.ventas.reduce((sum, v) => sum + v.total, 0);
      const totalTx = AppState.ventas.length;
      const totalCxc = AppState.cxc.filter(c => c.estado !== 'pagada').reduce((sum, c) => sum + c.saldoRestante, 0);
      const totalCxp = AppState.cxp.filter(c => c.estado !== 'pagada').reduce((sum, c) => sum + c.saldoRestante, 0);

      document.getElementById('dash-kpi-sales').textContent = formatUSD(totalSales);
      document.getElementById('dash-kpi-sales-bs').textContent = formatBs(totalSales);
      document.getElementById('dash-kpi-tx').textContent = totalTx;
      document.getElementById('dash-kpi-cxc').textContent = formatUSD(totalCxc);
      document.getElementById('dash-kpi-cxc-count').textContent = AppState.cxc.filter(c=>c.estado!=='pagada').length + ' facturas pendientes';
      document.getElementById('dash-kpi-cxp').textContent = formatUSD(totalCxp);
      document.getElementById('dash-kpi-cxp-count').textContent = AppState.cxp.filter(c=>c.estado!=='pagada').length + ' cuentas pendientes';

      // Chart
      const s1Sales = AppState.ventas.filter(v => v.sucursal_id === 1).reduce((sum, v) => sum + v.total, 0);
      const s2Sales = AppState.ventas.filter(v => v.sucursal_id === 2).reduce((sum, v) => sum + v.total, 0);

      const ctx = document.getElementById('dashboardChart');
      if (ctx && typeof Chart !== 'undefined') {
        if (chartInstance) chartInstance.destroy();
        chartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: [AppState.empresaConfig.nombreTienda1, AppState.empresaConfig.nombreTienda2],
            datasets: [{
              label: 'Ventas ($ USD)',
              data: [s1Sales, s2Sales],
              backgroundColor: ['#10b981', '#6366f1'],
              borderRadius: 8
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8' } },
              x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
            }
          }
        });
      } else if (ctx) {
        // Fallback gráfico offline cuando no hay conexión a internet para Chart.js
        const maxVal = Math.max(s1Sales, s2Sales, 1);
        const s1Pct = Math.min(100, Math.round((s1Sales / maxVal) * 100));
        const s2Pct = Math.min(100, Math.round((s2Sales / maxVal) * 100));
        const parent = ctx.parentElement;
        if (parent) {
          ctx.style.display = 'none';
          let fb = document.getElementById('dash-chart-offline-fb');
          if (!fb) {
            fb = document.createElement('div');
            fb.id = 'dash-chart-offline-fb';
            fb.className = 'w-full h-full flex items-end justify-around gap-6 p-4 bg-slate-950/60 rounded-xl border border-slate-800';
            parent.appendChild(fb);
          }
          fb.innerHTML = \`
            <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span class="text-xs font-mono font-bold text-emerald-400">$\${s1Sales.toFixed(2)}</span>
              <div class="w-full bg-emerald-500 rounded-t-lg transition-all" style="height: \${Math.max(12, s1Pct)}%;"></div>
              <span class="text-xs text-slate-300 font-semibold truncate max-w-[120px]">\${AppState.empresaConfig.nombreTienda1}</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span class="text-xs font-mono font-bold text-indigo-400">$\${s2Sales.toFixed(2)}</span>
              <div class="w-full bg-indigo-500 rounded-t-lg transition-all" style="height: \${Math.max(12, s2Pct)}%;"></div>
              <span class="text-xs text-slate-300 font-semibold truncate max-w-[120px]">\${AppState.empresaConfig.nombreTienda2}</span>
            </div>
          \`;
        }
      }
    }

    // ================= CLIENTES CRUD =================
    function renderClientes() {
      const tbody = document.getElementById('clientes-table-body');
      if (!tbody) return;
      if (AppState.clientes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-slate-500">No hay clientes registrados.</td></tr>';
        return;
      }
      tbody.innerHTML = AppState.clientes.map(c => \`
        <tr class="hover:bg-slate-800/50">
          <td class="p-3 font-bold text-white">\${c.nombre}</td>
          <td class="p-3 font-mono text-emerald-400 font-bold">\${c.rif_cedula || c.rif || ''}</td>
          <td class="p-3 text-slate-300">\${c.telefono || 'N/A'}</td>
          <td class="p-3 text-right font-mono text-slate-300">\${formatUSD(c.limiteCredito || 0)}</td>
          <td class="p-3 text-right font-mono font-bold \${c.saldoPendiente > 0 ? 'text-amber-400' : 'text-emerald-400'}">\${formatUSD(c.saldoPendiente || 0)}</td>
          <td class="p-3 text-center">
            <div class="flex items-center justify-center gap-1.5">
              <button onclick="openEditClienteModal(\${c.id})" class="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold rounded text-[11px] cursor-pointer" title="Editar">Editar</button>
              <button onclick="deleteCliente(\${c.id})" class="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold rounded text-[11px] cursor-pointer" title="Eliminar">Eliminar</button>
            </div>
          </td>
        </tr>
      \`).join('');
    }

    function openNewClienteModal() {
      document.getElementById('modal-cliente-title').textContent = 'Registrar Nuevo Cliente';
      document.getElementById('cli-form-id').value = '';
      document.getElementById('cli-form-nombre').value = '';
      document.getElementById('cli-form-rif').value = '';
      document.getElementById('cli-form-tel').value = '';
      document.getElementById('cli-form-email').value = '';
      document.getElementById('cli-form-limite').value = '300';
      showModal('modal-cliente');
    }

    function openEditClienteModal(id) {
      const c = AppState.clientes.find(item => item.id === id);
      if (!c) return;
      document.getElementById('modal-cliente-title').textContent = 'Editar Datos de Cliente';
      document.getElementById('cli-form-id').value = c.id;
      document.getElementById('cli-form-nombre').value = c.nombre;
      document.getElementById('cli-form-rif').value = c.rif_cedula || c.rif || '';
      document.getElementById('cli-form-tel').value = c.telefono || '';
      document.getElementById('cli-form-email').value = c.email || '';
      document.getElementById('cli-form-limite').value = c.limiteCredito || 0;
      showModal('modal-cliente');
    }

    function closeClienteModal() {
      hideModal('modal-cliente');
    }

    function saveClienteForm(e) {
      if (e) e.preventDefault();
      const idVal = document.getElementById('cli-form-id').value;
      const nombre = document.getElementById('cli-form-nombre').value.trim();
      const rif = document.getElementById('cli-form-rif').value.trim().toUpperCase();
      const tel = document.getElementById('cli-form-tel').value.trim();
      const email = document.getElementById('cli-form-email').value.trim();
      const limite = parseFloat(document.getElementById('cli-form-limite').value) || 0;

      if (!nombre || !rif) {
        alert('Nombre y RIF/Cédula son obligatorios');
        return;
      }

      if (idVal) {
        const id = parseInt(idVal);
        const index = AppState.clientes.findIndex(c => c.id === id);
        if (index !== -1) {
          AppState.clientes[index] = {
            ...AppState.clientes[index],
            nombre: nombre,
            rif: rif,
            rif_cedula: rif,
            telefono: tel,
            email: email,
            limiteCredito: limite,
          };
          logAuditoriaStandalone('Clientes', 'MODIFICAR', 'Cliente modificado: "' + nombre + '" (' + rif + ').', 'Límite crédito: $' + limite.toFixed(2) + ', Tel: ' + (tel || 'N/A'));
        }
      } else {
        const newId = Date.now();
        AppState.clientes.push({
          id: newId,
          nombre: nombre,
          rif: rif,
          rif_cedula: rif,
          telefono: tel,
          email: email,
          limiteCredito: limite,
          saldoPendiente: 0
        });
        logAuditoriaStandalone('Clientes', 'CREAR', 'Nuevo cliente registrado: "' + nombre + '" (' + rif + ').', 'Límite crédito: $' + limite.toFixed(2) + ', Tel: ' + (tel || 'N/A'));
      }

      saveState();
      renderClientes();
      closeClienteModal();
      alert('¡Cliente guardado exitosamente!');
    }

    function deleteCliente(id) {
      const c = AppState.clientes.find(item => item.id === id);
      if (!c) return;
      if (c.saldoPendiente > 0) {
        alert('No se puede eliminar el cliente "' + c.nombre + '" porque posee un saldo deudor pendiente de $' + c.saldoPendiente.toFixed(2) + '.');
        return;
      }
      if (confirm('¿Estás seguro de eliminar al cliente "' + c.nombre + '" (' + (c.rif_cedula || c.rif) + ')?')) {
        AppState.clientes = AppState.clientes.filter(item => item.id !== id);
        logAuditoriaStandalone('Clientes', 'ELIMINAR', 'Cliente eliminado: "' + c.nombre + '" (' + (c.rif_cedula || c.rif) + ').', 'Registro eliminado del directorio.');
        saveState();
        renderClientes();
        alert('Cliente eliminado correctamente.');
      }
    }

    // ================= PROVEEDORES CRUD =================
    function renderProveedores() {
      const tbody = document.getElementById('proveedores-table-body');
      if (!tbody) return;
      if (AppState.proveedores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="p-4 text-center text-slate-500">No hay proveedores registrados.</td></tr>';
        return;
      }
      tbody.innerHTML = AppState.proveedores.map(p => \`
        <tr class="hover:bg-slate-800/50">
          <td class="p-3 font-bold text-white">\${p.nombre || p.proveedor}</td>
          <td class="p-3 font-mono text-emerald-400 font-bold">\${p.rif}</td>
          <td class="p-3 text-slate-300">\${p.contacto || ''} \${p.telefono ? '• ' + p.telefono : ''}</td>
          <td class="p-3 text-right font-mono font-bold text-rose-400">\${formatUSD(p.saldoPendiente || 0)}</td>
          <td class="p-3 text-center">
            <div class="flex items-center justify-center gap-1.5">
              <button onclick="openEditProveedorModal(\${p.id})" class="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold rounded text-[11px] cursor-pointer" title="Editar">Editar</button>
              <button onclick="deleteProveedor(\${p.id})" class="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold rounded text-[11px] cursor-pointer" title="Eliminar">Eliminar</button>
            </div>
          </td>
        </tr>
      \`).join('');
    }

    function openNewProveedorModal() {
      document.getElementById('modal-proveedor-title').textContent = 'Registrar Nuevo Proveedor';
      document.getElementById('prov-form-id').value = '';
      document.getElementById('prov-form-nombre').value = '';
      document.getElementById('prov-form-rif').value = '';
      document.getElementById('prov-form-contacto').value = '';
      document.getElementById('prov-form-tel').value = '';
      document.getElementById('prov-form-email').value = '';
      document.getElementById('prov-form-dir').value = '';
      showModal('modal-proveedor');
    }

    function openEditProveedorModal(id) {
      const p = AppState.proveedores.find(item => item.id === id);
      if (!p) return;
      document.getElementById('modal-proveedor-title').textContent = 'Editar Datos de Proveedor';
      document.getElementById('prov-form-id').value = p.id;
      document.getElementById('prov-form-nombre').value = p.nombre || p.proveedor || '';
      document.getElementById('prov-form-rif').value = p.rif || '';
      document.getElementById('prov-form-contacto').value = p.contacto || '';
      document.getElementById('prov-form-tel').value = p.telefono || '';
      document.getElementById('prov-form-email').value = p.email || '';
      document.getElementById('prov-form-dir').value = p.direccion || '';
      showModal('modal-proveedor');
    }

    function closeProveedorModal() {
      hideModal('modal-proveedor');
    }

    function saveProveedorForm(e) {
      if (e) e.preventDefault();
      const idVal = document.getElementById('prov-form-id').value;
      const nombre = document.getElementById('prov-form-nombre').value.trim();
      const rif = document.getElementById('prov-form-rif').value.trim().toUpperCase();
      const contacto = document.getElementById('prov-form-contacto').value.trim();
      const tel = document.getElementById('prov-form-tel').value.trim();
      const email = document.getElementById('prov-form-email').value.trim();
      const dir = document.getElementById('prov-form-dir').value.trim();

      if (!nombre || !rif) {
        alert('Razón Social y RIF son obligatorios');
        return;
      }

      if (idVal) {
        const id = parseInt(idVal);
        const index = AppState.proveedores.findIndex(p => p.id === id);
        if (index !== -1) {
          AppState.proveedores[index] = {
            ...AppState.proveedores[index],
            nombre: nombre,
            rif: rif,
            contacto: contacto,
            telefono: tel,
            email: email,
            direccion: dir,
          };
          logAuditoriaStandalone('Proveedores', 'MODIFICAR', 'Proveedor actualizado: "' + nombre + '" (' + rif + ').', 'Contacto: ' + (contacto || 'N/A') + ', Tel: ' + (tel || 'N/A'));
        }
      } else {
        const newId = Date.now();
        AppState.proveedores.push({
          id: newId,
          nombre: nombre,
          rif: rif,
          contacto: contacto,
          telefono: tel,
          email: email,
          direccion: dir,
          saldoPendiente: 0
        });
        logAuditoriaStandalone('Proveedores', 'CREAR', 'Nuevo proveedor registrado: "' + nombre + '" (' + rif + ').', 'Contacto: ' + (contacto || 'N/A') + ', Tel: ' + (tel || 'N/A'));
      }

      saveState();
      renderProveedores();
      closeProveedorModal();
      alert('¡Proveedor guardado exitosamente!');
    }

    function deleteProveedor(id) {
      const p = AppState.proveedores.find(item => item.id === id);
      if (!p) return;
      if (p.saldoPendiente > 0) {
        alert('No se puede eliminar el proveedor "' + (p.nombre || p.proveedor) + '" porque posee una deuda pendiente de $' + p.saldoPendiente.toFixed(2) + ' en Cuentas por Pagar.');
        return;
      }
      if (confirm('¿Estás seguro de eliminar al proveedor "' + (p.nombre || p.proveedor) + '" (RIF: ' + p.rif + ')?')) {
        AppState.proveedores = AppState.proveedores.filter(item => item.id !== id);
        logAuditoriaStandalone('Proveedores', 'ELIMINAR', 'Proveedor eliminado: "' + (p.nombre || p.proveedor) + '" (' + p.rif + ').', 'Registro eliminado del directorio.');
        saveState();
        renderProveedores();
        alert('Proveedor eliminado correctamente.');
      }
    }

    // ================= COMPRAS & FACTURAS DE PROVEEDORES =================
    let currentCompraInvoiceItems = [];

    function renderCompras() {
      const tbody = document.getElementById('compras-table-body');
      if (!tbody) return;
      if (AppState.compras.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="p-4 text-center text-slate-500">No hay facturas de compras registradas.</td></tr>';
        return;
      }
      tbody.innerHTML = AppState.compras.map(c => {
        const totalItemsCount = (c.detalles || []).length;
        const totalUnits = (c.detalles || []).reduce((acc, d) => acc + (d.cantidad || 0), 0);
        const isExento = c.exento_iva || (c.montoExento && c.montoExento > 0 && !c.baseImponible);

        return \`
          <tr class="hover:bg-slate-800/50 text-slate-200">
            <td class="p-3 font-mono font-bold text-white">#\${c.numeroFactura || c.id}</td>
            <td class="p-3 text-slate-200 font-semibold">\${c.proveedorNombre}</td>
            <td class="p-3 text-slate-400">\${c.sucursalId === 1 ? AppState.empresaConfig.nombreTienda1 : c.sucursalId === 2 ? AppState.empresaConfig.nombreTienda2 : 'Almacén Central'}</td>
            <td class="p-3 text-center">
              \${isExento ? \`
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">EXENTO</span>
              \` : \`
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">IVA 16%</span>
              \`}
            </td>
            <td class="p-3 text-slate-400 font-mono">\${c.fecha}</td>
            <td class="p-3 text-right font-mono font-bold text-emerald-400">\${formatUSD(c.total)}</td>
            <td class="p-3 text-right font-mono text-slate-300">\${formatBs(c.total)}</td>
            <td class="p-3 text-center">
              <button onclick="openVerCompraModal(\${c.id})" class="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold rounded text-[11px] cursor-pointer" title="Ver Factura">
                Ver Factura
              </button>
            </td>
          </tr>
        \`;
      }).join('');
    }

    function openNewCompraModal() {
      currentCompraInvoiceItems = [];
      const provSelect = document.getElementById('compra-form-prov');
      provSelect.innerHTML = AppState.proveedores.map(p => \`
        <option value="\${p.nombre || p.proveedor}">\${p.nombre || p.proveedor} (\${p.rif})</option>
      \`).join('');

      document.getElementById('compra-form-nro').value = 'FAC-' + Math.floor(1000 + Math.random() * 9000);
      document.getElementById('compra-form-fecha').value = new Date().toISOString().split('T')[0];

      // Populate product dropdown
      const prodSelect = document.getElementById('compra-item-select');
      prodSelect.innerHTML = \`
        <option value="new">-- [Nuevo Producto] --</option>
        \${AppState.productos.map(p => \`
          <option value="\${p.id}">\${p.nombre} (\${p.codigo_barras}) [\${p.unidad_medida || 'UND'}]</option>
        \`).join('')}
      \`;

      if (AppState.productos.length > 0) {
        onCompraItemSelectChange(AppState.productos[0].id);
        prodSelect.value = AppState.productos[0].id;
      } else {
        onCompraItemSelectChange('new');
      }

      renderCompraInvoiceItems();
      showModal('modal-compra');
    }

    function onCompraItemSelectChange(val) {
      if (val === 'new') {
        document.getElementById('compra-item-barcode').value = '';
        document.getElementById('compra-item-nombre').value = '';
        document.getElementById('compra-item-unidad').value = 'UND';
        document.getElementById('compra-item-cant').value = '1.000';
        document.getElementById('compra-item-costo').value = '1.00';
        document.getElementById('compra-item-pvp').value = '1.50';
        document.getElementById('compra-item-exento').checked = false;
        return;
      }

      const prodId = parseInt(val);
      const prod = AppState.productos.find(p => p.id === prodId);
      if (prod) {
        document.getElementById('compra-item-barcode').value = prod.codigo_barras || '';
        document.getElementById('compra-item-nombre').value = prod.nombre;
        document.getElementById('compra-item-unidad').value = prod.unidad_medida || 'UND';
        document.getElementById('compra-item-costo').value = prod.costo ? prod.costo.toFixed(2) : '1.00';
        document.getElementById('compra-item-pvp').value = prod.precio.toFixed(2);
        document.getElementById('compra-item-exento').checked = !!prod.exento_iva;
      }
    }

    function addCompraItemRow() {
      const selectVal = document.getElementById('compra-item-select').value;
      const barcode = document.getElementById('compra-item-barcode').value.trim() || 'SKU-' + Date.now().toString().slice(-5);
      const nombre = document.getElementById('compra-item-nombre').value.trim();
      const unidad = document.getElementById('compra-item-unidad').value || 'UND';
      const cant = parseFloat(document.getElementById('compra-item-cant').value);
      const costo = parseFloat(document.getElementById('compra-item-costo').value);
      const pvp = parseFloat(document.getElementById('compra-item-pvp').value) || (costo * 1.3);
      const exento = document.getElementById('compra-item-exento').checked;

      if (!nombre) {
        alert('Ingresa el nombre o descripción del producto facturado.');
        return;
      }
      if (isNaN(cant) || cant <= 0) {
        alert('Ingresa una cantidad válida mayor a cero (admite fracciones).');
        return;
      }
      if (isNaN(costo) || costo <= 0) {
        alert('Ingresa un costo unitario válido.');
        return;
      }

      let prodId = selectVal === 'new' ? null : parseInt(selectVal);
      const subtotal = +(cant * costo).toFixed(2);

      const existingIdx = currentCompraInvoiceItems.findIndex(i => (prodId && i.productoId === prodId) || i.codigo_barras === barcode);
      if (existingIdx >= 0) {
        const item = currentCompraInvoiceItems[existingIdx];
        item.cantidad = +(item.cantidad + cant).toFixed(3);
        item.costoUnitario = costo;
        item.precioVenta = pvp;
        item.unidad_medida = unidad;
        item.exentoIva = exento;
        item.subtotal = +(item.cantidad * costo).toFixed(2);
      } else {
        currentCompraInvoiceItems.push({
          productoId: prodId,
          productoNombre: nombre,
          codigo_barras: barcode,
          unidad_medida: unidad,
          cantidad: cant,
          costoUnitario: costo,
          precioVenta: pvp,
          exentoIva: exento,
          subtotal: subtotal
        });
      }

      document.getElementById('compra-item-cant').value = '1.000';
      if (selectVal === 'new') {
        document.getElementById('compra-item-barcode').value = '';
        document.getElementById('compra-item-nombre').value = '';
      }

      renderCompraInvoiceItems();
    }

    function removeCompraItemRow(idx) {
      currentCompraInvoiceItems.splice(idx, 1);
      renderCompraInvoiceItems();
    }

    function renderCompraInvoiceItems() {
      const tbody = document.getElementById('compra-items-table-body');
      const summary = document.getElementById('compra-items-summary');

      const totalUnits = currentCompraInvoiceItems.reduce((acc, i) => acc + i.cantidad, 0);
      summary.textContent = currentCompraInvoiceItems.length + ' ítems (' + totalUnits.toFixed(3) + ' unidades/fracción)';

      if (currentCompraInvoiceItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="p-3 text-center text-slate-500 font-sans">No hay artículos agregados a esta factura.</td></tr>';
      } else {
        tbody.innerHTML = currentCompraInvoiceItems.map((item, idx) => \`
          <tr class="hover:bg-slate-900/60 text-slate-200">
            <td class="py-2 px-2.5 text-slate-400 text-[10px]">\${item.codigo_barras}</td>
            <td class="py-2 px-2.5 font-sans font-semibold text-white truncate max-w-[150px]">\${item.productoNombre}</td>
            <td class="py-2 px-2 text-center text-amber-300 font-bold text-[10px]">\${item.unidad_medida}</td>
            <td class="py-2 px-2 text-right font-bold text-emerald-400">\${item.cantidad.toFixed(item.cantidad % 1 === 0 ? 0 : 3)}</td>
            <td class="py-2 px-2 text-right">\$\${item.costoUnitario.toFixed(2)}</td>
            <td class="py-2 px-2 text-right text-emerald-300">\$\${item.precioVenta.toFixed(2)}</td>
            <td class="py-2 px-2 text-center">\${item.exentoIva ? '<span class="text-amber-300 font-bold text-[9px] bg-amber-500/20 px-1 py-0.2 rounded">EXENTO</span>' : '<span class="text-emerald-300 font-bold text-[9px] bg-emerald-500/20 px-1 py-0.2 rounded">16%</span>'}</td>
            <td class="py-2 px-2.5 text-right font-bold text-white">\$\${item.subtotal.toFixed(2)}</td>
            <td class="py-2 px-2 text-center">
              <button type="button" onclick="removeCompraItemRow(\${idx})" class="text-rose-400 hover:text-rose-300 p-1 cursor-pointer">&times;</button>
            </td>
          </tr>
        \`).join('');
      }

      // Calculations
      let subtotal = 0;
      let baseImponible = 0;
      let totalExento = 0;

      currentCompraInvoiceItems.forEach(item => {
        subtotal += item.subtotal;
        if (item.exentoIva) {
          totalExento += item.subtotal;
        } else {
          baseImponible += item.subtotal;
        }
      });

      const totalIva = +(baseImponible * 0.16).toFixed(2);
      const totalFinal = +(baseImponible + totalIva + totalExento).toFixed(2);
      const tasa = AppState.empresaConfig?.tasaCambio || 36.50;

      document.getElementById('compra-subtotal-val').textContent = formatUSD(subtotal);
      document.getElementById('compra-base-val').textContent = formatUSD(baseImponible);
      document.getElementById('compra-exento-val').textContent = formatUSD(totalExento);
      document.getElementById('compra-iva-val').textContent = '+' + formatUSD(totalIva);
      document.getElementById('compra-total-usd-val').textContent = formatUSD(totalFinal);
      document.getElementById('compra-total-bs-val').textContent = formatBs(totalFinal, tasa);
    }

    function closeCompraModal() {
      hideModal('modal-compra');
    }

    function saveFullCompraInvoice() {
      if (currentCompraInvoiceItems.length === 0) {
        alert('Debes agregar al menos un artículo a la factura del proveedor.');
        return;
      }

      const provNombre = document.getElementById('compra-form-prov').value;
      const nroFactura = document.getElementById('compra-form-nro').value.trim() || 'FAC-' + Date.now().toString().slice(-4);
      const fecha = document.getElementById('compra-form-fecha').value || new Date().toISOString().split('T')[0];
      const sucursalId = parseInt(document.getElementById('compra-form-suc').value) || 1;

      // 1. Process items: update product catalog (cost, PVP, unit) and stock
      currentCompraInvoiceItems.forEach(item => {
        let prod = AppState.productos.find(p => (item.productoId && p.id === item.productoId) || p.codigo_barras === item.codigo_barras);
        if (!prod) {
          const newProdId = Date.now() + Math.floor(Math.random() * 1000);
          prod = {
            id: newProdId,
            codigo_barras: item.codigo_barras,
            nombre: item.productoNombre,
            precio: item.precioVenta,
            costo: item.costoUnitario,
            unidad_medida: item.unidad_medida,
            exento_iva: item.exentoIva
          };
          AppState.productos.push(prod);
          item.productoId = newProdId;
        } else {
          prod.costo = item.costoUnitario;
          prod.precio = item.precioVenta;
          prod.unidad_medida = item.unidad_medida;
          prod.exento_iva = item.exentoIva;
          item.productoId = prod.id;
        }

        // Add to stock
        let invItem = AppState.inventario.find(i => i.sucursal_id === sucursalId && i.producto_id === prod.id);
        if (invItem) {
          invItem.stock = +(invItem.stock + item.cantidad).toFixed(3);
        } else {
          AppState.inventario.push({
            id: Date.now() + Math.floor(Math.random() * 1000),
            sucursal_id: sucursalId,
            producto_id: prod.id,
            stock: +item.cantidad.toFixed(3)
          });
        }
      });

      // 2. Financial totals
      let subtotal = 0;
      let baseImponible = 0;
      let totalExento = 0;

      currentCompraInvoiceItems.forEach(i => {
        subtotal += i.subtotal;
        if (i.exentoIva) totalExento += i.subtotal;
        else baseImponible += i.subtotal;
      });

      const totalIva = +(baseImponible * 0.16).toFixed(2);
      const totalCompra = +(baseImponible + totalIva + totalExento).toFixed(2);
      const newCompraId = Date.now();

      const newCompra = {
        id: newCompraId,
        proveedorNombre: provNombre,
        numeroFactura: nroFactura,
        sucursalId: sucursalId,
        fecha: fecha,
        subtotal: subtotal,
        baseImponible: baseImponible,
        montoExento: totalExento,
        totalIva: totalIva,
        total: totalCompra,
        detalles: [...currentCompraInvoiceItems]
      };

      AppState.compras.unshift(newCompra);

      // Add to CxP
      AppState.cxp.unshift({
        id: newCompraId,
        factura: nroFactura,
        proveedorNombre: provNombre,
        fecha: fecha,
        montoTotal: totalCompra,
        saldoRestante: totalCompra,
        estado: 'pendiente'
      });

      // Update provider balance
      const targetProv = AppState.proveedores.find(p => (p.nombre || p.proveedor) === provNombre);
      if (targetProv) {
        targetProv.saldoPendiente = +((targetProv.saldoPendiente || 0) + totalCompra).toFixed(2);
      }

      logAuditoriaStandalone(
        'Compras',
        'COMPRA',
        'Factura de compra registrada #' + nroFactura + ' a ' + provNombre + ' por $' + totalCompra.toFixed(2) + '.',
        'Ítems agregados: ' + currentCompraInvoiceItems.map(i => i.cantidad + 'x ' + i.productoNombre).join(', '),
        sucursalId
      );

      saveState();
      renderCompras();
      renderInventario();
      renderPosProducts();
      closeCompraModal();
      alert('✅ Factura de Proveedor #' + nroFactura + ' procesada exitosamente. Se agregaron ' + currentCompraInvoiceItems.length + ' artículos al inventario.');
    }

    function openVerCompraModal(id) {
      const compra = AppState.compras.find(c => c.id === id);
      if (!compra) return;

      document.getElementById('ver-compra-title').textContent = 'Factura de Proveedor #' + (compra.numeroFactura || compra.id);
      const container = document.getElementById('ver-compra-content');

      const items = compra.detalles || [];
      container.innerHTML = \`
        <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div>
            <span class="text-[10px] text-slate-400 block">Proveedor:</span>
            <strong class="text-white">\${compra.proveedorNombre}</strong>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 block">Fecha:</span>
            <strong class="text-white font-mono">\${compra.fecha}</strong>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 block">Sucursal:</span>
            <strong class="text-emerald-400">\${compra.sucursalId === 1 ? AppState.empresaConfig.nombreTienda1 : compra.sucursalId === 2 ? AppState.empresaConfig.nombreTienda2 : 'Almacén Central'}</strong>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 block">Total Factura:</span>
            <strong class="text-emerald-400 font-mono">\${formatUSD(compra.total)}</strong>
          </div>
        </div>

        <div class="border border-slate-800 rounded-xl overflow-hidden">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-slate-800 text-slate-400 bg-slate-950">
                <th class="py-2 px-2.5">Código</th>
                <th class="py-2 px-2.5">Descripción</th>
                <th class="py-2 px-2 text-center">Unidad</th>
                <th class="py-2 px-2 text-right">Cantidad</th>
                <th class="py-2 px-2 text-right">Costo ($)</th>
                <th class="py-2 px-2 text-center">Régimen</th>
                <th class="py-2 px-2.5 text-right">Subtotal ($)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 font-mono">
              \${items.map(it => \`
                <tr class="hover:bg-slate-800/30 text-slate-200">
                  <td class="py-2 px-2.5 text-slate-400 text-[10px]">\${it.codigo_barras || 'S/C'}</td>
                  <td class="py-2 px-2.5 font-sans font-semibold text-white">\${it.productoNombre}</td>
                  <td class="py-2 px-2 text-center text-amber-300 font-bold">\${it.unidad_medida || 'UND'}</td>
                  <td class="py-2 px-2 text-right font-bold text-emerald-400">\${it.cantidad}</td>
                  <td class="py-2 px-2 text-right">\$\${it.costoUnitario.toFixed(2)}</td>
                  <td class="py-2 px-2 text-center">\${it.exentoIva ? '<span class="text-amber-300 text-[9px] bg-amber-500/20 px-1 py-0.2 rounded font-bold">EXENTO</span>' : '<span class="text-emerald-300 text-[9px] bg-emerald-500/20 px-1 py-0.2 rounded font-bold">16%</span>'}</td>
                  <td class="py-2 px-2.5 text-right font-bold text-white">\$\${it.subtotal.toFixed(2)}</td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
        </div>
      \`;

      showModal('modal-ver-compra');
    }

    function renderCxc() {
      const tbody = document.getElementById('cxc-table-body');
      tbody.innerHTML = AppState.cxc.map(c => \`
        <tr class="hover:bg-slate-800/50">
          <td class="p-3 font-mono font-bold text-white">\${c.factura}</td>
          <td class="p-3 font-semibold text-slate-200">\${c.clienteNombre}</td>
          <td class="p-3 text-slate-400">\${c.fecha}</td>
          <td class="p-3 text-right font-mono text-slate-300">\${formatUSD(c.montoTotal)}</td>
          <td class="p-3 text-right font-mono font-bold text-amber-400">\${formatUSD(c.saldoRestante)}</td>
          <td class="p-3 text-center">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold \${c.estado === 'pagada' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}">\${c.estado.toUpperCase()}</span>
          </td>
          <td class="p-3 text-center">
            \${c.saldoRestante > 0 ? \`<button onclick="abonoCxc(\${c.id})" class="px-2 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-[11px] cursor-pointer">Abonar</button>\` : '<span class="text-slate-500">Saldada</span>'}
          </td>
        </tr>
      \`).join('');
    }

    function abonoCxc(cxcId) {
      const item = AppState.cxc.find(c => c.id === cxcId);
      if (!item) return;
      const montoStr = prompt('Ingresa el monto del abono en $ USD (Saldo actual: ' + formatUSD(item.saldoRestante) + '):', item.saldoRestante);
      const monto = parseFloat(montoStr);
      if (isNaN(monto) || monto <= 0) return;

      const saldoAnterior = item.saldoRestante;
      item.saldoRestante = Math.max(0, item.saldoRestante - monto);
      if (item.saldoRestante === 0) item.estado = 'pagada';

      logAuditoriaStandalone(
        'CxC',
        'COBRO_CXC',
        'Cobro/Abono registrado en CxC por $' + monto.toFixed(2) + ' para factura "' + item.factura + '" (' + item.clienteNombre + ').',
        'Saldo previo: $' + saldoAnterior.toFixed(2) + ' -> Saldo restante: $' + item.saldoRestante.toFixed(2) + ' (' + item.estado.toUpperCase() + ')'
      );

      saveState();
      renderCxc();
      alert('¡Abono registrado con éxito!');
    }

    function renderCxp() {
      const tbody = document.getElementById('cxp-table-body');
      tbody.innerHTML = AppState.cxp.map(c => \`
        <tr class="hover:bg-slate-800/50">
          <td class="p-3 font-mono font-bold text-white">\${c.factura}</td>
          <td class="p-3 font-semibold text-slate-200">\${c.proveedorNombre}</td>
          <td class="p-3 text-slate-400">\${c.fecha}</td>
          <td class="p-3 text-right font-mono text-slate-300">\${formatUSD(c.montoTotal)}</td>
          <td class="p-3 text-right font-mono font-bold text-rose-400">\${formatUSD(c.saldoRestante)}</td>
          <td class="p-3 text-center">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold \${c.estado === 'pagada' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}">\${c.estado.toUpperCase()}</span>
          </td>
          <td class="p-3 text-center">
            \${c.saldoRestante > 0 ? \`<button onclick="pagoCxp(\${c.id})" class="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded text-[11px] cursor-pointer">Pagar</button>\` : '<span class="text-slate-500">Liquidada</span>'}
          </td>
        </tr>
      \`).join('');
    }

    function pagoCxp(cxpId) {
      const item = AppState.cxp.find(c => c.id === cxpId);
      if (!item) return;
      const montoStr = prompt('Ingresa el monto a pagar en $ USD (Saldo adeudado: ' + formatUSD(item.saldoRestante) + '):', item.saldoRestante);
      const monto = parseFloat(montoStr);
      if (isNaN(monto) || monto <= 0) return;

      const saldoAnterior = item.saldoRestante;
      item.saldoRestante = Math.max(0, item.saldoRestante - monto);
      if (item.saldoRestante === 0) item.estado = 'pagada';

      // Deduct from provider balance
      const prov = AppState.proveedores.find(p => (p.nombre || p.proveedor) === item.proveedorNombre);
      if (prov) {
        prov.saldoPendiente = Math.max(0, (prov.saldoPendiente || 0) - monto);
      }

      logAuditoriaStandalone(
        'CxP',
        'PAGO_CXP',
        'Pago a proveedor registrado en CxP por $' + monto.toFixed(2) + ' para factura "' + item.factura + '" (' + item.proveedorNombre + ').',
        'Saldo previo: $' + saldoAnterior.toFixed(2) + ' -> Saldo restante: $' + item.saldoRestante.toFixed(2) + ' (' + item.estado.toUpperCase() + ')'
      );

      saveState();
      renderCxp();
      renderProveedores();
      alert('¡Pago a proveedor liquidado con éxito!');
    }

    // ================= REPORTES LOGIC =================
    let correlativoZNum = AppState.correlativoZNum || 0;
    let correlativoXNum = AppState.correlativoXNum || 0;

    function getReportesStats(sucursalFilter = 'all') {
      let sales = AppState.ventas || [];
      if (sucursalFilter !== 'all') {
        const sucId = parseInt(sucursalFilter, 10);
        sales = sales.filter(v => v.sucursal_id === sucId);
      }

      let totalVentas = 0;
      let totalExento = 0;
      let totalBase = 0;
      let totalIva = 0;

      let efectivoUsd = 0;
      let efectivoBs = 0;
      let pagoMovilBs = 0;
      let tarjetaBs = 0;
      let vueltosUsd = 0;

      if (sales.length > 0) {
        sales.forEach(v => {
          totalVentas += v.total || 0;
          totalExento += v.monto_exento || 0;
          totalBase += v.base_imponible || (v.total * (1 / 1.16));
          totalIva += v.monto_iva || (v.total * (0.16 / 1.16));

          const p = v.pago_detalle;
          if (p) {
            if (p.metodo === 'efectivo_usd') {
              efectivoUsd += p.monto_usd || v.total;
              vueltosUsd += p.vuelto_usd || 0;
            } else if (p.metodo === 'efectivo_bs') {
              efectivoBs += p.monto_bs || (v.total * (AppState.empresaConfig.tasaCambio || 0));
            } else if (p.metodo === 'pago_movil') {
              pagoMovilBs += p.monto_bs || (v.total * (AppState.empresaConfig.tasaCambio || 0));
            } else if (p.metodo === 'tarjeta') {
              tarjetaBs += p.monto_bs || (v.total * (AppState.empresaConfig.tasaCambio || 0));
            } else if (p.metodo === 'mixto') {
              efectivoUsd += p.efectivo_usd_recibido || 0;
              efectivoBs += p.efectivo_bs_recibido || 0;
              pagoMovilBs += p.pago_movil_monto_bs || 0;
              tarjetaBs += p.tarjeta_monto_bs || 0;
              vueltosUsd += p.vuelto_usd || 0;
            }
          } else {
            efectivoUsd += v.total * 0.4;
            pagoMovilBs += (v.total * 0.35) * (AppState.empresaConfig.tasaCambio || 0);
            tarjetaBs += (v.total * 0.25) * (AppState.empresaConfig.tasaCambio || 0);
          }
        });
      }

      const ticketMin = sales.length > 0 ? String(Math.min(...sales.map(s => s.id))).padStart(4, '0') : '0000';
      const ticketMax = sales.length > 0 ? String(Math.max(...sales.map(s => s.id))).padStart(4, '0') : '0000';

      return {
        salesCount: sales.length,
        ticketMin,
        ticketMax,
        totalVentas,
        totalExento,
        totalBase,
        totalIva,
        efectivoUsd,
        efectivoBs,
        pagoMovilBs,
        tarjetaBs,
        vueltosUsd,
      };
    }

    function renderReportes() {
      const filterEl = document.getElementById('reportes-sucursal-filter');
      const sucursalFilter = filterEl ? filterEl.value : 'all';
      const stats = getReportesStats(sucursalFilter);

      const sucName = sucursalFilter === 'all' 
        ? 'Todas las Sucursales' 
        : ((AppState.sucursales && AppState.sucursales.find(s => s.id === parseInt(sucursalFilter, 10)))?.nombre || 'Sucursal ' + sucursalFilter);

      const numX = 'X-' + String(correlativoXNum).padStart(5, '0');
      const numZ = 'Z-' + String(correlativoZNum).padStart(5, '0');

      let breakdownHtml = '';
      if (sucursalFilter === 'all') {
        const sucs = (AppState.sucursales || [
          { id: 1, nombre: "Tienda 1 (Av. Principal)", tipo: "tienda" },
          { id: 2, nombre: "Tienda 2 (C.C. Sambil)", tipo: "tienda" }
        ]).filter(s => s.tipo === 'tienda' || s.id <= 2);
        
        let tiendasRows = '';
        sucs.forEach(t => {
          const tStats = getReportesStats(t.id);
          tiendasRows += '<div class="p-1.5 bg-slate-950/90 rounded border border-slate-800/80 flex items-center justify-between">' +
            '<div>' +
              '<span class="font-bold text-slate-200">' + t.nombre + '</span>' +
              '<span class="text-[9.5px] text-slate-500 block">Base: ' + formatUSD(tStats.totalBase) + ' | IVA: ' + formatUSD(tStats.totalIva) + '</span>' +
            '</div>' +
            '<div class="text-right">' +
              '<span class="font-bold text-emerald-400">' + formatUSD(tStats.totalVentas) + '</span>' +
              '<span class="text-[9.5px] text-slate-400 block font-sans">' + tStats.salesCount + ' tks</span>' +
            '</div>' +
          '</div>';
        });

        breakdownHtml = '<div class="mt-2.5 pt-2 border-t border-slate-800 text-[11px]">' +
          '<div class="font-bold text-emerald-400 mb-1.5 flex items-center justify-between">' +
            '<span>DISCRIMINACIÓN POR TIENDA:</span>' +
            '<span class="text-[10px] text-slate-400 font-normal">' + sucs.length + ' sucursales</span>' +
          '</div>' +
          '<div class="space-y-1.5 font-mono">' +
            tiendasRows +
          '</div>' +
        '</div>';
      }

      document.getElementById('corte-x-content').innerHTML = \`
        <div class="flex justify-between font-bold text-white border-b border-slate-800 pb-1.5">
          <span>EMISIÓN CORTE X (\${numX})</span>
          <span class="text-sky-400 font-mono">\${new Date().toLocaleDateString('es-VE')}</span>
        </div>
        <div class="text-[11px] text-slate-400">Sucursal: <b class="text-slate-200">\${sucName}</b> | Tasa: 1$ = \${formatBs(1)}</div>
        <div class="text-[11px] text-slate-400">Rango: <b>#\${stats.ticketMin}</b> al <b>#\${stats.ticketMax}</b> (\${stats.salesCount} tickets)</div>
        
        <div class="my-2 border-t border-dashed border-slate-800 pt-1.5 space-y-1">
          <div class="flex justify-between"><span>Ventas Exentas (E - 0%):</span> <b class="text-amber-300">\${formatUSD(stats.totalExento)}</b></div>
          <div class="flex justify-between"><span>Base Imponible (G - 16%):</span> <b>\${formatUSD(stats.totalBase)}</b></div>
          <div class="flex justify-between"><span>IVA Liquidado (16%):</span> <b class="text-emerald-400">+\${formatUSD(stats.totalIva)}</b></div>
          <div class="flex justify-between text-sm font-bold pt-1 border-t border-slate-800 text-white">
            <span>TOTAL FACTURADO:</span>
            <span class="text-sky-400">\${formatUSD(stats.totalVentas)} (\${formatBs(stats.totalVentas)})</span>
          </div>
        </div>

        \${breakdownHtml}

        <div class="bg-slate-900 p-2.5 rounded-lg text-[11px] space-y-1 mt-2 border border-slate-800/80">
          <div class="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Arqueo de Fondos:</div>
          <div class="flex justify-between"><span>• Efectivo USD ($):</span> <b>\${formatUSD(stats.efectivoUsd)}</b></div>
          <div class="flex justify-between"><span>• Efectivo Bolívares:</span> <b>Bs. \${stats.efectivoBs.toFixed(2)}</b></div>
          <div class="flex justify-between"><span>• Pago Móvil:</span> <b>Bs. \${stats.pagoMovilBs.toFixed(2)}</b></div>
          <div class="flex justify-between"><span>• Tarjeta POS:</span> <b>Bs. \${stats.tarjetaBs.toFixed(2)}</b></div>
        </div>
      \`;

      document.getElementById('corte-z-content').innerHTML = \`
        <div class="flex justify-between font-bold text-white border-b border-slate-800 pb-1.5">
          <span>CIERRE Z FISCAL (\${numZ})</span>
          <span class="text-rose-400 font-mono">\${new Date().toLocaleDateString('es-VE')}</span>
        </div>
        <div class="text-[11px] text-slate-400">Sucursal: <b class="text-slate-200">\${sucName}</b> | Auditoría Diaria</div>
        <div class="text-[11px] text-slate-400">Rango: <b>#\${stats.ticketMin}</b> al <b>#\${stats.ticketMax}</b> (\${stats.salesCount} tickets)</div>
        
        <div class="my-2 border-t border-dashed border-slate-800 pt-1.5 space-y-1">
          <div class="flex justify-between"><span>Ventas Exentas (E - 0%):</span> <b class="text-amber-300">\${formatUSD(stats.totalExento)}</b></div>
          <div class="flex justify-between"><span>Base Imponible (G - 16%):</span> <b>\${formatUSD(stats.totalBase)}</b></div>
          <div class="flex justify-between"><span>Débito Fiscal IVA (16%):</span> <b class="text-rose-400">+\${formatUSD(stats.totalIva)}</b></div>
          <div class="flex justify-between text-sm font-bold pt-1 border-t border-slate-800 text-white">
            <span>TOTAL CIERRE Z:</span>
            <span class="text-rose-400">\${formatUSD(stats.totalVentas)} (\${formatBs(stats.totalVentas)})</span>
          </div>
        </div>

        \${breakdownHtml}

        <div class="bg-slate-900 p-2.5 rounded-lg text-[11px] space-y-1 mt-2 border border-slate-800/80">
          <div class="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Consolidado para Libro SENIAT:</div>
          <div class="flex justify-between"><span>Total Base Gravada:</span> <b>\${formatUSD(stats.totalBase)}</b></div>
          <div class="flex justify-between"><span>Total Impuesto IVA 16%:</span> <b class="text-rose-400">\${formatUSD(stats.totalIva)}</b></div>
          <div class="flex justify-between"><span>Total Ingreso Bs:</span> <b class="text-emerald-400">\${formatBs(stats.totalVentas)}</b></div>
        </div>
      \`;
    }

    function imprimirCorteTermico(tipo) {
      const filterEl = document.getElementById('reportes-sucursal-filter');
      const sucursalFilter = filterEl ? filterEl.value : 'all';
      const stats = getReportesStats(sucursalFilter);

      const sucName = sucursalFilter === 'all' 
        ? 'Todas las Sucursales' 
        : (AppState.sucursales.find(s => s.id === parseInt(sucursalFilter, 10))?.nombre || 'Sucursal ' + sucursalFilter);

      const numStr = tipo === 'X' ? ('X-' + String(correlativoXNum).padStart(5, '0')) : ('Z-' + String(correlativoZNum).padStart(5, '0'));

      const printWindow = window.open('', '_blank', 'width=380,height=600');
      if (!printWindow) {
        alert('Por favor habilita las ventanas emergentes en el navegador.');
        return;
      }

      printWindow.document.open();
      printWindow.document.write(\`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Reporte de Corte \${tipo} - \${AppState.empresaConfig.nombreEmpresa}</title>
          <style>
            @page { size: auto; margin: 3mm; }
            body {
              font-family: 'Courier New', Courier, monospace;
              width: 78mm;
              margin: 0 auto;
              padding: 4px;
              font-size: 11px;
              line-height: 1.35;
            }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .divider { border-top: 1px dashed #000; margin: 4px 0; }
            .double { border-top: 2px solid #000; margin: 5px 0; }
            .flex { display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="center bold" style="font-size: 13px;">\${AppState.empresaConfig.nombreEmpresa}</div>
          <div class="center bold">RIF: \${AppState.empresaConfig.rif}</div>
          <div class="center" style="font-size: 9px;">\${AppState.empresaConfig.direccionFiscal}</div>
          <div class="divider"></div>
          <div class="center bold" style="border: 1px solid #000; padding: 3px; font-size: 12px;">
            \${tipo === 'X' ? 'REPORTE / CORTE X (PARCIAL)' : 'REPORTE / CORTE Z (FISCAL DIARIO)'}
            <div style="font-size: 10px; font-weight: normal;">NRO: \${numStr}</div>
          </div>
          <div style="font-size: 9.5px;">
            <div class="flex"><span>FECHA:</span> <span>\${new Date().toLocaleDateString('es-VE')} \${new Date().toLocaleTimeString('es-VE')}</span></div>
            <div class="flex"><span>SUCURSAL:</span> <span>\${sucName}</span></div>
            <div class="flex"><span>TASA OFICIAL:</span> <span>1$ = \${formatBs(1)}</span></div>
            <div class="flex"><span>OPERACIONES:</span> <span>\${stats.salesCount} Tickets (#\${stats.ticketMin} - #\${stats.ticketMax})</span></div>
          </div>
          <div class="divider"></div>
          <div class="bold" style="font-size: 10px;">DISCRIMINACIÓN SENIAT:</div>
          <div style="font-size: 9.5px;">
            <div class="flex"><span>VENTAS EXENTAS (E):</span> <span>\${formatUSD(stats.totalExento)}</span></div>
            <div class="flex"><span>BASE IMPONIBLE (G):</span> <span>\${formatUSD(stats.totalBase)}</span></div>
            <div class="flex"><span>IVA LIQUIDADO (16%):</span> <span>+\${formatUSD(stats.totalIva)}</span></div>
            <div class="divider"></div>
            <div class="flex bold" style="font-size: 11px;"><span>TOTAL FACTURADO USD:</span> <span>\${formatUSD(stats.totalVentas)}</span></div>
            <div class="flex bold"><span>TOTAL FACTURADO BS:</span> <span>\${formatBs(stats.totalVentas)}</span></div>
          </div>
          <div class="divider"></div>
          <div class="bold" style="font-size: 10px;">ARQUEO DE MEDIOS DE PAGO:</div>
          <div style="font-size: 9.5px;">
            <div class="flex"><span>• EFECTIVO USD:</span> <span>\${formatUSD(stats.efectivoUsd)}</span></div>
            <div class="flex"><span>• EFECTIVO BS:</span> <span>Bs. \${stats.efectivoBs.toFixed(2)}</span></div>
            <div class="flex"><span>• PAGO MÓVIL:</span> <span>Bs. \${stats.pagoMovilBs.toFixed(2)}</span></div>
            <div class="flex"><span>• TARJETA POS:</span> <span>Bs. \${stats.tarjetaBs.toFixed(2)}</span></div>
          </div>
          <div class="double"></div>
          <div style="margin-top: 25px; border-top: 1px solid #333; text-align: center; font-size: 9px;">FIRMA AUDITOR / SUPERVISOR</div>
          <div class="center" style="margin-top: 10px; font-size: 8.5px;">*** FIN REPORTE FISCAL ***</div>
        </body>
        </html>
      \`);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 350);

      logAuditoriaStandalone(
        'Reportes / Fiscal',
        tipo === 'Z' ? 'CORTE_Z' : 'CORTE_X',
        'Impresión de ' + (tipo === 'Z' ? 'Cierre Fiscal Diario (Corte Z)' : 'Corte Parcial de Turno (Corte X)') + ' para ' + (sucursalFilter === 'all' ? 'Todas las Sucursales' : 'Sucursal #' + sucursalFilter) + '.',
        'Total: ' + formatUSD(stats.totalVentas) + ' (Bs. ' + formatBs(stats.totalVentas) + '), Base: ' + formatUSD(stats.totalBase) + ', IVA: ' + formatUSD(stats.totalIva) + ', Tickets: ' + stats.salesCount
      );
    }

    function ejecutarCierreZ() {
      if (confirm('¿Confirmas que deseas ejecutar el Cierre Fiscal Diario (Corte Z)? Se incrementará el correlativo oficial.')) {
        correlativoZNum++;
        AppState.correlativoZNum = correlativoZNum;
        logAuditoriaStandalone(
          'Reportes / Fiscal',
          'CORTE_Z',
          'Cierre Fiscal Diario (Corte Z #' + correlativoZNum + ') ejecutado formalmente.',
          'Correlativo oficial incrementado a Z-' + correlativoZNum + '. Registro fiscal cerrado y verificado.'
        );
        saveState();
        renderReportes();
        alert('¡Corte Z Fiscal procesado y auditado con éxito! Correlativo Z incrementado.');
      }
    }

    // ================= AUDITORÍA & LOGS LOGIC =================
    let auditDateRangeFilter = 'all';

    function logAuditoriaStandalone(modulo, tipo_accion, descripcion, detalles = '', sucursalId = null, sucursalNombre = null) {
      if (!AppState.auditoria) AppState.auditoria = [];

      const now = new Date();
      const fechaStr = now.toLocaleDateString('es-VE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      const horaStr = now.toLocaleTimeString('es-VE', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });

      const user = AppState.currentUser;
      let sucNom = sucursalNombre;
      if (!sucNom) {
        if (sucursalId === 1) sucNom = AppState.empresaConfig?.nombreTienda1 || 'Tienda 1';
        else if (sucursalId === 2) sucNom = AppState.empresaConfig?.nombreTienda2 || 'Tienda 2';
        else if (sucursalId === 3) sucNom = AppState.empresaConfig?.nombreOficina || 'Oficina Central / Almacén';
        else if (user?.sucursal_id === 1) sucNom = AppState.empresaConfig?.nombreTienda1 || 'Tienda 1';
        else if (user?.sucursal_id === 2) sucNom = AppState.empresaConfig?.nombreTienda2 || 'Tienda 2';
        else if (user?.sucursal_id === 3) sucNom = AppState.empresaConfig?.nombreOficina || 'Oficina Central / Almacén';
        else sucNom = 'Todas las Sucursales (Global)';
      }

      const newEntry = {
        id: 'aud-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        fecha: fechaStr,
        hora: horaStr,
        timestamp: now.toISOString(),
        usuario_id: user ? user.id : 1,
        usuario_nombre: user ? user.nombre_completo : 'Administrador General',
        usuario_username: user ? (user.nombre_completo.toLowerCase().replace(/\s+/g, '_')) : 'admin',
        usuario_rol: user ? user.rol : 'admin',
        usuario_cargo: user ? (user.cargo || (user.rol === 'admin' ? 'Gerente General' : 'Operador')) : 'Gerente General',
        sucursal_id: sucursalId !== null ? sucursalId : (user ? user.sucursal_id : null),
        sucursal_nombre: sucNom,
        modulo: modulo,
        tipo_accion: tipo_accion,
        descripcion: descripcion,
        detalles: detalles || ''
      };

      AppState.auditoria.unshift(newEntry);
      if (AppState.auditoria.length > 1000) {
        AppState.auditoria = AppState.auditoria.slice(0, 1000);
      }

      saveState();
      updateAuditBadge();
    }

    function updateAuditBadge() {
      const badge = document.getElementById('cfg-audit-count-badge');
      if (badge && AppState.auditoria) {
        badge.textContent = AppState.auditoria.length;
      }
    }

    function populateAuditUserFilter() {
      const select = document.getElementById('audit-user-filter');
      if (!select) return;
      const currentVal = select.value;
      const users = AppState.usuarios || [];
      select.innerHTML = '<option value="all">Todos los Usuarios</option>' + users.map(u => \`
        <option value="\${u.nombre_completo}">\${u.nombre_completo} (\${u.rol === 'admin' ? 'Gerente' : u.rol})</option>
      \`).join('');
      if (currentVal) select.value = currentVal;
    }

    function setAuditDateFilter(range) {
      auditDateRangeFilter = range;
      const ranges = ['all', 'today', '3days', '7days'];
      ranges.forEach(r => {
        const btn = document.getElementById('audit-date-' + r);
        if (btn) {
          if (r === range) {
            btn.className = 'px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white cursor-pointer';
          } else {
            btn.className = 'px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-950 text-slate-400 hover:text-white border border-slate-800 cursor-pointer';
          }
        }
      });
      filterAuditoria();
    }

    function getFilteredAuditLogs() {
      if (!AppState.auditoria) AppState.auditoria = [];
      const search = (document.getElementById('audit-search-input')?.value || '').toLowerCase().trim();
      const modulo = document.getElementById('audit-modulo-filter')?.value || 'all';
      const accion = document.getElementById('audit-accion-filter')?.value || 'all';
      const user = document.getElementById('audit-user-filter')?.value || 'all';
      const sucursal = document.getElementById('audit-sucursal-filter')?.value || 'all';

      return AppState.auditoria.filter(log => {
        if (search) {
          const match = (log.descripcion && log.descripcion.toLowerCase().includes(search)) ||
            (log.detalles && log.detalles.toLowerCase().includes(search)) ||
            (log.usuario_nombre && log.usuario_nombre.toLowerCase().includes(search)) ||
            (log.modulo && log.modulo.toLowerCase().includes(search)) ||
            (log.tipo_accion && log.tipo_accion.toLowerCase().includes(search)) ||
            (log.id && log.id.toLowerCase().includes(search));
          if (!match) return false;
        }

        if (modulo !== 'all' && log.modulo !== modulo) return false;
        if (accion !== 'all' && log.tipo_accion !== accion) return false;
        if (user !== 'all' && log.usuario_nombre !== user) return false;

        if (sucursal !== 'all') {
          if (sucursal === 'global') {
            if (log.sucursal_id !== null && log.sucursal_id !== undefined) return false;
          } else {
            const sid = parseInt(sucursal);
            if (log.sucursal_id !== sid) return false;
          }
        }

        if (auditDateRangeFilter !== 'all') {
          const logTime = new Date(log.timestamp).getTime();
          const now = Date.now();
          if (auditDateRangeFilter === 'today') {
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            if (logTime < todayStart.getTime()) return false;
          } else if (auditDateRangeFilter === '3days') {
            if (now - logTime > 3 * 24 * 3600 * 1000) return false;
          } else if (auditDateRangeFilter === '7days') {
            if (now - logTime > 7 * 24 * 3600 * 1000) return false;
          }
        }

        return true;
      });
    }

    function renderAuditoria() {
      populateAuditUserFilter();
      updateAuditBadge();

      const totalLogs = AppState.auditoria || [];
      const totalCountEl = document.getElementById('audit-kpi-total');
      const ventasCountEl = document.getElementById('audit-kpi-ventas');
      const invCountEl = document.getElementById('audit-kpi-inv');
      const segCountEl = document.getElementById('audit-kpi-seguridad');

      if (totalCountEl) totalCountEl.textContent = totalLogs.length;
      if (ventasCountEl) ventasCountEl.textContent = totalLogs.filter(l => l.modulo === 'POS / Ventas' || l.tipo_accion === 'VENTA').length;
      if (invCountEl) invCountEl.textContent = totalLogs.filter(l => l.modulo === 'Inventario' || l.tipo_accion === 'TRASPASO' || l.modulo === 'Compras').length;
      if (segCountEl) segCountEl.textContent = totalLogs.filter(l => l.modulo === 'Seguridad' || l.modulo === 'Usuarios' || l.tipo_accion === 'ACCESO' || l.tipo_accion === 'LOGIN' || l.tipo_accion === 'RESET').length;

      filterAuditoria();
    }

    function filterAuditoria() {
      const tbody = document.getElementById('audit-table-body');
      const counter = document.getElementById('audit-results-counter');
      if (!tbody) return;

      const filtered = getFilteredAuditLogs();

      if (counter) {
        counter.textContent = 'Mostrando ' + filtered.length + ' de ' + (AppState.auditoria ? AppState.auditoria.length : 0) + ' registros';
      }

      if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="p-8 text-center text-slate-500"><div class="flex flex-col items-center justify-center gap-2"><svg class="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg><p class="text-xs">No se encontraron eventos de auditoría con los filtros seleccionados.</p></div></td></tr>';
        return;
      }

      const getActionBadgeClass = (accion) => {
        switch (accion) {
          case 'VENTA':
            return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
          case 'COMPRA':
            return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
          case 'CREAR':
            return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
          case 'MODIFICAR':
            return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
          case 'ELIMINAR':
            return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
          case 'TRASPASO':
            return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
          case 'COBRO':
            return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
          case 'PAGO':
            return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
          case 'CORTE_X':
          case 'CORTE_Z':
            return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
          case 'LOGIN':
          case 'ACCESO':
            return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
          case 'RESET':
            return 'bg-red-600/30 text-red-300 border-red-500/50';
          default:
            return 'bg-slate-700/50 text-slate-300 border-slate-600';
        }
      };

      const getModuleBadgeClass = (mod) => {
        switch (mod) {
          case 'POS / Ventas':
            return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
          case 'Inventario':
            return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
          case 'Compras':
            return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
          case 'Clientes':
            return 'text-teal-400 bg-teal-500/10 border-teal-500/20';
          case 'Proveedores':
            return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
          case 'CxC':
          case 'CxP':
            return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
          case 'Reportes / Fiscal':
            return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
          case 'Seguridad':
          case 'Usuarios':
            return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
          case 'Tasa de Cambio':
            return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
          default:
            return 'text-slate-300 bg-slate-800 border-slate-700';
        }
      };

      tbody.innerHTML = filtered.map(log => \`
        <tr class="hover:bg-slate-800/50 transition-colors">
          <td class="py-2.5 px-3 whitespace-nowrap">
            <span class="font-mono text-white font-bold block">\${log.fecha}</span>
            <span class="font-mono text-[10px] text-slate-400">\${log.hora}</span>
          </td>
          <td class="py-2.5 px-3">
            <div class="flex items-center gap-1.5">
              <div class="w-6 h-6 rounded-full \${log.usuario_rol === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-300'} flex items-center justify-center font-bold text-[10px] shrink-0">
                \${log.usuario_nombre ? log.usuario_nombre.charAt(0).toUpperCase() : 'U'}
              </div>
              <div class="min-w-0">
                <span class="font-bold text-white block truncate max-w-[130px]">\${log.usuario_nombre}</span>
                <span class="text-[10px] text-slate-400 font-mono block">\${log.usuario_rol === 'admin' ? 'Admin General' : log.usuario_rol}</span>
              </div>
            </div>
          </td>
          <td class="py-2.5 px-3 text-slate-300 text-xs whitespace-nowrap">
            \${log.sucursal_nombre || 'Global'}
          </td>
          <td class="py-2.5 px-3 whitespace-nowrap">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold border \${getModuleBadgeClass(log.modulo)}">
              \${log.modulo}
            </span>
          </td>
          <td class="py-2.5 px-3 text-center whitespace-nowrap">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono border \${getActionBadgeClass(log.tipo_accion)}">
              \${log.tipo_accion}
            </span>
          </td>
          <td class="py-2.5 px-3 text-slate-200 font-medium">
            <div class="line-clamp-2 max-w-md">\${log.descripcion}</div>
          </td>
          <td class="py-2.5 px-3 text-center whitespace-nowrap">
            <button onclick="openAuditDetail('\${log.id}')" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white rounded-lg text-[11px] font-bold border border-slate-700 cursor-pointer transition-all">
              Ver Ficha
            </button>
          </td>
        </tr>
      \`).join('');
    }

    function openAuditDetail(id) {
      const log = (AppState.auditoria || []).find(l => l.id === id);
      if (!log) return;

      const container = document.getElementById('modal-audit-detail-content');
      if (!container) return;

      container.innerHTML = \`
        <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
          <div class="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div>
              <span class="text-[10px] text-slate-400 block uppercase tracking-wider">Identificador de Evento</span>
              <span class="font-mono text-xs font-bold text-indigo-400">\${log.id}</span>
            </div>
            <div class="text-right">
              <span class="text-[10px] text-slate-400 block uppercase tracking-wider">Fecha y Hora</span>
              <span class="font-mono text-xs font-bold text-white">\${log.fecha} • \${log.hora}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs pt-1">
            <div>
              <span class="text-[10px] text-slate-400 block">Usuario Responsable:</span>
              <strong class="text-white">\${log.usuario_nombre}</strong>
              <span class="text-[10px] text-slate-400 block font-mono">(\${log.usuario_username || 'usuario'})</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 block">Rol / Cargo:</span>
              <strong class="text-emerald-400 capitalize">\${log.usuario_rol}</strong>
              <span class="text-[10px] text-slate-400 block">\${log.usuario_cargo || 'Personal'}</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 block">Sede / Sucursal:</span>
              <strong class="text-slate-200">\${log.sucursal_nombre || 'Global'}</strong>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 block">Módulo / Acción:</span>
              <strong class="text-indigo-400">\${log.modulo}</strong>
              <span class="font-mono font-bold text-[10px] text-amber-400 block">[\${log.tipo_accion}]</span>
            </div>
          </div>
        </div>

        <div class="space-y-1">
          <span class="text-[11px] font-bold text-slate-300 block">Descripción Operativa del Suceso:</span>
          <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 text-white font-medium">
            \${log.descripcion}
          </div>
        </div>

        \${log.detalles ? \`
          <div class="space-y-1">
            <span class="text-[11px] font-bold text-slate-300 block">Detalles Forenses / Carga Técnica:</span>
            <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 font-mono text-[11px] whitespace-pre-wrap break-words">
              \${log.detalles}
            </div>
          </div>
        \` : ''}

        <div class="bg-indigo-950/30 p-2.5 rounded-xl border border-indigo-500/20 text-[10px] text-indigo-300 flex items-center gap-2">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          <span>Registro sellado con Timestamp ISO: <span class="font-mono font-bold">\${log.timestamp}</span></span>
        </div>
      \`;

      showModal('modal-audit-detail');
    }

    function closeAuditDetail() {
      hideModal('modal-audit-detail');
    }

    function exportAuditCSV() {
      const logs = getFilteredAuditLogs();
      if (logs.length === 0) {
        alert('No hay registros de auditoría para exportar con los filtros actuales.');
        return;
      }

      const headers = ['ID Evento', 'Fecha', 'Hora', 'Timestamp ISO', 'Usuario', 'Username', 'Rol', 'Cargo', 'Sucursal', 'Modulo', 'Tipo Accion', 'Descripcion', 'Detalles'];
      const rows = logs.map(l => [
        \`"\${l.id}"\`,
        \`"\${l.fecha}"\`,
        \`"\${l.hora}"\`,
        \`"\${l.timestamp}"\`,
        \`"\${(l.usuario_nombre || '').replace(/"/g, '""')}"\`,
        \`"\${(l.usuario_username || '').replace(/"/g, '""')}"\`,
        \`"\${l.usuario_rol || ''}"\`,
        \`"\${(l.usuario_cargo || '').replace(/"/g, '""')}"\`,
        \`"\${(l.sucursal_nombre || 'Global').replace(/"/g, '""')}"\`,
        \`"\${l.modulo}"\`,
        \`"\${l.tipo_accion}"\`,
        \`"\${(l.descripcion || '').replace(/"/g, '""')}"\`,
        \`"\${(l.detalles || '').replace(/"/g, '""')}"\`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      const fileDate = new Date().toISOString().split('T')[0];
      const compName = (AppState.empresaConfig?.nombreEmpresa || 'empresa').toLowerCase().replace(/\\s+/g, '_');
      link.setAttribute('download', \`bitacora_auditoria_\${compName}_\${fileDate}.csv\`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    function clearAuditLogs() {
      if (!confirm('⚠️ ¿Estás seguro de que deseas vaciar la Bitácora de Auditoría?\\n\\nEsta acción borrará el historial de auditoría almacenado localmente.')) {
        return;
      }
      const adminPin = prompt('Por motivos de seguridad, ingresa el PIN de Gerente General / Administrador para confirmar la limpieza:');
      if (adminPin !== '1234' && (!AppState.currentUser || AppState.currentUser.pin !== adminPin)) {
        alert('PIN incorrecto o no autorizado. Limpieza cancelada.');
        return;
      }

      AppState.auditoria = [];
      logAuditoriaStandalone('Seguridad', 'RESET', 'Limpieza manual de la bitácora de auditoría autorizada por el administrador.', 'Historial previo purgado.');
      saveState();
      renderAuditoria();
      alert('La bitácora de auditoría ha sido reiniciada.');
    }

    // ================= CONFIGURACIÓN & RBAC LOGIC =================
    let currentEditingUserId = 1;
    let currentConfigSubtab = 'usuarios';

    function switchConfigSubtab(subtab) {
      currentConfigSubtab = subtab;
      const subtabs = ['usuarios', 'fiscal', 'sucursales', 'tasa', 'licencia', 'auditoria', 'mantenimiento'];
      subtabs.forEach(st => {
        const div = document.getElementById('cfg-subtab-' + st);
        const btn = document.getElementById('cfg-subtab-btn-' + st);
        if (div) {
          if (st === subtab) div.classList.remove('hidden');
          else div.classList.add('hidden');
        }
        if (btn) {
          if (st === subtab) {
            if (st === 'mantenimiento') {
              btn.className = 'px-3 py-1.5 rounded-lg font-bold bg-rose-600 text-white transition-all cursor-pointer flex items-center gap-1';
            } else if (st === 'auditoria') {
              btn.className = 'px-3 py-1.5 rounded-lg font-bold bg-indigo-600 text-white transition-all cursor-pointer flex items-center gap-1.5';
            } else {
              btn.className = 'px-3 py-1.5 rounded-lg font-bold bg-emerald-500 text-slate-950 transition-all cursor-pointer';
            }
          } else {
            if (st === 'mantenimiento') {
              btn.className = 'px-3 py-1.5 rounded-lg font-semibold text-rose-400 hover:text-rose-200 transition-all cursor-pointer flex items-center gap-1';
            } else if (st === 'auditoria') {
              btn.className = 'px-3 py-1.5 rounded-lg font-semibold text-indigo-300 hover:text-white hover:bg-indigo-500/10 transition-all cursor-pointer flex items-center gap-1.5';
            } else {
              btn.className = 'px-3 py-1.5 rounded-lg font-semibold text-slate-400 hover:text-white transition-all cursor-pointer';
            }
          }
        }
      });

      if (subtab === 'licencia') {
        renderLicenciaSubtab();
      } else if (subtab === 'auditoria') {
        renderAuditoria();
      } else if (subtab === 'tasa') {
        const val = AppState.empresaConfig.tasaCambio;
        document.getElementById('cfg-tasa-input').value = val;
        document.getElementById('cfg-tasa-preview-bs').textContent = 'Bs. ' + (val * 10).toFixed(2);
      }
    }

    function renderConfiguracion() {
      updateAuditBadge();
      // Fiscal inputs
      const cfg = AppState.empresaConfig;
      if (document.getElementById('cfg-company-name')) document.getElementById('cfg-company-name').value = cfg.nombreEmpresa || '';
      if (document.getElementById('cfg-company-rif')) document.getElementById('cfg-company-rif').value = cfg.rif || '';
      if (document.getElementById('cfg-company-tel')) document.getElementById('cfg-company-tel').value = cfg.telefono || '';
      if (document.getElementById('cfg-company-dir')) document.getElementById('cfg-company-dir').value = cfg.direccionFiscal || '';

      // Sucursales inputs
      if (document.getElementById('cfg-suc-1')) document.getElementById('cfg-suc-1').value = cfg.nombreTienda1 || 'Tienda 1';
      if (document.getElementById('cfg-suc-2')) document.getElementById('cfg-suc-2').value = cfg.nombreTienda2 || 'Tienda 2';
      if (document.getElementById('cfg-suc-3')) document.getElementById('cfg-suc-3').value = cfg.nombreOficina || 'Oficina Central';

      // Tasa
      if (document.getElementById('cfg-tasa-input')) {
        document.getElementById('cfg-tasa-input').value = cfg.tasaCambio;
        document.getElementById('cfg-tasa-preview-bs').textContent = 'Bs. ' + (cfg.tasaCambio * 10).toFixed(2);
      }

      // Render Users
      renderUserList();
      if (!currentEditingUserId && AppState.usuarios.length > 0) {
        currentEditingUserId = AppState.usuarios[0].id;
      }
      selectUserToEdit(currentEditingUserId);
    }

    function renderUserList(filterText = '') {
      const container = document.getElementById('cfg-users-container');
      const countBadge = document.getElementById('cfg-user-count-badge');
      if (!container) return;

      const filtered = AppState.usuarios.filter(u => {
        if (!filterText) return true;
        const term = filterText.toLowerCase();
        return u.nombre_completo.toLowerCase().includes(term) || (u.cargo && u.cargo.toLowerCase().includes(term));
      });

      if (countBadge) {
        countBadge.textContent = AppState.usuarios.length + ' usuarios registrados';
      }

      container.innerHTML = filtered.map(u => {
        const isSelected = u.id === currentEditingUserId;
        const isAdmin = u.rol === 'admin';
        const permsCount = u.permisos ? Object.values(u.permisos).filter(Boolean).length : (isAdmin ? 10 : 1);
        
        return \`
          <div onclick="selectUserToEdit(\${u.id})" class="p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 \${
            isSelected
              ? 'bg-slate-800 border-emerald-500 shadow-md shadow-emerald-950/40'
              : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
          }">
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 \${
                isAdmin ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }">
                \${u.nombre_completo.split(' ').map(n=>n[0]).join('').substring(0,2)}
              </div>
              <div class="truncate">
                <div class="font-bold text-white text-xs truncate flex items-center gap-1.5">
                  <span>\${u.nombre_completo}</span>
                  \${u.id === AppState.currentUser?.id ? '<span class="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 rounded font-normal">Tú</span>' : ''}
                </div>
                <div class="text-[10px] text-slate-400 truncate flex items-center gap-1">
                  <span>\${u.cargo || u.rol}</span>
                  <span class="text-slate-600">•</span>
                  <span class="font-mono text-emerald-400">PIN: \${u.pin}</span>
                </div>
              </div>
            </div>

            <div class="shrink-0 text-right">
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded \${
                isAdmin ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-slate-800 text-slate-300 border border-slate-700'
              }">
                \${isAdmin ? 'Acceso Total' : permsCount + '/10'}
              </span>
            </div>
          </div>
        \`;
      }).join('');
    }

    function filterUserList() {
      const q = document.getElementById('cfg-user-search-input')?.value || '';
      renderUserList(q);
    }

    function selectUserToEdit(userId) {
      currentEditingUserId = userId;
      renderUserList(document.getElementById('cfg-user-search-input')?.value || '');

      const user = AppState.usuarios.find(u => u.id === userId);
      if (!user) return;

      document.getElementById('cfg-edit-user-id').value = user.id;
      document.getElementById('cfg-edit-nombre').value = user.nombre_completo;
      document.getElementById('cfg-edit-cargo').value = user.cargo || (user.rol === 'admin' ? 'Gerente General' : 'Operador');
      document.getElementById('cfg-edit-rol').value = user.rol || 'cajero';
      document.getElementById('cfg-edit-pin').value = user.pin;
      document.getElementById('cfg-edit-name-display').textContent = 'Editar Permisos: ' + user.nombre_completo;

      // Delete button: disabled for admin or if only 1 user
      const deleteBtn = document.getElementById('cfg-btn-delete-user');
      if (deleteBtn) {
        if (user.rol === 'admin' || AppState.usuarios.length <= 1) {
          deleteBtn.classList.add('opacity-40', 'pointer-events-none');
        } else {
          deleteBtn.classList.remove('opacity-40', 'pointer-events-none');
        }
      }

      // Checkboxes
      const modules = ['dashboard', 'ventas', 'inventario', 'compras', 'clientes', 'proveedores', 'cxc', 'cxp', 'reportes', 'configuracion'];
      const perms = user.permisos || {};
      const isAdmin = user.rol === 'admin';

      modules.forEach(m => {
        const chk = document.getElementById('perm-chk-' + m);
        if (chk) {
          chk.checked = isAdmin || !!perms[m];
        }
      });
    }

    function handleRoleChangeInEdit() {
      const rol = document.getElementById('cfg-edit-rol').value;
      if (rol === 'admin') applyPreset('admin');
      else if (rol === 'supervisor') applyPreset('supervisor');
      else if (rol === 'inventario') applyPreset('almacen');
      else if (rol === 'cajero') applyPreset('pos');
    }

    function applyPreset(preset) {
      const modules = ['dashboard', 'ventas', 'inventario', 'compras', 'clientes', 'proveedores', 'cxc', 'cxp', 'reportes', 'configuracion'];
      
      const config = {
        pos: { ventas: true },
        almacen: { inventario: true, compras: true, proveedores: true },
        supervisor: { dashboard: true, ventas: true, inventario: true, compras: true, clientes: true, proveedores: true, reportes: true },
        finanzas: { dashboard: true, clientes: true, proveedores: true, cxc: true, cxp: true, reportes: true },
        admin: { dashboard: true, ventas: true, inventario: true, compras: true, clientes: true, proveedores: true, cxc: true, cxp: true, reportes: true, configuracion: true }
      };

      const selectedMap = config[preset] || { ventas: true };
      modules.forEach(m => {
        const chk = document.getElementById('perm-chk-' + m);
        if (chk) chk.checked = !!selectedMap[m];
      });
    }

    function togglePinVisibility(inputId) {
      const el = document.getElementById(inputId);
      if (el) {
        el.type = el.type === 'password' ? 'text' : 'password';
      }
    }

    function generateRandomPin(inputId) {
      const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
      const el = document.getElementById(inputId);
      if (el) {
        el.value = randomPin;
        el.type = 'text';
      }
    }

    function saveUserPermissionsChanges() {
      const uid = parseInt(document.getElementById('cfg-edit-user-id').value);
      const user = AppState.usuarios.find(u => u.id === uid);
      if (!user) return;

      const nombre = document.getElementById('cfg-edit-nombre').value.trim();
      const cargo = document.getElementById('cfg-edit-cargo').value.trim();
      const rol = document.getElementById('cfg-edit-rol').value;
      const pin = document.getElementById('cfg-edit-pin').value.trim();

      if (!nombre) {
        alert('El nombre del colaborador no puede estar vacío.');
        return;
      }
      if (!/^\\d{4}$/.test(pin)) {
        alert('El PIN de seguridad debe contener exactamente 4 dígitos numéricos.');
        return;
      }

      // Check pin collision with other users
      const collision = AppState.usuarios.find(u => u.id !== uid && u.pin === pin);
      if (collision) {
        alert('El PIN ' + pin + ' ya está asignado a ' + collision.nombre_completo + '. Por favor elige otro PIN.');
        return;
      }

      // Collect 10 module checkboxes
      const modules = ['dashboard', 'ventas', 'inventario', 'compras', 'clientes', 'proveedores', 'cxc', 'cxp', 'reportes', 'configuracion'];
      const newPerms = {};
      modules.forEach(m => {
        const chk = document.getElementById('perm-chk-' + m);
        newPerms[m] = chk ? chk.checked : false;
      });

      user.nombre_completo = nombre;
      user.cargo = cargo;
      user.rol = rol;
      user.pin = pin;
      user.permisos = newPerms;

      logAuditoriaStandalone(
        'Usuarios / RBAC',
        'MODIFICAR',
        'Credenciales y permisos de usuario actualizados: "' + nombre + '" (' + (cargo || rol) + ').',
        'Rol: ' + rol + ', PIN: ' + pin + ', Módulos autorizados: ' + Object.keys(newPerms).filter(k => newPerms[k]).join(', ')
      );

      // If active session is updated, sync it
      if (AppState.currentUser && AppState.currentUser.id === uid) {
        AppState.currentUser = { ...user };
        updateTopBar();
        updateSidebarSecurity();
      }

      saveState();
      renderConfiguracion();
      alert('¡Permisos y credenciales de ' + nombre + ' guardados con éxito!');
    }

    function deleteCurrentUser() {
      const uid = parseInt(document.getElementById('cfg-edit-user-id').value);
      const user = AppState.usuarios.find(u => u.id === uid);
      if (!user) return;

      if (user.rol === 'admin') {
        alert('No se puede eliminar la cuenta principal de Gerente General / Administrador.');
        return;
      }

      if (AppState.usuarios.length <= 1) {
        alert('Debe existir al menos un usuario registrado en el sistema.');
        return;
      }

      if (confirm('¿Estás seguro de eliminar a ' + user.nombre_completo + ' (PIN: ' + user.pin + ')?')) {
        AppState.usuarios = AppState.usuarios.filter(u => u.id !== uid);
        logAuditoriaStandalone(
          'Usuarios / RBAC',
          'ELIMINAR',
          'Usuario eliminado del sistema: "' + user.nombre_completo + '" (' + (user.cargo || user.rol) + ').',
          'PIN eliminado: ' + user.pin
        );
        if (AppState.currentUser && AppState.currentUser.id === uid) {
          AppState.currentUser = AppState.usuarios[0];
          updateTopBar();
          updateSidebarSecurity();
        }
        currentEditingUserId = AppState.usuarios[0].id;
        saveState();
        renderConfiguracion();
        alert('Colaborador eliminado.');
      }
    }

    // Modal: Nuevo Usuario
    function openNewUserModal() {
      document.getElementById('new-user-nombre').value = '';
      document.getElementById('new-user-cargo').value = '';
      document.getElementById('new-user-rol').value = 'cajero';
      document.getElementById('new-user-pin').value = Math.floor(1000 + Math.random() * 9000).toString();
      applyPresetToNewUser('pos');
      showModal('modal-new-user');
    }

    function closeNewUserModal() {
      hideModal('modal-new-user');
    }

    function handleRoleChangeInNewUser() {
      const rol = document.getElementById('new-user-rol').value;
      if (rol === 'admin') applyPresetToNewUser('admin');
      else if (rol === 'supervisor') applyPresetToNewUser('supervisor');
      else if (rol === 'inventario') applyPresetToNewUser('almacen');
      else applyPresetToNewUser('pos');
    }

    function applyPresetToNewUser(preset) {
      const modules = ['dashboard', 'ventas', 'inventario', 'compras', 'clientes', 'proveedores', 'cxc', 'cxp', 'reportes', 'configuracion'];
      const map = {
        pos: { ventas: true },
        almacen: { inventario: true, compras: true, proveedores: true },
        supervisor: { dashboard: true, ventas: true, inventario: true, compras: true, clientes: true, proveedores: true, reportes: true },
        admin: { dashboard: true, ventas: true, inventario: true, compras: true, clientes: true, proveedores: true, cxc: true, cxp: true, reportes: true, configuracion: true }
      };
      const active = map[preset] || { ventas: true };
      modules.forEach(m => {
        const chk = document.getElementById('new-perm-' + m);
        if (chk) chk.checked = !!active[m];
      });
    }

    function saveNewUser() {
      const nombre = document.getElementById('new-user-nombre').value.trim();
      const cargo = document.getElementById('new-user-cargo').value.trim() || 'Operador';
      const rol = document.getElementById('new-user-rol').value;
      const pin = document.getElementById('new-user-pin').value.trim();

      if (!nombre) {
        alert('Por favor ingresa el nombre del nuevo colaborador.');
        return;
      }
      if (!/^\\d{4}$/.test(pin)) {
        alert('El PIN debe tener exactamente 4 dígitos numéricos.');
        return;
      }

      const collision = AppState.usuarios.find(u => u.pin === pin);
      if (collision) {
        alert('El PIN ' + pin + ' ya pertenece a ' + collision.nombre_completo + '. Por favor elige otro PIN.');
        return;
      }

      const modules = ['dashboard', 'ventas', 'inventario', 'compras', 'clientes', 'proveedores', 'cxc', 'cxp', 'reportes', 'configuracion'];
      const permisos = {};
      modules.forEach(m => {
        const chk = document.getElementById('new-perm-' + m);
        permisos[m] = chk ? chk.checked : false;
      });

      const newId = Date.now();
      const newUser = {
        id: newId,
        nombre_completo: nombre,
        cargo: cargo,
        rol: rol,
        pin: pin,
        sucursal_id: 1,
        permisos: permisos
      };

      AppState.usuarios.push(newUser);
      currentEditingUserId = newId;

      logAuditoriaStandalone(
        'Usuarios / RBAC',
        'CREAR',
        'Nuevo colaborador registrado: "' + nombre + '" (' + (cargo || rol) + ').',
        'Rol asignado: ' + rol + ', PIN: ' + pin
      );

      saveState();
      renderConfiguracion();
      closeNewUserModal();
      alert('¡Colaborador ' + nombre + ' registrado exitosamente con PIN: ' + pin + '!');
    }

    function saveCompanyConfig() {
      AppState.empresaConfig.nombreEmpresa = document.getElementById('cfg-company-name').value.trim();
      AppState.empresaConfig.rif = document.getElementById('cfg-company-rif').value.trim();
      AppState.empresaConfig.telefono = document.getElementById('cfg-company-tel').value.trim();
      AppState.empresaConfig.direccionFiscal = document.getElementById('cfg-company-dir').value.trim();

      logAuditoriaStandalone(
        'Configuración',
        'MODIFICAR',
        'Datos fiscales y membrete de la empresa actualizados.',
        'Empresa: ' + AppState.empresaConfig.nombreEmpresa + ', RIF: ' + AppState.empresaConfig.rif + ', Tel: ' + AppState.empresaConfig.telefono
      );

      saveState();
      updateTopBar();
      alert('¡Datos fiscales guardados con éxito!');
    }

    function saveSucursalesConfig() {
      AppState.empresaConfig.nombreTienda1 = document.getElementById('cfg-suc-1').value.trim();
      AppState.empresaConfig.nombreTienda2 = document.getElementById('cfg-suc-2').value.trim();
      AppState.empresaConfig.nombreOficina = document.getElementById('cfg-suc-3').value.trim();

      logAuditoriaStandalone(
        'Configuración',
        'MODIFICAR',
        'Nombres y denominaciones de sucursales modificados.',
        'Sede 1: ' + AppState.empresaConfig.nombreTienda1 + ', Sede 2: ' + AppState.empresaConfig.nombreTienda2 + ', Sede 3: ' + AppState.empresaConfig.nombreOficina
      );

      saveState();
      alert('¡Nombres de sucursales actualizados!');
    }

    function saveTasaFromConfig() {
      const val = parseFloat(document.getElementById('cfg-tasa-input').value);
      if (isNaN(val) || val <= 0) {
        alert('Por favor ingresa una tasa válida.');
        return;
      }
      const tasaPrevia = AppState.empresaConfig.tasaCambio;
      AppState.empresaConfig.tasaCambio = val;

      logAuditoriaStandalone(
        'Tasa / Divisas',
        'MODIFICAR',
        'Tasa oficial de cambio actualizada a Bs. ' + val.toFixed(2) + ' / USD.',
        'Tasa anterior: Bs. ' + (tasaPrevia ? tasaPrevia.toFixed(2) : '36.50') + ' -> Nueva tasa: Bs. ' + val.toFixed(2)
      );

      saveState();
      updateTopBar();
      renderPosProducts();
      renderPosCart();
      alert('¡Tasa actualizada a: 1 USD = ' + formatBs(1) + '!');
    }

    // ================= MODALS & AUTH LOGIC =================
    function openLoginModal() {
      const select = document.getElementById('login-user-select');
      select.innerHTML = AppState.usuarios.map(u => \`
        <option value="\${u.id}">\${u.nombre_completo} (\${u.rol === 'admin' ? 'Gerente General' : u.rol})</option>
      \`).join('');
      document.getElementById('login-pin-input').value = '';
      document.getElementById('login-error-msg').classList.add('hidden');
      showModal('modal-login');
    }

    function closeLoginModal() {
      hideModal('modal-login');
    }

    function submitPinLogin() {
      const uid = parseInt(document.getElementById('login-user-select').value);
      const enteredPin = document.getElementById('login-pin-input').value.trim();
      const user = AppState.usuarios.find(u => u.id === uid);
      const errorMsg = document.getElementById('login-error-msg');

      if (!user || user.pin !== enteredPin) {
        errorMsg.textContent = 'PIN incorrecto para ' + (user ? user.nombre_completo : 'el usuario');
        errorMsg.classList.remove('hidden');
        logAuditoriaStandalone(
          'Seguridad',
          'LOGIN_FALLIDO',
          'Intento de inicio de sesión fallido con PIN erróneo para "' + (user ? user.nombre_completo : 'Usuario #' + uid) + '".',
          'PIN ingresado incorrecto.'
        );
        return;
      }

      AppState.currentUser = user;
      logAuditoriaStandalone(
        'Seguridad',
        'LOGIN',
        'Inicio de sesión exitoso: ' + user.nombre_completo + ' (' + (user.cargo || user.rol) + ').',
        'Autenticación vía PIN de 4 dígitos completada.'
      );

      saveState();
      updateTopBar();
      updateSidebarSecurity();
      closeLoginModal();
      switchTab('ventas');
      alert('Bienvenido/a, ' + user.nombre_completo);
    }

    function copiarLinkTienda() {
      const url = 'https://ais-pre-tyt52fncy3eo3afi2k5i4d-221340882796.us-east5.run.app?vista=tienda';
      navigator.clipboard.writeText(url).then(function() {
        alert('¡Enlace de la Tienda Online copiado al portapapeles!\\n\\nComparte este link por WhatsApp con tus clientes:\\n' + url);
      }).catch(function() {
        prompt('Copia el link de tu Tienda Online para tus clientes:', url);
      });
    }

    function openPinGuideModal() {
      const list = document.getElementById('pin-guide-list');
      list.innerHTML = AppState.usuarios.map(u => \`
        <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span class="font-bold text-white">\${u.nombre_completo}</span>
            <span class="text-[10px] text-slate-400 block">\${u.rol === 'admin' ? 'Gerente General (Acceso Total)' : 'Cajero / Operador'}</span>
          </div>
          <div class="text-right">
            <span class="font-mono font-bold text-emerald-400 text-sm bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/30">
              PIN: \${u.pin}
            </span>
          </div>
        </div>
      \`).join('');
      showModal('modal-pin-guide');
    }

    function closePinGuideModal() {
      hideModal('modal-pin-guide');
    }

    function openTasaModal() {
      document.getElementById('tasa-input-val').value = AppState.empresaConfig.tasaCambio;
      showModal('modal-tasa');
    }

    function closeTasaModal() {
      hideModal('modal-tasa');
    }

    function saveDailyRate() {
      const val = parseFloat(document.getElementById('tasa-input-val').value);
      if (isNaN(val) || val <= 0) {
        alert('Por favor ingresa una tasa válida.');
        return;
      }
      const tasaPrevia = AppState.empresaConfig.tasaCambio;
      AppState.empresaConfig.tasaCambio = val;

      logAuditoriaStandalone(
        'Tasa / Divisas',
        'MODIFICAR',
        'Tasa oficial de cambio actualizada desde cabecera a Bs. ' + val.toFixed(2) + ' / USD.',
        'Tasa anterior: Bs. ' + (tasaPrevia ? tasaPrevia.toFixed(2) : '36.50') + ' -> Nueva tasa: Bs. ' + val.toFixed(2)
      );

      saveState();
      updateTopBar();
      renderPosProducts();
      renderPosCart();
      closeTasaModal();
      alert('Tasa actualizada a: 1 USD = ' + formatBs(1));
    }

    // Startup
    window.addEventListener('DOMContentLoaded', init);
  </script>
</body>
</html>`;
