/*
  Beri language-independent reading trainer logic

  External files expected before this file:
  - content-xx.js defining window.BERI_CONTENT
  - ui-xx.js defining window.BERI_UI
*/

(function (global) {
  "use strict";

  const PROFILE_PREFIX = "beri_student_v2_";
  const ACTIVE_STUDENT_COOKIE = "beri_active_student_v2";
  const STUDENT_INDEX_COOKIE = "beri_student_index_v2";
  const ACTIVE_STUDENT_STORAGE = "beri_active_student_v2";
  const STUDENT_INDEX_STORAGE = "beri_student_index_v2";
  const LANGUAGE_STORAGE = "beri_language";
  const COOKIE_DAYS = 400;
  const DAILY_GOAL_POINTS = 500;
  const LEVEL_COMPLETION_POINTS = 15;
  const DEFAULT_CONTENT = {
    language: "und",
    title: "Beri",
    timing: {
      intervalSeconds: 20,
      encouragementThreshold: 8,
      masteryThreshold: 15,
      tooFastThreshold: 50
    },
    groups: []
  };

  const DEFAULT_UI = {
    meta: {
      language: "und",
      appName: "Beri",
      version: "1.0"
    },
    navigation: {
      intro: "Intro",
      practice: "Practice",
      stories: "Stories",
      progress: "Progress",
      settings: "Settings",
      contact: "Contact"
    },
    intro: {
      eyebrow: "Reading trainer",
      heading: "Beri",
      lead: ""
    },
    sidebar: {
      tip: "Small and regular practice helps most."
    },
    practice: {
      start: "Start",
      next: "Next",
      nextLevel: "Next level",
      ready: "Ready? Read aloud.",
      prompt: "Tap start to begin.",
      instruction: "",
      hint: "",
      counterLabel: "Count",
      todayPointsLabel: "Points today",
      scoreLabel: "Score",
      studentLabel: "Current student"
    },
    stories: {
      eyebrow: "Stories",
      heading: "Read and understand",
      selectLevel: "Choose a story level",
      randomStory: "New story",
      titleFallback: "Story",
      questionHeading: "Question",
      noStories: "No stories are available for this level yet.",
      answerRetry: "Try once more.",
      firstTrySuffix: "First try",
      secondTrySuffix: "Second try",
      levelPrefix: "Level",
      nextButton: "Another story"
    },
    students: {
      heading: "Student",
      title: "Your progress",
      activeLabel: "Active student",
      nameLabel: "Name",
      placeholder: "Enter student name",
      save: "Save",
      help: "Type a name to load or create a student profile.",
      defaultName: "Guest"
    },
    progress: {
      totalPoints: "Total points",
      practicedDays: "Practiced days",
      streak: "Current streak",
      overviewHeading: "Level overview",
      legend: "Stars show confidence for each level.",
      timelineHeading: "Progress over time",
      timelineSubtitle: "Points by difficulty group",
      todayHeading: "Today",
      pointsToday: "Points today",
      currentLevel: "Current level",
      averageSpeed: "Average speed",
      goal: "Daily goal",
      noData: "No saved practice yet.",
      daysSuffix: "days",
      levelFallback: "No level yet",
      speedUnit: "reading points / round"
    },
    settings: {
      eyebrow: "Setup",
      heading: "Settings",
      studentHeading: "Student",
      levelHeading: "Levels",
      languageHeading: "Language",
      languageLabel: "App language",
      optionsHeading: "Options",
      showSyllableBreaks: "Show syllable breaks",
      syllableColors: "Color syllables slightly differently",
      uppercase: "Uppercase",
      gentleMode: "Gentle reading mode",
      reportHeading: "Progress report",
      reportSubtitle: "Reading speed by category.",
      reportDateHeading: "Date",
      reportTotalHeading: "Overall",
      reportDownload: "Download CSV",
      reportNoSpeed: "Not enough speed data yet",
      reportNeedsWork: "Needs work",
      reportBuilding: "Building",
      reportFluent: "Fluent"
    },
    contact: {
      heading: "Contact",
      name: "",
      email: ""
    },
    feedback: {
      encouraging: [
        "Good start.",
        "One syllable at a time.",
        "Slow and accurate is good.",
        "Keep practising."
      ],
      progress: [
        "Good progress.",
        "You are getting more fluent.",
        "You stayed focused.",
        "Keep going."
      ],
      mastery: [
        "Strong reading round.",
        "Very fluent reading.",
        "You read many items.",
        "Well done."
      ],
      tooFast: [
        "Too fast. Read each item aloud; only real reading counts."
      ]
    }
  };

  const DEFAULT_IMAGES = {
    start: "book",
    encouraging: ["bookfly", "glasses", "ok2", "loop"],
    progress: ["bookfly", "glasses", "ok2", "loop"],
    mastery: ["bookfly", "ok", "you", "loud", "fly", "pirat", "loop"],
    tooFast: ["glasses"]
  };

  const STORY_POINTS = {
    firstTry: 40,
    secondTry: 20
  };

  const STATE = {
    counter: 0,
    score: 0,
    levelScore: 0,
    initialTime: 0,
    levelId: 1,
    oldItem: "",
    studentName: "",
    profile: null,
    storyLevelId: null,
    storyLevelKey: "",
    storyCurrent: null,
    storyAnswerOptions: [],
    storyAnswered: false,
    storyAttempt: 0,
    storySelectedIndex: -1
  };

  let content = mergeDeep(DEFAULT_CONTENT, global.BERI_CONTENT || {});
  let ui = mergeDeep(DEFAULT_UI, global.BERI_UI || {});
  let stories = global.BERI_STORIES || { groups: [] };
  const supportedLocales = normaliseLocales(global.BERI_LOCALES);
  const currentLocale = normaliseLocale(global.BERI_CURRENT_LOCALE || {}, (content.language || ui.meta.language || "de").toLowerCase());
  let levelIndex = buildLevelIndex(content);
  let storyLevelIndex = buildStoryLevelIndex(stories);

  function mergeDeep(base, extra) {
    if (!isPlainObject(base)) return clone(extra);
    const result = clone(base);

    if (!isPlainObject(extra)) return result;

    Object.keys(extra).forEach(function (key) {
      const source = extra[key];
      const target = result[key];

      if (isPlainObject(target) && isPlainObject(source)) {
        result[key] = mergeDeep(target, source);
      } else {
        result[key] = clone(source);
      }
    });

    return result;
  }

  function clone(value) {
    if (Array.isArray(value)) return value.slice();
    if (isPlainObject(value)) return Object.assign({}, value);
    return value;
  }

  function isPlainObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function normaliseLocale(locale, fallbackCode) {
    const code = String(locale && locale.code || fallbackCode || "de").toLowerCase();
    return {
      code: code,
      label: locale && locale.label || code,
      folder: locale && locale.folder || ("locales/" + code),
      content: locale && locale.content || ("locales/" + code + "/content.js"),
      ui: locale && locale.ui || ("locales/" + code + "/ui.js"),
      storiesManifest: locale && locale.storiesManifest || ("locales/" + code + "/stories/manifest.js"),
      storiesIndex: locale && locale.storiesIndex || ("locales/" + code + "/stories/index.js")
    };
  }

  function normaliseLocales(locales) {
    if (!Array.isArray(locales)) return [];
    return locales
      .map(function (locale) {
        return normaliseLocale(locale, "de");
      })
      .filter(function (locale) {
        return !!locale.code;
      });
  }

  function buildLevelIndex(data) {
    const index = new Map();
    const groups = Array.isArray(data.groups) ? data.groups : [];

    groups.forEach(function (group) {
      const levels = Array.isArray(group.levels) ? group.levels : [];
      levels.forEach(function (level) {
        if (!level || level.id === undefined) return;
        index.set(Number(level.id), Object.assign({}, level, {
          groupId: group.id,
          groupLabel: group.label
        }));
      });
    });

    return index;
  }

  function buildStoryLevelIndex(data) {
    const index = new Map();
    const groups = Array.isArray(data && data.groups) ? data.groups : [];

    groups.forEach(function (group) {
      const levels = Array.isArray(group.levels) ? group.levels : [];
      levels.forEach(function (level) {
        if (!level || level.id === undefined) return;
        index.set(storyLevelKey(group.id, level.id), Object.assign({}, level, {
          groupId: group.id,
          groupLabel: group.label
        }));
      });
    });

    return index;
  }

  function storyLevelKey(groupId, levelId) {
    return String(groupId || "") + "::" + String(levelId || "");
  }

  function randomElement(items) {
    if (!Array.isArray(items) || items.length === 0) return "";
    return items[Math.floor(Math.random() * items.length)];
  }

  function randomInt(maxInt) {
    return Math.floor(Math.random() * (maxInt + 1));
  }

  function byId(id) {
    return global.document ? global.document.getElementById(id) : null;
  }

  function setText(id, text) {
    const el = byId(id);
    if (el) el.innerHTML = text;
  }

  function setOptionalText(id, text, fallback) {
    const el = byId(id);
    if (!el) return;

    const value = text === undefined || text === null ? fallback : text;
    el.innerHTML = value || "";
    el.style.display = value ? "" : "none";
  }

  function setValue(id, text) {
    const el = byId(id);
    if (el) el.value = text;
  }

  function setWidth(id, percent) {
    const el = byId(id);
    if (el) el.style.width = percent + "%";
  }

  function setDocumentLanguage() {
    if (!global.document || !global.document.documentElement) return;
    global.document.documentElement.lang = content.language || ui.meta.language || "und";
  }

  function setDocumentMetadata() {
    if (!global.document) return;

    const title = ui.meta.title || content.title || ui.meta.appName || "Beri";
    global.document.title = title;

    const description = ui.meta.description || content.title || ui.meta.appName || "Beri";
    const descriptionTag = global.document.querySelector('meta[name="description"]');
    if (descriptionTag) descriptionTag.setAttribute("content", description);
  }

  function setButtonText(text) {
    const button = byId("btnNaprej");
    if (!button) return;
    if ("value" in button) button.value = text;
    button.innerHTML = text;
  }

  function setWordText(text, color) {
    const wordEl = byId("word");
    if (!wordEl) return;
    const plainText = String(text || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    const isSentence = plainText.indexOf(" ") !== -1;
    const isLongText = plainText.length > 28;
    wordEl.style.color = color || "black";
    wordEl.classList.toggle("main-text-sentence", isSentence);
    wordEl.classList.toggle("main-text-long", isLongText);
    wordEl.innerHTML = text;
  }

  function setPracticeFeedbackState(kind) {
    const wordEl = byId("word");
    if (!wordEl || !wordEl.classList) return;

    wordEl.classList.remove("main-text-feedback", "main-text-feedback-good", "main-text-feedback-warning");
    if (!kind) return;

    wordEl.classList.add("main-text-feedback");
    if (kind === "tooFast") {
      wordEl.classList.add("main-text-feedback-warning");
    } else {
      wordEl.classList.add("main-text-feedback-good");
    }
  }

  function setImage(fileName) {
    const image = byId("parrotBeri");
    if (image && fileName) image.src = "images/" + fileName + ".jpg";
  }

  function formatNumber(number) {
    return Number(number || 0).toLocaleString(content.language || ui.meta.language || undefined);
  }

  function localDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function todayKey() {
    return localDateKey(new Date());
  }

  function parseDateKey(dateKey) {
    if (!dateKey) return null;
    const parts = dateKey.split("-");
    if (parts.length !== 3) return null;
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }

  function daysBetween(previousKey, nextKey) {
    const previous = parseDateKey(previousKey);
    const next = parseDateKey(nextKey);
    if (!previous || !next) return null;
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.round((next.getTime() - previous.getTime()) / msPerDay);
  }

  function formatDateLabel(dateKey) {
    const parsed = parseDateKey(dateKey);
    if (!parsed) return dateKey;
    return parsed.toLocaleDateString(content.language || ui.meta.language || undefined, {
      day: "numeric",
      month: "short"
    });
  }

  function applyStaticText() {
    setText("brandName", ui.meta.appName || "Beri");
    setText("navIntro", ui.navigation.intro || "Intro");
    setText("navPractice", ui.navigation.practice || "Practice");
    setText("navStories", ui.navigation.stories || "Stories");
    setText("navProgress", ui.navigation.progress || "Progress");
    setText("navSettings", ui.navigation.settings || "Settings");
    setText("navContact", ui.navigation.contact || "Contact");

    setText("sidebarTip", ui.sidebar && ui.sidebar.tip || "");
    setText("introEyebrow", ui.intro && ui.intro.eyebrow || "");
    setText("introHeading", ui.intro && ui.intro.heading || ui.meta.appName || "Beri");
    setOptionalText("introLead", ui.intro && ui.intro.lead || "", "");
    setOptionalText("aboutUsageHeading", ui.intro && ui.intro.usageHeading || "", "");
    setOptionalText("aboutUsageText", ui.intro && ui.intro.usageText || "", "");

    setOptionalText("contentTitle", ui.navigation && ui.navigation.practice || "Practice", "");
    setText("counterLabel", ui.practice && ui.practice.counterLabel || "Count");
    setText("practiceTodayPointsLabel", ui.practice && ui.practice.todayPointsLabel || ui.progress && ui.progress.pointsToday || "Points today");
    setText("scoreLabel", ui.practice && ui.practice.scoreLabel || "Score");
    setOptionalText("practiceInstruction", ui.practice && ui.practice.instruction || "", "");
    setOptionalText("practiceHint", ui.practice && ui.practice.hint || "", "");
    setOptionalText("practiceStudentLabel", ui.navigation && ui.navigation.practice || "Practice", "");

    setOptionalText("storiesEyebrow", ui.stories && ui.stories.titleFallback || "Story", "");
    setText("storiesHeading", ui.stories && ui.stories.levelPrefix || "Level");
    setOptionalText("storyLevelName", "", "");
    setText("storyNextBtn", ui.stories && ui.stories.nextButton || "Another story");
    setOptionalText("storyPrompt", ui.stories && ui.stories.prompt || "", "");

    setText("studentHeading", ui.students && ui.students.heading || "Student");
    setText("progressTitle", ui.students && ui.students.title || "Your progress");
    setText("activeStudentLabel", ui.students && ui.students.activeLabel || "Active student");
    setOptionalText(
      "studentNameLabel",
      ui.students && Object.prototype.hasOwnProperty.call(ui.students, "nameLabel") ? ui.students.nameLabel : undefined,
      "Name"
    );
    setOptionalText("progressStudentHelp", ui.students && ui.students.help || "", "");
    setOptionalText("settingsStudentHelp", ui.students && ui.students.help || "", "");
    setText("studentSaveBtn", ui.students && ui.students.save || "Save");

    const studentInput = byId("studentNameInput");
    if (studentInput) {
      studentInput.placeholder = ui.students && ui.students.placeholder || "";
    }

    setText("summaryTotalLabel", ui.progress && ui.progress.totalPoints || "Total points");
    setText("summaryDaysLabel", ui.progress && ui.progress.practicedDays || "Practiced days");
    setText("summaryStreakLabel", ui.progress && ui.progress.streak || "Current streak");
    setText("progressOverviewHeading", ui.progress && ui.progress.overviewHeading || "Level overview");
    setText("progressLegend", ui.progress && ui.progress.legend || "");
    setText("progressTimelineHeading", ui.progress && ui.progress.timelineHeading || "Progress over time");
    setText("progressTimelineSubtitle", ui.progress && ui.progress.timelineSubtitle || "");
    setText("todayHeading", ui.progress && ui.progress.todayHeading || "Today");
    setText("todayPointsLabel", ui.progress && ui.progress.pointsToday || "Points today");
    setText("todayLevelLabel", ui.progress && ui.progress.currentLevel || "Current level");
    setText("todaySpeedLabel", ui.progress && ui.progress.averageSpeed || "Average speed");
    setText("todayGoalLabel", ui.progress && ui.progress.goal || "Daily goal");

    setText("settingsEyebrow", ui.settings && ui.settings.eyebrow || "");
    setText("settingsHeading", ui.settings && ui.settings.heading || "Settings");
    setText("studentSettingsHeading", ui.settings && ui.settings.studentHeading || "Student");
    setText("optionsHeading", ui.settings && ui.settings.optionsHeading || "Options");
    setText("dashLabel", ui.settings && ui.settings.showSyllableBreaks || "Show syllable breaks");
    setText("syllableColorsLabel", ui.settings && ui.settings.syllableColors || "Color syllables slightly differently");
    setText("capitalLabel", ui.settings && ui.settings.uppercase || "Uppercase");
    setText("languageHeading", ui.settings && ui.settings.languageHeading || "Language");
    setText("languageLabel", ui.settings && ui.settings.languageLabel || "App language");
    setText("gentleModeLabel", ui.settings && ui.settings.gentleMode || "Gentle reading mode");
    setText("levelHeading", ui.settings && ui.settings.levelHeading || "Levels");
    setText("settingsReportHeading", ui.settings && ui.settings.reportHeading || "Progress report");
    setText("settingsReportSubtitle", ui.settings && ui.settings.reportSubtitle || "Reading speed by category.");
    setText("downloadReportBtn", ui.settings && ui.settings.reportDownload || "Download CSV");
    setText("practiceNextLevelBtn", ui.practice && ui.practice.nextLevel || "Next level");

    setText("contactHeading", ui.contact && ui.contact.heading || "Contact");
    setText("contactName", ui.contact && ui.contact.name || "");
    setText("contactEmail", ui.contact && ui.contact.email || "");
  }

  function getTiming() {
    return Object.assign({}, DEFAULT_CONTENT.timing, content.timing || {});
  }

  function getCurrentLevel() {
    return levelIndex.get(Number(STATE.levelId)) || firstLevel() || null;
  }

  function getOrderedLevels() {
    const levels = [];
    (content.groups || []).forEach(function (group) {
      (Array.isArray(group.levels) ? group.levels : []).forEach(function (level) {
        levels.push(level);
      });
    });
    return levels;
  }

  function firstLevel() {
    const first = levelIndex.keys().next();
    return first.done ? null : levelIndex.get(first.value);
  }

  function getItemsForLevel(level) {
    if (!level) return [];
    return Array.isArray(level.items) ? level.items : [];
  }

  function getStoryGroupList() {
    return (stories.groups || []).map(function (group, index) {
      return {
        id: group.id,
        label: group.label,
        color: firstGroupColor(group, index),
        levels: Array.isArray(group.levels) ? group.levels : []
      };
    });
  }

  function firstStoryLevel() {
    const first = storyLevelIndex.values().next();
    return first.done ? null : first.value;
  }

  function currentStoryLevel() {
    return storyLevelIndex.get(STATE.storyLevelKey) || firstStoryLevel() || null;
  }

  function storiesForLevel(level) {
    return level && Array.isArray(level.stories) ? level.stories.filter(Boolean) : [];
  }

  function ensureStoryStats(profile) {
    profile.storyStats = profile.storyStats || {};
    profile.storyStats.totalPoints = Number(profile.storyStats.totalPoints || 0);
    profile.storyStats.completedCount = Number(profile.storyStats.completedCount || 0);
    profile.storyStats.correctAnswers = Number(profile.storyStats.correctAnswers || 0);
    profile.storyStats.firstTryCorrect = Number(profile.storyStats.firstTryCorrect || 0);
    profile.storyStats.levels = profile.storyStats.levels || {};
    profile.storyStats.stories = profile.storyStats.stories || {};
    profile.storyStats.recentByLevel = profile.storyStats.recentByLevel || {};
    return profile.storyStats;
  }

  function getStoryLevelStats(profile, levelKey) {
    const stats = ensureStoryStats(profile);
    stats.levels[levelKey] = stats.levels[levelKey] || {
      completedCount: 0,
      correctAnswers: 0,
      firstTryCorrect: 0,
      lastStoryId: "",
      lastCompletedOn: ""
    };
    return stats.levels[levelKey];
  }

  function getStoryEntryStats(profile, storyId) {
    const stats = ensureStoryStats(profile);
    stats.stories[storyId] = stats.stories[storyId] || {
      completedCount: 0,
      correctAnswers: 0,
      firstTryCorrect: 0,
      lastCompletedOn: "",
      lastPoints: 0
    };
    return stats.stories[storyId];
  }

  function recordActivityDay(profile) {
    const today = todayKey();
    const previousDate = profile.lastPracticeDate || "";

    if (previousDate !== today) {
      profile.practicedDays = Number(profile.practicedDays || 0) + 1;

      const gap = previousDate ? daysBetween(previousDate, today) : null;
      if (gap === 1 || previousDate === "") {
        profile.streak = Number(profile.streak || 0) + 1;
      } else {
        profile.streak = 1;
      }

      profile.longestStreak = Math.max(Number(profile.longestStreak || 0), Number(profile.streak || 0));
      profile.lastPracticeDate = today;
    }

    profile.daily = profile.daily || {};
    profile.daily[today] = profile.daily[today] || {
      totalPoints: 0,
      rounds: 0,
      items: 0,
      groupPoints: createEmptyGroupMap(),
      groupRounds: createEmptyGroupMap(),
      groupBestSpeed: createEmptyGroupMap(),
      storyPoints: 0,
      storyCompletions: 0
    };

    profile.daily[today].storyPoints = Number(profile.daily[today].storyPoints || 0);
    profile.daily[today].storyCompletions = Number(profile.daily[today].storyCompletions || 0);

    return profile.daily[today];
  }

  function getTodayStats(profile) {
    const today = todayKey();
    const daily = profile && profile.daily ? profile.daily[today] : null;

    return {
      totalPoints: Number(daily && daily.totalPoints || 0),
      rounds: Number(daily && daily.rounds || 0),
      items: Number(daily && daily.items || 0),
      storyPoints: Number(daily && daily.storyPoints || 0),
      storyCompletions: Number(daily && daily.storyCompletions || 0)
    };
  }

  function shuffleArray(items) {
    const copy = Array.isArray(items) ? items.slice() : [];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const otherIndex = Math.floor(Math.random() * (index + 1));
      const temp = copy[index];
      copy[index] = copy[otherIndex];
      copy[otherIndex] = temp;
    }
    return copy;
  }

  function buildStoryAnswerOptions(story) {
    if (!story || !story.question) return [];
    const wrongAnswers = shuffleArray(Array.isArray(story.question.wrong) ? story.question.wrong : []).slice(0, 2);
    return shuffleArray([{ text: story.question.correct, correct: true }].concat(
      wrongAnswers.map(function (answer) {
        return { text: answer, correct: false };
      })
    ));
  }

  function formatStoryText(lines) {
    const colorState = createSegmentColorState();
    return (Array.isArray(lines) ? lines : []).map(function (line) {
      return formatForDisplay(line, colorState);
    }).join("<br>");
  }

  function renderStoryHeader(level) {
    const levelPrefix = ui.stories && ui.stories.levelPrefix || "Level";
    const levelLabel = level
      ? (levelPrefix ? levelPrefix + " " : "") + escapeHtml(level.label || String(level.id))
      : "";

    setOptionalText("storiesEyebrow", ui.stories && ui.stories.titleFallback || "Story", "");
    setText("storiesHeading", levelLabel || levelPrefix || "Story");
    setOptionalText("storyLevelName", "", "");
  }

  function getItem() {
    const currentLevel = getCurrentLevel();
    const items = getItemsForLevel(currentLevel);

    if (items.length > 0) return randomElement(items);
    if (Number(STATE.levelId) === 0) return randomInt(10).toString();
    if (Number(STATE.levelId) === 20) return randomInt(20).toString();
    if (Number(STATE.levelId) === 100) return randomInt(100).toString();

    return "";
  }

  function formatForDisplay(item, colorState) {
    let text = String(item || "");
    const dashBox = byId("dash");
    const capitalBox = byId("capital");
    const syllableColorsBox = byId("syllableColors");
    const showDash = !!(dashBox && dashBox.checked);
    const useCaps = !!(capitalBox && capitalBox.checked);
    const useColors = !!(syllableColorsBox && syllableColorsBox.checked);

    if (useCaps) {
      text = text.toLocaleUpperCase(content.language || undefined);
    }

    if (!useColors) {
      if (!showDash) {
        text = text.replace(/-/g, "");
      } else {
        text = text.replace(/ /g, "\u00A0\u00A0");
      }
      return escapeHtml(text);
    }

    return buildSyllableMarkup(text, showDash, colorState || createSegmentColorState());
  }

  function createSegmentColorState() {
    return {
      colors: ["#1f8f37", "#3d73d9", "#8a3ffc", "#d96c1f"],
      index: 0,
      bySegment: {}
    };
  }

  function segmentColor(segment, state) {
    const key = String(segment || "").toLocaleLowerCase(content.language || undefined);
    if (!key) return "";
    if (!state.bySegment[key]) {
      state.bySegment[key] = state.colors[state.index % state.colors.length];
      state.index += 1;
    }
    return state.bySegment[key];
  }

  function splitSegmentAffixes(text) {
    const value = String(text || "");
    const match = value.match(/^([^A-Za-z0-9ÄÖÜäöüß]*)(.*?)([^A-Za-z0-9ÄÖÜäöüß]*)$/);
    if (!match) return { leading: "", core: value, trailing: "" };
    return {
      leading: match[1] || "",
      core: match[2] || "",
      trailing: match[3] || ""
    };
  }

  function colorSegment(segment, state) {
    const parts = splitSegmentAffixes(segment);
    if (!parts.core) return escapeHtml(segment);

    return escapeHtml(parts.leading)
      + '<span class="beri-syllable" style="color:' + segmentColor(parts.core, state) + ';">'
      + escapeHtml(parts.core)
      + "</span>"
      + escapeHtml(parts.trailing);
  }

  function buildWordMarkup(word, showDash, state) {
    const text = String(word || "");
    const pieces = text.indexOf("-") === -1 ? [text] : text.split("-").filter(function (piece) {
      return piece !== "";
    });
    const separator = showDash ? '<span class="beri-syllable-separator">-</span>' : "";
    const markup = [];

    pieces.forEach(function (piece) {
      const parts = splitSegmentAffixes(piece);
      if (!parts.core && markup.length > 0) {
        markup[markup.length - 1] += escapeHtml(piece);
        return;
      }
      markup.push(colorSegment(piece, state));
    });

    return '<span class="beri-word">' + markup.join(separator) + "</span>";
  }

  function buildSyllableMarkup(text, showDash, state) {
    return text.split(" ").map(function (word) {
      return buildWordMarkup(word, showDash, state);
    }).join(showDash ? "\u00A0\u00A0" : " ");
  }

  function plainReadingText(item) {
    return String(item || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/[→]/g, " ")
      .replace(/[-]/g, "")
      .replace(/[^A-Za-z0-9ÄÖÜäöüßÀ-ž:,\/\s]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function splitPatternExamples(item) {
    const text = String(item || "");
    const colonIndex = text.indexOf(":");
    if (colonIndex === -1) return [];
    return text.slice(colonIndex + 1).split(",").map(function (entry) {
      return plainReadingText(entry);
    }).filter(Boolean);
  }

  function countReadableCharacters(item) {
    const text = plainReadingText(item).replace(/[:,\/\s]/g, "");
    return Array.from(text).length;
  }

  function countReadableWords(item) {
    const examples = splitPatternExamples(item);
    if (examples.length > 0) return examples.length;

    const words = plainReadingText(item)
      .replace(/:/g, " ")
      .split(/\s+/)
      .filter(Boolean);

    return words.length;
  }

  function scoringUnitForLevel(level) {
    if (level && level.scoringUnit) return level.scoringUnit;

    const groupId = String(level && level.groupId || "");
    if (groupId === "foundations" || groupId === "grundlagen" || groupId === "silben") {
      return "character";
    }

    const levelId = Number(level && level.id || 0);
    if (levelId > 0 && levelId <= 10) return "character";

    return "word";
  }

  function countPoints(item, level) {
    const scoringUnit = scoringUnitForLevel(level || getCurrentLevel());
    if (scoringUnit === "character") return Math.max(1, countReadableCharacters(item));
    return Math.max(1, countReadableWords(item));
  }

  function feedbackList(name) {
    const list = ui.feedback && ui.feedback[name];
    if (Array.isArray(list) && list.length > 0) return list;
    return DEFAULT_UI.feedback[name] || [""];
  }

  function imageList(name) {
    const custom = ui.images && ui.images[name];
    if (Array.isArray(custom) && custom.length > 0) return custom;
    return DEFAULT_IMAGES[name] || ["bookfly"];
  }

  function getFeedbackForCounter(itemCount, pointCount) {
    const timing = getTiming();
    const earnedPoints = Number(pointCount || itemCount || 0);

    if (earnedPoints > timing.tooFastThreshold) {
      return {
        kind: "tooFast",
        message: randomElement(feedbackList("tooFast")),
        image: randomElement(imageList("tooFast")),
        color: "#8f4f45"
      };
    }

    if (earnedPoints >= timing.masteryThreshold) {
      return {
        kind: "mastery",
        message: randomElement(feedbackList("mastery")),
        image: randomElement(imageList("mastery")),
        color: "#1f6f44"
      };
    }

    if (earnedPoints >= timing.encouragementThreshold) {
      return {
        kind: "progress",
        message: randomElement(feedbackList("progress")),
        image: randomElement(imageList("progress")),
        color: "#1e63c6"
      };
    }

    return {
      kind: "encouraging",
      message: randomElement(feedbackList("encouraging")),
      image: randomElement(imageList("encouraging")),
      color: "#5f6f89"
    };
  }

  function syncStats() {
    setText("counter", formatNumber(STATE.counter));
    const today = STATE.profile ? getTodayStats(STATE.profile) : { totalPoints: 0 };
    setText("practiceTodayPoints", formatNumber(today.totalPoints || 0));
    setText("score", formatNumber(STATE.score));
  }

  function updateLevelDisplay() {
    const currentLevel = getCurrentLevel();
    if (!currentLevel) return;

    setOptionalText("practiceStudentLabel", ui.navigation && ui.navigation.practice || "Practice", "");
    setText("contentTitle", currentLevel.label || "");
    setOptionalText("levelName", "", "");
    const wordEl = byId("word");
    if (wordEl && currentLevel.color) {
      wordEl.style.boxShadow = "inset 0 0 0 2px " + currentLevel.color + "33";
    }
  }

  function setCookie(name, value) {
    const expires = new Date();
    expires.setDate(expires.getDate() + COOKIE_DAYS);
    global.document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + expires.toUTCString() + "; path=/; SameSite=Lax";
  }

  function getCookie(name) {
    const prefix = name + "=";
    const cookies = global.document.cookie ? global.document.cookie.split(";") : [];

    for (let index = 0; index < cookies.length; index += 1) {
      const rawCookie = cookies[index].trim();
      if (rawCookie.indexOf(prefix) === 0) {
        return decodeURIComponent(rawCookie.substring(prefix.length));
      }
    }

    return "";
  }

  function storageAvailable() {
    try {
      return !!global.localStorage;
    } catch (error) {
      return false;
    }
  }

  function setStoredValue(key, value) {
    if (!storageAvailable()) return;
    try {
      global.localStorage.setItem(key, value);
    } catch (error) {
      // Ignore storage write failures and keep cookie fallback.
    }
  }

  function getStoredValue(key) {
    if (!storageAvailable()) return "";
    try {
      return global.localStorage.getItem(key) || "";
    } catch (error) {
      return "";
    }
  }

  function cookieKeyForStudent(studentName) {
    return PROFILE_PREFIX + encodeURIComponent(studentName).replace(/%/g, "_");
  }

  function normaliseStudentName(name) {
    const cleaned = String(name || "").replace(/\s+/g, " ").trim();
    return cleaned || (ui.students && ui.students.defaultName) || "Guest";
  }

  function createEmptyGroupMap() {
    const groupMap = {};
    (content.groups || []).forEach(function (group) {
      groupMap[group.id] = 0;
    });
    return groupMap;
  }

  function emptyProfile(studentName) {
    return {
      name: normaliseStudentName(studentName),
      totalScore: 0,
      practicedDays: 0,
      streak: 0,
      longestStreak: 0,
      lastPracticeDate: "",
      lastLevelId: null,
      levelStats: {},
      daily: {},
      settings: {
        dash: false,
        syllableColors: true,
        capital: false,
        gentleMode: false
      }
    };
  }

  function cleanupDailyHistory(profile) {
    const dailyKeys = Object.keys(profile.daily || {}).sort();
    while (dailyKeys.length > 10) {
      const oldest = dailyKeys.shift();
      delete profile.daily[oldest];
    }
  }

  function listStudents() {
    const raw = getStoredValue(STUDENT_INDEX_STORAGE) || getCookie(STUDENT_INDEX_COOKIE);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.map(normaliseStudentName).filter(Boolean);
    } catch (error) {
      return [];
    }
  }

  function saveStudentIndex(names) {
    const unique = [];
    names.forEach(function (name) {
      const normalised = normaliseStudentName(name);
      if (unique.indexOf(normalised) === -1) unique.push(normalised);
    });
    const serialized = JSON.stringify(unique);
    setStoredValue(STUDENT_INDEX_STORAGE, serialized);
    setCookie(STUDENT_INDEX_COOKIE, serialized);
  }

  function loadProfile(studentName) {
    const normalised = normaliseStudentName(studentName);
    const storageKey = cookieKeyForStudent(normalised);
    const raw = getStoredValue(storageKey) || getCookie(storageKey);
    if (!raw) return emptyProfile(normalised);

    try {
      const parsed = JSON.parse(raw);
      const profile = mergeDeep(emptyProfile(normalised), parsed);
      profile.name = normalised;
      return profile;
    } catch (error) {
      return emptyProfile(normalised);
    }
  }

  function saveProfile(profile) {
    cleanupDailyHistory(profile);
    const storageKey = cookieKeyForStudent(profile.name);
    const serialized = JSON.stringify(profile);
    setStoredValue(storageKey, serialized);
    setCookie(storageKey, serialized);

    const students = listStudents();
    if (students.indexOf(profile.name) === -1) {
      students.push(profile.name);
      saveStudentIndex(students);
    }
  }

  function applyProfileSettings(profile) {
    const dashBox = byId("dash");
    const capitalBox = byId("capital");
    const gentleModeBox = byId("gentleMode");

    if (dashBox) dashBox.checked = !!(profile.settings && profile.settings.dash);
    const syllableColorsBox = byId("syllableColors");
    if (syllableColorsBox) {
      syllableColorsBox.checked = !profile.settings || profile.settings.syllableColors !== false;
    }
    if (capitalBox) capitalBox.checked = !!(profile.settings && profile.settings.capital);
    if (gentleModeBox) gentleModeBox.checked = !!(profile.settings && profile.settings.gentleMode);
    if (global.document && global.document.body) {
      global.document.body.classList.toggle("beri-gentle-mode", !!(profile.settings && profile.settings.gentleMode));
    }
  }

  function updateProfileSettingsFromUi() {
    if (!STATE.profile) return;
    const dashBox = byId("dash");
    const syllableColorsBox = byId("syllableColors");
    const capitalBox = byId("capital");
    const gentleModeBox = byId("gentleMode");

    STATE.profile.settings = STATE.profile.settings || {};
    STATE.profile.settings.dash = !!(dashBox && dashBox.checked);
    STATE.profile.settings.syllableColors = !!(syllableColorsBox && syllableColorsBox.checked);
    STATE.profile.settings.capital = !!(capitalBox && capitalBox.checked);
    STATE.profile.settings.gentleMode = !!(gentleModeBox && gentleModeBox.checked);
    saveProfile(STATE.profile);
    if (global.document && global.document.body) {
      global.document.body.classList.toggle("beri-gentle-mode", !!STATE.profile.settings.gentleMode);
    }

    if (STATE.oldItem) {
      setWordText(formatForDisplay(STATE.oldItem), "black");
    }
    if (STATE.storyCurrent) {
      renderStory();
    }
  }

  function renderStudentSuggestions() {
    const datalist = byId("studentNameList");
    if (!datalist) return;

    datalist.innerHTML = "";
    listStudents().forEach(function (studentName) {
      const option = global.document.createElement("option");
      option.value = studentName;
      datalist.appendChild(option);
    });
  }

  function renderLanguageOptions() {
    const select = byId("languageSelect");
    if (!select) return;

    select.innerHTML = "";
    const locales = supportedLocales.length > 0 ? supportedLocales : [currentLocale];

    locales.forEach(function (locale) {
      const option = global.document.createElement("option");
      option.value = locale.code;
      option.textContent = locale.label;
      option.selected = locale.code === currentLocale.code;
      select.appendChild(option);
    });
  }

  function changeLanguage(languageCode) {
    const targetCode = String(languageCode || "").toLowerCase();
    if (!targetCode) return;

    try {
      global.localStorage.setItem(LANGUAGE_STORAGE, targetCode);
    } catch (error) {}

    const params = new URLSearchParams(global.location.search || "");
    params.set("lang", targetCode);
    global.location.search = params.toString();
  }

  function getGroupList() {
    return (content.groups || []).map(function (group, index) {
      return {
        id: group.id,
        label: group.label,
        color: firstGroupColor(group, index),
        levels: group.levels || []
      };
    });
  }

  function firstGroupColor(group, index) {
    const firstLevel = Array.isArray(group.levels) && group.levels.length > 0 ? group.levels[0] : null;
    if (firstLevel && firstLevel.color) return firstLevel.color;
    const palette = ["#31b85a", "#9add2d", "#ffd44a", "#ff9340", "#ec5cc4", "#9b59f6", "#4c8cf7"];
    return palette[index % palette.length];
  }

  function getGroupForLevel(levelId) {
    const level = levelIndex.get(Number(levelId));
    if (!level) return null;

    return (content.groups || []).find(function (group) {
      return group.id === level.groupId;
    }) || null;
  }

  function aggregateGroupStats(profile, group) {
    const aggregated = {
      totalPoints: 0,
      rounds: 0,
      bestRoundPoints: 0,
      bestCounter: 0,
      levelCount: 0
    };

    (group.levels || []).forEach(function (level) {
      const stats = profile.levelStats && profile.levelStats[level.id];
      if (!stats) return;

      aggregated.levelCount += 1;
      aggregated.totalPoints += Number(stats.totalPoints || 0);
      aggregated.rounds += Number(stats.rounds || 0);
      aggregated.bestRoundPoints += Number(stats.bestRoundPoints || 0);
      aggregated.bestCounter = Math.max(aggregated.bestCounter, Number(stats.bestCounter || 0));
    });

    return aggregated;
  }

  function targetPointsForGroup(group) {
    const levels = group.levels || [];
    if (levels.length === 0) return 1;

    const total = levels.reduce(function (sum, level) {
      return sum + targetPointsForLevel(level);
    }, 0);

    return Math.max(LEVEL_COMPLETION_POINTS, total);
  }

  function averagePointsForLevel(level) {
    const items = getItemsForLevel(level);
    if (items.length === 0) return 1;

    const total = items.reduce(function (sum, item) {
      return sum + countPoints(item, level);
    }, 0);

    return Math.max(1, total / items.length);
  }

  function targetPointsForLevel(level) {
    return LEVEL_COMPLETION_POINTS;
  }

  function levelProgressPercent(levelId, stats) {
    const level = levelIndex.get(Number(levelId));
    if (!level || !stats) return 0;
    const targetPoints = targetPointsForLevel(level);
    return Math.min(100, Math.round((Number(stats.bestRoundPoints || 0) / targetPoints) * 100));
  }

  function starsForPercent(percent) {
    if (percent >= 80) return 3;
    if (percent >= 45) return 2;
    if (percent > 0) return 1;
    return 0;
  }

  function isLevelCompleted(levelId, profile) {
    const currentProfile = profile || STATE.profile;
    if (!currentProfile || !currentProfile.levelStats) return false;

    const stats = currentProfile.levelStats[levelId];
    if (!stats) return false;

    return levelProgressPercent(levelId, stats) >= 80;
  }

  function renderLevelProgress(profile) {
    const container = byId("levelProgressGrid");
    if (!container) return;

    container.innerHTML = "";

    getGroupList().forEach(function (group, index) {
      const stats = aggregateGroupStats(profile, group);
      const percent = Math.min(100, Math.round((Number(stats.bestRoundPoints || 0) / targetPointsForGroup(group)) * 100));
      const stars = starsForPercent(percent);

      const card = global.document.createElement("article");
      card.className = "level-progress-card";
      card.style.background = "linear-gradient(180deg, " + hexToRgba(group.color || "#6faeff", 0.55) + ", " + hexToRgba(group.color || "#6faeff", 0.78) + ")";

      const starMarkup = [1, 2, 3].map(function (index) {
        return '<span class="' + (index <= stars ? "" : "level-stars-muted") + '">&#9733;</span>';
      }).join("");

      card.innerHTML = [
        '<div class="level-number">', index + 1, "</div>",
        '<div class="level-label">', escapeHtml(group.label || group.id || String(index + 1)), "</div>",
        '<div class="level-stars">', starMarkup, "</div>",
        '<div class="level-meter"><div class="level-meter-fill" style="height:', percent, '%; background:', group.color || "#6faeff", ';"></div></div>',
        '<div class="level-percent">', percent, '<small>%</small></div>'
      ].join("");

      container.appendChild(card);
    });
  }

  function renderDailyHistory(profile) {
    const chart = byId("dailyHistoryChart");
    const legend = byId("dailyHistoryLegend");
    if (!chart || !legend) return;

    chart.innerHTML = "";
    legend.innerHTML = "";

    const days = Object.keys(profile.daily || {}).sort();
    if (days.length === 0) {
      chart.innerHTML = '<p class="section-subtitle">' + escapeHtml(ui.progress && ui.progress.noData || "No saved practice yet.") + "</p>";
      return;
    }

    const recentDays = days.slice(-8);
    let maxTotal = 0;
    const groups = getGroupList();

    recentDays.forEach(function (dayKey) {
      const totalPoints = Number(profile.daily[dayKey].totalPoints || 0);
      if (totalPoints > maxTotal) maxTotal = totalPoints;
    });

    const scaledMax = Math.max(100, maxTotal);

    recentDays.forEach(function (dayKey) {
      const dailyStats = profile.daily[dayKey];
      const column = global.document.createElement("div");
      column.className = "history-column";

      const stack = global.document.createElement("div");
      stack.className = "history-stack";

      groups.forEach(function (group) {
        const points = dailyGroupPoints(dailyStats, group);
        if (!points) return;

        const segment = global.document.createElement("div");
        segment.className = "history-segment";
        segment.style.height = (points / scaledMax * 100) + "%";
        segment.style.background = group.color;
        stack.appendChild(segment);
      });

      column.appendChild(stack);

      const label = global.document.createElement("div");
      label.className = "history-label";
      label.innerHTML = escapeHtml(formatDateLabel(dayKey));
      column.appendChild(label);

      chart.appendChild(column);
    });

    groups.forEach(function (group) {
      const item = global.document.createElement("div");
      item.className = "history-legend-item";
      item.innerHTML = '<span class="history-legend-dot" style="background:' + group.color + ';"></span><span>' + escapeHtml(group.label) + "</span>";
      legend.appendChild(item);
    });
  }

  function dailyGroupPoints(dailyStats, group) {
    return Number(
      (dailyStats && dailyStats.groupPoints && dailyStats.groupPoints[group.id]) ||
      0
    );
  }

  function dailyGroupRounds(dailyStats, group) {
    return Number(
      (dailyStats && dailyStats.groupRounds && dailyStats.groupRounds[group.id]) ||
      0
    );
  }

  function dailyGroupSpeed(dailyStats, group) {
    const bestSpeed = Number(dailyStats && dailyStats.groupBestSpeed && dailyStats.groupBestSpeed[group.id] || 0);
    if (bestSpeed > 0) return bestSpeed;

    const rounds = dailyGroupRounds(dailyStats, group);
    if (rounds > 0) return dailyGroupPoints(dailyStats, group) / rounds;

    return null;
  }

  function reportStatusForSpeed(speed) {
    const value = Number(speed || 0);
    if (value >= LEVEL_COMPLETION_POINTS) {
      return {
        className: "report-status-fluent",
        label: ui.settings && ui.settings.reportFluent || "Fluent"
      };
    }
    if (value >= 8) {
      return {
        className: "report-status-building",
        label: ui.settings && ui.settings.reportBuilding || "Building"
      };
    }
    return {
      className: "report-status-needs-work",
      label: ui.settings && ui.settings.reportNeedsWork || "Needs work"
    };
  }

  function formatSpeed(speed) {
    const value = Number(speed || 0);
    return value % 1 === 0 ? formatNumber(value) : value.toLocaleString(content.language || ui.meta.language || undefined, {
      maximumFractionDigits: 1
    });
  }

  function renderProgressReport(profile) {
    const container = byId("progressReportTable");
    if (!container) return;

    container.innerHTML = "";

    const days = Object.keys(profile && profile.daily || {}).sort();
    const groups = getGroupList();

    if (days.length === 0) {
      container.innerHTML = '<p class="section-subtitle">' + escapeHtml(ui.progress && ui.progress.noData || "No saved practice yet.") + "</p>";
      return;
    }

    const table = global.document.createElement("table");
    table.className = "progress-report";

    const head = global.document.createElement("thead");
    const headRow = global.document.createElement("tr");
    const dateHeading = global.document.createElement("th");
    dateHeading.innerHTML = escapeHtml(ui.settings && ui.settings.reportDateHeading || "Date");
    headRow.appendChild(dateHeading);

    groups.forEach(function (group) {
      const heading = global.document.createElement("th");
      heading.innerHTML = '<span class="report-category-dot" style="background:' + group.color + ';"></span>' + escapeHtml(group.label || group.id || "");
      headRow.appendChild(heading);
    });

    const totalHeading = global.document.createElement("th");
    totalHeading.innerHTML = escapeHtml(ui.settings && ui.settings.reportTotalHeading || "Total");
    headRow.appendChild(totalHeading);
    head.appendChild(headRow);
    table.appendChild(head);

    const body = global.document.createElement("tbody");
    days.slice().reverse().forEach(function (dayKey) {
      const dailyStats = profile.daily[dayKey] || {};
      const row = global.document.createElement("tr");
      const dateCell = global.document.createElement("th");
      dateCell.scope = "row";
      dateCell.innerHTML = escapeHtml(formatDateLabel(dayKey));
      row.appendChild(dateCell);

      groups.forEach(function (group) {
        const speed = dailyGroupSpeed(dailyStats, group);
        const cell = global.document.createElement("td");
        if (speed === null) {
          cell.className = "report-status-empty";
          cell.innerHTML = "";
        } else {
          const status = reportStatusForSpeed(speed);
          cell.className = status.className;
          cell.innerHTML = '<span class="report-speed">' + formatSpeed(speed) + '</span><span class="report-status-label">' + escapeHtml(status.label) + "</span>";
        }
        row.appendChild(cell);
      });

      const totalCell = global.document.createElement("td");
      totalCell.className = "progress-report-total";
      const overallSpeed = dailyStats.rounds ? Number(dailyStats.totalPoints || 0) / Number(dailyStats.rounds || 1) : null;
      totalCell.innerHTML = overallSpeed === null ? "" : formatSpeed(overallSpeed);
      row.appendChild(totalCell);
      body.appendChild(row);
    });

    table.appendChild(body);
    container.appendChild(table);
  }

  function csvCell(value) {
    const text = String(value === undefined || value === null ? "" : value);
    return '"' + text.replace(/"/g, '""') + '"';
  }

  function progressReportRows(profile) {
    const groups = getGroupList();
    const days = Object.keys(profile && profile.daily || {}).sort();
    const rows = [];
    const header = [ui.settings && ui.settings.reportDateHeading || "Date"];

    groups.forEach(function (group) {
      header.push((group.label || group.id || "") + " speed");
      header.push((group.label || group.id || "") + " status");
    });
    header.push(ui.settings && ui.settings.reportTotalHeading || "Overall");
    rows.push(header);

    days.forEach(function (dayKey) {
      const dailyStats = profile.daily[dayKey] || {};
      const row = [dayKey];

      groups.forEach(function (group) {
        const speed = dailyGroupSpeed(dailyStats, group);
        if (speed === null) {
          row.push("");
          row.push(ui.settings && ui.settings.reportNoSpeed || "Not enough speed data yet");
          return;
        }
        const status = reportStatusForSpeed(speed);
        row.push(formatSpeed(speed));
        row.push(status.label);
      });

      const overallSpeed = dailyStats.rounds ? Number(dailyStats.totalPoints || 0) / Number(dailyStats.rounds || 1) : null;
      row.push(overallSpeed === null ? "" : formatSpeed(overallSpeed));
      rows.push(row);
    });

    return rows;
  }

  function downloadProgressReport() {
    if (!STATE.profile) return;

    const rows = progressReportRows(STATE.profile);
    const csv = rows.map(function (row) {
      return row.map(csvCell).join(",");
    }).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const link = global.document.createElement("a");
    const safeName = String(STATE.profile.name || "reader").replace(/[^A-Za-z0-9_-]+/g, "-").replace(/^-|-$/g, "") || "reader";
    link.href = URL.createObjectURL(blob);
    link.download = "beri-progress-" + safeName + "-" + todayKey() + ".csv";
    global.document.body.appendChild(link);
    link.click();
    global.document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  function renderTodayCard(profile) {
    const today = profile.daily[todayKey()] || {
      totalPoints: 0,
      rounds: 0,
      items: 0,
      groupPoints: createEmptyGroupMap(),
      groupRounds: createEmptyGroupMap(),
      groupBestSpeed: createEmptyGroupMap()
    };
    const currentLevel = profile.lastLevelId && levelIndex.get(Number(profile.lastLevelId));
    const goalPercent = Math.min(100, Math.round((Number(today.totalPoints || 0) / DAILY_GOAL_POINTS) * 100));
    const averageSpeed = today.rounds ? Math.round(Number(today.totalPoints || 0) / Number(today.rounds || 1)) : 0;

    setText("todayDate", new Date().toLocaleDateString(content.language || ui.meta.language || undefined, {
      day: "numeric",
      month: "long",
      year: "numeric"
    }));
    setText("todayPoints", formatNumber(today.totalPoints || 0));
    setText("todayLevel", currentLevel ? currentLevel.label : (ui.progress && ui.progress.levelFallback || "-"));
    setText("todaySpeed", averageSpeed + " " + escapeHtml(ui.progress && ui.progress.speedUnit || "items / round"));
    setText("todayGoalValue", formatNumber(today.totalPoints || 0) + " / " + formatNumber(DAILY_GOAL_POINTS));
    setWidth("todayGoalFill", goalPercent);
  }

  function renderSummary(profile) {
    setText("summaryTotalScore", formatNumber(profile.totalScore || 0));
    setText("summaryDays", formatNumber(profile.practicedDays || 0));
    setText("summaryStreak", formatNumber(profile.streak || 0) + " " + escapeHtml(ui.progress && ui.progress.daysSuffix || "days"));
    renderLevelProgress(profile);
    renderDailyHistory(profile);
    renderProgressReport(profile);
    renderTodayCard(profile);
    renderLevelButtons("levelButtons");
  }

  function recordRound(profile, levelId, points, items) {
    const today = todayKey();
    const dailyEntry = recordActivityDay(profile);
    profile.totalScore = Number(STATE.score || 0);
    profile.lastLevelId = Number(levelId);

    dailyEntry.totalPoints += Number(points || 0);
    dailyEntry.rounds += 1;
    dailyEntry.items += Number(items || 0);
    dailyEntry.groupPoints = dailyEntry.groupPoints || createEmptyGroupMap();
    dailyEntry.groupRounds = dailyEntry.groupRounds || createEmptyGroupMap();
    dailyEntry.groupBestSpeed = dailyEntry.groupBestSpeed || createEmptyGroupMap();

    const group = getGroupForLevel(levelId);
    if (group) {
      dailyEntry.groupPoints[group.id] = Number(dailyEntry.groupPoints[group.id] || 0) + Number(points || 0);
      dailyEntry.groupRounds[group.id] = Number(dailyEntry.groupRounds[group.id] || 0) + 1;
      dailyEntry.groupBestSpeed[group.id] = Math.max(
        Number(dailyEntry.groupBestSpeed[group.id] || 0),
        Number(points || 0)
      );
    }

    profile.levelStats = profile.levelStats || {};
    profile.levelStats[levelId] = profile.levelStats[levelId] || {
      totalPoints: 0,
      rounds: 0,
      bestRoundPoints: 0,
      bestCounter: 0,
      lastPractisedOn: ""
    };

    profile.levelStats[levelId].totalPoints += Number(points || 0);
    profile.levelStats[levelId].rounds += 1;
    profile.levelStats[levelId].bestRoundPoints = Math.max(Number(profile.levelStats[levelId].bestRoundPoints || 0), Number(points || 0));
    profile.levelStats[levelId].bestCounter = Math.max(Number(profile.levelStats[levelId].bestCounter || 0), Number(items || 0));
    profile.levelStats[levelId].lastPractisedOn = today;

    cleanupDailyHistory(profile);
    saveProfile(profile);
  }

  function selectStudent(studentName) {
    const profile = loadProfile(studentName);
    STATE.profile = profile;
    STATE.studentName = profile.name;
    STATE.score = Number(profile.totalScore || 0);
    STATE.counter = 0;
    STATE.levelScore = 0;
    STATE.oldItem = "";

    setValue("studentNameInput", profile.name);
    setOptionalText("practiceStudentLabel", "", "");
    setText("progressTitle", (ui.students && ui.students.title || "Your progress") + ": " + escapeHtml(profile.name));
    setText("activeStudentName", escapeHtml(profile.name));

    setStoredValue(ACTIVE_STUDENT_STORAGE, profile.name);
    setCookie(ACTIVE_STUDENT_COOKIE, profile.name);
    saveProfile(profile);
    applyProfileSettings(profile);
    renderStudentSuggestions();
    ensureStoryStats(profile);

    if (!STATE.storyLevelKey) {
      const initialStoryLevel = firstStoryLevel();
      if (initialStoryLevel) {
        STATE.storyLevelKey = storyLevelKey(initialStoryLevel.groupId, initialStoryLevel.id);
        STATE.storyLevelId = Number(initialStoryLevel.id);
      }
    }

    syncStats();
    renderSummary(profile);
    updateLevelDisplay();
    renderStoryLevelButtons();
    if (!STATE.storyCurrent) {
      nextStory();
    } else {
      renderStory();
    }
  }

  function ensureStudent() {
    const activeName = getStoredValue(ACTIVE_STUDENT_STORAGE) || getCookie(ACTIVE_STUDENT_COOKIE);
    const indexedStudents = listStudents();
    const firstStudent = indexedStudents.length > 0 ? indexedStudents[0] : "";
    selectStudent(activeName || firstStudent || (ui.students && ui.students.defaultName) || "Guest");
  }

  function finishReading() {
    const feedback = getFeedbackForCounter(STATE.counter, STATE.levelScore);
    const completedItems = STATE.counter;
    const completedPoints = STATE.levelScore;
    const completedLevelId = STATE.levelId;

    if (feedback.kind === "tooFast") {
      STATE.score -= STATE.levelScore;
      if (STATE.score < 0) STATE.score = 0;
    } else if (STATE.profile && completedItems > 0 && completedPoints > 0) {
      recordRound(STATE.profile, completedLevelId, completedPoints, completedItems);
      renderSummary(STATE.profile);
    }

    if (STATE.profile && feedback.kind === "tooFast") {
      STATE.profile.totalScore = Number(STATE.score || 0);
      saveProfile(STATE.profile);
      renderSummary(STATE.profile);
    }

    setImage(feedback.image);
    setPracticeFeedbackState(feedback.kind);
    setWordText(feedback.message, feedback.color);
    setButtonText(ui.practice.start || DEFAULT_UI.practice.start);

    STATE.oldItem = "";
    STATE.levelScore = 0;
    syncStats();
  }

  function nextWord() {
    const timing = getTiming();
    const timeNow = new Date().getTime();

    if (timeNow > STATE.initialTime + timing.intervalSeconds * 1000) {
      finishReading();
      return;
    }

    let item = getItem();
    let guard = 0;

    while (item === STATE.oldItem && guard < 20) {
      item = getItem();
      guard += 1;
    }

    STATE.oldItem = item;
    setPracticeFeedbackState("");
    setWordText(formatForDisplay(item), "black");

    STATE.counter += 1;

    const points = countPoints(item, getCurrentLevel());
    STATE.levelScore += points;
    STATE.score += points;

    syncStats();
  }

  function startReading() {
    setImage((ui.images && ui.images.start) || DEFAULT_IMAGES.start);
    setButtonText(ui.practice.next || DEFAULT_UI.practice.next);
    setPracticeFeedbackState("");
    setWordText(ui.practice.ready || DEFAULT_UI.practice.ready, "black");

    STATE.initialTime = new Date().getTime();
    STATE.counter = 0;
    STATE.levelScore = 0;

    syncStats();
  }

  function read() {
    if (STATE.oldItem === "") {
      startReading();
    }
    nextWord();
  }

  function setLevel(newLevel) {
    const numericLevel = Number(newLevel);

    if (levelIndex.has(numericLevel) || [0, 20, 100].indexOf(numericLevel) !== -1) {
      STATE.levelId = numericLevel;
    }

    STATE.oldItem = "";
    STATE.counter = 0;
    STATE.levelScore = 0;
    updateLevelDisplay();
    syncStats();

    if (global.location) global.location.hash = "#practice";
    if (global.jQuery) {
      global.jQuery('.masthead-nav a[href="#practice"]').tab("show");
    }
  }

  function setNextLevel() {
    const levels = getOrderedLevels();
    if (levels.length === 0) return;

    const currentIndex = levels.findIndex(function (level) {
      return Number(level.id) === Number(STATE.levelId);
    });
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % levels.length;
    setLevel(levels[nextIndex].id);
  }

  function renderLevelButtons(containerId) {
    const container = byId(containerId || "levelButtons");
    if (!container) return;

    container.innerHTML = "";

    (content.groups || []).forEach(function (group, groupIndex) {
      const groupEl = global.document.createElement("div");
      groupEl.className = "beri-level-group";

      const heading = global.document.createElement("h3");
      heading.className = "beri-level-group-title";
      heading.innerHTML = escapeHtml(group.label || group.id || "");
      heading.style.color = firstGroupColor(group, groupIndex);
      groupEl.appendChild(heading);

      const groupLevels = group.levels || [];
      const baseColor = firstGroupColor(group, groupIndex);

      groupLevels.forEach(function (level, levelIndex) {
        const button = global.document.createElement("button");
        button.type = "button";
        button.className = "btn btn-primary beri-level-button";
        button.innerHTML = escapeHtml(level.label || String(level.id));
        button.dataset.levelId = level.id;
        const buttonColor = getLevelGradientColor(baseColor, levelIndex, groupLevels.length);
        const buttonColorLight = mixHexColors(buttonColor, "#ffffff", 0.42);
        const textColor = getContrastTextColor(buttonColor);

        button.style.background = "linear-gradient(135deg, " + buttonColorLight + ", " + buttonColor + ")";
        button.style.borderColor = mixHexColors(buttonColor, "#000000", 0.12);
        button.style.color = textColor;
        button.style.boxShadow = "0 10px 20px " + hexToRgba(buttonColor, 0.18);

        if (isLevelCompleted(level.id)) {
          button.className += " beri-level-button-completed";
          button.setAttribute("aria-label", (level.label || String(level.id)) + " completed");
        }

        button.onclick = function () {
          setLevel(level.id);
        };

        groupEl.appendChild(button);
      });

      container.appendChild(groupEl);
    });
  }

  function completedStoriesForLevel(profile, level) {
    if (!profile || !level) return 0;
    return storiesForLevel(level).filter(function (story) {
      const stats = ensureStoryStats(profile).stories[story.id];
      return stats && Number(stats.correctAnswers || 0) > 0;
    }).length;
  }

  function isStoryLevelCompleted(level, profile) {
    if (!level) return false;
    const totalStories = storiesForLevel(level).length;
    if (totalStories === 0) return false;
    return completedStoriesForLevel(profile || STATE.profile, level) >= totalStories;
  }

  function renderStoryLevelButtons() {
    const container = byId("storiesSubnav");
    if (!container) return;

    container.innerHTML = "";

    getStoryGroupList().forEach(function (group) {
      group.levels.forEach(function (level) {
        const key = storyLevelKey(group.id, level.id);
        const item = global.document.createElement("li");
        const button = global.document.createElement("button");

        button.type = "button";
        button.className = "beri-subnav-button";
        button.innerHTML = escapeHtml(level.label || String(level.id));

        if (STATE.storyLevelKey === key) {
          button.className += " active";
        }

        if (isStoryLevelCompleted(level, STATE.profile)) {
          button.className += " completed";
        }

        button.onclick = function () {
          setStoryLevel(group.id, level.id);
        };

        item.appendChild(button);
        container.appendChild(item);
      });
    });
  }

  function pickStoryForLevel(level) {
    const options = storiesForLevel(level);
    if (options.length === 0) return null;

    const recentByLevel = STATE.profile ? ensureStoryStats(STATE.profile).recentByLevel : {};
    const recentIds = recentByLevel[STATE.storyLevelKey] || [];
    const filtered = options.filter(function (story) {
      return recentIds.indexOf(story.id) === -1;
    });
    const pool = filtered.length > 0 ? filtered : options;
    return pool[Math.floor(Math.random() * pool.length)] || null;
  }

  function rememberStorySelection(profile, levelKey, storyId) {
    if (!profile || !levelKey || !storyId) return;
    const storyStats = ensureStoryStats(profile);
    const recent = Array.isArray(storyStats.recentByLevel[levelKey]) ? storyStats.recentByLevel[levelKey].slice() : [];
    const withoutCurrent = recent.filter(function (entry) {
      return entry !== storyId;
    });
    withoutCurrent.unshift(storyId);
    storyStats.recentByLevel[levelKey] = withoutCurrent.slice(0, 3);
  }

  function renderStory() {
    const story = STATE.storyCurrent;
    const level = currentStoryLevel();
    renderStoryHeader(level);

    if (!story) {
      setText("storyTitle", ui.stories && ui.stories.titleFallback || "Story");
      setOptionalText("storyPrompt", ui.stories && ui.stories.noStories || "No stories are available for this level yet.", "");
      const emptyStoryText = byId("storyText");
      if (emptyStoryText) emptyStoryText.innerHTML = "";
      setText("storyQuestionPrompt", "");
      setText("storyFeedback", "");
      const answers = byId("storyAnswerButtons");
      if (answers) answers.innerHTML = "";
      const nextButton = byId("storyNextBtn");
      if (nextButton) nextButton.style.display = "none";
      return;
    }

    const storyTitle = byId("storyTitle");
    if (storyTitle) {
      storyTitle.innerHTML = formatForDisplay(story.title || ui.stories && ui.stories.titleFallback || "Story");
      storyTitle.style.color = "black";
    }
    setOptionalText("storyPrompt", "", "");

    const storyText = byId("storyText");
    if (storyText) {
      storyText.innerHTML = formatStoryText(story.lines || []);
      storyText.style.color = "black";
    }

    setText("storyQuestionPrompt", formatForDisplay(story.question && story.question.prompt || ""));

    const answerContainer = byId("storyAnswerButtons");
    if (answerContainer) {
      answerContainer.innerHTML = "";
      STATE.storyAnswerOptions.forEach(function (option, index) {
        const button = global.document.createElement("button");
        button.type = "button";
        button.className = "btn btn-default story-answer-button";
        if (STATE.storySelectedIndex === index && !option.correct) {
          button.className += " story-answer-button-wrong";
        }
        if (STATE.storyAnswered && option.correct) {
          button.className += " story-answer-button-correct";
        }
        button.innerHTML = formatForDisplay(option.text);
        button.disabled = STATE.storyAnswered;
        button.onclick = function () {
          answerStoryQuestion(index);
        };
        answerContainer.appendChild(button);
      });
    }

    const nextButton = byId("storyNextBtn");
    if (nextButton) nextButton.style.display = "inline-block";
  }

  function setStoryLevel(groupId, levelId) {
    STATE.storyLevelKey = storyLevelKey(groupId, levelId);
    STATE.storyLevelId = Number(levelId);
    setStoryPopupOpen(false);
    if (global.location) global.location.hash = "#stories";
    if (global.jQuery) {
      global.jQuery('.masthead-nav a[href="#stories"]').tab("show");
    }
    nextStory();
  }

  function nextStory() {
    const level = currentStoryLevel();
    const selectedStory = pickStoryForLevel(level);

    STATE.storyCurrent = selectedStory;
    STATE.storyAnswerOptions = buildStoryAnswerOptions(selectedStory);
    STATE.storyAnswered = false;
    STATE.storyAttempt = 0;
    STATE.storySelectedIndex = -1;

    if (STATE.profile && selectedStory) {
      rememberStorySelection(STATE.profile, STATE.storyLevelKey, selectedStory.id);
      saveProfile(STATE.profile);
    }

    renderStoryLevelButtons();
    renderStory();
  }

  function awardStoryCompletion(points) {
    if (!STATE.profile || !STATE.storyCurrent) return;

    const profile = STATE.profile;
    const today = recordActivityDay(profile);
    const level = currentStoryLevel();
    const levelKey = STATE.storyLevelKey;
    const storyStats = ensureStoryStats(profile);
    const levelStats = getStoryLevelStats(profile, levelKey);
    const entryStats = getStoryEntryStats(profile, STATE.storyCurrent.id);

    storyStats.totalPoints += Number(points || 0);
    storyStats.completedCount += 1;
    storyStats.correctAnswers += 1;
    if (STATE.storyAttempt === 1) storyStats.firstTryCorrect += 1;

    levelStats.completedCount += 1;
    levelStats.correctAnswers += 1;
    if (STATE.storyAttempt === 1) levelStats.firstTryCorrect += 1;
    levelStats.lastStoryId = STATE.storyCurrent.id;
    levelStats.lastCompletedOn = todayKey();

    entryStats.completedCount += 1;
    entryStats.correctAnswers += 1;
    if (STATE.storyAttempt === 1) entryStats.firstTryCorrect += 1;
    entryStats.lastCompletedOn = todayKey();
    entryStats.lastPoints = Number(points || 0);

    today.totalPoints += Number(points || 0);
    today.storyPoints += Number(points || 0);
    today.storyCompletions += 1;

    profile.totalScore = Number(profile.totalScore || 0) + Number(points || 0);
    profile.lastStoryLevelKey = levelKey;
    profile.lastStoryId = STATE.storyCurrent.id;
    if (level) profile.lastLevelId = Number(level.id);

    STATE.score = Number(profile.totalScore || 0);
    saveProfile(profile);
    syncStats();
    renderSummary(profile);
    renderStoryLevelButtons();
  }

  function answerStoryQuestion(answerIndex) {
    if (!STATE.storyCurrent || STATE.storyAnswered) return;

    const answer = STATE.storyAnswerOptions[answerIndex];
    if (!answer) return;
    STATE.storyAttempt += 1;
    STATE.storySelectedIndex = answerIndex;

    if (answer.correct) {
      const points = STATE.storyAttempt === 1 ? STORY_POINTS.firstTry : STORY_POINTS.secondTry;

      awardStoryCompletion(points);
      STATE.storyAnswered = true;
      setText("storyFeedback", "");
    } else if (STATE.storyAttempt === 1) {
      setText("storyFeedback", ui.stories && ui.stories.answerRetry || "Try once more.");
    } else {
      STATE.storyAnswered = true;
      setText("storyFeedback", "");
    }

    renderStory();
  }

  function setStoryPopupOpen(isOpen) {
    const navItem = byId("navStories") ? byId("navStories").parentNode : null;
    const subnav = byId("storiesSubnav");
    const expanded = !!isOpen;

    if (navItem && navItem.classList) {
      navItem.classList.toggle("beri-subnav-open", expanded);
    }

    const navLink = byId("navStories");
    if (navLink) navLink.setAttribute("aria-expanded", expanded ? "true" : "false");
    if (subnav) subnav.setAttribute("aria-hidden", expanded ? "false" : "true");
  }

  function initialiseNavigation() {
    if (!global.jQuery) return;

    global.jQuery(function () {
      const url = global.document.location.toString();

      if (url.match("#")) {
        global.jQuery('.masthead-nav a[href="#' + url.split("#")[1] + '"]').tab("show");
      }

      global.jQuery(".masthead-nav a").on("shown.bs.tab", function (event) {
        global.location.hash = event.target.hash;

        if (event.target.hash !== "#stories") {
          setStoryPopupOpen(false);
        }

        if (global.innerWidth <= 900) {
          global.jQuery("#beriSidebarMenu").collapse("hide");
        }
      });

      const storyLink = byId("navStories");
      if (storyLink) {
        storyLink.addEventListener("click", function () {
          const navItem = storyLink.parentNode;
          const isOpen = !!(navItem && navItem.classList && navItem.classList.contains("beri-subnav-open"));
          setStoryPopupOpen(!isOpen);
        });
      }

      global.document.addEventListener("click", function (event) {
        const navItem = storyLink ? storyLink.parentNode : null;
        if (!navItem) return;
        if (navItem.contains(event.target)) return;
        setStoryPopupOpen(false);
      });
    });
  }

  function bindStudentControls() {
    const saveButton = byId("studentSaveBtn");
    const input = byId("studentNameInput");
    const languageSelect = byId("languageSelect");
    const dashBox = byId("dash");
    const syllableColorsBox = byId("syllableColors");
    const capitalBox = byId("capital");
    const gentleModeBox = byId("gentleMode");
    const storyNextButton = byId("storyNextBtn");
    const practiceNextLevelButton = byId("practiceNextLevelBtn");
    const downloadReportButton = byId("downloadReportBtn");

    if (saveButton) {
      saveButton.addEventListener("click", function () {
        selectStudent(input ? input.value : "");
      });
    }

    if (input) {
      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          selectStudent(input.value);
        }
      });
    }

    if (languageSelect) {
      languageSelect.value = currentLocale.code;
      languageSelect.addEventListener("change", function () {
        changeLanguage(languageSelect.value);
      });
    }

    if (storyNextButton) {
      storyNextButton.addEventListener("click", function () {
        nextStory();
      });
    }

    if (practiceNextLevelButton) {
      practiceNextLevelButton.addEventListener("click", setNextLevel);
    }

    if (downloadReportButton) {
      downloadReportButton.addEventListener("click", downloadProgressReport);
    }

    if (dashBox) dashBox.addEventListener("change", updateProfileSettingsFromUi);
    if (syllableColorsBox) syllableColorsBox.addEventListener("change", updateProfileSettingsFromUi);
    if (capitalBox) capitalBox.addEventListener("change", updateProfileSettingsFromUi);
    if (gentleModeBox) gentleModeBox.addEventListener("change", updateProfileSettingsFromUi);
  }

  function initialiseUi() {
    if (!global.document) return;

    if (!STATE.storyLevelKey) {
      const initialStoryLevel = firstStoryLevel();
      if (initialStoryLevel) {
        STATE.storyLevelKey = storyLevelKey(initialStoryLevel.groupId, initialStoryLevel.id);
        STATE.storyLevelId = Number(initialStoryLevel.id);
      }
    }

    setDocumentLanguage();
    setDocumentMetadata();
    applyStaticText();
    setButtonText(ui.practice.start || DEFAULT_UI.practice.start);
    setWordText(ui.practice.prompt || ui.practice.ready || DEFAULT_UI.practice.ready, "black");
    renderLanguageOptions();
    renderLevelButtons("levelButtons");
    renderStoryLevelButtons();
    bindStudentControls();
    ensureStudent();
  }

  function reload(newContent, newUi) {
    content = mergeDeep(DEFAULT_CONTENT, newContent || global.BERI_CONTENT || {});
    ui = mergeDeep(DEFAULT_UI, newUi || global.BERI_UI || {});
    stories = global.BERI_STORIES || { groups: [] };
    levelIndex = buildLevelIndex(content);
    storyLevelIndex = buildStoryLevelIndex(stories);
    STATE.levelId = firstLevel() ? firstLevel().id : 1;
    STATE.storyLevelKey = "";
    STATE.storyLevelId = null;
    STATE.storyCurrent = null;
    STATE.storyAnswerOptions = [];
    STATE.storyAnswered = false;
    STATE.storyAttempt = 0;
    STATE.oldItem = "";
    STATE.counter = 0;
    STATE.levelScore = 0;
    initialiseUi();
  }

  function escapeHtml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function hexToRgba(hex, alpha) {
    const normalized = String(hex || "#6faeff").replace("#", "");
    const full = normalized.length === 3 ? normalized.replace(/(.)/g, "$1$1") : normalized;
    const red = parseInt(full.substring(0, 2), 16);
    const green = parseInt(full.substring(2, 4), 16);
    const blue = parseInt(full.substring(4, 6), 16);
    return "rgba(" + red + ", " + green + ", " + blue + ", " + alpha + ")";
  }

  function mixHexColors(firstHex, secondHex, ratio) {
    const first = expandHex(firstHex);
    const second = expandHex(secondHex);
    const mix = Math.max(0, Math.min(1, Number(ratio)));

    const red = Math.round(parseInt(first.substring(0, 2), 16) * (1 - mix) + parseInt(second.substring(0, 2), 16) * mix);
    const green = Math.round(parseInt(first.substring(2, 4), 16) * (1 - mix) + parseInt(second.substring(2, 4), 16) * mix);
    const blue = Math.round(parseInt(first.substring(4, 6), 16) * (1 - mix) + parseInt(second.substring(4, 6), 16) * mix);

    return "#" + [red, green, blue].map(function (value) {
      return value.toString(16).padStart(2, "0");
    }).join("");
  }

  function expandHex(hex) {
    const normalized = String(hex || "#6faeff").replace("#", "");
    return normalized.length === 3 ? normalized.replace(/(.)/g, "$1$1") : normalized;
  }

  function getLevelGradientColor(baseColor, index, count) {
    if (count <= 1) return baseColor;
    const progress = index / (count - 1);
    return mixHexColors(baseColor, "#7a2cff", progress * 0.32);
  }

  function getContrastTextColor(hex) {
    const full = expandHex(hex);
    const red = parseInt(full.substring(0, 2), 16);
    const green = parseInt(full.substring(2, 4), 16);
    const blue = parseInt(full.substring(4, 6), 16);
    const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
    return luminance > 0.66 ? "#162033" : "#ffffff";
  }

  const api = {
    state: STATE,
    get content() { return content; },
    get ui() { return ui; },
    randomElement: randomElement,
    randomInt: randomInt,
    setLevel: setLevel,
    setNextLevel: setNextLevel,
    getItem: getItem,
    formatForDisplay: formatForDisplay,
    countPoints: countPoints,
    startReading: startReading,
    nextWord: nextWord,
    finishReading: finishReading,
    nextStory: nextStory,
    setStoryLevel: setStoryLevel,
    answerStoryQuestion: answerStoryQuestion,
    read: read,
    renderLevelButtons: renderLevelButtons,
    reload: reload,
    selectStudent: selectStudent
  };

  global.Beri = api;
  global.setLevel = setLevel;
  global.read = read;
  global.startReading = startReading;
  global.nextWord = nextWord;
  global.finishReading = finishReading;
  global.getItem = getItem;
  global.getWord = getItem;
  global.randomElement = randomElement;
  global.randomInt = randomInt;

  initialiseNavigation();

  if (global.document && global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", initialiseUi);
  } else {
    initialiseUi();
  }
})(window);
