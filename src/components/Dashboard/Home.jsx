import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import {GET_DIRECTION, LANDING_URL, PRACTICE_URL, SERVER_URL} from "../../utils/Constants.js";
import {useEffect, useMemo, useRef, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

function concatSmart(prev, next) {
    if (!prev) return next ?? '';
    if (!next) return prev;
    if (prev.endsWith('\r') && next.startsWith('\n')) return prev + next;
    return prev + next;
}

export default function Home() {
    const navigate = useNavigate();
    const {i18n, t} = useTranslation();

    // Logic aligned with PracticePage.jsx [cite: 446, 447]
    const dir = useMemo(() => GET_DIRECTION(i18n.language), [i18n.language]);
    const lang = (i18n.language || "en").toLowerCase();
    const isHebrew = lang.startsWith("he");

    // -------- data state --------
    const [profile, setProfile] = useState(null);
    const [topics, setTopics] = useState([]);
    const [userStats, setUserStats] = useState(null);
    const [adminStats, setAdminStats] = useState(null);

    const [strengths, setStrengths] = useState([]);
    const [weaknesses, setWeaknesses] = useState([]);

    // -------- AI streaming state --------
    const [aiSummary, setAiSummary] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState(null);

    const aiEventSourceRef = useRef(null);
    const hasAutoStreamedRef = useRef(false);
    const summaryEndRef = useRef(null);
    const shouldAutoStreamRef = useRef(false);
    const LAST_ROUTE_KEY = "qm:lastRoute";

    const aiSummaryRef = useRef("");
    const SUMMARY_KEY_PREFIX = "qm:homeSummary";

    const buildSummaryKey = (p, lang) => {
        const u = p?.username || "anon";
        const r = p?.role || "USER";
        const l = (lang || "en").toLowerCase().startsWith("he") ? "he" : "en";
        return `${SUMMARY_KEY_PREFIX}:${u}:${r}:${l}`;
    };

    const L = useMemo(() => {
        if (isHebrew) {
            return {
                welcomeBack: "ברוך הבא",
                adminWelcome: "ברוך הבא מנהל מערכת",
                gatewaySubtitle: "זהו מסך הבית שלך — כאן תקבל/י סיכום אישי והכוונה חכמה להמשך הלמידה.",
                topicsTitle: "הנושאים במערכת",
                aiTitle: "הסיכום האישי שלך מ-AI",
                regenerate: "הפקת סיכום מחדש",
                startPractice: "התחילי תרגול",
                progressTitle: "התקדמות כללית",
                progressPending: "אין עדיין מספיק נתונים — התקדמות תופיע לאחר תרגול.",
                strongAt: "חזק/ה ב-",
                needsWork: "כדאי לחזק",
                systemSnapshot: "תמונת מצב מערכת",
                totalUsers: 'סה"כ משתמשים',
                totalAttempts: 'סה"כ ניסיונות',
                overallSuccess: "הצלחה כללית",
                loading: "טוען...",
                noTopics: "לא נמצאו נושאים.",
                aiError: "לא הצלחתי להפיק סיכום כרגע. נסה/י שוב."
            };
        }
        return {
            welcomeBack: "Welcome back",
            adminWelcome: "Welcome, Administrator",
            gatewaySubtitle: "This is your home gateway — a personal AI summary and guidance for what to learn next.",
            topicsTitle: "Topics in the system",
            aiTitle: "Your personal AI summary",
            regenerate: "Regenerate summary",
            startPractice: "Start practice",
            progressTitle: "Overall progress",
            progressPending: "Not enough data yet — your progress will appear after some practice.",
            strongAt: "Strong at",
            needsWork: "Needs work",
            systemSnapshot: "System snapshot",
            totalUsers: "Total users",
            totalAttempts: "Total attempts",
            overallSuccess: "Overall success rate",
            loading: "Loading...",
            noTopics: "No topics found.",
            aiError: "Couldn't generate summary right now. Please try again."
        };
    }, [isHebrew]);

    // ---------- fetch profile + topics ----------
    useEffect(() => {
        let mounted = true;

        const fetchProfileAndTopics = async () => {
            try {
                const [profileRes, parentsRes] = await Promise.all([
                    axios.get(`${SERVER_URL}/profile`, {withCredentials: true}),
                    axios.get(`${SERVER_URL}/topics`, {withCredentials: true}),
                ]);

                if (!mounted) return;

                const p = profileRes.data;
                setProfile(p);

                const parentTopics = parentsRes.data || [];

                // enrich parents with subtopics count
                const enriched = [];
                for (const parent of parentTopics) {
                    try {
                        const subRes = await axios.get(
                            `${SERVER_URL}/topics?parentId=${parent.id}`,
                            {withCredentials: true}
                        );
                        enriched.push({
                            ...parent,
                            subtopics: subRes.data || [],
                        });
                    } catch {
                        enriched.push({...parent, subtopics: []});
                    }
                }

                if (mounted) setTopics(enriched);
            } catch (e) {
                // keep UI resilient even if one call fails
                console.error("Home fetch error:", e);
                if (mounted) {
                    setProfile(null);
                    setTopics([]);
                }
            }
        };

        fetchProfileAndTopics();
        return () => {
            mounted = false;
        };
    }, []);

    // ---------- SSE: user dashboard ----------
    useEffect(() => {
        if (!profile) return;

        const ev = new EventSource(`${SERVER_URL}/sse/user-dashboard`, {withCredentials: true});
        const handler = (event) => {
            try {
                const data = JSON.parse(event.data);
                setUserStats(data);
            } catch (e) {
                console.error("userDashboard parse error:", e);
            }
        };

        ev.addEventListener("userDashboard", handler);
        ev.onerror = (e) => {
            console.warn("userDashboard SSE error:", e);
        };

        return () => {
            ev.removeEventListener("userDashboard", handler);
            ev.close();
        };
    }, [profile]);

    // ---------- SSE: admin dashboard ----------
    useEffect(() => {
        if (!profile || profile.role !== "ADMIN") return;

        const ev = new EventSource(`${SERVER_URL}/sse/admin-dashboard`, {withCredentials: true});
        const handler = (event) => {
            try {
                const data = JSON.parse(event.data);
                setAdminStats(data);
            } catch (e) {
                console.error("adminDashboard parse error:", e);
            }
        };

        ev.addEventListener("adminDashboard", handler);
        ev.onerror = (e) => {
            console.warn("adminDashboard SSE error:", e);
        };

        return () => {
            ev.removeEventListener("adminDashboard", handler);
            ev.close();
        };
    }, [profile]);

    // ---------- compute strengths/weaknesses ----------
    useEffect(() => {
        const rates = userStats?.successRateByTopic || {};
        const entries = Object.entries(rates)
            .filter(([, v]) => typeof v === "number")
            .sort((a, b) => b[1] - a[1]);

        if (!entries.length) {
            setStrengths([]);
            setWeaknesses([]);
            return;
        }

        const top = entries.slice(0, 3).filter(([, v]) => v >= 70).map(([k]) => k);
        const bottom = entries.slice(-3).filter(([, v]) => v <= 50).map(([k]) => k);

        setStrengths(top);
        setWeaknesses(bottom);
    }, [userStats]);

    // ---------- build AI prompt ----------
    const buildPrompt = () => {
        const uiLang = i18n.language || "en";
        const role = profile?.role === "ADMIN" ? "ADMIN" : "USER";
        const username = profile?.username || "user";

        const topicLines = topics.map(tp => {
            const parentName = t(tp.name) || tp.name;
            const subs = (tp.subtopics || []).map(st => t(st.name) || st.name);
            return `- ${parentName}${subs.length ? ` (subtopics: ${subs.join(", ")})` : ""}`;
        });

        const successRates = userStats?.successRateByTopic || {};
        const overallLevel = userStats?.overallProgressLevel || null;
        const overallScore = userStats?.overallProgressScore || null;

        if (uiLang === "he") {
            let prompt =
                `את/ה עוזר/ת ה-AI של QuickMath.\n` +
                `שפת הממשק: עברית.\n` +
                `התייחס/י למשתמש בשם "${username}". אם הוא מנהל מערכת, פנה/י אליו כ"מנהל מערכת".\n\n` +
                `המטרה: כתבי סיכום אישי קצר אך עשיר, שמסביר על כל נושא לימוד במערכת, מה המשתמש עושה טוב, ומה צריך לחזק.\n` +
                `השתמש/י בטון תומך ומוטיבציוני.\n\n` +
                `נושאים במערכת:\n${topicLines.join("\n")}\n\n` +
                `נתוני התקדמות כלליים:\n` +
                `- רמת התקדמות: ${overallLevel || "לא ידוע"}\n` +
                `- ציון התקדמות: ${overallScore != null ? overallScore : "לא ידוע"}\n\n` +
                `אחוזי הצלחה לפי נושא (אם קיימים):\n${JSON.stringify(successRates)}\n\n`;

            if (role === "ADMIN" && adminStats) {
                prompt +=
                    `בנוסף, מאחר ואתה מנהל מערכת, הוסף בסוף סיכום סטטיסטי קצר של המערכת:\n` +
                    `- סה"כ משתמשים: ${adminStats.totalUsers}\n` +
                    `- סה"כ ניסיונות: ${adminStats.totalAttempts}\n` +
                    `- אחוז הצלחה כללי: ${adminStats.overallSuccessRate}\n` +
                    `- ניסיונות לפי נושא: ${JSON.stringify(adminStats.attemptsByTopic)}\n` +
                    `- הצלחה לפי נושא: ${JSON.stringify(adminStats.successRateByTopic)}\n`;
            }

            return prompt;
        }

        // English
        let prompt =
            `You are QuickMath's AI tutor.\n` +
            `UI language: English.\n` +
            `Address "${username}" as a regular user, and if the role is ADMIN, address them as "administrator".\n\n` +
            `Goal: Write a concise but rich personal summary. Go through each topic, say what the user is strong at, and what to improve next.\n` +
            `Use a friendly, motivating tone.\n\n` +
            `Topics in the system:\n${topicLines.join("\n")}\n\n` +
            `Overall progress data:\n` +
            `- Progress level: ${overallLevel || "unknown"}\n` +
            `- Progress score: ${overallScore != null ? overallScore : "unknown"}\n\n` +
            `Success rates per topic (if any):\n${JSON.stringify(successRates)}\n\n`;

        if (role === "ADMIN" && adminStats) {
            prompt +=
                `Additionally, because the user is an administrator, add a short system stats section at the end:\n` +
                `- Total users: ${adminStats.totalUsers}\n` +
                `- Total attempts: ${adminStats.totalAttempts}\n` +
                `- Overall success rate: ${adminStats.overallSuccessRate}\n` +
                `- Attempts by topic: ${JSON.stringify(adminStats.attemptsByTopic)}\n` +
                `- Success rate by topic: ${JSON.stringify(adminStats.successRateByTopic)}\n`;
        }

        return prompt;
    };

    // Decide if we should auto-generate summary only when arriving from Landing (or first load in tab)
    useEffect(() => {
        try {
            const prevRoute = sessionStorage.getItem(LAST_ROUTE_KEY);
            shouldAutoStreamRef.current = !prevRoute || prevRoute === LANDING_URL;
            // eslint-disable-next-line no-unused-vars
        } catch (e) {
            shouldAutoStreamRef.current = true;
        }
    }, []);

    // Restore last summary when returning to Home (unless arriving from Landing)
    useEffect(() => {
        if (!profile) return;

        const key = buildSummaryKey(profile, i18n.language);

        // If coming from Landing, start fresh (avoid flashing old summary)
        if (shouldAutoStreamRef.current) {
            try {
                sessionStorage.removeItem(key);
            } catch {
                /* ignore */
            }
            return;
        }

        try {
            const saved = sessionStorage.getItem(key);
            if (saved) {
                setAiSummary(saved);
                aiSummaryRef.current = saved;
                // Treat as already having a summary (prevents any non-forced auto runs)
                hasAutoStreamedRef.current = true;
            }
        } catch {
            /* ignore */
        }
    }, [profile, i18n.language]);

    // ---------- AI streaming ----------
    const startAiStream = (force = false) => {
        if (!profile || topics.length === 0) return;
        if (hasAutoStreamedRef.current && !force) return;

        hasAutoStreamedRef.current = true;

        const key = buildSummaryKey(profile, i18n.language);

        // If user explicitly regenerates, clear stored summary first
        if (force) {
            try {
                sessionStorage.removeItem(key);
            } catch {
                /* ignore */
            }
        }

        // close previous stream if exists
        if (aiEventSourceRef.current) {
            aiEventSourceRef.current.close();
            aiEventSourceRef.current = null;
        }

        setAiSummary("");
        aiSummaryRef.current = "";
        setAiError(null);
        setAiLoading(true);

        const question = buildPrompt();
        const uiLang = i18n.language || "en";

        const url = `${SERVER_URL}/ai/stream?question=${encodeURIComponent(question)}&lang=${uiLang}`;
        const ev = new EventSource(url, {withCredentials: true});
        aiEventSourceRef.current = ev;

        const onChunk = (e) => {
            if (!e?.data) return;
            try {
                const parsed = JSON.parse(e.data);
                // expected: {"t":"..."}
                const token = parsed?.t ?? "";
                if (!token) return;

                setAiSummary((prev) => {
                    const nextText = concatSmart(prev, token);
                    aiSummaryRef.current = nextText;
                    return nextText;
                });
            } catch {
                setAiSummary((prev) => {
                    const nextText = concatSmart(prev, e.data);
                    aiSummaryRef.current = nextText;
                    return nextText;
                });
            }
        };

        const onDone = () => {
            setAiLoading(false);
            // Persist latest completed summary for this user+role+lang
            try {
                if (aiSummaryRef.current) {
                    sessionStorage.setItem(key, aiSummaryRef.current);
                }
            } catch {
                /* ignore */
            }

            ev.close();
            aiEventSourceRef.current = null;
        };

        const onError = (err) => {
            console.warn("AI stream error:", err);
            setAiError(L.aiError);
            setAiLoading(false);
            ev.close();
            aiEventSourceRef.current = null;
        };

        ev.addEventListener("chunk", onChunk);
        ev.addEventListener("done", onDone);
        ev.addEventListener("error", onError);
        ev.onerror = onError;
    };

    // auto-start stream once data is ready ONLY when arriving from Landing (reconnect)
    useEffect(() => {
        if (!profile || topics.length === 0) return;
        if (profile.role === "ADMIN" && !adminStats) return; // wait for admin stats to enrich prompt
        if (!shouldAutoStreamRef.current) return;

        startAiStream(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile, topics, adminStats, i18n.language]);

    // auto scroll to bottom while streaming
    useEffect(() => {
        if (summaryEndRef.current) {
            summaryEndRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [aiSummary]);

    useEffect(() => {
        return () => {
            if (aiEventSourceRef.current) {
                aiEventSourceRef.current.close();
                aiEventSourceRef.current = null;
            }
        };
    }, []);

    // ---------- derived UI values ----------
    const overallScore = userStats?.overallProgressScore;
    const overallPercent = typeof overallScore === "number"
        ? Math.min(100, Math.max(0, (overallScore / 5) * 100))
        : null;

    return (
        <Box
            component="section"
            lang={i18n.language}
            dir={dir}
            sx={{
                p: {xs: 2, md: 4},
                minHeight: "100vh",
            }}
        >

            <Stack spacing={3}>
                {/* HERO / Greeting */}
                <Card elevation={3} sx={{borderRadius: 3, overflow: "hidden"}}>
                    <CardContent>
                        <Stack
                            direction={{xs: "column", md: "row"}}
                            spacing={2}
                            alignItems="center"
                        >
                            <Box
                                component="img"
                                src="src/assets/favicon.png"
                                alt="icon"
                                sx={{
                                    width: {xs: 90, md: 120},
                                    height: "auto",
                                    filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.25))",
                                    opacity: 0.95,
                                }}
                            />
                            <Box sx={{flex: 1}}>
                                <Typography variant="h4" sx={{fontWeight: 800}}>
                                    {profile?.role === "ADMIN" ? L.adminWelcome : L.welcomeBack}
                                    {profile?.username ? `, ${profile.username}` : ""}
                                </Typography>
                                <Typography sx={{mt: 1, opacity: 0.85}}>
                                    {L.gatewaySubtitle}
                                </Typography>
                            </Box>

                            <Stack direction="row" spacing={1}>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate(PRACTICE_URL)}
                                >
                                    {L.startPractice}
                                </Button>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Progress + Strengths */}
                <Card elevation={2} sx={{borderRadius: 3}}>
                    <CardContent>
                        <Typography variant="h6" sx={{fontWeight: 700}}>
                            {L.progressTitle}
                        </Typography>

                        {overallPercent == null ? (
                            <Typography sx={{mt: 1, opacity: 0.8}}>
                                {L.progressPending}
                            </Typography>
                        ) : (
                            <Box sx={{mt: 1}}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                >
                                    <Typography sx={{opacity: 0.8}}>
                                        {t(userStats?.overallProgressLevel) || userStats?.overallProgressLevel}
                                    </Typography>
                                    <Typography sx={{opacity: 0.8}}>
                                        {overallScore.toFixed(2)} / 5
                                    </Typography>
                                </Stack>
                                <LinearProgress
                                    variant="determinate"
                                    value={overallPercent}
                                    sx={{height: 10, borderRadius: 5, mt: 1}}
                                />
                            </Box>
                        )}

                        {(strengths.length > 0 || weaknesses.length > 0) && (
                            <>
                                <Divider sx={{my: 2}}/>
                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    {strengths.map((s) => (
                                        <Chip
                                            key={`strong-${s}`}
                                            color="success"
                                            label={`${L.strongAt} ${t(s) || s}`}
                                            sx={{mb: 1}}
                                        />
                                    ))}
                                    {weaknesses.map((w) => (
                                        <Chip
                                            key={`weak-${w}`}
                                            color="warning"
                                            label={`${L.needsWork}: ${t(w) || w}`}
                                            sx={{mb: 1}}
                                        />
                                    ))}
                                </Stack>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Topics overview */}
                <Card elevation={2} sx={{borderRadius: 3}}>
                    <CardContent>
                        <Typography variant="h6" sx={{fontWeight: 700}}>
                            {L.topicsTitle}
                        </Typography>

                        {topics.length === 0 ? (
                            <Typography sx={{mt: 1}}>{L.noTopics}</Typography>
                        ) : (
                            <List dense>
                                {topics.map((tp) => {
                                    const rateMap = userStats?.successRateByTopic || {};
                                    const rate = rateMap[tp.name];
                                    const percent = typeof rate === "number" ? rate : null;

                                    return (
                                        <ListItem key={tp.id} sx={{py: 1}}>
                                            <ListItemText
                                                primary={
                                                    <Stack direction="row" spacing={1} alignItems="center"
                                                           flexWrap="wrap">
                                                        <Typography sx={{fontWeight: 600}}>
                                                            {t(tp.name) || tp.name}
                                                        </Typography>
                                                        {(tp.subtopics || []).length > 0 && (
                                                            <Chip size="small"
                                                                  label={`${tp.subtopics.length} subtopics`}/>
                                                        )}
                                                        {percent != null && (
                                                            <Chip
                                                                size="small"
                                                                color={percent >= 70 ? "success" : percent <= 50 ? "warning" : "default"}
                                                                label={`${percent.toFixed(0)}%`}
                                                            />
                                                        )}
                                                    </Stack>
                                                }
                                                secondary={
                                                    percent != null ? (
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={Math.min(100, Math.max(0, percent))}
                                                            sx={{height: 6, borderRadius: 4, mt: 0.5}}
                                                        />
                                                    ) : null
                                                }
                                            />
                                        </ListItem>
                                    );
                                })}
                            </List>
                        )}
                    </CardContent>
                </Card>

                {/* AI Summary */}
                <Card elevation={3} sx={{borderRadius: 3}}>
                    <CardContent>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Typography variant="h6" sx={{fontWeight: 700}}>
                                {L.aiTitle}
                            </Typography>

                            <Tooltip title={L.regenerate}>
                                <Button
                                    variant="outlined"
                                    onClick={() => startAiStream(true)}
                                    disabled={aiLoading}
                                >
                                    {L.regenerate}
                                </Button>
                            </Tooltip>
                        </Stack>

                        <Divider sx={{my: 2}}/>

                        {aiLoading && aiSummary.length === 0 && (
                            <Stack direction="row" spacing={2} alignItems="center">
                                <CircularProgress size={22}/>
                                <Typography>{L.loading}</Typography>
                            </Stack>
                        )}

                        {aiError && (
                            <Typography color="error" sx={{mb: 1}}>
                                {aiError}
                            </Typography>
                        )}

                        <Box
                            dir={dir}
                            lang={i18n.language}
                            sx={{
                                mt: 2,
                                p: 2,
                                borderRadius: 2,
                                border: "1px solid #ccc",
                                backgroundColor: "#fafafa",
                                whiteSpace: "pre-wrap",
                                fontFamily: "inherit",
                                lineHeight: 1.7,
                                minHeight: 120,
                                opacity: aiLoading ? 0.9 : 1,
                                textAlign: "start",
                            }}
                        >
                            {aiSummary ? (
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                >
                                    {aiSummary}
                                </ReactMarkdown>
                            ) : (!aiLoading && !aiError ? "" : "")}
                            <div ref={summaryEndRef}/>
                        </Box>
                    </CardContent>
                </Card>

                {/* Admin-only snapshot + charts */}
                {profile?.role === "ADMIN" && adminStats && (
                    <Card elevation={2} sx={{borderRadius: 3}}>
                        <CardContent>
                            <Typography variant="h6" sx={{fontWeight: 700}}>
                                {L.systemSnapshot}
                            </Typography>

                            <Divider sx={{my: 2}}/>

                            <Stack
                                direction={{xs: "column", md: "row"}}
                                spacing={2}
                            >
                                <Card variant="outlined" sx={{flex: 1, borderRadius: 2}}>
                                    <CardContent>
                                        <Typography sx={{opacity: 0.8}}>{L.totalUsers}</Typography>
                                        <Typography variant="h4" sx={{fontWeight: 800}}>
                                            {adminStats.totalUsers}
                                        </Typography>
                                    </CardContent>
                                </Card>

                                <Card variant="outlined" sx={{flex: 1, borderRadius: 2}}>
                                    <CardContent>
                                        <Typography sx={{opacity: 0.8}}>{L.totalAttempts}</Typography>
                                        <Typography variant="h4" sx={{fontWeight: 800}}>
                                            {adminStats.totalAttempts}
                                        </Typography>
                                    </CardContent>
                                </Card>

                                <Card variant="outlined" sx={{flex: 1, borderRadius: 2}}>
                                    <CardContent>
                                        <Typography sx={{opacity: 0.8}}>{L.overallSuccess}</Typography>
                                        <Typography variant="h4" sx={{fontWeight: 800}}>
                                            {adminStats.overallSuccessRate?.toFixed?.(2) ?? adminStats.overallSuccessRate}
                                            %
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Stack>

                            <Divider sx={{my: 3}}/>

                        </CardContent>
                    </Card>
                )}
            </Stack>
        </Box>
    );
}