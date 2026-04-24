/**
 * 主入口文件
 * 应用初始化和全局状态管理
 */

// 全局历史记录
let calculationHistory = [];

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
    initTabHandlers();
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
