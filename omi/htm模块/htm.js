!(function () {
  var n = function (t, e, s, u) {
      var r;
      e[0] = 0;
      for (var h = 1; h < e.length; h++) {
        var p = e[h++],
          a = e[h] ? ((e[0] |= p ? 1 : 2), s[e[h++]]) : e[++h];
        3 === p
          ? (u[0] = a)
          : 4 === p
          ? (u[1] = Object.assign(u[1] || {}, a))
          : 5 === p
          ? ((u[1] = u[1] || {})[e[++h]] = a)
          : 6 === p
          ? (u[1][e[++h]] += a + "")
          : p
          ? ((r = t.apply(a, n(t, a, s, ["", null]))),
            u.push(r),
            a[0] ? (e[0] |= 2) : ((e[h - 2] = 0), (e[h] = r)))
          : u.push(a);
      }
      return u;
    },
    t = new Map(),
    e = function (e) {
      var s = t.get(this);
      return (
        s || ((s = new Map()), t.set(this, s)),
        (s = n(
          this,
          s.get(e) ||
            (s.set(
              e,
              (s = (function (n) {
                for (
                  var t,
                    e,
                    s = 1,
                    u = "",
                    r = "",
                    h = [0],
                    p = function (n) {
                      1 === s &&
                      (n || (u = u.replace(/^\s*\n\s*|\s*\n\s*$/g, "")))
                        ? h.push(0, n, u)
                        : 3 === s && (n || u)
                        ? (h.push(3, n, u), (s = 2))
                        : 2 === s && "..." === u && n
                        ? h.push(4, n, 0)
                        : 2 === s && u && !n
                        ? h.push(5, 0, !0, u)
                        : s >= 5 &&
                          ((u || (!n && 5 === s)) &&
                            (h.push(s, 0, u, e), (s = 6)),
                          n && (h.push(s, n, 0, e), (s = 6))),
                        (u = "");
                    },
                    a = 0;
                  a < n.length;
                  a++
                ) {
                  a && (1 === s && p(), p(a));
                  for (var o = 0; o < n[a].length; o++)
                    (t = n[a][o]),
                      1 === s
                        ? "<" === t
                          ? (p(), (h = [h]), (s = 3))
                          : (u += t)
                        : 4 === s
                        ? "--" === u && ">" === t
                          ? ((s = 1), (u = ""))
                          : (u = t + u[0])
                        : r
                        ? t === r
                          ? (r = "")
                          : (u += t)
                        : '"' === t || "'" === t
                        ? (r = t)
                        : ">" === t
                        ? (p(), (s = 1))
                        : s &&
                          ("=" === t
                            ? ((s = 5), (e = u), (u = ""))
                            : "/" === t && (s < 5 || ">" === n[a][o + 1])
                            ? (p(),
                              3 === s && (h = h[0]),
                              (s = h),
                              (h = h[0]).push(2, 0, s),
                              (s = 0))
                            : " " === t ||
                              "\t" === t ||
                              "\n" === t ||
                              "\r" === t
                            ? (p(), (s = 2))
                            : (u += t)),
                      3 === s && "!--" === u && ((s = 4), (h = h[0]));
                }
                return p(), h;
              })(e))
            ),
            s),
          arguments,
          []
        )).length > 1
          ? s
          : s[0]
      );
    };
  "undefined" != typeof module ? (module.exports = e) : (self.htm = e);
})();
