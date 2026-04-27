/**
 * 主入口文件
 * 应用初始化和全局状态管理
 */

// 全局历史记录
let calculationHistory = [];

// 最后一次计算状态（用于语言切换时重新渲染）
let lastCalculationState = null;

/**
 * 侧边栏打开/关闭功能
 */
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const mainContent = document.getElementById('main-content');
    const topTitleBar = document.getElementById('top-title-bar');
    const topToolbar = document.getElementById('top-toolbar');
    
    if (!sidebar) return;
    
    // 从本地存储读取侧边栏状态
    const savedState = localStorage.getItem('sidebarOpen');
    const isOpen = savedState === null ? true : savedState === 'true'; // 默认打开
    
    function setSidebarState(open) {
        if (open) {
            sidebar.classList.remove('closed');
            // 始终隐藏遮罩层，允许用户直接操作主界面
            if (sidebarOverlay) sidebarOverlay.classList.add('hidden');
            if (sidebarToggle) sidebarToggle.classList.add('hidden');
            if (mainContent) mainContent.classList.remove('sidebar-closed');
            // 同步调整顶部栏的左边距
            if (topTitleBar) topTitleBar.classList.remove('header-closed');
            if (topToolbar) topToolbar.classList.remove('header-closed');
            localStorage.setItem('sidebarOpen', 'true');
        } else {
            sidebar.classList.add('closed');
            // 遮罩层始终隐藏
            if (sidebarOverlay) sidebarOverlay.classList.add('hidden');
            if (sidebarToggle) sidebarToggle.classList.remove('hidden');
            if (mainContent) mainContent.classList.add('sidebar-closed');
            // 同步调整顶部栏的左边距
            if (topTitleBar) topTitleBar.classList.add('header-closed');
            if (topToolbar) topToolbar.classList.add('header-closed');
            localStorage.setItem('sidebarOpen', 'false');
        }
    }
    
    // 应用初始状态
    setSidebarState(isOpen);
    
    // 切换按钮事件
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            setSidebarState(true);
        });
    }
    
    // 关闭按钮事件
    if (sidebarClose) {
        sidebarClose.addEventListener('click', () => {
            setSidebarState(false);
        });
    }
    
    // Esc键关闭侧边栏
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // 检查当前是否有输入框处于焦点（避免在输入时误触发）
            const activeEl = document.activeElement;
            const isInputFocused = activeEl && (
                activeEl.tagName === 'INPUT' ||
                activeEl.tagName === 'TEXTAREA' ||
                activeEl.tagName === 'SELECT'
            );
            // 如果侧边栏打开且不在输入框中，则关闭侧边栏
            const isSidebarOpen = !sidebar.classList.contains('closed');
            if (isSidebarOpen && !isInputFocused) {
                setSidebarState(false);
            }
        }
    });
    
    // 遮罩点击事件
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            setSidebarState(false);
        });
    }
}

/**
 * 应用初始化
 */
function init() {
    // 加载历史记录
    try {
        const saved = localStorage.getItem('linearAlgebraHistory');
        if (saved) {
            calculationHistory = JSON.parse(saved);
        }
    } catch (e) {
        calculationHistory = [];
    }
    
    // 初始化各模块
    initSidebar();
    initTabHandlers();
    initScalarKeyNav();
    initStepsToggle();
    initDeterminantHandlers();
    initMatrixHandlers();
    initVectorHandlers();
    initSystemHandlers();
    initVectorGroupHandlers();
    initQuadraticHandlers();
    initHistoryHandlers();
    
    // 初始化默认标签页的输入控件
    initializeTabInputs('determinant');
    
    // 更新历史记录显示
    updateHistoryDisplay();
    
    // 初始化向量组输入（默认状态）
    initVectorGroupInputs();
    
    // 初始化向量运算和矩阵运算的UI状态
    handleMatrixOperationChange();
    handleVectorOperationChange();
    
    console.log(window.i18n ? window.i18n.t('init-complete') : '线性代数计算器初始化完成');
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);
