# BACS Payments — Application Digest

## 1. Application

| Field         | Value                                                                                                                                                                                                                |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name          | BACS Payments                                                                                                                                                                                                        |
| Version       | 1.0.0                                                                                                                                                                                                                |
| Type          | Static web app (no backend) — recreation of legacy Windows desktop tool                                                                                                                                              |
| Description   | Liverpool Victoria Friendly Society Limited internal tool for previewing, validating, exporting and committing BACS payment files across 9 tabs (8 payment workflows plus a Parameters tab). Built with React + Vite, deployable as a static site. |
| Framework     | React 18 + Vite + TypeScript                                                                                                                                                                                         |
| Styling       | Tailwind CSS                                                                                                                                                                                                         |
| Icons         | react-icons (Material Design)                                                                                                                                                                                        |
| PDF / QRP     | jspdf + html2canvas, custom QRP serializer                                                                                                                                                                           |
| Routing       | Single-page, tabbed (Radix Tabs)                                                                                                                                                                                     |

### Fonts

- **Heading:** Livvic
- **Body:** Mulish

### Brand colors

| Token         | Hex        | Usage                                |
| ------------- | ---------- | ------------------------------------ |
| primary_blue  | `#04589b`  | Secondary button border / text       |
| deep_blue     | `#003578`  | Hover fill for both button variants  |
| navy          | `#00263e`  | Header bar, modal title bars         |
| accent_blue   | `#006cf4`  | Primary buttons                      |
| title_blue    | `#002f5c`  | Report titles, table header text     |
| gray_border   | `#BBBBBB`  | Modal / card borders                 |
| text          | `#3d3d3d`  | Body text                            |
| muted         | `#979797`  | Disabled button border / text        |
| row_zebra     | `#e7ebec34`| Alternate table rows                 |

---

## 2. Global Components

### 2.1 Header (`BacsHeader`)

```yaml
sticky: false
background: "#00263e"
height: 64px
left:
  - logo: "LV="
  - title: "BACS Payments for Liverpool Victoria Friendly Society Limited"
right:
  - logout_button: { shape: pill, variant: outline-on-dark }
```

### 2.2 Global Filters Bar (visible on all tabs)

```yaml
background: white
elements:
  - completion_start_date: { control: DateInput, format: dd/mm/yyyy }
  - completion_end_date:   { control: DateInput, format: dd/mm/yyyy }
  - show_payments_button:  { variant: secondary, action: WarningDialog -> populate active grid }
  - print_report_button:   { variant: secondary, action: WarningDialog -> ReportPrintModal }
```

### 2.3 Tab Bar

1. Tax Free
2. First and One Off Payments
3. Processed
4. Parameters
5. Monthly Differences
6. Maturities
7. Reports
8. FirstPayments MCP
9. Processed MCP

### 2.4 Footer

- Left: `LV=` logo
- Right: *Liverpool Victoria Friendly Society Limited, County Gates, Bournemouth BH1 2NF*

---

## 3. Screens (Tabs)

### 3.1 Tax Free

- **Columns:** Bank Sort Code · Bank Account No · `0` · TaxFreeCash · Bank Account Name · Bank Ref · `99` · C_DATE · Policy No · Tax
- **Totals bar:** Payments · Total Tax Free Cash
- **Actions:**
  - **Save To Bacs** — primary, disabled when no data → `SaveAsDialog (BACS)`

### 3.2 First and One Off Payments

- **Columns:** Sort Code · Acc No · `0` · Amount To Pay · Acc Name · Bank Ref · `99` · BACS Date · Policy No · Tax · Hash · Pay Method
- **Totals bar:** Payments · Total First Payments · Total Tax
- **Actions:**
  - **Save To Bacs** — primary, disabled when no data → `SaveAsDialog (BACS)`
  - **Save And Commit To BACS** — primary, disabled when no data → `handleSaveCommitBacs`

### 3.3 Processed

- **Tab filters:** Start Run Month · End Run Month · Payment Type *(B / C / T / R / All — default All)* · `[x] Include non-PAYE cases` · Show Payments · Print Report
- **Columns:** standard 12-column payment grid
- **Totals bar:** Payments · Total Net · Total Gross · Total Tax
- **Actions:**
  - **Save To Bacs** — disabled when `!showProcessed` → `openSaveAs(BACS)`
  - **Save And Commit To BACS** — disabled when `!showProcessed` → `handleSaveCommitBacs`
  - **Save To CSV** — disabled when `!showProcessed`, when enabled opens `SaveAsDialog (CSV)` **directly** (no preceding info dialog, no date check)

### 3.4 Parameters

A "system parameters" editor that mirrors the legacy desktop screen. Four
date fields are edited as a **draft** and committed via the toolbar.

- **Toolbar:**
  - `▲ Insert` — reserved (no-op in this static recreation)
  - `✓ Post` — commits all draft values; status reads *"Changes saved"*; disabled until there are unsaved drafts
  - `✗ Cancel` — reverts drafts to last-saved values; status reads *"Changes cancelled"*; disabled until there are unsaved drafts
  - `↻ Refresh` — reverts drafts to last-saved values and clears the status text
- **Fields (stacked label above input):**
  - `ARSTARTRUNMONTH` — default `01/05/2025`
  - `ARENDRUNMONTH`   — default `31/05/2025`
  - `ADSTARTRUNMONTH` — default `01/06/2025`
  - `ADENDRUNMONTH`   — default `24/06/2025`
- **Status field (read-only, centered below card):**
  - shows *"Unsaved changes — click ✓ to save"* whenever drafts ≠ committed
  - otherwise shows the most recent action ("Changes saved" / "Changes cancelled" / empty)
- **Per-edit behavior:**
  - Year ≥ 2026 → `ConfirmDialog` ("non-standard processing period") first; OK stages the change, Cancel reverts
  - Year < 2026 → change is staged immediately and `InfoDialog` *"If you wish to save the change, please click on the tick button"* is shown

### 3.5 Monthly Differences

- **Tab filters:** Start Run Month · End Run Month
- **Buttons:**
  - **Produce List** → populate grid
  - **Produce Nil-Income List** → `InfoDialog` (no records)
  - **Print Preview** → `PrintPreviewModal`
- **Columns:** Policy No · Current Date · Current Ref · Current Gross · Previous Date · Previous Ref · Previous Gross

### 3.6 Maturities

- **Columns:** 9-column maturity grid
- **Totals bar:** Payments · Total Maturity Payments
- **Actions:** **Save and Commit To Bacs**

### 3.7 Reports

- **Tab filters:** Start Run Month · End Run Month · `[x] Include non-PAYE cases`
- **Buttons:**
  - **Print First** → `FirstPaymentReportModal`
  - **Print Processed** → `ProcessedReportModal`

### 3.8 FirstPayments MCP

- **Columns:** standard 12-column payment grid
- **Totals bar:** Payments · Total First Payments · Total Tax
- **Actions:** **Save To Bacs** · **Save And Commit To BACS**

### 3.9 Processed MCP

- **Tab filters:** Start Run Month · End Run Month · Payment Type *(B / C / T / R / All — default All)* · `[x] Include non-PAYE cases`
- **Buttons:** **Show Payments** · **Print Report** (Print Report → InfoDialog "No Data found" until payments are shown)
- **Columns:** standard 12-column payment grid
- **Totals bar:** Payments · Total Tax Free Cash
- **Actions:** **Save And Commit To Bacs**

---

## 4. Modals & Dialogs

### 4.1 DateInput (`src/components/DateInput.tsx`)

| View   | Layout                                                                |
| ------ | --------------------------------------------------------------------- |
| Days   | Mon–Sun grid; out-of-month days shown with hatching                   |
| Months | 3 × 4 grid `1..12`; entered by clicking the month name in Days view   |
| Years  | 5 × 5 grid range; entered by clicking the year in Months view         |

### 4.2 SaveAsDialog — Windows 11 File Explorer (`src/components/SaveAsDialog.tsx`)

```yaml
style: Windows 11 File Explorer (Segoe UI Variable, Fluent)
width: 860px
triggers:
  - any "Save To Bacs" / "Save To CSV" button
  - 💾 toolbar button in any print modal
title_bar:
  text: "Save As"
  controls: [minimize, maximize, close (red hover)]
toolbar:
  nav: [Back, Forward (disabled), Up, Refresh]
  breadcrumb: "📁 This PC > Ual3 (H:) > Annuities"
  search: "Search Annuities"
left_nav:
  - Home
  - Gallery
  - OneDrive (expanded)
  - This PC:
      - Desktop
      - Documents
      - Downloads
      - Music
      - Pictures
      - Videos
      - "OS (C:)"
      - "Ual3 (H:)  [active]"
  - Network
file_list:
  columns: [Name, Date modified, Type, Size]
  selection_color: "#cfe4f7"
footer:
  - file_name: "input + dropdown chevron"
  - save_as_type:
      QRP:  "QuickReport file (*.QRP)"
      BACS: "BACS file (*.BACS)"
      CSV:  "Comma Separated Values (*.CSV)"
  - hide_folders_toggle
  - actions: [Save (primary blue), Cancel]
on_save: callback(filename) -> caller writes blob download
```

### 4.2b LoadReportDialog — Windows 11 Open Dialog (`src/components/LoadReportDialog.tsx`)

```yaml
style: Windows 11 File Explorer "Open" (mirrors SaveAsDialog visuals)
width: 860px
triggers:
  - 📂 "Load Report" toolbar button in:
      - PrintPreviewModal
      - ReportPrintModal
      - FirstPaymentReportModal
      - ProcessedReportModal
title_bar:
  text: "Load Report"
  controls: [minimize, maximize, close (red hover)]
toolbar:
  nav: [Back, Forward (disabled), Up, Refresh]
  breadcrumb: "📁 This PC > Ual3 (H:) > Annuities > Reports"
  search: "Search Reports"
left_nav: same as SaveAsDialog
file_list:
  columns: [Name, Date modified, Type, Size]
  rows: mock list of 9 saved *.qrp report files
  icon: 📄 MdInsertDriveFile (blue)
  interactions:
    single_click: select row + fill File name field
    double_click: load + close
  selection_color: "#cfe4f7"
footer:
  - file_name: input + dropdown chevron (placeholder: "Select a saved report or browse...")
  - files_of_type: "QuickReport file (*.QRP)" (display only)
actions:
  - "Browse this computer..."  -> hidden <input type=file accept=".qrp"> -> reads File.text() and calls onLoad(name, content)
  - Open   (primary blue)      -> onLoad(name) for selected/typed filename
  - Cancel                     -> close, no callback
on_load:
  signature: "(fileName: string, content?: string) => void"
  notes:
    - Static app: mock entries are visual only; real content arrives only via "Browse this computer..."
    - Parent modals currently consume the callback but do not yet swap their rendered report from loaded QRP content.
```

### 4.3 PrintPreviewModal (`src/components/PrintPreviewModal.tsx`)

Used by **Monthly Differences → Print Preview**.

```yaml
width: 1024px
header: "Print Preview" (navy bar, close)
toolbar:
  nav:    [⏮, ⏪, "1 of 1+", ⏩, ⏭]
  print:  "🖨 -> window.print()"
  save:   "💾 -> SaveAsDialog (QRP) -> downloadQrp(...)"
  load:   "📂 -> LoadReportDialog (.qrp open)"
  zoom:   [50%, 75%, 100%, 125%, 150%]
  status: Total / Zoom / Showing
body:
  class: print-area  # only this prints via @media print
  content: 11-column compare table
           (Policy / Ref / Paykey / Current.../Previous.../Type / % Change)
footer: none  # closed via header X; print/save/load are toolbar-only
```

### 4.4 ReportPrintModal (`src/components/ReportPrintModal.tsx`)

Used by header **Print Report** and the Tax Free / First Payments / Maturities / MCP report flows.

```yaml
toolbar:
  zoom_modes: [Fit, Actual, Width]
  nav: [⏮, ⏪, "Page x/N", ⏩, ⏭]
  ⚙ Printer Setup: PrintDialog
  🖨 Print:         window.print()
  💾 Save:          SaveAsDialog (QRP) -> downloadQrp(...)
  📂 Load Report:   LoadReportDialog (open .qrp)
body:
  class: print-area
  content: report header + table + totals + signature lines
           ("Checked by: ............    Authorised by: ............")
footer: none  # closed via header X; print/save are toolbar-only
notes:
  - Zoom-to-Width / Zoom-to-Fit reserve a 2px buffer in the zoom
    calculation so subpixel rounding does not produce a horizontal
    scrollbar in the preview area.
```

### 4.5 FirstPaymentReportModal (`src/components/FirstPaymentReportModal.tsx`)

Triggered from **Reports → Print First**.

- Multi-page paginated, page nav in toolbar
- **Save** → `SaveAsDialog (QRP)` → `downloadQrp(First_Payments_Report.qrp)`
- **Print** → `window.print()`
- **Printer Setup** → `PrintDialog`
- **Columns:** Bank Sort Code · Bank Account No · `0` · Bank Account Name · Bank Ref · `99` · Gross Ann · Amount To Pay · Tax · Policy Ref
- **Totals:** Count · Total Gross · Total Amount · Total Tax

### 4.6 ProcessedReportModal (`src/components/ProcessedReportModal.tsx`)

Triggered from **Reports → Print Processed**.

- **Save** → `SaveAsDialog (QRP)` → `downloadQrp(Payments_Report.qrp)`
- **Print** → `window.print()`
- **Printer Setup** → `PrintDialog`
- **Totals:** Count · Total Net · Total Gross · Total Tax

### 4.7 PrintDialog (`src/components/PrintDialog.tsx`)

Windows 11 Fluent styled.

```yaml
sections:
  printer:
    - name: dropdown
    - properties_button
    - status / type / where / comment
  print_range:
    - radio: All
    - radio: "Pages from [_] to [_]"
    - radio: Selection
  copies:
    - number: 1
    - collate: "checkbox + page-icon illustrations"
actions: [OK, Cancel]
```

### 4.8 InfoDialog (title **DoBacs**)

`ℹ message [OK]` — used for:

- "No data found"
- "Completion Start Date and End Date cannot be in the past."
- "No BACS payments present."
- "From and To date should not be in past date to save the BACS file."
- Nil-Income empty result
- Parameters tab — "If you wish to save the change, please click on the tick button" (after editing a date with year < 2026)

### 4.9 ConfirmDialog (`src/components/ConfirmDialog.tsx`, title **Confirm**)

LVE-styled confirmation dialog (navy `#00263e` title bar, white card,
pill OK / Cancel buttons, soft-blue help icon). Used by the
**Parameters** tab whenever a date field is changed to a year ≥ 2026
(non-standard processing period).

```yaml
title: "Confirm"
message: "The date entered is for a non-standard processing period. Is this correct?"
icon: MdHelpOutline (blue circle)
buttons:
  OK:     primary (filled #006cf4 -> hover #003578) — stages the new value into the draft
  Cancel: secondary (outline #04589b)               — keeps the previous draft value
header_X: behaves as Cancel
z_index: 60   # above other modals/popovers
```

### 4.10 WarningDialog (title **BACS Payments**)

`⚠ message [Yes] [No]` — used for:

- Show Payments confirmation
- Print Report confirmation
- "Some of the payments have already been committed. Would you like to exclude these payments?"

---

## 5. Flows

### 5.1 Show Payments

```text
[ Show Payments ]
   │
   ▼
WarningDialog ──No──▶ dismiss
   │ Yes
   ▼
populate active tab grid
```

### 5.2 Print Report

```text
[ Print Report ]
   │
   ▼
WarningDialog ──No──▶ dismiss
   │ Yes
   ▼
ReportPrintModal
   ├─ ⚙ -> PrintDialog
   ├─ 🖨 -> window.print()
   └─ 💾 -> SaveAsDialog (QRP) -> downloadQrp -> browser download
```

### 5.3 Save To Bacs

```text
[ Save To Bacs ]   (disabled when no data)
   │
   ▼
openSaveAs(BACS):
   │
   ├─ dates in past? ──Yes──▶ InfoDialog
   │                          "Completion Start Date and End Date cannot be in the past."
   │ No
   ▼
SaveAsDialog (BACS)
   │ Save
   ▼
browser download .BACS file
```

### 5.4 Save To CSV (Processed tab)

```text
[ Save To CSV ]   (disabled when !showProcessed)
   │ enabled
   ▼
SaveAsDialog (CSV)        ← opens directly, no info dialog, no date check
   │ Save
   ▼
browser download .CSV file
```

### 5.5 Save And Commit To BACS

```text
[ Save And Commit To BACS ]
   │
   ▼
tab has data? ──No──▶ InfoDialog "No BACS payments present."
   │ Yes
   ▼
commit conflict? (1 in 3) ──Yes──▶ WarningDialog (exclude already-committed?)
   │ No
   ▼
InfoDialog "From and To date should not be in past date to save the BACS file."
```

### 5.6 Monthly Differences

```text
[ Produce List ]              ─▶ grid populated
[ Produce Nil-Income List ]   ─▶ InfoDialog (no records)
[ Print Preview ]             ─▶ PrintPreviewModal
                                   ├─ 🖨 -> window.print()
                                   └─ 💾 -> SaveAsDialog (QRP) -> downloadQrp
```

### 5.7 Reports tab

```text
[ Print First ]      ─▶ FirstPaymentReportModal ─▶ { ⚙ PrintDialog | 🖨 print | 💾 SaveAsDialog QRP | 📂 LoadReportDialog }
[ Print Processed ]  ─▶ ProcessedReportModal    ─▶ { ⚙ PrintDialog | 🖨 print | 💾 SaveAsDialog QRP | 📂 LoadReportDialog }
```

### 5.8 Parameters tab

```text
edit AR/AD date field
   │
   ▼
isNonStandardDate(value)?  (year >= 2026)
   │ Yes                                        │ No
   ▼                                            ▼
ConfirmDialog                              stage value into draftParams
   ├─ Cancel ─▶ keep previous draft         InfoDialog "click ✓ to save"
   └─ OK     ─▶ stage value into draftParams
                InfoDialog "click ✓ to save"

[ ✓ Post ]    ─▶ commit draftParams to ar/ad state; status = "Changes saved"
[ ✗ Cancel ]  ─▶ draftParams := committedParams; status = "Changes cancelled"
[ ↻ Refresh ] ─▶ draftParams := committedParams; status cleared
[ ▲ Insert ]  ─▶ reserved (no-op)
```

---

## 6. Print Behaviour

- Strategy: CSS `@media print`
- Rules:
  - `body * { visibility: hidden; }`
  - `.print-area, .print-area * { visibility: visible; }`
  - `.print-area` positioned absolute at top-left, `zoom: 1`
  - Elements with `.no-print` are hidden
- Result: only the report page renders; modal chrome, toolbars and the app shell are excluded automatically.

---

## 7. File Export

### QRP (`src/lib/saveQrp.ts`)

- Function: `downloadQrp(report, filename)`
- Format:

  ```text
  QRP/1.0
  TITLE   <title>
  RANGE   <dateRange>
  COLUMNS <label1>  <label2>  ...
  ROW     <cell1>   <cell2>   ...
  ROW     ...
  TOTAL   <label>   <value>
  ...
  END
  ```

### PDF (`src/lib/savePdf.ts`)

- Dependencies: `jspdf`, `html2canvas`

### CSV

- Triggered from **Save To CSV** (Processed tab) via `SaveAsDialog`

### BACS

- Triggered from **Save To Bacs** in multiple tabs

---

## 8. State Model

```yaml
global:
  - completionStart, completionEnd          # dd/mm/yyyy strings
  - activeTab                               # one of 9 tab ids
  - showData, showProcessed,
    showProcessedMcp, showMonthlyDiff,
    showNilIncome                           # per-tab "data populated" flags
  - saveAsOpen, saveAsType (BACS|CSV|QRP)   # SaveAsDialog state
  - loadOpen                                # LoadReportDialog state (per print modal)
  - noDataOpen, noDataMessage               # InfoDialog state (also reused for "click ✓ to save" reminder)
  - commitWarningOpen                       # WarningDialog state for commits
  - paymentType                             # default "All", options: B|C|T|R|All
parameters_tab:
  - arStartRunMonth, arEndRunMonth,
    adStartRunMonth, adEndRunMonth          # committed values (defaults: 01/05/2025, 31/05/2025, 01/06/2025, 24/06/2025)
  - draftParams: { arStart, arEnd, adStart, adEnd }   # editable draft mirror of the four committed values
  - paramsDirty                             # derived: true when any draft != committed
  - paramsStatus                            # "" | "Changes saved" | "Changes cancelled" (status field text)
  - nonStandardConfirm:
      open: boolean
      pending: { key: ParamKey, previous: string, next: string } | null
```

---

## 9. Design Notes

- Header uses navy `#00263e` with white `LV=` logo and Logout pill.
- **Primary buttons:** background `#006cf4`, hover `#003578`, pill shape (`rounded-30px`).
- **Secondary buttons:** white background, `#04589b` border + text; on hover fill navy `#003578` with white text.
- **Disabled buttons:** white background, gray `#979797` border + text.
- **Tables:** zebra rows `#e7ebec34`; full-row hover `#05579B` with white text.
- **Print modals:** open over a 40% black backdrop, `shadow-2xl`, 12px radius.
- **SaveAsDialog, LoadReportDialog and PrintDialog** match Windows 11 Fluent visuals: Segoe UI Variable, 4px corner radius, accent `#0067c0`, light Mica grey `#f3f3f3`.
- **InfoDialog and ConfirmDialog** follow the LVE design language: navy `#00263e` title bar, white card with 12px radius and `border-[#BBBBBB]` border, pill OK / Cancel buttons in brand blues.
- **Parameters tab toolbar buttons (▲ ✓ ✗ ↻):** 32×36, white background, `#BBBBBB` border, 4px radius, `#3d3d3d` glyph, hover `#f0f0f0`. ✓ and ✗ fade to 40% opacity and become non-clickable when there are no unsaved drafts.
- **DateInput `stacked` variant** (used in Parameters): renders the label above the input as small uppercase grey text (`text-[11px] tracking-wide uppercase text-[#5f5f5f]`) instead of the default inline label.
