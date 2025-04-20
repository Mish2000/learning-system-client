export function concatSmart(prev, next) {
    if (!prev) return next;               
    const last = prev.at(-1);                  
    const first = next[0];                     

    const lastNeedsGap  = /[A-Za-z0-9]/.test(last);    
    const firstNeedsGap = /[A-Za-z0-9]/.test(first);

    const punctuationOrWS = /[\s.,;:!?()\[\]{}"']/;
    
    if (!lastNeedsGap || !firstNeedsGap) return prev + next;
    if (punctuationOrWS.test(last) || punctuationOrWS.test(first)) return prev + next;

    if (/\d/.test(last) && /\d/.test(first)) return prev + next;

    return prev + ' ' + next;
}