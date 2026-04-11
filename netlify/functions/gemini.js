exports.handler = async (event) => {
    try {
        // استقبال النص اللي يكتبه الزبون في موقعك
        const { prompt } = JSON.parse(event.body);

        // مفتاحك اللي أرسلتيه (بيكون مخفي هنا داخل السيرفر)
        const API_KEY = "AIzaSyAZzvUhYZdc2pDplTYXDAX7U-jKRH8-5XY"; 
        
        // رابط جوجل الرسمي لطلب الرد من موديل Gemini
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        // إرسال الطلب لجوجل
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "أنت خبير مبيعات في محل بن جمال عدن. جاوب بلهجة عدنية مهذبة جداً وبصيغة المفرد (تفضل، يا غالي، حياك الله). التنسيق HTML بداخل <li>: " + prompt }] }]
            })
        });

        const data = await response.json();

        // استخراج النص من رد جوجل
        if (data.candidates && data.candidates[0].content) {
            const aiText = data.candidates[0].content.parts[0].text;
            return {
                statusCode: 200,
                body: JSON.stringify({ text: aiText })
            };
        } else {
            throw new Error("رد غير متوقع من جوجل");
        }

    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ text: "<li>عذراً يا غالي، في مشكلة تقنية بسيطة.. جرب مرة ثانية.</li>" })
        };
    }
};