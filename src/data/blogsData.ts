export const getBlogData = (id: number, lang: string) => {
  const isAr = lang === 'ar';

  const blogs = {
    1: {
      title: isAr ? 'موقع ويب ولا تطبيق موبايل لشركتك الناشئة؟' : 'Website or Mobile App for Your Startup?',
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      intro: isAr 
        ? 'حيرة كبيرة بتواجه رواد الأعمال في بداية أي مشروع: أبدأ بموقع ويب ولا تطبيق موبايل؟ القرار ده مش بس بيأثر على ميزانيتك، ده كمان بيحدد طريقة وصولك للعملاء. في المقال ده هنفصل لك المقارنة بناءً على نوع البيزنس، الميزانية، وتجربة المستخدم.' 
        : 'A major dilemma for entrepreneurs starting a project: Should I launch a website or a mobile app? This decision doesn\'t just affect your budget; it shapes how you reach your customers. Here is a detailed comparison based on business type, cost, and UX.',
      sections: [
        {
          title: isAr ? 'إمتى يكون موقع الويب هو الخيار الأفضل؟' : 'When is a Website the best choice?',
          content: isAr 
            ? 'لو هدفك الرئيسي هو الوصول لأكبر عدد ممكن من الجمهور من خلال محركات البحث (SEO)، فموقع الويب هو الحل الأمثل. الموقع بيشتغل على أي جهاز سواء كمبيوتر أو موبايل من غير ما العميل يحتاج ينزل حاجة من المتجر.\n\nبالإضافة لده، تكلفة تطوير الموقع وصيانته بتكون أقل بكتير من التطبيقات. لو مشروعك لسه في مرحلة الاختبار (MVP) ومحتاج تثبت نجاح الفكرة بأقل تكلفة ممكنة، بناء موقع متجاوب (Responsive) هيكون خطوة أولى ممتازة وذكية جداً.'
            : 'If your main goal is reaching the maximum number of people through search engines (SEO), a website is your optimal choice. It works on any device without requiring the user to download anything.\n\nAdditionally, the cost of developing and maintaining a website is much lower than mobile apps. If your project is still in the MVP phase, building a responsive website is a highly smart first step.'
        },
        {
          title: isAr ? 'إمتى تختار تطبيق الموبايل؟' : 'When to choose a Mobile App?',
          content: isAr 
            ? 'تطبيق الموبايل بيلمع لما يكون البيزنس بتاعك بيعتمد على الاستخدام المتكرر. يعني لو بتقدم خدمة العميل بيحتاجها كل يوم (زي توصيل الأكل أو المواصلات)، التطبيق بيوفر تجربة مستخدم أسرع بكتير وبيتيح لك استخدام خصائص الموبايل زي الكاميرا والـ GPS.\n\nالأهم من كده هو الإشعارات (Push Notifications) اللي بتعتبر كنز تسويقي. الإشعارات دي بتخليك دايماً قدام عين العميل، وبترفع نسب المبيعات بشكل ملحوظ مقارنة بالمواقع التقليدية.'
            : 'A mobile app shines when your business relies on frequent usage. If you offer a service users need daily, an app provides a much faster UX and allows you to use hardware features like the camera and GPS.\n\nMore importantly, Push Notifications are a marketing goldmine. They keep your brand on top of the customer\'s mind and significantly boost sales conversions compared to traditional websites.'
        },
        {
          title: isAr ? 'الخلاصة: إيه الأنسب لمشروعك؟' : 'Conclusion: What fits your project?',
          content: isAr 
            ? 'نصيحتنا دايماً للشركات اللي لسه بتبدأ: ابدأ بموقع ويب قوي واحترافي عشان تختبر بيه السوق وتبني قاعدة عملاء من خلال محركات البحث بأقل مخاطرة مالية.\n\nولما تلاقي تفاعل قوي وحجم مبيعات بيكبر، هنا يجي دور تطبيق الموبايل عشان تعزز ولاء عملائك وتسهل عليهم عملية الشراء المتكررة. يعني ابدأ ويب، ولما تكبر، اتوسع للموبايل.'
            : 'Our constant advice for startups: Start with a robust, professional website to test the market and build a customer base through SEO with minimal financial risk.\n\nOnce you see strong engagement and growing sales, it’s time to develop a mobile app to enhance customer loyalty and facilitate repeated purchases. Start web, scale mobile.'
        }
      ]
    },
    2: {
      title: isAr ? 'إزاي تختار استضافة وسيرفر لموقعك بدون ما يقع؟' : 'How to Choose the Right Server Without Crashing?',
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
      intro: isAr 
        ? 'اختيار السيرفر أو الاستضافة الصح هو الأساس اللي بيتبني عليه نجاح أي منصة ديجيتال. لو اخترت غلط، موقعك ممكن يقع في أهم أوقات الذروة، وده معناه خسارة عملاء وفلوس. في المقال ده هنبسط لك الأنواع المتاحة.'
        : 'Choosing the right server or hosting is the foundation of any digital platform\'s success. Choose wrong, and your site might crash during peak hours, losing clients and money. We simplify the options here.',
      sections: [
        {
          title: isAr ? 'الاستضافة المشتركة (Shared Hosting)' : 'Shared Hosting',
          content: isAr 
            ? 'دي بتعتبر أرخص خيار موجود ومناسب جداً للمواقع الصغيرة، المدونات، أو الشركات اللي بتعرض معلومات بس وزوارها قليلين. فكرتها إنك بتأجر شقة في عمارة؛ بتشارك موارد السيرفر (زي الرامات والمعالج) مع مواقع تانية.\n\nالمشكلة هنا إن لو موقع تاني في نفس السيرفر جاله ضغط زوار فجأة، ده هيأثر على سرعة موقعك إنت كمان وممكن يوقفه تماماً. فلو شغلك تجارة إلكترونية، ده مش أنسب خيار.'
            : 'This is the cheapest option and is very suitable for small websites, blogs, or portfolio sites with low traffic. Think of it as renting an apartment in a building; you share resources with other websites.\n\nThe downside is if another site on the same server gets a sudden traffic spike, it will slow down or crash your site too. Not recommended for e-commerce.'
        },
        {
          title: isAr ? 'السيرفرات الافتراضية الخاصة (VPS)' : 'Virtual Private Servers (VPS)',
          content: isAr 
            ? 'خيار ممتاز للشركات المتوسطة والمتاجر الإلكترونية اللي بدأت تكبر. في الـ VPS، إنت ما زلت على سيرفر واحد مع ناس تانية، بس بيكون ليك مساحة وموارد مخصصة ليك لوحدك (زي الرامات والـ CPU) محدش بيشاركك فيها.\n\nده بيضمن لك استقرار أكبر بكتير وسرعة أحسن بتكلفة معقولة، وبيكون حل مثالي للسيطرة على موقعك في فترات المواسم أو العروض اللي الزوار فيها بيزيدوا.'
            : 'An excellent choice for medium-sized businesses and growing e-commerce stores. With a VPS, you still share a physical server, but you have dedicated, partitioned resources (RAM, CPU) that no one else can touch.\n\nThis guarantees much better stability and speed at a reasonable cost, making it ideal for handling seasonal spikes and heavy promotions.'
        },
        {
          title: isAr ? 'الاستضافة السحابية (Cloud Hosting) والسيرفرات المخصصة' : 'Cloud Hosting & Dedicated Servers',
          content: isAr 
            ? 'ده بقى الأفضل بلا منازع للشركات الكبيرة والمتاجر اللي بيجيلها آلاف الزوار في نفس اللحظة. الاستضافة السحابية بتعتمد على كذا سيرفر شغالين مع بعض، فلو سيرفر وقع، التاني بيشيل مكانه فوراً، وده بيخلي نسبة إن موقعك يقع شبه مستحيلة.\n\nأما السيرفر المخصص، فإنت بتأجر السيرفر كله لحسابك، وده بيديك أعلى درجات الأمان والتحكم. طبعاً التكلفة أعلى، لكن العائد وحجم المبيعات المحمية بيستاهل كل قرش.'
            : 'This is undoubtedly the best for large enterprises and heavy-traffic stores. Cloud hosting relies on a network of connected servers, so if one fails, another takes over instantly, making downtime practically impossible.\n\nDedicated servers mean you rent an entire physical machine, granting max security and control. The cost is higher, but the protected revenue is worth every penny.'
        }
      ]
    },
    3: {
      title: isAr ? 'إزاي تصميم الـ UI/UX بيضاعف مبيعاتك؟' : 'How UI/UX Design Multiplies Your Sales',
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
      intro: isAr 
        ? 'ناس كتير بتفتكر إن التصميم هو مجرد ألوان وخطوط حلوة، بس الحقيقة إن تجربة المستخدم (UX) وواجهة المستخدم (UI) هما العامل الحاسم في تحويل الزائر لعميل بيشتري، وهما اللي بيفصلوا بين الموقع الناجح والموقع المهجور.'
        : 'Many people think design is just about pretty colors and fonts. The truth is, User Experience (UX) and User Interface (UI) are the critical factors in converting a visitor into a buying customer, separating a successful site from a ghost town.',
      sections: [
        {
          title: isAr ? 'الفرق بين الـ UI والـ UX وتأثيرهم' : 'The Difference Between UI & UX',
          content: isAr 
            ? 'الـ UI (واجهة المستخدم) هو كل حاجة بتشوفها عينك: الألوان، الأزرار، وحجم الخطوط. هو اللي بيشد انتباه العميل في أول ثانية. أما الـ UX (تجربة المستخدم) فهو رحلة العميل وإحساسه وهو بيستخدم المنصة.\n\nالتكامل بينهم بيضمن إن الموقع مش بس شكله حلو، لأ.. كمان سهل الاستخدام. العميل لو لقى الموقع شيك بس مش عارف يوصل لزرار الدفع، هيقفل ويمشي فوراً.'
            : 'UI (User Interface) is everything you see: colors, buttons, typography. It grabs the user\'s attention in the first second. UX (User Experience) is the journey and the feeling the user gets while navigating.\n\nThe integration of both ensures the site isn\'t just pretty, but functional. If a site looks great but the user can\'t find the checkout button, they will bounce immediately.'
        },
        {
          title: isAr ? 'السرعة والتبسيط بيزودوا الـ Conversion Rate' : 'Speed and Simplicity Boost Conversion Rates',
          content: isAr 
            ? 'الدراسات بتأكد إن لو العميل أخد أكتر من 3 ثواني عشان يفهم الموقع بيعمل إيه أو يوصل للمنتج، نسبة إنه يشتري بتقل جداً. التصميم المعقد والتفاصيل الكتير بتشتت الزائر.\n\nكل ما بسطت خطوات الشراء (Checkout Process) وخليت الطريق واضح للمستخدم، كل ما زادت احتمالية إتمام عملية الدفع. التبسيط هو السر الحقيقي لمضاعفة المبيعات.'
            : 'Studies confirm that if a customer takes more than 3 seconds to understand what a site does or find a product, the chance of purchasing drops massively. Cluttered designs distract visitors.\n\nThe more you simplify the checkout process and clear the path for the user, the higher the likelihood of a completed transaction. Simplicity is the true secret to multiplying sales.'
        },
        {
          title: isAr ? 'بناء الثقة والاحترافية' : 'Building Trust and Professionalism',
          content: isAr 
            ? 'في عالم مليان مواقع، الثقة هي العملة الأهم. الموقع اللي متصمم باحترافية وتوزيع عناصره مريح للعين، بيدي انطباع فوري للمستخدم إن شركتك كبيرة وموثوقة.\n\nده بيخلي العميل يخرج الكريديت كارد ويدفع وهو مطمن من غير ما يخاف من عمليات النصب. التصميم الممتاز بيقلل حاجز الخوف عند العميل الجديد وبيشجعه ياخد القرار أسرع.'
            : 'In a world full of websites, trust is the most important currency. A professionally designed site with comfortable layouts gives the immediate impression that your company is large and reliable.\n\nThis makes the customer feel safe enough to take out their credit card and pay without fear of scams. Excellent design lowers the barrier of hesitation for new clients.'
        }
      ]
    },
    4: {
      title: isAr ? 'الـ MVP: اختبر فكرتك بأقل تكلفة' : 'The MVP: Test Your Idea at Minimal Cost',
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      intro: isAr 
        ? 'عايز تنفذ فكرة تطبيق ضخمة بس خايف تصرف ميزانيتك كلها ومحدش يستخدمه؟ الحل السحري هو الـ MVP (المنتج القابل للتطبيق بأقل المميزات). في المقال ده هنشرح لك إزاي تبدأ صح وتوفر فلوسك.'
        : 'Want to launch a massive app idea but afraid of blowing your budget on something nobody uses? The magical solution is the MVP (Minimum Viable Product). We explain how to start smart and save money.',
      sections: [
        {
          title: isAr ? 'إيه هو الـ MVP أصلاً؟' : 'What Exactly is an MVP?',
          content: isAr 
            ? 'الـ MVP مش معناه منتج ناقص أو وحش. هو أصغر نسخة ممكنة من مشروعك بتحتوي على المميزات الأساسية فقط (Core Features) اللي بتحل المشكلة الرئيسية للعميل. \n\nيعني لو بتعمل تطبيق توصيل، الميزة الأساسية هي إن العميل يطلب والأوردر يوصل، مش لازم تبني نظام نقاط مكافآت معقد في المرحلة دي.'
            : 'An MVP doesn\'t mean a bad or broken product. It is the smallest possible version of your project that contains only the Core Features solving the customer\'s main problem.\n\nIf you\'re building a delivery app, the core feature is placing an order and tracking delivery. You don\'t need a complex loyalty points system at this stage.'
        },
        {
          title: isAr ? 'الهدف الحقيقي من الـ MVP' : 'The Real Goal of an MVP',
          content: isAr 
            ? 'الهدف مش إنك تنزل بمنتج كامل، الهدف هو إنك تختبر الفكرة على أرض الواقع. إنت بتوفر آلاف الدولارات بدل ما تبني مميزات العميل أصلاً مش مهتم بيها.\n\nلما تطلق الـ MVP، هتعرف إذا كان الناس مستعدة تدفع فلوس في خدمتك ولا لأ، وهتسمع منهم تعليقات (Feedback) تبني عليها التطويرات المستقبلية.'
            : 'The goal isn\'t to launch a complete product, but to validate the idea in the real world. You save thousands of dollars instead of building features users don\'t actually care about.\n\nWhen you launch an MVP, you figure out if people are willing to pay for your service, and you gather feedback to guide future development accurately.'
        },
        {
          title: isAr ? 'خطوات التنفيذ الناجحة' : 'Steps for Successful Implementation',
          content: isAr 
            ? 'أولاً، حدد المشكلة اللي بتواجه العميل بدقة. ثانياً، اختار الحل الأبسط والأسرع برمجياً. ثالثاً، اطلق المنتج بسرعة وراقبه خطوة بخطوة.\n\nبعد ما تجمع آراء العملاء وتتأكد من نجاح الفكرة، تقدر وقتها تضخ استثمارات أكبر في إضافة ميزات جديدة وتوسيع نطاق السيستم بثقة تامة.'
            : 'First, accurately define the problem your customer faces. Second, choose the simplest and fastest programmatic solution. Third, launch quickly and monitor closely.\n\nAfter gathering customer feedback and validating the idea, you can confidently inject larger investments to add new features and scale the system.'
        }
      ]
    },
    5: {
      title: isAr ? 'تبني سيستم (ERP) خاص بيك ولا تشتري جاهز؟' : 'Custom ERP vs. Ready-Made Software?',
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      intro: isAr 
        ? 'أي شركة بتكبر بتحتاج نظام إدارة موارد (ERP) يلم شغلها. وهنا بييجي السؤال الأهم: أشتري برنامج جاهز وادفع اشتراكات، ولا أستثمر في برمجة سيستم خاص متفصل على مقاس شغلي؟'
        : 'Any growing company needs an ERP system to manage operations. Here lies the big question: Do I buy ready-made software and pay subscriptions, or invest in custom software tailored to my business?',
      sections: [
        {
          title: isAr ? 'البرامج الجاهزة: حل سريع بس مقيد' : 'Ready-made: Fast but Constraining',
          content: isAr 
            ? 'البرامج الجاهزة (زي Odoo أو SAP) بتوفر لك حل سريع ومُجرب وتكلفتها المبدئية بتكون أقل. لكن مشكلتها الأكبر إنها مش متفصلة على مقاس طريقة شغلك إنت.\n\nغالباً هتلاقي نفسك بتضطر تغير سياسة إدارتك وعملياتك الداخلية عشان تناسب السيستم، ده غير الاشتراكات الشهرية اللي بتزيد مع زيادة عدد المستخدمين عندك.'
            : 'Ready-made software (like Odoo or SAP) provides a fast, tested solution with a lower initial cost. The biggest issue is that it isn\'t tailored to your unique workflow.\n\nYou often end up changing your internal management policies to fit the system. Plus, monthly subscription costs inflate rapidly as you add more users.'
        },
        {
          title: isAr ? 'السيستم الخاص: استثمار طويل المدى' : 'Custom System: Long-term Investment',
          content: isAr 
            ? 'لما بتبني سيستم مخصص (Custom ERP)، السيستم هو اللي بيتفصل على شغلك مش العكس. بيحتوي على الميزات اللي إنت محتاجها بس بدون تعقيدات البرامج الجاهزة.\n\nرغم إن التكلفة الأولية لبرمجة السيستم بتكون أعلى، لكن إنت بتدفع مرة واحدة وبتملك الكود بالكامل (Source Code)، ومفيش أي اشتراكات شهرية بتستنزف أرباحك، وده بيكون أوفر كتير على المدى البعيد.'
            : 'When building a custom ERP, the system is tailored precisely to your operations. It includes only the features you need, avoiding the bloat of ready-made software.\n\nWhile the upfront cost is higher, you pay once and own the full Source Code. There are no monthly subscriptions draining your profits, making it vastly cheaper long-term.'
        },
        {
          title: isAr ? 'القرار: إيه الأنسب ليك؟' : 'The Decision: What is best for you?',
          content: isAr 
            ? 'لو شركتك لسه بتبدأ وحجم عملياتك بسيط، استخدم البرامج الجاهزة لأنها هتنجزك. \n\nلكن لو شركتك كبرت، عندك فروع متعددة، وعمليات إدارية ومالية معقدة بتميزك عن غيرك، يبقى الاستثمار في سيستم خاص هو الحل الوحيد للحفاظ على استقلالية وسرية البيزنس بتاعك وتسهيل التوسع في المستقبل.'
            : 'If your company is just starting with simple operations, use ready-made software to save time.\n\nBut if you have grown, have multiple branches, and complex, unique administrative processes, investing in a custom system is the only way to maintain business independence, secrecy, and smooth future scaling.'
        }
      ]
    },
    6: {
      title: isAr ? 'أهمية تأمين مواقع الويب وتشفير البيانات' : 'The Importance of Web Security and Encryption',
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
      intro: isAr 
        ? 'اختراق موقعك أو تسريب بيانات عملائك ممكن يدمر ثقة الناس في شركتك للأبد. الأمان الرقمي مبقاش رفاهية، ده أساس استمرارية أي بيزنس على الإنترنت. إزاي تحمي نفسك وعملائك؟'
        : 'A data breach can destroy customer trust forever. Digital security is no longer a luxury; it\'s the foundation for business continuity online. How do you protect yourself and your clients?',
      sections: [
        {
          title: isAr ? 'تسريب البيانات والثقة المفقودة' : 'Data Breaches and Lost Trust',
          content: isAr 
            ? 'لو بيانات عملائك (زي الإيميلات، الباسوردات، أو بيانات بطاقات الائتمان) اتسربت، الخسارة مش هتكون مادية بس؛ إنت بتفقد أهم حاجة بتمتلكها وهي "السمعة والثقة".\n\nالعميل اللي بيحس إن بياناته مش في أمان معاك، مستحيل يرجع يتعامل معاك تاني، والأسوأ إنه هينقل التجربة دي لغيره، وده بيدمر مجهود سنين من التسويق.'
            : 'If your customers\' data (emails, passwords, credit cards) is leaked, the loss isn\'t just financial; you lose your most valuable asset: "Reputation and Trust".\n\nA customer who feels unsafe with you will never return, and worse, they will share that negative experience, destroying years of marketing effort.'
        },
        {
          title: isAr ? 'تشفير الـ SSL: الخطوة الأولى' : 'SSL Encryption: The First Step',
          content: isAr 
            ? 'أبسط وأهم خطوة للأمان هي تفعيل شهادة (SSL) اللي بتظهر كـ قفل أخضر جنب رابط موقعك. الشهادة دي بتعمل تشفير كامل لأي بيانات بيكتبها العميل على الموقع.\n\nالتشفير ده بيضمن إن حتى لو في هاكر بيحاول يتجسس على الاتصال في النص، هيشوف مجرد رموز معقدة ملهاش أي معنى ومش هيقدر يسرق البيانات.'
            : 'The simplest and most vital security step is activating an SSL certificate, showing the green padlock next to your URL. It fully encrypts any data typed by the user.\n\nThis encryption ensures that even if a hacker tries to intercept the connection, they will only see meaningless, jumbled code, preventing any data theft.'
        },
        {
          title: isAr ? 'إجراءات الحماية الإضافية المتقدمة' : 'Advanced Additional Protections',
          content: isAr 
            ? 'الأمان مبيقفش عند الـ SSL. لازم تتأكد إن لوحة تحكم موقعك محمية من هجمات التخمين (Brute Force)، وإن الكود خالي من الثغرات البرمجية الشهيرة زي الـ SQL Injection.\n\nكمان، عمل نسخ احتياطية (Backups) بشكل تلقائي ومنفصل عن السيرفر الأساسي، بيضمن لك إنك تقدر تسترجع شغلك بالكامل في ثواني لو حصل أي خلل طارئ.'
            : 'Security doesn\'t stop at SSL. You must ensure your dashboard is protected against Brute Force attacks, and the code is free of common vulnerabilities like SQL Injection.\n\nMoreover, taking automated backups stored separately from the main server ensures you can fully restore your work in seconds in case of any emergency.'
        }
      ]
    }
  };

  return blogs[id as keyof typeof blogs] || null;
};
