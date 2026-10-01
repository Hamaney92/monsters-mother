export const privacy: Record<string, {
  settings: string; title: string; description: string; accept: string; reject: string;
  close: string; more: string; details: string; policy: string; granted: string; denied: string;
}> = {
  en: {
    settings: 'Privacy & cookies', title: 'Optional audience statistics',
    description: 'May YH use Google Analytics to understand visits, pages read and clicks to Amazon? Analytics stays off unless you accept. Refusing does not affect access to the site.',
    accept: 'Accept statistics', reject: 'Refuse statistics', close: 'Close', more: 'How your choice works',
    details: 'If you accept, Google receives usage data, browser/device information, approximate location and a cookie identifier. We do not use this tag for advertising or send names or email addresses. URL query strings and fragments are excluded. Your choice and analytics cookies last up to 180 days. You can withdraw consent here at any time; analytics cookies on this site will then be removed. An Amazon click is not a confirmed purchase. Google processes data under its privacy policy.',
    policy: 'Google privacy policy', granted: 'Statistics accepted.', denied: 'Statistics refused.',
  },
  fr: {
    settings: 'Confidentialité et cookies', title: 'Statistiques d’audience facultatives',
    description: 'Autorisez-vous YH à utiliser Google Analytics pour comprendre les visites, les pages lues et les clics vers Amazon ? Le suivi reste désactivé sans votre accord. Le refus ne limite pas l’accès au site.',
    accept: 'Accepter les statistiques', reject: 'Refuser les statistiques', close: 'Fermer', more: 'Comment fonctionne votre choix',
    details: 'Si vous acceptez, Google reçoit des données d’utilisation, des informations sur le navigateur et l’appareil, une localisation approximative et un identifiant de cookie. Cette balise ne sert pas à la publicité et nous n’envoyons ni nom ni adresse e-mail. Les paramètres et fragments des URL sont exclus. Votre choix et les cookies statistiques sont conservés au maximum 180 jours. Vous pouvez retirer votre accord ici à tout moment ; les cookies statistiques de ce site seront alors supprimés. Un clic Amazon n’est pas un achat confirmé. Google traite les données selon sa politique de confidentialité.',
    policy: 'Politique de confidentialité de Google', granted: 'Statistiques acceptées.', denied: 'Statistiques refusées.',
  },
  ar: {
    settings: 'الخصوصية وملفات الارتباط', title: 'إحصاءات زيارات اختيارية',
    description: 'هل تسمح لـ YH باستخدام Google Analytics لفهم الزيارات والصفحات المقروءة والنقرات إلى Amazon؟ يبقى التتبع معطلاً ما لم توافق. الرفض لا يمنع الوصول إلى الموقع.',
    accept: 'قبول الإحصاءات', reject: 'رفض الإحصاءات', close: 'إغلاق', more: 'كيف يعمل اختيارك',
    details: 'عند الموافقة، تتلقى Google بيانات الاستخدام ومعلومات المتصفح والجهاز والموقع التقريبي ومعرّف ملف ارتباط. لا نستخدم هذه العلامة للإعلانات ولا نرسل أسماء أو عناوين بريد إلكتروني. تُستبعد معاملات عناوين الصفحات وأجزاؤها المرجعية. يُحفظ اختيارك وملفات الارتباط الإحصائية لمدة تصل إلى 180 يوماً. يمكنك سحب موافقتك هنا في أي وقت، وعندها تُحذف ملفات الارتباط الإحصائية لهذا الموقع. النقر إلى Amazon ليس عملية شراء مؤكدة. تعالج Google البيانات وفق سياسة الخصوصية الخاصة بها.',
    policy: 'سياسة خصوصية Google', granted: 'تم قبول الإحصاءات.', denied: 'تم رفض الإحصاءات.',
  },
  tr: {
    settings: 'Gizlilik ve çerezler', title: 'İsteğe bağlı ziyaret istatistikleri',
    description: 'YH’nin ziyaretleri, okunan sayfaları ve Amazon’a yapılan tıklamaları anlamak için Google Analytics kullanmasına izin verir misiniz? Kabul etmedikçe analiz kapalı kalır. Reddetmek siteye erişimi etkilemez.',
    accept: 'İstatistikleri kabul et', reject: 'İstatistikleri reddet', close: 'Kapat', more: 'Tercihiniz nasıl uygulanır',
    details: 'Kabul ederseniz Google; kullanım verilerini, tarayıcı ve cihaz bilgilerini, yaklaşık konumu ve bir çerez tanımlayıcısını alır. Bu etiketi reklam için kullanmıyor, ad veya e-posta adresi göndermiyoruz. URL sorgu parametreleri ve sayfa parçaları hariç tutulur. Tercihiniz ve analiz çerezleri en fazla 180 gün saklanır. Buradan istediğiniz zaman onayınızı geri çekebilirsiniz; bu sitenin analiz çerezleri silinir. Amazon’a tıklamak doğrulanmış bir satın alma değildir. Google verileri kendi gizlilik politikasına göre işler.',
    policy: 'Google gizlilik politikası', granted: 'İstatistikler kabul edildi.', denied: 'İstatistikler reddedildi.',
  },
};
