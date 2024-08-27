import { App, Editor, MarkdownView, Plugin } from "obsidian";

export default class CountCheckboxesPlugin extends Plugin {
	async onload() {
		this.addCommand({
			id: "insert-checkbox-progress-bar",
			name: "Insert Checkbox Progress Bar for Vault",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.insertCheckboxProgressBarForVault(editor);
			},
		});

		this.addCommand({
			id: "insert-checkbox-progress-bar-current-file",
			name: "Insert Checkbox Progress Bar for Current File",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.insertCheckboxProgressBarForCurrentFile(editor, view);
			},
		});
	}

	async insertCheckboxProgressBarForVault(editor: Editor) {
		const files = this.app.vault.getMarkdownFiles();
		let uncheckedCount = 0;
		let checkedCount = 0;

		for (const file of files) {
			const content = await this.app.vault.cachedRead(file);

			// Match unchecked boxes (- [ ])
			const uncheckedMatches = content.match(/- \[ \]/g);
			if (uncheckedMatches) {
				uncheckedCount += uncheckedMatches.length;
			}

			// Match checked boxes (- [x])
			const checkedMatches = content.match(/- \[x\]/gi);
			if (checkedMatches) {
				checkedCount += checkedMatches.length;
			}
		}

		const totalCheckboxes = uncheckedCount + checkedCount;
		const progress =
			totalCheckboxes > 0 ? (checkedCount / totalCheckboxes) * 100 : 0;

		const progressBar =
			`<div class="progress-container">
                           <progress value="${progress}" max="100"></progress>
                         </div>\n` +
			`Checked: ${checkedCount} / Total: ${totalCheckboxes} (${progress.toFixed(
				2
			)}%)`;

		const cursorPos = editor.getCursor();
		editor.replaceRange(progressBar, cursorPos);
	}

	async insertCheckboxProgressBarForCurrentFile(
		editor: Editor,
		view: MarkdownView
	) {
		const content = view.data;
		let uncheckedCount = 0;
		let checkedCount = 0;

		// Match unchecked boxes (- [ ])
		const uncheckedMatches = content.match(/- \[ \]/g);
		if (uncheckedMatches) {
			uncheckedCount += uncheckedMatches.length;
		}

		// Match checked boxes (- [x])
		const checkedMatches = content.match(/- \[x\]/gi);
		if (checkedMatches) {
			checkedCount += checkedMatches.length;
		}

		const totalCheckboxes = uncheckedCount + checkedCount;
		const progress =
			totalCheckboxes > 0 ? (checkedCount / totalCheckboxes) * 100 : 0;

		const progressBar =
			`<div class="progress-container">
                           <progress value="${progress}" max="100"></progress>
                         </div>\n` +
			`Checked: ${checkedCount} / Total: ${totalCheckboxes} (${progress.toFixed(
				2
			)}%)`;

		const cursorPos = editor.getCursor();
		editor.replaceRange(progressBar, cursorPos);
	}
}
