// 检测是否为移动设备
function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

// 检测浏览器版本
function getBrowserVersion() {
    const ua = navigator.userAgent;
    let match;
    
    // Chrome/Chromium
    if ((match = ua.match(/Chrom(e|ium)\/([0-9]+)\./))) {
        return { name: 'Chrome', version: parseInt(match[2], 10) };
    }
    // Edge
    if ((match = ua.match(/Edg\/([0-9]+)\./))) {
        return { name: 'Edge', version: parseInt(match[1], 10) };
    }
    // Firefox
    if ((match = ua.match(/Firefox\/([0-9]+)\./))) {
        return { name: 'Firefox', version: parseInt(match[1], 10) };
    }
    // Opera
    if ((match = ua.match(/Opera\/([0-9]+)\./))) {
        return { name: 'Opera', version: parseInt(match[1], 10) };
    }
    // Safari
    if ((match = ua.match(/Version\/([0-9]+)\./)) && ua.includes('Safari')) {
        return { name: 'Safari', version: parseInt(match[1], 10) };
    }

    return { name: 'Unknown', version: 0 };
}

// 检测是否支持当前浏览器
function isSupportedBrowser() {
    const { name, version } = getBrowserVersion();
    
    if (name === 'Edge' && version < 79) {
        return false;
    }
    if (name === 'Chrome' && version < 47) {
        return false;
    }
    if (name === 'Firefox' && version < 25) {
        return false;
    }
    if (name === 'Opera' && version < 25) {
        return false;
    }
    return true;
}

// 禁用所有功能并显示警告
function disableFeatures(message) {
    document.getElementById('status').textContent = message;
    document.getElementById('select-src-dir').disabled = true;
    document.getElementById('select-dest-dir').disabled = true;
}

document.addEventListener('DOMContentLoaded', () => {
    const isMobile = isMobileDevice();
    const { name, version } = getBrowserVersion();
    const isSupported = isSupportedBrowser();
    const statusElement = document.getElementById('status');

    if (isMobile) {
        // 如果是移动设备，弹出警告并禁用所有功能
        alert('该工具不支持移动设备。请在桌面设备上使用。');
        disableFeatures('功能被禁用，因为移动设备不受支持。');
        return;
    }

    // 输出当前浏览器和版本
    if (isSupported) {
        statusElement.textContent = `您的浏览器内核是 ${name} (版本 ${version})，兼容性检测通过。`;
        statusElement.style.color = 'green';
    } else {
        alert(`您的浏览器 ${name} (版本 ${version})，该工具不支持当前浏览器版本。请升级浏览器后再试。`);
        disableFeatures(`功能被禁用，因为浏览器版本 ${name} ${version} 不受支持。`);
    }
});