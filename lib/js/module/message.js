export const message = {
    wrongValue: (valueName) => `DRAGON EDITOR - Wrong type value in "${valueName}".`,
    wrongURL: (name, url) => `DRAGON EDITOR - Wrong URL value { ${name} : "${url}" }`,
    wrongKey: (name, key) => `DRAGON EDITOR - Wrong key set "${name}" : { "${key}" : ... }`,
    apiNotWorking: "API server is not responding.",
    serverNotWorking: "Server is not responding.",
    wrongItemStructure: "This block structure is broken, But we fixed it. Try again please.",
    missingSelect: "Missing block. Please select block.",
    noContentData: (lang) => `Language "${lang}" is didn't have content. Did you want duplicate to content?`,
};
