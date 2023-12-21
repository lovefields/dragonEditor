type DEMode = "view" | "edit";

interface DEditorData {
    type: string;
}

interface DEditorOption {
    mode?: DEMode;
}
