// Translations for Arabic and English

export type Language = 'ar' | 'en';

export interface Translations {
  // App
  appName: string;
  
  // Navigation
  home: string;
  transactions: string;
  statistics: string;
  settings: string;
  
  // Dashboard
  myExpenses: string;
  totalBalance: string;
  income: string;
  expense: string;
  thisMonth: string;
  recentTransactions: string;
  viewAll: string;
  noTransactions: string;
  startTracking: string;
  addFirstTransaction: string;
  
  // Transactions Screen
  search: string;
  searchPlaceholder: string;
  all: string;
  noResults: string;
  tryDifferentFilter: string;
  
  // Statistics
  period: string;
  week: string;
  month: string;
  year: string;
  allTime: string;
  topCategories: string;
  noData: string;
  addTransactionsToSee: string;
  totalIncome: string;
  totalExpense: string;
  savingsRate: string;
  transactionCount: string;
  averageTransaction: string;
  summary: string;
  
  // Settings
  general: string;
  currency: string;
  darkMode: string;
  enabled: string;
  disabled: string;
  language: string;
  data: string;
  exportData: string;
  exportYourTransactions: string;
  deleteAllData: string;
  transactionsCount: string;
  aboutApp: string;
  rateApp: string;
  helpUsWithRating: string;
  version: string;
  madeWithLove: string;
  
  // Add Transaction
  addTransaction: string;
  amount: string;
  category: string;
  date: string;
  notes: string;
  notesOptional: string;
  addNote: string;
  addExpense: string;
  addIncome: string;
  
  // Categories - Expenses
  food: string;
  transportation: string;
  shopping: string;
  entertainment: string;
  bills: string;
  health: string;
  education: string;
  other: string;
  
  // Categories - Income
  salary: string;
  business: string;
  investments: string;
  gifts: string;
  otherIncome: string;
  
  // Alerts & Messages
  error: string;
  success: string;
  warning: string;
  confirm: string;
  cancel: string;
  delete: string;
  save: string;
  edit: string;
  close: string;
  enterValidAmount: string;
  selectCategory: string;
  deleteConfirmTitle: string;
  deleteConfirmMessage: string;
  deleteAllConfirmTitle: string;
  deleteAllConfirmMessage: string;
  noDataToDelete: string;
  dataDeleted: string;
  comingSoon: string;
  exportComingSoon: string;
  thankYou: string;
  appreciateSupport: string;
  selectCurrency: string;
  selectLanguage: string;
  
  // Time
  today: string;
  yesterday: string;
  daysAgo: string;
  
  // Transaction Detail
  transactionDetails: string;
  deleteTransaction: string;
  editTransaction: string;
  
  // Auth
  login: string;
  register: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  forgotPassword: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  continueAsGuest: string;
  loginToAccount: string;
  createAccount: string;
  welcomeBack: string;
  joinUs: string;
  orContinueWith: string;
  google: string;
  apple: string;
  passwordMismatch: string;
  invalidEmail: string;
  passwordTooShort: string;
  nameRequired: string;
  logout: string;
  account: string;
  profile: string;
  syncData: string;
  syncDescription: string;
  lastSynced: string;
  never: string;
  guestMode: string;
  guestModeDescription: string;
  loginToSync: string;
}

export const translations: Record<Language, Translations> = {
  ar: {
    // App
    appName: 'قرشك',
    
    // Navigation
    home: 'الرئيسية',
    transactions: 'المعاملات',
    statistics: 'الإحصائيات',
    settings: 'الإعدادات',
    
    // Dashboard
    myExpenses: 'مصروفاتي',
    totalBalance: 'الرصيد الكلي',
    income: 'الدخل',
    expense: 'المصروفات',
    thisMonth: 'هذا الشهر',
    recentTransactions: 'آخر المعاملات',
    viewAll: 'عرض الكل',
    noTransactions: 'لا توجد معاملات',
    startTracking: 'ابدأ بتتبع مصروفاتك',
    addFirstTransaction: 'أضف أول معاملة',
    
    // Transactions Screen
    search: 'بحث',
    searchPlaceholder: 'ابحث في المعاملات...',
    all: 'الكل',
    noResults: 'لا توجد نتائج',
    tryDifferentFilter: 'جرب فلتر مختلف',
    
    // Statistics
    period: 'الفترة',
    week: 'أسبوع',
    month: 'شهر',
    year: 'سنة',
    allTime: 'الكل',
    topCategories: 'أعلى الفئات',
    noData: 'لا توجد بيانات',
    addTransactionsToSee: 'أضف معاملات لرؤية الإحصائيات',
    totalIncome: 'إجمالي الدخل',
    totalExpense: 'إجمالي المصروفات',
    savingsRate: 'نسبة التوفير',
    transactionCount: 'عدد المعاملات',
    averageTransaction: 'متوسط المعاملة',
    summary: 'ملخص',
    
    // Settings
    general: 'عام',
    currency: 'العملة',
    darkMode: 'الوضع الداكن',
    enabled: 'مفعل',
    disabled: 'معطل',
    language: 'اللغة',
    data: 'البيانات',
    exportData: 'تصدير البيانات',
    exportYourTransactions: 'تصدير معاملاتك كملف',
    deleteAllData: 'حذف جميع البيانات',
    transactionsCount: 'معاملة',
    aboutApp: 'حول التطبيق',
    rateApp: 'قيم التطبيق',
    helpUsWithRating: 'ساعدنا بتقييمك',
    version: 'الإصدار',
    madeWithLove: 'صنع بـ ❤️',
    
    // Add Transaction
    addTransaction: 'إضافة معاملة',
    amount: 'المبلغ',
    category: 'الفئة',
    date: 'التاريخ',
    notes: 'ملاحظات',
    notesOptional: 'ملاحظات (اختياري)',
    addNote: 'أضف ملاحظة...',
    addExpense: 'إضافة مصروف',
    addIncome: 'إضافة دخل',
    
    // Categories - Expenses
    food: 'طعام',
    transportation: 'مواصلات',
    shopping: 'تسوق',
    entertainment: 'ترفيه',
    bills: 'فواتير',
    health: 'صحة',
    education: 'تعليم',
    other: 'أخرى',
    
    // Categories - Income
    salary: 'راتب',
    business: 'أعمال',
    investments: 'استثمارات',
    gifts: 'هدايا',
    otherIncome: 'دخل آخر',
    
    // Alerts & Messages
    error: 'خطأ',
    success: 'نجاح',
    warning: 'تنبيه',
    confirm: 'تأكيد',
    cancel: 'إلغاء',
    delete: 'حذف',
    save: 'حفظ',
    edit: 'تعديل',
    close: 'إغلاق',
    enterValidAmount: 'يرجى إدخال مبلغ صحيح',
    selectCategory: 'يرجى اختيار فئة',
    deleteConfirmTitle: 'حذف المعاملة',
    deleteConfirmMessage: 'هل أنت متأكد من حذف هذه المعاملة؟',
    deleteAllConfirmTitle: 'حذف جميع البيانات',
    deleteAllConfirmMessage: 'هل أنت متأكد؟ سيتم حذف جميع المعاملات ولا يمكن التراجع عن هذا الإجراء.',
    noDataToDelete: 'لا توجد بيانات للحذف',
    dataDeleted: 'تم حذف جميع البيانات بنجاح',
    comingSoon: 'قريباً',
    exportComingSoon: 'ميزة تصدير البيانات ستتوفر قريباً',
    thankYou: 'شكراً لك!',
    appreciateSupport: 'نقدر دعمك ورأيك',
    selectCurrency: 'اختر العملة',
    selectLanguage: 'اختر اللغة',
    
    // Time
    today: 'اليوم',
    yesterday: 'أمس',
    daysAgo: 'أيام',
    
    // Transaction Detail
    transactionDetails: 'تفاصيل المعاملة',
    deleteTransaction: 'حذف المعاملة',
    editTransaction: 'تعديل المعاملة',
    
    // Auth
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    fullName: 'الاسم الكامل',
    forgotPassword: 'نسيت كلمة المرور؟',
    dontHaveAccount: 'ليس لديك حساب؟',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    continueAsGuest: 'متابعة كضيف',
    loginToAccount: 'تسجيل الدخول لحسابك',
    createAccount: 'إنشاء حساب جديد',
    welcomeBack: 'مرحباً بعودتك!',
    joinUs: 'انضم إلينا!',
    orContinueWith: 'أو تابع بواسطة',
    google: 'جوجل',
    apple: 'آبل',
    passwordMismatch: 'كلمات المرور غير متطابقة',
    invalidEmail: 'بريد إلكتروني غير صالح',
    passwordTooShort: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
    nameRequired: 'الاسم مطلوب',
    logout: 'تسجيل الخروج',
    account: 'الحساب',
    profile: 'الملف الشخصي',
    syncData: 'مزامنة البيانات',
    syncDescription: 'مزامنة معاملاتك مع السحابة',
    lastSynced: 'آخر مزامنة',
    never: 'أبداً',
    guestMode: 'وضع الضيف',
    guestModeDescription: 'أنت تستخدم التطبيق كضيف',
    loginToSync: 'سجل دخول لمزامنة بياناتك',
  },
  
  en: {
    // App
    appName: 'Qirshak',
    
    // Navigation
    home: 'Home',
    transactions: 'Transactions',
    statistics: 'Statistics',
    settings: 'Settings',
    
    // Dashboard
    myExpenses: 'My Expenses',
    totalBalance: 'Total Balance',
    income: 'Income',
    expense: 'Expense',
    thisMonth: 'This Month',
    recentTransactions: 'Recent Transactions',
    viewAll: 'View All',
    noTransactions: 'No transactions',
    startTracking: 'Start tracking your expenses',
    addFirstTransaction: 'Add First Transaction',
    
    // Transactions Screen
    search: 'Search',
    searchPlaceholder: 'Search transactions...',
    all: 'All',
    noResults: 'No results',
    tryDifferentFilter: 'Try a different filter',
    
    // Statistics
    period: 'Period',
    week: 'Week',
    month: 'Month',
    year: 'Year',
    allTime: 'All Time',
    topCategories: 'Top Categories',
    noData: 'No data',
    addTransactionsToSee: 'Add transactions to see statistics',
    totalIncome: 'Total Income',
    totalExpense: 'Total Expense',
    savingsRate: 'Savings Rate',
    transactionCount: 'Transactions',
    averageTransaction: 'Average',
    summary: 'Summary',
    
    // Settings
    general: 'General',
    currency: 'Currency',
    darkMode: 'Dark Mode',
    enabled: 'Enabled',
    disabled: 'Disabled',
    language: 'Language',
    data: 'Data',
    exportData: 'Export Data',
    exportYourTransactions: 'Export your transactions as file',
    deleteAllData: 'Delete All Data',
    transactionsCount: 'transactions',
    aboutApp: 'About',
    rateApp: 'Rate App',
    helpUsWithRating: 'Help us with your rating',
    version: 'Version',
    madeWithLove: 'Made with ❤️',
    
    // Add Transaction
    addTransaction: 'Add Transaction',
    amount: 'Amount',
    category: 'Category',
    date: 'Date',
    notes: 'Notes',
    notesOptional: 'Notes (optional)',
    addNote: 'Add a note...',
    addExpense: 'Add Expense',
    addIncome: 'Add Income',
    
    // Categories - Expenses
    food: 'Food',
    transportation: 'Transportation',
    shopping: 'Shopping',
    entertainment: 'Entertainment',
    bills: 'Bills',
    health: 'Health',
    education: 'Education',
    other: 'Other',
    
    // Categories - Income
    salary: 'Salary',
    business: 'Business',
    investments: 'Investments',
    gifts: 'Gifts',
    otherIncome: 'Other Income',
    
    // Alerts & Messages
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    confirm: 'Confirm',
    cancel: 'Cancel',
    delete: 'Delete',
    save: 'Save',
    edit: 'Edit',
    close: 'Close',
    enterValidAmount: 'Please enter a valid amount',
    selectCategory: 'Please select a category',
    deleteConfirmTitle: 'Delete Transaction',
    deleteConfirmMessage: 'Are you sure you want to delete this transaction?',
    deleteAllConfirmTitle: 'Delete All Data',
    deleteAllConfirmMessage: 'Are you sure? All transactions will be deleted and this cannot be undone.',
    noDataToDelete: 'No data to delete',
    dataDeleted: 'All data deleted successfully',
    comingSoon: 'Coming Soon',
    exportComingSoon: 'Export feature will be available soon',
    thankYou: 'Thank You!',
    appreciateSupport: 'We appreciate your support',
    selectCurrency: 'Select Currency',
    selectLanguage: 'Select Language',
    
    // Time
    today: 'Today',
    yesterday: 'Yesterday',
    daysAgo: 'days ago',
    
    // Transaction Detail
    transactionDetails: 'Transaction Details',
    deleteTransaction: 'Delete Transaction',
    editTransaction: 'Edit Transaction',
    
    // Auth
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    forgotPassword: 'Forgot Password?',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    continueAsGuest: 'Continue as Guest',
    loginToAccount: 'Login to your account',
    createAccount: 'Create new account',
    welcomeBack: 'Welcome Back!',
    joinUs: 'Join Us!',
    orContinueWith: 'Or continue with',
    google: 'Google',
    apple: 'Apple',
    passwordMismatch: 'Passwords do not match',
    invalidEmail: 'Invalid email address',
    passwordTooShort: 'Password must be at least 6 characters',
    nameRequired: 'Name is required',
    logout: 'Logout',
    account: 'Account',
    profile: 'Profile',
    syncData: 'Sync Data',
    syncDescription: 'Sync your transactions to the cloud',
    lastSynced: 'Last synced',
    never: 'Never',
    guestMode: 'Guest Mode',
    guestModeDescription: 'You are using the app as a guest',
    loginToSync: 'Login to sync your data',
  },
};

export const LANGUAGES = [
  { code: 'ar' as Language, name: 'العربية', nameEn: 'Arabic', isRTL: true },
  { code: 'en' as Language, name: 'English', nameEn: 'English', isRTL: false },
];
