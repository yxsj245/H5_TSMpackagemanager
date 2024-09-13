let srcDirHandle = null;
let destDirHandle = null;

// 选择源目录，获取包含 ZIP 文件的目录
document.getElementById('select-src-dir').addEventListener('click', async () => {
    try {
        // 选择包含压缩包的源目录
        srcDirHandle = await window.showDirectoryPicker();
        document.getElementById('status').textContent = '源目录已选择，请选择目标目录。';
        document.getElementById('select-dest-dir').disabled = false;
    } catch (error) {
        document.getElementById('status').textContent = `选择源目录失败: ${error.message}`;
    }
});

// 选择目标目录，将文件解压到该目录
document.getElementById('select-dest-dir').addEventListener('click', async () => {
    if (!srcDirHandle) {
        document.getElementById('status').textContent = '请先选择源目录。';
        return;
    }

    try {
        // 选择解压文件的目标目录
        destDirHandle = await window.showDirectoryPicker();
        document.getElementById('status').textContent = '目标目录已选择，开始解压文件...';

        // 遍历源目录中的所有文件
        for await (const [fileName, fileHandle] of srcDirHandle) {
            if (fileName.endsWith('.zip')) {
                document.getElementById('status').textContent = `正在处理 ${fileName}...`;

                const file = await fileHandle.getFile();
                const zip = new JSZip();
                const zipContent = await zip.loadAsync(file);

                // 解压并将文件保存到目标目录
                for (const entryName in zipContent.files) {
                    const entry = zipContent.files[entryName];
                    if (entry.dir) {
                        // 如果是目录，创建目录
                        await createDirectoryInDest(entryName);
                    } else {
                        // 如果是文件，写入文件
                        const fileData = await entry.async('blob');
                        await writeFileToDest(entryName, fileData);
                    }
                }

                document.getElementById('status').textContent = `已完成解压 ${fileName}`;
            }
        }

        document.getElementById('status').textContent = '所有 ZIP 文件已成功解压！';
    } catch (error) {
        document.getElementById('status').textContent = `解压失败: ${error.message}`;
    }
});

// 在目标目录创建文件夹（根据源目录的层级结构）
async function createDirectoryInDest(path) {
    const folders = path.split('/');
    let currentDirHandle = destDirHandle;

    for (const folder of folders.slice(0, -1)) {
        currentDirHandle = await currentDirHandle.getDirectoryHandle(folder, { create: true });
    }
}

// 将文件写入目标目录
async function writeFileToDest(path, fileData) {
    const folders = path.split('/');
    const fileName = folders.pop();
    let currentDirHandle = destDirHandle;

    for (const folder of folders) {
        currentDirHandle = await currentDirHandle.getDirectoryHandle(folder, { create: true });
    }

    // 创建并写入文件
    const fileHandle = await currentDirHandle.getFileHandle(fileName, { create: true });
    const writableStream = await fileHandle.createWritable();
    await writableStream.write(fileData);
    await writableStream.close();
}
