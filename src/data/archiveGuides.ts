export interface ArchiveGuide {
  intro: string;
  spoilerNote: string;
  sections: {
    id: string;
    title: string;
    paragraphs: string[];
    chapter: number;
    readLabel: string;
    question: string;
  }[];
  closingTitle: string;
  closing: string;
  bookLabel: string;
}

// Reading notes grounded in Book I, chapters 1–6. The novel remains the source;
// interpretations below are offered as reading questions, not invented lore.
export const archiveGuides: Record<string, Record<'world' | 'lore', ArchiveGuide>> = {
  en: {
    world: {
      intro: 'The opening of A Monster’s Mother stays close to the places Elara can reach: a cave above the village, the path home and a room she must adapt for her child. This guide follows how each place changes the decisions available to her.',
      spoilerNote: 'Reading notes by YH’s site. Reveals early scenes through Chapter 6; the later story and ending are not discussed.',
      sections: [
        {
          id: 'cave', title: 'The cave: distance does not bring relief', chapter: 1, readLabel: 'Read Chapter 1 · The First Breath',
          paragraphs: [
            'Snow obscures the cave entrance while Elara struggles to sit up after giving birth. The newborn catches a claw in her clothing and cannot manage his wings. These details make the mountain an immediate physical problem: she is in pain, he needs warmth, and no one is there to help. The opening gives no explanation for his birth before asking what she will do next.',
            'The path down becomes important in Chapter 2. Elara can see the village as somewhere she might receive care, but the child’s cry keeps reaching her. When it stops, she turns back. Read the cave and path together: moving towards the familiar houses does not resolve her uncertainty about the life left behind.'
          ],
          question: 'As Elara looks towards the entrance, which details make leaving seem possible, and which keep her attention on the child?'
        },
        {
          id: 'house', title: 'The house: care changes the room', chapter: 2, readLabel: 'Read Chapter 2 · Back Through the Snow',
          paragraphs: [
            'At home, Elara knows where the water, straw and hearth are. That familiarity gives her practical choices she did not have on the mountain. Yet the basket prepared for a human baby cannot accommodate the ends of his wings. She moves it aside and makes space near the hearth. The home becomes useful because she can change it.',
            'By Chapter 6, the water bowl, stool and bedding have all had to move as Ember grows. Elara can no longer cross the room in darkness by memory. This offers a concrete way to read their relationship: her care becomes visible in the arrangement of objects. The closed door protects their privacy while making outside help harder to accept.'
          ],
          question: 'What does the unsuitable basket reveal about the difference between preparing for a baby and learning to care for this child?'
        },
        {
          id: 'village', title: 'The village: kindness carries questions', chapter: 3, readLabel: 'Read Chapter 3 · The Grave She Invented',
          paragraphs: [
            'Nessa knows the families along the lane through births and illnesses. When she notices Elara’s condition, she offers company and help with the fire. Marda brings bread wrapped in a cloth that Elara once mended. These connections show an existing community of work and care, making Elara’s withdrawal costly.',
            'Elara tells the women that her baby died, while he is alive behind the door. Even a promise to collect the bread cloth later becomes a possible visit she cannot control. The tension grows from ordinary contact between neighbours. At this stage, separate what the women actually do from the reactions Elara fears they might have if they saw him.'
          ],
          question: 'Which gestures offer Elara genuine help, and why does accepting them also put pressure on her secret?'
        }
      ],
      closingTitle: 'Follow the thresholds',
      closing: 'As you read, notice each crossing: out of the cave, into the house, towards the door or back from it. Ask what Elara gains at that moment and what becomes harder. The full book lets you follow those choices beyond these opening scenes.',
      bookLabel: 'Read Book One free'
    },
    lore: {
      intro: 'The early chapters build meaning through objects Elara uses while caring for Ember. The name, shawl and hearth recur in specific actions. These notes connect those actions to the text and offer ways to follow their changing importance.',
      spoilerNote: 'Reading notes by YH’s site. Reveals early scenes through Chapter 6; the later story and ending are not discussed.',
      sections: [
        {
          id: 'name', title: 'Ember: a name found beside the fire', chapter: 6, readLabel: 'Read Chapter 6 · A House Too Small',
          paragraphs: [
            'Elara names him while he watches a red point glowing under the ash. Moving the poker brightens it and draws his attention. She has already tried human names in her thoughts; this one feels suited to the small warm creature beside her. The scene connects the name to something they are looking at together.',
            'He does not immediately turn when she says it. He comes when she holds out her hand, then examines her empty palm. Later in the chapter, the name brings him to her after she wakes from a frightening dream. Watch how repetition gives the word a place in their shared routine, until calling him becomes a way to bring them together.'
          ],
          question: 'How does the meaning of saying “Ember” change between the first naming and Elara’s waking from the dream?'
        },
        {
          id: 'shawl', title: 'The shawl: learning how to hold him', chapter: 2, readLabel: 'Read Chapter 2 · Back Through the Snow',
          paragraphs: [
            'On her return to the cave, Elara takes off her shawl and uses it to support the baby. She adjusts its folds repeatedly on the way home: his face needs air, his body needs protection from the wind, and a wing can catch in the wool. The cloth gives her a way to carry him, but she still has to learn how.',
            'In Chapter 6, Ember wakes when she removes the shawl and rejects a folded cloth offered in its place. Elara eventually sits beside the hearth with part of the shawl across her feet for him. A reading of the shawl as familiarity or attachment is grounded in those choices: his insistence leads her to find a temporary way to share it.'
          ],
          question: 'What does Ember’s refusal of the replacement cloth add to the shawl’s earlier role as protection against the cold?'
        },
        {
          id: 'hearth', title: 'The hearth: warmth has a cost', chapter: 4, readLabel: 'Read Chapter 4 · What He Needed',
          paragraphs: [
            'The hearth gives Elara a place to settle near the baby, but keeping it warm requires fuel. When she works out how to buy food, she divides her coins into two rows: one for fuel and one for meat. Moving a coin towards food leaves less for the fire. The warm room depends on decisions she must keep making.',
            'This practical limit gives the hearth more weight than a comforting background image. It gathers care, rest and worry in one place. Elara has to observe what her child actually needs while considering her own strength and supplies. Reading the feeding attempts alongside the coins keeps the cost of care visible in the scene.'
          ],
          question: 'How do the two rows of coins change your view of the warmth surrounding mother and child?'
        }
      ],
      closingTitle: 'Read the objects in use',
      closing: 'Follow who touches an object, what they need from it and whether that need changes. A familiar thing can acquire meaning through repeated use. The chapter links take you directly to the scenes behind these notes.',
      bookLabel: 'Read Book One free'
    }
  },
  fr: {
    world: {
      intro: 'Le début d’A Monster’s Mother reste au plus près des lieux qu’Elara peut atteindre : une grotte au-dessus du village, le chemin du retour et une pièce à adapter pour son enfant. Ce guide suit la manière dont chaque lieu transforme ses choix.',
      spoilerNote: 'Notes de lecture du site de YH. Elles révèlent des scènes jusqu’au chapitre 6, sans aborder la suite ni la fin du roman.',
      sections: [
        {
          id: 'cave', title: 'La grotte : s’éloigner ne suffit pas', chapter: 1, readLabel: 'Lire le chapitre 1 · Le premier souffle',
          paragraphs: [
            'La neige masque l’entrée tandis qu’Elara tente de se redresser après l’accouchement. Le nouveau-né accroche une griffe à son vêtement et peine à déplacer ses ailes. La montagne pose des problèmes immédiats : elle souffre, il a besoin de chaleur et personne ne peut les aider. Le récit demande ce qu’elle va faire avant d’expliquer cette naissance.',
            'Le chemin prend toute son importance au chapitre 2. Elara aperçoit le village comme un lieu où l’on pourrait prendre soin d’elle, mais le cri de l’enfant continue de lui parvenir. Lorsqu’il cesse, elle fait demi-tour. Lire la grotte avec le chemin permet de suivre ce tiraillement : rejoindre les maisons familières ne dissipe pas son inquiétude pour celui qu’elle a laissé derrière elle.'
          ],
          question: 'Quels détails rendent le départ possible aux yeux d’Elara, et lesquels ramènent son attention vers l’enfant ?'
        },
        {
          id: 'house', title: 'La maison : le soin réorganise l’espace', chapter: 2, readLabel: 'Lire le chapitre 2 · Le retour dans la neige',
          paragraphs: [
            'Chez elle, Elara sait où trouver l’eau, la paille et le foyer. Cette familiarité lui offre des possibilités qu’elle n’avait pas dans la montagne. Pourtant, le panier préparé pour un bébé humain ne convient pas aux extrémités des ailes. Elle l’écarte pour installer l’enfant près du foyer. La maison devient un abri grâce aux changements qu’elle peut y faire.',
            'Au chapitre 6, le bol, le tabouret et la literie ont changé de place à mesure qu’Ember grandit. Elara ne peut plus traverser la pièce dans le noir en se fiant à sa mémoire. On peut ainsi lire leur relation dans la disposition des objets : prendre soin de lui transforme son quotidien. La porte fermée préserve leur intimité tout en rendant l’aide extérieure difficile à accepter.'
          ],
          question: 'Que révèle le panier inadapté sur l’écart entre préparer l’arrivée d’un bébé et apprendre à s’occuper de cet enfant ?'
        },
        {
          id: 'village', title: 'Le village : la sollicitude pose des questions', chapter: 3, readLabel: 'Lire le chapitre 3 · La tombe qu’elle avait inventée',
          paragraphs: [
            'Nessa connaît les familles de la ruelle pour avoir accompagné des naissances et veillé des malades. En voyant l’état d’Elara, elle propose de lui tenir compagnie et de faire le feu. Marda apporte du pain dans un linge qu’Elara avait réparé. Ces liens de travail et d’entraide donnent un prix à son retrait du village.',
            'Elara annonce que son bébé est mort alors qu’il vit derrière la porte. La simple promesse de récupérer le linge plus tard devient une visite qu’elle ne maîtrise pas. La tension naît des contacts ordinaires entre voisines. À ce stade, il est utile de distinguer les gestes réels des deux femmes des réactions qu’Elara imagine si elles voyaient son enfant.'
          ],
          question: 'Quels gestes apporteraient une aide réelle à Elara, et pourquoi les accepter mettrait-il aussi son secret en danger ?'
        }
      ],
      closingTitle: 'Suivre les passages',
      closing: 'Observez chaque passage : sortir de la grotte, entrer dans la maison, s’approcher de la porte ou reculer. Demandez-vous ce qu’Elara y gagne et ce qui devient plus difficile. Le roman complet permet de suivre ces choix au-delà des premières scènes.',
      bookLabel: 'Lire gratuitement le tome 1'
    },
    lore: {
      intro: 'Dans les premiers chapitres, les objets prennent du sens à travers les soins qu’Elara donne à Ember. Le nom, le châle et le foyer reviennent dans des gestes précis. Ces notes proposent des pistes fondées sur le texte pour suivre l’évolution de leur importance.',
      spoilerNote: 'Notes de lecture du site de YH. Elles révèlent des scènes jusqu’au chapitre 6, sans aborder la suite ni la fin du roman.',
      sections: [
        {
          id: 'name', title: 'Ember : un nom trouvé près du feu', chapter: 6, readLabel: 'Lire le chapitre 6 · Une maison trop petite',
          paragraphs: [
            'Elara le nomme alors qu’il observe un point rouge sous la cendre. Le mouvement du tisonnier ravive cette lumière et attire son regard. Elle avait essayé en pensée des noms humains ; celui-ci convient à la petite créature chaude près d’elle. La scène relie le nom à ce qu’ils regardent ensemble.',
            'Il ne se retourne pas dès qu’elle le prononce. Il vient lorsqu’elle tend la main et examine sa paume vide. Plus tard dans le chapitre, ce nom l’attire près d’elle à son réveil d’un rêve effrayant. La répétition installe le mot dans leur vie commune, jusqu’à faire de cet appel une manière de se retrouver.'
          ],
          question: 'Comment l’appel « Ember » change-t-il entre le choix du nom et le réveil d’Elara après son rêve ?'
        },
        {
          id: 'shawl', title: 'Le châle : apprendre à le porter', chapter: 2, readLabel: 'Lire le chapitre 2 · Le retour dans la neige',
          paragraphs: [
            'De retour dans la grotte, Elara retire son châle pour soutenir le bébé. En descendant, elle en ajuste sans cesse les plis : son visage doit rester dégagé, son corps doit être protégé du vent et une aile peut se coincer dans la laine. Le tissu lui permet de le porter, mais elle doit encore apprendre à s’en servir avec lui.',
            'Au chapitre 6, Ember se réveille lorsqu’elle retire le châle et refuse le linge plié proposé à sa place. Elara finit par s’asseoir près du foyer, une partie du châle étendue sur ses pieds pour lui. On peut y lire un lien avec le familier et l’attachement : son insistance l’amène à trouver une façon provisoire de partager le châle.'
          ],
          question: 'Qu’ajoute le refus du linge de remplacement au rôle du châle qui protégeait d’abord du froid ?'
        },
        {
          id: 'hearth', title: 'Le foyer : la chaleur a un coût', chapter: 4, readLabel: 'Lire le chapitre 4 · Ce dont il avait besoin',
          paragraphs: [
            'Elara peut s’installer près de l’enfant autour du foyer, mais il faut du combustible pour maintenir cette chaleur. En cherchant comment acheter de la nourriture, elle répartit ses pièces en deux rangées : une pour le feu, une pour la viande. Déplacer une pièce vers les repas réduit les moyens de chauffer la maison. Le refuge dépend de décisions qu’elle doit renouveler.',
            'Cette limite concrète donne au foyer une place qui dépasse l’image d’un intérieur rassurant. Le soin, le repos et l’inquiétude s’y rejoignent. Elara doit découvrir les besoins réels de l’enfant avec ses forces et ses réserves limitées. Lire les tentatives de repas avec la scène des pièces permet de garder visible le coût de cette attention.'
          ],
          question: 'Comment les deux rangées de pièces changent-elles votre regard sur la chaleur qui entoure la mère et l’enfant ?'
        }
      ],
      closingTitle: 'Observer les objets dans les gestes',
      closing: 'Suivez les mains qui touchent un objet, le besoin auquel il répond et la manière dont ce besoin évolue. La répétition des usages donne du poids aux choses familières. Les liens de chapitre ouvrent directement les scènes évoquées.',
      bookLabel: 'Lire gratuitement le tome 1'
    }
  },
  tr: {
    world: {
      intro: 'A Monster’s Mother’ın başlangıcı, Elara’nın ulaşabildiği yerlere odaklanır: köyün yukarısındaki mağara, eve dönüş yolu ve çocuğuna göre düzenlemesi gereken oda. Bu rehber, her mekânın onun seçeneklerini nasıl değiştirdiğini izler.',
      spoilerNote: 'YH’nin sitesinden okuma notları. 6. bölüme kadar erken sahneleri açıklar; sonraki olayları ve sonu ele almaz.',
      sections: [
        {
          id: 'cave', title: 'Mağara: uzaklaşmak rahatlatmaz', chapter: 1, readLabel: '1. bölümü oku · İlk Nefes',
          paragraphs: [
            'Elara doğumdan sonra doğrulmaya çalışırken kar mağaranın girişini örter. Yeni doğan çocuğun pençesi elbisesine takılır; kanatlarını yönetmekte zorlanır. Dağ, hemen çözülmesi gereken sorunlar yaratır: Elara acı çekmektedir, çocuk ısınmaya muhtaçtır ve yardım edecek kimse yoktur. Anlatı, doğumun nedenini açıklamadan önce Elara’nın ne yapacağını sorar.',
            '2. bölümde iniş yolu önem kazanır. Köy, Elara için bakım görebileceği tanıdık bir yerdir ama çocuğun ağlaması ona ulaşmaya devam eder. Ses kesildiğinde geri döner. Mağara ile yolu birlikte okumak bu kararsızlığı görünür kılar: tanıdık evlere yaklaşması, geride bıraktığı hayat için duyduğu kaygıyı gidermez.'
          ],
          question: 'Hangi ayrıntılar Elara’ya gitmenin mümkün olduğunu düşündürür, hangileri dikkatini yeniden çocuğa yöneltir?'
        },
        {
          id: 'house', title: 'Ev: bakım odayı değiştirir', chapter: 2, readLabel: '2. bölümü oku · Karların İçinden Geri Dönüş',
          paragraphs: [
            'Elara evde suyun, samanın ve ocağın yerini bilir. Bu tanıdıklık ona dağda bulamadığı imkânlar sunar. Yine de insan bebeği için hazırladığı sepet, çocuğun kanat uçlarına uygun değildir. Sepeti kaldırıp ocağın yanında yer açar. Evi sığınak hâline getiren, orada yapabildiği değişikliklerdir.',
            '6. bölümde Ember büyüdükçe su kabının, taburenin ve yatağın yeri değişir. Elara artık karanlıkta odayı ezberinden geçemez. İlişkilerini eşyaların düzeni üzerinden okumak mümkündür: bakım, yaşadığı alanı dönüştürür. Kapalı kapı mahremiyetlerini korurken dışarıdan yardım kabul etmeyi de zorlaştırır.'
          ],
          question: 'Uygun olmayan sepet, bir bebeğe hazırlanmak ile bu çocuğa bakmayı öğrenmek arasındaki farkı nasıl gösterir?'
        },
        {
          id: 'village', title: 'Köy: iyilik soruları da getirir', chapter: 3, readLabel: '3. bölümü oku · Uydurduğu Mezar',
          paragraphs: [
            'Nessa, doğumlara yardım edip hastaların yanında bekleyerek sokaktaki aileleri tanımıştır. Elara’nın hâlini görünce ona eşlik etmeyi ve ateşi yakmayı teklif eder. Marda ise Elara’nın daha önce onardığı beze sarılı ekmek getirir. İş ve yardımlaşmayla kurulmuş bu bağlar, Elara’nın köyden uzak durmasını zorlaştırır.',
            'Elara, kapının arkasında yaşayan bebeğinin öldüğünü söyler. Bezi sonra geri alma sözü bile denetleyemeyeceği bir ziyarete dönüşebilir. Gerilim, komşular arasındaki sıradan ilişkilerden doğar. Bu aşamada kadınların gerçekten yaptıklarıyla Elara’nın çocuğu görürlerse vereceklerini düşündüğü tepkileri ayırmak gerekir.'
          ],
          question: 'Hangi davranışlar Elara’ya gerçekten yardım edebilir; bunları kabul etmek neden sırrını da zor durumda bırakır?'
        }
      ],
      closingTitle: 'Eşikleri izleyin',
      closing: 'Mağaradan çıkışa, eve girişe, kapıya yaklaşmaya ve kapıdan uzaklaşmaya dikkat edin. Elara her geçişte ne kazanıyor, neyi zorlaştırıyor? Kitabın tamamı, bu seçimleri ilk sahnelerin ötesinde izleme imkânı verir.',
      bookLabel: 'Birinci kitabı ücretsiz oku'
    },
    lore: {
      intro: 'İlk bölümlerde anlam, Elara’nın Ember’a bakarken kullandığı eşyalar aracılığıyla kurulur. İsim, şal ve ocak belirli davranışlarda yeniden karşımıza çıkar. Bu notlar, önemlerinin nasıl değiştiğini izlemek için metne dayalı okuma yolları önerir.',
      spoilerNote: 'YH’nin sitesinden okuma notları. 6. bölüme kadar erken sahneleri açıklar; sonraki olayları ve sonu ele almaz.',
      sections: [
        {
          id: 'name', title: 'Ember: ateşin yanında bulunan isim', chapter: 6, readLabel: '6. bölümü oku · Dar Gelen Ev',
          paragraphs: [
            'Elara, yavru küllerin altındaki kızıl noktayı izlerken ona adını verir. Maşayı oynatınca ışık parlar ve dikkatini çeker. Elara daha önce içinden insan adlarını denemiştir; bu isim ise yanındaki küçük, sıcak canlıya uygun gelir. Sahne, ismi birlikte baktıkları bir şeyle ilişkilendirir.',
            'Yavru, adını ilk duyduğunda dönüp bakmaz. Elara elini uzatınca gelir ve boş avucunu inceler. Aynı bölümde Elara korkutucu bir rüyadan uyandığında onu adıyla çağırır; Ember yanına gelir. Tekrarlar, kelimeyi ortak hayatlarının parçası yapar; adıyla seslenmek birbirlerine yaklaşmanın bir yoluna dönüşür.'
          ],
          question: 'İsmin ilk söylendiği an ile Elara’nın rüyadan uyandığı an arasında “Ember” diye seslenmenin anlamı nasıl değişir?'
        },
        {
          id: 'shawl', title: 'Şal: onu taşımayı öğrenmek', chapter: 2, readLabel: '2. bölümü oku · Karların İçinden Geri Dönüş',
          paragraphs: [
            'Elara mağaraya döndüğünde şalını çıkarıp yavruyu desteklemek için kullanır. İnerken kıvrımları sürekli düzeltir: yüzü hava almalı, gövdesi rüzgârdan korunmalı, kanadı yüne takılmamalıdır. Kumaş onu taşımanın bir yolunu sağlar ama Elara bunu nasıl yapacağını adım adım öğrenir.',
            '6. bölümde Ember, şal çekilince uyanır ve yerine bırakılan katlanmış bezi reddeder. Elara sonunda ocağın yanına oturup şalın ayaklarının üzerindeki kısmını ona bırakır. Bu davranışlardan hareketle şalı tanıdıklık ve bağlanmayla ilişkilendirebiliriz: yavrunun ısrarı, Elara’yı şalı geçici olarak paylaşmanın bir yolunu bulmaya yöneltir.'
          ],
          question: 'Yedek bezi reddetmesi, şalın başlangıçtaki soğuktan koruma işlevine hangi anlamı ekler?'
        },
        {
          id: 'hearth', title: 'Ocak: sıcaklığın bir bedeli var', chapter: 4, readLabel: '4. bölümü oku · İhtiyaç Duyduğu Şey',
          paragraphs: [
            'Ocak, Elara’ya yavrunun yanında oturabileceği sıcak bir yer sağlar; bu sıcaklığı sürdürmek için yakacak gerekir. Yiyecek almayı hesaplarken paralarını iki sıraya ayırır: biri yakacak, biri et içindir. Yiyeceğe aktardığı para, ateş için kalan miktarı azaltır. Sığınağın sıcaklığı, tekrar tekrar vermesi gereken kararlara bağlıdır.',
            'Bu somut sınır, ocağa huzurlu bir arka plan olmanın ötesinde ağırlık kazandırır. Bakım, dinlenme ve kaygı burada bir araya gelir. Elara, kendi gücünü ve elindeki kaynakları hesaba katarak çocuğun gerçek ihtiyaçlarını gözlemlemelidir. Besleme denemeleriyle para hesabını birlikte okumak, bakımın bedelini görünür tutar.'
          ],
          question: 'İki sıra para, anneyle çocuğu çevreleyen sıcaklığa bakışınızı nasıl değiştirir?'
        }
      ],
      closingTitle: 'Eşyaları kullanım içinde okuyun',
      closing: 'Bir eşyaya kimin dokunduğunu, ondan ne beklediğini ve bu ihtiyacın değişip değişmediğini izleyin. Tanıdık bir şey, tekrar eden kullanımlarla anlam kazanabilir. Bölüm bağlantıları sizi notların dayandığı sahnelere götürür.',
      bookLabel: 'Birinci kitabı ücretsiz oku'
    }
  },
  ar: {
    world: {
      intro: 'تبقى بداية A Monster’s Mother قريبة من الأماكن التي تستطيع إلارا بلوغها: كهف فوق القرية، وطريق العودة، وغرفة عليها تهيئتها لطفلها. يتتبع هذا الدليل أثر كل مكان في الخيارات المتاحة لها.',
      spoilerNote: 'ملاحظات قراءة من موقع YH. تكشف مشاهد مبكرة حتى الفصل السادس، ولا تتناول الأحداث اللاحقة أو النهاية.',
      sections: [
        {
          id: 'cave', title: 'الكهف: الابتعاد لا يجلب الراحة', chapter: 1, readLabel: 'اقرأ الفصل 1 · النَّفَس الأول',
          paragraphs: [
            'يحجب الثلج مدخل الكهف بينما تحاول إلارا النهوض بعد الولادة. يعلق مخلب الصغير بثوبها، ويعجز عن تحريك جناحيه بسهولة. يفرض الجبل مشكلات عاجلة: هي تتألم، وهو يحتاج إلى الدفء، ولا أحد يساعدهما. يطرح السرد سؤال ما ستفعله قبل أن يقدم تفسيرًا لهذه الولادة.',
            'تظهر أهمية طريق الهبوط في الفصل الثاني. تبدو القرية لإلارا مكانًا مألوفًا قد تجد فيه الرعاية، لكن بكاء الصغير يظل يصل إليها. وحين يسكت، تعود. تساعد قراءة الكهف والطريق معًا على تتبع ترددها: الاقتراب من البيوت المألوفة لا يبدد قلقها على الحياة التي تركتها وراءها.'
          ],
          question: 'ما التفاصيل التي تجعل الرحيل ممكنًا في نظر إلارا، وما الذي يعيد انتباهها إلى الطفل؟'
        },
        {
          id: 'house', title: 'المنزل: الرعاية تعيد ترتيب الغرفة', chapter: 2, readLabel: 'اقرأ الفصل 2 · عودة عبر الثلج',
          paragraphs: [
            'تعرف إلارا في منزلها مكان الماء والقش والموقد. تمنحها هذه الألفة إمكانات لم تكن متاحة على الجبل. ومع ذلك، لا تتسع السلة التي أعدتها لرضيع بشري لطرفي جناحيه. تزيحها وتفسح له مكانًا قرب الموقد. يصبح المنزل ملجأ بفضل ما تستطيع تغييره فيه.',
            'في الفصل السادس، تتغير أماكن وعاء الماء والمقعد والفراش مع نمو إمبر. لم تعد إلارا تستطيع عبور الغرفة في الظلام اعتمادًا على ذاكرتها. يمكن قراءة علاقتهما في ترتيب الأشياء: رعايته تغير تفاصيل حياتها. يحفظ الباب المغلق خصوصيتهما، لكنه يجعل قبول المساعدة من الخارج أصعب.'
          ],
          question: 'ماذا تكشف السلة غير الملائمة عن الفارق بين الاستعداد لرضيع وتعلم رعاية هذا الطفل بعينه؟'
        },
        {
          id: 'village', title: 'القرية: العطف يحمل أسئلة', chapter: 3, readLabel: 'اقرأ الفصل 3 · القبر الذي اختلقته',
          paragraphs: [
            'تعرف نيسا أسر الدرب من خلال مساعدتها في الولادات وجلوسها قرب المرضى. حين تلاحظ حال إلارا، تعرض صحبتها وإشعال النار لها. وتحضر ماردا خبزًا في قطعة قماش كانت إلارا قد أصلحتها. تكشف هذه الروابط مجتمعًا قائمًا على العمل والعون، فيصبح انعزال إلارا مكلفًا.',
            'تقول إلارا إن رضيعها مات، بينما هو حي خلف الباب. حتى الوعد باستعادة قماش الخبز لاحقًا يتحول إلى زيارة لا تستطيع التحكم فيها. ينمو التوتر من التواصل العادي بين الجيران. في هذه المرحلة، يجدر التمييز بين أفعال المرأتين بالفعل وردود الأفعال التي تتوقعها إلارا إن رأتا طفلها.'
          ],
          question: 'أي التصرفات تقدم مساعدة حقيقية لإلارا، ولماذا يضع قبولها سرها تحت الضغط أيضًا؟'
        }
      ],
      closingTitle: 'تتبّع العتبات',
      closing: 'انتبه إلى كل عبور: الخروج من الكهف، ودخول المنزل، والاقتراب من الباب أو التراجع عنه. ما الذي تكسبه إلارا، وما الذي يصير أصعب؟ تتيح الرواية الكاملة متابعة هذه الاختيارات بعد المشاهد الأولى.',
      bookLabel: 'اقرأ الكتاب الأول مجانًا'
    },
    lore: {
      intro: 'يتكون المعنى في الفصول الأولى عبر الأشياء التي تستخدمها إلارا لرعاية إمبر. يعود الاسم والشال والموقد في أفعال محددة. تصل هذه الملاحظات بين الأفعال والنص، وتقترح طرقًا لتتبع تغير أهمية هذه الأشياء.',
      spoilerNote: 'ملاحظات قراءة من موقع YH. تكشف مشاهد مبكرة حتى الفصل السادس، ولا تتناول الأحداث اللاحقة أو النهاية.',
      sections: [
        {
          id: 'name', title: 'إمبر: اسم وُجد قرب النار', chapter: 6, readLabel: 'اقرأ الفصل 6 · بيت أضيق مما ينبغي',
          paragraphs: [
            'تسميه إلارا وهو يراقب نقطة حمراء تحت الرماد. تحريك المسعر يزيد وهجها ويجذب انتباهه. كانت قد جرّبت في سرها أسماء بشرية، لكن هذا الاسم يناسب الكائن الصغير الدافئ قربها. يربط المشهد الاسم بشيء ينظران إليه معًا.',
            'لا يلتفت حين تناديه أول مرة. يأتي عندما تمد يدها ويفحص راحتها الفارغة. وفي وقت لاحق من الفصل، يجلبه الاسم إلى جانبها عندما تستيقظ من حلم مخيف. يمنح التكرار الكلمة مكانًا في حياتهما المشتركة، وتصبح مناداته وسيلة لاقترابهما من بعضهما.'
          ],
          question: 'كيف يتغير معنى مناداة «إمبر» بين اختيار الاسم واستيقاظ إلارا من حلمها؟'
        },
        {
          id: 'shawl', title: 'الشال: تعلم حمله', chapter: 2, readLabel: 'اقرأ الفصل 2 · عودة عبر الثلج',
          paragraphs: [
            'حين تعود إلارا إلى الكهف، تنزع شالها لتسند به الرضيع. تعدل طياته مرارًا أثناء الهبوط: يحتاج وجهه إلى الهواء، وجسده إلى الحماية من الريح، وقد يعلق جناح بالصوف. يمنحها القماش طريقة لحمله، لكنها ما تزال مضطرة إلى تعلمها خطوة خطوة.',
            'في الفصل السادس، يستيقظ إمبر عندما تسحب الشال ويرفض القماش المطوي الذي تضعه بدلًا منه. تجلس إلارا أخيرًا قرب الموقد وتترك له الجزء المنسدل فوق قدميها. تسمح هذه الأفعال بقراءة الشال بوصفه مرتبطًا بالألفة والتعلق: يدفعها إصراره إلى إيجاد طريقة مؤقتة لمشاركته الشال.'
          ],
          question: 'ماذا يضيف رفض القماش البديل إلى دور الشال الأول في الوقاية من البرد؟'
        },
        {
          id: 'hearth', title: 'الموقد: للدفء كلفة', chapter: 4, readLabel: 'اقرأ الفصل 4 · ما كان يحتاج إليه',
          paragraphs: [
            'يوفر الموقد مكانًا دافئًا تجلس فيه إلارا قرب الصغير، لكن استمرار الدفء يتطلب الوقود. حين تحسب ثمن الطعام، تقسم نقودها صفين: أحدهما للوقود والآخر للحم. نقل قطعة نقدية إلى الطعام يقلل ما يبقى للنار. يعتمد دفء الملجأ على قرارات عليها أن تتخذها باستمرار.',
            'يمنح هذا القيد الملموس الموقد ثقلًا يتجاوز صورة البيت المطمئن. تجتمع حوله الرعاية والراحة والقلق. على إلارا أن تلاحظ احتياجات طفلها الحقيقية مع مراعاة قوتها ومؤنها المحدودة. قراءة محاولات الإطعام إلى جانب حساب النقود تبقي كلفة الرعاية حاضرة في المشهد.'
          ],
          question: 'كيف يغير صفا النقود نظرتك إلى الدفء الذي يحيط بالأم وطفلها؟'
        }
      ],
      closingTitle: 'اقرأ الأشياء في استعمالها',
      closing: 'تتبّع من يلمس الغرض، وما الذي يحتاجه منه، وهل تتغير تلك الحاجة. قد يكتسب الشيء المألوف معنى بتكرار استعماله. تنقلك روابط الفصول مباشرة إلى المشاهد التي تستند إليها هذه الملاحظات.',
      bookLabel: 'اقرأ الكتاب الأول مجانًا'
    }
  }
};
