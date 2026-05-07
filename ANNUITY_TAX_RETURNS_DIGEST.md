# Annuity Tax Returns — Application Digest

## 1. Application

| Field         | Value                                                                                                                                                                              |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name          | Annuity Tax Returns                                                                                                                                                                |
| Version       | 1.0.0.43 (mirrors the legacy desktop tool's About box)                                                                                                                             |
| Type          | Static web app (no backend) — modernised recreation of the legacy "Tax Return Generation" Windows desktop utility                                                                  |
| Description   | Internal Liverpool Victoria tool for kicking off the annual tax-return generation job for a chosen tax year, viewing the run log, printing an error log, and emailing About info. Single screen, no tabs, no real processing — surfaces the legacy "file not found" error path. |
| Framework     | React 19 + Vite + TypeScript                                                                                                                                                       |
| Styling       | Tailwind CSS                                                                                                                                                                       |
| Icons         | react-icons (Material Design)                                                                                                                                                      |
| Routing       | Single-page, single screen (no router)                                                                                                                                             |
| Workspace     | pnpm monorepo artifact — `artifacts/annuity-tax-returns`                                                                                                                           |
| Deployment    | Static site (Vite build output)                                                                                                                                                    |

### Fonts

- **Heading / Buttons:** Livvic
- **Body / Inputs / Logs:** Mulish (log area uses monospace)

### Brand colors (LVE)

| Token         | Hex        | Usage                                                  |
| ------------- | ---------- | ------------------------------------------------------ |
| navy          | `#00263e`  | Header, modal title bars, status text                  |
| primary_blue  | `#006cf4`  | Primary buttons, focus rings                           |
| deep_blue     | `#003578`  | Hover fill for buttons                                 |
| secondary_blue| `#04589b`  | Secondary button border / text                         |
| accent_green  | `#178830`  | Status `READY` / `COMPLETE`, focus border on inputs    |
| error_red     | `#d72714`  | Status `ERROR`, error icon, log error rows             |
| error_bg      | `#fdecea`  | Soft red background for error chip / icon halo         |
| panel_bg      | `#eaf5f8`  | Soft blue panel for the About-dialog logo lockup       |
| surface       | `#f0f0f0`  | App background, Windows-style dialog chrome            |
| log_bg        | `#00263e`  | Output log area background (navy)                      |
| text          | `#3d3d3d`  | Body text                                              |
| muted         | `#979797`  | Disabled control text                                  |
| border        | `#BBBBBB`  | Input borders                                          |

---

## 2. Global Components

### 2.1 Header (`src/components/Header.tsx`)

```yaml
sticky: false
background: "#00263e"
height: 64px
horizontal_padding: 142px
vertical_alignment: center
left:
  - logo: "LV="          # img, h=20px
  - title: "Annuity Tax Returns"   # Livvic, 24px, white
right:
  - logout_button:
      label: "Logout"
      style: ghost-on-dark, hover bg white/10
      action: visual only (no-op)
```

### 2.2 Footer (`src/components/Footer.tsx`)

```yaml
background: white
border_top: "border-slate-200"
horizontal_padding: 142px
vertical_padding: 12px
left:
  - logo: "LV="          # img, h=20px
right:
  - "Liverpool Victoria Financial Services Limited"
  - "County Gates, Bournemouth BH1 2NF"   # 8px, slate-400
```

### 2.3 LveButton (`src/components/LveButton.tsx`)

`class-variance-authority` based design-system button used everywhere.

```yaml
variants:
  default:     bg #006cf4, text white, hover bg #003578, disabled bg #979797, shadow-md
  secondary:   bg white, text #04589b, border #04589b, bold; hover bg #003578 white
  outline:     bg white, text #3d3d3d, border #BBBBBB, hover bg gray-50
  ghost:       transparent, hover bg white/10
  link:        #006cf4, underline on hover
  destructive: bg #d72714, text white, hover bg red-700
sizes:
  default: h-35px, px-6, rounded-24px, text-sm
  sm:      h-7,    px-3, rounded-24px, text-xs
  lg:      h-10,   px-8, rounded-24px, text-base
  icon:    h-8 w-8 rounded-full
asChild: supported via @radix-ui/react-slot
```

### 2.4 YearSelector (`src/components/YearSelector.tsx`)

```yaml
appearance:
  width: 80px
  height: 35px
  font: Mulish 13px
  border: 1px #BBBBBB; hover #178830; focus 3px #178830
  background: white; disabled bg #CCCCCC
controls:
  ▲ increment year by 1   (no upper bound)
  ▼ decrement year by 1   (clamped at 2000; button disabled when value <= 2000)
read_only_input: true   # value typed via spinner only
```

---

## 3. Screens

### 3.1 Tax Return Generation (the only screen)

The full app is a single white card centered inside the main content
area. Vertical padding 24px, horizontal padding 142px (matching the
header / footer rails).

```yaml
title: "Tax Return Generation"   # Livvic 16px semibold #00263e
fields:
  tax_year_start:
    label: "Tax Year Start"      # Livvic 12px medium #3d3d3d
    display: "06 APR " + YearSelector(value=year, disabled=isRunning)
  tax_year_end:
    label: "Tax Year End"
    display: "05 APR <year + 1>"  # Mulish 13px, read-only
primary_action:
  - Run:
      icon: ▶ MdPlayArrow
      min_width: 128px
      disabled_when: status == "RUNNING"
      action: opens Run Error Dialog (see §4.1)
status_row:
  - "Status: <READY|RUNNING|COMPLETE|ERROR>"
       READY:    text-#178830 (green)
       RUNNING:  text-#006cf4 (blue)
       COMPLETE: text-#178830 (green)
       ERROR:    text-#d72714 (red)
  - "Policies: 00000"             # zero-padded to 5 digits
secondary_actions:
  - "⚠ Print Error Log":
      variant: secondary, size: sm
      disabled_when: status == "RUNNING"
      action: §4.4 (replaces log area + opens Save Print Output)
  - "ⓘ About":
      variant: secondary, size: sm
      action: §4.2 About Dialog
log_area:
  height: 224px
  background: "#00263e"           # navy
  font: monospace 11px
  padding: 12px
  scroll: auto
  empty_state: "Output log will appear here when you run the process"  # slate-500 Mulish 12px
  row_format: "[HH:MM:SS] <message>"
  row_colors:
    info:    text-slate-300
    error:   text-#d72714
    success: text-#178830
progress_bar:
  rendered_when: isRunning   # never reached in current build
  bar: 1.5px height, bg #eaf5f8, fill #006cf4
```

> **Current state:** the **Run** button always opens the Run Error
> Dialog (§4.1) and never starts a real (or simulated) processing
> run. As a consequence, `status` stays at `READY`, the Policies
> counter stays at `00000`, and the progress bar never appears.

---

## 4. Modals & Dialogs

All modals overlay the page with a 40% black backdrop
(`bg-black/40`). Clicking the backdrop closes the dialog (except as
noted). Modal headers use the LVE navy `#00263e` strip with a white
title and an `✕` close button — except the Save Print Output dialog,
which intentionally mimics native Windows chrome.

### 4.1 Run Error Dialog (inline in `TaxReturnGeneration.tsx`)

LVE-styled hard-coded "file not found" error — the legacy desktop
behavior surfaced in modern chrome.

```yaml
trigger: Run button
z_index: 55
width: max-w-560px
header:
  background: "#00263e"
  icon: MdError (red #d72714)
  title: "Error"   # Livvic 15px semibold white
  close: ✕ (top-right)
body:
  icon_circle: 48px, bg #fdecea, MdError #d72714 28px
  text:
    line1 (semibold #00263e): "There has been a problem, please notify Help Desk."
    line2: 'Cannot open file "\\whynvap13\UAT\Tax_Returns\Exe\<year>\QryTaxReturn.txt".
            The system cannot find the path specified.'
    path_chip: monospace 12px, color #d72714, bg #fdecea, rounded
footer:
  background: "#f7f9fb"
  border_top: "border-#eaf5f8"
  buttons: [ OK (LveButton primary, autoFocus, min-w-100px) ]
close_paths: OK | header ✕ | overlay click
side_effect: none (does not log anything; log area is left untouched)
```

### 4.2 About Dialog (`src/components/AboutDialog.tsx`)

Reproduces the legacy About box content **verbatim** in LVE styling.

```yaml
trigger: About button
z_index: 50
width: max-w-520px
header:
  background: "#00263e"
  title: "About"   # Livvic 14px semibold white
  close: ✕
body:
  identity_row:
    left: LV= logo on #eaf5f8 rounded panel
    right (text-right):
      product:  "Tax Returns"      # Livvic 20px semibold #00263e
      version:  "Version 1.0.0.43"
  info_rows:                       # Mulish 12px, label right-aligned 120px column
    - "Executable: \\\\whynvap13\\UAT\\Tax_Returns\\Exe\\TaxReturns.exe"
    - "Working directory: H:\\"
    - "Environment: BDE is not used"
    - "User: UAT3"
    - "Workstation: WHYNVCX16"
  system_block:
    - "Windows NT 5.2 (Build 3790: Service Pack 2)"
    - "Memory available to Windows: 2,097,152 KB"
footer_buttons:
  - "⧉ Copy To Clip" (secondary sm):
      action: writes formatted info block to clipboard via navigator.clipboard
      label_flip: "✓ Copied" for 2s after success
  - "✉ Email" (secondary sm):
      action: opens Email About Box dialog (§4.3)
  - "OK" (primary sm):
      action: close dialog
close_paths: OK | header ✕ | overlay click
```

`Copy To Clip` formats each `aboutInfo` entry as
`Label: value` (camelCase keys are split into spaced Title Case)
joined by newlines.

### 4.3 Email About Box Dialog (nested in `AboutDialog.tsx`)

```yaml
trigger: Email button inside About Dialog
z_index: 60   # stacked over About
width: max-w-400px
header:
  background: "#00263e"
  title: "Email About Box contents to IT"
  close: ✕
body:
  label: "Subject:"
  input:
    initial_value: ""        # field starts empty
    placeholder: "Press cancel to abort."
    autoFocus: true
    keys:
      Enter:  triggers OK
      Escape: triggers Cancel
footer_buttons:
  - "Cancel" (secondary sm): closes dialog, no side effect
  - "OK"     (primary sm):   handleEmailConfirm()
close_paths_no_send: Cancel | header ✕ | overlay click
on_OK:
  - if subject is empty/whitespace -> opens Information Dialog (§4.4)
  - else:
      build mailto URL:
        to:      "it-helpdesk@lv.co.uk"
        subject: <typed subject>
        body:    |
          Hi IT Help Desk,

          Please see the About Box information for the Tax Returns application below:

          Product: Tax Returns
          Version: 1.0.0.43
          Executable: \\whynvap13\UAT\Tax_Returns\Exe\TaxReturns.exe
          Working Directory: H:\
          Environment: BDE is not used
          User: UAT3
          Workstation: WHYNVCX16
          System: Windows NT 5.2 (Build 3790: Service Pack 2)
          Memory: 2,097,152 KB

          Thanks,
      open via programmatic <a href="mailto:..."> click
        (default mail handler / Outlook on Windows)
      reset Subject to "" and close the dialog
```

### 4.4 Information Dialog (nested in `AboutDialog.tsx`)

LVE-styled information dialog used when the Email subject is missing.

```yaml
trigger: Email About Box "OK" with empty subject
z_index: 70   # stacked over both About and Email
width: max-w-380px
header:
  background: "#00263e"
  title: "Information"
  close: ✕
body:
  icon: MdInfo 32px #006cf4
  text:
    "Sorry, your email could not be sent due to the following error:"
    semibold: "You did not type a subject."
footer_buttons:
  - "OK" (primary sm, autoFocus): closes dialog
close_paths: OK | header ✕ | overlay click
side_effect: keeps Email About Box dialog open underneath
```

### 4.5 Save Print Output Dialog (Windows-style, inline in `TaxReturnGeneration.tsx`)

Intentionally mimics the legacy Windows File Explorer "Save As"
window — the only dialog in the app that does **not** use the LVE
design language. Decorative chrome only; only the File name and
Save as type controls drive behavior.

```yaml
trigger: Print Error Log (auto-opens ~300ms after the log is rendered)
z_index: 50
width: max-w-640px
font_family: "Segoe UI, Tahoma, sans-serif"
title_bar:
  background: "#f0f0f0"
  text: "Save Print Output As"
  controls: [ minimize (–), maximize (▢), close ✕ — hover red #e81123 ]
address_bar:
  buttons: [ ←, →, ↑ ]   # decorative
  breadcrumb: "📁 › This PC › Documents"
  search_field: "🔍 Search Documents"
toolbar:
  - "Organize ▾"
  - "New folder"
sidebar:                                # decorative; no click handlers
  - "💻 This PC"   (bold)
  - 3D Objects
  - Desktop
  - Documents     [active highlight #cce8ff border #99d1ff]
  - Downloads
  - Music
  - Pictures
  - Videos
  - Global (G:)
  - Home (H:)
file_list:                              # decorative mock entries
  columns: [Name, Date modified, Type]
  rows:
    - 📁 Completion and Annual Statements   6/19/2025 1:56 PM   File folder
    - 📁 Custom Office Templates            1/31/2025 7:46 AM   File folder
    - 📁 OneNote Notebooks                  9/5/2025 1:04 PM    File folder
    - 📁 SQL Server Management Studio       12/8/2025 6:10 AM   File folder
    - 📁 Visual Studio 2017                 12/8/2025 6:09 AM   File folder
    - 📕 Clanad Policies.pdf                2/18/2026 3:28 PM   Microsoft Edge
    - 📕 Error list.pdf                     2/10/2026 1:51 PM   Microsoft Edge
controls:
  - file_name:
      initial_value: ""        # always empty when dialog opens
      autoFocus: true
      keys: { Enter: Save, Escape: Cancel }
  - save_as_type:
      default: PDF              # always defaults to PDF
      options:
        - "FADV Document (*.FADV)"  -> ext .FADV, mime application/octet-stream
        - "PDF Document (*.pdf)"    -> ext .pdf,  mime application/pdf
        - "Text Document (*.txt)"   -> ext .txt,  mime text/plain
footer:
  - "▲ Hide Folders"   # decorative
  - actions:
      - "Save"   (Windows-styled): handleSavePrintOutput()
      - "Cancel" (Windows-styled): close
close_paths_no_save: Cancel | header ✕ | overlay click
on_Save:
  - if file_name is empty/whitespace -> no-op (button is inert, dialog stays open)
  - else:
      filename = name + (auto-append .<type> if missing, case-insensitive)
      blob     = new Blob([pendingReportText], { type: mime })
      trigger browser download via <a download> click
      revoke object URL after 1s
      close dialog
      append log row: success "[HH:MM:SS] Print output saved to <filename>"
```

---

## 5. Flows

### 5.1 Run

```text
[ ▶ Run ]
   │
   ▼
Run Error Dialog (always; log area unchanged)
   │
   ▼
[ OK ] / ✕ / overlay click  ──▶ dialog closes
```

### 5.2 Print Error Log

```text
[ ⚠ Print Error Log ]
   │
   ▼
Replace log area entirely with:
   "*** ERROR LOG FOR <DD/MM/YYYY HH:MM:SS> ***"
   "x" * 80   (×8 lines)            ← all rendered red, prefixed by [HH:MM:SS]
   │
   ▼ (~300ms)
Save Print Output Dialog (file_name = "", save_as_type = "PDF")
   │
   ├─ Cancel / ✕ / overlay click ─▶ dialog closes (no download)
   └─ Save
        │ name blank? ──Yes──▶ no-op (button inert)
        │ name set
        ▼
        Browser downloads <name>.<FADV|pdf|txt>
        │
        ▼
        Log area appends:  "[HH:MM:SS] Print output saved to <filename>"
```

### 5.3 About / Email / Information

```text
[ ⓘ About ]
   │
   ▼
About Dialog
   ├─▶ ⧉ Copy To Clip ─▶ navigator.clipboard.writeText(...)
   │                       └─ label flips to "✓ Copied" for 2s
   ├─▶ ✉ Email ─▶ Email About Box Dialog (Subject = "")
   │                 │
   │                 ├─▶ Cancel / ✕ / overlay ─▶ closes (no send)
   │                 └─▶ OK / Enter
   │                       │ subject empty?
   │                       │ ─Yes─▶ Information Dialog ("You did not type a subject.")
   │                       │            └─ OK / ✕ / overlay ─▶ returns to Email dialog
   │                       │ ─No──▶ programmatic mailto: anchor click
   │                                  to=it-helpdesk@lv.co.uk
   │                                  subject=<typed>
   │                                  body=greeting + about info + sign-off
   │                                  └─ Email dialog closes; Subject reset to ""
   └─▶ OK / ✕ / overlay ─▶ closes
```

### 5.4 Year selector

```text
[ 06 APR  | year ▲▼ ]
        ▲: year + 1   (no upper bound)
        ▼: year - 1   (disabled when year <= 2000)
Tax Year End label updates immediately to "05 APR <year+1>".
```

---

## 6. File Export

| Format | Triggered by                        | Implementation                                                                            |
| ------ | ----------------------------------- | ----------------------------------------------------------------------------------------- |
| FADV   | Save Print Output (type = FADV)     | `Blob([reportText], { type: 'application/octet-stream' })` + `<a download>` click         |
| PDF    | Save Print Output (type = PDF, default) | `Blob([reportText], { type: 'application/pdf' })` + `<a download>` click                 |
| TXT    | Save Print Output (type = TXT)      | `Blob([reportText], { type: 'text/plain' })` + `<a download>` click                       |

`reportText` is the full Print Error Log block (header + 8 lines of x's) joined by newlines. No PDF rendering library is used — the
"PDF" output is the raw text wrapped in a PDF mime-type blob, matching the legacy "Save Print Output" behavior of the desktop app
where the format is purely a file-extension hint.

---

## 7. State Model

```yaml
TaxReturnGeneration:
  year:               number   # default 2025; clamped >= 2000
  status:             "READY" | "RUNNING" | "COMPLETE" | "ERROR"   # currently always READY
  policyCount:        number   # always 0 in current build (rendered as 5-digit zero-padded)
  progress:           number   # 0..100; never set in current build
  logs:               LogEntry[]              # { timestamp, type: info|error|success, message }
  pendingReportText:  string   # body queued for Save Print Output download

  aboutOpen:          boolean
  runErrorOpen:       boolean
  saveDialogOpen:     boolean
  saveFilename:       string   # always reset to "" on dialog open
  saveType:           "FADV" | "PDF" | "TXT"   # always reset to "PDF" on dialog open

  refs:
    logContainerRef:  HTMLDivElement   # used to auto-scroll to bottom on new log
    runningRef:       boolean          # legacy; not exercised in current build

AboutDialog:
  copied:        boolean    # true for 2s after Copy To Clip success
  emailOpen:     boolean    # nested Email About Box dialog
  emailSubject:  string     # always starts ""; reset to "" after a successful send
  emailError:    boolean    # nested Information dialog (subject missing)

  static_aboutInfo:
    product:          "Tax Returns"
    version:          "1.0.0.43"
    executable:       "\\\\whynvap13\\UAT\\Tax_Returns\\Exe\\TaxReturns.exe"
    workingDirectory: "H:\\"
    environment:      "BDE is not used"
    user:             "UAT3"
    workstation:      "WHYNVCX16"
    system:           "Windows NT 5.2 (Build 3790: Service Pack 2)"
    memory:           "2,097,152 KB"
```

---

## 8. Design Notes

- **Header** uses navy `#00263e` with white LV= logo, "Annuity Tax Returns" title (Livvic), and a ghost Logout button. 142px horizontal rails are reused by the footer and the main content area.
- **Footer** is a thin white bar with the LV= logo on the left and a two-line address block on the right.
- **Primary buttons (LveButton default):** background `#006cf4`, hover `#003578`, pill (`rounded-24px`), Livvic, shadow-md.
- **Secondary buttons (LveButton secondary):** white background, `#04589b` border + bold text; on hover fill `#003578` with white text.
- **Disabled buttons:** `#979797` background, white text, no pointer events.
- **YearSelector** input uses a 1px `#BBBBBB` border, hover/focus border `#178830` (the LVE green), Mulish 13px text, white background; the spinner buttons use `#006cf4` glyphs.
- **Output log area** is a navy `#00263e` block with monospace 11px text; rows are colored by type (slate-300 / `#d72714` / `#178830`) and are prefixed with a slate-500 `[HH:MM:SS]` timestamp.
- **Run Error Dialog** uses the LVE design language: navy header with red error icon and white title, a soft-red icon halo (`#fdecea`), and a primary OK button in a footer with a `#f7f9fb` strip.
- **About Dialog** uses the LVE design language too: navy header, clean white card, rounded panels, and primary/secondary LveButtons in the footer.
- **Information Dialog** mirrors the About dialog's title strip (`#00263e`, "Information"), with a soft-blue MdInfo icon and an LveButton OK.
- **Save Print Output Dialog** intentionally breaks from LVE — Segoe UI typography, gray `#f0f0f0` chrome, blue `#0078d7` focus borders, red `#e81123` close-button hover — to faithfully recreate the Windows save dialog the legacy app surfaces.
- **All modals** use a 40% black backdrop and a white card with `rounded-10px` corners and `shadow-2xl`, except the Save Print Output dialog which is borderless square chrome.

---

## 9. What is intentionally **not** in the app

- No tabs, no router, no second screen.
- No real backend, API calls, database, or authentication.
- No tax-return processing simulation: clicking **Run** never starts a job and never writes to the log area.
- No `RUNNING` / `COMPLETE` reachable state, no progress bar in practice, and no policy counts above `00000`.
- No printer integration: `Print Error Log` does not call `window.print()`; instead it surfaces the legacy Save dialog.
- Save Print Output sidebar/breadcrumb/file list are decorative — no folder navigation actually happens.
- The Header `Logout` button is presentational only.
