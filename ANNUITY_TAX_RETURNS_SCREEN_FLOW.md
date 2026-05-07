# Annuity Tax Returns — Screen Flow (ASCII)

This document captures every screen, panel, modal and dialog in the
**Annuity Tax Returns** static web app, plus the navigation paths
between them. The app is a modernised, browser-based recreation of
the legacy desktop "Tax Return Generation" tool used inside LV=.

Legend: `[ Button ]`, `[ field ]`, `[v]` = dropdown / picker,
`( )` = radio, `[x]` = checkbox.

---

## 1. Application Shell (always visible)

The app is a single-page experience: a fixed header, a single main
panel, and a fixed footer. There are no tabs and no routes — the
"Tax Return Generation" panel is the only screen.

```
+--------------------------------------------------------------------------------------------------+
| [LV=]  Annuity Tax Returns                                                            [ Logout ] |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|                            <<<  Tax Return Generation panel  >>>                                 |
|                                                                                                  |
+--------------------------------------------------------------------------------------------------+
| [LV=]                              Liverpool Victoria Financial Services Limited                 |
|                                    County Gates, Bournemouth BH1 2NF                             |
+--------------------------------------------------------------------------------------------------+
```

* Header: navy `#00263e` bar, vertically-centered LV= logo + "Annuity
  Tax Returns" title (Livvic), `Logout` button on the right. 142px
  horizontal padding.
* Footer: white bar, LV= logo on the left, two-line address block on
  the right (8px slate text). 142px horizontal padding.
* The `Logout` button is currently a no-op visual element only.

---

## 2. Tax Return Generation Panel

The single working screen. Rendered as a white card centered inside
the main content area.

```
+----------------------------------------------------------------------------+
|  Tax Return Generation                                                     |
|                                                                            |
|  Tax Year Start                       Tax Year End                         |
|  06 APR  [ 2025 ▲▼ ]                  05 APR 2026                          |
|                                                                            |
|  [ ▶ Run ]                                                                 |
|                                                                            |
|  Status: READY            Policies: 00000                                  |
|                                                                            |
|  [ ⚠ Print Error Log ]   [ ⓘ About ]                                       |
|                                                                            |
|  +----------------------------------------------------------------------+  |
|  |  (navy log area, monospace)                                          |  |
|  |                                                                      |  |
|  |        Output log will appear here when you run the process          |  |
|  |                                                                      |  |
|  |                                                                      |  |
|  +----------------------------------------------------------------------+  |
+----------------------------------------------------------------------------+
```

### Field & control behavior

| Control                | Behavior                                                                                          |
|------------------------|---------------------------------------------------------------------------------------------------|
| `Tax Year Start`       | Read-only label `06 APR ` followed by the **YearSelector** spinner (no year shown beside `06 APR`). |
| YearSelector ▲         | Increments year by 1 (no upper bound).                                                            |
| YearSelector ▼         | Decrements year by 1. Disabled when `year ≤ 2000` (cannot go below 2000).                         |
| `Tax Year End`         | Computed as `05 APR <year + 1>` (display only).                                                   |
| `Run`                  | Always opens the **Run Error** dialog (see §3A). Does **not** populate the log area.              |
| `Print Error Log`      | Replaces log area with the fixed error report (see §2.1) and opens the **Save Print Output** dialog (see §3D). |
| `About`                | Opens the **About** dialog (see §3B).                                                             |
| Status pill            | One of `READY` (green), `RUNNING` (blue), `COMPLETE` (green), `ERROR` (red). Currently only `READY` is reachable. |
| Policies counter       | Always `00000` in the current build.                                                              |
| Log area               | Empty state shows placeholder text. Otherwise renders timestamped lines, colored by `info / error / success`. |

### 2.1 Log area after `Print Error Log`

Replaces the entire log area (any previous content is cleared) with
a fixed 9-line block — a header followed by 8 rows of `x`'s — all
rendered in red:

```
+----------------------------------------------------------------------+
| [HH:MM:SS]  *** ERROR LOG FOR DD/MM/YYYY HH:MM:SS ***                |
| [HH:MM:SS]  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx |
| [HH:MM:SS]  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx |
| [HH:MM:SS]  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx |
| [HH:MM:SS]  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx |
| [HH:MM:SS]  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx |
| [HH:MM:SS]  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx |
| [HH:MM:SS]  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx |
| [HH:MM:SS]  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx |
+----------------------------------------------------------------------+
```

* `DD/MM/YYYY HH:MM:SS` is the system clock at the moment the button
  was clicked.
* The same text (without bracketed timestamps) becomes the body of
  the Save Print Output download.

---

## 3. Modals & Dialogs

All modals are rendered above a `bg-black/40` overlay; clicking the
overlay closes the dialog (except where noted).

### 3A. Run Error Dialog

Triggered only by clicking **Run** on the main panel. Always shows
the same hard-coded error — the legacy "file not found" message — with
the current selected `year` interpolated into the path.

```
+--------------------------------------------------------------+
|  ⓧ Error                                              ✕      |
+--------------------------------------------------------------+
|                                                              |
|   ⓧ   There has been a problem, please notify Help Desk.     |
|       Cannot open file                                       |
|       \\whynvap13\UAT\Tax_Returns\Exe\<year>\QryTaxReturn.txt|
|       . The system cannot find the path specified.           |
|                                                              |
+--------------------------------------------------------------+
|                                                  [   OK   ]  |
+--------------------------------------------------------------+
```

* Header: navy `#00263e` strip with red `ⓧ` icon and white "Error"
  title (Livvic).
* Body: red circular icon + LVE-styled message; the file path is
  highlighted in a red pill.
* `OK` (LveButton, primary) and the header `✕` and overlay click all
  close the dialog. `OK` is auto-focused.

### 3B. About Dialog

Opened from the **About** button on the main panel.

```
+----------------------------------------------------------------+
|  About                                                  ✕      |
+----------------------------------------------------------------+
|                                                                |
|   [LV= logo]                              Tax Returns          |
|                                          Version 1.0.0.43      |
|                                                                |
|              Executable: \\whynvap13\UAT\Tax_Returns\Exe\TaxReturns.exe |
|       Working directory: H:\                                    |
|             Environment: BDE is not used                        |
|                    User: UAT3                                   |
|             Workstation: WHYNVCX16                              |
|   ----------------------------------------------------------    |
|   Windows NT 5.2 (Build 3790: Service Pack 2)                   |
|   Memory available to Windows: 2,097,152 KB                     |
|   ----------------------------------------------------------    |
|                       [ ⧉ Copy To Clip ]  [ ✉ Email ]  [ OK ]   |
+----------------------------------------------------------------+
```

* Header: navy strip, "About" title, `✕` close button.
* The product name, version, and all info rows match the legacy
  desktop screenshot exactly (these are static values).
* `Copy To Clip` writes the formatted info block to the clipboard
  and momentarily flips its label/icon to `✓ Copied` for 2s.
* `Email` opens the **Email About Box** dialog (§3C).
* `OK`, header `✕`, overlay click — all close the dialog.

### 3C. Email About Box Dialog

Opened from the **Email** button inside the About dialog. Stacked
above the About dialog (`z-60`).

```
+--------------------------------------------------------+
|  Email About Box contents to IT                  ✕     |
+--------------------------------------------------------+
|  Subject:                                              |
|  [ Press cancel to abort.                             ]|
|                                                        |
|                                  [ Cancel ]   [ OK ]   |
+--------------------------------------------------------+
```

* The `Subject` field starts **empty**; the placeholder reads
  `Press cancel to abort.`
* The field auto-focuses. `Enter` triggers `OK`. `Escape` triggers
  Cancel.
* `Cancel`, header `✕`, overlay click — close the dialog without
  sending.
* `OK` validates the subject:
  * Empty/whitespace → opens the **Information** dialog (§3C-i).
  * Non-empty → builds a `mailto:` URL with:
    * **To:** `it-helpdesk@lv.co.uk`
    * **Subject:** the typed subject
    * **Body:** a greeting plus all About fields, one per line
  * The URL is opened via a programmatic anchor click, which
    launches the user's default mail handler (Outlook on Windows).
  * The dialog closes and the Subject field is reset.

### 3C-i. Information Dialog (subject missing)

Stacked above both About and Email dialogs (`z-70`).

```
+----------------------------------------------------+
|  Information                                  ✕    |
+----------------------------------------------------+
|  ⓘ  Sorry, your email could not be sent due to    |
|     the following error:                           |
|     You did not type a subject.                    |
|                                                    |
|                                          [  OK  ]  |
+----------------------------------------------------+
```

* Auto-focuses `OK`. `OK`, header `✕`, overlay click — close the
  dialog and return to the Email dialog (subject still in focus).

### 3D. Save Print Output Dialog (Windows File Explorer style)

Opened automatically ~300ms after **Print Error Log** is clicked.
Visually mimics a classic Windows "Save As" file picker — sidebar
tree, file list, address bar, file-name + type controls.

```
+------------------------------------------------------------------------------------+
|  Save Print Output As                                          _    ▢    ✕         |
+------------------------------------------------------------------------------------+
|  ←  →  ↑  | 📁 › This PC › Documents                  | 🔍 Search Documents       |
+------------------------------------------------------------------------------------+
|  Organize ▾   New folder                                                           |
+------------------------------------------------------------------------------------+
| 💻 This PC                  | Name                          Date modified   Type   |
|   🖥 3D Objects             |---------------------------------------------------    |
|   🖥 Desktop                | 📁 Completion and Annual...   6/19/2025 1:56 PM ...  |
|   📄 Documents  [active]    | 📁 Custom Office Templates    1/31/2025 7:46 AM ...  |
|   ⬇ Downloads               | 📁 OneNote Notebooks          9/5/2025 1:04 PM ...   |
|   🎵 Music                  | 📁 SQL Server Management ...  12/8/2025 6:10 AM ...  |
|   🖼 Pictures               | 📁 Visual Studio 2017         12/8/2025 6:09 AM ...  |
|   🎬 Videos                 | 📕 Clanad Policies.pdf        2/18/2026 3:28 PM ...  |
|   💾 Global (G:)            | 📕 Error list.pdf             2/10/2026 1:51 PM ...  |
|   💾 Home (H:)              |                                                       |
+------------------------------------------------------------------------------------+
|  File name:    [                                                  ]                |
|  Save as type: [ PDF Document (*.pdf)                          v ]                 |
+------------------------------------------------------------------------------------+
|  ▲ Hide Folders                                       [ Save ]   [ Cancel ]        |
+------------------------------------------------------------------------------------+
```

* Title bar: gray `#f0f0f0` strip, hover-red `✕` close button.
* Sidebar / file list / toolbar are decorative only — clicking any
  row does nothing.
* `File name` field is **empty** when the dialog opens and is
  auto-focused.
* `Save as type` defaults to **PDF Document (*.pdf)**. Other options:
  * `FADV Document (*.FADV)`
  * `Text Document (*.txt)`
* `Enter` triggers Save. `Escape` triggers Cancel.
* `Save` (LVE-style "win" button):
  * No-ops when the file name is blank/whitespace.
  * Otherwise downloads the error log report as
    `<name>.<ext>` (extension auto-appended if missing) and
    appends a green `success` line to the log area:
    `Print output saved to <filename>`.
* `Cancel`, header `✕`, overlay click — close without saving.

---

## 4. Navigation / Flow Diagrams

### 4.1 Run button

```
   [ ▶ Run ]
        │
        ▼
   Run Error Dialog (always shown, log area unchanged)
        │
        ▼
   [ OK ] / ✕ / overlay click  ──▶ dialog closes
```

### 4.2 Print Error Log

```
   [ ⚠ Print Error Log ]
        │
        ▼
   Log area replaced with:
       *** ERROR LOG FOR <stamp> ***
       xxxxxxxx... (×8)
        │
        ▼ (~300ms)
   Save Print Output Dialog
        │
   ┌────┴────────────────────┐
   ▼                         ▼
 [ Save ]                  [ Cancel ] / ✕ / overlay
   │                         │
   │ name blank? ──Yes──▶ no-op (button stays inert)
   │   │ No
   │   ▼
   │ Browser download <name>.<FADV|pdf|txt>
   │   │
   │   ▼
   │ Log area appends:
   │   "[HH:MM:SS] Print output saved to <filename>"
   ▼
 dialog closes
```

### 4.3 About / Email / Information

```
   [ ⓘ About ]
        │
        ▼
   About Dialog
   ├─▶ [ ⧉ Copy To Clip ] ─▶ writes formatted info to clipboard
   │                          (label flips to "✓ Copied" for 2s)
   ├─▶ [ ✉ Email ] ─▶ Email About Box Dialog
   │                       │
   │                       ├─▶ [ Cancel ] / ✕ / overlay ─▶ closes
   │                       └─▶ [ OK ] / Enter
   │                              │
   │                              ├─ subject blank? ──Yes──▶ Information Dialog
   │                              │                           (subject missing)
   │                              │                                │
   │                              │                                ▼
   │                              │                          [ OK ] ─▶ closes
   │                              └─ subject filled ──▶ launches mailto:
   │                                                       it-helpdesk@lv.co.uk
   │                                                       (default mail client)
   │                                                       and Email dialog closes
   └─▶ [ OK ] / ✕ / overlay click ─▶ About Dialog closes
```

### 4.4 YearSelector

```
   [ 2025 ▲▼ ]
        │
   ┌────┴────┐
   ▼         ▼
   ▲         ▼
 year+1    year-1   (disabled when year ≤ 2000)
```

---

## 5. Cross-cutting Components

| Component                | Triggered By                          | Result                                                                 |
|--------------------------|---------------------------------------|------------------------------------------------------------------------|
| Run Error Dialog         | `Run` on the main panel               | Shows the legacy "file not found" error with current year in the path  |
| About Dialog             | `About` on the main panel             | Static legacy About info; Copy / Email / OK actions                    |
| Email About Box Dialog   | `Email` inside About                  | Captures a Subject and launches the user's default mail client          |
| Information Dialog       | Submitting Email with empty Subject    | "You did not type a subject." OK to dismiss                            |
| Save Print Output Dialog | `Print Error Log` on the main panel   | Windows-style file picker; Save downloads the report as the chosen type |
| YearSelector             | Tax Year Start                         | Spinner input bounded at 2000 on the lower end, no upper bound          |
| Header / Footer          | Always                                 | Brand navy header (logo + title + Logout); white footer (logo + address) |

---

## 6. Notes on the current build

* The app is a **single static screen** — there are no tabs, no
  routes, no API calls, and no real backend. It is intentionally a
  modernised re-skin of the legacy desktop tool.
* `Status` is hard-wired to `READY`; the `RUNNING` / `COMPLETE`
  branches and the progress bar are not currently reachable, since
  `Run` immediately surfaces the Run Error Dialog and never starts
  any simulated processing.
* `Policies` counter is always `00000` for the same reason.
* `Logout` in the header is presentational only.
* All mock content in the Save Print Output dialog (sidebar entries,
  file list, address bar) is purely decorative — only `File name`
  and `Save as type` drive the actual download.
