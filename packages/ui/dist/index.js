import * as _e from "react";
import Bi, { createContext as Ue, useContext as le, useEffect as xe, useState as _, useRef as ht, useLayoutEffect as al, useId as ll, useCallback as zi, useMemo as ks, Fragment as Ui, createElement as cl, useInsertionEffect as dl, forwardRef as ul, Component as hl } from "react";
import { useNavigate as $i, NavLink as cs, useLocation as ml, Navigate as fl, Outlet as gl, Link as Ht } from "react-router-dom";
import { clsx as Wi } from "clsx";
import { twMerge as Hi } from "tailwind-merge";
import { createClient as pl } from "@supabase/supabase-js";
import { X as Ee, LayoutDashboard as xl, Package as Ze, ShoppingCart as et, Boxes as yl, BarChart3 as ds, FileText as Ye, BookOpen as xs, Calendar as vr, Users as ys, Webhook as bl, Upload as Ie, Settings as wr, LogOut as vl, Menu as wl, AlertCircle as It, CheckSquare as xn, DollarSign as jr, Eye as tt, TrendingUp as it, Search as bt, Twitter as jl, Instagram as Nl, Mail as kl, ChevronRight as Tl, Minus as Sl, Plus as ft, Trash2 as Ts, RefreshCw as Se, Filter as Gt, EyeOff as Gi, Edit as us, Save as Ki, Crown as gt, Book as Oe, AlertTriangle as hs, User as yn, CreditCard as bn, ExternalLink as vn, XCircle as ts, Clock as Et, CheckCircle as pt, Package2 as ss, TrendingDown as rs, Star as wn, PauseCircle as Cl, Target as Pl, Archive as _l, Image as jn, File as Al, FolderOpen as El, Download as Ml, Video as Dl, Music as Rl, ArrowRight as Ll } from "lucide-react";
import { useCart as Vl, supabase as Fl } from "@zoroaster/shared";
import { Slot as Il } from "@radix-ui/react-slot";
import { cva as qi } from "class-variance-authority";
import * as Xi from "@radix-ui/react-label";
var Xs = { exports: {} }, St = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Nn;
function Ol() {
  if (Nn) return St;
  Nn = 1;
  var e = Bi, t = Symbol.for("react.element"), r = Symbol.for("react.fragment"), n = Object.prototype.hasOwnProperty, i = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, a = { key: !0, ref: !0, __self: !0, __source: !0 };
  function o(l, c, u) {
    var d, h = {}, f = null, p = null;
    u !== void 0 && (f = "" + u), c.key !== void 0 && (f = "" + c.key), c.ref !== void 0 && (p = c.ref);
    for (d in c) n.call(c, d) && !a.hasOwnProperty(d) && (h[d] = c[d]);
    if (l && l.defaultProps) for (d in c = l.defaultProps, c) h[d] === void 0 && (h[d] = c[d]);
    return { $$typeof: t, type: l, key: f, ref: p, props: h, _owner: i.current };
  }
  return St.Fragment = r, St.jsx = o, St.jsxs = o, St;
}
var Ct = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var kn;
function Yl() {
  return kn || (kn = 1, process.env.NODE_ENV !== "production" && function() {
    var e = Bi, t = Symbol.for("react.element"), r = Symbol.for("react.portal"), n = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.provider"), l = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), u = Symbol.for("react.suspense"), d = Symbol.for("react.suspense_list"), h = Symbol.for("react.memo"), f = Symbol.for("react.lazy"), p = Symbol.for("react.offscreen"), y = Symbol.iterator, S = "@@iterator";
    function C(m) {
      if (m === null || typeof m != "object")
        return null;
      var N = y && m[y] || m[S];
      return typeof N == "function" ? N : null;
    }
    var j = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function w(m) {
      {
        for (var N = arguments.length, M = new Array(N > 1 ? N - 1 : 0), F = 1; F < N; F++)
          M[F - 1] = arguments[F];
        P("error", m, M);
      }
    }
    function P(m, N, M) {
      {
        var F = j.ReactDebugCurrentFrame, W = F.getStackAddendum();
        W !== "" && (N += "%s", M = M.concat([W]));
        var K = M.map(function(z) {
          return String(z);
        });
        K.unshift("Warning: " + N), Function.prototype.apply.call(console[m], console, K);
      }
    }
    var D = !1, A = !1, I = !1, O = !1, k = !1, x;
    x = Symbol.for("react.module.reference");
    function E(m) {
      return !!(typeof m == "string" || typeof m == "function" || m === n || m === a || k || m === i || m === u || m === d || O || m === p || D || A || I || typeof m == "object" && m !== null && (m.$$typeof === f || m.$$typeof === h || m.$$typeof === o || m.$$typeof === l || m.$$typeof === c || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      m.$$typeof === x || m.getModuleId !== void 0));
    }
    function b(m, N, M) {
      var F = m.displayName;
      if (F)
        return F;
      var W = N.displayName || N.name || "";
      return W !== "" ? M + "(" + W + ")" : M;
    }
    function L(m) {
      return m.displayName || "Context";
    }
    function G(m) {
      if (m == null)
        return null;
      if (typeof m.tag == "number" && w("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof m == "function")
        return m.displayName || m.name || null;
      if (typeof m == "string")
        return m;
      switch (m) {
        case n:
          return "Fragment";
        case r:
          return "Portal";
        case a:
          return "Profiler";
        case i:
          return "StrictMode";
        case u:
          return "Suspense";
        case d:
          return "SuspenseList";
      }
      if (typeof m == "object")
        switch (m.$$typeof) {
          case l:
            var N = m;
            return L(N) + ".Consumer";
          case o:
            var M = m;
            return L(M._context) + ".Provider";
          case c:
            return b(m, m.render, "ForwardRef");
          case h:
            var F = m.displayName || null;
            return F !== null ? F : G(m.type) || "Memo";
          case f: {
            var W = m, K = W._payload, z = W._init;
            try {
              return G(z(K));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var se = Object.assign, T = 0, U, $, B, q, ie, Ne, v;
    function g() {
    }
    g.__reactDisabledLog = !0;
    function R() {
      {
        if (T === 0) {
          U = console.log, $ = console.info, B = console.warn, q = console.error, ie = console.group, Ne = console.groupCollapsed, v = console.groupEnd;
          var m = {
            configurable: !0,
            enumerable: !0,
            value: g,
            writable: !0
          };
          Object.defineProperties(console, {
            info: m,
            log: m,
            warn: m,
            error: m,
            group: m,
            groupCollapsed: m,
            groupEnd: m
          });
        }
        T++;
      }
    }
    function X() {
      {
        if (T--, T === 0) {
          var m = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: se({}, m, {
              value: U
            }),
            info: se({}, m, {
              value: $
            }),
            warn: se({}, m, {
              value: B
            }),
            error: se({}, m, {
              value: q
            }),
            group: se({}, m, {
              value: ie
            }),
            groupCollapsed: se({}, m, {
              value: Ne
            }),
            groupEnd: se({}, m, {
              value: v
            })
          });
        }
        T < 0 && w("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var de = j.ReactCurrentDispatcher, ye;
    function kt(m, N, M) {
      {
        if (ye === void 0)
          try {
            throw Error();
          } catch (W) {
            var F = W.stack.trim().match(/\n( *(at )?)/);
            ye = F && F[1] || "";
          }
        return `
` + ye + m;
      }
    }
    var st = !1, Jt;
    {
      var Va = typeof WeakMap == "function" ? WeakMap : Map;
      Jt = new Va();
    }
    function tn(m, N) {
      if (!m || st)
        return "";
      {
        var M = Jt.get(m);
        if (M !== void 0)
          return M;
      }
      var F;
      st = !0;
      var W = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var K;
      K = de.current, de.current = null, R();
      try {
        if (N) {
          var z = function() {
            throw Error();
          };
          if (Object.defineProperty(z.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(z, []);
            } catch (me) {
              F = me;
            }
            Reflect.construct(m, [], z);
          } else {
            try {
              z.call();
            } catch (me) {
              F = me;
            }
            m.call(z.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (me) {
            F = me;
          }
          m();
        }
      } catch (me) {
        if (me && F && typeof me.stack == "string") {
          for (var Y = me.stack.split(`
`), ue = F.stack.split(`
`), ee = Y.length - 1, re = ue.length - 1; ee >= 1 && re >= 0 && Y[ee] !== ue[re]; )
            re--;
          for (; ee >= 1 && re >= 0; ee--, re--)
            if (Y[ee] !== ue[re]) {
              if (ee !== 1 || re !== 1)
                do
                  if (ee--, re--, re < 0 || Y[ee] !== ue[re]) {
                    var be = `
` + Y[ee].replace(" at new ", " at ");
                    return m.displayName && be.includes("<anonymous>") && (be = be.replace("<anonymous>", m.displayName)), typeof m == "function" && Jt.set(m, be), be;
                  }
                while (ee >= 1 && re >= 0);
              break;
            }
        }
      } finally {
        st = !1, de.current = K, X(), Error.prepareStackTrace = W;
      }
      var nt = m ? m.displayName || m.name : "", We = nt ? kt(nt) : "";
      return typeof m == "function" && Jt.set(m, We), We;
    }
    function Fa(m, N, M) {
      return tn(m, !1);
    }
    function Ia(m) {
      var N = m.prototype;
      return !!(N && N.isReactComponent);
    }
    function Qt(m, N, M) {
      if (m == null)
        return "";
      if (typeof m == "function")
        return tn(m, Ia(m));
      if (typeof m == "string")
        return kt(m);
      switch (m) {
        case u:
          return kt("Suspense");
        case d:
          return kt("SuspenseList");
      }
      if (typeof m == "object")
        switch (m.$$typeof) {
          case c:
            return Fa(m.render);
          case h:
            return Qt(m.type, N, M);
          case f: {
            var F = m, W = F._payload, K = F._init;
            try {
              return Qt(K(W), N, M);
            } catch {
            }
          }
        }
      return "";
    }
    var Tt = Object.prototype.hasOwnProperty, sn = {}, rn = j.ReactDebugCurrentFrame;
    function es(m) {
      if (m) {
        var N = m._owner, M = Qt(m.type, m._source, N ? N.type : null);
        rn.setExtraStackFrame(M);
      } else
        rn.setExtraStackFrame(null);
    }
    function Oa(m, N, M, F, W) {
      {
        var K = Function.call.bind(Tt);
        for (var z in m)
          if (K(m, z)) {
            var Y = void 0;
            try {
              if (typeof m[z] != "function") {
                var ue = Error((F || "React class") + ": " + M + " type `" + z + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof m[z] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw ue.name = "Invariant Violation", ue;
              }
              Y = m[z](N, z, F, M, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (ee) {
              Y = ee;
            }
            Y && !(Y instanceof Error) && (es(W), w("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", F || "React class", M, z, typeof Y), es(null)), Y instanceof Error && !(Y.message in sn) && (sn[Y.message] = !0, es(W), w("Failed %s type: %s", M, Y.message), es(null));
          }
      }
    }
    var Ya = Array.isArray;
    function As(m) {
      return Ya(m);
    }
    function Ba(m) {
      {
        var N = typeof Symbol == "function" && Symbol.toStringTag, M = N && m[Symbol.toStringTag] || m.constructor.name || "Object";
        return M;
      }
    }
    function za(m) {
      try {
        return nn(m), !1;
      } catch {
        return !0;
      }
    }
    function nn(m) {
      return "" + m;
    }
    function on(m) {
      if (za(m))
        return w("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Ba(m)), nn(m);
    }
    var an = j.ReactCurrentOwner, Ua = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, ln, cn;
    function $a(m) {
      if (Tt.call(m, "ref")) {
        var N = Object.getOwnPropertyDescriptor(m, "ref").get;
        if (N && N.isReactWarning)
          return !1;
      }
      return m.ref !== void 0;
    }
    function Wa(m) {
      if (Tt.call(m, "key")) {
        var N = Object.getOwnPropertyDescriptor(m, "key").get;
        if (N && N.isReactWarning)
          return !1;
      }
      return m.key !== void 0;
    }
    function Ha(m, N) {
      typeof m.ref == "string" && an.current;
    }
    function Ga(m, N) {
      {
        var M = function() {
          ln || (ln = !0, w("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", N));
        };
        M.isReactWarning = !0, Object.defineProperty(m, "key", {
          get: M,
          configurable: !0
        });
      }
    }
    function Ka(m, N) {
      {
        var M = function() {
          cn || (cn = !0, w("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", N));
        };
        M.isReactWarning = !0, Object.defineProperty(m, "ref", {
          get: M,
          configurable: !0
        });
      }
    }
    var qa = function(m, N, M, F, W, K, z) {
      var Y = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: t,
        // Built-in properties that belong on the element
        type: m,
        key: N,
        ref: M,
        props: z,
        // Record the component responsible for creating this element.
        _owner: K
      };
      return Y._store = {}, Object.defineProperty(Y._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(Y, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: F
      }), Object.defineProperty(Y, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: W
      }), Object.freeze && (Object.freeze(Y.props), Object.freeze(Y)), Y;
    };
    function Xa(m, N, M, F, W) {
      {
        var K, z = {}, Y = null, ue = null;
        M !== void 0 && (on(M), Y = "" + M), Wa(N) && (on(N.key), Y = "" + N.key), $a(N) && (ue = N.ref, Ha(N, W));
        for (K in N)
          Tt.call(N, K) && !Ua.hasOwnProperty(K) && (z[K] = N[K]);
        if (m && m.defaultProps) {
          var ee = m.defaultProps;
          for (K in ee)
            z[K] === void 0 && (z[K] = ee[K]);
        }
        if (Y || ue) {
          var re = typeof m == "function" ? m.displayName || m.name || "Unknown" : m;
          Y && Ga(z, re), ue && Ka(z, re);
        }
        return qa(m, Y, ue, W, F, an.current, z);
      }
    }
    var Es = j.ReactCurrentOwner, dn = j.ReactDebugCurrentFrame;
    function rt(m) {
      if (m) {
        var N = m._owner, M = Qt(m.type, m._source, N ? N.type : null);
        dn.setExtraStackFrame(M);
      } else
        dn.setExtraStackFrame(null);
    }
    var Ms;
    Ms = !1;
    function Ds(m) {
      return typeof m == "object" && m !== null && m.$$typeof === t;
    }
    function un() {
      {
        if (Es.current) {
          var m = G(Es.current.type);
          if (m)
            return `

Check the render method of \`` + m + "`.";
        }
        return "";
      }
    }
    function Za(m) {
      return "";
    }
    var hn = {};
    function Ja(m) {
      {
        var N = un();
        if (!N) {
          var M = typeof m == "string" ? m : m.displayName || m.name;
          M && (N = `

Check the top-level render call using <` + M + ">.");
        }
        return N;
      }
    }
    function mn(m, N) {
      {
        if (!m._store || m._store.validated || m.key != null)
          return;
        m._store.validated = !0;
        var M = Ja(N);
        if (hn[M])
          return;
        hn[M] = !0;
        var F = "";
        m && m._owner && m._owner !== Es.current && (F = " It was passed a child from " + G(m._owner.type) + "."), rt(m), w('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', M, F), rt(null);
      }
    }
    function fn(m, N) {
      {
        if (typeof m != "object")
          return;
        if (As(m))
          for (var M = 0; M < m.length; M++) {
            var F = m[M];
            Ds(F) && mn(F, N);
          }
        else if (Ds(m))
          m._store && (m._store.validated = !0);
        else if (m) {
          var W = C(m);
          if (typeof W == "function" && W !== m.entries)
            for (var K = W.call(m), z; !(z = K.next()).done; )
              Ds(z.value) && mn(z.value, N);
        }
      }
    }
    function Qa(m) {
      {
        var N = m.type;
        if (N == null || typeof N == "string")
          return;
        var M;
        if (typeof N == "function")
          M = N.propTypes;
        else if (typeof N == "object" && (N.$$typeof === c || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        N.$$typeof === h))
          M = N.propTypes;
        else
          return;
        if (M) {
          var F = G(N);
          Oa(M, m.props, "prop", F, m);
        } else if (N.PropTypes !== void 0 && !Ms) {
          Ms = !0;
          var W = G(N);
          w("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", W || "Unknown");
        }
        typeof N.getDefaultProps == "function" && !N.getDefaultProps.isReactClassApproved && w("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function el(m) {
      {
        for (var N = Object.keys(m.props), M = 0; M < N.length; M++) {
          var F = N[M];
          if (F !== "children" && F !== "key") {
            rt(m), w("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", F), rt(null);
            break;
          }
        }
        m.ref !== null && (rt(m), w("Invalid attribute `ref` supplied to `React.Fragment`."), rt(null));
      }
    }
    var gn = {};
    function pn(m, N, M, F, W, K) {
      {
        var z = E(m);
        if (!z) {
          var Y = "";
          (m === void 0 || typeof m == "object" && m !== null && Object.keys(m).length === 0) && (Y += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var ue = Za();
          ue ? Y += ue : Y += un();
          var ee;
          m === null ? ee = "null" : As(m) ? ee = "array" : m !== void 0 && m.$$typeof === t ? (ee = "<" + (G(m.type) || "Unknown") + " />", Y = " Did you accidentally export a JSX literal instead of a component?") : ee = typeof m, w("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", ee, Y);
        }
        var re = Xa(m, N, M, W, K);
        if (re == null)
          return re;
        if (z) {
          var be = N.children;
          if (be !== void 0)
            if (F)
              if (As(be)) {
                for (var nt = 0; nt < be.length; nt++)
                  fn(be[nt], m);
                Object.freeze && Object.freeze(be);
              } else
                w("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              fn(be, m);
        }
        if (Tt.call(N, "key")) {
          var We = G(m), me = Object.keys(N).filter(function(ol) {
            return ol !== "key";
          }), Rs = me.length > 0 ? "{key: someKey, " + me.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!gn[We + Rs]) {
            var il = me.length > 0 ? "{" + me.join(": ..., ") + ": ...}" : "{}";
            w(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, Rs, We, il, We), gn[We + Rs] = !0;
          }
        }
        return m === n ? el(re) : Qa(re), re;
      }
    }
    function tl(m, N, M) {
      return pn(m, N, M, !0);
    }
    function sl(m, N, M) {
      return pn(m, N, M, !1);
    }
    var rl = sl, nl = tl;
    Ct.Fragment = n, Ct.jsx = rl, Ct.jsxs = nl;
  }()), Ct;
}
process.env.NODE_ENV === "production" ? Xs.exports = Ol() : Xs.exports = Yl();
var s = Xs.exports;
function pe(...e) {
  return Hi(Wi(e));
}
const Bl = Ue(void 0), Zi = () => {
  const e = le(Bl);
  if (e === void 0)
    throw new Error("useAuth must be used within an AuthProvider");
  return e;
}, Me = {}, Zs = typeof window < "u", Ot = (Me == null ? void 0 : Me.VITE_SUPABASE_URL) || process.env.VITE_SUPABASE_URL || "", Ss = (Me == null ? void 0 : Me.VITE_SUPABASE_ANON_KEY) || process.env.VITE_SUPABASE_ANON_KEY || "";
console.log("DEBUG: supabaseUrl (raw):", Ot);
console.log("DEBUG: supabaseAnonKey (raw):", Ss);
((Me == null ? void 0 : Me.VITE_DEBUG) === "true" || process.env.VITE_DEBUG === "true") && (console.log("Supabase URL:", Ot ? "✅ Set" : "❌ Missing"), console.log("Supabase Anon Key:", Ss ? "✅ Set" : "❌ Missing"));
if ((!Ot || !Ss) && Zs) {
  const e = `
    Missing Supabase environment variables.
    Please check your .env file and ensure the following are set:
    - VITE_SUPABASE_URL
    - VITE_SUPABASE_ANON_KEY
  `;
  throw console.error(e), new Error(e);
}
let ge;
var Yi;
try {
  ge = pl(Ot, Ss, {
    auth: {
      persistSession: !0,
      autoRefreshToken: !0,
      detectSessionInUrl: !0,
      storage: Zs ? window.localStorage : void 0
    }
  }), typeof process < "u" && ((Yi = process.env) == null ? void 0 : Yi.NODE_ENV) === "development" && Zs && console.log("Supabase client initialized with URL:", Ot);
} catch (e) {
  throw console.error("Error initializing Supabase client:", e), e;
}
const Ji = Ue(void 0), Qi = () => {
  const e = le(Ji);
  if (!e)
    throw new Error("useAdminSideNav must be used within AdminSideNavProvider");
  return e;
}, qf = ({ children: e }) => {
  const [t, r] = _(!1), n = () => {
    console.log("AdminSideNav: toggle called, current state:", t), r(!t);
  }, i = () => {
    console.log("AdminSideNav: close called, current state:", t), r(!1);
  };
  return /* @__PURE__ */ s.jsx(Ji.Provider, { value: { isOpen: t, toggle: n, close: i }, children: e });
}, zl = [
  { name: "Dashboard", href: "/account/admin", icon: xl },
  { name: "Products", href: "/account/admin/products", icon: Ze },
  { name: "Orders", href: "/account/admin/orders", icon: et },
  { name: "Inventory", href: "/account/admin/inventory", icon: yl },
  { name: "Analytics", href: "/account/admin/analytics", icon: ds },
  { name: "Posts", href: "/account/admin/posts", icon: Ye },
  { name: "Works", href: "/account/admin/works", icon: xs },
  { name: "Timeline", href: "/account/admin/timeline/events", icon: vr },
  { name: "Users", href: "/account/admin/users", icon: ys },
  { name: "Beta Applications", href: "/account/admin/beta-applications", icon: ys },
  { name: "Webhooks", href: "/account/admin/webhooks", icon: bl },
  { name: "Media", href: "/account/admin/media", icon: Ie },
  { name: "Settings", href: "/account/admin/settings", icon: wr }
], Xf = () => {
  const { isOpen: e, toggle: t } = Qi();
  return e ? null : /* @__PURE__ */ s.jsx(
    "button",
    {
      onClick: t,
      className: "fixed top-4 left-4 z-[10000] p-3 rounded-lg bg-slate-800 border border-amber-500/50 shadow-xl hover:bg-slate-700 hover:border-amber-400 text-amber-300 hover:text-amber-200 transition-all duration-300 group",
      "aria-label": "Toggle navigation menu",
      children: /* @__PURE__ */ s.jsx(wl, { size: 20, className: "transition-transform duration-200 group-hover:scale-110" })
    }
  );
}, Zf = () => {
  var l, c;
  const { isOpen: e, close: t } = Qi(), r = $i(), { user: n, userProfile: i } = Zi(), a = async () => {
    await ge.auth.signOut(), r("/");
  }, o = () => {
    console.log("AdminSideNav: handleLinkClick called"), t();
  };
  return xe(() => {
    const u = (d) => {
      d.key === "Escape" && e && (console.log("AdminSideNav: Escape key pressed"), t());
    };
    return document.addEventListener("keydown", u), () => document.removeEventListener("keydown", u);
  }, [e, t]), e ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsx(
      "div",
      {
        className: "fixed inset-0 bg-black/50 z-[9998]",
        onClick: t
      }
    ),
    /* @__PURE__ */ s.jsx(
      "aside",
      {
        className: "fixed top-0 left-0 z-[9999] h-screen w-80 border-r border-amber-500 shadow-2xl animate-in slide-in-from-left duration-300",
        style: { backgroundColor: "#0f172a", backdropFilter: "none" },
        children: /* @__PURE__ */ s.jsxs("div", { className: "h-full flex flex-col relative", style: { backgroundColor: "#0f172a", backdropFilter: "none" }, children: [
          /* @__PURE__ */ s.jsx("div", { className: "absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600" }),
          /* @__PURE__ */ s.jsx("div", { className: "p-6 border-b border-amber-500", style: { backgroundColor: "#1e293b", backdropFilter: "none" }, children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "flex items-center space-x-3", children: [
              /* @__PURE__ */ s.jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg", children: /* @__PURE__ */ s.jsx("span", { className: "text-slate-900 font-bold text-lg", children: "Z" }) }),
              /* @__PURE__ */ s.jsxs("div", { children: [
                /* @__PURE__ */ s.jsx("h2", { className: "text-xl font-bold text-amber-300", children: "Zoroaster" }),
                /* @__PURE__ */ s.jsx("p", { className: "text-xs text-slate-400 font-medium", children: "Admin Panel" })
              ] })
            ] }),
            /* @__PURE__ */ s.jsx(
              "button",
              {
                onClick: t,
                className: "p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-amber-300 transition-colors duration-200",
                "aria-label": "Close menu",
                children: /* @__PURE__ */ s.jsx(Ee, { size: 20, className: "transition-transform duration-200 hover:rotate-90" })
              }
            )
          ] }) }),
          /* @__PURE__ */ s.jsx("nav", { className: "flex-1 overflow-y-auto py-4 px-3", style: { backgroundColor: "#0f172a", backdropFilter: "none" }, children: /* @__PURE__ */ s.jsx("ul", { className: "space-y-2", children: zl.map((u) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx(
            cs,
            {
              to: u.href,
              end: u.href === "/account/admin",
              onClick: o,
              className: ({ isActive: d }) => pe(
                "group flex items-center p-3 rounded-xl transition-all duration-200 relative overflow-hidden space-x-3",
                d ? "bg-amber-600 text-amber-100 border border-amber-500 shadow-md" : "text-slate-300 hover:bg-slate-700 hover:text-amber-200 border border-transparent hover:border-amber-500"
              ),
              children: ({ isActive: d }) => /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
                d && /* @__PURE__ */ s.jsx("div", { className: "absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-r" }),
                /* @__PURE__ */ s.jsx(
                  u.icon,
                  {
                    size: 20,
                    className: pe(
                      "flex-shrink-0 transition-all duration-200",
                      d ? "text-amber-400 drop-shadow-sm" : "group-hover:text-amber-300"
                    )
                  }
                ),
                /* @__PURE__ */ s.jsx("span", { className: pe(
                  "font-medium transition-all duration-200",
                  d ? "text-amber-200" : "group-hover:text-amber-200"
                ), children: u.name })
              ] })
            }
          ) }, u.name)) }) }),
          /* @__PURE__ */ s.jsx("div", { className: "p-4 border-t border-amber-500", style: { backgroundColor: "#1e293b", backdropFilter: "none" }, children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "flex items-center space-x-3", children: [
              /* @__PURE__ */ s.jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-slate-900 font-bold shadow-lg ring-2 ring-amber-400/30", children: ((l = i == null ? void 0 : i.display_name) == null ? void 0 : l.charAt(0)) || ((c = n == null ? void 0 : n.email) == null ? void 0 : c.charAt(0).toUpperCase()) }),
              /* @__PURE__ */ s.jsxs("div", { children: [
                /* @__PURE__ */ s.jsx("p", { className: "text-sm font-semibold text-amber-200 truncate max-w-[160px]", children: (i == null ? void 0 : i.display_name) || "Admin User" }),
                /* @__PURE__ */ s.jsx("p", { className: "text-xs text-slate-400 truncate max-w-[160px]", children: n == null ? void 0 : n.email })
              ] })
            ] }),
            /* @__PURE__ */ s.jsx(
              "button",
              {
                onClick: a,
                className: "p-2 rounded-lg hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/10 text-slate-400 hover:text-red-300 transition-all duration-200 border border-transparent hover:border-red-500/30",
                title: "Sign out",
                children: /* @__PURE__ */ s.jsx(vl, { size: 18 })
              }
            )
          ] }) })
        ] })
      }
    )
  ] }) : null;
}, Jf = ({ children: e }) => {
  var o, l;
  const [t, r] = _(!0), [n, i] = _({ isAuthenticated: !1, isAdmin: !1 }), a = ml();
  return xe(() => {
    (async () => {
      console.log("⏳ [AdminProtectedRoute] Checking session and admin status...");
      const { data: { session: u }, error: d } = await ge.auth.getSession();
      if (d || !u) {
        console.log("🔒 [AdminProtectedRoute] No authenticated session found."), i({ isAuthenticated: !1, isAdmin: !1 }), r(!1);
        return;
      }
      console.log("✅ [AdminProtectedRoute] Session found. User:", u.user.email);
      const { data: h, error: f } = await ge.rpc("is_admin");
      f && console.error("❌ [AdminProtectedRoute] Error calling is_admin RPC:", f);
      const y = {
        isAuthenticated: !0,
        isAdmin: h === !0,
        user: u.user
      };
      console.log("✅ [AdminProtectedRoute] Final auth state:", y), i(y), r(!1);
    })();
  }, []), t ? /* @__PURE__ */ s.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-900 text-white", children: /* @__PURE__ */ s.jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ s.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto" }),
    /* @__PURE__ */ s.jsx("p", { className: "mt-4", children: "Verifying Admin Privileges..." })
  ] }) }) : n.isAuthenticated ? n.isAdmin ? /* @__PURE__ */ s.jsx(s.Fragment, { children: e }) : (console.log("❌ [AdminProtectedRoute] Access Denied. User is not an admin."), /* @__PURE__ */ s.jsx("div", { className: "min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 text-white", children: /* @__PURE__ */ s.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ s.jsxs("div", { className: "bg-gray-800 shadow-lg rounded-lg overflow-hidden", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "bg-red-600 p-6", children: [
      /* @__PURE__ */ s.jsx("h1", { className: "text-2xl font-bold", children: "Access Denied" }),
      /* @__PURE__ */ s.jsx("p", { className: "text-red-100", children: "You do not have the necessary permissions to view this page." })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "p-6 space-y-4", children: [
      /* @__PURE__ */ s.jsx("p", { children: "The page you are trying to access is restricted to administrators only." }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("h2", { className: "text-lg font-medium text-gray-300 mb-2", children: "Your Account Details" }),
        /* @__PURE__ */ s.jsxs("dl", { className: "bg-gray-700/50 rounded-lg p-4 space-y-2 text-sm", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ s.jsx("dt", { className: "text-gray-400", children: "User ID" }),
            /* @__PURE__ */ s.jsx("dd", { className: "font-mono", children: ((o = n.user) == null ? void 0 : o.id) || "N/A" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ s.jsx("dt", { className: "text-gray-400", children: "Email" }),
            /* @__PURE__ */ s.jsx("dd", { children: ((l = n.user) == null ? void 0 : l.email) || "N/A" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ s.jsx("dt", { className: "text-gray-400", children: "Admin Status" }),
            /* @__PURE__ */ s.jsx("dd", { className: "font-semibold text-red-400", children: "Not an Admin" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsx("p", { children: "If you believe this is an error, please contact support." }),
      /* @__PURE__ */ s.jsx("div", { className: "pt-4", children: /* @__PURE__ */ s.jsx("a", { href: "/", className: "px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700", children: "Go to Homepage" }) })
    ] })
  ] }) }) })) : (console.log("🛑 [AdminProtectedRoute] Not authenticated, redirecting to login."), /* @__PURE__ */ s.jsx(fl, { to: "/login", state: { from: a }, replace: !0 }));
}, He = ({ title: e, value: t, icon: r, color: n, trend: i }) => /* @__PURE__ */ s.jsx("div", { className: "bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow", children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between", children: [
  /* @__PURE__ */ s.jsxs("div", { children: [
    /* @__PURE__ */ s.jsx("p", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: e }),
    /* @__PURE__ */ s.jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: t }),
    i && /* @__PURE__ */ s.jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: i })
  ] }),
  /* @__PURE__ */ s.jsx("div", { className: `p-3 rounded-lg bg-${n}-100 dark:bg-${n}-900/20`, children: /* @__PURE__ */ s.jsx(r, { className: `w-6 h-6 text-${n}-600 dark:text-${n}-400` }) })
] }) }), Ae = ({ title: e, description: t, icon: r, href: n, color: i }) => /* @__PURE__ */ s.jsx(
  "a",
  {
    href: n,
    className: "block bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all hover:border-blue-300 dark:hover:border-blue-600 group",
    children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center space-x-4", children: [
      /* @__PURE__ */ s.jsx("div", { className: `p-3 rounded-lg bg-${i}-100 dark:bg-${i}-900/20 group-hover:bg-${i}-200 dark:group-hover:bg-${i}-900/40 transition-colors`, children: /* @__PURE__ */ s.jsx(r, { className: `w-6 h-6 text-${i}-600 dark:text-${i}-400` }) }),
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsx("h3", { className: "font-semibold text-gray-900 dark:text-white", children: e }),
        /* @__PURE__ */ s.jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: t })
      ] })
    ] })
  }
), Qf = () => {
  const [e, t] = _(null), [r, n] = _(!0), [i, a] = _(null);
  return xe(() => {
    (async () => {
      try {
        const [
          { count: l },
          { count: c },
          { data: u },
          { data: d },
          { count: h },
          { count: f },
          { count: p }
        ] = await Promise.all([
          ge.from("profiles").select("id", { count: "exact", head: !0 }),
          ge.from("subscriptions").select("id", { count: "exact", head: !0 }).eq("status", "active"),
          ge.from("pages").select("view_count"),
          ge.from("orders").select("total_amount, status").eq("status", "completed"),
          ge.from("products").select("id", { count: "exact", head: !0 }).eq("active", !0),
          ge.from("orders").select("id", { count: "exact", head: !0 }),
          ge.from("orders").select("id", { count: "exact", head: !0 }).eq("status", "pending")
        ]), y = (u == null ? void 0 : u.reduce((C, j) => C + (j.view_count || 0), 0)) || 0, S = (d == null ? void 0 : d.reduce((C, j) => C + j.total_amount, 0)) || 0;
        t({
          totalUsers: l || 0,
          activeSubscribers: c || 0,
          totalRevenue: S,
          totalViews: y,
          totalProducts: h || 0,
          totalOrders: f || 0,
          pendingOrders: p || 0
        });
      } catch (l) {
        a(l instanceof Error ? l.message : "Failed to fetch dashboard metrics");
      } finally {
        n(!1);
      }
    })();
  }, []), r ? /* @__PURE__ */ s.jsx("div", { className: "p-6 space-y-6", children: /* @__PURE__ */ s.jsxs("div", { className: "animate-pulse space-y-6", children: [
    /* @__PURE__ */ s.jsx("div", { className: "h-8 bg-gray-200 dark:bg-gray-700 rounded w-64" }),
    /* @__PURE__ */ s.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: [...Array(4)].map((o, l) => /* @__PURE__ */ s.jsx("div", { className: "h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" }, l)) })
  ] }) }) : i ? /* @__PURE__ */ s.jsx("div", { className: "p-6", children: /* @__PURE__ */ s.jsx("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4", children: /* @__PURE__ */ s.jsxs("div", { className: "flex", children: [
    /* @__PURE__ */ s.jsx(It, { className: "w-5 h-5 text-red-600 dark:text-red-400" }),
    /* @__PURE__ */ s.jsxs("div", { className: "ml-3", children: [
      /* @__PURE__ */ s.jsx("h3", { className: "text-sm font-medium text-red-800 dark:text-red-200", children: "Error Loading Dashboard" }),
      /* @__PURE__ */ s.jsx("p", { className: "text-sm text-red-700 dark:text-red-300 mt-1", children: i })
    ] })
  ] }) }) }) : /* @__PURE__ */ s.jsxs("div", { className: "p-6 space-y-6", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "border-b border-gray-200 dark:border-gray-700 pb-6", children: [
      /* @__PURE__ */ s.jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white", children: "Welcome to Zoroasterverse Admin" }),
      /* @__PURE__ */ s.jsx("p", { className: "text-gray-600 dark:text-gray-300 mt-2", children: "Manage your worldbuilding platform with powerful admin tools" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ s.jsx(
        He,
        {
          title: "Total Users",
          value: (e == null ? void 0 : e.totalUsers.toLocaleString()) ?? "0",
          icon: ys,
          color: "blue",
          trend: "↑ Growing community"
        }
      ),
      /* @__PURE__ */ s.jsx(
        He,
        {
          title: "Active Subscribers",
          value: (e == null ? void 0 : e.activeSubscribers.toLocaleString()) ?? "0",
          icon: xn,
          color: "green",
          trend: "Premium members"
        }
      ),
      /* @__PURE__ */ s.jsx(
        He,
        {
          title: "Total Revenue",
          value: `$${(e == null ? void 0 : e.totalRevenue.toFixed(2)) ?? "0.00"}`,
          icon: jr,
          color: "yellow",
          trend: "All-time earnings"
        }
      ),
      /* @__PURE__ */ s.jsx(
        He,
        {
          title: "Page Views",
          value: (e == null ? void 0 : e.totalViews.toLocaleString()) ?? "0",
          icon: tt,
          color: "purple",
          trend: "Content engagement"
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ s.jsx(
        He,
        {
          title: "Active Products",
          value: (e == null ? void 0 : e.totalProducts.toLocaleString()) ?? "0",
          icon: Ze,
          color: "indigo",
          trend: "Available for sale"
        }
      ),
      /* @__PURE__ */ s.jsx(
        He,
        {
          title: "Total Orders",
          value: (e == null ? void 0 : e.totalOrders.toLocaleString()) ?? "0",
          icon: et,
          color: "green",
          trend: "All-time orders"
        }
      ),
      /* @__PURE__ */ s.jsx(
        He,
        {
          title: "Pending Orders",
          value: (e == null ? void 0 : e.pendingOrders.toLocaleString()) ?? "0",
          icon: It,
          color: "orange",
          trend: "Requires attention"
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ s.jsx("h2", { className: "text-xl font-bold text-gray-900 dark:text-white", children: "Quick Actions" }),
      /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ s.jsx(
          Ae,
          {
            title: "Manage Users",
            description: "View, edit, and manage user accounts",
            icon: ys,
            href: "/account/admin/users",
            color: "blue"
          }
        ),
        /* @__PURE__ */ s.jsx(
          Ae,
          {
            title: "Content Management",
            description: "Create and manage posts and pages",
            icon: Ye,
            href: "/account/admin/posts",
            color: "green"
          }
        ),
        /* @__PURE__ */ s.jsx(
          Ae,
          {
            title: "Product Catalog",
            description: "Manage your store products",
            icon: Ze,
            href: "/account/admin/products",
            color: "purple"
          }
        ),
        /* @__PURE__ */ s.jsx(
          Ae,
          {
            title: "Order Processing",
            description: "View and process customer orders",
            icon: et,
            href: "/account/admin/orders",
            color: "orange"
          }
        ),
        /* @__PURE__ */ s.jsx(
          Ae,
          {
            title: "Beta Applications",
            description: "Review beta reader applications",
            icon: xn,
            href: "/account/admin/beta-applications",
            color: "indigo"
          }
        ),
        /* @__PURE__ */ s.jsx(
          Ae,
          {
            title: "Timeline Events",
            description: "Manage worldbuilding timeline",
            icon: vr,
            href: "/account/admin/timeline/events",
            color: "red"
          }
        ),
        /* @__PURE__ */ s.jsx(
          Ae,
          {
            title: "Works & Chapters",
            description: "Manage your literary works",
            icon: xs,
            href: "/account/admin/works",
            color: "teal"
          }
        ),
        /* @__PURE__ */ s.jsx(
          Ae,
          {
            title: "Analytics",
            description: "View detailed performance metrics",
            icon: it,
            href: "/account/admin/analytics",
            color: "pink"
          }
        ),
        /* @__PURE__ */ s.jsx(
          Ae,
          {
            title: "Settings",
            description: "Configure admin preferences",
            icon: wr,
            href: "/account/admin/settings",
            color: "gray"
          }
        )
      ] })
    ] })
  ] });
}, Ul = "_zoroHeader_6lzsp_2", $l = "_logo_6lzsp_16", Wl = "_navbar_6lzsp_23", Hl = "_navMenu_6lzsp_27", Gl = "_navLink_6lzsp_39", Kl = "_dropdownMenu_6lzsp_53", ql = "_dropdownMenuItem_6lzsp_73", Xl = "_dropdown_6lzsp_53", Zl = "_headerControls_6lzsp_96", Jl = "_searchForm_6lzsp_121", Ql = "_themeToggle_6lzsp_165", ec = "_icon_6lzsp_186", tc = "_iconSun_6lzsp_197", sc = "_iconMoon_6lzsp_203", ae = {
  zoroHeader: Ul,
  logo: $l,
  navbar: Wl,
  navMenu: Hl,
  navLink: Gl,
  dropdownMenu: Kl,
  dropdownMenuItem: ql,
  dropdown: Xl,
  headerControls: Zl,
  searchForm: Jl,
  themeToggle: Ql,
  icon: ec,
  iconSun: tc,
  iconMoon: sc
}, Tn = "zoro-theme", rc = () => {
  const [e, t] = _(() => {
    if (typeof window < "u") {
      const n = localStorage.getItem(Tn), i = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return n ?? (i ? "dark" : "light");
    }
    return "dark";
  });
  xe(() => {
    const n = window.document.documentElement;
    n.setAttribute("data-theme", e), localStorage.setItem(Tn, e), e === "dark" ? (n.classList.add("dark"), n.classList.remove("light")) : (n.classList.add("light"), n.classList.remove("dark"));
  }, [e]);
  const r = () => {
    t((n) => n === "dark" ? "light" : "dark");
  };
  return s.jsxs("button", { id: "theme-toggle", className: ae.themeToggle, "aria-label": "Toggle dark mode", "aria-pressed": e === "dark" ? "true" : "false", title: e === "dark" ? "Switch to light mode" : "Switch to dark mode", onClick: r, children: [s.jsxs("svg", { className: `${ae.icon} ${ae.iconSun}`, viewBox: "0 0 24 24", width: "22", height: "22", "aria-hidden": "true", children: [s.jsx("circle", { cx: "12", cy: "12", r: "4", fill: "currentColor" }), s.jsxs("g", { stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: [s.jsx("line", { x1: "12", y1: "2", x2: "12", y2: "5" }), s.jsx("line", { x1: "12", y1: "19", x2: "12", y2: "22" }), s.jsx("line", { x1: "2", y1: "12", x2: "5", y2: "12" }), s.jsx("line", { x1: "19", y1: "12", x2: "22", y2: "12" }), s.jsx("line", { x1: "4.2", y1: "4.2", x2: "6.3", y2: "6.3" }), s.jsx("line", { x1: "17.7", y1: "17.7", x2: "19.8", y2: "19.8" }), s.jsx("line", { x1: "4.2", y1: "19.8", x2: "6.3", y2: "17.7" }), s.jsx("line", { x1: "17.7", y1: "6.3", x2: "19.8", y2: "4.2" })] })] }), s.jsx("svg", { className: `${ae.icon} ${ae.iconMoon}`, viewBox: "0 0 24 24", width: "22", height: "22", "aria-hidden": "true", children: s.jsx("path", { d: `M21 14.5a9 9 0 1 1-8.5-12
                 a8 8 0 0 0 8.5 12z`, fill: "currentColor" }) })] });
}, nc = ({
  isAuthenticated: e = !1,
  betaApplicationStatus: t = "none",
  onLogout: r
}) => {
  const [n, i] = _(!1), a = () => {
    r && r();
  }, o = [
    { name: "Home", path: "/" },
    {
      name: "Explore",
      // New parent link
      path: "#",
      // Placeholder path for parent dropdown
      children: [
        // Removed Store and Subscriptions
        { name: "Library", path: "/library" },
        { name: "Wiki", path: "/wiki" },
        { name: "Timelines", path: "/timelines" },
        { name: "Characters", path: "/characters" },
        { name: "Blog", path: "/blog" }
      ]
    },
    { name: "Beta Program", path: "/beta/application" }
    // Top-level
  ];
  if (e) {
    const l = [];
    l.push({ name: "Store", path: "/store" }), l.push({ name: "Subscriptions", path: "/subscriptions" }), t === "accepted" && l.push({ name: "Beta Portal", path: "/beta/portal" }), l.push({ name: "My Account", path: "/account" }), o.push({ name: "Account", path: "#", children: l }), o.push({ name: "Logout", path: "#", onClick: a });
  } else
    o.push({ name: "Login", path: "/login" });
  return /* @__PURE__ */ s.jsxs("header", { className: ae.zoroHeader, children: [
    /* @__PURE__ */ s.jsx("div", { className: ae.logo, children: /* @__PURE__ */ s.jsx(cs, { to: "/", children: /* @__PURE__ */ s.jsx("h1", { children: "Zoroasterverse" }) }) }),
    /* @__PURE__ */ s.jsxs("div", { className: ae.headerControls, children: [
      /* @__PURE__ */ s.jsxs("form", { className: ae.searchForm, children: [
        /* @__PURE__ */ s.jsx("input", { type: "text", placeholder: "Search..." }),
        /* @__PURE__ */ s.jsx("button", { type: "submit", children: /* @__PURE__ */ s.jsx(bt, {}) })
      ] }),
      /* @__PURE__ */ s.jsx(rc, {})
    ] }),
    /* @__PURE__ */ s.jsx("nav", { className: ae.navbar, children: /* @__PURE__ */ s.jsx("ul", { className: ae.navMenu, children: o.map((l) => /* @__PURE__ */ s.jsxs("li", { className: l.children ? ae.dropdown : "", children: [
      l.onClick ? /* @__PURE__ */ s.jsx("button", { onClick: l.onClick, className: ae.navLink, children: l.name }) : /* @__PURE__ */ s.jsxs(cs, { to: l.path, className: ae.navLink, children: [
        l.name,
        " ",
        l.children ? "▾" : ""
      ] }),
      l.children && /* @__PURE__ */ s.jsx("ul", { className: ae.dropdownMenu, children: l.children.map((c) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx(cs, { to: c.path, className: ae.dropdownMenuItem, children: c.name }) }, c.name)) })
    ] }, l.name)) }) })
  ] });
}, ic = "_zoroFooter_8qpog_1", oc = "_footerContent_8qpog_8", ac = "_footerColumns_8qpog_13", lc = "_column_8qpog_20", cc = "_socialIcons_8qpog_50", dc = "_footerQuote_8qpog_59", Ve = {
  zoroFooter: ic,
  footerContent: oc,
  footerColumns: ac,
  column: lc,
  socialIcons: cc,
  footerQuote: dc
}, uc = () => /* @__PURE__ */ s.jsx("footer", { className: Ve.zoroFooter, children: /* @__PURE__ */ s.jsxs("div", { className: Ve.footerContent, children: [
  /* @__PURE__ */ s.jsxs("div", { className: Ve.footerColumns, children: [
    /* @__PURE__ */ s.jsxs("div", { className: Ve.column, children: [
      /* @__PURE__ */ s.jsx("h4", { children: "Zoroasterverse" }),
      /* @__PURE__ */ s.jsx("p", { children: "“Truth is the architect of happiness.”" }),
      /* @__PURE__ */ s.jsxs("p", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Zoroasterverse. All rights reserved."
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: Ve.column, children: [
      /* @__PURE__ */ s.jsx("h4", { children: "Explore" }),
      /* @__PURE__ */ s.jsxs("ul", { children: [
        /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("a", { href: "/about", children: "About" }) }),
        /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("a", { href: "/books", children: "Books" }) }),
        /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("a", { href: "/collaborate", children: "Artist Collaboration" }) }),
        /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("a", { href: "/contact", children: "Contact" }) })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: Ve.column, children: [
      /* @__PURE__ */ s.jsx("h4", { children: "Connect" }),
      /* @__PURE__ */ s.jsxs("ul", { className: Ve.socialIcons, children: [
        /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("a", { href: "#", children: /* @__PURE__ */ s.jsx(jl, {}) }) }),
        /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("a", { href: "#", children: /* @__PURE__ */ s.jsx(Nl, {}) }) }),
        /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("a", { href: "#", children: /* @__PURE__ */ s.jsx(kl, {}) }) })
      ] })
    ] })
  ] }),
  /* @__PURE__ */ s.jsx("div", { className: Ve.footerQuote, children: /* @__PURE__ */ s.jsx("em", { children: "“Let your conscience be the altar where right intention dwells.”" }) })
] }) }), eg = ({
  isAuthenticated: e = !1,
  betaApplicationStatus: t = "none",
  onLogout: r
}) => /* @__PURE__ */ s.jsxs("div", { className: "min-h-screen flex flex-col", children: [
  /* @__PURE__ */ s.jsx(
    nc,
    {
      isAuthenticated: e,
      betaApplicationStatus: t,
      onLogout: r
    }
  ),
  /* @__PURE__ */ s.jsx("main", { className: "flex-1", children: /* @__PURE__ */ s.jsx(gl, {}) }),
  /* @__PURE__ */ s.jsx(uc, {})
] }), hc = "_zrHero_14v3a_1", mc = "_parchmentCard_14v3a_12", fc = "_zrHeroContent_14v3a_70", gc = "_zrTitle_14v3a_74", pc = "_zrQuote_14v3a_88", xc = "_zrIntro_14v3a_97", yc = "_zrCta_14v3a_105", bc = "_zrHeroArt_14v3a_123", vc = "_videoFire_14v3a_156", wc = "_prophecyMask_14v3a_168", jc = "_prophecyReel_14v3a_183", Nc = "_prophecyItem_14v3a_193", kc = "_englishText_14v3a_203", Tc = "_spinsIndicator_14v3a_212", Sc = "_spinDot_14v3a_221", Cc = "_spinDotActive_14v3a_230", Pc = "_zrSection_14v3a_237", _c = "_zrH2_14v3a_243", H = {
  zrHero: hc,
  parchmentCard: mc,
  zrHeroContent: fc,
  zrTitle: gc,
  zrQuote: pc,
  zrIntro: xc,
  zrCta: yc,
  zrHeroArt: bc,
  videoFire: vc,
  prophecyMask: wc,
  prophecyReel: jc,
  prophecyItem: Nc,
  englishText: kc,
  spinsIndicator: Tc,
  spinDot: Sc,
  spinDotActive: Cc,
  zrSection: Pc,
  zrH2: _c
}, Ac = ({ spinsLeft: e, setSpinsLeft: t, onSpin: r }) => {
  const n = ht(null), [i, a] = _(!1), o = 150, l = [
    { english: "Your heart is a compass that always points toward love—trust it, follow it, honor it." },
    { english: "You are not who you were yesterday unless you choose to be—each day offers the gift of becoming." },
    { english: "The friend of truth shall be the friend of my spirit, O Ahura Mazda. (Yasna 46.2)" },
    { english: "Every moment is sacred when approached with reverence, every task holy when performed with love." },
    { english: "The mind aligned with truth thinks God's thoughts after Him, sees with divine eyes, loves with cosmic heart." },
    { english: "May the beneficent spirit help us to speak truth and act righteously. (Yasna 47.6)" },
    { english: "Hope is the thing with feathers that perches in the soul and sings without words." },
    { english: "Self-knowledge is the beginning of wisdom, self-acceptance the foundation of growth." },
    { english: "Grant me, O Truth, the rewards of good thinking that bring joy and satisfaction. (Yasna 50.4)" },
    { english: "The sacred fire burns brightest in the heart that chooses truth over comfort. Let your conscience be the altar where right intention dwells." },
    { english: "Truth without compassion is cruelty; compassion without truth is sentimentality—balance both." },
    { english: "I praise You as the greatest and best, as the most beautiful, O Mazda Ahura. (Yasna 43.16)" },
    { english: "Truth is the architect of happiness, the foundation of peace, the cornerstone of wisdom. Build your life upon this rock." },
    { english: "The weight of moral choice is the proof of human dignity—angels don't choose, demons can't choose, but you can." },
    { english: "Plant seeds of hope in winter and trust them to bloom when spring returns to your life." },
    { english: "Appreciation is the highest form of prayer—seeing the divine in every blessing." },
    { english: "The future is not predetermined but is being written by every choice you make right now." },
    { english: "When shadows of doubt gather, kindle the inner flame of discernment. Fire purifies not by destroying, but by revealing what is true." },
    { english: "Begin each day as if it were your first—with wonder. End each day as if it were your last—with gratitude." },
    { english: "Morning brings the gift of choice renewed. Stand at the crossroads of thought and deed—which path serves the light?" },
    { english: "We invoke good thinking, truth, and the beneficent spirit of Ahura Mazda. (Yasna 37.4)" },
    { english: "Where truth flourishes, freedom follows; where freedom is genuine, truth is honored." },
    { english: "The divine dwells not only in temples but in every heart that welcomes it, every life that serves it." },
    { english: "The sacred fire asks no permission to burn, needs no fuel but truth, casts no shadow but illumination." },
    { english: "May we be instruments of peace, servants of truth, children of light. (Benediction)" },
    { english: "Let the fire within you remember the spark of dawn—every choice a new horizon to the world's unfolding. Walk in watchfulness, and the light of Good Mind will not fail you." },
    { english: "Devotion asks not what you can receive but what you can give, not what you deserve but what you can serve." },
    { english: "Freedom is not the absence of constraints but the presence of meaningful options." },
    { english: "Through the beneficent spirit, may we overcome all obstacles to righteousness. (Prayer)" },
    { english: "The light of understanding grows not by accumulating facts but by illuminating connections." },
    { english: "The peaceful heart creates peaceful surroundings; the harmonious soul attracts harmonious relationships." },
    { english: "I take refuge in good thinking, truth, and Your lordship, Mazda, from whom comes the most beneficent spirit. (Yasna 33.5)" },
    { english: "Rational thought and intuitive wisdom are not opposites but partners in the dance of understanding." },
    { english: "When you have the power to help and choose not to, you become complicit in the suffering you could have prevented." },
    { english: "Like a candle lights a thousand candles without diminishing, share your inner light freely with all." },
    { english: "You are both the author and the main character of your life story—write it well." },
    { english: "The good mind is not the mind that knows everything but the mind that remains open to learning." },
    { english: "The stranger is just a friend you haven't met yet, a teacher you haven't learned from yet, a gift you haven't unwrapped yet." },
    { english: "Those who seek to destroy my family and clan, Mazda, I put them in Your hands through good thinking and truth. (Yasna 48.8)" },
    { english: "I pray to You with outstretched hands, O Mazda, seeking Your help through the beneficent spirit. (Yasna 50.8)" },
    { english: "Every decision is a seed planted in the soil of time. What kind of forest are you growing?" },
    { english: "Devotion is gratitude in action, love expressing itself through loyal service." },
    { english: "The fire of truth burns away all that is false in you, leaving only what is real and precious." },
    { english: "The unexamined life scatters like leaves in the wind; the examined life grows deep roots in truth." },
    { english: "The arc of justice bends only when people like you choose to bend it—be a force for righteousness." },
    { english: "Choose as if your choice matters to everyone who will ever live—because it does." },
    { english: "When Good Mind came to me, I first learned to proclaim Your words, O Mazda. (Yasna 43.15)" },
    { english: "To You, the beneficent ones shall come for refuge, Mazda, not to the followers of falsehood. (Yasna 48.4)" },
    { english: "Understanding comes not from standing above others but from standing with them in shared humanity." },
    { english: "The doorway to wisdom opens inward—the journey begins when you stop looking outside and start looking within." },
    { english: "May we be worthy of Your friendship through righteous actions, O Mazda. (Yasna 46.6)" },
    { english: "This I ask You: tell me truly, Ahura—what craftsman created light and darkness? (Yasna 44.5)" },
    { english: "Harmony does not require uniformity—an orchestra creates beauty through coordinated differences." },
    { english: "May Ahura Mazda be praised! May the beneficent spirit be glorified! (Traditional praise)" },
    { english: "Wisdom whispers while foolishness shouts—train your ear to hear the quiet voice of truth." },
    { english: "The measure of a society is how it treats those who cannot defend themselves." },
    { english: "What doesn't challenge you doesn't change you; what doesn't stretch you doesn't strengthen you." },
    { english: "Fair is not everyone getting the same thing; fair is everyone getting what they need to thrive." },
    { english: "Through Your fire, show me the rewards that come through truth for both parties—those who uphold righteousness and those who do not. (Yasna 31.3)" },
    { english: "The world is changed not by those who point out what's wrong but by those who do what's right." },
    { english: "Service is love made visible, compassion made practical, faith made fruitful." },
    { english: "I have recognized You as beneficent through truth and good thinking, O Mazda. (Yasna 49.5)" },
    { english: "The holy is not somewhere else or some time else but here and now, in this place, at this moment." },
    { english: "Let your presence be a sanctuary where others can find rest from the storms of life." },
    { english: "Friendship is truth telling and burden sharing, celebration and consolation, walking together toward the light." },
    { english: "Small daily improvements lead to stunning yearly results—be consistent rather than dramatic." },
    { english: "The mind that dwells in truth becomes a sanctuary where peace is always available." },
    { english: "Your life is a sacred text written one choice at a time—make it a beautiful story." },
    { english: "Blessed is he who brings happiness to others through truth and good deeds. (Traditional blessing)" },
    { english: "You are the protector of the righteous, O Mazda, through Your beneficent spirit. (Yasna 47.3)" },
    { english: "This I ask You: tell me truly, Ahura—who established the path of the sun and stars? (Yasna 44.5)" },
    { english: "At the crossroads of decision, remember: you are always choosing not just for yourself but for all who will follow." },
    { english: "I approach You, O Mazda, with good thinking, so that You may grant me both the blessings of this existence and that of the spirit. (Yasna 28.4)" },
    { english: "Your life is your offering—what will you place on the altar of existence?" },
    { english: "Learning from others shortens your path to wisdom; teaching others deepens your own understanding." },
    { english: "Pure thoughts birth noble words; noble words inspire righteous deeds; righteous deeds purify thoughts in return." },
    { english: "Every meal is communion when shared with gratitude, every conversation prayer when spoken with love." },
    { english: "The freedom to choose your response to any situation is the last of human freedoms—exercise it wisely." },
    { english: "Your conscience is your connection to cosmic justice—honor it by living in alignment with its guidance." },
    { english: "Every sunrise is nature's way of saying, 'Try again'—accept the invitation with gratitude." },
    { english: "Truth is patient but not passive, gentle but not weak, humble but not uncertain of its worth." },
    { english: "Action without reflection is blind; reflection without action is empty; but action guided by reflection is transformative." },
    { english: "Righteousness is the best good. Happiness to him who is righteous for the sake of righteousness alone. (Ashem Vohu variation)" },
    { english: "Community is not a place but a relationship, not a location but a connection." },
    { english: "Good thinking leads to good feeling, good feeling leads to good willing, good willing leads to good living." },
    { english: "Every crossroads is a classroom, every decision a teacher, every consequence a lesson." },
    { english: "The present moment is the only moment over which you have power—make it count." },
    { english: "Hope is not naive optimism but courageous commitment to work for what ought to be." },
    { english: "Every mistake is a teacher in disguise, every failure a step toward success, every setback a setup for comeback." },
    { english: "The inner fire burns brightest not when fed by passion but when fueled by principle." },
    { english: "Your privilege is not your fault, but your responsibility. Use whatever advantages you have to lift others." },
    { english: "Through Your radiant fire, assign the destiny of the righteous and the unrighteous, O Mazda, that our teaching may spread among the living. (Yasna 31.19)" },
    { english: "Knowledge builds walls to separate us from ignorance; wisdom builds bridges to connect us with all beings." },
    { english: "As long as I have strength and power, I shall teach people to seek truth. (Yasna 45.4)" },
    { english: "The beneficent spirit manifests wherever love meets action. Be the hands and heart through which goodness enters the world." },
    { english: "The bounteous mentality sees abundance everywhere—in every sunrise, every breath, every opportunity to serve the good." },
    { english: "The mind illuminated by truth sees possibilities where others see only problems. Think with hope, and hope becomes reality." },
    { english: "Peace begins with each person choosing to be peaceful, harmony starts with each individual choosing to be harmonious." },
    { english: "Let gratitude be your first thought at dawn, your last thought at dusk, your constant companion throughout the day." },
    { english: "I realized You, Mazda, to be beneficent when I was encircled by Good Mind, when he taught me to proclaim: 'Let not men seek to please the followers of falsehood.' (Yasna 43.11)" },
    { english: "Compassion is not feeling sorry for others but feeling with them, sharing their burden until it becomes lighter." },
    { english: "Count your blessings, not your problems; focus on your gains, not your losses; see your progress, not your perfection." },
    { english: "Compassion is not pity from above but solidarity from within—suffer with, celebrate with, grow with." },
    { english: "At every moment you are choosing who you are becoming—choose the highest version of yourself." },
    { english: "Evening reflection is the mirror of morning intention. End as mindfully as you began." },
    { english: "True knowledge transforms the knower. If you remain unchanged by what you learn, you have learned nothing." },
    { english: "The paradox of freedom: you are most free when you choose to serve something greater than yourself." },
    { english: "The ripple effects of your actions extend far beyond what you can see—act as if the future depends on you." },
    { english: "The fire of wisdom burns without consuming. Feed it with honest reflection, and it will illumine your path forever." },
    { english: "Let your thoughts be seeds of kindness, your words be rain of encouragement, your deeds be sunshine of hope." },
    { english: "For whom did You create this earth and sky? Who made the luminaries and the darkness? (Yasna 29.1)" },
    { english: "Your presence in the world matters more than you know—show up fully, authentically, lovingly." },
    { english: "When the world seems broken beyond repair, remember that you are part of the repair." },
    { english: "The darkness is never permanent, the light is never extinguished completely. Keep the vigil." },
    { english: "To help the world progress, O Mazda, we have sought You through good thinking. (Yasna 30.6)" },
    { english: "Let your spirit be a fountain, not a drain. Pour out blessing upon blessing, and watch the desert of despair bloom." },
    { english: "Loneliness is the human condition; connection is the human choice. Choose connection." },
    { english: "For a wise Lord I knew You to be, Mazda, when Good Mind came to me and asked: 'Who are you? To whom do you belong?' (Yasna 43.7)" },
    { english: "True strength is not in never falling but in how gracefully you rise each time you fall." },
    { english: "Disorder is not the opposite of truth but its absence—fill the void with authentic being." },
    { english: "The path of wisdom begins with a single step: the decision to begin walking." },
    { english: "True justice considers not only what is legal but what is right, not only what is permitted but what is beneficial." },
    { english: "Grant me, O Mazda, through Your most beneficent spirit, through truth, the rewards of good thinking, through which I may bring joy to my supporters. (Yasna 28.11)" },
    { english: "The fire of Ahura Mazda brings light to the righteous and terror to the wicked. (Fire prayer)" },
    { english: "Your choices are your prayers—they reveal what you truly worship, what you genuinely value." },
    { english: "The false teacher leads people astray from the path of good thinking and truth. (Yasna 32.3)" },
    { english: "The phoenix rises not in spite of the ashes but because of them—let your failures fuel your renewal." },
    { english: "Forgiveness is not condoning what was wrong but choosing to be free from the burden of carrying resentment." },
    { english: "I praise good thoughts, good words, good deeds, and the good religion. (Fravarane prayer)" },
    { english: "The greatest among you will be your servant—greatness is measured by how much you give, not how much you get." },
    { english: "The morning star reminds us: even in the darkest hour, light is already on its way." },
    { english: "Where differences divide, find common ground; where similarities unite, celebrate diversity." },
    { english: "You who are Mazda, through Your spirit and fire, through truth and good thinking, grant me integrity and strength. (Yasna 28.7)" },
    { english: "In the garden of the heart, plant seeds of truthful speech. Words watered with wisdom bloom into lasting peace." },
    { english: "Your daily habits are votes for the type of person you wish to become—vote wisely." },
    { english: "May we receive the promised reward, the joy that comes from truth, O Mazda. (Yasna 33.11)" },
    { english: "Hope plants seeds in winter, trusting in the promise of spring." },
    { english: "You are not just in the community; the community is in you—you carry it wherever you go." },
    { english: "Your presence is often more healing than your words, your listening more valuable than your advice." },
    { english: "You are a unique note in the symphony of existence—play your part beautifully and boldly." },
    { english: "Bridge-builders are more valuable than wall-builders, peacemakers more needed than warriors." },
    { english: "Growth requires leaving your comfort zone regularly—comfort and growth cannot coexist." },
    { english: "But the righteous man chooses truth and good thinking as his allies. (Yasna 32.2)" },
    { english: "The threefold path begins in the silence of right thinking, flows through the beauty of truthful speech, and culminates in the power of loving action." },
    { english: "Truth needs no defense, only expression. Speak it simply and let its power do the rest." },
    { english: "Through good deeds may we come to You, O Mazda, with joy and gladness. (Yasna 50.10)" },
    { english: "I beheld You clearly in my mind's eye as the first one at the birth of life, when You made actions have consequences—evil for the evil, good reward for the good. (Yasna 43.5)" },
    { english: "Inner peace is not a luxury but a necessity, not a retreat from the world but preparation for effective engagement." },
    { english: "The wise heart holds both confidence and humility, certainty and openness, in perfect balance." },
    { english: "Your breath connects you to every living being—breathe consciously, live connectedly." },
    { english: "Whoever upholds truth most, whether man or woman, O Mazda Ahura, is most dear to You. (Yasna 46.11)" },
    { english: "Yes, there are two fundamental spirits, twins, renowned to be in conflict. In thought and word, in action, they are two: the good and the bad. Between these two, the beneficent have correctly chosen. (Yasna 30.3)" },
    { english: "Transformation happens not when you try to become someone else but when you become more fully yourself." },
    { english: "Where injustice flourishes, it is not enough to be personally righteous. Stand up, speak out, act decisively." },
    { english: "Then spoke Ahura Mazda: We have no pastor here who is both knowing and holy. (Yasna 29.6)" },
    { english: "The practice of gratitude transforms ordinary moments into sacred experiences." },
    { english: "Truth is like the sun—you cannot look directly at it for long, but it lights everything else." },
    { english: "I shall serve You with good thinking, with truth and righteous action, so that You may grant me that which leads to the straight path. (Yasna 28.5)" },
    { english: "May good thinking and truth dwell in our house forever, O Ahura Mazda. (Yasna 60.6)" },
    { english: "Look within with the same honesty you demand from others, the same compassion you show to friends." },
    { english: "The healing the world needs begins with the healing you give yourself—be gentle, be patient, be kind." },
    { english: "Hope is not a feeling but a decision—decide to hope and then live as if your hope is justified." },
    { english: "One chooses that rule of good thinking allied with truth in order to serve the beneficent spirit. (Yasna 51.18)" },
    { english: "The good mind is a gift that grows with giving. Share your wisdom freely, and watch understanding multiply among all beings." },
    { english: "When thought, word, and deed align like three rivers meeting, their combined power can move mountains of indifference." },
    { english: "The music of the spheres plays on—attune your heart to hear the cosmic symphony of love." },
    { english: "We rise by lifting others, we succeed by serving others, we find ourselves by losing ourselves in love." },
    { english: "The truth you speak has a past—it comes from your experience. Make sure that past is worthy of the truth." },
    { english: "The beneficent spirit breathes in every act of kindness. When you lift another's burden, you lighten the world." },
    { english: "Your talents are gifts to be shared, not treasures to be hoarded—invest them in making the world better." },
    { english: "The grateful heart attracts more to be grateful for—appreciation is the magnet for abundance." },
    { english: "The person who knows their weaknesses is stronger than the person who denies them." },
    { english: "May good fortune come through truth to those who proclaim these teachings, O Mazda. (Yasna 51.16)" },
    { english: "Meditation is the art of listening to the still small voice that whispers your deepest truth." },
    { english: "The most important choice you make each day is who you choose to become in that day." },
    { english: "Order emerges not from control but from harmony—the willing cooperation of free beings choosing good." },
    { english: "True intelligence is not the ability to solve problems but to see the connections between all things." },
    { english: "Thus speaks the maiden: 'You are the support of good thinking, of truth, and of the lordship desired by Mazda.' (Yasna 53.3)" },
    { english: "The spiral of growth means you will revisit the same lessons at deeper levels—embrace the journey." },
    { english: "When you choose increase over decrease, healing over harm, you align with the progressive spirit of creation itself." },
    { english: "When someone trusts you with their vulnerability, you hold sacred ground. Tread carefully and gratefully." },
    { english: "Renewal comes not from changing everything at once but from changing one thing completely." },
    { english: "When will the noble warriors come who shall drive out from here the thirst of the wicked? (Yasna 32.1)" },
    { english: "The sacred space is wherever you are when you remember who you really are and why you are here." },
    { english: "Good thinking, good words, and good deeds—these three bring a person to paradise, the best existence, light, and all good things. (Traditional summary)" },
    { english: "The progressive spirit never asks 'Why me?' but always 'How can I help?' Be an answer to someone's prayer today." },
    { english: "Then shall I recognize You as mighty, Mazda, when through good thinking You shall grant the blessings that the truthful and untruthful seek. (Yasna 45.8)" },
    { english: "I know You to be the first and the last, O Ahura Mazda—You are father of good thinking, creator of truth, judge of our actions. (Yasna 31.8)" },
    { english: "Wisdom is not knowing all the answers but asking better questions. Begin with: How can I serve?" },
    { english: "Conscience is the ember of the divine fire planted in every human heart—tend it carefully." },
    { english: "By Your beneficent spirit and by fire, O Mazda, show me truth and good thinking, through whose work one goes to Your abode. (Yasna 31.20)" },
    { english: "Come to my help, O Mazda, grant me strength through truth and good thinking. (Yasna 33.6)" },
    { english: "Through good deeds and righteous words, may we please Your spirit, O Mazda. (Yasna 49.10)" },
    { english: "Through truth we serve the Lord of Wisdom with good mind and beneficial action. (Summary verse)" },
    { english: "Service is not about being needed but about being useful, not about being thanked but about being trustworthy." },
    { english: "I who shall serve You with good thinking... may I thus bring solace to the soul of Earth. (Yasna 28.2)" },
    { english: "Holiness is not about being perfect but about being present, not about being pure but about being real." },
    { english: "May we be guides for those who seek the path of truth and righteousness. (Yasna 31.22)" },
    { english: "Wisdom is like water—it takes the shape of whatever vessel contains it, yet never loses its essence." },
    { english: "The enlightened mind is like clear water—it reflects perfectly what is, without adding or subtracting anything." },
    { english: "A thankful heart is a magnet for miracles, drawing goodness from the infinite storehouse of grace." },
    { english: "The pattern that connects all things is love expressing itself as truth, truth expressing itself as justice." },
    { english: "We are all connected—what helps one helps all, what harms one harms all." },
    { english: "Both bridegroom and bride, bring your minds into agreement for the practice of the best thoughts. (Yasna 53.4)" },
    { english: "The questions you ask shape the life you live—ask better questions, live a better life." },
    { english: "May the light of good thinking shine in our hearts forever. (Prayer verse)" },
    { english: "True self-knowledge includes knowing not just what you are but what you could become." },
    { english: "I know You to be mighty when You help me with good thinking, O Mazda Ahura. (Yasna 31.5)" },
    { english: "Justice is not revenge but restoration—making right what has been wrong, healing what has been harmed." },
    { english: "The sun rises not because you need it but because it is the nature of the sun to shine—be like the sun." },
    { english: "Justice is love applied to systems, compassion embodied in institutions, kindness made structural." },
    { english: "Grant victory to those who speak truth and live righteously, O Ahura Mazda. (Yasna 48.12)" },
    { english: "The journey inward is the most courageous journey—it requires facing yourself without flinching." },
    { english: "I have realized You as beneficent, Mazda Ahura, when You came to me with good thinking and asked: 'Who are you willing to please?' (Yasna 49.3)" },
    { english: "Each choice carves a channel for future choices to follow. Choose wisely what river you dig for tomorrow." },
    { english: "Therefore may we be among those who make this world fresh and new! (Yasna 30.9)" },
    { english: "Truth is the gravity of the moral universe—what goes up in lies must come down in consequences." },
    { english: "The weight of choice is the price of consciousness. Bear it gladly, for it makes you a partner in creation's unfolding." },
    { english: "This I ask You: Which is the first and which the last? (Yasna 44.6)" },
    { english: "Thank the sunrise for its faithfulness, the earth for its generosity, life for its infinite possibilities." },
    { english: "The sacred is not separate from the ordinary but hidden within it, waiting to be discovered." },
    { english: "Reflect with a clear mind—each person for themselves—before the Great Event of Choices. Awaken to this doctrine: there is no compromise between right and wrong. (Yasna 30.2)" },
    { english: "Your choices reveal your values more accurately than your words—choose as if your character depends on it." },
    { english: "You are not just in the world; the world is in you—take care of both." },
    { english: "Time is the canvas, your choices the paint, your life the masterpiece—create something beautiful." },
    { english: "I entrust my soul to You, O Mazda, seeking Your protection through good thinking. (Yasna 48.9)" },
    { english: "The isolated tree falls in the storm; a forest of trees stands strong together." },
    { english: "Sacred living means recognizing the extraordinary within the ordinary, the eternal within the temporal." },
    { english: "The arc of the moral universe bends toward justice only when conscious beings like you and me choose to bend it." },
    { english: "The cosmic order is written in every sunrise, every heartbeat, every act of genuine kindness." },
    { english: "This I ask You: Who holds up the earth below and keeps the sky from falling? (Yasna 44.4)" },
    { english: "Let the fire within purify your motives, clarify your vision, energize your compassion." },
    { english: "The strength of the individual is the community; the strength of the community is the individual." },
    { english: "The hands that heal are holier than the hands that pray without helping." },
    { english: "The grateful heart sees abundance everywhere; the ungrateful heart finds scarcity in plenty." },
    { english: "This I ask You: tell me truly, Ahura—how shall I drive deceit far from us who seek to promote truth in the world? (Yasna 51.4)" },
    { english: "Every ending contains a beginning; every death, a birth; every loss, an opportunity for growth." },
    { english: "Know yourself not to become self-absorbed but to become self-aware, not to focus inward but to focus clearly." },
    { english: "When these two spirits came together in the beginning, they established life and not-life, and how at the end the worst existence shall be for the followers of falsehood, but the best mind for the truthful. (Yasna 30.4)" },
    { english: "Wisdom is the art of living skillfully, the science of choosing well, the practice of loving wisely." },
    { english: "In the morning, set your mind like a compass toward truth; let all your steps follow this direction." },
    { english: "May Your fire shine forth to help the supporter of truth, O Mazda. (Yasna 34.4)" },
    { english: "The curious mind stays young, the learning heart stays open, the growing soul stays alive." },
    { english: "The bridge between what is and what could be is built with the materials of hope and hard work." },
    { english: "The mirror of self-reflection shows not what you want to see but what you need to see." },
    { english: "Let truth be our guide, good thinking our companion, right action our path. (Summary)" },
    { english: "The universe conspires to help those who help themselves and others—be part of the conspiracy of good." },
    { english: "Every act of love is a victory over the forces that diminish life—love boldly, love widely, love deeply." },
    { english: "The paradox of wisdom: the more you truly know, the more you realize how much you don't know." },
    { english: "Each day offers lessons if you are willing to be a student, opportunities if you are willing to try." },
    { english: "Justice is not just a destination but a journey—walk it one step at a time, one choice at a time." },
    { english: "The beginner's mind sees possibilities everywhere; the expert mind sees problems in everything." },
    { english: "Every choice is a prayer, every decision a vote for the kind of world you want to live in." },
    { english: "Justice delayed is often justice denied, but justice rushed is sometimes injustice accomplished. Seek the balanced way." },
    { english: "To what land to flee? Where shall I go to flee? They exclude me from family and clan. (Yasna 46.1)" },
    { english: "You are the one who rewards both the truthful and the untruthful according to their deeds. (Yasna 43.12)" },
    { english: "Who, Mazda, is the faithful friend of Your spirit? Let him teach me the straight paths of good thinking and of truth. (Yasna 47.4)" },
    { english: "With outstretched hands I pray to You, O Mazda, first of all through truth. (Yasna 28.1)" },
    { english: "Self-reflection without self-compassion becomes self-criticism; self-compassion without self-reflection becomes self-deception." },
    { english: "May good thinking reign supreme, may truth be established in the world. (Yasna 45.10)" },
    { english: "True belonging doesn't require you to change who you are; it requires you to be who you are." },
    { english: "When you light the lamp of compassion, you illuminate your own path as well as others'." },
    { english: "The order of existence rewards those who align with it, not to punish those who don't, but to heal what is broken." },
    { english: "The good mind seeks first to understand, then to be understood; first to serve, then to be served." },
    { english: "The trinity of human goodness—think well, speak well, act well—echoes the divine harmony that sustains all worlds." },
    { english: "Freedom is not the absence of consequences but the power to choose which consequences you will embrace." },
    { english: "Every moment is a fresh beginning, every breath a new chance, every choice a sacred opportunity." },
    { english: "Begin each day by asking: How can I make today better than yesterday? End each day by answering: How did I succeed?" },
    { english: "Through Your most beneficent spirit, O Mazda, I seek to do Your will. (Yasna 47.1)" },
    { english: "The greatest sermon is a life well-lived in service to truth, beauty, and goodness." },
    { english: "The deepest truth is often the most simple: be kind, be honest, be helpful, be present." },
    { english: "Peace is not the absence of conflict but the presence of justice, not the silence of oppression but the harmony of mutual respect." },
    { english: "The darkest night produces the brightest stars—your current darkness may be developing your greatest light." },
    { english: "Connection is the energy that exists between people when they feel seen, heard, and valued." },
    { english: "Like fire transforms wood to light, let your choices transform the world from what it is to what it should be." },
    { english: "Through good thinking, truth, and the spirit's power, they shall overcome the violence of the deceitful. (Yasna 32.16)" },
    { english: "The day unfolds like a scroll waiting to be written. What story will your choices tell?" },
    { english: "The gift of choice is also the burden of choice—embrace both aspects with equal courage." },
    { english: "The scales of justice are balanced not by equal punishment but by proportional restoration." },
    { english: "The seeds of tomorrow are planted in the soil of today—plant wisely." },
    { english: "Good thinking is the bridge between knowing and acting. Cross it with courage, and find yourself in the land of fulfillment." },
    { english: "I approach You, Mazda, with hands outstretched, with good thinking, with truth, hoping to please Your spirit with righteous actions. (Yasna 50.5)" },
    { english: "The heart that has been broken and healed is stronger than one that has never been tested." },
    { english: "Thanksgiving is not just a day but a way of life—live thankfully and you will have much to be thankful for." },
    { english: "Begin each day by asking: How shall I increase the good in the world through my being here?" },
    { english: "The wise person learns from everyone, teaches everyone, and judges no one harshly." },
    { english: "Each breath is a gift, each heartbeat a blessing, each moment an opportunity for thankfulness." },
    { english: "Like a lighthouse guides ships safely home, let your conscience guide you through moral storms to peaceful harbors." },
    { english: "Your legacy is not what you leave behind but what you build in others while you are here." },
    { english: "The growing edge is always uncomfortable—that's how you know you're growing." },
    { english: "We seek Your blessing through fire, through truth, through good thinking. (Yasna 36.3)" },
    { english: "This I ask You: tell me truly, Ahura—who was the first father of truth by begetting? (Yasna 44.3)" },
    { english: "Morning is creation's invitation to begin again. Accept it with gratitude and intentional presence." },
    { english: "Your conscience is the hearth of heaven—tend it with thoughts of justice, words of compassion, deeds of righteousness." },
    { english: "Your life may be a drop in the ocean, but without your drop the ocean would be less." },
    { english: "When moral darkness surrounds you, be the flame that others can navigate by." },
    { english: "Grant us, O Mazda, the straight paths of good thinking and truth. (Yasna 33.5)" },
    { english: "Your conscience is the sacred fire that never sleeps, never lies, never abandons you in darkness." },
    { english: "Your work in the world is your worship—do it with the reverence you would bring to the most sacred task." },
    { english: "True leadership is not about being served but about serving, not about having followers but about creating leaders." },
    { english: "Renewal comes not from changing your circumstances but from changing your relationship to your circumstances." },
    { english: "Speak to me as friend speaks to friend! Show me the supports on which both worlds rest. (Yasna 31.3)" },
    { english: "The light you seek is the light you are—stop looking for it and start being it." },
    { english: "Honesty is telling the truth to other people; integrity is telling the truth to yourself." },
    { english: "The wise person is not one who has never erred but one who learns from every mistake." },
    { english: "When the mind is clear like mountain water, right decisions flow naturally. Still the turbulent thoughts and find your center." },
    { english: "Through the beneficent spirit, Mazda, give me strength for good thinking, that I may find the straight paths of life. (Yasna 47.2)" },
    { english: "May we be among those who make this world progress, who are the healers of this world, O Mazda and You, O Truth. (Yasna 30.9)" },
    { english: "The wise Lord rewards those who serve truth with sincerity and devotion. (Teaching verse)" },
    { english: "The divine spark within you knows the difference between right and wrong—trust it, follow it, serve it." },
    { english: "The inner flame burns brightest when fed by deeds of righteousness, words of truth, thoughts of love." },
    { english: "The deepest wisdom is often the simplest truth, lived with complete sincerity." },
    { english: "Every person you meet is fighting a battle you know nothing about—be kind, be patient, be present." },
    { english: "The man of good life speaks to him of ill life: 'May your conscience torment you continuously!' (Yasna 46.11)" },
    { english: "The flame that burns for justice never consumes the just, only the injustice they oppose." },
    { english: "We approach You, O Ahura Mazda, with good thinking and truth, seeking Your blessing. (Yasna 34.1)" },
    { english: "Personal evolution is not about perfection but about progression, not about arrival but about journey." },
    { english: "Gratitude is the memory of the heart—it never forgets a kindness received or given." },
    { english: "I shall worship You with good thinking, O Mazda Ahura, so that You may teach me truth through Your spirit. (Yasna 45.6)" },
    { english: "Each dawn brings the covenant renewed: to think with clarity, speak with truth, act with love." },
    { english: "Kindness is the universal language that the deaf can hear and the blind can see." },
    { english: "Even in the darkest times, remember: you are here for a reason, at this time, in this place." },
    { english: "The phoenix is not reborn from ashes but through them—transformation requires embracing the fire." },
    { english: "As the first, O Mazda, You gave bodies and breath to the corporeal world through Your thought. (Yasna 31.11)" },
    { english: "Your inner fire is not yours alone—it is borrowed from the eternal flame that lights all worlds." },
    { english: "The river that moves you also moves through you—you are not separate from the flow of life." },
    { english: "The ultimate measure of your life is not what you accomplish but who you become." },
    { english: "The most precious gift you can give another person is your full, undivided, loving attention." },
    { english: "Truth is not a destination but a way of walking. Each step in harmony with what is right brings the world closer to wholeness." },
    { english: "May Ahura Mazda grant us that good which we seek through truth and good thinking. (Yasna 60.12)" },
    { english: "Gratitude turns what we have into enough, transforms ordinary days into thanksgivings, routine jobs into joy." },
    { english: "Love is the recognition that the other person's happiness is as important as your own—maybe more important." },
    { english: "Every person you meet is your teacher—some teach by example, others by cautionary tale." },
    { english: "Through righteousness may we attain that world of good thinking. (Yasna 34.15)" },
    { english: "The deceitful one chose to bring to realization the worst things. But the very beneficent spirit chose truth, and so shall those who satisfy the Wise Lord continuously with true actions. (Yasna 30.5)" },
    { english: "Each breath is a chance to choose life over death, hope over despair, love over fear." },
    { english: "True understanding comes not from accumulating facts but from seeing the patterns that connect all things." },
    { english: "Every act of service is a prayer, every moment of helpfulness a hymn, every gesture of kindness a blessing." },
    { english: "Where truth blooms, falsehood cannot take root. Cultivate the garden of your life with seeds of honesty and integrity." },
    { english: "The future is not fixed because you are still choosing—make your next choice count." },
    { english: "The most powerful force in the universe is a human being living in alignment with their highest truth." },
    { english: "When you see injustice and do nothing, you become part of the injustice—speak up, stand up, act up." },
    { english: "As rivers seek the sea, let your thoughts flow toward truth. In the silence of right action, wisdom speaks without words." },
    { english: "Your daily work is your temple, your loving relationships your prayer, your kind actions your worship." },
    { english: "The true order of existence is good; the most-good existence it is; desire it! Wish it! Happiness, bliss, enlightenment it is for that existence which is the true order of existence. (Ashem Vohu)" },
    { english: "The heart that has known pain is the heart most capable of healing others' pain." },
    { english: "Conflict is often the birth-pain of greater understanding—do not avoid it, but engage it constructively." },
    { english: "Clear thinking leads to clear speaking, which leads to clear acting. Begin each day by clarifying your deepest intentions." },
    { english: "The order of existence reveals itself to those who seek with sincere hearts. Look closely—truth hides in plain sight." },
    { english: "Let the actions of good thinking come to fruition for the man who teaches truth to Zarathustra. (Yasna 28.6)" },
    { english: "The loving man who brings help to the truthful, whether kinsman or fellow-member of the community, is in good accord with truth. (Yasna 46.2)" },
    { english: "When shall I know that You have power over those who cause harm to me, O Mazda? Let fire accompanied by good thinking make this known to me through truth. (Yasna 48.7)" },
    { english: "Clarity comes not from having all the answers but from asking the right questions." },
    { english: "Wisdom is knowing what to do; virtue is doing it; integrity is being consistent in both." },
    { english: "And when punishment comes to the wicked, then shall Your power be revealed to all, O Mazda. (Yasna 30.8)" },
    { english: "Your network is not about who can help you but who you can help, not who you know but who knows they can count on you." },
    { english: "Every ending is a new beginning in disguise—look for the hidden gift in every goodbye." },
    { english: "Through truth I complete my worship and my praise with actions, O Mazda Ahura. (Yasna 50.11)" },
    { english: "Where shall the righteous man find refuge when the wicked overwhelm the land? (Yasna 46.1)" },
    { english: "Like a river finds its course, truth finds its way through every obstacle. Be the clear channel through which it flows." },
    { english: "Every moment offers the great choice: will you add to the world's burden or its blessing? Choose consciously." },
    { english: "The rhythm of sunrise and sunset teaches the sacred pace of effort and rest, engagement and reflection." },
    { english: "Your fire, strong through truth, is a visible help to Your supporter, but visible harm to Your enemy, O Ahura Mazda. (Yasna 34.4)" },
    { english: "The soul of the earth cries out: For whom did You fashion me? Who created me? (Yasna 29.1)" },
    { english: "Service is the rent we pay for living on this planet—pay it gladly and generously." }
  ], c = 5, u = l.length, d = [];
  for (let p = 0; p < c; p++)
    d.push(...l);
  const h = [
    ...d.slice(d.length - u),
    ...d,
    ...d.slice(0, u)
    // Append for smooth loop
  ], f = async () => {
    if (i || !n.current || e <= 0) {
      console.log("No spins left or already spinning.");
      return;
    }
    console.log("handleSpin called");
    try {
      new Audio("/gear-click-351962.mp3").play().catch((j) => console.error("Error playing sound:", j));
    } catch (C) {
      console.error("Error creating Audio object:", C);
    }
    if (a(!0), t((C) => C - 1), r)
      try {
        await r(3 - e + 1);
      } catch (C) {
        console.error("Error updating spin count:", C);
      }
    const p = Math.floor(Math.random() * l.length), S = (u + p + l.length * Math.floor(c / 2)) * o;
    n.current.classList.add("prophecy-reel-spinning"), n.current.style.transform = `translateY(-${S}px)`, setTimeout(() => {
      if (!n.current) return;
      n.current.classList.remove("prophecy-reel-spinning"), n.current.style.transition = "none";
      const C = p * o;
      n.current.style.transform = `translateY(-${C}px)`, n.current.offsetHeight, n.current.style.transition = "transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)", a(!1);
    }, 1600);
  };
  return /* @__PURE__ */ s.jsx(s.Fragment, { children: /* @__PURE__ */ s.jsx("div", { className: H.prophecyMask, onClick: f, children: /* @__PURE__ */ s.jsx("div", { ref: n, className: H.prophecyReel, children: h.map((p, y) => /* @__PURE__ */ s.jsx("div", { className: H.prophecyItem, children: /* @__PURE__ */ s.jsx("span", { className: H.englishText, children: p.english }) }, y)) }) }) });
}, Ec = ({ contentMap: e, spinsLeft: t, setSpinsLeft: r, onSpin: n }) => {
  var l, c, u;
  const i = ((l = e.get("hero_title")) == null ? void 0 : l.content) || "Zoroasterverse", a = ((c = e.get("hero_quote")) == null ? void 0 : c.content) || "“Happiness comes to them who bring happiness to others.”", o = ((u = e.get("hero_description")) == null ? void 0 : u.content) || "Learn about the teachings of the prophet Zarathustra, the history of one of the world’s oldest religions, and the principles of Good Thoughts, Good Words, and Good Deeds.";
  return /* @__PURE__ */ s.jsxs("section", { id: "home", className: H.zrHero, children: [
    /* @__PURE__ */ s.jsxs("div", { className: H.zrHeroContent, children: [
      /* @__PURE__ */ s.jsx("h1", { className: H.zrTitle, children: i }),
      /* @__PURE__ */ s.jsx("p", { className: H.zrQuote, children: a }),
      /* @__PURE__ */ s.jsx("p", { className: H.zrIntro, children: o }),
      /* @__PURE__ */ s.jsx(Ht, { className: H.zrCta, to: "/blog/about", children: "Learn More" })
    ] }),
    /* @__PURE__ */ s.jsxs("figure", { className: H.zrHeroArt, "aria-labelledby": "art-caption", children: [
      /* @__PURE__ */ s.jsx(
        "video",
        {
          src: "/200716-913538378.mp4",
          autoPlay: !0,
          loop: !0,
          muted: !0,
          playsInline: !0,
          className: H.videoFire
        }
      ),
      /* @__PURE__ */ s.jsx("div", { className: H.spinsIndicator, children: [...Array(3)].map((d, h) => /* @__PURE__ */ s.jsx("div", { className: `${H.spinDot} ${h < t ? H.spinDotActive : ""}` }, h)) }),
      /* @__PURE__ */ s.jsx(Ac, { spinsLeft: t, setSpinsLeft: r, onSpin: n }),
      /* @__PURE__ */ s.jsx("figcaption", { id: "art-caption", className: "sr-only", children: "A stylized winged figure above a sacred fire." })
    ] })
  ] });
}, Mc = ({ posts: e }) => /* @__PURE__ */ s.jsxs("section", { className: H.zrSection, children: [
  /* @__PURE__ */ s.jsx("h2", { className: H.zrH2, children: "Latest News & Updates" }),
  /* @__PURE__ */ s.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: e.map((t) => {
    const r = t.content.length > 100 ? t.content.substring(0, 100) + "..." : t.content;
    return /* @__PURE__ */ s.jsxs("div", { className: H.parchmentCard, children: [
      /* @__PURE__ */ s.jsx("h3", { children: t.title }),
      /* @__PURE__ */ s.jsx("p", { className: "mt-2", dangerouslySetInnerHTML: { __html: r } }),
      /* @__PURE__ */ s.jsx(Ht, { to: `/blog/${t.slug}`, className: "mt-4 inline-block", children: "Read More" })
    ] }, t.id);
  }) })
] }), Dc = ({ releases: e }) => /* @__PURE__ */ s.jsxs("section", { className: H.zrSection, children: [
  /* @__PURE__ */ s.jsx("h2", { className: H.zrH2, children: "Latest Releases" }),
  /* @__PURE__ */ s.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: e.map((t) => /* @__PURE__ */ s.jsxs("div", { className: H.parchmentCard, children: [
    /* @__PURE__ */ s.jsx("h3", { children: t.title }),
    /* @__PURE__ */ s.jsxs("p", { className: "mt-2", children: [
      "Type: ",
      t.type
    ] }),
    /* @__PURE__ */ s.jsx("a", { href: t.link || "#", className: "mt-4 inline-block", children: "View Details / Purchase" })
  ] }, t.id)) })
] }), tg = ({
  homepageData: e = [],
  latestPosts: t = [],
  releaseData: r = [],
  spinsLeft: n = 0,
  isLoading: i = !1,
  isError: a = !1,
  onSpin: o
}) => {
  var d, h, f, p;
  const [l, c] = _(n);
  if (i) return /* @__PURE__ */ s.jsx("div", { className: "text-center py-8", children: "Loading homepage content..." });
  if (a) return /* @__PURE__ */ s.jsx("div", { className: "text-center py-8 text-red-400", children: "Error loading homepage content." });
  const u = new Map(e == null ? void 0 : e.map((y) => [y.section, y]));
  return /* @__PURE__ */ s.jsxs("div", { children: [
    /* @__PURE__ */ s.jsx(Ec, { contentMap: u, spinsLeft: l, setSpinsLeft: c, onSpin: o }),
    /* @__PURE__ */ s.jsxs("section", { className: H.zrSection, children: [
      /* @__PURE__ */ s.jsx("h2", { className: H.zrH2, children: "Our Progress" }),
      /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-8 text-center", children: [
        /* @__PURE__ */ s.jsxs("div", { className: H.parchmentCard, children: [
          /* @__PURE__ */ s.jsx("h3", { className: "text-4xl font-bold text-primary", children: ((d = u.get("statistics_words_written")) == null ? void 0 : d.content) || "0" }),
          /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground", children: "Words Written" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: H.parchmentCard, children: [
          /* @__PURE__ */ s.jsx("h3", { className: "text-4xl font-bold text-primary", children: ((h = u.get("statistics_beta_readers")) == null ? void 0 : h.content) || "0" }),
          /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground", children: "Beta Readers" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: H.parchmentCard, children: [
          /* @__PURE__ */ s.jsx("h3", { className: "text-4xl font-bold text-primary", children: ((f = u.get("statistics_average_rating")) == null ? void 0 : f.content) || "0" }),
          /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground", children: "Average Rating" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: H.parchmentCard, children: [
          /* @__PURE__ */ s.jsx("h3", { className: "text-4xl font-bold text-primary", children: ((p = u.get("statistics_books_published")) == null ? void 0 : p.content) || "0" }),
          /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground", children: "Books Published" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ s.jsx(Mc, { posts: t || [] }),
    /* @__PURE__ */ s.jsx(Dc, { releases: r || [] }),
    /* @__PURE__ */ s.jsxs("section", { className: H.zrSection, children: [
      /* @__PURE__ */ s.jsx("h2", { className: H.zrH2, children: "Artist Collaboration" }),
      /* @__PURE__ */ s.jsxs("div", { className: "relative rounded-lg shadow-lg overflow-hidden w-full", children: [
        /* @__PURE__ */ s.jsx("img", { src: "/images/invite_to_Colab_card.png", alt: "Artist Collaboration Invitation", className: "w-full h-full object-contain" }),
        /* @__PURE__ */ s.jsxs("div", { className: "absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-8", children: [
          /* @__PURE__ */ s.jsx("h3", { className: "text-2xl font-bold text-white mb-4 text-shadow-md", children: "Join Our Creative Team!" }),
          /* @__PURE__ */ s.jsx("p", { className: "text-white mb-6 text-shadow-sm", children: "We're looking for talented artists to help shape the visual identity of the Zangar/Spandam Series. Explore revenue-share opportunities and bring your vision to life." }),
          /* @__PURE__ */ s.jsx(Ht, { to: "/artist-collaboration", className: "inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105", children: "Apply Now" })
        ] })
      ] })
    ] })
  ] });
}, sg = ({ children: e, icon: t, variant: r = "primary", className: n = "", onClick: i, type: a = "button" }) => {
  const o = "group relative inline-flex items-center gap-3 rounded-2xl px-8 py-4 font-semibold tracking-wide transition-all duration-300 transform", l = {
    // Add index signature
    primary: "border border-amber-600/60 bg-gradient-to-r from-amber-600/20 to-orange-600/20 text-amber-100 shadow-[0_0_30px_rgba(251,191,36,0.15)] hover:shadow-[0_0_50px_rgba(251,191,36,0.3)] hover:-translate-y-1",
    secondary: "border border-slate-600/60 bg-gradient-to-r from-slate-800/80 to-slate-900/80 text-slate-200 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(251,191,36,0.2)] hover:border-amber-600/40 hover:-translate-y-1"
  };
  return /* @__PURE__ */ s.jsxs(
    "button",
    {
      className: `${o} ${l[r]} ${n}`,
      onClick: i,
      type: a,
      children: [
        t && /* @__PURE__ */ s.jsx(t, { className: "w-5 h-5" }),
        /* @__PURE__ */ s.jsx("span", { className: "relative z-10", children: e }),
        /* @__PURE__ */ s.jsx(Tl, { className: "w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" }),
        /* @__PURE__ */ s.jsx("div", { className: "absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-600/10 via-orange-600/10 to-amber-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-xl" })
      ]
    }
  );
}, rg = () => /* @__PURE__ */ s.jsxs("div", { className: "relative flex items-center justify-center my-12", children: [
  /* @__PURE__ */ s.jsx("div", { className: "h-px w-32 bg-gradient-to-r from-transparent via-amber-600/60 to-transparent" }),
  /* @__PURE__ */ s.jsxs("svg", { width: "80", height: "32", viewBox: "0 0 80 32", className: "mx-4 text-amber-500", children: [
    /* @__PURE__ */ s.jsx("path", { d: "M8 16L16 8L24 16L32 8L40 16L48 8L56 16L64 8L72 16", stroke: "currentColor", strokeWidth: "1", fill: "none" }),
    /* @__PURE__ */ s.jsx("circle", { cx: "16", cy: "8", r: "2", fill: "currentColor" }),
    /* @__PURE__ */ s.jsx("circle", { cx: "40", cy: "16", r: "2", fill: "currentColor" }),
    /* @__PURE__ */ s.jsx("circle", { cx: "64", cy: "8", r: "2", fill: "currentColor" })
  ] }),
  /* @__PURE__ */ s.jsx("div", { className: "h-px w-32 bg-gradient-to-r from-transparent via-amber-600/60 to-transparent" })
] }), ng = () => {
  const [e] = _(
    () => Array.from({ length: 60 }, (t, r) => ({
      id: r,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 4 + 2,
      opacity: Math.random() * 0.5 + 0.1
    }))
  );
  return /* @__PURE__ */ s.jsx("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: e.map((t) => /* @__PURE__ */ s.jsx(
    "div",
    {
      className: "absolute rounded-full bg-amber-400/30",
      style: {
        left: `${t.x}%`,
        top: `${t.y}%`,
        width: `${t.size}px`,
        height: `${t.size}px`,
        opacity: t.opacity,
        animation: `float ${t.speed + 8}s linear infinite`,
        boxShadow: `0 0 ${t.size * 4}px rgba(251, 191, 36, 0.4)`
      }
    },
    t.id
  )) });
};
function Rc(...e) {
  return Hi(Wi(e));
}
const ig = ({ count: e = 4, viewMode: t = "grid", className: r }) => {
  const n = Array.from({ length: e }, (i, a) => /* @__PURE__ */ s.jsxs(
    "div",
    {
      className: `${t === "grid" ? "bg-background-light/30 backdrop-blur-sm rounded-2xl border border-border/30 overflow-hidden" : "bg-background-light/30 backdrop-blur-sm rounded-2xl p-6 border border-border/30"}`,
      children: [
        /* @__PURE__ */ s.jsx("div", { className: "h-64 bg-gradient-to-r from-border/20 to-border/40 skeleton" }),
        /* @__PURE__ */ s.jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ s.jsx("div", { className: "h-6 bg-border/20 rounded skeleton mb-3" }),
          /* @__PURE__ */ s.jsxs("div", { className: "space-y-2 mb-4", children: [
            /* @__PURE__ */ s.jsx("div", { className: "h-4 bg-border/20 rounded skeleton" }),
            /* @__PURE__ */ s.jsx("div", { className: "h-4 bg-border/20 rounded skeleton w-3/4" }),
            /* @__PURE__ */ s.jsx("div", { className: "h-4 bg-border/20 rounded skeleton w-1/2" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ s.jsx("div", { className: "h-4 bg-border/20 rounded skeleton w-24 mb-2" }),
            /* @__PURE__ */ s.jsxs("div", { className: "flex space-x-2", children: [
              /* @__PURE__ */ s.jsx("div", { className: "h-6 bg-border/20 rounded-full skeleton w-16" }),
              /* @__PURE__ */ s.jsx("div", { className: "h-6 bg-border/20 rounded-full skeleton w-20" })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "mb-6", children: [
            /* @__PURE__ */ s.jsx("div", { className: "h-8 bg-border/20 rounded skeleton w-20 mb-2" }),
            /* @__PURE__ */ s.jsx("div", { className: "h-4 bg-border/20 rounded skeleton w-32" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ s.jsx("div", { className: "h-12 bg-border/20 rounded-xl skeleton" }),
            /* @__PURE__ */ s.jsx("div", { className: "h-10 bg-border/20 rounded-xl skeleton" })
          ] })
        ] })
      ]
    },
    a
  ));
  return /* @__PURE__ */ s.jsx(
    "div",
    {
      className: Rc(
        t === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4",
        r
      ),
      children: n
    }
  );
}, og = () => {
  const e = ht(null);
  return xe(() => {
    const t = e.current;
    if (!t) return;
    const r = 50, n = () => {
      const a = document.createElement("div");
      a.className = "star", a.style.position = "absolute", a.style.backgroundColor = "#ffffff", a.style.borderRadius = "50%", a.style.left = Math.random() * 100 + "%", a.style.top = Math.random() * 100 + "%";
      const o = Math.random() * 3 + 1;
      a.style.width = a.style.height = o + "px", a.style.animationDelay = Math.random() * 3 + "s", a.style.animationDuration = Math.random() * 2 + 2 + "s", a.style.pointerEvents = "none", t.appendChild(a);
    };
    t.innerHTML = "";
    for (let a = 0; a < r; a++)
      n();
    const i = () => {
      const o = window.pageYOffset * -0.1;
      t && (t.style.transform = `translateY(${o}px)`);
    };
    return window.addEventListener("scroll", i), () => {
      window.removeEventListener("scroll", i);
    };
  }, []), /* @__PURE__ */ s.jsx("div", { ref: e, className: "stars fixed top-0 left-0 w-full h-full pointer-events-none -z-10", children: " " });
}, Lc = ({
  item: e,
  isActive: t = !1,
  level: r = 0,
  onClick: n
}) => {
  const { title: i, slug: a, type: o, children: l = [] } = e, c = l && l.length > 0, u = `${r * 16 + 8}px`, d = (h) => {
    h.preventDefault(), n && n(a);
  };
  return /* @__PURE__ */ s.jsxs("div", { className: `wiki-nav-item ${t ? "active" : ""}`, style: { paddingLeft: u }, children: [
    /* @__PURE__ */ s.jsxs(
      Ht,
      {
        to: `/wiki/${a}`,
        className: `nav-link ${o}`,
        onClick: d,
        children: [
          i,
          c && /* @__PURE__ */ s.jsx("span", { className: "nav-toggle", children: t ? "▼" : "▶" })
        ]
      }
    ),
    c && t && /* @__PURE__ */ s.jsx("div", { className: "nav-children", children: l.map((h, f) => /* @__PURE__ */ s.jsx(
      Lc,
      {
        item: h,
        level: r + 1,
        isActive: t,
        onClick: n
      },
      h.slug
    )) })
  ] });
}, ag = () => {
  const { state: e, removeItem: t, updateQuantity: r, clearCart: n } = Vl(), [i, a] = _(!1), o = (c, u) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: u.toUpperCase()
  }).format(c), l = () => {
    a(!1);
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ s.jsxs(
      "button",
      {
        onClick: () => a(!i),
        className: "relative p-2 text-text-light hover:text-secondary transition-colors",
        "aria-label": "Shopping Cart",
        children: [
          /* @__PURE__ */ s.jsx(et, { className: "w-6 h-6" }),
          e.itemCount > 0 && /* @__PURE__ */ s.jsx("span", { className: "absolute -top-1 -right-1 bg-secondary text-background text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium", children: e.itemCount > 99 ? "99+" : e.itemCount })
        ]
      }
    ),
    i && /* @__PURE__ */ s.jsxs("div", { className: "absolute right-0 top-full mt-2 w-80 bg-background-light rounded-2xl shadow-2xl border border-border/30 z-50 glass-effect", children: [
      /* @__PURE__ */ s.jsx("div", { className: "p-4 border-b border-border/30", children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-medium text-text-light", children: "Shopping Cart" }),
        /* @__PURE__ */ s.jsx(
          "button",
          {
            onClick: () => a(!1),
            className: "text-text-dark hover:text-text-light transition-colors",
            children: /* @__PURE__ */ s.jsx(Ee, { className: "w-5 h-5" })
          }
        )
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "max-h-96 overflow-y-auto", children: e.items.length === 0 ? /* @__PURE__ */ s.jsxs("div", { className: "p-6 text-center", children: [
        /* @__PURE__ */ s.jsx(et, { className: "w-12 h-12 text-text-dark mx-auto mb-3" }),
        /* @__PURE__ */ s.jsx("p", { className: "text-text-dark", children: "Your cart is empty" }),
        /* @__PURE__ */ s.jsx("p", { className: "text-text-dark text-sm", children: "Add some products to get started!" })
      ] }) : /* @__PURE__ */ s.jsx("div", { className: "p-4 space-y-3", children: e.items.map((c) => /* @__PURE__ */ s.jsxs("div", { className: "flex items-center space-x-3 p-3 bg-background/30 rounded-xl", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ s.jsx("h4", { className: "text-sm font-medium text-text-light truncate", children: c.title }),
          /* @__PURE__ */ s.jsx("p", { className: "text-xs text-text-dark", children: c.format.toUpperCase() }),
          /* @__PURE__ */ s.jsx("p", { className: "text-sm text-secondary font-medium", children: o(c.price, c.currency) })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ s.jsx(
            "button",
            {
              onClick: () => r(c.id, c.quantity - 1),
              className: "p-1 text-text-dark hover:text-text-light transition-colors",
              "aria-label": "Decrease quantity",
              children: /* @__PURE__ */ s.jsx(Sl, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ s.jsx("span", { className: "text-sm text-text-light min-w-[2rem] text-center", children: c.quantity }),
          /* @__PURE__ */ s.jsx(
            "button",
            {
              onClick: () => r(c.id, c.quantity + 1),
              className: "p-1 text-text-dark hover:text-text-light transition-colors",
              "aria-label": "Increase quantity",
              children: /* @__PURE__ */ s.jsx(ft, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ s.jsx(
            "button",
            {
              onClick: () => t(c.id),
              className: "p-1 text-error hover:text-error-dark transition-colors",
              "aria-label": "Remove item",
              children: /* @__PURE__ */ s.jsx(Ts, { className: "w-4 h-4" })
            }
          )
        ] })
      ] }, c.id)) }) }),
      e.items.length > 0 && /* @__PURE__ */ s.jsxs("div", { className: "p-4 border-t border-border/30", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ s.jsx("span", { className: "text-text-light font-medium", children: "Total:" }),
          /* @__PURE__ */ s.jsx("span", { className: "text-xl text-secondary font-bold", children: o(e.total, "USD") })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ s.jsx(
            "button",
            {
              onClick: l,
              className: "w-full bg-secondary text-background py-3 px-4 rounded-xl font-medium hover:bg-secondary-dark transition-colors",
              children: "Proceed to Checkout"
            }
          ),
          /* @__PURE__ */ s.jsx(
            "button",
            {
              onClick: n,
              className: "w-full bg-background/50 text-text-light py-2 px-4 rounded-xl font-medium hover:bg-background/70 transition-colors border border-border/30",
              children: "Clear Cart"
            }
          )
        ] })
      ] })
    ] }),
    i && /* @__PURE__ */ s.jsx(
      "div",
      {
        className: "fixed inset-0 z-40",
        onClick: () => a(!1)
      }
    )
  ] });
}, lg = () => {
  const [e, t] = _("login"), [r, n] = _(null), [i, a] = _(!1), [o, l] = _(""), [c, u] = _(""), [d, h] = _(""), [f, p] = _(""), [y, S] = _(""), [C, j] = _(""), [w, P] = _(null), D = $i(), A = (x, E = "info") => {
    n({ text: x, type: E });
    const b = setTimeout(() => n(null), 6e3);
    return () => clearTimeout(b);
  }, I = async (x) => {
    if (x.preventDefault(), !o || !c) {
      A("Please enter both email and password", "error");
      return;
    }
    a(!0);
    try {
      const { error: E } = await ge.auth.signInWithPassword({
        email: o,
        password: c
      });
      if (E) throw E;
      A("Login successful! Redirecting...", "success"), D("/");
    } catch (E) {
      const b = E instanceof Error ? E.message : "Failed to sign in";
      A(b, "error");
    } finally {
      a(!1);
    }
  }, O = async (x) => {
    if (x.preventDefault(), f !== C) {
      A("Passwords do not match", "error");
      return;
    }
    a(!0);
    try {
      const { error: E } = await ge.auth.signUp({
        email: d,
        password: f,
        options: {
          data: {
            display_name: y
          }
        }
      });
      if (E) throw E;
      A("Account created! Please check your email to confirm your account.", "success"), t("login");
    } catch (E) {
      E instanceof Error && E.message;
    } finally {
      a(!1);
    }
  }, k = (x) => {
    if (!x) {
      P(null);
      return;
    }
    let E = 0;
    x.length >= 8 && E++, /[A-Z]/.test(x) && E++, /[a-z]/.test(x) && E++, /[0-9]/.test(x) && E++, /[^A-Za-z0-9]/.test(x) && E++, x.length >= 12 && E++;
    const b = [
      { text: "Weak", className: "weak" },
      { text: "Fair", className: "fair" },
      { text: "Good", className: "good" },
      { text: "Strong", className: "strong" },
      { text: "Very Strong", className: "very-strong" }
    ], L = Math.min(E, b.length - 1);
    P(b[L]);
  };
  return /* @__PURE__ */ s.jsx("div", { className: "auth-page", children: /* @__PURE__ */ s.jsxs("div", { className: "auth-container", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "auth-header", children: [
      /* @__PURE__ */ s.jsx("h1", { children: "Zoroasterverse" }),
      /* @__PURE__ */ s.jsx("p", { children: "Join our community of readers and writers" })
    ] }),
    r && /* @__PURE__ */ s.jsx("div", { className: `message ${r.type}`, children: r.text }),
    /* @__PURE__ */ s.jsxs("div", { className: "tabs", children: [
      /* @__PURE__ */ s.jsx(
        "button",
        {
          className: `tab ${e === "login" ? "active" : ""}`,
          onClick: () => t("login"),
          type: "button",
          children: "Sign In"
        }
      ),
      /* @__PURE__ */ s.jsx(
        "button",
        {
          className: `tab ${e === "signup" ? "active" : ""}`,
          onClick: () => t("signup"),
          type: "button",
          children: "Create Account"
        }
      )
    ] }),
    e === "login" && /* @__PURE__ */ s.jsxs("form", { onSubmit: I, className: "auth-form", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ s.jsx("label", { htmlFor: "loginEmail", children: "Email Address" }),
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "email",
            id: "loginEmail",
            value: o,
            onChange: (x) => l(x.target.value),
            placeholder: "your@email.com",
            required: !0,
            disabled: i
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ s.jsx("label", { htmlFor: "loginPassword", children: "Password" }),
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "password",
            id: "loginPassword",
            value: c,
            onChange: (x) => u(x.target.value),
            placeholder: "Enter your password",
            required: !0,
            disabled: i
          }
        )
      ] }),
      /* @__PURE__ */ s.jsx(
        "button",
        {
          type: "submit",
          className: "btn primary",
          disabled: i,
          children: i ? "Signing in..." : "Sign In"
        }
      ),
      /* @__PURE__ */ s.jsx("div", { className: "form-footer", children: /* @__PURE__ */ s.jsx(Ht, { to: "/forgot-password", children: "Forgot your password?" }) })
    ] }),
    e === "signup" && /* @__PURE__ */ s.jsxs("form", { onSubmit: O, className: "auth-form", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ s.jsx("label", { htmlFor: "signupDisplayName", children: "Display Name" }),
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "text",
            id: "signupDisplayName",
            value: y,
            onChange: (x) => S(x.target.value),
            placeholder: "Your name",
            required: !0,
            disabled: i
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ s.jsx("label", { htmlFor: "signupEmail", children: "Email Address" }),
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "email",
            id: "signupEmail",
            value: d,
            onChange: (x) => h(x.target.value),
            placeholder: "your@email.com",
            required: !0,
            disabled: i
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ s.jsx("label", { htmlFor: "signupPassword", children: "Password" }),
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "password",
            id: "signupPassword",
            value: f,
            onChange: (x) => {
              p(x.target.value), k(x.target.value);
            },
            placeholder: "Create a password",
            required: !0,
            disabled: i
          }
        ),
        w && /* @__PURE__ */ s.jsxs("div", { className: `password-strength ${w.className}`, children: [
          "Password strength: ",
          w.text
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ s.jsx("label", { htmlFor: "confirmPassword", children: "Confirm Password" }),
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "password",
            id: "confirmPassword",
            value: C,
            onChange: (x) => j(x.target.value),
            placeholder: "Confirm your password",
            required: !0,
            disabled: i
          }
        )
      ] }),
      /* @__PURE__ */ s.jsx(
        "button",
        {
          type: "submit",
          className: "btn primary",
          disabled: i,
          children: i ? "Creating account..." : "Create Account"
        }
      )
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: "auth-divider", children: "or continue with" }),
    /* @__PURE__ */ s.jsxs("div", { className: "social-logins", children: [
      /* @__PURE__ */ s.jsx(
        "button",
        {
          className: "btn social",
          onClick: () => A("Google sign-in will be available soon", "info"),
          disabled: i,
          children: "Google"
        }
      ),
      /* @__PURE__ */ s.jsx(
        "button",
        {
          className: "btn social",
          onClick: () => A("GitHub sign-in will be available soon", "info"),
          disabled: i,
          children: "GitHub"
        }
      )
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: "auth-footer", children: "By signing up, you agree to our terms of service and privacy policy." })
  ] }) });
}, cg = () => {
  const [e, t] = _([]), [r, n] = _(!0), [i, a] = _(null), [o, l] = _(""), [c, u] = _("all"), [d, h] = _(!1), [f, p] = _(null), [y, S] = _({
    name: "",
    title: "",
    description: "",
    product_type: "book",
    cover_image_url: "",
    active: !0,
    status: "draft"
  }), [C, j] = _({
    amount: "",
    currency: "USD",
    interval: "",
    nickname: "",
    trial_period_days: 0
  }), w = async () => {
    try {
      n(!0);
      const b = await fetch("/api/products?include_prices=true");
      if (!b.ok) throw new Error("Failed to fetch products");
      const L = await b.json();
      t(L.products || []);
    } catch (b) {
      a(b instanceof Error ? b.message : "Failed to fetch products");
    } finally {
      n(!1);
    }
  };
  xe(() => {
    w();
  }, []);
  const P = e.filter((b) => {
    const L = b.name.toLowerCase().includes(o.toLowerCase()) || b.title.toLowerCase().includes(o.toLowerCase()), G = c === "all" || b.product_type === c;
    return L && G;
  }), D = async (b) => {
    b.preventDefault();
    try {
      const L = f ? `/api/products/${f.id}` : "/api/products", se = await fetch(L, {
        method: f ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(y)
      });
      if (!se.ok) {
        const T = await se.json();
        throw new Error(T.message || "Failed to save product");
      }
      await w(), O(), h(!1);
    } catch (L) {
      a(L instanceof Error ? L.message : "Failed to save product");
    }
  }, A = async (b) => {
    if (confirm(`Are you sure you want to delete "${b.name}"? This will deactivate it in Stripe but not permanently delete it.`))
      try {
        if (!(await fetch(`/api/products/${b.id}`, {
          method: "DELETE"
        })).ok) throw new Error("Failed to delete product");
        await w();
      } catch (L) {
        a(L instanceof Error ? L.message : "Failed to delete product");
      }
  }, I = async (b) => {
    try {
      if (!(await fetch(`/api/products/${b.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !b.active })
      })).ok) throw new Error("Failed to update product");
      await w();
    } catch (L) {
      a(L instanceof Error ? L.message : "Failed to update product");
    }
  }, O = () => {
    S({
      name: "",
      title: "",
      description: "",
      product_type: "book",
      cover_image_url: "",
      active: !0,
      status: "draft"
    }), p(null);
  }, k = (b) => {
    p(b), S({
      name: b.name,
      title: b.title,
      description: b.description,
      product_type: b.product_type,
      cover_image_url: b.cover_image_url || "",
      active: b.active,
      status: b.status
    }), h(!0);
  }, x = (b) => {
    switch (b) {
      case "book":
        return /* @__PURE__ */ s.jsx(Oe, { className: "w-4 h-4" });
      case "subscription":
        return /* @__PURE__ */ s.jsx(gt, { className: "w-4 h-4" });
      case "bundle":
        return /* @__PURE__ */ s.jsx(Ze, { className: "w-4 h-4" });
      default:
        return /* @__PURE__ */ s.jsx(Ye, { className: "w-4 h-4" });
    }
  }, E = (b, L) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: L.toUpperCase()
  }).format(b / 100);
  return r ? /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-center min-h-[400px]", children: [
    /* @__PURE__ */ s.jsx(Se, { className: "w-8 h-8 animate-spin text-primary" }),
    /* @__PURE__ */ s.jsx("span", { className: "ml-3 text-lg", children: "Loading products..." })
  ] }) : /* @__PURE__ */ s.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0", children: [
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-3", children: [
          /* @__PURE__ */ s.jsx(Ze, { className: "w-8 h-8 text-primary" }),
          "Product Management"
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground mt-2", children: "Manage your books, subscriptions, and bundles with integrated Stripe pricing" })
      ] }),
      /* @__PURE__ */ s.jsxs(
        "button",
        {
          onClick: () => {
            O(), h(!0);
          },
          className: "bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center gap-2",
          children: [
            /* @__PURE__ */ s.jsx(ft, { className: "w-5 h-5" }),
            "Add Product"
          ]
        }
      )
    ] }),
    i && /* @__PURE__ */ s.jsxs("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ s.jsx(It, { className: "w-5 h-5 text-red-500 flex-shrink-0" }),
      /* @__PURE__ */ s.jsx("span", { className: "text-red-700 dark:text-red-400", children: i }),
      /* @__PURE__ */ s.jsx(
        "button",
        {
          onClick: () => a(null),
          className: "ml-auto text-red-500 hover:text-red-600",
          children: /* @__PURE__ */ s.jsx(Ee, { className: "w-5 h-5" })
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ s.jsx(bt, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "text",
            placeholder: "Search products...",
            value: o,
            onChange: (b) => l(b.target.value),
            className: "w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ s.jsx(Gt, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
        /* @__PURE__ */ s.jsxs(
          "select",
          {
            value: c,
            onChange: (b) => u(b.target.value),
            className: "pl-10 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
            children: [
              /* @__PURE__ */ s.jsx("option", { value: "all", children: "All Types" }),
              /* @__PURE__ */ s.jsx("option", { value: "book", children: "Books" }),
              /* @__PURE__ */ s.jsx("option", { value: "subscription", children: "Subscriptions" }),
              /* @__PURE__ */ s.jsx("option", { value: "bundle", children: "Bundles" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: P.map((b) => /* @__PURE__ */ s.jsxs("div", { className: "bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow", children: [
      /* @__PURE__ */ s.jsx("div", { className: "aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 overflow-hidden", children: b.cover_image_url ? /* @__PURE__ */ s.jsx(
        "img",
        {
          src: b.cover_image_url,
          alt: b.title,
          className: "w-full h-full object-cover"
        }
      ) : /* @__PURE__ */ s.jsx("div", { className: "w-full h-full flex items-center justify-center", children: x(b.product_type) }) }),
      /* @__PURE__ */ s.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ s.jsx("h3", { className: "font-semibold text-foreground line-clamp-2", children: b.title }),
            /* @__PURE__ */ s.jsxs("p", { className: "text-sm text-muted-foreground capitalize flex items-center gap-2 mt-1", children: [
              x(b.product_type),
              b.product_type
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ s.jsx(
            "button",
            {
              onClick: () => I(b),
              className: `p-1.5 rounded-lg transition-colors ${b.active ? "bg-green-100 text-green-600 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`,
              title: b.active ? "Active" : "Inactive",
              children: b.active ? /* @__PURE__ */ s.jsx(tt, { className: "w-4 h-4" }) : /* @__PURE__ */ s.jsx(Gi, { className: "w-4 h-4" })
            }
          ) })
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "text-sm text-muted-foreground line-clamp-2", children: b.description || "No description available" }),
        /* @__PURE__ */ s.jsxs("div", { className: "space-y-2", children: [
          b.prices && b.prices.length > 0 ? b.prices.slice(0, 2).map((L) => /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ s.jsxs("span", { className: "text-muted-foreground", children: [
              L.nickname || "Standard",
              L.interval && ` (${L.interval}ly)`
            ] }),
            /* @__PURE__ */ s.jsx("span", { className: "font-medium text-foreground", children: E(L.amount_cents, L.currency) })
          ] }, L.id)) : /* @__PURE__ */ s.jsx("p", { className: "text-sm text-muted-foreground italic", children: "No prices set" }),
          b.prices && b.prices.length > 2 && /* @__PURE__ */ s.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "+",
            b.prices.length - 2,
            " more prices"
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ s.jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${b.status === "published" ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" : b.status === "draft" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"}`, children: b.status }),
          /* @__PURE__ */ s.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(b.updated_at).toLocaleDateString() })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between pt-2 border-t border-border", children: [
          /* @__PURE__ */ s.jsxs(
            "button",
            {
              onClick: () => k(b),
              className: "text-primary hover:text-primary-dark flex items-center gap-2 text-sm font-medium",
              children: [
                /* @__PURE__ */ s.jsx(us, { className: "w-4 h-4" }),
                "Edit"
              ]
            }
          ),
          /* @__PURE__ */ s.jsxs(
            "button",
            {
              onClick: () => A(b),
              className: "text-red-500 hover:text-red-600 flex items-center gap-2 text-sm font-medium",
              children: [
                /* @__PURE__ */ s.jsx(Ts, { className: "w-4 h-4" }),
                "Delete"
              ]
            }
          )
        ] })
      ] })
    ] }, b.id)) }),
    P.length === 0 && !r && /* @__PURE__ */ s.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ s.jsx(Ze, { className: "w-16 h-16 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "No products found" }),
      /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground mb-4", children: o || c !== "all" ? "Try adjusting your search or filters" : "Get started by creating your first product" }),
      /* @__PURE__ */ s.jsx(
        "button",
        {
          onClick: () => {
            O(), h(!0);
          },
          className: "bg-primary text-white px-6 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors",
          children: "Create Product"
        }
      )
    ] }),
    d && /* @__PURE__ */ s.jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ s.jsxs("div", { className: "bg-background rounded-xl shadow-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between p-6 border-b border-border", children: [
        /* @__PURE__ */ s.jsx("h2", { className: "text-xl font-semibold text-foreground", children: f ? "Edit Product" : "Create Product" }),
        /* @__PURE__ */ s.jsx(
          "button",
          {
            onClick: () => {
              h(!1), O();
            },
            className: "text-muted-foreground hover:text-foreground",
            children: /* @__PURE__ */ s.jsx(Ee, { className: "w-6 h-6" })
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("form", { onSubmit: D, className: "p-6 space-y-6", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Product Name *" }),
            /* @__PURE__ */ s.jsx(
              "input",
              {
                type: "text",
                required: !0,
                value: y.name,
                onChange: (b) => S({ ...y, name: b.target.value }),
                className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                placeholder: "Internal product name"
              }
            )
          ] }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Display Title *" }),
            /* @__PURE__ */ s.jsx(
              "input",
              {
                type: "text",
                required: !0,
                value: y.title,
                onChange: (b) => S({ ...y, title: b.target.value }),
                className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                placeholder: "Public display title"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Description" }),
          /* @__PURE__ */ s.jsx(
            "textarea",
            {
              value: y.description,
              onChange: (b) => S({ ...y, description: b.target.value }),
              rows: 3,
              className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              placeholder: "Product description..."
            }
          )
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Product Type" }),
            /* @__PURE__ */ s.jsxs(
              "select",
              {
                value: y.product_type,
                onChange: (b) => S({ ...y, product_type: b.target.value }),
                className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                children: [
                  /* @__PURE__ */ s.jsx("option", { value: "book", children: "Book (One-time purchase)" }),
                  /* @__PURE__ */ s.jsx("option", { value: "subscription", children: "Subscription" }),
                  /* @__PURE__ */ s.jsx("option", { value: "bundle", children: "Bundle" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Status" }),
            /* @__PURE__ */ s.jsxs(
              "select",
              {
                value: y.status,
                onChange: (b) => S({ ...y, status: b.target.value }),
                className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                children: [
                  /* @__PURE__ */ s.jsx("option", { value: "draft", children: "Draft" }),
                  /* @__PURE__ */ s.jsx("option", { value: "published", children: "Published" }),
                  /* @__PURE__ */ s.jsx("option", { value: "archived", children: "Archived" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Cover Image URL" }),
          /* @__PURE__ */ s.jsx(
            "input",
            {
              type: "url",
              value: y.cover_image_url,
              onChange: (b) => S({ ...y, cover_image_url: b.target.value }),
              className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              placeholder: "https://example.com/cover.jpg"
            }
          )
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ s.jsx(
            "input",
            {
              type: "checkbox",
              id: "active",
              checked: y.active,
              onChange: (b) => S({ ...y, active: b.target.checked }),
              className: "w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            }
          ),
          /* @__PURE__ */ s.jsx("label", { htmlFor: "active", className: "ml-2 text-sm font-medium text-foreground", children: "Product is active (visible to customers)" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-end gap-3 pt-4 border-t border-border", children: [
          /* @__PURE__ */ s.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                h(!1), O();
              },
              className: "px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ s.jsxs(
            "button",
            {
              type: "submit",
              className: "bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2",
              children: [
                /* @__PURE__ */ s.jsx(Ki, { className: "w-4 h-4" }),
                f ? "Update Product" : "Create Product"
              ]
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}, dg = () => {
  const [e, t] = _("orders"), [r, n] = _([]), [i, a] = _([]), [o, l] = _(!0), [c, u] = _(null), [d, h] = _(""), [f, p] = _("all"), [y, S] = _("all"), [C, j] = _(null), [w, P] = _(null), D = async () => {
    try {
      const T = await fetch("/api/admin/orders?include_details=true");
      if (!T.ok) throw new Error("Failed to fetch orders");
      const U = await T.json();
      n(U.orders || []);
    } catch (T) {
      u(T instanceof Error ? T.message : "Failed to fetch orders");
    }
  }, A = async () => {
    try {
      const T = await fetch("/api/admin/subscriptions?include_details=true");
      if (!T.ok) throw new Error("Failed to fetch subscriptions");
      const U = await T.json();
      a(U.subscriptions || []);
    } catch (T) {
      u(T instanceof Error ? T.message : "Failed to fetch subscriptions");
    }
  }, I = async () => {
    try {
      l(!0), u(null), await Promise.all([D(), A()]);
    } catch {
      u("Failed to fetch data");
    } finally {
      l(!1);
    }
  };
  xe(() => {
    I();
  }, []);
  const O = r.filter((T) => {
    var B, q, ie, Ne, v;
    const U = T.id.toLowerCase().includes(d.toLowerCase()) || ((B = T.customer_email) == null ? void 0 : B.toLowerCase().includes(d.toLowerCase())) || ((ie = (q = T.user) == null ? void 0 : q.email) == null ? void 0 : ie.toLowerCase().includes(d.toLowerCase())) || ((v = (Ne = T.product) == null ? void 0 : Ne.title) == null ? void 0 : v.toLowerCase().includes(d.toLowerCase())), $ = f === "all" || T.status === f;
    return U && $;
  }), k = i.filter((T) => {
    var B, q;
    const U = T.id.toLowerCase().includes(d.toLowerCase()) || T.provider_subscription_id.toLowerCase().includes(d.toLowerCase()) || ((q = (B = T.user) == null ? void 0 : B.email) == null ? void 0 : q.toLowerCase().includes(d.toLowerCase())), $ = y === "all" || T.status === y;
    return U && $;
  }), x = (T, U = "USD") => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: U.toUpperCase()
  }).format(T / 100), E = (T) => new Date(T).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }), b = (T) => {
    switch (T) {
      case "completed":
        return { color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/20", icon: pt };
      case "pending":
        return { color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/20", icon: Et };
      case "failed":
        return { color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/20", icon: ts };
      case "cancelled":
        return { color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-900/20", icon: ts };
      case "expired":
        return { color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/20", icon: hs };
      default:
        return { color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-900/20", icon: Et };
    }
  }, L = (T) => {
    switch (T) {
      case "active":
        return { color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/20", icon: pt };
      case "trialing":
        return { color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/20", icon: Et };
      case "past_due":
        return { color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/20", icon: hs };
      case "canceled":
        return { color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/20", icon: ts };
      default:
        return { color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-900/20", icon: Et };
    }
  }, G = async (T) => {
    if (confirm("Are you sure you want to issue a refund for this order?"))
      try {
        if (!(await fetch(`/api/admin/orders/${T}/refund`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        })).ok) throw new Error("Failed to process refund");
        await D(), j(null);
      } catch (U) {
        u(U instanceof Error ? U.message : "Failed to process refund");
      }
  }, se = async (T) => {
    if (confirm("Are you sure you want to cancel this subscription?"))
      try {
        if (!(await fetch(`/api/admin/subscriptions/${T}/cancel`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        })).ok) throw new Error("Failed to cancel subscription");
        await A(), P(null);
      } catch (U) {
        u(U instanceof Error ? U.message : "Failed to cancel subscription");
      }
  };
  return o ? /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-center min-h-[400px]", children: [
    /* @__PURE__ */ s.jsx(Se, { className: "w-8 h-8 animate-spin text-primary" }),
    /* @__PURE__ */ s.jsx("span", { className: "ml-3 text-lg", children: "Loading orders and subscriptions..." })
  ] }) : /* @__PURE__ */ s.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0", children: [
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-3", children: [
          /* @__PURE__ */ s.jsx(et, { className: "w-8 h-8 text-primary" }),
          "Order Management"
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground mt-2", children: "Track and manage customer orders, subscriptions, and payments" })
      ] }),
      /* @__PURE__ */ s.jsxs(
        "button",
        {
          onClick: I,
          className: "bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center gap-2",
          children: [
            /* @__PURE__ */ s.jsx(Se, { className: "w-5 h-5" }),
            "Refresh"
          ]
        }
      )
    ] }),
    c && /* @__PURE__ */ s.jsxs("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ s.jsx(hs, { className: "w-5 h-5 text-red-500 flex-shrink-0" }),
      /* @__PURE__ */ s.jsx("span", { className: "text-red-700 dark:text-red-400", children: c })
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: "border-b border-border", children: /* @__PURE__ */ s.jsxs("nav", { className: "-mb-px flex space-x-8", children: [
      /* @__PURE__ */ s.jsxs(
        "button",
        {
          onClick: () => t("orders"),
          className: `py-2 px-1 border-b-2 font-medium text-sm ${e === "orders" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"}`,
          children: [
            "Orders (",
            r.length,
            ")"
          ]
        }
      ),
      /* @__PURE__ */ s.jsxs(
        "button",
        {
          onClick: () => t("subscriptions"),
          className: `py-2 px-1 border-b-2 font-medium text-sm ${e === "subscriptions" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"}`,
          children: [
            "Subscriptions (",
            i.length,
            ")"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ s.jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ s.jsx(bt, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "text",
            placeholder: `Search ${e}...`,
            value: d,
            onChange: (T) => h(T.target.value),
            className: "w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ s.jsx(Gt, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
        /* @__PURE__ */ s.jsxs(
          "select",
          {
            value: e === "orders" ? f : y,
            onChange: (T) => {
              e === "orders" ? p(T.target.value) : S(T.target.value);
            },
            className: "pl-10 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
            children: [
              /* @__PURE__ */ s.jsx("option", { value: "all", children: "All Status" }),
              e === "orders" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
                /* @__PURE__ */ s.jsx("option", { value: "completed", children: "Completed" }),
                /* @__PURE__ */ s.jsx("option", { value: "pending", children: "Pending" }),
                /* @__PURE__ */ s.jsx("option", { value: "failed", children: "Failed" }),
                /* @__PURE__ */ s.jsx("option", { value: "cancelled", children: "Cancelled" }),
                /* @__PURE__ */ s.jsx("option", { value: "expired", children: "Expired" })
              ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
                /* @__PURE__ */ s.jsx("option", { value: "active", children: "Active" }),
                /* @__PURE__ */ s.jsx("option", { value: "trialing", children: "Trialing" }),
                /* @__PURE__ */ s.jsx("option", { value: "past_due", children: "Past Due" }),
                /* @__PURE__ */ s.jsx("option", { value: "canceled", children: "Canceled" })
              ] })
            ]
          }
        )
      ] })
    ] }),
    e === "orders" && /* @__PURE__ */ s.jsx("div", { className: "space-y-4", children: O.length === 0 ? /* @__PURE__ */ s.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ s.jsx(et, { className: "w-16 h-16 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "No orders found" }),
      /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground", children: d || f !== "all" ? "Try adjusting your search or filters" : "Orders will appear here when customers make purchases" })
    ] }) : /* @__PURE__ */ s.jsx("div", { className: "grid gap-4", children: O.map((T) => {
      var B, q;
      const U = b(T.status), $ = U.icon;
      return /* @__PURE__ */ s.jsx("div", { className: "bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow", children: /* @__PURE__ */ s.jsx("div", { className: "flex items-start justify-between", children: /* @__PURE__ */ s.jsxs("div", { className: "flex-1 space-y-3", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ s.jsxs("h3", { className: "text-lg font-semibold text-foreground", children: [
              "Order #",
              T.id.slice(-8)
            ] }),
            /* @__PURE__ */ s.jsxs("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${U.bg} ${U.color}`, children: [
              /* @__PURE__ */ s.jsx($, { className: "w-3 h-3 mr-1" }),
              T.status
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ s.jsx("p", { className: "text-lg font-bold text-foreground", children: x(T.amount_cents, T.currency) }),
            /* @__PURE__ */ s.jsx("p", { className: "text-sm text-muted-foreground", children: E(T.created_at) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ s.jsx(yn, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ s.jsx("span", { className: "text-foreground", children: T.customer_email || ((B = T.user) == null ? void 0 : B.email) || "No email" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ s.jsx(Ze, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ s.jsx("span", { className: "text-foreground", children: ((q = T.product) == null ? void 0 : q.title) || "Unknown Product" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ s.jsx(bn, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ s.jsxs("span", { className: "text-foreground capitalize", children: [
              T.provider,
              " Payment"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between pt-3 border-t border-border", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ s.jsxs(
              "button",
              {
                onClick: () => j(T),
                className: "text-primary hover:text-primary-dark flex items-center gap-2 text-sm font-medium",
                children: [
                  /* @__PURE__ */ s.jsx(tt, { className: "w-4 h-4" }),
                  "View Details"
                ]
              }
            ),
            T.status === "completed" && /* @__PURE__ */ s.jsxs(
              "button",
              {
                onClick: () => G(T.id),
                className: "text-orange-600 hover:text-orange-700 flex items-center gap-2 text-sm font-medium",
                children: [
                  /* @__PURE__ */ s.jsx(jr, { className: "w-4 h-4" }),
                  "Refund"
                ]
              }
            )
          ] }),
          T.provider_payment_intent_id && /* @__PURE__ */ s.jsxs(
            "button",
            {
              onClick: () => window.open(`https://dashboard.stripe.com/payments/${T.provider_payment_intent_id}`, "_blank"),
              className: "text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm",
              children: [
                /* @__PURE__ */ s.jsx(vn, { className: "w-4 h-4" }),
                "View in Stripe"
              ]
            }
          )
        ] })
      ] }) }) }, T.id);
    }) }) }),
    e === "subscriptions" && /* @__PURE__ */ s.jsx("div", { className: "space-y-4", children: k.length === 0 ? /* @__PURE__ */ s.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ s.jsx(gt, { className: "w-16 h-16 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "No subscriptions found" }),
      /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground", children: d || y !== "all" ? "Try adjusting your search or filters" : "Subscriptions will appear here when customers subscribe" })
    ] }) : /* @__PURE__ */ s.jsx("div", { className: "grid gap-4", children: k.map((T) => {
      var B, q;
      const U = L(T.status), $ = U.icon;
      return /* @__PURE__ */ s.jsx("div", { className: "bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow", children: /* @__PURE__ */ s.jsx("div", { className: "flex items-start justify-between", children: /* @__PURE__ */ s.jsxs("div", { className: "flex-1 space-y-3", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ s.jsxs("h3", { className: "text-lg font-semibold text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ s.jsx(gt, { className: "w-5 h-5 text-primary" }),
              "Subscription #",
              T.id.slice(-8)
            ] }),
            /* @__PURE__ */ s.jsxs("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${U.bg} ${U.color}`, children: [
              /* @__PURE__ */ s.jsx($, { className: "w-3 h-3 mr-1" }),
              T.status
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ s.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "Created ",
              E(T.created_at)
            ] }),
            T.current_period_end && /* @__PURE__ */ s.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "Next billing: ",
              E(T.current_period_end)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ s.jsx(yn, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ s.jsx("span", { className: "text-foreground", children: ((B = T.user) == null ? void 0 : B.email) || "No email" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ s.jsx(vr, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ s.jsxs("span", { className: "text-foreground", children: [
              ((q = T.plan) == null ? void 0 : q.interval) || "Unknown",
              " billing"
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ s.jsx(bn, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ s.jsxs("span", { className: "text-foreground capitalize", children: [
              T.provider,
              " Subscription"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between pt-3 border-t border-border", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ s.jsxs(
              "button",
              {
                onClick: () => P(T),
                className: "text-primary hover:text-primary-dark flex items-center gap-2 text-sm font-medium",
                children: [
                  /* @__PURE__ */ s.jsx(tt, { className: "w-4 h-4" }),
                  "View Details"
                ]
              }
            ),
            T.status === "active" && !T.cancel_at_period_end && /* @__PURE__ */ s.jsxs(
              "button",
              {
                onClick: () => se(T.id),
                className: "text-red-600 hover:text-red-700 flex items-center gap-2 text-sm font-medium",
                children: [
                  /* @__PURE__ */ s.jsx(ts, { className: "w-4 h-4" }),
                  "Cancel"
                ]
              }
            )
          ] }),
          T.provider_subscription_id && /* @__PURE__ */ s.jsxs(
            "button",
            {
              onClick: () => window.open(`https://dashboard.stripe.com/subscriptions/${T.provider_subscription_id}`, "_blank"),
              className: "text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm",
              children: [
                /* @__PURE__ */ s.jsx(vn, { className: "w-4 h-4" }),
                "View in Stripe"
              ]
            }
          )
        ] })
      ] }) }) }, T.id);
    }) }) })
  ] });
}, ug = () => {
  const [e, t] = _([]), [r, n] = _(null), [i, a] = _(!0), [o, l] = _(null), [c, u] = _(""), [d, h] = _("all"), [f, p] = _("sales"), [y, S] = _("desc"), C = async () => {
    try {
      const x = await fetch("/api/admin/inventory");
      if (!x.ok) throw new Error("Failed to fetch inventory data");
      const E = await x.json();
      t(E.inventory || []);
    } catch (x) {
      l(x instanceof Error ? x.message : "Failed to fetch inventory");
    }
  }, j = async () => {
    try {
      const x = await fetch("/api/admin/metrics");
      if (!x.ok) throw new Error("Failed to fetch metrics");
      const E = await x.json();
      n(E.metrics);
    } catch (x) {
      l(x instanceof Error ? x.message : "Failed to fetch metrics");
    }
  }, w = async () => {
    try {
      a(!0), l(null), await Promise.all([C(), j()]);
    } catch {
      l("Failed to fetch data");
    } finally {
      a(!1);
    }
  };
  xe(() => {
    w();
  }, []);
  const P = e.filter((x) => {
    const E = x.product.name.toLowerCase().includes(c.toLowerCase()) || x.product.title.toLowerCase().includes(c.toLowerCase()), b = d === "all" || x.product.product_type === d;
    return E && b;
  }).sort((x, E) => {
    let b, L;
    switch (f) {
      case "name":
        b = x.product.title.toLowerCase(), L = E.product.title.toLowerCase();
        break;
      case "sales":
        b = x.total_sales, L = E.total_sales;
        break;
      case "revenue":
        b = x.revenue, L = E.revenue;
        break;
      case "recent_activity":
        b = x.last_sale ? new Date(x.last_sale).getTime() : 0, L = E.last_sale ? new Date(E.last_sale).getTime() : 0;
        break;
      default:
        b = x.total_sales, L = E.total_sales;
    }
    return y === "asc" ? b > L ? 1 : -1 : b < L ? 1 : -1;
  }), D = (x) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(x), A = (x) => `${x >= 0 ? "+" : ""}${x.toFixed(1)}%`, I = (x) => new Date(x).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }), O = (x) => {
    switch (x) {
      case "book":
        return /* @__PURE__ */ s.jsx(Oe, { className: "w-4 h-4" });
      case "subscription":
        return /* @__PURE__ */ s.jsx(gt, { className: "w-4 h-4" });
      case "bundle":
        return /* @__PURE__ */ s.jsx(ss, { className: "w-4 h-4" });
      default:
        return /* @__PURE__ */ s.jsx(Ye, { className: "w-4 h-4" });
    }
  }, k = (x, E) => {
    const b = E > 0 ? (x - E) / E * 100 : 0;
    return b > 10 ? { icon: it, color: "text-green-600", bg: "bg-green-100" } : b < -10 ? { icon: rs, color: "text-red-600", bg: "bg-red-100" } : { icon: ds, color: "text-yellow-600", bg: "bg-yellow-100" };
  };
  return i ? /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-center min-h-[400px]", children: [
    /* @__PURE__ */ s.jsx(Se, { className: "w-8 h-8 animate-spin text-primary" }),
    /* @__PURE__ */ s.jsx("span", { className: "ml-3 text-lg", children: "Loading inventory data..." })
  ] }) : /* @__PURE__ */ s.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0", children: [
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-3", children: [
          /* @__PURE__ */ s.jsx(ss, { className: "w-8 h-8 text-primary" }),
          "Inventory Management"
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground mt-2", children: "Track digital product performance, sales analytics, and inventory metrics" })
      ] }),
      /* @__PURE__ */ s.jsxs(
        "button",
        {
          onClick: w,
          className: "bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center gap-2",
          children: [
            /* @__PURE__ */ s.jsx(Se, { className: "w-5 h-5" }),
            "Refresh Data"
          ]
        }
      )
    ] }),
    o && /* @__PURE__ */ s.jsxs("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ s.jsx(hs, { className: "w-5 h-5 text-red-500 flex-shrink-0" }),
      /* @__PURE__ */ s.jsx("span", { className: "text-red-700 dark:text-red-400", children: o })
    ] }),
    r && /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ s.jsx("div", { className: "bg-card border border-border rounded-xl p-6", children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Total Revenue" }),
          /* @__PURE__ */ s.jsx("p", { className: "text-2xl font-bold text-foreground", children: D(r.total_revenue) }),
          /* @__PURE__ */ s.jsxs("p", { className: `text-sm flex items-center gap-1 mt-1 ${r.revenue_growth >= 0 ? "text-green-600" : "text-red-600"}`, children: [
            r.revenue_growth >= 0 ? /* @__PURE__ */ s.jsx(it, { className: "w-4 h-4" }) : /* @__PURE__ */ s.jsx(rs, { className: "w-4 h-4" }),
            A(r.revenue_growth),
            " this month"
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ s.jsx(jr, { className: "w-6 h-6 text-green-600" }) })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "bg-card border border-border rounded-xl p-6", children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Total Sales" }),
          /* @__PURE__ */ s.jsx("p", { className: "text-2xl font-bold text-foreground", children: r.total_sales.toLocaleString() }),
          /* @__PURE__ */ s.jsxs("p", { className: `text-sm flex items-center gap-1 mt-1 ${r.sales_growth >= 0 ? "text-green-600" : "text-red-600"}`, children: [
            r.sales_growth >= 0 ? /* @__PURE__ */ s.jsx(it, { className: "w-4 h-4" }) : /* @__PURE__ */ s.jsx(rs, { className: "w-4 h-4" }),
            A(r.sales_growth),
            " this month"
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ s.jsx(ds, { className: "w-6 h-6 text-blue-600" }) })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "bg-card border border-border rounded-xl p-6", children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Active Subscriptions" }),
          /* @__PURE__ */ s.jsx("p", { className: "text-2xl font-bold text-foreground", children: r.active_subscriptions.toLocaleString() }),
          /* @__PURE__ */ s.jsxs("p", { className: `text-sm flex items-center gap-1 mt-1 ${r.subscription_growth >= 0 ? "text-green-600" : "text-red-600"}`, children: [
            r.subscription_growth >= 0 ? /* @__PURE__ */ s.jsx(it, { className: "w-4 h-4" }) : /* @__PURE__ */ s.jsx(rs, { className: "w-4 h-4" }),
            A(r.subscription_growth),
            " this month"
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ s.jsx(gt, { className: "w-6 h-6 text-purple-600" }) })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "bg-card border border-border rounded-xl p-6", children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Total Products" }),
          /* @__PURE__ */ s.jsx("p", { className: "text-2xl font-bold text-foreground", children: r.total_products }),
          /* @__PURE__ */ s.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
            r.total_books,
            " books, ",
            r.total_subscriptions,
            " subscriptions"
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ s.jsx(ss, { className: "w-6 h-6 text-orange-600" }) })
      ] }) })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "flex flex-col lg:flex-row gap-4", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ s.jsx(bt, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "text",
            placeholder: "Search products...",
            value: c,
            onChange: (x) => u(x.target.value),
            className: "w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ s.jsx(Gt, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
          /* @__PURE__ */ s.jsxs(
            "select",
            {
              value: d,
              onChange: (x) => h(x.target.value),
              className: "pl-10 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              children: [
                /* @__PURE__ */ s.jsx("option", { value: "all", children: "All Types" }),
                /* @__PURE__ */ s.jsx("option", { value: "book", children: "Books" }),
                /* @__PURE__ */ s.jsx("option", { value: "subscription", children: "Subscriptions" }),
                /* @__PURE__ */ s.jsx("option", { value: "bundle", children: "Bundles" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ s.jsxs(
          "select",
          {
            value: `${f}-${y}`,
            onChange: (x) => {
              const [E, b] = x.target.value.split("-");
              p(E), S(b);
            },
            className: "px-3 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
            children: [
              /* @__PURE__ */ s.jsx("option", { value: "sales-desc", children: "Sales (High to Low)" }),
              /* @__PURE__ */ s.jsx("option", { value: "sales-asc", children: "Sales (Low to High)" }),
              /* @__PURE__ */ s.jsx("option", { value: "revenue-desc", children: "Revenue (High to Low)" }),
              /* @__PURE__ */ s.jsx("option", { value: "revenue-asc", children: "Revenue (Low to High)" }),
              /* @__PURE__ */ s.jsx("option", { value: "name-asc", children: "Name (A-Z)" }),
              /* @__PURE__ */ s.jsx("option", { value: "name-desc", children: "Name (Z-A)" }),
              /* @__PURE__ */ s.jsx("option", { value: "recent_activity-desc", children: "Most Recent Activity" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: "bg-card border border-border rounded-xl overflow-hidden", children: /* @__PURE__ */ s.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ s.jsxs("table", { className: "w-full", children: [
      /* @__PURE__ */ s.jsx("thead", { className: "bg-muted/50 border-b border-border", children: /* @__PURE__ */ s.jsxs("tr", { children: [
        /* @__PURE__ */ s.jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Product" }),
        /* @__PURE__ */ s.jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Type" }),
        /* @__PURE__ */ s.jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Total Sales" }),
        /* @__PURE__ */ s.jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Recent Sales (30d)" }),
        /* @__PURE__ */ s.jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Revenue" }),
        /* @__PURE__ */ s.jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Performance" }),
        /* @__PURE__ */ s.jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Last Sale" }),
        /* @__PURE__ */ s.jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ s.jsx("tbody", { className: "divide-y divide-border", children: P.length === 0 ? /* @__PURE__ */ s.jsx("tr", { children: /* @__PURE__ */ s.jsxs("td", { colSpan: 8, className: "px-6 py-12 text-center", children: [
        /* @__PURE__ */ s.jsx(ss, { className: "w-12 h-12 text-muted-foreground mx-auto mb-3" }),
        /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-medium text-foreground mb-1", children: "No products found" }),
        /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground", children: c || d !== "all" ? "Try adjusting your search or filters" : "Products will appear here once they have sales data" })
      ] }) }) : P.map((x) => {
        const E = k(x.recent_sales, x.total_sales - x.recent_sales), b = E.icon;
        return /* @__PURE__ */ s.jsxs("tr", { className: "hover:bg-muted/30", children: [
          /* @__PURE__ */ s.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ s.jsx("div", { className: "flex items-center", children: /* @__PURE__ */ s.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ s.jsx("div", { className: "text-sm font-medium text-foreground", children: x.product.title }),
            /* @__PURE__ */ s.jsx("div", { className: "text-sm text-muted-foreground", children: x.product.name })
          ] }) }) }),
          /* @__PURE__ */ s.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
            O(x.product.product_type),
            /* @__PURE__ */ s.jsx("span", { className: "text-sm text-foreground capitalize", children: x.product.product_type })
          ] }) }),
          /* @__PURE__ */ s.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ s.jsx("div", { className: "text-sm font-medium text-foreground", children: x.total_sales.toLocaleString() }) }),
          /* @__PURE__ */ s.jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ s.jsx("div", { className: "text-sm font-medium text-foreground", children: x.recent_sales.toLocaleString() }),
            x.downloads && /* @__PURE__ */ s.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              x.downloads.toLocaleString(),
              " downloads"
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ s.jsx("div", { className: "text-sm font-medium text-foreground", children: D(x.revenue) }),
            /* @__PURE__ */ s.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              D(x.revenue_recent),
              " recent"
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ s.jsxs("div", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${E.bg} ${E.color}`, children: [
              /* @__PURE__ */ s.jsx(b, { className: "w-3 h-3 mr-1" }),
              x.recent_sales > x.total_sales - x.recent_sales ? "Growing" : x.recent_sales < (x.total_sales - x.recent_sales) / 2 ? "Declining" : "Stable"
            ] }),
            x.active_subscriptions !== void 0 && /* @__PURE__ */ s.jsxs("div", { className: "text-xs text-muted-foreground mt-1", children: [
              x.active_subscriptions,
              " active subs"
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ s.jsx("div", { className: "text-sm text-foreground", children: x.last_sale ? I(x.last_sale) : "Never" }) }),
          /* @__PURE__ */ s.jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ s.jsx("button", { className: "text-primary hover:text-primary-dark p-1", children: /* @__PURE__ */ s.jsx(tt, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ s.jsx("button", { className: "text-muted-foreground hover:text-foreground p-1", children: /* @__PURE__ */ s.jsx(ds, { className: "w-4 h-4" }) })
          ] }) })
        ] }, x.id);
      }) })
    ] }) }) })
  ] });
}, hg = () => {
  const [e, t] = _([]), [r, n] = _([]), [i, a] = _(!0), [o, l] = _(null), [c, u] = _("works"), [d, h] = _(""), [f, p] = _("all"), [y, S] = _("all"), [C, j] = _(!1), [w, P] = _(null), [D, A] = _(null), [I, O] = _(!1), [k, x] = _({
    title: "",
    type: "book",
    description: "",
    status: "planning",
    progress_percentage: 0,
    release_date: "",
    estimated_release: "",
    cover_image_url: "",
    is_featured: !1,
    is_premium: !1,
    is_free: !0,
    target_word_count: void 0
  }), E = async () => {
    try {
      const g = await fetch("/api/admin/works?include_stats=true");
      if (!g.ok) throw new Error("Failed to fetch works");
      const R = await g.json();
      t(R.works || []);
    } catch (g) {
      l(g instanceof Error ? g.message : "Failed to fetch works");
    }
  }, b = async (g) => {
    try {
      const R = g ? `/api/admin/chapters?work_id=${g}` : "/api/admin/chapters", X = await fetch(R);
      if (!X.ok) throw new Error("Failed to fetch chapters");
      const de = await X.json();
      n(de.chapters || []);
    } catch (R) {
      l(R instanceof Error ? R.message : "Failed to fetch chapters");
    }
  };
  xe(() => {
    (async () => {
      a(!0), l(null);
      try {
        await Promise.all([E(), b()]);
      } catch {
        l("Failed to load data");
      } finally {
        a(!1);
      }
    })();
  }, []);
  const L = e.filter((g) => {
    var ye;
    const R = g.title.toLowerCase().includes(d.toLowerCase()) || ((ye = g.description) == null ? void 0 : ye.toLowerCase().includes(d.toLowerCase())), X = f === "all" || g.status === f, de = y === "all" || g.type === y;
    return R && X && de;
  }), G = D ? r.filter((g) => g.work_id === D.id) : r, se = async (g) => {
    g.preventDefault();
    try {
      const R = w ? `/api/admin/works/${w.id}` : "/api/admin/works", de = await fetch(R, {
        method: w ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...k,
          progress_percentage: k.progress_percentage || 0,
          target_word_count: k.target_word_count || null
        })
      });
      if (!de.ok) {
        const ye = await de.json();
        throw new Error(ye.message || "Failed to save work");
      }
      await E(), T(), j(!1);
    } catch (R) {
      l(R instanceof Error ? R.message : "Failed to save work");
    }
  }, T = () => {
    x({
      title: "",
      type: "book",
      description: "",
      status: "planning",
      progress_percentage: 0,
      release_date: "",
      estimated_release: "",
      cover_image_url: "",
      is_featured: !1,
      is_premium: !1,
      is_free: !0,
      target_word_count: void 0
    }), P(null);
  }, U = (g) => {
    P(g), x({
      title: g.title,
      type: g.type,
      parent_id: g.parent_id,
      description: g.description || "",
      status: g.status,
      progress_percentage: g.progress_percentage || 0,
      release_date: g.release_date || "",
      estimated_release: g.estimated_release || "",
      cover_image_url: g.cover_image_url || "",
      is_featured: g.is_featured,
      is_premium: g.is_premium,
      is_free: g.is_free,
      target_word_count: g.target_word_count
    }), j(!0);
  }, $ = async (g) => {
    if (confirm(`Are you sure you want to delete "${g.title}"? This will also delete all associated chapters.`))
      try {
        if (!(await fetch(`/api/admin/works/${g.id}`, {
          method: "DELETE"
        })).ok) throw new Error("Failed to delete work");
        await E(), (D == null ? void 0 : D.id) === g.id && A(null);
      } catch (R) {
        l(R instanceof Error ? R.message : "Failed to delete work");
      }
  }, B = async (g, R) => {
    try {
      if (!(await fetch(`/api/admin/works/${g.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [R]: !g[R] })
      })).ok) throw new Error("Failed to update work");
      await E();
    } catch (X) {
      l(X instanceof Error ? X.message : "Failed to update work");
    }
  }, q = async (g) => {
    try {
      if (!(await fetch(`/api/admin/chapters/${g.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !g.is_published })
      })).ok) throw new Error("Failed to update chapter");
      await b(D == null ? void 0 : D.id);
    } catch (R) {
      l(R instanceof Error ? R.message : "Failed to update chapter");
    }
  }, ie = (g) => {
    switch (g) {
      case "published":
        return { color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/20", icon: pt };
      case "writing":
        return { color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/20", icon: us };
      case "editing":
        return { color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/20", icon: wr };
      case "planning":
        return { color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/20", icon: Pl };
      case "on_hold":
        return { color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-900/20", icon: Cl };
      default:
        return { color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-900/20", icon: Et };
    }
  }, Ne = (g) => {
    switch (g) {
      case "book":
        return /* @__PURE__ */ s.jsx(Oe, { className: "w-4 h-4" });
      case "volume":
        return /* @__PURE__ */ s.jsx(xs, { className: "w-4 h-4" });
      case "saga":
        return /* @__PURE__ */ s.jsx(_l, { className: "w-4 h-4" });
      case "arc":
        return /* @__PURE__ */ s.jsx(it, { className: "w-4 h-4" });
      case "issue":
        return /* @__PURE__ */ s.jsx(Ye, { className: "w-4 h-4" });
      default:
        return /* @__PURE__ */ s.jsx(Oe, { className: "w-4 h-4" });
    }
  }, v = (g) => new Date(g).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  return i ? /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-center min-h-[400px]", children: [
    /* @__PURE__ */ s.jsx(Se, { className: "w-8 h-8 animate-spin text-primary" }),
    /* @__PURE__ */ s.jsx("span", { className: "ml-3 text-lg", children: "Loading works and chapters..." })
  ] }) : /* @__PURE__ */ s.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0", children: [
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-3", children: [
          /* @__PURE__ */ s.jsx(Oe, { className: "w-8 h-8 text-primary" }),
          "Works Management"
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground mt-2", children: "Create and manage your literary works, upload chapters for subscribers, and showcase in library" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ s.jsxs(
          "button",
          {
            onClick: () => O(!0),
            className: "bg-secondary text-white px-6 py-3 rounded-xl font-medium hover:bg-secondary-dark transition-colors flex items-center gap-2",
            children: [
              /* @__PURE__ */ s.jsx(Ie, { className: "w-5 h-5" }),
              "Upload Chapter"
            ]
          }
        ),
        /* @__PURE__ */ s.jsxs(
          "button",
          {
            onClick: () => {
              T(), j(!0);
            },
            className: "bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center gap-2",
            children: [
              /* @__PURE__ */ s.jsx(ft, { className: "w-5 h-5" }),
              "New Work"
            ]
          }
        )
      ] })
    ] }),
    o && /* @__PURE__ */ s.jsxs("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ s.jsx(It, { className: "w-5 h-5 text-red-500 flex-shrink-0" }),
      /* @__PURE__ */ s.jsx("span", { className: "text-red-700 dark:text-red-400", children: o }),
      /* @__PURE__ */ s.jsx(
        "button",
        {
          onClick: () => l(null),
          className: "ml-auto text-red-500 hover:text-red-600",
          children: /* @__PURE__ */ s.jsx(Ee, { className: "w-5 h-5" })
        }
      )
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: "border-b border-border", children: /* @__PURE__ */ s.jsxs("nav", { className: "-mb-px flex space-x-8", children: [
      /* @__PURE__ */ s.jsxs(
        "button",
        {
          onClick: () => {
            u("works"), A(null);
          },
          className: `py-2 px-1 border-b-2 font-medium text-sm ${c === "works" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"}`,
          children: [
            "Works (",
            e.length,
            ")"
          ]
        }
      ),
      /* @__PURE__ */ s.jsxs(
        "button",
        {
          onClick: () => u("chapters"),
          className: `py-2 px-1 border-b-2 font-medium text-sm ${c === "chapters" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"}`,
          children: [
            "Chapters (",
            r.length,
            ")"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ s.jsxs("div", { className: "flex flex-col lg:flex-row gap-4", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ s.jsx(bt, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "text",
            placeholder: `Search ${c}...`,
            value: d,
            onChange: (g) => h(g.target.value),
            className: "w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          }
        )
      ] }),
      c === "works" && /* @__PURE__ */ s.jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ s.jsx(Gt, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
          /* @__PURE__ */ s.jsxs(
            "select",
            {
              value: f,
              onChange: (g) => p(g.target.value),
              className: "pl-10 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              children: [
                /* @__PURE__ */ s.jsx("option", { value: "all", children: "All Status" }),
                /* @__PURE__ */ s.jsx("option", { value: "planning", children: "Planning" }),
                /* @__PURE__ */ s.jsx("option", { value: "writing", children: "Writing" }),
                /* @__PURE__ */ s.jsx("option", { value: "editing", children: "Editing" }),
                /* @__PURE__ */ s.jsx("option", { value: "published", children: "Published" }),
                /* @__PURE__ */ s.jsx("option", { value: "on_hold", children: "On Hold" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ s.jsxs(
          "select",
          {
            value: y,
            onChange: (g) => S(g.target.value),
            className: "px-3 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
            children: [
              /* @__PURE__ */ s.jsx("option", { value: "all", children: "All Types" }),
              /* @__PURE__ */ s.jsx("option", { value: "book", children: "Books" }),
              /* @__PURE__ */ s.jsx("option", { value: "volume", children: "Volumes" }),
              /* @__PURE__ */ s.jsx("option", { value: "saga", children: "Sagas" }),
              /* @__PURE__ */ s.jsx("option", { value: "arc", children: "Arcs" }),
              /* @__PURE__ */ s.jsx("option", { value: "issue", children: "Issues" })
            ]
          }
        )
      ] })
    ] }),
    c === "works" && /* @__PURE__ */ s.jsx("div", { className: "space-y-4", children: L.length === 0 ? /* @__PURE__ */ s.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ s.jsx(Oe, { className: "w-16 h-16 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "No works found" }),
      /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground mb-4", children: d || f !== "all" || y !== "all" ? "Try adjusting your search or filters" : "Create your first work to get started" }),
      /* @__PURE__ */ s.jsx(
        "button",
        {
          onClick: () => {
            T(), j(!0);
          },
          className: "bg-primary text-white px-6 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors",
          children: "Create First Work"
        }
      )
    ] }) : /* @__PURE__ */ s.jsx("div", { className: "grid gap-4", children: L.map((g) => {
      const R = ie(g.status), X = R.icon;
      return /* @__PURE__ */ s.jsx("div", { className: "bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow", children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "flex-1 space-y-3", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
                Ne(g.type),
                /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-semibold text-foreground", children: g.title })
              ] }),
              /* @__PURE__ */ s.jsxs("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${R.bg} ${R.color}`, children: [
                /* @__PURE__ */ s.jsx(X, { className: "w-3 h-3 mr-1" }),
                g.status
              ] }),
              g.is_featured && /* @__PURE__ */ s.jsx(wn, { className: "w-4 h-4 text-yellow-500 fill-current" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "text-right text-sm text-muted-foreground", children: [
              /* @__PURE__ */ s.jsxs("p", { children: [
                "Updated ",
                v(g.updated_at)
              ] }),
              g.chapters_count && /* @__PURE__ */ s.jsxs("p", { children: [
                g.published_chapters,
                "/",
                g.chapters_count,
                " chapters published"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 text-sm", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("span", { className: "text-muted-foreground", children: "Type:" }),
              /* @__PURE__ */ s.jsx("span", { className: "ml-2 text-foreground capitalize", children: g.type })
            ] }),
            g.progress_percentage !== void 0 && /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("span", { className: "text-muted-foreground", children: "Progress:" }),
              /* @__PURE__ */ s.jsxs("span", { className: "ml-2 text-foreground", children: [
                g.progress_percentage,
                "%"
              ] })
            ] }),
            g.word_count && /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("span", { className: "text-muted-foreground", children: "Words:" }),
              /* @__PURE__ */ s.jsxs("span", { className: "ml-2 text-foreground", children: [
                g.word_count.toLocaleString(),
                g.target_word_count && ` / ${g.target_word_count.toLocaleString()}`
              ] })
            ] }),
            g.rating && /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("span", { className: "text-muted-foreground", children: "Rating:" }),
              /* @__PURE__ */ s.jsxs("span", { className: "ml-2 text-foreground", children: [
                g.rating.toFixed(1),
                " ⭐ (",
                g.reviews_count,
                ")"
              ] })
            ] })
          ] }),
          g.description && /* @__PURE__ */ s.jsx("p", { className: "text-sm text-muted-foreground line-clamp-2", children: g.description }),
          /* @__PURE__ */ s.jsxs("div", { className: "flex gap-6 text-sm", children: [
            g.release_date && /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("span", { className: "text-muted-foreground", children: "Released:" }),
              /* @__PURE__ */ s.jsx("span", { className: "ml-2 text-foreground", children: v(g.release_date) })
            ] }),
            g.estimated_release && !g.release_date && /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("span", { className: "text-muted-foreground", children: "Est. Release:" }),
              /* @__PURE__ */ s.jsx("span", { className: "ml-2 text-foreground", children: g.estimated_release })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ s.jsxs(
              "button",
              {
                onClick: () => B(g, "is_featured"),
                className: `flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${g.is_featured ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"}`,
                children: [
                  /* @__PURE__ */ s.jsx(wn, { className: "w-3 h-3" }),
                  "Featured"
                ]
              }
            ),
            /* @__PURE__ */ s.jsx(
              "button",
              {
                onClick: () => B(g, "is_premium"),
                className: `flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${g.is_premium ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"}`,
                children: "Premium"
              }
            ),
            /* @__PURE__ */ s.jsx(
              "button",
              {
                onClick: () => B(g, "is_free"),
                className: `flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${g.is_free ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"}`,
                children: "Free"
              }
            )
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "flex items-center justify-between pt-3 border-t border-border", children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ s.jsxs(
              "button",
              {
                onClick: () => U(g),
                className: "text-primary hover:text-primary-dark flex items-center gap-2 text-sm font-medium",
                children: [
                  /* @__PURE__ */ s.jsx(us, { className: "w-4 h-4" }),
                  "Edit"
                ]
              }
            ),
            /* @__PURE__ */ s.jsxs(
              "button",
              {
                onClick: () => {
                  A(g), u("chapters"), b(g.id);
                },
                className: "text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm font-medium",
                children: [
                  /* @__PURE__ */ s.jsx(xs, { className: "w-4 h-4" }),
                  "Chapters (",
                  g.chapters_count || 0,
                  ")"
                ]
              }
            ),
            /* @__PURE__ */ s.jsxs(
              "button",
              {
                onClick: () => $(g),
                className: "text-red-500 hover:text-red-600 flex items-center gap-2 text-sm font-medium",
                children: [
                  /* @__PURE__ */ s.jsx(Ts, { className: "w-4 h-4" }),
                  "Delete"
                ]
              }
            )
          ] }) })
        ] }),
        g.cover_image_url && /* @__PURE__ */ s.jsx("div", { className: "ml-4 flex-shrink-0", children: /* @__PURE__ */ s.jsx(
          "img",
          {
            src: g.cover_image_url,
            alt: g.title,
            className: "w-16 h-20 object-cover rounded-lg border border-border"
          }
        ) })
      ] }) }, g.id);
    }) }) }),
    c === "chapters" && /* @__PURE__ */ s.jsxs("div", { className: "space-y-4", children: [
      D && /* @__PURE__ */ s.jsx("div", { className: "bg-primary/5 border border-primary/20 rounded-xl p-4", children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("h3", { className: "font-semibold text-foreground", children: [
            "Chapters for: ",
            D.title
          ] }),
          /* @__PURE__ */ s.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            G.length,
            " chapters • ",
            G.filter((g) => g.is_published).length,
            " published"
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs(
          "button",
          {
            onClick: () => O(!0),
            className: "bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2",
            children: [
              /* @__PURE__ */ s.jsx(ft, { className: "w-4 h-4" }),
              "Add Chapter"
            ]
          }
        )
      ] }) }),
      G.length === 0 ? /* @__PURE__ */ s.jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ s.jsx(Ye, { className: "w-16 h-16 text-muted-foreground mx-auto mb-4" }),
        /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "No chapters found" }),
        /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground mb-4", children: D ? `No chapters uploaded for "${D.title}" yet` : "Select a work to view its chapters or upload new content" })
      ] }) : /* @__PURE__ */ s.jsx("div", { className: "grid gap-3", children: G.sort((g, R) => g.chapter_number - R.chapter_number).map((g) => /* @__PURE__ */ s.jsxs("div", { className: "bg-card border border-border rounded-lg p-4 flex items-center justify-between", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ s.jsxs("span", { className: "text-sm font-mono text-muted-foreground", children: [
              "Ch. ",
              g.chapter_number
            ] }),
            /* @__PURE__ */ s.jsx("h4", { className: "font-medium text-foreground", children: g.title }),
            /* @__PURE__ */ s.jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${g.is_published ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400"}`, children: g.is_published ? "Published" : "Draft" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-4 mt-2 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ s.jsxs("span", { children: [
              "Updated ",
              v(g.updated_at)
            ] }),
            g.word_count && /* @__PURE__ */ s.jsxs("span", { children: [
              g.word_count.toLocaleString(),
              " words"
            ] }),
            g.estimated_read_time && /* @__PURE__ */ s.jsxs("span", { children: [
              g.estimated_read_time,
              " min read"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ s.jsx(
            "button",
            {
              onClick: () => q(g),
              className: `p-2 rounded-lg transition-colors ${g.is_published ? "text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}`,
              title: g.is_published ? "Unpublish chapter" : "Publish chapter",
              children: g.is_published ? /* @__PURE__ */ s.jsx(tt, { className: "w-4 h-4" }) : /* @__PURE__ */ s.jsx(Gi, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ s.jsx("button", { className: "p-2 text-primary hover:bg-primary/10 rounded-lg", children: /* @__PURE__ */ s.jsx(us, { className: "w-4 h-4" }) })
        ] })
      ] }, g.id)) })
    ] }),
    C && /* @__PURE__ */ s.jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ s.jsxs("div", { className: "bg-background rounded-xl shadow-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between p-6 border-b border-border", children: [
        /* @__PURE__ */ s.jsx("h2", { className: "text-xl font-semibold text-foreground", children: w ? "Edit Work" : "Create New Work" }),
        /* @__PURE__ */ s.jsx(
          "button",
          {
            onClick: () => {
              j(!1), T();
            },
            className: "text-muted-foreground hover:text-foreground",
            children: /* @__PURE__ */ s.jsx(Ee, { className: "w-6 h-6" })
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("form", { onSubmit: se, className: "p-6 space-y-6", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Title *" }),
            /* @__PURE__ */ s.jsx(
              "input",
              {
                type: "text",
                required: !0,
                value: k.title,
                onChange: (g) => x({ ...k, title: g.target.value }),
                className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              }
            )
          ] }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Type" }),
            /* @__PURE__ */ s.jsxs(
              "select",
              {
                value: k.type,
                onChange: (g) => x({ ...k, type: g.target.value }),
                className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                children: [
                  /* @__PURE__ */ s.jsx("option", { value: "book", children: "Book" }),
                  /* @__PURE__ */ s.jsx("option", { value: "volume", children: "Volume" }),
                  /* @__PURE__ */ s.jsx("option", { value: "saga", children: "Saga" }),
                  /* @__PURE__ */ s.jsx("option", { value: "arc", children: "Arc" }),
                  /* @__PURE__ */ s.jsx("option", { value: "issue", children: "Issue" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Description" }),
          /* @__PURE__ */ s.jsx(
            "textarea",
            {
              value: k.description,
              onChange: (g) => x({ ...k, description: g.target.value }),
              rows: 3,
              className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            }
          )
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Status" }),
            /* @__PURE__ */ s.jsxs(
              "select",
              {
                value: k.status,
                onChange: (g) => x({ ...k, status: g.target.value }),
                className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                children: [
                  /* @__PURE__ */ s.jsx("option", { value: "planning", children: "Planning" }),
                  /* @__PURE__ */ s.jsx("option", { value: "writing", children: "Writing" }),
                  /* @__PURE__ */ s.jsx("option", { value: "editing", children: "Editing" }),
                  /* @__PURE__ */ s.jsx("option", { value: "published", children: "Published" }),
                  /* @__PURE__ */ s.jsx("option", { value: "on_hold", children: "On Hold" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Progress %" }),
            /* @__PURE__ */ s.jsx(
              "input",
              {
                type: "number",
                min: "0",
                max: "100",
                value: k.progress_percentage,
                onChange: (g) => x({ ...k, progress_percentage: parseInt(g.target.value) || 0 }),
                className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Release Date" }),
            /* @__PURE__ */ s.jsx(
              "input",
              {
                type: "date",
                value: k.release_date,
                onChange: (g) => x({ ...k, release_date: g.target.value }),
                className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              }
            )
          ] }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Estimated Release" }),
            /* @__PURE__ */ s.jsx(
              "input",
              {
                type: "text",
                value: k.estimated_release,
                onChange: (g) => x({ ...k, estimated_release: g.target.value }),
                placeholder: "e.g., Spring 2024",
                className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Cover Image URL" }),
          /* @__PURE__ */ s.jsx(
            "input",
            {
              type: "url",
              value: k.cover_image_url,
              onChange: (g) => x({ ...k, cover_image_url: g.target.value }),
              className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            }
          )
        ] }),
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Target Word Count" }),
          /* @__PURE__ */ s.jsx(
            "input",
            {
              type: "number",
              value: k.target_word_count || "",
              onChange: (g) => x({ ...k, target_word_count: g.target.value ? parseInt(g.target.value) : void 0 }),
              className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            }
          )
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ s.jsx(
              "input",
              {
                type: "checkbox",
                id: "is_featured",
                checked: k.is_featured,
                onChange: (g) => x({ ...k, is_featured: g.target.checked }),
                className: "w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
              }
            ),
            /* @__PURE__ */ s.jsx("label", { htmlFor: "is_featured", className: "ml-2 text-sm font-medium text-foreground", children: "Featured (highlight in library)" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ s.jsx(
              "input",
              {
                type: "checkbox",
                id: "is_premium",
                checked: k.is_premium,
                onChange: (g) => x({ ...k, is_premium: g.target.checked }),
                className: "w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
              }
            ),
            /* @__PURE__ */ s.jsx("label", { htmlFor: "is_premium", className: "ml-2 text-sm font-medium text-foreground", children: "Premium content (requires subscription/purchase)" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ s.jsx(
              "input",
              {
                type: "checkbox",
                id: "is_free",
                checked: k.is_free,
                onChange: (g) => x({ ...k, is_free: g.target.checked }),
                className: "w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
              }
            ),
            /* @__PURE__ */ s.jsx("label", { htmlFor: "is_free", className: "ml-2 text-sm font-medium text-foreground", children: "Free to read (no subscription required)" })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-end gap-3 pt-4 border-t border-border", children: [
          /* @__PURE__ */ s.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                j(!1), T();
              },
              className: "px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ s.jsxs(
            "button",
            {
              type: "submit",
              className: "bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2",
              children: [
                /* @__PURE__ */ s.jsx(Ki, { className: "w-4 h-4" }),
                w ? "Update Work" : "Create Work"
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    I && /* @__PURE__ */ s.jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ s.jsx("div", { className: "bg-background rounded-xl shadow-xl border border-border max-w-md w-full", children: /* @__PURE__ */ s.jsxs("div", { className: "p-6 text-center", children: [
      /* @__PURE__ */ s.jsx(Ie, { className: "w-16 h-16 text-primary mx-auto mb-4" }),
      /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-semibold text-foreground mb-2", children: "Chapter Upload" }),
      /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground mb-4", children: "Use the existing Chapter Upload page or integrate the upload functionality here." }),
      /* @__PURE__ */ s.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ s.jsx(
          "button",
          {
            onClick: () => {
              O(!1), window.open("/account/admin/media", "_blank");
            },
            className: "flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors",
            children: "Go to Upload Page"
          }
        ),
        /* @__PURE__ */ s.jsx(
          "button",
          {
            onClick: () => O(!1),
            className: "flex-1 bg-gray-200 dark:bg-gray-700 text-foreground px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors",
            children: "Close"
          }
        )
      ] })
    ] }) }) })
  ] });
}, mg = () => {
  const [e, t] = _("upload"), [r, n] = _("chapter"), [i, a] = _([]), [o, l] = _([]), [c, u] = _(!1), [d, h] = _(null), [f, p] = _(null), [y, S] = _(""), [C, j] = _("all"), [w, P] = _(null), [D, A] = _(!1), [I, O] = _({}), [k, x] = _({
    work_id: "",
    chapter_title: "",
    chapter_number: 1,
    is_published: !1
  });
  xe(() => {
    E(), b();
  }, []);
  const E = async () => {
    try {
      const v = await fetch("/api/admin/works");
      if (v.ok) {
        const g = await v.json();
        a(g.works || []);
      }
    } catch (v) {
      console.error("Failed to fetch works:", v);
    }
  }, b = async () => {
    try {
      u(!0);
      const v = await fetch("/api/admin/media");
      if (v.ok) {
        const g = await v.json();
        l(g.files || []);
      }
    } catch {
      h("Failed to fetch media files");
    } finally {
      u(!1);
    }
  }, L = (v) => {
    v.target.files && P(v.target.files);
  }, G = (v) => {
    v.preventDefault(), v.stopPropagation(), v.type === "dragenter" || v.type === "dragover" ? A(!0) : v.type === "dragleave" && A(!1);
  }, se = (v) => {
    v.preventDefault(), v.stopPropagation(), A(!1), v.dataTransfer.files && v.dataTransfer.files[0] && P(v.dataTransfer.files);
  }, T = async () => {
    var v, g;
    if (!w || w.length === 0) {
      h("Please select a file to upload");
      return;
    }
    if (!k.work_id || !k.chapter_title) {
      h("Please fill in all required chapter information");
      return;
    }
    u(!0), h(null), p(null);
    try {
      const R = new FormData();
      R.append("file", w[0]), R.append("title", k.chapter_title), R.append("chapter_number", k.chapter_number.toString()), R.append("book_id", k.work_id), R.append("is_published", k.is_published.toString());
      const { data: { session: X }, error: de } = await ((g = (v = window.supabase) == null ? void 0 : v.auth) == null ? void 0 : g.getSession());
      if (de || !X)
        throw new Error("User session not found. Please log in.");
      const ye = await fetch("/api/chapters/upload", {
        method: "POST",
        body: R,
        headers: {
          Authorization: `Bearer ${X.access_token}`
        }
      });
      if (!ye.ok) {
        const st = await ye.json();
        throw new Error(st.message || st.error || "Failed to upload chapter.");
      }
      const kt = await ye.json();
      p(`Chapter "${k.chapter_title}" uploaded successfully!`), P(null), x({
        work_id: "",
        chapter_title: "",
        chapter_number: 1,
        is_published: !1
      }), await b();
    } catch (R) {
      h(R instanceof Error ? R.message : "Failed to upload chapter");
    } finally {
      u(!1);
    }
  }, U = async () => {
    if (!w || w.length === 0) {
      h("Please select files to upload");
      return;
    }
    u(!0), h(null), p(null);
    try {
      const v = Array.from(w).map(async (g, R) => {
        const X = new FormData();
        X.append("file", g), X.append("type", "media");
        const de = await fetch("/api/admin/media/upload", {
          method: "POST",
          body: X
        });
        if (!de.ok)
          throw new Error(`Failed to upload ${g.name}`);
        return de.json();
      });
      await Promise.all(v), p(`Successfully uploaded ${w.length} file(s)`), P(null), await b();
    } catch (v) {
      h(v instanceof Error ? v.message : "Failed to upload files");
    } finally {
      u(!1);
    }
  }, $ = async (v) => {
    if (confirm("Are you sure you want to delete this file?"))
      try {
        if (!(await fetch(`/api/admin/media/${v}`, {
          method: "DELETE"
        })).ok)
          throw new Error("Failed to delete file");
        p("File deleted successfully"), await b();
      } catch (g) {
        h(g instanceof Error ? g.message : "Failed to delete file");
      }
  }, B = o.filter((v) => {
    var X;
    const g = v.filename.toLowerCase().includes(y.toLowerCase()) || ((X = v.chapter_title) == null ? void 0 : X.toLowerCase().includes(y.toLowerCase()));
    let R = !0;
    if (C !== "all")
      switch (C) {
        case "chapter":
          R = !!(v.work_id && v.chapter_number);
          break;
        case "image":
          R = v.file_type.startsWith("image/");
          break;
        case "video":
          R = v.file_type.startsWith("video/");
          break;
        case "audio":
          R = v.file_type.startsWith("audio/");
          break;
        case "document":
          R = v.file_type.includes("pdf") || v.file_type.includes("document") || v.file_type.includes("text");
          break;
      }
    return g && R;
  }), q = (v) => v.work_id && v.chapter_number ? /* @__PURE__ */ s.jsx(Oe, { className: "w-5 h-5 text-blue-600" }) : v.file_type.startsWith("image/") ? /* @__PURE__ */ s.jsx(jn, { className: "w-5 h-5 text-green-600" }) : v.file_type.startsWith("video/") ? /* @__PURE__ */ s.jsx(Dl, { className: "w-5 h-5 text-purple-600" }) : v.file_type.startsWith("audio/") ? /* @__PURE__ */ s.jsx(Rl, { className: "w-5 h-5 text-pink-600" }) : /* @__PURE__ */ s.jsx(Ye, { className: "w-5 h-5 text-gray-600" }), ie = (v) => {
    if (v === 0) return "0 Bytes";
    const g = 1024, R = ["Bytes", "KB", "MB", "GB"], X = Math.floor(Math.log(v) / Math.log(g));
    return parseFloat((v / Math.pow(g, X)).toFixed(2)) + " " + R[X];
  }, Ne = (v) => new Date(v).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  return /* @__PURE__ */ s.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0", children: [
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-3", children: [
          /* @__PURE__ */ s.jsx(Ie, { className: "w-8 h-8 text-primary" }),
          "Media Upload"
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground mt-2", children: "Upload chapters for subscribers and manage media files for your website" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ s.jsx(
          "button",
          {
            onClick: () => t("upload"),
            className: `px-6 py-3 rounded-xl font-medium transition-colors ${e === "upload" ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-foreground hover:bg-gray-300 dark:hover:bg-gray-600"}`,
            children: "Upload Files"
          }
        ),
        /* @__PURE__ */ s.jsx(
          "button",
          {
            onClick: () => t("library"),
            className: `px-6 py-3 rounded-xl font-medium transition-colors ${e === "library" ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-foreground hover:bg-gray-300 dark:hover:bg-gray-600"}`,
            children: "Media Library"
          }
        )
      ] })
    ] }),
    f && /* @__PURE__ */ s.jsxs("div", { className: "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ s.jsx(pt, { className: "w-5 h-5 text-green-500 flex-shrink-0" }),
      /* @__PURE__ */ s.jsx("span", { className: "text-green-700 dark:text-green-400", children: f }),
      /* @__PURE__ */ s.jsx(
        "button",
        {
          onClick: () => p(null),
          className: "ml-auto text-green-500 hover:text-green-600",
          children: /* @__PURE__ */ s.jsx(Ee, { className: "w-5 h-5" })
        }
      )
    ] }),
    d && /* @__PURE__ */ s.jsxs("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ s.jsx(It, { className: "w-5 h-5 text-red-500 flex-shrink-0" }),
      /* @__PURE__ */ s.jsx("span", { className: "text-red-700 dark:text-red-400", children: d }),
      /* @__PURE__ */ s.jsx(
        "button",
        {
          onClick: () => h(null),
          className: "ml-auto text-red-500 hover:text-red-600",
          children: /* @__PURE__ */ s.jsx(Ee, { className: "w-5 h-5" })
        }
      )
    ] }),
    e === "upload" && /* @__PURE__ */ s.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "flex gap-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl", children: [
        /* @__PURE__ */ s.jsxs(
          "button",
          {
            onClick: () => n("chapter"),
            className: `flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${r === "chapter" ? "bg-white dark:bg-gray-700 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
            children: [
              /* @__PURE__ */ s.jsx(Oe, { className: "w-4 h-4 inline mr-2" }),
              "Chapter Upload"
            ]
          }
        ),
        /* @__PURE__ */ s.jsxs(
          "button",
          {
            onClick: () => n("media"),
            className: `flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${r === "media" ? "bg-white dark:bg-gray-700 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
            children: [
              /* @__PURE__ */ s.jsx(jn, { className: "w-4 h-4 inline mr-2" }),
              "Media Upload"
            ]
          }
        )
      ] }),
      r === "chapter" && /* @__PURE__ */ s.jsxs("div", { className: "bg-card border border-border rounded-xl p-6", children: [
        /* @__PURE__ */ s.jsx("h2", { className: "text-xl font-semibold text-foreground mb-4", children: "Upload New Chapter" }),
        /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Select Work *" }),
            /* @__PURE__ */ s.jsxs(
              "select",
              {
                value: k.work_id,
                onChange: (v) => x({ ...k, work_id: v.target.value }),
                className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                required: !0,
                children: [
                  /* @__PURE__ */ s.jsx("option", { value: "", children: "-- Select a Work --" }),
                  i.map((v) => /* @__PURE__ */ s.jsxs("option", { value: v.id, children: [
                    v.title,
                    " (",
                    v.type,
                    ")"
                  ] }, v.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Chapter Number *" }),
            /* @__PURE__ */ s.jsx(
              "input",
              {
                type: "number",
                min: "1",
                value: k.chapter_number,
                onChange: (v) => x({ ...k, chapter_number: parseInt(v.target.value) || 1 }),
                className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                required: !0
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ s.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Chapter Title *" }),
          /* @__PURE__ */ s.jsx(
            "input",
            {
              type: "text",
              value: k.chapter_title,
              onChange: (v) => x({ ...k, chapter_title: v.target.value }),
              className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              placeholder: "Enter chapter title",
              required: !0
            }
          )
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "mb-6", children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ s.jsx(
            "input",
            {
              type: "checkbox",
              id: "is_published",
              checked: k.is_published,
              onChange: (v) => x({ ...k, is_published: v.target.checked }),
              className: "w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            }
          ),
          /* @__PURE__ */ s.jsx("label", { htmlFor: "is_published", className: "ml-2 text-sm font-medium text-foreground", children: "Publish immediately (subscribers will get access)" })
        ] }) }),
        /* @__PURE__ */ s.jsxs(
          "div",
          {
            className: `border-2 border-dashed rounded-xl p-8 text-center transition-colors ${D ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5"}`,
            onDragEnter: G,
            onDragLeave: G,
            onDragOver: G,
            onDrop: se,
            children: [
              /* @__PURE__ */ s.jsx(Ie, { className: "w-12 h-12 text-primary mx-auto mb-4" }),
              /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "Drop chapter file here or click to browse" }),
              /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground mb-4", children: "Supported formats: PDF, DOCX, TXT, HTML" }),
              /* @__PURE__ */ s.jsx(
                "input",
                {
                  type: "file",
                  onChange: L,
                  accept: ".pdf,.docx,.txt,.html",
                  className: "hidden",
                  id: "chapter-file-input"
                }
              ),
              /* @__PURE__ */ s.jsxs(
                "label",
                {
                  htmlFor: "chapter-file-input",
                  className: "bg-primary text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-primary-dark transition-colors inline-flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ s.jsx(ft, { className: "w-4 h-4" }),
                    "Choose File"
                  ]
                }
              )
            ]
          }
        ),
        w && /* @__PURE__ */ s.jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ s.jsx("h4", { className: "font-medium text-foreground mb-2", children: "Selected File:" }),
          Array.from(w).map((v, g) => /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ s.jsx(Ye, { className: "w-4 h-4 text-gray-500" }),
              /* @__PURE__ */ s.jsx("span", { className: "text-sm font-medium", children: v.name }),
              /* @__PURE__ */ s.jsx("span", { className: "text-xs text-muted-foreground", children: ie(v.size) })
            ] }),
            /* @__PURE__ */ s.jsx(
              "button",
              {
                onClick: () => P(null),
                className: "text-red-500 hover:text-red-600",
                children: /* @__PURE__ */ s.jsx(Ee, { className: "w-4 h-4" })
              }
            )
          ] }, g))
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ s.jsx(
          "button",
          {
            onClick: T,
            disabled: c || !w || !k.work_id || !k.chapter_title,
            className: "bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
            children: c ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx(Se, { className: "w-4 h-4 animate-spin" }),
              "Uploading Chapter..."
            ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx(Ie, { className: "w-4 h-4" }),
              "Upload Chapter"
            ] })
          }
        ) })
      ] }),
      r === "media" && /* @__PURE__ */ s.jsxs("div", { className: "bg-card border border-border rounded-xl p-6", children: [
        /* @__PURE__ */ s.jsx("h2", { className: "text-xl font-semibold text-foreground mb-4", children: "Upload Media Files" }),
        /* @__PURE__ */ s.jsxs(
          "div",
          {
            className: `border-2 border-dashed rounded-xl p-8 text-center transition-colors ${D ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5"}`,
            onDragEnter: G,
            onDragLeave: G,
            onDragOver: G,
            onDrop: se,
            children: [
              /* @__PURE__ */ s.jsx(Ie, { className: "w-12 h-12 text-primary mx-auto mb-4" }),
              /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "Drop files here or click to browse" }),
              /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground mb-4", children: "Images, videos, documents, and other media files" }),
              /* @__PURE__ */ s.jsx(
                "input",
                {
                  type: "file",
                  onChange: L,
                  multiple: !0,
                  className: "hidden",
                  id: "media-file-input"
                }
              ),
              /* @__PURE__ */ s.jsxs(
                "label",
                {
                  htmlFor: "media-file-input",
                  className: "bg-primary text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-primary-dark transition-colors inline-flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ s.jsx(ft, { className: "w-4 h-4" }),
                    "Choose Files"
                  ]
                }
              )
            ]
          }
        ),
        w && /* @__PURE__ */ s.jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ s.jsxs("h4", { className: "font-medium text-foreground mb-2", children: [
            "Selected Files (",
            w.length,
            "):"
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "space-y-2 max-h-40 overflow-y-auto", children: Array.from(w).map((v, g) => /* @__PURE__ */ s.jsx("div", { className: "flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg", children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ s.jsx(Al, { className: "w-4 h-4 text-gray-500" }),
            /* @__PURE__ */ s.jsx("span", { className: "text-sm font-medium", children: v.name }),
            /* @__PURE__ */ s.jsx("span", { className: "text-xs text-muted-foreground", children: ie(v.size) })
          ] }) }, g)) })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ s.jsx(
          "button",
          {
            onClick: U,
            disabled: c || !w,
            className: "bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
            children: c ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx(Se, { className: "w-4 h-4 animate-spin" }),
              "Uploading Files..."
            ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx(Ie, { className: "w-4 h-4" }),
              "Upload Files"
            ] })
          }
        ) })
      ] })
    ] }),
    e === "library" && /* @__PURE__ */ s.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ s.jsx(bt, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
          /* @__PURE__ */ s.jsx(
            "input",
            {
              type: "text",
              placeholder: "Search files...",
              value: y,
              onChange: (v) => S(v.target.value),
              className: "w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            }
          )
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ s.jsx(Gt, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
          /* @__PURE__ */ s.jsxs(
            "select",
            {
              value: C,
              onChange: (v) => j(v.target.value),
              className: "pl-10 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              children: [
                /* @__PURE__ */ s.jsx("option", { value: "all", children: "All Files" }),
                /* @__PURE__ */ s.jsx("option", { value: "chapter", children: "Chapters" }),
                /* @__PURE__ */ s.jsx("option", { value: "image", children: "Images" }),
                /* @__PURE__ */ s.jsx("option", { value: "video", children: "Videos" }),
                /* @__PURE__ */ s.jsx("option", { value: "audio", children: "Audio" }),
                /* @__PURE__ */ s.jsx("option", { value: "document", children: "Documents" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ s.jsx(
          "button",
          {
            onClick: b,
            className: "bg-primary text-white px-4 py-3 rounded-xl hover:bg-primary-dark transition-colors",
            children: /* @__PURE__ */ s.jsx(Se, { className: "w-4 h-4" })
          }
        )
      ] }),
      c ? /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-center py-12", children: [
        /* @__PURE__ */ s.jsx(Se, { className: "w-8 h-8 animate-spin text-primary" }),
        /* @__PURE__ */ s.jsx("span", { className: "ml-3", children: "Loading files..." })
      ] }) : B.length === 0 ? /* @__PURE__ */ s.jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ s.jsx(El, { className: "w-16 h-16 text-muted-foreground mx-auto mb-4" }),
        /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "No files found" }),
        /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground", children: y || C !== "all" ? "Try adjusting your search or filters" : "Upload your first file to get started" })
      ] }) : /* @__PURE__ */ s.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: B.map((v) => {
        var g;
        return /* @__PURE__ */ s.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow", children: [
          /* @__PURE__ */ s.jsx("div", { className: "aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center", children: v.thumbnail_url ? /* @__PURE__ */ s.jsx(
            "img",
            {
              src: v.thumbnail_url,
              alt: v.filename,
              className: "w-full h-full object-cover rounded-lg"
            }
          ) : /* @__PURE__ */ s.jsxs("div", { className: "text-center", children: [
            q(v),
            /* @__PURE__ */ s.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: (g = v.file_type.split("/")[1]) == null ? void 0 : g.toUpperCase() })
          ] }) }),
          /* @__PURE__ */ s.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ s.jsx("h3", { className: "font-medium text-foreground truncate", title: v.filename, children: v.filename }),
            v.work_id && v.chapter_number && /* @__PURE__ */ s.jsxs("div", { className: "text-sm text-muted-foreground", children: [
              /* @__PURE__ */ s.jsxs("p", { children: [
                "Chapter ",
                v.chapter_number,
                ": ",
                v.chapter_title
              ] }),
              /* @__PURE__ */ s.jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${v.is_published ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400"}`, children: v.is_published ? "Published" : "Draft" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
              /* @__PURE__ */ s.jsx("span", { children: ie(v.file_size) }),
              /* @__PURE__ */ s.jsx("span", { children: Ne(v.upload_date) })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between mt-4 pt-3 border-t border-border", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
              v.file_url && /* @__PURE__ */ s.jsx(
                "button",
                {
                  onClick: () => window.open(v.file_url, "_blank"),
                  className: "p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors",
                  title: "View file",
                  children: /* @__PURE__ */ s.jsx(tt, { className: "w-4 h-4" })
                }
              ),
              v.file_url && /* @__PURE__ */ s.jsx(
                "button",
                {
                  onClick: () => {
                    const R = document.createElement("a");
                    R.href = v.file_url, R.download = v.filename, R.click();
                  },
                  className: "p-1.5 text-blue-600 hover:bg-blue-600/10 rounded-lg transition-colors",
                  title: "Download file",
                  children: /* @__PURE__ */ s.jsx(Ml, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ s.jsx(
              "button",
              {
                onClick: () => $(v.id),
                className: "p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors",
                title: "Delete file",
                children: /* @__PURE__ */ s.jsx(Ts, { className: "w-4 h-4" })
              }
            )
          ] })
        ] }, v.id);
      }) })
    ] })
  ] });
};
var eo = "basil", Vc = function(t) {
  return t === 3 ? "v3" : t;
}, to = "https://js.stripe.com", Fc = "".concat(to, "/").concat(eo, "/stripe.js"), Ic = /^https:\/\/js\.stripe\.com\/v3\/?(\?.*)?$/, Oc = /^https:\/\/js\.stripe\.com\/(v3|[a-z]+)\/stripe\.js(\?.*)?$/;
var Yc = function(t) {
  return Ic.test(t) || Oc.test(t);
}, Bc = function() {
  for (var t = document.querySelectorAll('script[src^="'.concat(to, '"]')), r = 0; r < t.length; r++) {
    var n = t[r];
    if (Yc(n.src))
      return n;
  }
  return null;
}, Sn = function(t) {
  var r = "", n = document.createElement("script");
  n.src = "".concat(Fc).concat(r);
  var i = document.head || document.body;
  if (!i)
    throw new Error("Expected document.body not to be null. Stripe.js requires a <body> element.");
  return i.appendChild(n), n;
}, zc = function(t, r) {
  !t || !t._registerWrapper || t._registerWrapper({
    name: "stripe-js",
    version: "7.9.0",
    startTime: r
  });
}, Pt = null, ns = null, is = null, Uc = function(t) {
  return function(r) {
    t(new Error("Failed to load Stripe.js", {
      cause: r
    }));
  };
}, $c = function(t, r) {
  return function() {
    window.Stripe ? t(window.Stripe) : r(new Error("Stripe.js not available"));
  };
}, Wc = function(t) {
  return Pt !== null ? Pt : (Pt = new Promise(function(r, n) {
    if (typeof window > "u" || typeof document > "u") {
      r(null);
      return;
    }
    if (window.Stripe) {
      r(window.Stripe);
      return;
    }
    try {
      var i = Bc();
      if (!(i && t)) {
        if (!i)
          i = Sn(t);
        else if (i && is !== null && ns !== null) {
          var a;
          i.removeEventListener("load", is), i.removeEventListener("error", ns), (a = i.parentNode) === null || a === void 0 || a.removeChild(i), i = Sn(t);
        }
      }
      is = $c(r, n), ns = Uc(n), i.addEventListener("load", is), i.addEventListener("error", ns);
    } catch (o) {
      n(o);
      return;
    }
  }), Pt.catch(function(r) {
    return Pt = null, Promise.reject(r);
  }));
}, Hc = function(t, r, n) {
  if (t === null)
    return null;
  var i = r[0], a = i.match(/^pk_test/), o = Vc(t.version), l = eo;
  a && o !== l && console.warn("Stripe.js@".concat(o, " was loaded on the page, but @stripe/stripe-js@").concat("7.9.0", " expected Stripe.js@").concat(l, ". This may result in unexpected behavior. For more information, see https://docs.stripe.com/sdks/stripejs-versioning"));
  var c = t.apply(void 0, r);
  return zc(c, n), c;
}, _t, so = !1, ro = function() {
  return _t || (_t = Wc(null).catch(function(t) {
    return _t = null, Promise.reject(t);
  }), _t);
};
Promise.resolve().then(function() {
  return ro();
}).catch(function(e) {
  so || console.warn(e);
});
var Gc = function() {
  for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
    r[n] = arguments[n];
  so = !0;
  var i = Date.now();
  return ro().then(function(a) {
    return Hc(a, r, i);
  });
};
const no = Ue({});
function Kc(e) {
  const t = ht(null);
  return t.current === null && (t.current = e()), t.current;
}
const Nr = typeof window < "u", qc = Nr ? al : xe, kr = /* @__PURE__ */ Ue(null);
function Tr(e, t) {
  e.indexOf(t) === -1 && e.push(t);
}
function Sr(e, t) {
  const r = e.indexOf(t);
  r > -1 && e.splice(r, 1);
}
const De = (e, t, r) => r > t ? t : r < e ? e : r;
function Js(e, t) {
  return t ? `${e}. For more information and steps for solving, visit https://motion.dev/troubleshooting/${t}` : e;
}
let vt = () => {
}, Re = () => {
};
process.env.NODE_ENV !== "production" && (vt = (e, t, r) => {
  !e && typeof console < "u" && console.warn(Js(t, r));
}, Re = (e, t, r) => {
  if (!e)
    throw new Error(Js(t, r));
});
const Le = {}, io = (e) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e);
function oo(e) {
  return typeof e == "object" && e !== null;
}
const ao = (e) => /^0[^.\s]+$/u.test(e);
// @__NO_SIDE_EFFECTS__
function Cr(e) {
  let t;
  return () => (t === void 0 && (t = e()), t);
}
const je = /* @__NO_SIDE_EFFECTS__ */ (e) => e, Xc = (e, t) => (r) => t(e(r)), Kt = (...e) => e.reduce(Xc), Yt = /* @__NO_SIDE_EFFECTS__ */ (e, t, r) => {
  const n = t - e;
  return n === 0 ? 1 : (r - e) / n;
};
class Pr {
  constructor() {
    this.subscriptions = [];
  }
  add(t) {
    return Tr(this.subscriptions, t), () => Sr(this.subscriptions, t);
  }
  notify(t, r, n) {
    const i = this.subscriptions.length;
    if (i)
      if (i === 1)
        this.subscriptions[0](t, r, n);
      else
        for (let a = 0; a < i; a++) {
          const o = this.subscriptions[a];
          o && o(t, r, n);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const Te = /* @__NO_SIDE_EFFECTS__ */ (e) => e * 1e3, Ce = /* @__NO_SIDE_EFFECTS__ */ (e) => e / 1e3;
function lo(e, t) {
  return t ? e * (1e3 / t) : 0;
}
const Cn = /* @__PURE__ */ new Set();
function _r(e, t, r) {
  e || Cn.has(t) || (console.warn(Js(t, r)), Cn.add(t));
}
const co = (e, t, r) => (((1 - 3 * r + 3 * t) * e + (3 * r - 6 * t)) * e + 3 * t) * e, Zc = 1e-7, Jc = 12;
function Qc(e, t, r, n, i) {
  let a, o, l = 0;
  do
    o = t + (r - t) / 2, a = co(o, n, i) - e, a > 0 ? r = o : t = o;
  while (Math.abs(a) > Zc && ++l < Jc);
  return o;
}
function qt(e, t, r, n) {
  if (e === t && r === n)
    return je;
  const i = (a) => Qc(a, 0, 1, e, r);
  return (a) => a === 0 || a === 1 ? a : co(i(a), t, n);
}
const uo = (e) => (t) => t <= 0.5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2, ho = (e) => (t) => 1 - e(1 - t), mo = /* @__PURE__ */ qt(0.33, 1.53, 0.69, 0.99), Ar = /* @__PURE__ */ ho(mo), fo = /* @__PURE__ */ uo(Ar), go = (e) => (e *= 2) < 1 ? 0.5 * Ar(e) : 0.5 * (2 - Math.pow(2, -10 * (e - 1))), Er = (e) => 1 - Math.sin(Math.acos(e)), po = ho(Er), xo = uo(Er), ed = /* @__PURE__ */ qt(0.42, 0, 1, 1), td = /* @__PURE__ */ qt(0, 0, 0.58, 1), yo = /* @__PURE__ */ qt(0.42, 0, 0.58, 1), sd = (e) => Array.isArray(e) && typeof e[0] != "number", bo = (e) => Array.isArray(e) && typeof e[0] == "number", Pn = {
  linear: je,
  easeIn: ed,
  easeInOut: yo,
  easeOut: td,
  circIn: Er,
  circInOut: xo,
  circOut: po,
  backIn: Ar,
  backInOut: fo,
  backOut: mo,
  anticipate: go
}, rd = (e) => typeof e == "string", _n = (e) => {
  if (bo(e)) {
    Re(e.length === 4, "Cubic bezier arrays must contain four numerical values.", "cubic-bezier-length");
    const [t, r, n, i] = e;
    return qt(t, r, n, i);
  } else if (rd(e))
    return Re(Pn[e] !== void 0, `Invalid easing type '${e}'`, "invalid-easing-type"), Pn[e];
  return e;
}, os = [
  "setup",
  // Compute
  "read",
  // Read
  "resolveKeyframes",
  // Write/Read/Write/Read
  "preUpdate",
  // Compute
  "update",
  // Compute
  "preRender",
  // Compute
  "render",
  // Write
  "postRender"
  // Compute
];
function nd(e, t) {
  let r = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), i = !1, a = !1;
  const o = /* @__PURE__ */ new WeakSet();
  let l = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  };
  function c(d) {
    o.has(d) && (u.schedule(d), e()), d(l);
  }
  const u = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (d, h = !1, f = !1) => {
      const y = f && i ? r : n;
      return h && o.add(d), y.has(d) || y.add(d), d;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (d) => {
      n.delete(d), o.delete(d);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (d) => {
      if (l = d, i) {
        a = !0;
        return;
      }
      i = !0, [r, n] = [n, r], r.forEach(c), r.clear(), i = !1, a && (a = !1, u.process(d));
    }
  };
  return u;
}
const id = 40;
function vo(e, t) {
  let r = !1, n = !0;
  const i = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, a = () => r = !0, o = os.reduce((P, D) => (P[D] = nd(a), P), {}), { setup: l, read: c, resolveKeyframes: u, preUpdate: d, update: h, preRender: f, render: p, postRender: y } = o, S = () => {
    const P = Le.useManualTiming ? i.timestamp : performance.now();
    r = !1, Le.useManualTiming || (i.delta = n ? 1e3 / 60 : Math.max(Math.min(P - i.timestamp, id), 1)), i.timestamp = P, i.isProcessing = !0, l.process(i), c.process(i), u.process(i), d.process(i), h.process(i), f.process(i), p.process(i), y.process(i), i.isProcessing = !1, r && t && (n = !1, e(S));
  }, C = () => {
    r = !0, n = !0, i.isProcessing || e(S);
  };
  return { schedule: os.reduce((P, D) => {
    const A = o[D];
    return P[D] = (I, O = !1, k = !1) => (r || C(), A.schedule(I, O, k)), P;
  }, {}), cancel: (P) => {
    for (let D = 0; D < os.length; D++)
      o[os[D]].cancel(P);
  }, state: i, steps: o };
}
const { schedule: Z, cancel: Be, state: oe, steps: Ls } = /* @__PURE__ */ vo(typeof requestAnimationFrame < "u" ? requestAnimationFrame : je, !0);
let ms;
function od() {
  ms = void 0;
}
const fe = {
  now: () => (ms === void 0 && fe.set(oe.isProcessing || Le.useManualTiming ? oe.timestamp : performance.now()), ms),
  set: (e) => {
    ms = e, queueMicrotask(od);
  }
}, wo = (e) => (t) => typeof t == "string" && t.startsWith(e), Mr = /* @__PURE__ */ wo("--"), ad = /* @__PURE__ */ wo("var(--"), Dr = (e) => ad(e) ? ld.test(e.split("/*")[0].trim()) : !1, ld = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu, wt = {
  test: (e) => typeof e == "number",
  parse: parseFloat,
  transform: (e) => e
}, Bt = {
  ...wt,
  transform: (e) => De(0, 1, e)
}, as = {
  ...wt,
  default: 1
}, Dt = (e) => Math.round(e * 1e5) / 1e5, Rr = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function cd(e) {
  return e == null;
}
const dd = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, Lr = (e, t) => (r) => !!(typeof r == "string" && dd.test(r) && r.startsWith(e) || t && !cd(r) && Object.prototype.hasOwnProperty.call(r, t)), jo = (e, t, r) => (n) => {
  if (typeof n != "string")
    return n;
  const [i, a, o, l] = n.match(Rr);
  return {
    [e]: parseFloat(i),
    [t]: parseFloat(a),
    [r]: parseFloat(o),
    alpha: l !== void 0 ? parseFloat(l) : 1
  };
}, ud = (e) => De(0, 255, e), Vs = {
  ...wt,
  transform: (e) => Math.round(ud(e))
}, qe = {
  test: /* @__PURE__ */ Lr("rgb", "red"),
  parse: /* @__PURE__ */ jo("red", "green", "blue"),
  transform: ({ red: e, green: t, blue: r, alpha: n = 1 }) => "rgba(" + Vs.transform(e) + ", " + Vs.transform(t) + ", " + Vs.transform(r) + ", " + Dt(Bt.transform(n)) + ")"
};
function hd(e) {
  let t = "", r = "", n = "", i = "";
  return e.length > 5 ? (t = e.substring(1, 3), r = e.substring(3, 5), n = e.substring(5, 7), i = e.substring(7, 9)) : (t = e.substring(1, 2), r = e.substring(2, 3), n = e.substring(3, 4), i = e.substring(4, 5), t += t, r += r, n += n, i += i), {
    red: parseInt(t, 16),
    green: parseInt(r, 16),
    blue: parseInt(n, 16),
    alpha: i ? parseInt(i, 16) / 255 : 1
  };
}
const Qs = {
  test: /* @__PURE__ */ Lr("#"),
  parse: hd,
  transform: qe.transform
}, Xt = /* @__NO_SIDE_EFFECTS__ */ (e) => ({
  test: (t) => typeof t == "string" && t.endsWith(e) && t.split(" ").length === 1,
  parse: parseFloat,
  transform: (t) => `${t}${e}`
}), Fe = /* @__PURE__ */ Xt("deg"), Pe = /* @__PURE__ */ Xt("%"), V = /* @__PURE__ */ Xt("px"), md = /* @__PURE__ */ Xt("vh"), fd = /* @__PURE__ */ Xt("vw"), An = {
  ...Pe,
  parse: (e) => Pe.parse(e) / 100,
  transform: (e) => Pe.transform(e * 100)
}, ot = {
  test: /* @__PURE__ */ Lr("hsl", "hue"),
  parse: /* @__PURE__ */ jo("hue", "saturation", "lightness"),
  transform: ({ hue: e, saturation: t, lightness: r, alpha: n = 1 }) => "hsla(" + Math.round(e) + ", " + Pe.transform(Dt(t)) + ", " + Pe.transform(Dt(r)) + ", " + Dt(Bt.transform(n)) + ")"
}, ne = {
  test: (e) => qe.test(e) || Qs.test(e) || ot.test(e),
  parse: (e) => qe.test(e) ? qe.parse(e) : ot.test(e) ? ot.parse(e) : Qs.parse(e),
  transform: (e) => typeof e == "string" ? e : e.hasOwnProperty("red") ? qe.transform(e) : ot.transform(e),
  getAnimatableNone: (e) => {
    const t = ne.parse(e);
    return t.alpha = 0, ne.transform(t);
  }
}, gd = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function pd(e) {
  var t, r;
  return isNaN(e) && typeof e == "string" && (((t = e.match(Rr)) == null ? void 0 : t.length) || 0) + (((r = e.match(gd)) == null ? void 0 : r.length) || 0) > 0;
}
const No = "number", ko = "color", xd = "var", yd = "var(", En = "${}", bd = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function zt(e) {
  const t = e.toString(), r = [], n = {
    color: [],
    number: [],
    var: []
  }, i = [];
  let a = 0;
  const l = t.replace(bd, (c) => (ne.test(c) ? (n.color.push(a), i.push(ko), r.push(ne.parse(c))) : c.startsWith(yd) ? (n.var.push(a), i.push(xd), r.push(c)) : (n.number.push(a), i.push(No), r.push(parseFloat(c))), ++a, En)).split(En);
  return { values: r, split: l, indexes: n, types: i };
}
function To(e) {
  return zt(e).values;
}
function So(e) {
  const { split: t, types: r } = zt(e), n = t.length;
  return (i) => {
    let a = "";
    for (let o = 0; o < n; o++)
      if (a += t[o], i[o] !== void 0) {
        const l = r[o];
        l === No ? a += Dt(i[o]) : l === ko ? a += ne.transform(i[o]) : a += i[o];
      }
    return a;
  };
}
const vd = (e) => typeof e == "number" ? 0 : ne.test(e) ? ne.getAnimatableNone(e) : e;
function wd(e) {
  const t = To(e);
  return So(e)(t.map(vd));
}
const ze = {
  test: pd,
  parse: To,
  createTransformer: So,
  getAnimatableNone: wd
};
function Fs(e, t, r) {
  return r < 0 && (r += 1), r > 1 && (r -= 1), r < 1 / 6 ? e + (t - e) * 6 * r : r < 1 / 2 ? t : r < 2 / 3 ? e + (t - e) * (2 / 3 - r) * 6 : e;
}
function jd({ hue: e, saturation: t, lightness: r, alpha: n }) {
  e /= 360, t /= 100, r /= 100;
  let i = 0, a = 0, o = 0;
  if (!t)
    i = a = o = r;
  else {
    const l = r < 0.5 ? r * (1 + t) : r + t - r * t, c = 2 * r - l;
    i = Fs(c, l, e + 1 / 3), a = Fs(c, l, e), o = Fs(c, l, e - 1 / 3);
  }
  return {
    red: Math.round(i * 255),
    green: Math.round(a * 255),
    blue: Math.round(o * 255),
    alpha: n
  };
}
function bs(e, t) {
  return (r) => r > 0 ? t : e;
}
const Q = (e, t, r) => e + (t - e) * r, Is = (e, t, r) => {
  const n = e * e, i = r * (t * t - n) + n;
  return i < 0 ? 0 : Math.sqrt(i);
}, Nd = [Qs, qe, ot], kd = (e) => Nd.find((t) => t.test(e));
function Mn(e) {
  const t = kd(e);
  if (vt(!!t, `'${e}' is not an animatable color. Use the equivalent color code instead.`, "color-not-animatable"), !t)
    return !1;
  let r = t.parse(e);
  return t === ot && (r = jd(r)), r;
}
const Dn = (e, t) => {
  const r = Mn(e), n = Mn(t);
  if (!r || !n)
    return bs(e, t);
  const i = { ...r };
  return (a) => (i.red = Is(r.red, n.red, a), i.green = Is(r.green, n.green, a), i.blue = Is(r.blue, n.blue, a), i.alpha = Q(r.alpha, n.alpha, a), qe.transform(i));
}, er = /* @__PURE__ */ new Set(["none", "hidden"]);
function Td(e, t) {
  return er.has(e) ? (r) => r <= 0 ? e : t : (r) => r >= 1 ? t : e;
}
function Sd(e, t) {
  return (r) => Q(e, t, r);
}
function Vr(e) {
  return typeof e == "number" ? Sd : typeof e == "string" ? Dr(e) ? bs : ne.test(e) ? Dn : _d : Array.isArray(e) ? Co : typeof e == "object" ? ne.test(e) ? Dn : Cd : bs;
}
function Co(e, t) {
  const r = [...e], n = r.length, i = e.map((a, o) => Vr(a)(a, t[o]));
  return (a) => {
    for (let o = 0; o < n; o++)
      r[o] = i[o](a);
    return r;
  };
}
function Cd(e, t) {
  const r = { ...e, ...t }, n = {};
  for (const i in r)
    e[i] !== void 0 && t[i] !== void 0 && (n[i] = Vr(e[i])(e[i], t[i]));
  return (i) => {
    for (const a in n)
      r[a] = n[a](i);
    return r;
  };
}
function Pd(e, t) {
  const r = [], n = { color: 0, var: 0, number: 0 };
  for (let i = 0; i < t.values.length; i++) {
    const a = t.types[i], o = e.indexes[a][n[a]], l = e.values[o] ?? 0;
    r[i] = l, n[a]++;
  }
  return r;
}
const _d = (e, t) => {
  const r = ze.createTransformer(t), n = zt(e), i = zt(t);
  return n.indexes.var.length === i.indexes.var.length && n.indexes.color.length === i.indexes.color.length && n.indexes.number.length >= i.indexes.number.length ? er.has(e) && !i.values.length || er.has(t) && !n.values.length ? Td(e, t) : Kt(Co(Pd(n, i), i.values), r) : (vt(!0, `Complex values '${e}' and '${t}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`, "complex-values-different"), bs(e, t));
};
function Po(e, t, r) {
  return typeof e == "number" && typeof t == "number" && typeof r == "number" ? Q(e, t, r) : Vr(e)(e, t);
}
const Ad = (e) => {
  const t = ({ timestamp: r }) => e(r);
  return {
    start: (r = !0) => Z.update(t, r),
    stop: () => Be(t),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => oe.isProcessing ? oe.timestamp : fe.now()
  };
}, _o = (e, t, r = 10) => {
  let n = "";
  const i = Math.max(Math.round(t / r), 2);
  for (let a = 0; a < i; a++)
    n += Math.round(e(a / (i - 1)) * 1e4) / 1e4 + ", ";
  return `linear(${n.substring(0, n.length - 2)})`;
}, vs = 2e4;
function Fr(e) {
  let t = 0;
  const r = 50;
  let n = e.next(t);
  for (; !n.done && t < vs; )
    t += r, n = e.next(t);
  return t >= vs ? 1 / 0 : t;
}
function Ed(e, t = 100, r) {
  const n = r({ ...e, keyframes: [0, t] }), i = Math.min(Fr(n), vs);
  return {
    type: "keyframes",
    ease: (a) => n.next(i * a).value / t,
    duration: /* @__PURE__ */ Ce(i)
  };
}
const Md = 5;
function Ao(e, t, r) {
  const n = Math.max(t - Md, 0);
  return lo(r - e(n), t - n);
}
const J = {
  // Default spring physics
  stiffness: 100,
  damping: 10,
  mass: 1,
  velocity: 0,
  // Default duration/bounce-based options
  duration: 800,
  // in ms
  bounce: 0.3,
  visualDuration: 0.3,
  // in seconds
  // Rest thresholds
  restSpeed: {
    granular: 0.01,
    default: 2
  },
  restDelta: {
    granular: 5e-3,
    default: 0.5
  },
  // Limits
  minDuration: 0.01,
  // in seconds
  maxDuration: 10,
  // in seconds
  minDamping: 0.05,
  maxDamping: 1
}, Os = 1e-3;
function Dd({ duration: e = J.duration, bounce: t = J.bounce, velocity: r = J.velocity, mass: n = J.mass }) {
  let i, a;
  vt(e <= /* @__PURE__ */ Te(J.maxDuration), "Spring duration must be 10 seconds or less", "spring-duration-limit");
  let o = 1 - t;
  o = De(J.minDamping, J.maxDamping, o), e = De(J.minDuration, J.maxDuration, /* @__PURE__ */ Ce(e)), o < 1 ? (i = (u) => {
    const d = u * o, h = d * e, f = d - r, p = tr(u, o), y = Math.exp(-h);
    return Os - f / p * y;
  }, a = (u) => {
    const h = u * o * e, f = h * r + r, p = Math.pow(o, 2) * Math.pow(u, 2) * e, y = Math.exp(-h), S = tr(Math.pow(u, 2), o);
    return (-i(u) + Os > 0 ? -1 : 1) * ((f - p) * y) / S;
  }) : (i = (u) => {
    const d = Math.exp(-u * e), h = (u - r) * e + 1;
    return -Os + d * h;
  }, a = (u) => {
    const d = Math.exp(-u * e), h = (r - u) * (e * e);
    return d * h;
  });
  const l = 5 / e, c = Ld(i, a, l);
  if (e = /* @__PURE__ */ Te(e), isNaN(c))
    return {
      stiffness: J.stiffness,
      damping: J.damping,
      duration: e
    };
  {
    const u = Math.pow(c, 2) * n;
    return {
      stiffness: u,
      damping: o * 2 * Math.sqrt(n * u),
      duration: e
    };
  }
}
const Rd = 12;
function Ld(e, t, r) {
  let n = r;
  for (let i = 1; i < Rd; i++)
    n = n - e(n) / t(n);
  return n;
}
function tr(e, t) {
  return e * Math.sqrt(1 - t * t);
}
const Vd = ["duration", "bounce"], Fd = ["stiffness", "damping", "mass"];
function Rn(e, t) {
  return t.some((r) => e[r] !== void 0);
}
function Id(e) {
  let t = {
    velocity: J.velocity,
    stiffness: J.stiffness,
    damping: J.damping,
    mass: J.mass,
    isResolvedFromDuration: !1,
    ...e
  };
  if (!Rn(e, Fd) && Rn(e, Vd))
    if (e.visualDuration) {
      const r = e.visualDuration, n = 2 * Math.PI / (r * 1.2), i = n * n, a = 2 * De(0.05, 1, 1 - (e.bounce || 0)) * Math.sqrt(i);
      t = {
        ...t,
        mass: J.mass,
        stiffness: i,
        damping: a
      };
    } else {
      const r = Dd(e);
      t = {
        ...t,
        ...r,
        mass: J.mass
      }, t.isResolvedFromDuration = !0;
    }
  return t;
}
function ws(e = J.visualDuration, t = J.bounce) {
  const r = typeof e != "object" ? {
    visualDuration: e,
    keyframes: [0, 1],
    bounce: t
  } : e;
  let { restSpeed: n, restDelta: i } = r;
  const a = r.keyframes[0], o = r.keyframes[r.keyframes.length - 1], l = { done: !1, value: a }, { stiffness: c, damping: u, mass: d, duration: h, velocity: f, isResolvedFromDuration: p } = Id({
    ...r,
    velocity: -/* @__PURE__ */ Ce(r.velocity || 0)
  }), y = f || 0, S = u / (2 * Math.sqrt(c * d)), C = o - a, j = /* @__PURE__ */ Ce(Math.sqrt(c / d)), w = Math.abs(C) < 5;
  n || (n = w ? J.restSpeed.granular : J.restSpeed.default), i || (i = w ? J.restDelta.granular : J.restDelta.default);
  let P;
  if (S < 1) {
    const A = tr(j, S);
    P = (I) => {
      const O = Math.exp(-S * j * I);
      return o - O * ((y + S * j * C) / A * Math.sin(A * I) + C * Math.cos(A * I));
    };
  } else if (S === 1)
    P = (A) => o - Math.exp(-j * A) * (C + (y + j * C) * A);
  else {
    const A = j * Math.sqrt(S * S - 1);
    P = (I) => {
      const O = Math.exp(-S * j * I), k = Math.min(A * I, 300);
      return o - O * ((y + S * j * C) * Math.sinh(k) + A * C * Math.cosh(k)) / A;
    };
  }
  const D = {
    calculatedDuration: p && h || null,
    next: (A) => {
      const I = P(A);
      if (p)
        l.done = A >= h;
      else {
        let O = A === 0 ? y : 0;
        S < 1 && (O = A === 0 ? /* @__PURE__ */ Te(y) : Ao(P, A, I));
        const k = Math.abs(O) <= n, x = Math.abs(o - I) <= i;
        l.done = k && x;
      }
      return l.value = l.done ? o : I, l;
    },
    toString: () => {
      const A = Math.min(Fr(D), vs), I = _o((O) => D.next(A * O).value, A, 30);
      return A + "ms " + I;
    },
    toTransition: () => {
    }
  };
  return D;
}
ws.applyToOptions = (e) => {
  const t = Ed(e, 100, ws);
  return e.ease = t.ease, e.duration = /* @__PURE__ */ Te(t.duration), e.type = "keyframes", e;
};
function sr({ keyframes: e, velocity: t = 0, power: r = 0.8, timeConstant: n = 325, bounceDamping: i = 10, bounceStiffness: a = 500, modifyTarget: o, min: l, max: c, restDelta: u = 0.5, restSpeed: d }) {
  const h = e[0], f = {
    done: !1,
    value: h
  }, p = (k) => l !== void 0 && k < l || c !== void 0 && k > c, y = (k) => l === void 0 ? c : c === void 0 || Math.abs(l - k) < Math.abs(c - k) ? l : c;
  let S = r * t;
  const C = h + S, j = o === void 0 ? C : o(C);
  j !== C && (S = j - h);
  const w = (k) => -S * Math.exp(-k / n), P = (k) => j + w(k), D = (k) => {
    const x = w(k), E = P(k);
    f.done = Math.abs(x) <= u, f.value = f.done ? j : E;
  };
  let A, I;
  const O = (k) => {
    p(f.value) && (A = k, I = ws({
      keyframes: [f.value, y(f.value)],
      velocity: Ao(P, k, f.value),
      // TODO: This should be passing * 1000
      damping: i,
      stiffness: a,
      restDelta: u,
      restSpeed: d
    }));
  };
  return O(0), {
    calculatedDuration: null,
    next: (k) => {
      let x = !1;
      return !I && A === void 0 && (x = !0, D(k), O(k)), A !== void 0 && k >= A ? I.next(k - A) : (!x && D(k), f);
    }
  };
}
function Od(e, t, r) {
  const n = [], i = r || Le.mix || Po, a = e.length - 1;
  for (let o = 0; o < a; o++) {
    let l = i(e[o], e[o + 1]);
    if (t) {
      const c = Array.isArray(t) ? t[o] || je : t;
      l = Kt(c, l);
    }
    n.push(l);
  }
  return n;
}
function Yd(e, t, { clamp: r = !0, ease: n, mixer: i } = {}) {
  const a = e.length;
  if (Re(a === t.length, "Both input and output ranges must be the same length", "range-length"), a === 1)
    return () => t[0];
  if (a === 2 && t[0] === t[1])
    return () => t[1];
  const o = e[0] === e[1];
  e[0] > e[a - 1] && (e = [...e].reverse(), t = [...t].reverse());
  const l = Od(t, n, i), c = l.length, u = (d) => {
    if (o && d < e[0])
      return t[0];
    let h = 0;
    if (c > 1)
      for (; h < e.length - 2 && !(d < e[h + 1]); h++)
        ;
    const f = /* @__PURE__ */ Yt(e[h], e[h + 1], d);
    return l[h](f);
  };
  return r ? (d) => u(De(e[0], e[a - 1], d)) : u;
}
function Bd(e, t) {
  const r = e[e.length - 1];
  for (let n = 1; n <= t; n++) {
    const i = /* @__PURE__ */ Yt(0, t, n);
    e.push(Q(r, 1, i));
  }
}
function zd(e) {
  const t = [0];
  return Bd(t, e.length - 1), t;
}
function Ud(e, t) {
  return e.map((r) => r * t);
}
function $d(e, t) {
  return e.map(() => t || yo).splice(0, e.length - 1);
}
function at({ duration: e = 300, keyframes: t, times: r, ease: n = "easeInOut" }) {
  const i = sd(n) ? n.map(_n) : _n(n), a = {
    done: !1,
    value: t[0]
  }, o = Ud(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    r && r.length === t.length ? r : zd(t),
    e
  ), l = Yd(o, t, {
    ease: Array.isArray(i) ? i : $d(t, i)
  });
  return {
    calculatedDuration: e,
    next: (c) => (a.value = l(c), a.done = c >= e, a)
  };
}
const Wd = (e) => e !== null;
function Ir(e, { repeat: t, repeatType: r = "loop" }, n, i = 1) {
  const a = e.filter(Wd), l = i < 0 || t && r !== "loop" && t % 2 === 1 ? 0 : a.length - 1;
  return !l || n === void 0 ? a[l] : n;
}
const Hd = {
  decay: sr,
  inertia: sr,
  tween: at,
  keyframes: at,
  spring: ws
};
function Eo(e) {
  typeof e.type == "string" && (e.type = Hd[e.type]);
}
class Or {
  constructor() {
    this.updateFinished();
  }
  get finished() {
    return this._finished;
  }
  updateFinished() {
    this._finished = new Promise((t) => {
      this.resolve = t;
    });
  }
  notifyFinished() {
    this.resolve();
  }
  /**
   * Allows the animation to be awaited.
   *
   * @deprecated Use `finished` instead.
   */
  then(t, r) {
    return this.finished.then(t, r);
  }
}
const Gd = (e) => e / 100;
class Yr extends Or {
  constructor(t) {
    super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.stop = () => {
      var n, i;
      const { motionValue: r } = this.options;
      r && r.updatedAt !== fe.now() && this.tick(fe.now()), this.isStopped = !0, this.state !== "idle" && (this.teardown(), (i = (n = this.options).onStop) == null || i.call(n));
    }, this.options = t, this.initAnimation(), this.play(), t.autoplay === !1 && this.pause();
  }
  initAnimation() {
    const { options: t } = this;
    Eo(t);
    const { type: r = at, repeat: n = 0, repeatDelay: i = 0, repeatType: a, velocity: o = 0 } = t;
    let { keyframes: l } = t;
    const c = r || at;
    process.env.NODE_ENV !== "production" && c !== at && Re(l.length <= 2, `Only two keyframes currently supported with spring and inertia animations. Trying to animate ${l}`, "spring-two-frames"), c !== at && typeof l[0] != "number" && (this.mixKeyframes = Kt(Gd, Po(l[0], l[1])), l = [0, 100]);
    const u = c({ ...t, keyframes: l });
    a === "mirror" && (this.mirroredGenerator = c({
      ...t,
      keyframes: [...l].reverse(),
      velocity: -o
    })), u.calculatedDuration === null && (u.calculatedDuration = Fr(u));
    const { calculatedDuration: d } = u;
    this.calculatedDuration = d, this.resolvedDuration = d + i, this.totalDuration = this.resolvedDuration * (n + 1) - i, this.generator = u;
  }
  updateTime(t) {
    const r = Math.round(t - this.startTime) * this.playbackSpeed;
    this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = r;
  }
  tick(t, r = !1) {
    const { generator: n, totalDuration: i, mixKeyframes: a, mirroredGenerator: o, resolvedDuration: l, calculatedDuration: c } = this;
    if (this.startTime === null)
      return n.next(0);
    const { delay: u = 0, keyframes: d, repeat: h, repeatType: f, repeatDelay: p, type: y, onUpdate: S, finalKeyframe: C } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, t) : this.speed < 0 && (this.startTime = Math.min(t - i / this.speed, this.startTime)), r ? this.currentTime = t : this.updateTime(t);
    const j = this.currentTime - u * (this.playbackSpeed >= 0 ? 1 : -1), w = this.playbackSpeed >= 0 ? j < 0 : j > i;
    this.currentTime = Math.max(j, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = i);
    let P = this.currentTime, D = n;
    if (h) {
      const k = Math.min(this.currentTime, i) / l;
      let x = Math.floor(k), E = k % 1;
      !E && k >= 1 && (E = 1), E === 1 && x--, x = Math.min(x, h + 1), !!(x % 2) && (f === "reverse" ? (E = 1 - E, p && (E -= p / l)) : f === "mirror" && (D = o)), P = De(0, 1, E) * l;
    }
    const A = w ? { done: !1, value: d[0] } : D.next(P);
    a && (A.value = a(A.value));
    let { done: I } = A;
    !w && c !== null && (I = this.playbackSpeed >= 0 ? this.currentTime >= i : this.currentTime <= 0);
    const O = this.holdTime === null && (this.state === "finished" || this.state === "running" && I);
    return O && y !== sr && (A.value = Ir(d, this.options, C, this.speed)), S && S(A.value), O && this.finish(), A;
  }
  /**
   * Allows the returned animation to be awaited or promise-chained. Currently
   * resolves when the animation finishes at all but in a future update could/should
   * reject if its cancels.
   */
  then(t, r) {
    return this.finished.then(t, r);
  }
  get duration() {
    return /* @__PURE__ */ Ce(this.calculatedDuration);
  }
  get time() {
    return /* @__PURE__ */ Ce(this.currentTime);
  }
  set time(t) {
    var r;
    t = /* @__PURE__ */ Te(t), this.currentTime = t, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = t : this.driver && (this.startTime = this.driver.now() - t / this.playbackSpeed), (r = this.driver) == null || r.start(!1);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(t) {
    this.updateTime(fe.now());
    const r = this.playbackSpeed !== t;
    this.playbackSpeed = t, r && (this.time = /* @__PURE__ */ Ce(this.currentTime));
  }
  play() {
    var i, a;
    if (this.isStopped)
      return;
    const { driver: t = Ad, startTime: r } = this.options;
    this.driver || (this.driver = t((o) => this.tick(o))), (a = (i = this.options).onPlay) == null || a.call(i);
    const n = this.driver.now();
    this.state === "finished" ? (this.updateFinished(), this.startTime = n) : this.holdTime !== null ? this.startTime = n - this.holdTime : this.startTime || (this.startTime = r ?? n), this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
  }
  pause() {
    this.state = "paused", this.updateTime(fe.now()), this.holdTime = this.currentTime;
  }
  complete() {
    this.state !== "running" && this.play(), this.state = "finished", this.holdTime = null;
  }
  finish() {
    var t, r;
    this.notifyFinished(), this.teardown(), this.state = "finished", (r = (t = this.options).onComplete) == null || r.call(t);
  }
  cancel() {
    var t, r;
    this.holdTime = null, this.startTime = 0, this.tick(0), this.teardown(), (r = (t = this.options).onCancel) == null || r.call(t);
  }
  teardown() {
    this.state = "idle", this.stopDriver(), this.startTime = this.holdTime = null;
  }
  stopDriver() {
    this.driver && (this.driver.stop(), this.driver = void 0);
  }
  sample(t) {
    return this.startTime = 0, this.tick(t, !0);
  }
  attachTimeline(t) {
    var r;
    return this.options.allowFlatten && (this.options.type = "keyframes", this.options.ease = "linear", this.initAnimation()), (r = this.driver) == null || r.stop(), t.observe(this);
  }
}
function Kd(e) {
  for (let t = 1; t < e.length; t++)
    e[t] ?? (e[t] = e[t - 1]);
}
const Xe = (e) => e * 180 / Math.PI, rr = (e) => {
  const t = Xe(Math.atan2(e[1], e[0]));
  return nr(t);
}, qd = {
  x: 4,
  y: 5,
  translateX: 4,
  translateY: 5,
  scaleX: 0,
  scaleY: 3,
  scale: (e) => (Math.abs(e[0]) + Math.abs(e[3])) / 2,
  rotate: rr,
  rotateZ: rr,
  skewX: (e) => Xe(Math.atan(e[1])),
  skewY: (e) => Xe(Math.atan(e[2])),
  skew: (e) => (Math.abs(e[1]) + Math.abs(e[2])) / 2
}, nr = (e) => (e = e % 360, e < 0 && (e += 360), e), Ln = rr, Vn = (e) => Math.sqrt(e[0] * e[0] + e[1] * e[1]), Fn = (e) => Math.sqrt(e[4] * e[4] + e[5] * e[5]), Xd = {
  x: 12,
  y: 13,
  z: 14,
  translateX: 12,
  translateY: 13,
  translateZ: 14,
  scaleX: Vn,
  scaleY: Fn,
  scale: (e) => (Vn(e) + Fn(e)) / 2,
  rotateX: (e) => nr(Xe(Math.atan2(e[6], e[5]))),
  rotateY: (e) => nr(Xe(Math.atan2(-e[2], e[0]))),
  rotateZ: Ln,
  rotate: Ln,
  skewX: (e) => Xe(Math.atan(e[4])),
  skewY: (e) => Xe(Math.atan(e[1])),
  skew: (e) => (Math.abs(e[1]) + Math.abs(e[4])) / 2
};
function ir(e) {
  return e.includes("scale") ? 1 : 0;
}
function or(e, t) {
  if (!e || e === "none")
    return ir(t);
  const r = e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let n, i;
  if (r)
    n = Xd, i = r;
  else {
    const l = e.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    n = qd, i = l;
  }
  if (!i)
    return ir(t);
  const a = n[t], o = i[1].split(",").map(Jd);
  return typeof a == "function" ? a(o) : o[a];
}
const Zd = (e, t) => {
  const { transform: r = "none" } = getComputedStyle(e);
  return or(r, t);
};
function Jd(e) {
  return parseFloat(e.trim());
}
const jt = [
  "transformPerspective",
  "x",
  "y",
  "z",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY"
], Nt = new Set(jt), In = (e) => e === wt || e === V, Qd = /* @__PURE__ */ new Set(["x", "y", "z"]), eu = jt.filter((e) => !Qd.has(e));
function tu(e) {
  const t = [];
  return eu.forEach((r) => {
    const n = e.getValue(r);
    n !== void 0 && (t.push([r, n.get()]), n.set(r.startsWith("scale") ? 1 : 0));
  }), t;
}
const Je = {
  // Dimensions
  width: ({ x: e }, { paddingLeft: t = "0", paddingRight: r = "0" }) => e.max - e.min - parseFloat(t) - parseFloat(r),
  height: ({ y: e }, { paddingTop: t = "0", paddingBottom: r = "0" }) => e.max - e.min - parseFloat(t) - parseFloat(r),
  top: (e, { top: t }) => parseFloat(t),
  left: (e, { left: t }) => parseFloat(t),
  bottom: ({ y: e }, { top: t }) => parseFloat(t) + (e.max - e.min),
  right: ({ x: e }, { left: t }) => parseFloat(t) + (e.max - e.min),
  // Transform
  x: (e, { transform: t }) => or(t, "x"),
  y: (e, { transform: t }) => or(t, "y")
};
Je.translateX = Je.x;
Je.translateY = Je.y;
const Qe = /* @__PURE__ */ new Set();
let ar = !1, lr = !1, cr = !1;
function Mo() {
  if (lr) {
    const e = Array.from(Qe).filter((n) => n.needsMeasurement), t = new Set(e.map((n) => n.element)), r = /* @__PURE__ */ new Map();
    t.forEach((n) => {
      const i = tu(n);
      i.length && (r.set(n, i), n.render());
    }), e.forEach((n) => n.measureInitialState()), t.forEach((n) => {
      n.render();
      const i = r.get(n);
      i && i.forEach(([a, o]) => {
        var l;
        (l = n.getValue(a)) == null || l.set(o);
      });
    }), e.forEach((n) => n.measureEndState()), e.forEach((n) => {
      n.suspendedScrollY !== void 0 && window.scrollTo(0, n.suspendedScrollY);
    });
  }
  lr = !1, ar = !1, Qe.forEach((e) => e.complete(cr)), Qe.clear();
}
function Do() {
  Qe.forEach((e) => {
    e.readKeyframes(), e.needsMeasurement && (lr = !0);
  });
}
function su() {
  cr = !0, Do(), Mo(), cr = !1;
}
class Br {
  constructor(t, r, n, i, a, o = !1) {
    this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...t], this.onComplete = r, this.name = n, this.motionValue = i, this.element = a, this.isAsync = o;
  }
  scheduleResolve() {
    this.state = "scheduled", this.isAsync ? (Qe.add(this), ar || (ar = !0, Z.read(Do), Z.resolveKeyframes(Mo))) : (this.readKeyframes(), this.complete());
  }
  readKeyframes() {
    const { unresolvedKeyframes: t, name: r, element: n, motionValue: i } = this;
    if (t[0] === null) {
      const a = i == null ? void 0 : i.get(), o = t[t.length - 1];
      if (a !== void 0)
        t[0] = a;
      else if (n && r) {
        const l = n.readValue(r, o);
        l != null && (t[0] = l);
      }
      t[0] === void 0 && (t[0] = o), i && a === void 0 && i.set(t[0]);
    }
    Kd(t);
  }
  setFinalKeyframe() {
  }
  measureInitialState() {
  }
  renderEndStyles() {
  }
  measureEndState() {
  }
  complete(t = !1) {
    this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, t), Qe.delete(this);
  }
  cancel() {
    this.state === "scheduled" && (Qe.delete(this), this.state = "pending");
  }
  resume() {
    this.state === "pending" && this.scheduleResolve();
  }
}
const ru = (e) => e.startsWith("--");
function nu(e, t, r) {
  ru(t) ? e.style.setProperty(t, r) : e.style[t] = r;
}
const iu = /* @__PURE__ */ Cr(() => window.ScrollTimeline !== void 0), ou = {};
function au(e, t) {
  const r = /* @__PURE__ */ Cr(e);
  return () => ou[t] ?? r();
}
const Ro = /* @__PURE__ */ au(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
    return !1;
  }
  return !0;
}, "linearEasing"), Mt = ([e, t, r, n]) => `cubic-bezier(${e}, ${t}, ${r}, ${n})`, On = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ Mt([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ Mt([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ Mt([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ Mt([0.33, 1.53, 0.69, 0.99])
};
function Lo(e, t) {
  if (e)
    return typeof e == "function" ? Ro() ? _o(e, t) : "ease-out" : bo(e) ? Mt(e) : Array.isArray(e) ? e.map((r) => Lo(r, t) || On.easeOut) : On[e];
}
function lu(e, t, r, { delay: n = 0, duration: i = 300, repeat: a = 0, repeatType: o = "loop", ease: l = "easeOut", times: c } = {}, u = void 0) {
  const d = {
    [t]: r
  };
  c && (d.offset = c);
  const h = Lo(l, i);
  Array.isArray(h) && (d.easing = h);
  const f = {
    delay: n,
    duration: i,
    easing: Array.isArray(h) ? "linear" : h,
    fill: "both",
    iterations: a + 1,
    direction: o === "reverse" ? "alternate" : "normal"
  };
  return u && (f.pseudoElement = u), e.animate(d, f);
}
function Vo(e) {
  return typeof e == "function" && "applyToOptions" in e;
}
function cu({ type: e, ...t }) {
  return Vo(e) && Ro() ? e.applyToOptions(t) : (t.duration ?? (t.duration = 300), t.ease ?? (t.ease = "easeOut"), t);
}
class du extends Or {
  constructor(t) {
    if (super(), this.finishedTime = null, this.isStopped = !1, !t)
      return;
    const { element: r, name: n, keyframes: i, pseudoElement: a, allowFlatten: o = !1, finalKeyframe: l, onComplete: c } = t;
    this.isPseudoElement = !!a, this.allowFlatten = o, this.options = t, Re(typeof t.type != "string", `Mini animate() doesn't support "type" as a string.`, "mini-spring");
    const u = cu(t);
    this.animation = lu(r, n, i, u, a), u.autoplay === !1 && this.animation.pause(), this.animation.onfinish = () => {
      if (this.finishedTime = this.time, !a) {
        const d = Ir(i, this.options, l, this.speed);
        this.updateMotionValue ? this.updateMotionValue(d) : nu(r, n, d), this.animation.cancel();
      }
      c == null || c(), this.notifyFinished();
    };
  }
  play() {
    this.isStopped || (this.animation.play(), this.state === "finished" && this.updateFinished());
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    var t, r;
    (r = (t = this.animation).finish) == null || r.call(t);
  }
  cancel() {
    try {
      this.animation.cancel();
    } catch {
    }
  }
  stop() {
    if (this.isStopped)
      return;
    this.isStopped = !0;
    const { state: t } = this;
    t === "idle" || t === "finished" || (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(), this.isPseudoElement || this.cancel());
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * In this method, we commit styles back to the DOM before cancelling
   * the animation.
   *
   * This is designed to be overridden by NativeAnimationExtended, which
   * will create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to also correctly calculate velocity for any subsequent animation
   * while deferring the commit until the next animation frame.
   */
  commitStyles() {
    var t, r;
    this.isPseudoElement || (r = (t = this.animation).commitStyles) == null || r.call(t);
  }
  get duration() {
    var r, n;
    const t = ((n = (r = this.animation.effect) == null ? void 0 : r.getComputedTiming) == null ? void 0 : n.call(r).duration) || 0;
    return /* @__PURE__ */ Ce(Number(t));
  }
  get time() {
    return /* @__PURE__ */ Ce(Number(this.animation.currentTime) || 0);
  }
  set time(t) {
    this.finishedTime = null, this.animation.currentTime = /* @__PURE__ */ Te(t);
  }
  /**
   * The playback speed of the animation.
   * 1 = normal speed, 2 = double speed, 0.5 = half speed.
   */
  get speed() {
    return this.animation.playbackRate;
  }
  set speed(t) {
    t < 0 && (this.finishedTime = null), this.animation.playbackRate = t;
  }
  get state() {
    return this.finishedTime !== null ? "finished" : this.animation.playState;
  }
  get startTime() {
    return Number(this.animation.startTime);
  }
  set startTime(t) {
    this.animation.startTime = t;
  }
  /**
   * Attaches a timeline to the animation, for instance the `ScrollTimeline`.
   */
  attachTimeline({ timeline: t, observe: r }) {
    var n;
    return this.allowFlatten && ((n = this.animation.effect) == null || n.updateTiming({ easing: "linear" })), this.animation.onfinish = null, t && iu() ? (this.animation.timeline = t, je) : r(this);
  }
}
const Fo = {
  anticipate: go,
  backInOut: fo,
  circInOut: xo
};
function uu(e) {
  return e in Fo;
}
function hu(e) {
  typeof e.ease == "string" && uu(e.ease) && (e.ease = Fo[e.ease]);
}
const Yn = 10;
class mu extends du {
  constructor(t) {
    hu(t), Eo(t), super(t), t.startTime && (this.startTime = t.startTime), this.options = t;
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * Rather than read commited styles back out of the DOM, we can
   * create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to calculate velocity for any subsequent animation.
   */
  updateMotionValue(t) {
    const { motionValue: r, onUpdate: n, onComplete: i, element: a, ...o } = this.options;
    if (!r)
      return;
    if (t !== void 0) {
      r.set(t);
      return;
    }
    const l = new Yr({
      ...o,
      autoplay: !1
    }), c = /* @__PURE__ */ Te(this.finishedTime ?? this.time);
    r.setWithVelocity(l.sample(c - Yn).value, l.sample(c).value, Yn), l.stop();
  }
}
const Bn = (e, t) => t === "zIndex" ? !1 : !!(typeof e == "number" || Array.isArray(e) || typeof e == "string" && // It's animatable if we have a string
(ze.test(e) || e === "0") && // And it contains numbers and/or colors
!e.startsWith("url("));
function fu(e) {
  const t = e[0];
  if (e.length === 1)
    return !0;
  for (let r = 0; r < e.length; r++)
    if (e[r] !== t)
      return !0;
}
function gu(e, t, r, n) {
  const i = e[0];
  if (i === null)
    return !1;
  if (t === "display" || t === "visibility")
    return !0;
  const a = e[e.length - 1], o = Bn(i, t), l = Bn(a, t);
  return vt(o === l, `You are trying to animate ${t} from "${i}" to "${a}". "${o ? a : i}" is not an animatable value.`, "value-not-animatable"), !o || !l ? !1 : fu(e) || (r === "spring" || Vo(r)) && n;
}
function dr(e) {
  e.duration = 0, e.type;
}
const pu = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Could be re-enabled now we have support for linear() easing
  // "background-color"
]), xu = /* @__PURE__ */ Cr(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function yu(e) {
  var d;
  const { motionValue: t, name: r, repeatDelay: n, repeatType: i, damping: a, type: o } = e;
  if (!(((d = t == null ? void 0 : t.owner) == null ? void 0 : d.current) instanceof HTMLElement))
    return !1;
  const { onUpdate: c, transformTemplate: u } = t.owner.getProps();
  return xu() && r && pu.has(r) && (r !== "transform" || !u) && /**
   * If we're outputting values to onUpdate then we can't use WAAPI as there's
   * no way to read the value from WAAPI every frame.
   */
  !c && !n && i !== "mirror" && a !== 0 && o !== "inertia";
}
const bu = 40;
class vu extends Or {
  constructor({ autoplay: t = !0, delay: r = 0, type: n = "keyframes", repeat: i = 0, repeatDelay: a = 0, repeatType: o = "loop", keyframes: l, name: c, motionValue: u, element: d, ...h }) {
    var y;
    super(), this.stop = () => {
      var S, C;
      this._animation && (this._animation.stop(), (S = this.stopTimeline) == null || S.call(this)), (C = this.keyframeResolver) == null || C.cancel();
    }, this.createdAt = fe.now();
    const f = {
      autoplay: t,
      delay: r,
      type: n,
      repeat: i,
      repeatDelay: a,
      repeatType: o,
      name: c,
      motionValue: u,
      element: d,
      ...h
    }, p = (d == null ? void 0 : d.KeyframeResolver) || Br;
    this.keyframeResolver = new p(l, (S, C, j) => this.onKeyframesResolved(S, C, f, !j), c, u, d), (y = this.keyframeResolver) == null || y.scheduleResolve();
  }
  onKeyframesResolved(t, r, n, i) {
    this.keyframeResolver = void 0;
    const { name: a, type: o, velocity: l, delay: c, isHandoff: u, onUpdate: d } = n;
    this.resolvedAt = fe.now(), gu(t, a, o, l) || ((Le.instantAnimations || !c) && (d == null || d(Ir(t, n, r))), t[0] = t[t.length - 1], dr(n), n.repeat = 0);
    const f = {
      startTime: i ? this.resolvedAt ? this.resolvedAt - this.createdAt > bu ? this.resolvedAt : this.createdAt : this.createdAt : void 0,
      finalKeyframe: r,
      ...n,
      keyframes: t
    }, p = !u && yu(f) ? new mu({
      ...f,
      element: f.motionValue.owner.current
    }) : new Yr(f);
    p.finished.then(() => this.notifyFinished()).catch(je), this.pendingTimeline && (this.stopTimeline = p.attachTimeline(this.pendingTimeline), this.pendingTimeline = void 0), this._animation = p;
  }
  get finished() {
    return this._animation ? this.animation.finished : this._finished;
  }
  then(t, r) {
    return this.finished.finally(t).then(() => {
    });
  }
  get animation() {
    var t;
    return this._animation || ((t = this.keyframeResolver) == null || t.resume(), su()), this._animation;
  }
  get duration() {
    return this.animation.duration;
  }
  get time() {
    return this.animation.time;
  }
  set time(t) {
    this.animation.time = t;
  }
  get speed() {
    return this.animation.speed;
  }
  get state() {
    return this.animation.state;
  }
  set speed(t) {
    this.animation.speed = t;
  }
  get startTime() {
    return this.animation.startTime;
  }
  attachTimeline(t) {
    return this._animation ? this.stopTimeline = this.animation.attachTimeline(t) : this.pendingTimeline = t, () => this.stop();
  }
  play() {
    this.animation.play();
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.complete();
  }
  cancel() {
    var t;
    this._animation && this.animation.cancel(), (t = this.keyframeResolver) == null || t.cancel();
  }
}
const wu = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function ju(e) {
  const t = wu.exec(e);
  if (!t)
    return [,];
  const [, r, n, i] = t;
  return [`--${r ?? n}`, i];
}
const Nu = 4;
function Io(e, t, r = 1) {
  Re(r <= Nu, `Max CSS variable fallback depth detected in property "${e}". This may indicate a circular fallback dependency.`, "max-css-var-depth");
  const [n, i] = ju(e);
  if (!n)
    return;
  const a = window.getComputedStyle(t).getPropertyValue(n);
  if (a) {
    const o = a.trim();
    return io(o) ? parseFloat(o) : o;
  }
  return Dr(i) ? Io(i, t, r + 1) : i;
}
function zr(e, t) {
  return (e == null ? void 0 : e[t]) ?? (e == null ? void 0 : e.default) ?? e;
}
const Oo = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...jt
]), ku = {
  test: (e) => e === "auto",
  parse: (e) => e
}, Yo = (e) => (t) => t.test(e), Bo = [wt, V, Pe, Fe, fd, md, ku], zn = (e) => Bo.find(Yo(e));
function Tu(e) {
  return typeof e == "number" ? e === 0 : e !== null ? e === "none" || e === "0" || ao(e) : !0;
}
const Su = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function Cu(e) {
  const [t, r] = e.slice(0, -1).split("(");
  if (t === "drop-shadow")
    return e;
  const [n] = r.match(Rr) || [];
  if (!n)
    return e;
  const i = r.replace(n, "");
  let a = Su.has(t) ? 1 : 0;
  return n !== r && (a *= 100), t + "(" + a + i + ")";
}
const Pu = /\b([a-z-]*)\(.*?\)/gu, ur = {
  ...ze,
  getAnimatableNone: (e) => {
    const t = e.match(Pu);
    return t ? t.map(Cu).join(" ") : e;
  }
}, Un = {
  ...wt,
  transform: Math.round
}, _u = {
  rotate: Fe,
  rotateX: Fe,
  rotateY: Fe,
  rotateZ: Fe,
  scale: as,
  scaleX: as,
  scaleY: as,
  scaleZ: as,
  skew: Fe,
  skewX: Fe,
  skewY: Fe,
  distance: V,
  translateX: V,
  translateY: V,
  translateZ: V,
  x: V,
  y: V,
  z: V,
  perspective: V,
  transformPerspective: V,
  opacity: Bt,
  originX: An,
  originY: An,
  originZ: V
}, Ur = {
  // Border props
  borderWidth: V,
  borderTopWidth: V,
  borderRightWidth: V,
  borderBottomWidth: V,
  borderLeftWidth: V,
  borderRadius: V,
  radius: V,
  borderTopLeftRadius: V,
  borderTopRightRadius: V,
  borderBottomRightRadius: V,
  borderBottomLeftRadius: V,
  // Positioning props
  width: V,
  maxWidth: V,
  height: V,
  maxHeight: V,
  top: V,
  right: V,
  bottom: V,
  left: V,
  // Spacing props
  padding: V,
  paddingTop: V,
  paddingRight: V,
  paddingBottom: V,
  paddingLeft: V,
  margin: V,
  marginTop: V,
  marginRight: V,
  marginBottom: V,
  marginLeft: V,
  // Misc
  backgroundPositionX: V,
  backgroundPositionY: V,
  ..._u,
  zIndex: Un,
  // SVG
  fillOpacity: Bt,
  strokeOpacity: Bt,
  numOctaves: Un
}, Au = {
  ...Ur,
  // Color props
  color: ne,
  backgroundColor: ne,
  outlineColor: ne,
  fill: ne,
  stroke: ne,
  // Border props
  borderColor: ne,
  borderTopColor: ne,
  borderRightColor: ne,
  borderBottomColor: ne,
  borderLeftColor: ne,
  filter: ur,
  WebkitFilter: ur
}, zo = (e) => Au[e];
function Uo(e, t) {
  let r = zo(e);
  return r !== ur && (r = ze), r.getAnimatableNone ? r.getAnimatableNone(t) : void 0;
}
const Eu = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function Mu(e, t, r) {
  let n = 0, i;
  for (; n < e.length && !i; ) {
    const a = e[n];
    typeof a == "string" && !Eu.has(a) && zt(a).values.length && (i = e[n]), n++;
  }
  if (i && r)
    for (const a of t)
      e[a] = Uo(r, i);
}
class Du extends Br {
  constructor(t, r, n, i, a) {
    super(t, r, n, i, a, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: t, element: r, name: n } = this;
    if (!r || !r.current)
      return;
    super.readKeyframes();
    for (let c = 0; c < t.length; c++) {
      let u = t[c];
      if (typeof u == "string" && (u = u.trim(), Dr(u))) {
        const d = Io(u, r.current);
        d !== void 0 && (t[c] = d), c === t.length - 1 && (this.finalKeyframe = u);
      }
    }
    if (this.resolveNoneKeyframes(), !Oo.has(n) || t.length !== 2)
      return;
    const [i, a] = t, o = zn(i), l = zn(a);
    if (o !== l)
      if (In(o) && In(l))
        for (let c = 0; c < t.length; c++) {
          const u = t[c];
          typeof u == "string" && (t[c] = parseFloat(u));
        }
      else Je[n] && (this.needsMeasurement = !0);
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: t, name: r } = this, n = [];
    for (let i = 0; i < t.length; i++)
      (t[i] === null || Tu(t[i])) && n.push(i);
    n.length && Mu(t, n, r);
  }
  measureInitialState() {
    const { element: t, unresolvedKeyframes: r, name: n } = this;
    if (!t || !t.current)
      return;
    n === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = Je[n](t.measureViewportBox(), window.getComputedStyle(t.current)), r[0] = this.measuredOrigin;
    const i = r[r.length - 1];
    i !== void 0 && t.getValue(n, i).jump(i, !1);
  }
  measureEndState() {
    var l;
    const { element: t, name: r, unresolvedKeyframes: n } = this;
    if (!t || !t.current)
      return;
    const i = t.getValue(r);
    i && i.jump(this.measuredOrigin, !1);
    const a = n.length - 1, o = n[a];
    n[a] = Je[r](t.measureViewportBox(), window.getComputedStyle(t.current)), o !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = o), (l = this.removedTransforms) != null && l.length && this.removedTransforms.forEach(([c, u]) => {
      t.getValue(c).set(u);
    }), this.resolveNoneKeyframes();
  }
}
function Ru(e, t, r) {
  if (e instanceof EventTarget)
    return [e];
  if (typeof e == "string") {
    let n = document;
    const i = (r == null ? void 0 : r[e]) ?? n.querySelectorAll(e);
    return i ? Array.from(i) : [];
  }
  return Array.from(e);
}
const $o = (e, t) => t && typeof e == "number" ? t.transform(e) : e;
function Lu(e) {
  return oo(e) && "offsetHeight" in e;
}
const $n = 30, Vu = (e) => !isNaN(parseFloat(e));
class Fu {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   */
  constructor(t, r = {}) {
    this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (n) => {
      var a;
      const i = fe.now();
      if (this.updatedAt !== i && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(n), this.current !== this.prev && ((a = this.events.change) == null || a.notify(this.current), this.dependents))
        for (const o of this.dependents)
          o.dirty();
    }, this.hasAnimated = !1, this.setCurrent(t), this.owner = r.owner;
  }
  setCurrent(t) {
    this.current = t, this.updatedAt = fe.now(), this.canTrackVelocity === null && t !== void 0 && (this.canTrackVelocity = Vu(this.current));
  }
  setPrevFrameValue(t = this.current) {
    this.prevFrameValue = t, this.prevUpdatedAt = this.updatedAt;
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   *
   * When calling `onChange` inside a React component, it should be wrapped with the
   * `useEffect` hook. As it returns an unsubscribe function, this should be returned
   * from the `useEffect` function to ensure you don't add duplicate subscribers..
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *   const y = useMotionValue(0)
   *   const opacity = useMotionValue(1)
   *
   *   useEffect(() => {
   *     function updateOpacity() {
   *       const maxXY = Math.max(x.get(), y.get())
   *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
   *       opacity.set(newOpacity)
   *     }
   *
   *     const unsubscribeX = x.on("change", updateOpacity)
   *     const unsubscribeY = y.on("change", updateOpacity)
   *
   *     return () => {
   *       unsubscribeX()
   *       unsubscribeY()
   *     }
   *   }, [])
   *
   *   return <motion.div style={{ x }} />
   * }
   * ```
   *
   * @param subscriber - A function that receives the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @deprecated
   */
  onChange(t) {
    return process.env.NODE_ENV !== "production" && _r(!1, 'value.onChange(callback) is deprecated. Switch to value.on("change", callback).'), this.on("change", t);
  }
  on(t, r) {
    this.events[t] || (this.events[t] = new Pr());
    const n = this.events[t].add(r);
    return t === "change" ? () => {
      n(), Z.read(() => {
        this.events.change.getSize() || this.stop();
      });
    } : n;
  }
  clearListeners() {
    for (const t in this.events)
      this.events[t].clear();
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   */
  attach(t, r) {
    this.passiveEffect = t, this.stopPassiveEffect = r;
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set(t) {
    this.passiveEffect ? this.passiveEffect(t, this.updateAndNotify) : this.updateAndNotify(t);
  }
  setWithVelocity(t, r, n) {
    this.set(r), this.prev = void 0, this.prevFrameValue = t, this.prevUpdatedAt = this.updatedAt - n;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(t, r = !0) {
    this.updateAndNotify(t), this.prev = t, this.prevUpdatedAt = this.prevFrameValue = void 0, r && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
  dirty() {
    var t;
    (t = this.events.change) == null || t.notify(this.current);
  }
  addDependent(t) {
    this.dependents || (this.dependents = /* @__PURE__ */ new Set()), this.dependents.add(t);
  }
  removeDependent(t) {
    this.dependents && this.dependents.delete(t);
  }
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get() {
    return this.current;
  }
  /**
   * @public
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity() {
    const t = fe.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || t - this.updatedAt > $n)
      return 0;
    const r = Math.min(this.updatedAt - this.prevUpdatedAt, $n);
    return lo(parseFloat(this.current) - parseFloat(this.prevFrameValue), r);
  }
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   */
  start(t) {
    return this.stop(), new Promise((r) => {
      this.hasAnimated = !0, this.animation = t(r), this.events.animationStart && this.events.animationStart.notify();
    }).then(() => {
      this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation();
    });
  }
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop() {
    this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy() {
    var t, r;
    (t = this.dependents) == null || t.clear(), (r = this.events.destroy) == null || r.notify(), this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
}
function xt(e, t) {
  return new Fu(e, t);
}
const { schedule: $r } = /* @__PURE__ */ vo(queueMicrotask, !1), ke = {
  x: !1,
  y: !1
};
function Wo() {
  return ke.x || ke.y;
}
function Iu(e) {
  return e === "x" || e === "y" ? ke[e] ? null : (ke[e] = !0, () => {
    ke[e] = !1;
  }) : ke.x || ke.y ? null : (ke.x = ke.y = !0, () => {
    ke.x = ke.y = !1;
  });
}
function Ho(e, t) {
  const r = Ru(e), n = new AbortController(), i = {
    passive: !0,
    ...t,
    signal: n.signal
  };
  return [r, i, () => n.abort()];
}
function Wn(e) {
  return !(e.pointerType === "touch" || Wo());
}
function Ou(e, t, r = {}) {
  const [n, i, a] = Ho(e, r), o = (l) => {
    if (!Wn(l))
      return;
    const { target: c } = l, u = t(c, l);
    if (typeof u != "function" || !c)
      return;
    const d = (h) => {
      Wn(h) && (u(h), c.removeEventListener("pointerleave", d));
    };
    c.addEventListener("pointerleave", d, i);
  };
  return n.forEach((l) => {
    l.addEventListener("pointerenter", o, i);
  }), a;
}
const Go = (e, t) => t ? e === t ? !0 : Go(e, t.parentElement) : !1, Wr = (e) => e.pointerType === "mouse" ? typeof e.button != "number" || e.button <= 0 : e.isPrimary !== !1, Yu = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function Bu(e) {
  return Yu.has(e.tagName) || e.tabIndex !== -1;
}
const fs = /* @__PURE__ */ new WeakSet();
function Hn(e) {
  return (t) => {
    t.key === "Enter" && e(t);
  };
}
function Ys(e, t) {
  e.dispatchEvent(new PointerEvent("pointer" + t, { isPrimary: !0, bubbles: !0 }));
}
const zu = (e, t) => {
  const r = e.currentTarget;
  if (!r)
    return;
  const n = Hn(() => {
    if (fs.has(r))
      return;
    Ys(r, "down");
    const i = Hn(() => {
      Ys(r, "up");
    }), a = () => Ys(r, "cancel");
    r.addEventListener("keyup", i, t), r.addEventListener("blur", a, t);
  });
  r.addEventListener("keydown", n, t), r.addEventListener("blur", () => r.removeEventListener("keydown", n), t);
};
function Gn(e) {
  return Wr(e) && !Wo();
}
function Uu(e, t, r = {}) {
  const [n, i, a] = Ho(e, r), o = (l) => {
    const c = l.currentTarget;
    if (!Gn(l))
      return;
    fs.add(c);
    const u = t(c, l), d = (p, y) => {
      window.removeEventListener("pointerup", h), window.removeEventListener("pointercancel", f), fs.has(c) && fs.delete(c), Gn(p) && typeof u == "function" && u(p, { success: y });
    }, h = (p) => {
      d(p, c === window || c === document || r.useGlobalTarget || Go(c, p.target));
    }, f = (p) => {
      d(p, !1);
    };
    window.addEventListener("pointerup", h, i), window.addEventListener("pointercancel", f, i);
  };
  return n.forEach((l) => {
    (r.useGlobalTarget ? window : l).addEventListener("pointerdown", o, i), Lu(l) && (l.addEventListener("focus", (u) => zu(u, i)), !Bu(l) && !l.hasAttribute("tabindex") && (l.tabIndex = 0));
  }), a;
}
function Ko(e) {
  return oo(e) && "ownerSVGElement" in e;
}
function $u(e) {
  return Ko(e) && e.tagName === "svg";
}
const ce = (e) => !!(e && e.getVelocity), Wu = [...Bo, ne, ze], Hu = (e) => Wu.find(Yo(e)), qo = Ue({
  transformPagePoint: (e) => e,
  isStatic: !1,
  reducedMotion: "never"
});
function Gu(e = !0) {
  const t = le(kr);
  if (t === null)
    return [!0, null];
  const { isPresent: r, onExitComplete: n, register: i } = t, a = ll();
  xe(() => {
    if (e)
      return i(a);
  }, [e]);
  const o = zi(() => e && n && n(a), [a, n, e]);
  return !r && n ? [!1, o] : [!0];
}
const Xo = Ue({ strict: !1 }), Kn = {
  animation: [
    "animate",
    "variants",
    "whileHover",
    "whileTap",
    "exit",
    "whileInView",
    "whileFocus",
    "whileDrag"
  ],
  exit: ["exit"],
  drag: ["drag", "dragControls"],
  focus: ["whileFocus"],
  hover: ["whileHover", "onHoverStart", "onHoverEnd"],
  tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
  pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
  inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
  layout: ["layout", "layoutId"]
}, yt = {};
for (const e in Kn)
  yt[e] = {
    isEnabled: (t) => Kn[e].some((r) => !!t[r])
  };
function Ku(e) {
  for (const t in e)
    yt[t] = {
      ...yt[t],
      ...e[t]
    };
}
const qu = /* @__PURE__ */ new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "ignoreStrict",
  "viewport"
]);
function js(e) {
  return e.startsWith("while") || e.startsWith("drag") && e !== "draggable" || e.startsWith("layout") || e.startsWith("onTap") || e.startsWith("onPan") || e.startsWith("onLayout") || qu.has(e);
}
let Zo = (e) => !js(e);
function Xu(e) {
  typeof e == "function" && (Zo = (t) => t.startsWith("on") ? !js(t) : e(t));
}
try {
  Xu(require("@emotion/is-prop-valid").default);
} catch {
}
function Zu(e, t, r) {
  const n = {};
  for (const i in e)
    i === "values" && typeof e.values == "object" || (Zo(i) || r === !0 && js(i) || !t && !js(i) || // If trying to use native HTML drag events, forward drag listeners
    e.draggable && i.startsWith("onDrag")) && (n[i] = e[i]);
  return n;
}
const Cs = /* @__PURE__ */ Ue({});
function Ps(e) {
  return e !== null && typeof e == "object" && typeof e.start == "function";
}
function Ut(e) {
  return typeof e == "string" || Array.isArray(e);
}
const Hr = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], Gr = ["initial", ...Hr];
function _s(e) {
  return Ps(e.animate) || Gr.some((t) => Ut(e[t]));
}
function Jo(e) {
  return !!(_s(e) || e.variants);
}
function Ju(e, t) {
  if (_s(e)) {
    const { initial: r, animate: n } = e;
    return {
      initial: r === !1 || Ut(r) ? r : void 0,
      animate: Ut(n) ? n : void 0
    };
  }
  return e.inherit !== !1 ? t : {};
}
function Qu(e) {
  const { initial: t, animate: r } = Ju(e, le(Cs));
  return ks(() => ({ initial: t, animate: r }), [qn(t), qn(r)]);
}
function qn(e) {
  return Array.isArray(e) ? e.join(" ") : e;
}
const $t = {};
function eh(e) {
  for (const t in e)
    $t[t] = e[t], Mr(t) && ($t[t].isCSSVariable = !0);
}
function Qo(e, { layout: t, layoutId: r }) {
  return Nt.has(e) || e.startsWith("origin") || (t || r !== void 0) && (!!$t[e] || e === "opacity");
}
const th = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, sh = jt.length;
function rh(e, t, r) {
  let n = "", i = !0;
  for (let a = 0; a < sh; a++) {
    const o = jt[a], l = e[o];
    if (l === void 0)
      continue;
    let c = !0;
    if (typeof l == "number" ? c = l === (o.startsWith("scale") ? 1 : 0) : c = parseFloat(l) === 0, !c || r) {
      const u = $o(l, Ur[o]);
      if (!c) {
        i = !1;
        const d = th[o] || o;
        n += `${d}(${u}) `;
      }
      r && (t[o] = u);
    }
  }
  return n = n.trim(), r ? n = r(t, i ? "" : n) : i && (n = "none"), n;
}
function Kr(e, t, r) {
  const { style: n, vars: i, transformOrigin: a } = e;
  let o = !1, l = !1;
  for (const c in t) {
    const u = t[c];
    if (Nt.has(c)) {
      o = !0;
      continue;
    } else if (Mr(c)) {
      i[c] = u;
      continue;
    } else {
      const d = $o(u, Ur[c]);
      c.startsWith("origin") ? (l = !0, a[c] = d) : n[c] = d;
    }
  }
  if (t.transform || (o || r ? n.transform = rh(t, e.transform, r) : n.transform && (n.transform = "none")), l) {
    const { originX: c = "50%", originY: u = "50%", originZ: d = 0 } = a;
    n.transformOrigin = `${c} ${u} ${d}`;
  }
}
const qr = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
function ea(e, t, r) {
  for (const n in t)
    !ce(t[n]) && !Qo(n, r) && (e[n] = t[n]);
}
function nh({ transformTemplate: e }, t) {
  return ks(() => {
    const r = qr();
    return Kr(r, t, e), Object.assign({}, r.vars, r.style);
  }, [t]);
}
function ih(e, t) {
  const r = e.style || {}, n = {};
  return ea(n, r, e), Object.assign(n, nh(e, t)), n;
}
function oh(e, t) {
  const r = {}, n = ih(e, t);
  return e.drag && e.dragListener !== !1 && (r.draggable = !1, n.userSelect = n.WebkitUserSelect = n.WebkitTouchCallout = "none", n.touchAction = e.drag === !0 ? "none" : `pan-${e.drag === "x" ? "y" : "x"}`), e.tabIndex === void 0 && (e.onTap || e.onTapStart || e.whileTap) && (r.tabIndex = 0), r.style = n, r;
}
const ah = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, lh = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function ch(e, t, r = 1, n = 0, i = !0) {
  e.pathLength = 1;
  const a = i ? ah : lh;
  e[a.offset] = V.transform(-n);
  const o = V.transform(t), l = V.transform(r);
  e[a.array] = `${o} ${l}`;
}
function ta(e, {
  attrX: t,
  attrY: r,
  attrScale: n,
  pathLength: i,
  pathSpacing: a = 1,
  pathOffset: o = 0,
  // This is object creation, which we try to avoid per-frame.
  ...l
}, c, u, d) {
  if (Kr(e, l, u), c) {
    e.style.viewBox && (e.attrs.viewBox = e.style.viewBox);
    return;
  }
  e.attrs = e.style, e.style = {};
  const { attrs: h, style: f } = e;
  h.transform && (f.transform = h.transform, delete h.transform), (f.transform || h.transformOrigin) && (f.transformOrigin = h.transformOrigin ?? "50% 50%", delete h.transformOrigin), f.transform && (f.transformBox = (d == null ? void 0 : d.transformBox) ?? "fill-box", delete h.transformBox), t !== void 0 && (h.x = t), r !== void 0 && (h.y = r), n !== void 0 && (h.scale = n), i !== void 0 && ch(h, i, a, o, !1);
}
const sa = () => ({
  ...qr(),
  attrs: {}
}), ra = (e) => typeof e == "string" && e.toLowerCase() === "svg";
function dh(e, t, r, n) {
  const i = ks(() => {
    const a = sa();
    return ta(a, t, ra(n), e.transformTemplate, e.style), {
      ...a.attrs,
      style: { ...a.style }
    };
  }, [t]);
  if (e.style) {
    const a = {};
    ea(a, e.style, e), i.style = { ...a, ...i.style };
  }
  return i;
}
const uh = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view"
];
function Xr(e) {
  return (
    /**
     * If it's not a string, it's a custom React component. Currently we only support
     * HTML custom React components.
     */
    typeof e != "string" || /**
     * If it contains a dash, the element is a custom HTML webcomponent.
     */
    e.includes("-") ? !1 : (
      /**
       * If it's in our list of lowercase SVG tags, it's an SVG component
       */
      !!(uh.indexOf(e) > -1 || /**
       * If it contains a capital letter, it's an SVG component
       */
      /[A-Z]/u.test(e))
    )
  );
}
function hh(e, t, r, { latestValues: n }, i, a = !1) {
  const l = (Xr(e) ? dh : oh)(t, n, i, e), c = Zu(t, typeof e == "string", a), u = e !== Ui ? { ...c, ...l, ref: r } : {}, { children: d } = t, h = ks(() => ce(d) ? d.get() : d, [d]);
  return cl(e, {
    ...u,
    children: h
  });
}
function Xn(e) {
  const t = [{}, {}];
  return e == null || e.values.forEach((r, n) => {
    t[0][n] = r.get(), t[1][n] = r.getVelocity();
  }), t;
}
function Zr(e, t, r, n) {
  if (typeof t == "function") {
    const [i, a] = Xn(n);
    t = t(r !== void 0 ? r : e.custom, i, a);
  }
  if (typeof t == "string" && (t = e.variants && e.variants[t]), typeof t == "function") {
    const [i, a] = Xn(n);
    t = t(r !== void 0 ? r : e.custom, i, a);
  }
  return t;
}
function gs(e) {
  return ce(e) ? e.get() : e;
}
function mh({ scrapeMotionValuesFromProps: e, createRenderState: t }, r, n, i) {
  return {
    latestValues: fh(r, n, i, e),
    renderState: t()
  };
}
function fh(e, t, r, n) {
  const i = {}, a = n(e, {});
  for (const f in a)
    i[f] = gs(a[f]);
  let { initial: o, animate: l } = e;
  const c = _s(e), u = Jo(e);
  t && u && !c && e.inherit !== !1 && (o === void 0 && (o = t.initial), l === void 0 && (l = t.animate));
  let d = r ? r.initial === !1 : !1;
  d = d || o === !1;
  const h = d ? l : o;
  if (h && typeof h != "boolean" && !Ps(h)) {
    const f = Array.isArray(h) ? h : [h];
    for (let p = 0; p < f.length; p++) {
      const y = Zr(e, f[p]);
      if (y) {
        const { transitionEnd: S, transition: C, ...j } = y;
        for (const w in j) {
          let P = j[w];
          if (Array.isArray(P)) {
            const D = d ? P.length - 1 : 0;
            P = P[D];
          }
          P !== null && (i[w] = P);
        }
        for (const w in S)
          i[w] = S[w];
      }
    }
  }
  return i;
}
const na = (e) => (t, r) => {
  const n = le(Cs), i = le(kr), a = () => mh(e, t, n, i);
  return r ? a() : Kc(a);
};
function Jr(e, t, r) {
  var a;
  const { style: n } = e, i = {};
  for (const o in n)
    (ce(n[o]) || t.style && ce(t.style[o]) || Qo(o, e) || ((a = r == null ? void 0 : r.getValue(o)) == null ? void 0 : a.liveStyle) !== void 0) && (i[o] = n[o]);
  return i;
}
const gh = /* @__PURE__ */ na({
  scrapeMotionValuesFromProps: Jr,
  createRenderState: qr
});
function ia(e, t, r) {
  const n = Jr(e, t, r);
  for (const i in e)
    if (ce(e[i]) || ce(t[i])) {
      const a = jt.indexOf(i) !== -1 ? "attr" + i.charAt(0).toUpperCase() + i.substring(1) : i;
      n[a] = e[i];
    }
  return n;
}
const ph = /* @__PURE__ */ na({
  scrapeMotionValuesFromProps: ia,
  createRenderState: sa
}), xh = Symbol.for("motionComponentSymbol");
function lt(e) {
  return e && typeof e == "object" && Object.prototype.hasOwnProperty.call(e, "current");
}
function yh(e, t, r) {
  return zi(
    (n) => {
      n && e.onMount && e.onMount(n), t && (n ? t.mount(n) : t.unmount()), r && (typeof r == "function" ? r(n) : lt(r) && (r.current = n));
    },
    /**
     * Only pass a new ref callback to React if we've received a visual element
     * factory. Otherwise we'll be mounting/remounting every time externalRef
     * or other dependencies change.
     */
    [t]
  );
}
const Qr = (e) => e.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(), bh = "framerAppearId", oa = "data-" + Qr(bh), aa = Ue({});
function vh(e, t, r, n, i) {
  var S, C;
  const { visualElement: a } = le(Cs), o = le(Xo), l = le(kr), c = le(qo).reducedMotion, u = ht(null);
  n = n || o.renderer, !u.current && n && (u.current = n(e, {
    visualState: t,
    parent: a,
    props: r,
    presenceContext: l,
    blockInitialAnimation: l ? l.initial === !1 : !1,
    reducedMotionConfig: c
  }));
  const d = u.current, h = le(aa);
  d && !d.projection && i && (d.type === "html" || d.type === "svg") && wh(u.current, r, i, h);
  const f = ht(!1);
  dl(() => {
    d && f.current && d.update(r, l);
  });
  const p = r[oa], y = ht(!!p && !((S = window.MotionHandoffIsComplete) != null && S.call(window, p)) && ((C = window.MotionHasOptimisedAnimation) == null ? void 0 : C.call(window, p)));
  return qc(() => {
    d && (f.current = !0, window.MotionIsMounted = !0, d.updateFeatures(), d.scheduleRenderMicrotask(), y.current && d.animationState && d.animationState.animateChanges());
  }), xe(() => {
    d && (!y.current && d.animationState && d.animationState.animateChanges(), y.current && (queueMicrotask(() => {
      var j;
      (j = window.MotionHandoffMarkAsComplete) == null || j.call(window, p);
    }), y.current = !1), d.enteringChildren = void 0);
  }), d;
}
function wh(e, t, r, n) {
  const { layoutId: i, layout: a, drag: o, dragConstraints: l, layoutScroll: c, layoutRoot: u, layoutCrossfade: d } = t;
  e.projection = new r(e.latestValues, t["data-framer-portal-id"] ? void 0 : la(e.parent)), e.projection.setOptions({
    layoutId: i,
    layout: a,
    alwaysMeasureLayout: !!o || l && lt(l),
    visualElement: e,
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof a == "string" ? a : "both",
    initialPromotionConfig: n,
    crossfade: d,
    layoutScroll: c,
    layoutRoot: u
  });
}
function la(e) {
  if (e)
    return e.options.allowProjection !== !1 ? e.projection : la(e.parent);
}
function Bs(e, { forwardMotionProps: t = !1 } = {}, r, n) {
  r && Ku(r);
  const i = Xr(e) ? ph : gh;
  function a(l, c) {
    let u;
    const d = {
      ...le(qo),
      ...l,
      layoutId: jh(l)
    }, { isStatic: h } = d, f = Qu(l), p = i(l, h);
    if (!h && Nr) {
      Nh(d, r);
      const y = kh(d);
      u = y.MeasureLayout, f.visualElement = vh(e, p, d, n, y.ProjectionNode);
    }
    return s.jsxs(Cs.Provider, { value: f, children: [u && f.visualElement ? s.jsx(u, { visualElement: f.visualElement, ...d }) : null, hh(e, l, yh(p, f.visualElement, c), p, h, t)] });
  }
  a.displayName = `motion.${typeof e == "string" ? e : `create(${e.displayName ?? e.name ?? ""})`}`;
  const o = ul(a);
  return o[xh] = e, o;
}
function jh({ layoutId: e }) {
  const t = le(no).id;
  return t && e !== void 0 ? t + "-" + e : e;
}
function Nh(e, t) {
  const r = le(Xo).strict;
  if (process.env.NODE_ENV !== "production" && t && r) {
    const n = "You have rendered a `motion` component within a `LazyMotion` component. This will break tree shaking. Import and render a `m` component instead.";
    e.ignoreStrict ? vt(!1, n, "lazy-strict-mode") : Re(!1, n, "lazy-strict-mode");
  }
}
function kh(e) {
  const { drag: t, layout: r } = yt;
  if (!t && !r)
    return {};
  const n = { ...t, ...r };
  return {
    MeasureLayout: t != null && t.isEnabled(e) || r != null && r.isEnabled(e) ? n.MeasureLayout : void 0,
    ProjectionNode: n.ProjectionNode
  };
}
function Th(e, t) {
  if (typeof Proxy > "u")
    return Bs;
  const r = /* @__PURE__ */ new Map(), n = (a, o) => Bs(a, o, e, t), i = (a, o) => (process.env.NODE_ENV !== "production" && _r(!1, "motion() is deprecated. Use motion.create() instead."), n(a, o));
  return new Proxy(i, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (a, o) => o === "create" ? n : (r.has(o) || r.set(o, Bs(o, void 0, e, t)), r.get(o))
  });
}
function ca({ top: e, left: t, right: r, bottom: n }) {
  return {
    x: { min: t, max: r },
    y: { min: e, max: n }
  };
}
function Sh({ x: e, y: t }) {
  return { top: t.min, right: e.max, bottom: t.max, left: e.min };
}
function Ch(e, t) {
  if (!t)
    return e;
  const r = t({ x: e.left, y: e.top }), n = t({ x: e.right, y: e.bottom });
  return {
    top: r.y,
    left: r.x,
    bottom: n.y,
    right: n.x
  };
}
function zs(e) {
  return e === void 0 || e === 1;
}
function hr({ scale: e, scaleX: t, scaleY: r }) {
  return !zs(e) || !zs(t) || !zs(r);
}
function Ke(e) {
  return hr(e) || da(e) || e.z || e.rotate || e.rotateX || e.rotateY || e.skewX || e.skewY;
}
function da(e) {
  return Zn(e.x) || Zn(e.y);
}
function Zn(e) {
  return e && e !== "0%";
}
function Ns(e, t, r) {
  const n = e - r, i = t * n;
  return r + i;
}
function Jn(e, t, r, n, i) {
  return i !== void 0 && (e = Ns(e, i, n)), Ns(e, r, n) + t;
}
function mr(e, t = 0, r = 1, n, i) {
  e.min = Jn(e.min, t, r, n, i), e.max = Jn(e.max, t, r, n, i);
}
function ua(e, { x: t, y: r }) {
  mr(e.x, t.translate, t.scale, t.originPoint), mr(e.y, r.translate, r.scale, r.originPoint);
}
const Qn = 0.999999999999, ei = 1.0000000000001;
function Ph(e, t, r, n = !1) {
  const i = r.length;
  if (!i)
    return;
  t.x = t.y = 1;
  let a, o;
  for (let l = 0; l < i; l++) {
    a = r[l], o = a.projectionDelta;
    const { visualElement: c } = a.options;
    c && c.props.style && c.props.style.display === "contents" || (n && a.options.layoutScroll && a.scroll && a !== a.root && dt(e, {
      x: -a.scroll.offset.x,
      y: -a.scroll.offset.y
    }), o && (t.x *= o.x.scale, t.y *= o.y.scale, ua(e, o)), n && Ke(a.latestValues) && dt(e, a.latestValues));
  }
  t.x < ei && t.x > Qn && (t.x = 1), t.y < ei && t.y > Qn && (t.y = 1);
}
function ct(e, t) {
  e.min = e.min + t, e.max = e.max + t;
}
function ti(e, t, r, n, i = 0.5) {
  const a = Q(e.min, e.max, i);
  mr(e, t, r, a, n);
}
function dt(e, t) {
  ti(e.x, t.x, t.scaleX, t.scale, t.originX), ti(e.y, t.y, t.scaleY, t.scale, t.originY);
}
function ha(e, t) {
  return ca(Ch(e.getBoundingClientRect(), t));
}
function _h(e, t, r) {
  const n = ha(e, r), { scroll: i } = t;
  return i && (ct(n.x, i.offset.x), ct(n.y, i.offset.y)), n;
}
const si = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
}), ut = () => ({
  x: si(),
  y: si()
}), ri = () => ({ min: 0, max: 0 }), te = () => ({
  x: ri(),
  y: ri()
}), fr = { current: null }, ma = { current: !1 };
function Ah() {
  if (ma.current = !0, !!Nr)
    if (window.matchMedia) {
      const e = window.matchMedia("(prefers-reduced-motion)"), t = () => fr.current = e.matches;
      e.addEventListener("change", t), t();
    } else
      fr.current = !1;
}
const Eh = /* @__PURE__ */ new WeakMap();
function Mh(e, t, r) {
  for (const n in t) {
    const i = t[n], a = r[n];
    if (ce(i))
      e.addValue(n, i);
    else if (ce(a))
      e.addValue(n, xt(i, { owner: e }));
    else if (a !== i)
      if (e.hasValue(n)) {
        const o = e.getValue(n);
        o.liveStyle === !0 ? o.jump(i) : o.hasAnimated || o.set(i);
      } else {
        const o = e.getStaticValue(n);
        e.addValue(n, xt(o !== void 0 ? o : i, { owner: e }));
      }
  }
  for (const n in r)
    t[n] === void 0 && e.removeValue(n);
  return t;
}
const ni = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
class Dh {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(t, r, n) {
    return {};
  }
  constructor({ parent: t, props: r, presenceContext: n, reducedMotionConfig: i, blockInitialAnimation: a, visualState: o }, l = {}) {
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = Br, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.renderScheduledAt = 0, this.scheduleRender = () => {
      const f = fe.now();
      this.renderScheduledAt < f && (this.renderScheduledAt = f, Z.render(this.render, !1, !0));
    };
    const { latestValues: c, renderState: u } = o;
    this.latestValues = c, this.baseTarget = { ...c }, this.initialValues = r.initial ? { ...c } : {}, this.renderState = u, this.parent = t, this.props = r, this.presenceContext = n, this.depth = t ? t.depth + 1 : 0, this.reducedMotionConfig = i, this.options = l, this.blockInitialAnimation = !!a, this.isControllingVariants = _s(r), this.isVariantNode = Jo(r), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(t && t.current);
    const { willChange: d, ...h } = this.scrapeMotionValuesFromProps(r, {}, this);
    for (const f in h) {
      const p = h[f];
      c[f] !== void 0 && ce(p) && p.set(c[f]);
    }
  }
  mount(t) {
    var r;
    this.current = t, Eh.set(t, this), this.projection && !this.projection.instance && this.projection.mount(t), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((n, i) => this.bindToMotionValue(i, n)), ma.current || Ah(), this.shouldReduceMotion = this.reducedMotionConfig === "never" ? !1 : this.reducedMotionConfig === "always" ? !0 : fr.current, process.env.NODE_ENV !== "production" && _r(this.shouldReduceMotion !== !0, "You have Reduced Motion enabled on your device. Animations may not appear as expected.", "reduced-motion-disabled"), (r = this.parent) == null || r.addChild(this), this.update(this.props, this.presenceContext);
  }
  unmount() {
    var t;
    this.projection && this.projection.unmount(), Be(this.notifyUpdate), Be(this.render), this.valueSubscriptions.forEach((r) => r()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), (t = this.parent) == null || t.removeChild(this);
    for (const r in this.events)
      this.events[r].clear();
    for (const r in this.features) {
      const n = this.features[r];
      n && (n.unmount(), n.isMounted = !1);
    }
    this.current = null;
  }
  addChild(t) {
    this.children.add(t), this.enteringChildren ?? (this.enteringChildren = /* @__PURE__ */ new Set()), this.enteringChildren.add(t);
  }
  removeChild(t) {
    this.children.delete(t), this.enteringChildren && this.enteringChildren.delete(t);
  }
  bindToMotionValue(t, r) {
    this.valueSubscriptions.has(t) && this.valueSubscriptions.get(t)();
    const n = Nt.has(t);
    n && this.onBindTransform && this.onBindTransform();
    const i = r.on("change", (o) => {
      this.latestValues[t] = o, this.props.onUpdate && Z.preRender(this.notifyUpdate), n && this.projection && (this.projection.isTransformDirty = !0), this.scheduleRender();
    });
    let a;
    window.MotionCheckAppearSync && (a = window.MotionCheckAppearSync(this, t, r)), this.valueSubscriptions.set(t, () => {
      i(), a && a(), r.owner && r.stop();
    });
  }
  sortNodePosition(t) {
    return !this.current || !this.sortInstanceNodePosition || this.type !== t.type ? 0 : this.sortInstanceNodePosition(this.current, t.current);
  }
  updateFeatures() {
    let t = "animation";
    for (t in yt) {
      const r = yt[t];
      if (!r)
        continue;
      const { isEnabled: n, Feature: i } = r;
      if (!this.features[t] && i && n(this.props) && (this.features[t] = new i(this)), this.features[t]) {
        const a = this.features[t];
        a.isMounted ? a.update() : (a.mount(), a.isMounted = !0);
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  /**
   * Measure the current viewport box with or without transforms.
   * Only measures axis-aligned boxes, rotate and skew must be manually
   * removed with a re-render to work.
   */
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : te();
  }
  getStaticValue(t) {
    return this.latestValues[t];
  }
  setStaticValue(t, r) {
    this.latestValues[t] = r;
  }
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(t, r) {
    (t.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = t, this.prevPresenceContext = this.presenceContext, this.presenceContext = r;
    for (let n = 0; n < ni.length; n++) {
      const i = ni[n];
      this.propEventSubscriptions[i] && (this.propEventSubscriptions[i](), delete this.propEventSubscriptions[i]);
      const a = "on" + i, o = t[a];
      o && (this.propEventSubscriptions[i] = this.on(i, o));
    }
    this.prevMotionValues = Mh(this, this.scrapeMotionValuesFromProps(t, this.prevProps, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
  }
  getProps() {
    return this.props;
  }
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(t) {
    return this.props.variants ? this.props.variants[t] : void 0;
  }
  /**
   * Returns the defined default transition on this component.
   */
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  /**
   * Add a child visual element to our set of children.
   */
  addVariantChild(t) {
    const r = this.getClosestVariantNode();
    if (r)
      return r.variantChildren && r.variantChildren.add(t), () => r.variantChildren.delete(t);
  }
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(t, r) {
    const n = this.values.get(t);
    r !== n && (n && this.removeValue(t), this.bindToMotionValue(t, r), this.values.set(t, r), this.latestValues[t] = r.get());
  }
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(t) {
    this.values.delete(t);
    const r = this.valueSubscriptions.get(t);
    r && (r(), this.valueSubscriptions.delete(t)), delete this.latestValues[t], this.removeValueFromRenderState(t, this.renderState);
  }
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(t) {
    return this.values.has(t);
  }
  getValue(t, r) {
    if (this.props.values && this.props.values[t])
      return this.props.values[t];
    let n = this.values.get(t);
    return n === void 0 && r !== void 0 && (n = xt(r === null ? void 0 : r, { owner: this }), this.addValue(t, n)), n;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(t, r) {
    let n = this.latestValues[t] !== void 0 || !this.current ? this.latestValues[t] : this.getBaseTargetFromProps(this.props, t) ?? this.readValueFromInstance(this.current, t, this.options);
    return n != null && (typeof n == "string" && (io(n) || ao(n)) ? n = parseFloat(n) : !Hu(n) && ze.test(r) && (n = Uo(t, r)), this.setBaseTarget(t, ce(n) ? n.get() : n)), ce(n) ? n.get() : n;
  }
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(t, r) {
    this.baseTarget[t] = r;
  }
  /**
   * Find the base target for a value thats been removed from all animation
   * props.
   */
  getBaseTarget(t) {
    var a;
    const { initial: r } = this.props;
    let n;
    if (typeof r == "string" || typeof r == "object") {
      const o = Zr(this.props, r, (a = this.presenceContext) == null ? void 0 : a.custom);
      o && (n = o[t]);
    }
    if (r && n !== void 0)
      return n;
    const i = this.getBaseTargetFromProps(this.props, t);
    return i !== void 0 && !ce(i) ? i : this.initialValues[t] !== void 0 && n === void 0 ? void 0 : this.baseTarget[t];
  }
  on(t, r) {
    return this.events[t] || (this.events[t] = new Pr()), this.events[t].add(r);
  }
  notify(t, ...r) {
    this.events[t] && this.events[t].notify(...r);
  }
  scheduleRenderMicrotask() {
    $r.render(this.render);
  }
}
class fa extends Dh {
  constructor() {
    super(...arguments), this.KeyframeResolver = Du;
  }
  sortInstanceNodePosition(t, r) {
    return t.compareDocumentPosition(r) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(t, r) {
    return t.style ? t.style[r] : void 0;
  }
  removeValueFromRenderState(t, { vars: r, style: n }) {
    delete r[t], delete n[t];
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: t } = this.props;
    ce(t) && (this.childSubscription = t.on("change", (r) => {
      this.current && (this.current.textContent = `${r}`);
    }));
  }
}
function ga(e, { style: t, vars: r }, n, i) {
  const a = e.style;
  let o;
  for (o in t)
    a[o] = t[o];
  i == null || i.applyProjectionStyles(a, n);
  for (o in r)
    a.setProperty(o, r[o]);
}
function Rh(e) {
  return window.getComputedStyle(e);
}
class Lh extends fa {
  constructor() {
    super(...arguments), this.type = "html", this.renderInstance = ga;
  }
  readValueFromInstance(t, r) {
    var n;
    if (Nt.has(r))
      return (n = this.projection) != null && n.isProjecting ? ir(r) : Zd(t, r);
    {
      const i = Rh(t), a = (Mr(r) ? i.getPropertyValue(r) : i[r]) || 0;
      return typeof a == "string" ? a.trim() : a;
    }
  }
  measureInstanceViewportBox(t, { transformPagePoint: r }) {
    return ha(t, r);
  }
  build(t, r, n) {
    Kr(t, r, n.transformTemplate);
  }
  scrapeMotionValuesFromProps(t, r, n) {
    return Jr(t, r, n);
  }
}
const pa = /* @__PURE__ */ new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust"
]);
function Vh(e, t, r, n) {
  ga(e, t, void 0, n);
  for (const i in t.attrs)
    e.setAttribute(pa.has(i) ? i : Qr(i), t.attrs[i]);
}
class Fh extends fa {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = te;
  }
  getBaseTargetFromProps(t, r) {
    return t[r];
  }
  readValueFromInstance(t, r) {
    if (Nt.has(r)) {
      const n = zo(r);
      return n && n.default || 0;
    }
    return r = pa.has(r) ? r : Qr(r), t.getAttribute(r);
  }
  scrapeMotionValuesFromProps(t, r, n) {
    return ia(t, r, n);
  }
  build(t, r, n) {
    ta(t, r, this.isSVGTag, n.transformTemplate, n.style);
  }
  renderInstance(t, r, n, i) {
    Vh(t, r, n, i);
  }
  mount(t) {
    this.isSVGTag = ra(t.tagName), super.mount(t);
  }
}
const Ih = (e, t) => Xr(e) ? new Fh(t) : new Lh(t, {
  allowProjection: e !== Ui
});
function mt(e, t, r) {
  const n = e.getProps();
  return Zr(n, t, r !== void 0 ? r : n.custom, e);
}
const gr = (e) => Array.isArray(e);
function Oh(e, t, r) {
  e.hasValue(t) ? e.getValue(t).set(r) : e.addValue(t, xt(r));
}
function Yh(e) {
  return gr(e) ? e[e.length - 1] || 0 : e;
}
function Bh(e, t) {
  const r = mt(e, t);
  let { transitionEnd: n = {}, transition: i = {}, ...a } = r || {};
  a = { ...a, ...n };
  for (const o in a) {
    const l = Yh(a[o]);
    Oh(e, o, l);
  }
}
function zh(e) {
  return !!(ce(e) && e.add);
}
function pr(e, t) {
  const r = e.getValue("willChange");
  if (zh(r))
    return r.add(t);
  if (!r && Le.WillChange) {
    const n = new Le.WillChange("auto");
    e.addValue("willChange", n), n.add(t);
  }
}
function xa(e) {
  return e.props[oa];
}
const Uh = (e) => e !== null;
function $h(e, { repeat: t, repeatType: r = "loop" }, n) {
  const i = e.filter(Uh), a = t && r !== "loop" && t % 2 === 1 ? 0 : i.length - 1;
  return i[a];
}
const Wh = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, Hh = (e) => ({
  type: "spring",
  stiffness: 550,
  damping: e === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), Gh = {
  type: "keyframes",
  duration: 0.8
}, Kh = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, qh = (e, { keyframes: t }) => t.length > 2 ? Gh : Nt.has(e) ? e.startsWith("scale") ? Hh(t[1]) : Wh : Kh;
function Xh({ when: e, delay: t, delayChildren: r, staggerChildren: n, staggerDirection: i, repeat: a, repeatType: o, repeatDelay: l, from: c, elapsed: u, ...d }) {
  return !!Object.keys(d).length;
}
const en = (e, t, r, n = {}, i, a) => (o) => {
  const l = zr(n, e) || {}, c = l.delay || n.delay || 0;
  let { elapsed: u = 0 } = n;
  u = u - /* @__PURE__ */ Te(c);
  const d = {
    keyframes: Array.isArray(r) ? r : [null, r],
    ease: "easeOut",
    velocity: t.getVelocity(),
    ...l,
    delay: -u,
    onUpdate: (f) => {
      t.set(f), l.onUpdate && l.onUpdate(f);
    },
    onComplete: () => {
      o(), l.onComplete && l.onComplete();
    },
    name: e,
    motionValue: t,
    element: a ? void 0 : i
  };
  Xh(l) || Object.assign(d, qh(e, d)), d.duration && (d.duration = /* @__PURE__ */ Te(d.duration)), d.repeatDelay && (d.repeatDelay = /* @__PURE__ */ Te(d.repeatDelay)), d.from !== void 0 && (d.keyframes[0] = d.from);
  let h = !1;
  if ((d.type === !1 || d.duration === 0 && !d.repeatDelay) && (dr(d), d.delay === 0 && (h = !0)), (Le.instantAnimations || Le.skipAnimations) && (h = !0, dr(d), d.delay = 0), d.allowFlatten = !l.type && !l.ease, h && !a && t.get() !== void 0) {
    const f = $h(d.keyframes, l);
    if (f !== void 0) {
      Z.update(() => {
        d.onUpdate(f), d.onComplete();
      });
      return;
    }
  }
  return l.isSync ? new Yr(d) : new vu(d);
};
function Zh({ protectedKeys: e, needsAnimating: t }, r) {
  const n = e.hasOwnProperty(r) && t[r] !== !0;
  return t[r] = !1, n;
}
function ya(e, t, { delay: r = 0, transitionOverride: n, type: i } = {}) {
  let { transition: a = e.getDefaultTransition(), transitionEnd: o, ...l } = t;
  n && (a = n);
  const c = [], u = i && e.animationState && e.animationState.getState()[i];
  for (const d in l) {
    const h = e.getValue(d, e.latestValues[d] ?? null), f = l[d];
    if (f === void 0 || u && Zh(u, d))
      continue;
    const p = {
      delay: r,
      ...zr(a || {}, d)
    }, y = h.get();
    if (y !== void 0 && !h.isAnimating && !Array.isArray(f) && f === y && !p.velocity)
      continue;
    let S = !1;
    if (window.MotionHandoffAnimation) {
      const j = xa(e);
      if (j) {
        const w = window.MotionHandoffAnimation(j, d, Z);
        w !== null && (p.startTime = w, S = !0);
      }
    }
    pr(e, d), h.start(en(d, h, f, e.shouldReduceMotion && Oo.has(d) ? { type: !1 } : p, e, S));
    const C = h.animation;
    C && c.push(C);
  }
  return o && Promise.all(c).then(() => {
    Z.update(() => {
      o && Bh(e, o);
    });
  }), c;
}
function ba(e, t, r, n = 0, i = 1) {
  const a = Array.from(e).sort((u, d) => u.sortNodePosition(d)).indexOf(t), o = e.size, l = (o - 1) * n;
  return typeof r == "function" ? r(a, o) : i === 1 ? a * n : l - a * n;
}
function xr(e, t, r = {}) {
  var c;
  const n = mt(e, t, r.type === "exit" ? (c = e.presenceContext) == null ? void 0 : c.custom : void 0);
  let { transition: i = e.getDefaultTransition() || {} } = n || {};
  r.transitionOverride && (i = r.transitionOverride);
  const a = n ? () => Promise.all(ya(e, n, r)) : () => Promise.resolve(), o = e.variantChildren && e.variantChildren.size ? (u = 0) => {
    const { delayChildren: d = 0, staggerChildren: h, staggerDirection: f } = i;
    return Jh(e, t, u, d, h, f, r);
  } : () => Promise.resolve(), { when: l } = i;
  if (l) {
    const [u, d] = l === "beforeChildren" ? [a, o] : [o, a];
    return u().then(() => d());
  } else
    return Promise.all([a(), o(r.delay)]);
}
function Jh(e, t, r = 0, n = 0, i = 0, a = 1, o) {
  const l = [];
  for (const c of e.variantChildren)
    c.notify("AnimationStart", t), l.push(xr(c, t, {
      ...o,
      delay: r + (typeof n == "function" ? 0 : n) + ba(e.variantChildren, c, n, i, a)
    }).then(() => c.notify("AnimationComplete", t)));
  return Promise.all(l);
}
function Qh(e, t, r = {}) {
  e.notify("AnimationStart", t);
  let n;
  if (Array.isArray(t)) {
    const i = t.map((a) => xr(e, a, r));
    n = Promise.all(i);
  } else if (typeof t == "string")
    n = xr(e, t, r);
  else {
    const i = typeof t == "function" ? mt(e, t, r.custom) : t;
    n = Promise.all(ya(e, i, r));
  }
  return n.then(() => {
    e.notify("AnimationComplete", t);
  });
}
function va(e, t) {
  if (!Array.isArray(t))
    return !1;
  const r = t.length;
  if (r !== e.length)
    return !1;
  for (let n = 0; n < r; n++)
    if (t[n] !== e[n])
      return !1;
  return !0;
}
const em = Gr.length;
function wa(e) {
  if (!e)
    return;
  if (!e.isControllingVariants) {
    const r = e.parent ? wa(e.parent) || {} : {};
    return e.props.initial !== void 0 && (r.initial = e.props.initial), r;
  }
  const t = {};
  for (let r = 0; r < em; r++) {
    const n = Gr[r], i = e.props[n];
    (Ut(i) || i === !1) && (t[n] = i);
  }
  return t;
}
const tm = [...Hr].reverse(), sm = Hr.length;
function rm(e) {
  return (t) => Promise.all(t.map(({ animation: r, options: n }) => Qh(e, r, n)));
}
function nm(e) {
  let t = rm(e), r = ii(), n = !0;
  const i = (c) => (u, d) => {
    var f;
    const h = mt(e, d, c === "exit" ? (f = e.presenceContext) == null ? void 0 : f.custom : void 0);
    if (h) {
      const { transition: p, transitionEnd: y, ...S } = h;
      u = { ...u, ...S, ...y };
    }
    return u;
  };
  function a(c) {
    t = c(e);
  }
  function o(c) {
    const { props: u } = e, d = wa(e.parent) || {}, h = [], f = /* @__PURE__ */ new Set();
    let p = {}, y = 1 / 0;
    for (let C = 0; C < sm; C++) {
      const j = tm[C], w = r[j], P = u[j] !== void 0 ? u[j] : d[j], D = Ut(P), A = j === c ? w.isActive : null;
      A === !1 && (y = C);
      let I = P === d[j] && P !== u[j] && D;
      if (I && n && e.manuallyAnimateOnMount && (I = !1), w.protectedKeys = { ...p }, // If it isn't active and hasn't *just* been set as inactive
      !w.isActive && A === null || // If we didn't and don't have any defined prop for this animation type
      !P && !w.prevProp || // Or if the prop doesn't define an animation
      Ps(P) || typeof P == "boolean")
        continue;
      const O = im(w.prevProp, P);
      let k = O || // If we're making this variant active, we want to always make it active
      j === c && w.isActive && !I && D || // If we removed a higher-priority variant (i is in reverse order)
      C > y && D, x = !1;
      const E = Array.isArray(P) ? P : [P];
      let b = E.reduce(i(j), {});
      A === !1 && (b = {});
      const { prevResolvedValues: L = {} } = w, G = {
        ...L,
        ...b
      }, se = ($) => {
        k = !0, f.has($) && (x = !0, f.delete($)), w.needsAnimating[$] = !0;
        const B = e.getValue($);
        B && (B.liveStyle = !1);
      };
      for (const $ in G) {
        const B = b[$], q = L[$];
        if (p.hasOwnProperty($))
          continue;
        let ie = !1;
        gr(B) && gr(q) ? ie = !va(B, q) : ie = B !== q, ie ? B != null ? se($) : f.add($) : B !== void 0 && f.has($) ? se($) : w.protectedKeys[$] = !0;
      }
      w.prevProp = P, w.prevResolvedValues = b, w.isActive && (p = { ...p, ...b }), n && e.blockInitialAnimation && (k = !1);
      const T = I && O;
      k && (!T || x) && h.push(...E.map(($) => {
        const B = { type: j };
        if (typeof $ == "string" && n && !T && e.manuallyAnimateOnMount && e.parent) {
          const { parent: q } = e, ie = mt(q, $);
          if (q.enteringChildren && ie) {
            const { delayChildren: Ne } = ie.transition || {};
            B.delay = ba(q.enteringChildren, e, Ne);
          }
        }
        return {
          animation: $,
          options: B
        };
      }));
    }
    if (f.size) {
      const C = {};
      if (typeof u.initial != "boolean") {
        const j = mt(e, Array.isArray(u.initial) ? u.initial[0] : u.initial);
        j && j.transition && (C.transition = j.transition);
      }
      f.forEach((j) => {
        const w = e.getBaseTarget(j), P = e.getValue(j);
        P && (P.liveStyle = !0), C[j] = w ?? null;
      }), h.push({ animation: C });
    }
    let S = !!h.length;
    return n && (u.initial === !1 || u.initial === u.animate) && !e.manuallyAnimateOnMount && (S = !1), n = !1, S ? t(h) : Promise.resolve();
  }
  function l(c, u) {
    var h;
    if (r[c].isActive === u)
      return Promise.resolve();
    (h = e.variantChildren) == null || h.forEach((f) => {
      var p;
      return (p = f.animationState) == null ? void 0 : p.setActive(c, u);
    }), r[c].isActive = u;
    const d = o(c);
    for (const f in r)
      r[f].protectedKeys = {};
    return d;
  }
  return {
    animateChanges: o,
    setActive: l,
    setAnimateFunction: a,
    getState: () => r,
    reset: () => {
      r = ii(), n = !0;
    }
  };
}
function im(e, t) {
  return typeof t == "string" ? t !== e : Array.isArray(t) ? !va(t, e) : !1;
}
function Ge(e = !1) {
  return {
    isActive: e,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function ii() {
  return {
    animate: Ge(!0),
    whileInView: Ge(),
    whileHover: Ge(),
    whileTap: Ge(),
    whileDrag: Ge(),
    whileFocus: Ge(),
    exit: Ge()
  };
}
class $e {
  constructor(t) {
    this.isMounted = !1, this.node = t;
  }
  update() {
  }
}
class om extends $e {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(t) {
    super(t), t.animationState || (t.animationState = nm(t));
  }
  updateAnimationControlsSubscription() {
    const { animate: t } = this.node.getProps();
    Ps(t) && (this.unmountControls = t.subscribe(this.node));
  }
  /**
   * Subscribe any provided AnimationControls to the component's VisualElement
   */
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate: t } = this.node.getProps(), { animate: r } = this.node.prevProps || {};
    t !== r && this.updateAnimationControlsSubscription();
  }
  unmount() {
    var t;
    this.node.animationState.reset(), (t = this.unmountControls) == null || t.call(this);
  }
}
let am = 0;
class lm extends $e {
  constructor() {
    super(...arguments), this.id = am++;
  }
  update() {
    if (!this.node.presenceContext)
      return;
    const { isPresent: t, onExitComplete: r } = this.node.presenceContext, { isPresent: n } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || t === n)
      return;
    const i = this.node.animationState.setActive("exit", !t);
    r && !t && i.then(() => {
      r(this.id);
    });
  }
  mount() {
    const { register: t, onExitComplete: r } = this.node.presenceContext || {};
    r && r(this.id), t && (this.unmount = t(this.id));
  }
  unmount() {
  }
}
const cm = {
  animation: {
    Feature: om
  },
  exit: {
    Feature: lm
  }
};
function Wt(e, t, r, n = { passive: !0 }) {
  return e.addEventListener(t, r, n), () => e.removeEventListener(t, r);
}
function Zt(e) {
  return {
    point: {
      x: e.pageX,
      y: e.pageY
    }
  };
}
const dm = (e) => (t) => Wr(t) && e(t, Zt(t));
function Rt(e, t, r, n) {
  return Wt(e, t, dm(r), n);
}
const ja = 1e-4, um = 1 - ja, hm = 1 + ja, Na = 0.01, mm = 0 - Na, fm = 0 + Na;
function he(e) {
  return e.max - e.min;
}
function gm(e, t, r) {
  return Math.abs(e - t) <= r;
}
function oi(e, t, r, n = 0.5) {
  e.origin = n, e.originPoint = Q(t.min, t.max, e.origin), e.scale = he(r) / he(t), e.translate = Q(r.min, r.max, e.origin) - e.originPoint, (e.scale >= um && e.scale <= hm || isNaN(e.scale)) && (e.scale = 1), (e.translate >= mm && e.translate <= fm || isNaN(e.translate)) && (e.translate = 0);
}
function Lt(e, t, r, n) {
  oi(e.x, t.x, r.x, n ? n.originX : void 0), oi(e.y, t.y, r.y, n ? n.originY : void 0);
}
function ai(e, t, r) {
  e.min = r.min + t.min, e.max = e.min + he(t);
}
function pm(e, t, r) {
  ai(e.x, t.x, r.x), ai(e.y, t.y, r.y);
}
function li(e, t, r) {
  e.min = t.min - r.min, e.max = e.min + he(t);
}
function Vt(e, t, r) {
  li(e.x, t.x, r.x), li(e.y, t.y, r.y);
}
function we(e) {
  return [e("x"), e("y")];
}
const ka = ({ current: e }) => e ? e.ownerDocument.defaultView : null, ci = (e, t) => Math.abs(e - t);
function xm(e, t) {
  const r = ci(e.x, t.x), n = ci(e.y, t.y);
  return Math.sqrt(r ** 2 + n ** 2);
}
class Ta {
  constructor(t, r, { transformPagePoint: n, contextWindow: i = window, dragSnapToOrigin: a = !1, distanceThreshold: o = 3 } = {}) {
    if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const f = $s(this.lastMoveEventInfo, this.history), p = this.startEvent !== null, y = xm(f.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
      if (!p && !y)
        return;
      const { point: S } = f, { timestamp: C } = oe;
      this.history.push({ ...S, timestamp: C });
      const { onStart: j, onMove: w } = this.handlers;
      p || (j && j(this.lastMoveEvent, f), this.startEvent = this.lastMoveEvent), w && w(this.lastMoveEvent, f);
    }, this.handlePointerMove = (f, p) => {
      this.lastMoveEvent = f, this.lastMoveEventInfo = Us(p, this.transformPagePoint), Z.update(this.updatePoint, !0);
    }, this.handlePointerUp = (f, p) => {
      this.end();
      const { onEnd: y, onSessionEnd: S, resumeAnimation: C } = this.handlers;
      if (this.dragSnapToOrigin && C && C(), !(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const j = $s(f.type === "pointercancel" ? this.lastMoveEventInfo : Us(p, this.transformPagePoint), this.history);
      this.startEvent && y && y(f, j), S && S(f, j);
    }, !Wr(t))
      return;
    this.dragSnapToOrigin = a, this.handlers = r, this.transformPagePoint = n, this.distanceThreshold = o, this.contextWindow = i || window;
    const l = Zt(t), c = Us(l, this.transformPagePoint), { point: u } = c, { timestamp: d } = oe;
    this.history = [{ ...u, timestamp: d }];
    const { onSessionStart: h } = r;
    h && h(t, $s(c, this.history)), this.removeListeners = Kt(Rt(this.contextWindow, "pointermove", this.handlePointerMove), Rt(this.contextWindow, "pointerup", this.handlePointerUp), Rt(this.contextWindow, "pointercancel", this.handlePointerUp));
  }
  updateHandlers(t) {
    this.handlers = t;
  }
  end() {
    this.removeListeners && this.removeListeners(), Be(this.updatePoint);
  }
}
function Us(e, t) {
  return t ? { point: t(e.point) } : e;
}
function di(e, t) {
  return { x: e.x - t.x, y: e.y - t.y };
}
function $s({ point: e }, t) {
  return {
    point: e,
    delta: di(e, Sa(t)),
    offset: di(e, ym(t)),
    velocity: bm(t, 0.1)
  };
}
function ym(e) {
  return e[0];
}
function Sa(e) {
  return e[e.length - 1];
}
function bm(e, t) {
  if (e.length < 2)
    return { x: 0, y: 0 };
  let r = e.length - 1, n = null;
  const i = Sa(e);
  for (; r >= 0 && (n = e[r], !(i.timestamp - n.timestamp > /* @__PURE__ */ Te(t))); )
    r--;
  if (!n)
    return { x: 0, y: 0 };
  const a = /* @__PURE__ */ Ce(i.timestamp - n.timestamp);
  if (a === 0)
    return { x: 0, y: 0 };
  const o = {
    x: (i.x - n.x) / a,
    y: (i.y - n.y) / a
  };
  return o.x === 1 / 0 && (o.x = 0), o.y === 1 / 0 && (o.y = 0), o;
}
function vm(e, { min: t, max: r }, n) {
  return t !== void 0 && e < t ? e = n ? Q(t, e, n.min) : Math.max(e, t) : r !== void 0 && e > r && (e = n ? Q(r, e, n.max) : Math.min(e, r)), e;
}
function ui(e, t, r) {
  return {
    min: t !== void 0 ? e.min + t : void 0,
    max: r !== void 0 ? e.max + r - (e.max - e.min) : void 0
  };
}
function wm(e, { top: t, left: r, bottom: n, right: i }) {
  return {
    x: ui(e.x, r, i),
    y: ui(e.y, t, n)
  };
}
function hi(e, t) {
  let r = t.min - e.min, n = t.max - e.max;
  return t.max - t.min < e.max - e.min && ([r, n] = [n, r]), { min: r, max: n };
}
function jm(e, t) {
  return {
    x: hi(e.x, t.x),
    y: hi(e.y, t.y)
  };
}
function Nm(e, t) {
  let r = 0.5;
  const n = he(e), i = he(t);
  return i > n ? r = /* @__PURE__ */ Yt(t.min, t.max - n, e.min) : n > i && (r = /* @__PURE__ */ Yt(e.min, e.max - i, t.min)), De(0, 1, r);
}
function km(e, t) {
  const r = {};
  return t.min !== void 0 && (r.min = t.min - e.min), t.max !== void 0 && (r.max = t.max - e.min), r;
}
const yr = 0.35;
function Tm(e = yr) {
  return e === !1 ? e = 0 : e === !0 && (e = yr), {
    x: mi(e, "left", "right"),
    y: mi(e, "top", "bottom")
  };
}
function mi(e, t, r) {
  return {
    min: fi(e, t),
    max: fi(e, r)
  };
}
function fi(e, t) {
  return typeof e == "number" ? e : e[t] || 0;
}
const Sm = /* @__PURE__ */ new WeakMap();
class Cm {
  constructor(t) {
    this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = { x: 0, y: 0 }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = te(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = t;
  }
  start(t, { snapToCursor: r = !1, distanceThreshold: n } = {}) {
    const { presenceContext: i } = this.visualElement;
    if (i && i.isPresent === !1)
      return;
    const a = (h) => {
      const { dragSnapToOrigin: f } = this.getProps();
      f ? this.pauseAnimation() : this.stopAnimation(), r && this.snapToCursor(Zt(h).point);
    }, o = (h, f) => {
      const { drag: p, dragPropagation: y, onDragStart: S } = this.getProps();
      if (p && !y && (this.openDragLock && this.openDragLock(), this.openDragLock = Iu(p), !this.openDragLock))
        return;
      this.latestPointerEvent = h, this.latestPanInfo = f, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), we((j) => {
        let w = this.getAxisMotionValue(j).get() || 0;
        if (Pe.test(w)) {
          const { projection: P } = this.visualElement;
          if (P && P.layout) {
            const D = P.layout.layoutBox[j];
            D && (w = he(D) * (parseFloat(w) / 100));
          }
        }
        this.originPoint[j] = w;
      }), S && Z.postRender(() => S(h, f)), pr(this.visualElement, "transform");
      const { animationState: C } = this.visualElement;
      C && C.setActive("whileDrag", !0);
    }, l = (h, f) => {
      this.latestPointerEvent = h, this.latestPanInfo = f;
      const { dragPropagation: p, dragDirectionLock: y, onDirectionLock: S, onDrag: C } = this.getProps();
      if (!p && !this.openDragLock)
        return;
      const { offset: j } = f;
      if (y && this.currentDirection === null) {
        this.currentDirection = Pm(j), this.currentDirection !== null && S && S(this.currentDirection);
        return;
      }
      this.updateAxis("x", f.point, j), this.updateAxis("y", f.point, j), this.visualElement.render(), C && C(h, f);
    }, c = (h, f) => {
      this.latestPointerEvent = h, this.latestPanInfo = f, this.stop(h, f), this.latestPointerEvent = null, this.latestPanInfo = null;
    }, u = () => we((h) => {
      var f;
      return this.getAnimationState(h) === "paused" && ((f = this.getAxisMotionValue(h).animation) == null ? void 0 : f.play());
    }), { dragSnapToOrigin: d } = this.getProps();
    this.panSession = new Ta(t, {
      onSessionStart: a,
      onStart: o,
      onMove: l,
      onSessionEnd: c,
      resumeAnimation: u
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin: d,
      distanceThreshold: n,
      contextWindow: ka(this.visualElement)
    });
  }
  /**
   * @internal
   */
  stop(t, r) {
    const n = t || this.latestPointerEvent, i = r || this.latestPanInfo, a = this.isDragging;
    if (this.cancel(), !a || !i || !n)
      return;
    const { velocity: o } = i;
    this.startAnimation(o);
    const { onDragEnd: l } = this.getProps();
    l && Z.postRender(() => l(n, i));
  }
  /**
   * @internal
   */
  cancel() {
    this.isDragging = !1;
    const { projection: t, animationState: r } = this.visualElement;
    t && (t.isAnimationBlocked = !1), this.panSession && this.panSession.end(), this.panSession = void 0;
    const { dragPropagation: n } = this.getProps();
    !n && this.openDragLock && (this.openDragLock(), this.openDragLock = null), r && r.setActive("whileDrag", !1);
  }
  updateAxis(t, r, n) {
    const { drag: i } = this.getProps();
    if (!n || !ls(t, i, this.currentDirection))
      return;
    const a = this.getAxisMotionValue(t);
    let o = this.originPoint[t] + n[t];
    this.constraints && this.constraints[t] && (o = vm(o, this.constraints[t], this.elastic[t])), a.set(o);
  }
  resolveConstraints() {
    var a;
    const { dragConstraints: t, dragElastic: r } = this.getProps(), n = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : (a = this.visualElement.projection) == null ? void 0 : a.layout, i = this.constraints;
    t && lt(t) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : t && n ? this.constraints = wm(n.layoutBox, t) : this.constraints = !1, this.elastic = Tm(r), i !== this.constraints && n && this.constraints && !this.hasMutatedConstraints && we((o) => {
      this.constraints !== !1 && this.getAxisMotionValue(o) && (this.constraints[o] = km(n.layoutBox[o], this.constraints[o]));
    });
  }
  resolveRefConstraints() {
    const { dragConstraints: t, onMeasureDragConstraints: r } = this.getProps();
    if (!t || !lt(t))
      return !1;
    const n = t.current;
    Re(n !== null, "If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop.", "drag-constraints-ref");
    const { projection: i } = this.visualElement;
    if (!i || !i.layout)
      return !1;
    const a = _h(n, i.root, this.visualElement.getTransformPagePoint());
    let o = jm(i.layout.layoutBox, a);
    if (r) {
      const l = r(Sh(o));
      this.hasMutatedConstraints = !!l, l && (o = ca(l));
    }
    return o;
  }
  startAnimation(t) {
    const { drag: r, dragMomentum: n, dragElastic: i, dragTransition: a, dragSnapToOrigin: o, onDragTransitionEnd: l } = this.getProps(), c = this.constraints || {}, u = we((d) => {
      if (!ls(d, r, this.currentDirection))
        return;
      let h = c && c[d] || {};
      o && (h = { min: 0, max: 0 });
      const f = i ? 200 : 1e6, p = i ? 40 : 1e7, y = {
        type: "inertia",
        velocity: n ? t[d] : 0,
        bounceStiffness: f,
        bounceDamping: p,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...a,
        ...h
      };
      return this.startAxisValueAnimation(d, y);
    });
    return Promise.all(u).then(l);
  }
  startAxisValueAnimation(t, r) {
    const n = this.getAxisMotionValue(t);
    return pr(this.visualElement, t), n.start(en(t, n, 0, r, this.visualElement, !1));
  }
  stopAnimation() {
    we((t) => this.getAxisMotionValue(t).stop());
  }
  pauseAnimation() {
    we((t) => {
      var r;
      return (r = this.getAxisMotionValue(t).animation) == null ? void 0 : r.pause();
    });
  }
  getAnimationState(t) {
    var r;
    return (r = this.getAxisMotionValue(t).animation) == null ? void 0 : r.state;
  }
  /**
   * Drag works differently depending on which props are provided.
   *
   * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
   * - Otherwise, we apply the delta to the x/y motion values.
   */
  getAxisMotionValue(t) {
    const r = `_drag${t.toUpperCase()}`, n = this.visualElement.getProps(), i = n[r];
    return i || this.visualElement.getValue(t, (n.initial ? n.initial[t] : void 0) || 0);
  }
  snapToCursor(t) {
    we((r) => {
      const { drag: n } = this.getProps();
      if (!ls(r, n, this.currentDirection))
        return;
      const { projection: i } = this.visualElement, a = this.getAxisMotionValue(r);
      if (i && i.layout) {
        const { min: o, max: l } = i.layout.layoutBox[r];
        a.set(t[r] - Q(o, l, 0.5));
      }
    });
  }
  /**
   * When the viewport resizes we want to check if the measured constraints
   * have changed and, if so, reposition the element within those new constraints
   * relative to where it was before the resize.
   */
  scalePositionWithinConstraints() {
    if (!this.visualElement.current)
      return;
    const { drag: t, dragConstraints: r } = this.getProps(), { projection: n } = this.visualElement;
    if (!lt(r) || !n || !this.constraints)
      return;
    this.stopAnimation();
    const i = { x: 0, y: 0 };
    we((o) => {
      const l = this.getAxisMotionValue(o);
      if (l && this.constraints !== !1) {
        const c = l.get();
        i[o] = Nm({ min: c, max: c }, this.constraints[o]);
      }
    });
    const { transformTemplate: a } = this.visualElement.getProps();
    this.visualElement.current.style.transform = a ? a({}, "") : "none", n.root && n.root.updateScroll(), n.updateLayout(), this.resolveConstraints(), we((o) => {
      if (!ls(o, t, null))
        return;
      const l = this.getAxisMotionValue(o), { min: c, max: u } = this.constraints[o];
      l.set(Q(c, u, i[o]));
    });
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    Sm.set(this.visualElement, this);
    const t = this.visualElement.current, r = Rt(t, "pointerdown", (c) => {
      const { drag: u, dragListener: d = !0 } = this.getProps();
      u && d && this.start(c);
    }), n = () => {
      const { dragConstraints: c } = this.getProps();
      lt(c) && c.current && (this.constraints = this.resolveRefConstraints());
    }, { projection: i } = this.visualElement, a = i.addEventListener("measure", n);
    i && !i.layout && (i.root && i.root.updateScroll(), i.updateLayout()), Z.read(n);
    const o = Wt(window, "resize", () => this.scalePositionWithinConstraints()), l = i.addEventListener("didUpdate", ({ delta: c, hasLayoutChanged: u }) => {
      this.isDragging && u && (we((d) => {
        const h = this.getAxisMotionValue(d);
        h && (this.originPoint[d] += c[d].translate, h.set(h.get() + c[d].translate));
      }), this.visualElement.render());
    });
    return () => {
      o(), r(), a(), l && l();
    };
  }
  getProps() {
    const t = this.visualElement.getProps(), { drag: r = !1, dragDirectionLock: n = !1, dragPropagation: i = !1, dragConstraints: a = !1, dragElastic: o = yr, dragMomentum: l = !0 } = t;
    return {
      ...t,
      drag: r,
      dragDirectionLock: n,
      dragPropagation: i,
      dragConstraints: a,
      dragElastic: o,
      dragMomentum: l
    };
  }
}
function ls(e, t, r) {
  return (t === !0 || t === e) && (r === null || r === e);
}
function Pm(e, t = 10) {
  let r = null;
  return Math.abs(e.y) > t ? r = "y" : Math.abs(e.x) > t && (r = "x"), r;
}
class _m extends $e {
  constructor(t) {
    super(t), this.removeGroupControls = je, this.removeListeners = je, this.controls = new Cm(t);
  }
  mount() {
    const { dragControls: t } = this.node.getProps();
    t && (this.removeGroupControls = t.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || je;
  }
  unmount() {
    this.removeGroupControls(), this.removeListeners();
  }
}
const gi = (e) => (t, r) => {
  e && Z.postRender(() => e(t, r));
};
class Am extends $e {
  constructor() {
    super(...arguments), this.removePointerDownListener = je;
  }
  onPointerDown(t) {
    this.session = new Ta(t, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: ka(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: t, onPanStart: r, onPan: n, onPanEnd: i } = this.node.getProps();
    return {
      onSessionStart: gi(t),
      onStart: gi(r),
      onMove: n,
      onEnd: (a, o) => {
        delete this.session, i && Z.postRender(() => i(a, o));
      }
    };
  }
  mount() {
    this.removePointerDownListener = Rt(this.node.current, "pointerdown", (t) => this.onPointerDown(t));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener(), this.session && this.session.end();
  }
}
const ps = {
  /**
   * Global flag as to whether the tree has animated since the last time
   * we resized the window
   */
  hasAnimatedSinceResize: !0,
  /**
   * We set this to true once, on the first update. Any nodes added to the tree beyond that
   * update will be given a `data-projection-id` attribute.
   */
  hasEverUpdated: !1
};
function pi(e, t) {
  return t.max === t.min ? 0 : e / (t.max - t.min) * 100;
}
const At = {
  correct: (e, t) => {
    if (!t.target)
      return e;
    if (typeof e == "string")
      if (V.test(e))
        e = parseFloat(e);
      else
        return e;
    const r = pi(e, t.target.x), n = pi(e, t.target.y);
    return `${r}% ${n}%`;
  }
}, Em = {
  correct: (e, { treeScale: t, projectionDelta: r }) => {
    const n = e, i = ze.parse(e);
    if (i.length > 5)
      return n;
    const a = ze.createTransformer(e), o = typeof i[0] != "number" ? 1 : 0, l = r.x.scale * t.x, c = r.y.scale * t.y;
    i[0 + o] /= l, i[1 + o] /= c;
    const u = Q(l, c, 0.5);
    return typeof i[2 + o] == "number" && (i[2 + o] /= u), typeof i[3 + o] == "number" && (i[3 + o] /= u), a(i);
  }
};
let Ws = !1;
class Mm extends hl {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement: t, layoutGroup: r, switchLayoutGroup: n, layoutId: i } = this.props, { projection: a } = t;
    eh(Dm), a && (r.group && r.group.add(a), n && n.register && i && n.register(a), Ws && a.root.didUpdate(), a.addEventListener("animationComplete", () => {
      this.safeToRemove();
    }), a.setOptions({
      ...a.options,
      onExitComplete: () => this.safeToRemove()
    })), ps.hasEverUpdated = !0;
  }
  getSnapshotBeforeUpdate(t) {
    const { layoutDependency: r, visualElement: n, drag: i, isPresent: a } = this.props, { projection: o } = n;
    return o && (o.isPresent = a, Ws = !0, i || t.layoutDependency !== r || r === void 0 || t.isPresent !== a ? o.willUpdate() : this.safeToRemove(), t.isPresent !== a && (a ? o.promote() : o.relegate() || Z.postRender(() => {
      const l = o.getStack();
      (!l || !l.members.length) && this.safeToRemove();
    }))), null;
  }
  componentDidUpdate() {
    const { projection: t } = this.props.visualElement;
    t && (t.root.didUpdate(), $r.postRender(() => {
      !t.currentAnimation && t.isLead() && this.safeToRemove();
    }));
  }
  componentWillUnmount() {
    const { visualElement: t, layoutGroup: r, switchLayoutGroup: n } = this.props, { projection: i } = t;
    Ws = !0, i && (i.scheduleCheckAfterUnmount(), r && r.group && r.group.remove(i), n && n.deregister && n.deregister(i));
  }
  safeToRemove() {
    const { safeToRemove: t } = this.props;
    t && t();
  }
  render() {
    return null;
  }
}
function Ca(e) {
  const [t, r] = Gu(), n = le(no);
  return s.jsx(Mm, { ...e, layoutGroup: n, switchLayoutGroup: le(aa), isPresent: t, safeToRemove: r });
}
const Dm = {
  borderRadius: {
    ...At,
    applyTo: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius"
    ]
  },
  borderTopLeftRadius: At,
  borderTopRightRadius: At,
  borderBottomLeftRadius: At,
  borderBottomRightRadius: At,
  boxShadow: Em
};
function Rm(e, t, r) {
  const n = ce(e) ? e : xt(e);
  return n.start(en("", n, t, r)), n.animation;
}
const Lm = (e, t) => e.depth - t.depth;
class Vm {
  constructor() {
    this.children = [], this.isDirty = !1;
  }
  add(t) {
    Tr(this.children, t), this.isDirty = !0;
  }
  remove(t) {
    Sr(this.children, t), this.isDirty = !0;
  }
  forEach(t) {
    this.isDirty && this.children.sort(Lm), this.isDirty = !1, this.children.forEach(t);
  }
}
function Fm(e, t) {
  const r = fe.now(), n = ({ timestamp: i }) => {
    const a = i - r;
    a >= t && (Be(n), e(a - t));
  };
  return Z.setup(n, !0), () => Be(n);
}
const Pa = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"], Im = Pa.length, xi = (e) => typeof e == "string" ? parseFloat(e) : e, yi = (e) => typeof e == "number" || V.test(e);
function Om(e, t, r, n, i, a) {
  i ? (e.opacity = Q(0, r.opacity ?? 1, Ym(n)), e.opacityExit = Q(t.opacity ?? 1, 0, Bm(n))) : a && (e.opacity = Q(t.opacity ?? 1, r.opacity ?? 1, n));
  for (let o = 0; o < Im; o++) {
    const l = `border${Pa[o]}Radius`;
    let c = bi(t, l), u = bi(r, l);
    if (c === void 0 && u === void 0)
      continue;
    c || (c = 0), u || (u = 0), c === 0 || u === 0 || yi(c) === yi(u) ? (e[l] = Math.max(Q(xi(c), xi(u), n), 0), (Pe.test(u) || Pe.test(c)) && (e[l] += "%")) : e[l] = u;
  }
  (t.rotate || r.rotate) && (e.rotate = Q(t.rotate || 0, r.rotate || 0, n));
}
function bi(e, t) {
  return e[t] !== void 0 ? e[t] : e.borderRadius;
}
const Ym = /* @__PURE__ */ _a(0, 0.5, po), Bm = /* @__PURE__ */ _a(0.5, 0.95, je);
function _a(e, t, r) {
  return (n) => n < e ? 0 : n > t ? 1 : r(/* @__PURE__ */ Yt(e, t, n));
}
function vi(e, t) {
  e.min = t.min, e.max = t.max;
}
function ve(e, t) {
  vi(e.x, t.x), vi(e.y, t.y);
}
function wi(e, t) {
  e.translate = t.translate, e.scale = t.scale, e.originPoint = t.originPoint, e.origin = t.origin;
}
function ji(e, t, r, n, i) {
  return e -= t, e = Ns(e, 1 / r, n), i !== void 0 && (e = Ns(e, 1 / i, n)), e;
}
function zm(e, t = 0, r = 1, n = 0.5, i, a = e, o = e) {
  if (Pe.test(t) && (t = parseFloat(t), t = Q(o.min, o.max, t / 100) - o.min), typeof t != "number")
    return;
  let l = Q(a.min, a.max, n);
  e === a && (l -= t), e.min = ji(e.min, t, r, l, i), e.max = ji(e.max, t, r, l, i);
}
function Ni(e, t, [r, n, i], a, o) {
  zm(e, t[r], t[n], t[i], t.scale, a, o);
}
const Um = ["x", "scaleX", "originX"], $m = ["y", "scaleY", "originY"];
function ki(e, t, r, n) {
  Ni(e.x, t, Um, r ? r.x : void 0, n ? n.x : void 0), Ni(e.y, t, $m, r ? r.y : void 0, n ? n.y : void 0);
}
function Ti(e) {
  return e.translate === 0 && e.scale === 1;
}
function Aa(e) {
  return Ti(e.x) && Ti(e.y);
}
function Si(e, t) {
  return e.min === t.min && e.max === t.max;
}
function Wm(e, t) {
  return Si(e.x, t.x) && Si(e.y, t.y);
}
function Ci(e, t) {
  return Math.round(e.min) === Math.round(t.min) && Math.round(e.max) === Math.round(t.max);
}
function Ea(e, t) {
  return Ci(e.x, t.x) && Ci(e.y, t.y);
}
function Pi(e) {
  return he(e.x) / he(e.y);
}
function _i(e, t) {
  return e.translate === t.translate && e.scale === t.scale && e.originPoint === t.originPoint;
}
class Hm {
  constructor() {
    this.members = [];
  }
  add(t) {
    Tr(this.members, t), t.scheduleRender();
  }
  remove(t) {
    if (Sr(this.members, t), t === this.prevLead && (this.prevLead = void 0), t === this.lead) {
      const r = this.members[this.members.length - 1];
      r && this.promote(r);
    }
  }
  relegate(t) {
    const r = this.members.findIndex((i) => t === i);
    if (r === 0)
      return !1;
    let n;
    for (let i = r; i >= 0; i--) {
      const a = this.members[i];
      if (a.isPresent !== !1) {
        n = a;
        break;
      }
    }
    return n ? (this.promote(n), !0) : !1;
  }
  promote(t, r) {
    const n = this.lead;
    if (t !== n && (this.prevLead = n, this.lead = t, t.show(), n)) {
      n.instance && n.scheduleRender(), t.scheduleRender(), t.resumeFrom = n, r && (t.resumeFrom.preserveOpacity = !0), n.snapshot && (t.snapshot = n.snapshot, t.snapshot.latestValues = n.animationValues || n.latestValues), t.root && t.root.isUpdating && (t.isLayoutDirty = !0);
      const { crossfade: i } = t.options;
      i === !1 && n.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((t) => {
      const { options: r, resumingFrom: n } = t;
      r.onExitComplete && r.onExitComplete(), n && n.options.onExitComplete && n.options.onExitComplete();
    });
  }
  scheduleRender() {
    this.members.forEach((t) => {
      t.instance && t.scheduleRender(!1);
    });
  }
  /**
   * Clear any leads that have been removed this render to prevent them from being
   * used in future animations and to prevent memory leaks
   */
  removeLeadSnapshot() {
    this.lead && this.lead.snapshot && (this.lead.snapshot = void 0);
  }
}
function Gm(e, t, r) {
  let n = "";
  const i = e.x.translate / t.x, a = e.y.translate / t.y, o = (r == null ? void 0 : r.z) || 0;
  if ((i || a || o) && (n = `translate3d(${i}px, ${a}px, ${o}px) `), (t.x !== 1 || t.y !== 1) && (n += `scale(${1 / t.x}, ${1 / t.y}) `), r) {
    const { transformPerspective: u, rotate: d, rotateX: h, rotateY: f, skewX: p, skewY: y } = r;
    u && (n = `perspective(${u}px) ${n}`), d && (n += `rotate(${d}deg) `), h && (n += `rotateX(${h}deg) `), f && (n += `rotateY(${f}deg) `), p && (n += `skewX(${p}deg) `), y && (n += `skewY(${y}deg) `);
  }
  const l = e.x.scale * t.x, c = e.y.scale * t.y;
  return (l !== 1 || c !== 1) && (n += `scale(${l}, ${c})`), n || "none";
}
const Hs = ["", "X", "Y", "Z"], Km = 1e3;
let qm = 0;
function Gs(e, t, r, n) {
  const { latestValues: i } = t;
  i[e] && (r[e] = i[e], t.setStaticValue(e, 0), n && (n[e] = 0));
}
function Ma(e) {
  if (e.hasCheckedOptimisedAppear = !0, e.root === e)
    return;
  const { visualElement: t } = e.options;
  if (!t)
    return;
  const r = xa(t);
  if (window.MotionHasOptimisedAnimation(r, "transform")) {
    const { layout: i, layoutId: a } = e.options;
    window.MotionCancelOptimisedAnimation(r, "transform", Z, !(i || a));
  }
  const { parent: n } = e;
  n && !n.hasCheckedOptimisedAppear && Ma(n);
}
function Da({ attachResizeListener: e, defaultParent: t, measureScroll: r, checkIsScrollRoot: n, resetTransform: i }) {
  return class {
    constructor(o = {}, l = t == null ? void 0 : t()) {
      this.id = qm++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
        this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
      }, this.updateProjection = () => {
        this.projectionUpdateScheduled = !1, this.nodes.forEach(Jm), this.nodes.forEach(sf), this.nodes.forEach(rf), this.nodes.forEach(Qm);
      }, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = o, this.root = l ? l.root || l : this, this.path = l ? [...l.path, l] : [], this.parent = l, this.depth = l ? l.depth + 1 : 0;
      for (let c = 0; c < this.path.length; c++)
        this.path[c].shouldResetTransform = !0;
      this.root === this && (this.nodes = new Vm());
    }
    addEventListener(o, l) {
      return this.eventHandlers.has(o) || this.eventHandlers.set(o, new Pr()), this.eventHandlers.get(o).add(l);
    }
    notifyListeners(o, ...l) {
      const c = this.eventHandlers.get(o);
      c && c.notify(...l);
    }
    hasListeners(o) {
      return this.eventHandlers.has(o);
    }
    /**
     * Lifecycles
     */
    mount(o) {
      if (this.instance)
        return;
      this.isSVG = Ko(o) && !$u(o), this.instance = o;
      const { layoutId: l, layout: c, visualElement: u } = this.options;
      if (u && !u.current && u.mount(o), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (c || l) && (this.isLayoutDirty = !0), e) {
        let d, h = 0;
        const f = () => this.root.updateBlockedByResize = !1;
        Z.read(() => {
          h = window.innerWidth;
        }), e(o, () => {
          const p = window.innerWidth;
          p !== h && (h = p, this.root.updateBlockedByResize = !0, d && d(), d = Fm(f, 250), ps.hasAnimatedSinceResize && (ps.hasAnimatedSinceResize = !1, this.nodes.forEach(Mi)));
        });
      }
      l && this.root.registerSharedNode(l, this), this.options.animate !== !1 && u && (l || c) && this.addEventListener("didUpdate", ({ delta: d, hasLayoutChanged: h, hasRelativeLayoutChanged: f, layout: p }) => {
        if (this.isTreeAnimationBlocked()) {
          this.target = void 0, this.relativeTarget = void 0;
          return;
        }
        const y = this.options.transition || u.getDefaultTransition() || cf, { onLayoutAnimationStart: S, onLayoutAnimationComplete: C } = u.getProps(), j = !this.targetLayout || !Ea(this.targetLayout, p), w = !h && f;
        if (this.options.layoutRoot || this.resumeFrom || w || h && (j || !this.currentAnimation)) {
          this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
          const P = {
            ...zr(y, "layout"),
            onPlay: S,
            onComplete: C
          };
          (u.shouldReduceMotion || this.options.layoutRoot) && (P.delay = 0, P.type = !1), this.startAnimation(P), this.setAnimationOrigin(d, w);
        } else
          h || Mi(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
        this.targetLayout = p;
      });
    }
    unmount() {
      this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
      const o = this.getStack();
      o && o.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), Be(this.updateProjection);
    }
    // only on the root
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || !1;
    }
    // Note: currently only running on root node
    startUpdate() {
      this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(nf), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: o } = this.options;
      return o && o.getProps().transformTemplate;
    }
    willUpdate(o = !0) {
      if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && Ma(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
        return;
      this.isLayoutDirty = !0;
      for (let d = 0; d < this.path.length; d++) {
        const h = this.path[d];
        h.shouldResetTransform = !0, h.updateScroll("snapshot"), h.options.layoutRoot && h.willUpdate(!1);
      }
      const { layoutId: l, layout: c } = this.options;
      if (l === void 0 && !c)
        return;
      const u = this.getTransformTemplate();
      this.prevTransformTemplateValue = u ? u(this.latestValues, "") : void 0, this.updateSnapshot(), o && this.notifyListeners("willUpdate");
    }
    update() {
      if (this.updateScheduled = !1, this.isUpdateBlocked()) {
        this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(Ai);
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(Ei);
        return;
      }
      this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(tf), this.nodes.forEach(Xm), this.nodes.forEach(Zm)) : this.nodes.forEach(Ei), this.clearAllSnapshots();
      const l = fe.now();
      oe.delta = De(0, 1e3 / 60, l - oe.timestamp), oe.timestamp = l, oe.isProcessing = !0, Ls.update.process(oe), Ls.preRender.process(oe), Ls.render.process(oe), oe.isProcessing = !1;
    }
    didUpdate() {
      this.updateScheduled || (this.updateScheduled = !0, $r.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      this.nodes.forEach(ef), this.sharedNodes.forEach(of);
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, Z.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      Z.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      this.snapshot || !this.instance || (this.snapshot = this.measure(), this.snapshot && !he(this.snapshot.measuredBox.x) && !he(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
    }
    updateLayout() {
      if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty))
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let c = 0; c < this.path.length; c++)
          this.path[c].updateScroll();
      const o = this.layout;
      this.layout = this.measure(!1), this.layoutCorrected = te(), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement: l } = this.options;
      l && l.notify("LayoutMeasure", this.layout.layoutBox, o ? o.layoutBox : void 0);
    }
    updateScroll(o = "measure") {
      let l = !!(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === o && (l = !1), l && this.instance) {
        const c = n(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: o,
          isRoot: c,
          offset: r(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : c
        };
      }
    }
    resetTransform() {
      if (!i)
        return;
      const o = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, l = this.projectionDelta && !Aa(this.projectionDelta), c = this.getTransformTemplate(), u = c ? c(this.latestValues, "") : void 0, d = u !== this.prevTransformTemplateValue;
      o && this.instance && (l || Ke(this.latestValues) || d) && (i(this.instance, u), this.shouldResetTransform = !1, this.scheduleRender());
    }
    measure(o = !0) {
      const l = this.measurePageBox();
      let c = this.removeElementScroll(l);
      return o && (c = this.removeTransform(c)), df(c), {
        animationId: this.root.animationId,
        measuredBox: l,
        layoutBox: c,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      var u;
      const { visualElement: o } = this.options;
      if (!o)
        return te();
      const l = o.measureViewportBox();
      if (!(((u = this.scroll) == null ? void 0 : u.wasRoot) || this.path.some(uf))) {
        const { scroll: d } = this.root;
        d && (ct(l.x, d.offset.x), ct(l.y, d.offset.y));
      }
      return l;
    }
    removeElementScroll(o) {
      var c;
      const l = te();
      if (ve(l, o), (c = this.scroll) != null && c.wasRoot)
        return l;
      for (let u = 0; u < this.path.length; u++) {
        const d = this.path[u], { scroll: h, options: f } = d;
        d !== this.root && h && f.layoutScroll && (h.wasRoot && ve(l, o), ct(l.x, h.offset.x), ct(l.y, h.offset.y));
      }
      return l;
    }
    applyTransform(o, l = !1) {
      const c = te();
      ve(c, o);
      for (let u = 0; u < this.path.length; u++) {
        const d = this.path[u];
        !l && d.options.layoutScroll && d.scroll && d !== d.root && dt(c, {
          x: -d.scroll.offset.x,
          y: -d.scroll.offset.y
        }), Ke(d.latestValues) && dt(c, d.latestValues);
      }
      return Ke(this.latestValues) && dt(c, this.latestValues), c;
    }
    removeTransform(o) {
      const l = te();
      ve(l, o);
      for (let c = 0; c < this.path.length; c++) {
        const u = this.path[c];
        if (!u.instance || !Ke(u.latestValues))
          continue;
        hr(u.latestValues) && u.updateSnapshot();
        const d = te(), h = u.measurePageBox();
        ve(d, h), ki(l, u.latestValues, u.snapshot ? u.snapshot.layoutBox : void 0, d);
      }
      return Ke(this.latestValues) && ki(l, this.latestValues), l;
    }
    setTargetDelta(o) {
      this.targetDelta = o, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0;
    }
    setOptions(o) {
      this.options = {
        ...this.options,
        ...o,
        crossfade: o.crossfade !== void 0 ? o.crossfade : !0
      };
    }
    clearMeasurements() {
      this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1;
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== oe.timestamp && this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(o = !1) {
      var f;
      const l = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = l.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = l.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = l.isSharedProjectionDirty);
      const c = !!this.resumingFrom || this !== l;
      if (!(o || c && this.isSharedProjectionDirty || this.isProjectionDirty || (f = this.parent) != null && f.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize))
        return;
      const { layout: d, layoutId: h } = this.options;
      if (!(!this.layout || !(d || h))) {
        if (this.resolvedRelativeTargetAt = oe.timestamp, !this.targetDelta && !this.relativeTarget) {
          const p = this.getClosestProjectingParent();
          p && p.layout && this.animationProgress !== 1 ? (this.relativeParent = p, this.forceRelativeParentToResolveTarget(), this.relativeTarget = te(), this.relativeTargetOrigin = te(), Vt(this.relativeTargetOrigin, this.layout.layoutBox, p.layout.layoutBox), ve(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
        if (!(!this.relativeTarget && !this.targetDelta) && (this.target || (this.target = te(), this.targetWithTransforms = te()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), pm(this.target, this.relativeTarget, this.relativeParent.target)) : this.targetDelta ? (this.resumingFrom ? this.target = this.applyTransform(this.layout.layoutBox) : ve(this.target, this.layout.layoutBox), ua(this.target, this.targetDelta)) : ve(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget)) {
          this.attemptToResolveRelativeTarget = !1;
          const p = this.getClosestProjectingParent();
          p && !!p.resumingFrom == !!this.resumingFrom && !p.options.layoutScroll && p.target && this.animationProgress !== 1 ? (this.relativeParent = p, this.forceRelativeParentToResolveTarget(), this.relativeTarget = te(), this.relativeTargetOrigin = te(), Vt(this.relativeTargetOrigin, this.target, p.target), ve(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
      }
    }
    getClosestProjectingParent() {
      if (!(!this.parent || hr(this.parent.latestValues) || da(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    calcProjection() {
      var y;
      const o = this.getLead(), l = !!this.resumingFrom || this !== o;
      let c = !0;
      if ((this.isProjectionDirty || (y = this.parent) != null && y.isProjectionDirty) && (c = !1), l && (this.isSharedProjectionDirty || this.isTransformDirty) && (c = !1), this.resolvedRelativeTargetAt === oe.timestamp && (c = !1), c)
        return;
      const { layout: u, layoutId: d } = this.options;
      if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(u || d))
        return;
      ve(this.layoutCorrected, this.layout.layoutBox);
      const h = this.treeScale.x, f = this.treeScale.y;
      Ph(this.layoutCorrected, this.treeScale, this.path, l), o.layout && !o.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (o.target = o.layout.layoutBox, o.targetWithTransforms = te());
      const { target: p } = o;
      if (!p) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (wi(this.prevProjectionDelta.x, this.projectionDelta.x), wi(this.prevProjectionDelta.y, this.projectionDelta.y)), Lt(this.projectionDelta, this.layoutCorrected, p, this.latestValues), (this.treeScale.x !== h || this.treeScale.y !== f || !_i(this.projectionDelta.x, this.prevProjectionDelta.x) || !_i(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", p));
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(o = !0) {
      var l;
      if ((l = this.options.visualElement) == null || l.scheduleRender(), o) {
        const c = this.getStack();
        c && c.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = ut(), this.projectionDelta = ut(), this.projectionDeltaWithTransform = ut();
    }
    setAnimationOrigin(o, l = !1) {
      const c = this.snapshot, u = c ? c.latestValues : {}, d = { ...this.latestValues }, h = ut();
      (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !l;
      const f = te(), p = c ? c.source : void 0, y = this.layout ? this.layout.source : void 0, S = p !== y, C = this.getStack(), j = !C || C.members.length <= 1, w = !!(S && !j && this.options.crossfade === !0 && !this.path.some(lf));
      this.animationProgress = 0;
      let P;
      this.mixTargetDelta = (D) => {
        const A = D / 1e3;
        Di(h.x, o.x, A), Di(h.y, o.y, A), this.setTargetDelta(h), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (Vt(f, this.layout.layoutBox, this.relativeParent.layout.layoutBox), af(this.relativeTarget, this.relativeTargetOrigin, f, A), P && Wm(this.relativeTarget, P) && (this.isProjectionDirty = !1), P || (P = te()), ve(P, this.relativeTarget)), S && (this.animationValues = d, Om(d, u, this.latestValues, A, w, j)), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = A;
      }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(o) {
      var l, c, u;
      this.notifyListeners("animationStart"), (l = this.currentAnimation) == null || l.stop(), (u = (c = this.resumingFrom) == null ? void 0 : c.currentAnimation) == null || u.stop(), this.pendingAnimation && (Be(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = Z.update(() => {
        ps.hasAnimatedSinceResize = !0, this.motionValue || (this.motionValue = xt(0)), this.currentAnimation = Rm(this.motionValue, [0, 1e3], {
          ...o,
          velocity: 0,
          isSync: !0,
          onUpdate: (d) => {
            this.mixTargetDelta(d), o.onUpdate && o.onUpdate(d);
          },
          onStop: () => {
          },
          onComplete: () => {
            o.onComplete && o.onComplete(), this.completeAnimation();
          }
        }), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
      const o = this.getStack();
      o && o.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(Km), this.currentAnimation.stop()), this.completeAnimation();
    }
    applyTransformsToTarget() {
      const o = this.getLead();
      let { targetWithTransforms: l, target: c, layout: u, latestValues: d } = o;
      if (!(!l || !c || !u)) {
        if (this !== o && this.layout && u && Ra(this.options.animationType, this.layout.layoutBox, u.layoutBox)) {
          c = this.target || te();
          const h = he(this.layout.layoutBox.x);
          c.x.min = o.target.x.min, c.x.max = c.x.min + h;
          const f = he(this.layout.layoutBox.y);
          c.y.min = o.target.y.min, c.y.max = c.y.min + f;
        }
        ve(l, c), dt(l, d), Lt(this.projectionDeltaWithTransform, this.layoutCorrected, l, d);
      }
    }
    registerSharedNode(o, l) {
      this.sharedNodes.has(o) || this.sharedNodes.set(o, new Hm()), this.sharedNodes.get(o).add(l);
      const u = l.options.initialPromotionConfig;
      l.promote({
        transition: u ? u.transition : void 0,
        preserveFollowOpacity: u && u.shouldPreserveFollowOpacity ? u.shouldPreserveFollowOpacity(l) : void 0
      });
    }
    isLead() {
      const o = this.getStack();
      return o ? o.lead === this : !0;
    }
    getLead() {
      var l;
      const { layoutId: o } = this.options;
      return o ? ((l = this.getStack()) == null ? void 0 : l.lead) || this : this;
    }
    getPrevLead() {
      var l;
      const { layoutId: o } = this.options;
      return o ? (l = this.getStack()) == null ? void 0 : l.prevLead : void 0;
    }
    getStack() {
      const { layoutId: o } = this.options;
      if (o)
        return this.root.sharedNodes.get(o);
    }
    promote({ needsReset: o, transition: l, preserveFollowOpacity: c } = {}) {
      const u = this.getStack();
      u && u.promote(this, c), o && (this.projectionDelta = void 0, this.needsReset = !0), l && this.setOptions({ transition: l });
    }
    relegate() {
      const o = this.getStack();
      return o ? o.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      const { visualElement: o } = this.options;
      if (!o)
        return;
      let l = !1;
      const { latestValues: c } = o;
      if ((c.z || c.rotate || c.rotateX || c.rotateY || c.rotateZ || c.skewX || c.skewY) && (l = !0), !l)
        return;
      const u = {};
      c.z && Gs("z", o, u, this.animationValues);
      for (let d = 0; d < Hs.length; d++)
        Gs(`rotate${Hs[d]}`, o, u, this.animationValues), Gs(`skew${Hs[d]}`, o, u, this.animationValues);
      o.render();
      for (const d in u)
        o.setStaticValue(d, u[d]), this.animationValues && (this.animationValues[d] = u[d]);
      o.scheduleRender();
    }
    applyProjectionStyles(o, l) {
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible) {
        o.visibility = "hidden";
        return;
      }
      const c = this.getTransformTemplate();
      if (this.needsReset) {
        this.needsReset = !1, o.visibility = "", o.opacity = "", o.pointerEvents = gs(l == null ? void 0 : l.pointerEvents) || "", o.transform = c ? c(this.latestValues, "") : "none";
        return;
      }
      const u = this.getLead();
      if (!this.projectionDelta || !this.layout || !u.target) {
        this.options.layoutId && (o.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, o.pointerEvents = gs(l == null ? void 0 : l.pointerEvents) || ""), this.hasProjected && !Ke(this.latestValues) && (o.transform = c ? c({}, "") : "none", this.hasProjected = !1);
        return;
      }
      o.visibility = "";
      const d = u.animationValues || u.latestValues;
      this.applyTransformsToTarget();
      let h = Gm(this.projectionDeltaWithTransform, this.treeScale, d);
      c && (h = c(d, h)), o.transform = h;
      const { x: f, y: p } = this.projectionDelta;
      o.transformOrigin = `${f.origin * 100}% ${p.origin * 100}% 0`, u.animationValues ? o.opacity = u === this ? d.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : d.opacityExit : o.opacity = u === this ? d.opacity !== void 0 ? d.opacity : "" : d.opacityExit !== void 0 ? d.opacityExit : 0;
      for (const y in $t) {
        if (d[y] === void 0)
          continue;
        const { correct: S, applyTo: C, isCSSVariable: j } = $t[y], w = h === "none" ? d[y] : S(d[y], u);
        if (C) {
          const P = C.length;
          for (let D = 0; D < P; D++)
            o[C[D]] = w;
        } else
          j ? this.options.visualElement.renderState.vars[y] = w : o[y] = w;
      }
      this.options.layoutId && (o.pointerEvents = u === this ? gs(l == null ? void 0 : l.pointerEvents) || "" : "none");
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((o) => {
        var l;
        return (l = o.currentAnimation) == null ? void 0 : l.stop();
      }), this.root.nodes.forEach(Ai), this.root.sharedNodes.clear();
    }
  };
}
function Xm(e) {
  e.updateLayout();
}
function Zm(e) {
  var r;
  const t = ((r = e.resumeFrom) == null ? void 0 : r.snapshot) || e.snapshot;
  if (e.isLead() && e.layout && t && e.hasListeners("didUpdate")) {
    const { layoutBox: n, measuredBox: i } = e.layout, { animationType: a } = e.options, o = t.source !== e.layout.source;
    a === "size" ? we((h) => {
      const f = o ? t.measuredBox[h] : t.layoutBox[h], p = he(f);
      f.min = n[h].min, f.max = f.min + p;
    }) : Ra(a, t.layoutBox, n) && we((h) => {
      const f = o ? t.measuredBox[h] : t.layoutBox[h], p = he(n[h]);
      f.max = f.min + p, e.relativeTarget && !e.currentAnimation && (e.isProjectionDirty = !0, e.relativeTarget[h].max = e.relativeTarget[h].min + p);
    });
    const l = ut();
    Lt(l, n, t.layoutBox);
    const c = ut();
    o ? Lt(c, e.applyTransform(i, !0), t.measuredBox) : Lt(c, n, t.layoutBox);
    const u = !Aa(l);
    let d = !1;
    if (!e.resumeFrom) {
      const h = e.getClosestProjectingParent();
      if (h && !h.resumeFrom) {
        const { snapshot: f, layout: p } = h;
        if (f && p) {
          const y = te();
          Vt(y, t.layoutBox, f.layoutBox);
          const S = te();
          Vt(S, n, p.layoutBox), Ea(y, S) || (d = !0), h.options.layoutRoot && (e.relativeTarget = S, e.relativeTargetOrigin = y, e.relativeParent = h);
        }
      }
    }
    e.notifyListeners("didUpdate", {
      layout: n,
      snapshot: t,
      delta: c,
      layoutDelta: l,
      hasLayoutChanged: u,
      hasRelativeLayoutChanged: d
    });
  } else if (e.isLead()) {
    const { onExitComplete: n } = e.options;
    n && n();
  }
  e.options.transition = void 0;
}
function Jm(e) {
  e.parent && (e.isProjecting() || (e.isProjectionDirty = e.parent.isProjectionDirty), e.isSharedProjectionDirty || (e.isSharedProjectionDirty = !!(e.isProjectionDirty || e.parent.isProjectionDirty || e.parent.isSharedProjectionDirty)), e.isTransformDirty || (e.isTransformDirty = e.parent.isTransformDirty));
}
function Qm(e) {
  e.isProjectionDirty = e.isSharedProjectionDirty = e.isTransformDirty = !1;
}
function ef(e) {
  e.clearSnapshot();
}
function Ai(e) {
  e.clearMeasurements();
}
function Ei(e) {
  e.isLayoutDirty = !1;
}
function tf(e) {
  const { visualElement: t } = e.options;
  t && t.getProps().onBeforeLayoutMeasure && t.notify("BeforeLayoutMeasure"), e.resetTransform();
}
function Mi(e) {
  e.finishAnimation(), e.targetDelta = e.relativeTarget = e.target = void 0, e.isProjectionDirty = !0;
}
function sf(e) {
  e.resolveTargetDelta();
}
function rf(e) {
  e.calcProjection();
}
function nf(e) {
  e.resetSkewAndRotation();
}
function of(e) {
  e.removeLeadSnapshot();
}
function Di(e, t, r) {
  e.translate = Q(t.translate, 0, r), e.scale = Q(t.scale, 1, r), e.origin = t.origin, e.originPoint = t.originPoint;
}
function Ri(e, t, r, n) {
  e.min = Q(t.min, r.min, n), e.max = Q(t.max, r.max, n);
}
function af(e, t, r, n) {
  Ri(e.x, t.x, r.x, n), Ri(e.y, t.y, r.y, n);
}
function lf(e) {
  return e.animationValues && e.animationValues.opacityExit !== void 0;
}
const cf = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
}, Li = (e) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(e), Vi = Li("applewebkit/") && !Li("chrome/") ? Math.round : je;
function Fi(e) {
  e.min = Vi(e.min), e.max = Vi(e.max);
}
function df(e) {
  Fi(e.x), Fi(e.y);
}
function Ra(e, t, r) {
  return e === "position" || e === "preserve-aspect" && !gm(Pi(t), Pi(r), 0.2);
}
function uf(e) {
  var t;
  return e !== e.root && ((t = e.scroll) == null ? void 0 : t.wasRoot);
}
const hf = Da({
  attachResizeListener: (e, t) => Wt(e, "resize", t),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body.scrollLeft,
    y: document.documentElement.scrollTop || document.body.scrollTop
  }),
  checkIsScrollRoot: () => !0
}), Ks = {
  current: void 0
}, La = Da({
  measureScroll: (e) => ({
    x: e.scrollLeft,
    y: e.scrollTop
  }),
  defaultParent: () => {
    if (!Ks.current) {
      const e = new hf({});
      e.mount(window), e.setOptions({ layoutScroll: !0 }), Ks.current = e;
    }
    return Ks.current;
  },
  resetTransform: (e, t) => {
    e.style.transform = t !== void 0 ? t : "none";
  },
  checkIsScrollRoot: (e) => window.getComputedStyle(e).position === "fixed"
}), mf = {
  pan: {
    Feature: Am
  },
  drag: {
    Feature: _m,
    ProjectionNode: La,
    MeasureLayout: Ca
  }
};
function Ii(e, t, r) {
  const { props: n } = e;
  e.animationState && n.whileHover && e.animationState.setActive("whileHover", r === "Start");
  const i = "onHover" + r, a = n[i];
  a && Z.postRender(() => a(t, Zt(t)));
}
class ff extends $e {
  mount() {
    const { current: t } = this.node;
    t && (this.unmount = Ou(t, (r, n) => (Ii(this.node, n, "Start"), (i) => Ii(this.node, i, "End"))));
  }
  unmount() {
  }
}
class gf extends $e {
  constructor() {
    super(...arguments), this.isActive = !1;
  }
  onFocus() {
    let t = !1;
    try {
      t = this.node.current.matches(":focus-visible");
    } catch {
      t = !0;
    }
    !t || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0);
  }
  onBlur() {
    !this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1);
  }
  mount() {
    this.unmount = Kt(Wt(this.node.current, "focus", () => this.onFocus()), Wt(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
function Oi(e, t, r) {
  const { props: n } = e;
  if (e.current instanceof HTMLButtonElement && e.current.disabled)
    return;
  e.animationState && n.whileTap && e.animationState.setActive("whileTap", r === "Start");
  const i = "onTap" + (r === "End" ? "" : r), a = n[i];
  a && Z.postRender(() => a(t, Zt(t)));
}
class pf extends $e {
  mount() {
    const { current: t } = this.node;
    t && (this.unmount = Uu(t, (r, n) => (Oi(this.node, n, "Start"), (i, { success: a }) => Oi(this.node, i, a ? "End" : "Cancel")), { useGlobalTarget: this.node.props.globalTapTarget }));
  }
  unmount() {
  }
}
const br = /* @__PURE__ */ new WeakMap(), qs = /* @__PURE__ */ new WeakMap(), xf = (e) => {
  const t = br.get(e.target);
  t && t(e);
}, yf = (e) => {
  e.forEach(xf);
};
function bf({ root: e, ...t }) {
  const r = e || document;
  qs.has(r) || qs.set(r, {});
  const n = qs.get(r), i = JSON.stringify(t);
  return n[i] || (n[i] = new IntersectionObserver(yf, { root: e, ...t })), n[i];
}
function vf(e, t, r) {
  const n = bf(t);
  return br.set(e, r), n.observe(e), () => {
    br.delete(e), n.unobserve(e);
  };
}
const wf = {
  some: 0,
  all: 1
};
class jf extends $e {
  constructor() {
    super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
  }
  startObserver() {
    this.unmount();
    const { viewport: t = {} } = this.node.getProps(), { root: r, margin: n, amount: i = "some", once: a } = t, o = {
      root: r ? r.current : void 0,
      rootMargin: n,
      threshold: typeof i == "number" ? i : wf[i]
    }, l = (c) => {
      const { isIntersecting: u } = c;
      if (this.isInView === u || (this.isInView = u, a && !u && this.hasEnteredView))
        return;
      u && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", u);
      const { onViewportEnter: d, onViewportLeave: h } = this.node.getProps(), f = u ? d : h;
      f && f(c);
    };
    return vf(this.node.current, o, l);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u")
      return;
    const { props: t, prevProps: r } = this.node;
    ["amount", "margin", "root"].some(Nf(t, r)) && this.startObserver();
  }
  unmount() {
  }
}
function Nf({ viewport: e = {} }, { viewport: t = {} } = {}) {
  return (r) => e[r] !== t[r];
}
const kf = {
  inView: {
    Feature: jf
  },
  tap: {
    Feature: pf
  },
  focus: {
    Feature: gf
  },
  hover: {
    Feature: ff
  }
}, Tf = {
  layout: {
    ProjectionNode: La,
    MeasureLayout: Ca
  }
}, Sf = {
  ...cm,
  ...kf,
  ...mf,
  ...Tf
}, Ft = /* @__PURE__ */ Th(Sf, Ih), gg = () => {
  var i, a;
  const { isAuthenticated: e } = Zi(), t = (a = (i = import.meta) == null ? void 0 : i.env) == null ? void 0 : a.VITE_STRIPE_PUBLISHABLE_KEY, r = [
    {
      id: "price_1S2L8JQv3TvmaocsYofzFKgm",
      name: "Monthly Membership",
      price: 9.99,
      interval: "month",
      features: [
        "Access to all released content",
        "New chapters as they release",
        "Exclusive behind-the-scenes",
        "Early character reveals",
        "Community discussions",
        "Author notes and insights"
      ],
      paypalPlanId: "prod_SyHh0v9pcletkx",
      highlight: "Perfect for new readers"
    },
    {
      id: "price_1S2L95Qv3TvmaocsN5zRIEXO",
      name: "Annual Membership",
      price: 99.99,
      interval: "year",
      features: [
        "Everything in Monthly plan",
        "2 months free (17% savings)",
        "Priority content access",
        "Exclusive annual content",
        "Direct Q&A with author",
        "Member-only events"
      ],
      popular: !0,
      paypalPlanId: "prod_SyHiFk24bHGA2U",
      highlight: "Best value - Save $19.89"
    }
  ], n = async (o) => {
    if (!e) {
      window.location.href = "/login?returnTo=/subscribe";
      return;
    }
    try {
      const l = Fl.auth.session();
      if (!l)
        throw new Error("User is not authenticated");
      const c = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${l.access_token}`
        },
        body: JSON.stringify({ priceId: o })
      }), u = await c.json();
      if (!c.ok)
        throw new Error(u.error || "Failed to create checkout session");
      const d = await Gc(t);
      d && d.redirectToCheckout({ sessionId: u.sessionId });
    } catch (l) {
      console.error("Error creating checkout session:", l);
    }
  };
  return /* @__PURE__ */ s.jsx(s.Fragment, { children: /* @__PURE__ */ s.jsx("div", { className: "relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 overflow-hidden", children: /* @__PURE__ */ s.jsx("div", { className: "relative z-10", children: /* @__PURE__ */ s.jsxs("div", { className: "container mx-auto px-4 py-16 md:py-24", children: [
    /* @__PURE__ */ s.jsxs(
      Ft.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8 },
        className: "text-center mb-16",
        children: [
          /* @__PURE__ */ s.jsx("h1", { className: "text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6 leading-tight", children: "Join the Zoroasterverse" }),
          /* @__PURE__ */ s.jsx("p", { className: "text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed", children: "Experience the complete story with premium membership plans" })
        ]
      }
    ),
    /* @__PURE__ */ s.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto", children: r.map((o, l) => /* @__PURE__ */ s.jsxs(
      Ft.div,
      {
        initial: { opacity: 0, y: 50, rotateY: -10 },
        animate: { opacity: 1, y: 0, rotateY: 0 },
        transition: { delay: l * 0.2 + 0.4, duration: 0.8, type: "spring", damping: 20 },
        className: `relative group cursor-pointer ${o.popular ? "md:scale-105 z-20" : "z-10"}`,
        children: [
          o.popular && /* @__PURE__ */ s.jsx("div", { className: "absolute -top-5 left-1/2 transform -translate-x-1/2 z-30", children: /* @__PURE__ */ s.jsxs("div", { className: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg", children: [
            /* @__PURE__ */ s.jsx(gt, { className: "w-4 h-4 inline mr-2" }),
            "MOST POPULAR"
          ] }) }),
          /* @__PURE__ */ s.jsxs("div", { className: `
                  bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                  border-2 rounded-3xl p-8 h-full
                  transition-all duration-500 group-hover:-translate-y-2
                  ${o.popular ? "border-yellow-400 shadow-2xl shadow-yellow-500/25 bg-gradient-to-b from-yellow-50/80 to-white/80 dark:from-yellow-900/20 dark:to-gray-800/80" : "border-gray-200 dark:border-gray-600 shadow-xl hover:shadow-2xl hover:border-blue-400 dark:hover:border-blue-500"}
                `, children: [
            /* @__PURE__ */ s.jsxs("div", { className: "text-center mb-8", children: [
              /* @__PURE__ */ s.jsx("h3", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-4", children: o.name }),
              o.highlight && /* @__PURE__ */ s.jsx("div", { className: `inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${o.popular ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"}`, children: o.highlight }),
              /* @__PURE__ */ s.jsxs("div", { className: "mb-6", children: [
                /* @__PURE__ */ s.jsxs("div", { className: "flex items-baseline justify-center gap-2", children: [
                  /* @__PURE__ */ s.jsxs("span", { className: "text-6xl font-black text-gray-900 dark:text-white", children: [
                    "$",
                    o.price
                  ] }),
                  /* @__PURE__ */ s.jsxs("span", { className: "text-2xl text-gray-500 dark:text-gray-400 font-medium", children: [
                    "/",
                    o.interval
                  ] })
                ] }),
                o.interval === "year" && /* @__PURE__ */ s.jsxs("p", { className: "text-green-600 dark:text-green-400 font-semibold mt-2", children: [
                  "Save $19.89 annually • $",
                  (o.price / 12).toFixed(2),
                  "/month"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ s.jsx("ul", { className: "space-y-4 mb-8", children: o.features.map((c, u) => /* @__PURE__ */ s.jsxs("li", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ s.jsx("div", { className: `w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${o.popular ? "bg-yellow-100 dark:bg-yellow-900/30" : "bg-blue-100 dark:bg-blue-900/30"}`, children: /* @__PURE__ */ s.jsx(
                pt,
                {
                  className: `${o.popular ? "text-yellow-600 dark:text-yellow-400" : "text-blue-600 dark:text-blue-400"}`,
                  size: 16
                }
              ) }),
              /* @__PURE__ */ s.jsx("span", { className: "text-gray-700 dark:text-gray-300 font-medium", children: c })
            ] }, u)) }),
            /* @__PURE__ */ s.jsxs(
              "button",
              {
                onClick: () => n(o.id),
                className: `w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg group-hover:shadow-xl ${o.popular ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-yellow-500/30" : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-500/30"} transform group-hover:-translate-y-1`,
                children: [
                  /* @__PURE__ */ s.jsx("span", { children: "Get Started" }),
                  /* @__PURE__ */ s.jsx(Ll, { className: "w-5 h-5 transition-transform group-hover:translate-x-1" })
                ]
              }
            )
          ] })
        ]
      },
      o.id
    )) })
  ] }) }) }) });
}, pg = () => /* @__PURE__ */ s.jsx("div", { className: "relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center", children: /* @__PURE__ */ s.jsxs(
  Ft.div,
  {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.8, ease: "easeOut" },
    className: "text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-green-400 rounded-3xl p-8 md:p-12 shadow-2xl shadow-green-500/25 max-w-2xl mx-auto",
    children: [
      /* @__PURE__ */ s.jsx(
        Ft.div,
        {
          initial: { scale: 0 },
          animate: { scale: 1 },
          transition: { delay: 0.2, type: "spring", stiffness: 260, damping: 20 },
          className: "mx-auto w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6 border-4 border-green-200 dark:border-green-700",
          children: /* @__PURE__ */ s.jsx(pt, { className: "w-12 h-12 text-green-600 dark:text-green-400" })
        }
      ),
      /* @__PURE__ */ s.jsx("h1", { className: "text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-teal-600 to-green-800 bg-clip-text text-transparent mb-4", children: "Subscription Successful!" }),
      /* @__PURE__ */ s.jsx("p", { className: "text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8", children: "Welcome to the Zoroasterverse! You now have access to all premium content." }),
      /* @__PURE__ */ s.jsx(
        Ft.a,
        {
          href: "/account/reading",
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
          className: "inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300",
          children: "Start Reading"
        }
      )
    ]
  }
) }), Cf = qi(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
), Pf = _e.forwardRef(
  ({ className: e, variant: t, size: r, asChild: n = !1, ...i }, a) => {
    const o = n ? Il : "button";
    return /* @__PURE__ */ s.jsx(
      o,
      {
        className: pe(Cf({ variant: t, size: r, className: e })),
        ref: a,
        ...i
      }
    );
  }
);
Pf.displayName = "Button";
const _f = _e.forwardRef(({ className: e, ...t }, r) => /* @__PURE__ */ s.jsx(
  "div",
  {
    ref: r,
    className: pe("rounded-lg border bg-card text-card-foreground shadow-sm", e),
    ...t
  }
));
_f.displayName = "Card";
const Af = _e.forwardRef(({ className: e, ...t }, r) => /* @__PURE__ */ s.jsx(
  "div",
  {
    ref: r,
    className: pe("flex flex-col space-y-1.5 p-6", e),
    ...t
  }
));
Af.displayName = "CardHeader";
const Ef = _e.forwardRef(({ className: e, ...t }, r) => /* @__PURE__ */ s.jsx(
  "h3",
  {
    ref: r,
    className: pe(
      "text-2xl font-semibold leading-none tracking-tight",
      e
    ),
    ...t
  }
));
Ef.displayName = "CardTitle";
const Mf = _e.forwardRef(({ className: e, ...t }, r) => /* @__PURE__ */ s.jsx(
  "p",
  {
    ref: r,
    className: pe("text-sm text-muted-foreground", e),
    ...t
  }
));
Mf.displayName = "CardDescription";
const Df = _e.forwardRef(({ className: e, ...t }, r) => /* @__PURE__ */ s.jsx("div", { ref: r, className: pe("p-6 pt-0", e), ...t }));
Df.displayName = "CardContent";
const Rf = _e.forwardRef(({ className: e, ...t }, r) => /* @__PURE__ */ s.jsx(
  "div",
  {
    ref: r,
    className: pe("flex items-center p-6 pt-0", e),
    ...t
  }
));
Rf.displayName = "CardFooter";
const Lf = _e.forwardRef(
  ({ className: e, type: t, ...r }, n) => /* @__PURE__ */ s.jsx(
    "input",
    {
      type: t,
      className: pe(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        e
      ),
      ref: n,
      ...r
    }
  )
);
Lf.displayName = "Input";
const Vf = qi(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
), Ff = _e.forwardRef(({ className: e, ...t }, r) => /* @__PURE__ */ s.jsx(
  Xi.Root,
  {
    ref: r,
    className: pe(Vf(), e),
    ...t
  }
));
Ff.displayName = Xi.Root.displayName;
const If = {
  default: "bg-primary text-primary-foreground hover:bg-primary/80 border-transparent",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent",
  outline: "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
  success: "bg-green-500 text-white hover:bg-green-600 border-transparent"
}, Of = _e.forwardRef(
  ({ className: e, variant: t = "default", ...r }, n) => /* @__PURE__ */ s.jsx(
    "div",
    {
      ref: n,
      className: pe(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        If[t],
        e
      ),
      ...r
    }
  )
);
Of.displayName = "Badge";
export {
  Jf as AdminProtectedRoute,
  Zf as AdminSideNav,
  qf as AdminSideNavProvider,
  Xf as AdminSideNavToggle,
  Of as Badge,
  Pf as Button,
  _f as Card,
  Df as CardContent,
  Mf as CardDescription,
  Rf as CardFooter,
  Af as CardHeader,
  Ef as CardTitle,
  ag as CartIcon,
  uc as Footer,
  sg as GlowButton,
  tg as HomePage,
  Lf as Input,
  ug as InventoryManagementPage,
  Ff as Label,
  eg as Layout,
  ig as LoadingSkeleton,
  lg as LoginPage,
  ng as MagicalParticles,
  mg as MediaUploadPage,
  nc as Navbar,
  dg as OrderManagementPage,
  rg as OrnateDivider,
  cg as ProductManagementPage,
  Qf as SimpleDashboardPage,
  og as StarsBackground,
  gg as SubscriptionPage,
  pg as SubscriptionSuccessPage,
  Lc as WikiNavItem,
  hg as WorksManagementPage,
  Cf as buttonVariants,
  Rc as cn,
  Qi as useAdminSideNav
};
