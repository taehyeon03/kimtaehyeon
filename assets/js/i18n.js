/*
 * KO / EN language switch for the portfolio.
 *
 * English text lives in index.html (so the page still reads fine without JS);
 * it is captured on load. Korean text lives in the KO dictionary below.
 * To add or change a translated string: give the element a data-i18n="key"
 * attribute in index.html and add the same key to KO.
 *
 * Language priority: ?lang=ko|en in the URL > last choice (localStorage) > browser language.
 */
(function () {
	'use strict';

	var KO = {
		pdfButton: 'PDF 다운로드',
		name: '김태현',
		tagline: '조선대학교 인공지능공학과',
		downloadCV: '이력서 다운로드',
		location: '대한민국',
		intro: '조선대학교 <b>인공지능공학과</b>에 재학 중인 학부생입니다. 주요 관심 연구 분야는 <b>인공지능</b>, <b>컴퓨터 비전</b>, <b>대규모 언어 모델(LLM)</b>, 그리고 <b>Vision-Language-Action(VLA) 모델</b>입니다.',

		secEducation: '학력',
		eduSchool: '조선대학교',
		eduPeriod: '2022 – 현재',
		eduDegree: '인공지능공학과 공학사 과정 &nbsp;·&nbsp; 3학년',
		eduCoursework: '주요 이수 과목: 자연어처리, 딥러닝',

		secPublications: '논문',

		secAwards: '수상',
		award1Title: '대상',
		award1Meta: '조선대학교 | 2026년 1월',
		award1Desc: '제8회 AI 로봇 융합 아이디어 경진대회',
		award2Title: '장려상',
		award2Meta: '한성대학교 | 2026년 2월',
		award2Desc: 'Dual-arm Robot Physical AI 해커톤',

		secProjects: '프로젝트',
		proj1Title: 'PEFT 기반 파인튜닝 연구',
		proj1Period: '2026 – 현재',
		proj1Desc: '대규모 언어·비전 모델을 위한 파라미터 효율적 파인튜닝(PEFT) 기법 연구',
		proj1Status: '상태: <em>진행 중</em> — 세부 내용 추후 업데이트 예정',

		secExperience: '활동',
		exp1Title: '조선대학교 알고리즘 동아리 (CAC)',
		exp1Meta: '조선대학교',
		exp1Desc: 'CHOSUN ALGORITHM CLUB 회원 — 경쟁 프로그래밍 및 알고리즘 스터디',

		secCareer: '진로 목표',
		goal1: '컴퓨터 비전 엔지니어',
		goal2: '대규모 언어 모델(LLM) 연구자',
		goal3: '피지컬 AI / 로보틱스 개발자',

		secSkills: '기술 스택',
		lvlAdvanced: '고급',
		lvlIntermediate: '중급',
		lvlBasic1y: '기초 (1년)'
	};

	var META = {
		en: {
			title: 'TaeHyeon Kim | Portfolio',
			description: 'Portfolio of TaeHyeon Kim - Undergraduate in AI Engineering, Chosun University',
			pdf: 'assets/files/CV_TaeHyeon_Kim.pdf',
			pdfName: 'CV_TaeHyeon_Kim.pdf'
		},
		ko: {
			title: '김태현 | 포트폴리오',
			description: '김태현 포트폴리오 - 조선대학교 인공지능공학과',
			pdf: 'assets/files/CV_TaeHyeon_Kim_KO.pdf',
			pdfName: '이력서_김태현.pdf'
		}
	};

	var STORAGE_KEY = 'portfolio-lang';
	var nodes = document.querySelectorAll('[data-i18n]');
	var EN = [];
	for (var i = 0; i < nodes.length; i++) EN.push(nodes[i].innerHTML);

	function safeGet() {
		try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
	}
	function safeSet(v) {
		try { localStorage.setItem(STORAGE_KEY, v); } catch (e) { /* ignore */ }
	}

	function initialLang() {
		var q = new URLSearchParams(window.location.search).get('lang');
		if (q === 'ko' || q === 'en') return q;
		var saved = safeGet();
		if (saved === 'ko' || saved === 'en') return saved;
		return (navigator.language || '').toLowerCase().indexOf('ko') === 0 ? 'ko' : 'en';
	}

	function setLang(lang) {
		for (var i = 0; i < nodes.length; i++) {
			var key = nodes[i].getAttribute('data-i18n');
			nodes[i].innerHTML = (lang === 'ko' && KO[key] != null) ? KO[key] : EN[i];
		}

		var m = META[lang];
		document.documentElement.lang = lang;
		document.title = m.title;
		var desc = document.querySelector('meta[name="description"]');
		if (desc) desc.setAttribute('content', m.description);

		var pdfBtn = document.getElementById('pdf-btn');
		if (pdfBtn) { pdfBtn.href = m.pdf; pdfBtn.setAttribute('download', m.pdfName); }
		var cvLink = document.getElementById('cv-link');
		if (cvLink) cvLink.href = m.pdf;

		var btns = document.querySelectorAll('.lang-btn');
		for (var j = 0; j < btns.length; j++) {
			var on = btns[j].getAttribute('data-lang') === lang;
			btns[j].classList.toggle('active', on);
			btns[j].setAttribute('aria-pressed', on ? 'true' : 'false');
		}

		safeSet(lang);
	}

	var langBtns = document.querySelectorAll('.lang-btn');
	for (var k = 0; k < langBtns.length; k++) {
		langBtns[k].addEventListener('click', function () {
			setLang(this.getAttribute('data-lang'));
		});
	}

	setLang(initialLang());
})();
