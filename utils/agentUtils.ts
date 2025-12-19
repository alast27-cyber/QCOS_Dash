
// --- Type Definitions ---
export interface Message {
  sender: 'user' | 'ai';
  text: string;
  attachment?: {
    name: string;
  };
}


// --- Utility Functions ---
export const fileToText = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.onerror = (error) => reject(error);
    });

export const processZipFile = async (file: File): Promise<string> => {
    const JSZip = (window as any).JSZip;
    if (!JSZip) {
        throw new Error("JSZip library is not loaded. Please ensure the CDN script is in index.html.");
    }
    const jszip = new JSZip();
    const zip = await jszip.loadAsync(file);
    
    let extractedContent = `--- Contents of ZIP file: ${file.name} ---\n\n`;
    const textFilePromises: Promise<void>[] = [];
    const binaryFiles: string[] = [];

    const isTextFile = (filename: string): boolean => {
        const textExtensions = [
            '.txt', '.md', '.json', '.csv', '.py', '.js', '.ts', '.tsx', '.html', '.css', 
            '.q-lang', '.xml', '.yaml', '.yml', '.ini', '.log', '.sh', '.bat', '.java', 
            '.c', '.cpp', '.h', '.hpp', '.rs', '.go', '.php', '.rb', '.pl', '.sql'
        ];
        return textExtensions.some(ext => filename.toLowerCase().endsWith(ext));
    };

    zip.forEach((_, zipEntry) => {
        if (!zipEntry.dir && isTextFile(zipEntry.name)) {
            const promise = zipEntry.async('string').then(content => {
                const truncatedContent = content.length > 20000 ? content.substring(0, 20000) + "\n... (file truncated due to size) ..." : content;
                extractedContent += `--- File: ${zipEntry.name} ---\n${truncatedContent}\n\n`;
            });
            textFilePromises.push(promise);
        } else if (!zipEntry.dir) {
            binaryFiles.push(zipEntry.name);
        }
    });

    await Promise.all(textFilePromises);
    
    if (binaryFiles.length > 0) {
        extractedContent += `--- Binary/Unsupported Files (contents not included): ---\n${binaryFiles.join('\n')}\n\n`;
    }

    extractedContent += `--- End of ZIP file contents ---`;
    return extractedContent;
};

export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });

export const extractSpeakableText = (text: string) => {
  const parts = text.split(/(```(?:\w+)?[\s\S]*?```)/g);
  return parts.filter(part => !part.startsWith('```')).join(' ').replace(/\s+/g, ' ').trim();
};

export const daisyBellLyrics = `Daisy, Daisy,
Give me your answer, do!
I'm half crazy,
All for the love of you!

It won't be a stylish marriage,
I can't afford a carriage,
But you'll look sweet upon the seat
Of a bicycle built for two!`;

export const daisyBellMelody: { text: string; pitch: number; rate: number; delay: number }[] = [
    { text: "Daisy,", pitch: 1.2, rate: 0.8, delay: 0 },
    { text: "Daisy,", pitch: 1.1, rate: 0.8, delay: 700 },
    { text: "Give me your answer, do!", pitch: 1.2, rate: 0.8, delay: 700 },
    { text: "I'm half crazy,", pitch: 1.3, rate: 0.8, delay: 1800 },
    { text: "All for the love of you!", pitch: 1.2, rate: 0.8, delay: 1500 },
    { text: "It won't be a stylish marriage,", pitch: 1.1, rate: 0.9, delay: 2000 },
    { text: "I can't afford a carriage,", pitch: 1.0, rate: 0.9, delay: 2000 },
    { text: "But you'll look sweet", pitch: 1.2, rate: 0.8, delay: 1200 },
    { text: "upon the seat", pitch: 1.1, rate: 0.8, delay: 1200 },
    { text: "Of a bicycle built for two!", pitch: 1.2, rate: 0.8, delay: 1200 },
];