import * as ce from "react";
import Ot, { createContext as It, useContext as zt, useEffect as he, useState as p, useRef as Dt } from "react";
import { useNavigate as $t, NavLink as Ge, useLocation as wr, Navigate as jr, Outlet as Nr, Link as ze } from "react-router-dom";
import { clsx as Wt } from "clsx";
import { twMerge as Ut } from "tailwind-merge";
import { createClient as kr } from "@supabase/supabase-js";
import { X as ge, LayoutDashboard as _r, Package as je, ShoppingCart as Ne, Boxes as Cr, BarChart3 as Ve, FileText as ye, BookOpen as Ze, Calendar as dt, Users as Qe, Webhook as Tr, Upload as xe, Settings as ct, LogOut as Sr, Menu as Er, AlertCircle as Re, CheckSquare as Tt, DollarSign as ht, Eye as ke, TrendingUp as Se, Search as Pe, Twitter as Pr, Instagram as Yr, Mail as Ar, ChevronRight as Fr, Minus as Lr, Plus as Ee, Trash2 as et, RefreshCw as de, Filter as De, EyeOff as qt, Edit as Je, Save as Bt, Crown as Oe, Book as be, AlertTriangle as Ke, User as St, CreditCard as Et, ExternalLink as Pt, XCircle as qe, Clock as Me, CheckCircle as Xe, Package2 as Be, TrendingDown as He, Star as Yt, PauseCircle as Mr, Target as Rr, Archive as Or, Image as At, File as Ir, FolderOpen as zr, Download as Dr, Video as $r, Music as Wr } from "lucide-react";
import { useCart as Ur } from "@zoroaster/shared";
import { Slot as qr } from "@radix-ui/react-slot";
import { cva as Ht } from "class-variance-authority";
import * as Gt from "@radix-ui/react-label";
var it = { exports: {} }, Fe = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ft;
function Br() {
  if (Ft) return Fe;
  Ft = 1;
  var s = Ot, n = Symbol.for("react.element"), i = Symbol.for("react.fragment"), h = Object.prototype.hasOwnProperty, m = s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, f = { key: !0, ref: !0, __self: !0, __source: !0 };
  function N(g, u, v) {
    var x, C = {}, P = null, Y = null;
    v !== void 0 && (P = "" + v), u.key !== void 0 && (P = "" + u.key), u.ref !== void 0 && (Y = u.ref);
    for (x in u) h.call(u, x) && !f.hasOwnProperty(x) && (C[x] = u[x]);
    if (g && g.defaultProps) for (x in u = g.defaultProps, u) C[x] === void 0 && (C[x] = u[x]);
    return { $$typeof: n, type: g, key: P, ref: Y, props: C, _owner: m.current };
  }
  return Fe.Fragment = i, Fe.jsx = N, Fe.jsxs = N, Fe;
}
var Le = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Lt;
function Hr() {
  return Lt || (Lt = 1, process.env.NODE_ENV !== "production" && function() {
    var s = Ot, n = Symbol.for("react.element"), i = Symbol.for("react.portal"), h = Symbol.for("react.fragment"), m = Symbol.for("react.strict_mode"), f = Symbol.for("react.profiler"), N = Symbol.for("react.provider"), g = Symbol.for("react.context"), u = Symbol.for("react.forward_ref"), v = Symbol.for("react.suspense"), x = Symbol.for("react.suspense_list"), C = Symbol.for("react.memo"), P = Symbol.for("react.lazy"), Y = Symbol.for("react.offscreen"), T = Symbol.iterator, q = "@@iterator";
    function I(t) {
      if (t === null || typeof t != "object")
        return null;
      var d = T && t[T] || t[q];
      return typeof d == "function" ? d : null;
    }
    var R = s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function S(t) {
      {
        for (var d = arguments.length, b = new Array(d > 1 ? d - 1 : 0), E = 1; E < d; E++)
          b[E - 1] = arguments[E];
        B("error", t, b);
      }
    }
    function B(t, d, b) {
      {
        var E = R.ReactDebugCurrentFrame, M = E.getStackAddendum();
        M !== "" && (d += "%s", b = b.concat([M]));
        var W = b.map(function(F) {
          return String(F);
        });
        W.unshift("Warning: " + d), Function.prototype.apply.call(console[t], console, W);
      }
    }
    var z = !1, D = !1, se = !1, V = !1, k = !1, l;
    l = Symbol.for("react.module.reference");
    function y(t) {
      return !!(typeof t == "string" || typeof t == "function" || t === h || t === f || k || t === m || t === v || t === x || V || t === Y || z || D || se || typeof t == "object" && t !== null && (t.$$typeof === P || t.$$typeof === C || t.$$typeof === N || t.$$typeof === g || t.$$typeof === u || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      t.$$typeof === l || t.getModuleId !== void 0));
    }
    function a(t, d, b) {
      var E = t.displayName;
      if (E)
        return E;
      var M = d.displayName || d.name || "";
      return M !== "" ? b + "(" + M + ")" : b;
    }
    function _(t) {
      return t.displayName || "Context";
    }
    function $(t) {
      if (t == null)
        return null;
      if (typeof t.tag == "number" && S("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof t == "function")
        return t.displayName || t.name || null;
      if (typeof t == "string")
        return t;
      switch (t) {
        case h:
          return "Fragment";
        case i:
          return "Portal";
        case f:
          return "Profiler";
        case m:
          return "StrictMode";
        case v:
          return "Suspense";
        case x:
          return "SuspenseList";
      }
      if (typeof t == "object")
        switch (t.$$typeof) {
          case g:
            var d = t;
            return _(d) + ".Consumer";
          case N:
            var b = t;
            return _(b._context) + ".Provider";
          case u:
            return a(t, t.render, "ForwardRef");
          case C:
            var E = t.displayName || null;
            return E !== null ? E : $(t.type) || "Memo";
          case P: {
            var M = t, W = M._payload, F = M._init;
            try {
              return $(F(W));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var Z = Object.assign, c = 0, L, te, H, K, le, ue, o;
    function r() {
    }
    r.__reactDisabledLog = !0;
    function j() {
      {
        if (c === 0) {
          L = console.log, te = console.info, H = console.warn, K = console.error, le = console.group, ue = console.groupCollapsed, o = console.groupEnd;
          var t = {
            configurable: !0,
            enumerable: !0,
            value: r,
            writable: !0
          };
          Object.defineProperties(console, {
            info: t,
            log: t,
            warn: t,
            error: t,
            group: t,
            groupCollapsed: t,
            groupEnd: t
          });
        }
        c++;
      }
    }
    function U() {
      {
        if (c--, c === 0) {
          var t = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: Z({}, t, {
              value: L
            }),
            info: Z({}, t, {
              value: te
            }),
            warn: Z({}, t, {
              value: H
            }),
            error: Z({}, t, {
              value: K
            }),
            group: Z({}, t, {
              value: le
            }),
            groupCollapsed: Z({}, t, {
              value: ue
            }),
            groupEnd: Z({}, t, {
              value: o
            })
          });
        }
        c < 0 && S("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var X = R.ReactCurrentDispatcher, oe;
    function Ye(t, d, b) {
      {
        if (oe === void 0)
          try {
            throw Error();
          } catch (M) {
            var E = M.stack.trim().match(/\n( *(at )?)/);
            oe = E && E[1] || "";
          }
        return `
` + oe + t;
      }
    }
    var _e = !1, $e;
    {
      var Kt = typeof WeakMap == "function" ? WeakMap : Map;
      $e = new Kt();
    }
    function ut(t, d) {
      if (!t || _e)
        return "";
      {
        var b = $e.get(t);
        if (b !== void 0)
          return b;
      }
      var E;
      _e = !0;
      var M = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var W;
      W = X.current, X.current = null, j();
      try {
        if (d) {
          var F = function() {
            throw Error();
          };
          if (Object.defineProperty(F.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(F, []);
            } catch (re) {
              E = re;
            }
            Reflect.construct(t, [], F);
          } else {
            try {
              F.call();
            } catch (re) {
              E = re;
            }
            t.call(F.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (re) {
            E = re;
          }
          t();
        }
      } catch (re) {
        if (re && E && typeof re.stack == "string") {
          for (var A = re.stack.split(`
`), ee = E.stack.split(`
`), G = A.length - 1, J = ee.length - 1; G >= 1 && J >= 0 && A[G] !== ee[J]; )
            J--;
          for (; G >= 1 && J >= 0; G--, J--)
            if (A[G] !== ee[J]) {
              if (G !== 1 || J !== 1)
                do
                  if (G--, J--, J < 0 || A[G] !== ee[J]) {
                    var ie = `
` + A[G].replace(" at new ", " at ");
                    return t.displayName && ie.includes("<anonymous>") && (ie = ie.replace("<anonymous>", t.displayName)), typeof t == "function" && $e.set(t, ie), ie;
                  }
                while (G >= 1 && J >= 0);
              break;
            }
        }
      } finally {
        _e = !1, X.current = W, U(), Error.prepareStackTrace = M;
      }
      var Te = t ? t.displayName || t.name : "", ve = Te ? Ye(Te) : "";
      return typeof t == "function" && $e.set(t, ve), ve;
    }
    function Zt(t, d, b) {
      return ut(t, !1);
    }
    function Qt(t) {
      var d = t.prototype;
      return !!(d && d.isReactComponent);
    }
    function We(t, d, b) {
      if (t == null)
        return "";
      if (typeof t == "function")
        return ut(t, Qt(t));
      if (typeof t == "string")
        return Ye(t);
      switch (t) {
        case v:
          return Ye("Suspense");
        case x:
          return Ye("SuspenseList");
      }
      if (typeof t == "object")
        switch (t.$$typeof) {
          case u:
            return Zt(t.render);
          case C:
            return We(t.type, d, b);
          case P: {
            var E = t, M = E._payload, W = E._init;
            try {
              return We(W(M), d, b);
            } catch {
            }
          }
        }
      return "";
    }
    var Ae = Object.prototype.hasOwnProperty, mt = {}, gt = R.ReactDebugCurrentFrame;
    function Ue(t) {
      if (t) {
        var d = t._owner, b = We(t.type, t._source, d ? d.type : null);
        gt.setExtraStackFrame(b);
      } else
        gt.setExtraStackFrame(null);
    }
    function Xt(t, d, b, E, M) {
      {
        var W = Function.call.bind(Ae);
        for (var F in t)
          if (W(t, F)) {
            var A = void 0;
            try {
              if (typeof t[F] != "function") {
                var ee = Error((E || "React class") + ": " + b + " type `" + F + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof t[F] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw ee.name = "Invariant Violation", ee;
              }
              A = t[F](d, F, E, b, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (G) {
              A = G;
            }
            A && !(A instanceof Error) && (Ue(M), S("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", E || "React class", b, F, typeof A), Ue(null)), A instanceof Error && !(A.message in mt) && (mt[A.message] = !0, Ue(M), S("Failed %s type: %s", b, A.message), Ue(null));
          }
      }
    }
    var er = Array.isArray;
    function rt(t) {
      return er(t);
    }
    function tr(t) {
      {
        var d = typeof Symbol == "function" && Symbol.toStringTag, b = d && t[Symbol.toStringTag] || t.constructor.name || "Object";
        return b;
      }
    }
    function rr(t) {
      try {
        return pt(t), !1;
      } catch {
        return !0;
      }
    }
    function pt(t) {
      return "" + t;
    }
    function ft(t) {
      if (rr(t))
        return S("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", tr(t)), pt(t);
    }
    var xt = R.ReactCurrentOwner, sr = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, bt, yt;
    function ar(t) {
      if (Ae.call(t, "ref")) {
        var d = Object.getOwnPropertyDescriptor(t, "ref").get;
        if (d && d.isReactWarning)
          return !1;
      }
      return t.ref !== void 0;
    }
    function nr(t) {
      if (Ae.call(t, "key")) {
        var d = Object.getOwnPropertyDescriptor(t, "key").get;
        if (d && d.isReactWarning)
          return !1;
      }
      return t.key !== void 0;
    }
    function or(t, d) {
      typeof t.ref == "string" && xt.current;
    }
    function ir(t, d) {
      {
        var b = function() {
          bt || (bt = !0, S("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", d));
        };
        b.isReactWarning = !0, Object.defineProperty(t, "key", {
          get: b,
          configurable: !0
        });
      }
    }
    function lr(t, d) {
      {
        var b = function() {
          yt || (yt = !0, S("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", d));
        };
        b.isReactWarning = !0, Object.defineProperty(t, "ref", {
          get: b,
          configurable: !0
        });
      }
    }
    var dr = function(t, d, b, E, M, W, F) {
      var A = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: n,
        // Built-in properties that belong on the element
        type: t,
        key: d,
        ref: b,
        props: F,
        // Record the component responsible for creating this element.
        _owner: W
      };
      return A._store = {}, Object.defineProperty(A._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(A, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: E
      }), Object.defineProperty(A, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: M
      }), Object.freeze && (Object.freeze(A.props), Object.freeze(A)), A;
    };
    function cr(t, d, b, E, M) {
      {
        var W, F = {}, A = null, ee = null;
        b !== void 0 && (ft(b), A = "" + b), nr(d) && (ft(d.key), A = "" + d.key), ar(d) && (ee = d.ref, or(d, M));
        for (W in d)
          Ae.call(d, W) && !sr.hasOwnProperty(W) && (F[W] = d[W]);
        if (t && t.defaultProps) {
          var G = t.defaultProps;
          for (W in G)
            F[W] === void 0 && (F[W] = G[W]);
        }
        if (A || ee) {
          var J = typeof t == "function" ? t.displayName || t.name || "Unknown" : t;
          A && ir(F, J), ee && lr(F, J);
        }
        return dr(t, A, ee, M, E, xt.current, F);
      }
    }
    var st = R.ReactCurrentOwner, vt = R.ReactDebugCurrentFrame;
    function Ce(t) {
      if (t) {
        var d = t._owner, b = We(t.type, t._source, d ? d.type : null);
        vt.setExtraStackFrame(b);
      } else
        vt.setExtraStackFrame(null);
    }
    var at;
    at = !1;
    function nt(t) {
      return typeof t == "object" && t !== null && t.$$typeof === n;
    }
    function wt() {
      {
        if (st.current) {
          var t = $(st.current.type);
          if (t)
            return `

Check the render method of \`` + t + "`.";
        }
        return "";
      }
    }
    function hr(t) {
      return "";
    }
    var jt = {};
    function ur(t) {
      {
        var d = wt();
        if (!d) {
          var b = typeof t == "string" ? t : t.displayName || t.name;
          b && (d = `

Check the top-level render call using <` + b + ">.");
        }
        return d;
      }
    }
    function Nt(t, d) {
      {
        if (!t._store || t._store.validated || t.key != null)
          return;
        t._store.validated = !0;
        var b = ur(d);
        if (jt[b])
          return;
        jt[b] = !0;
        var E = "";
        t && t._owner && t._owner !== st.current && (E = " It was passed a child from " + $(t._owner.type) + "."), Ce(t), S('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', b, E), Ce(null);
      }
    }
    function kt(t, d) {
      {
        if (typeof t != "object")
          return;
        if (rt(t))
          for (var b = 0; b < t.length; b++) {
            var E = t[b];
            nt(E) && Nt(E, d);
          }
        else if (nt(t))
          t._store && (t._store.validated = !0);
        else if (t) {
          var M = I(t);
          if (typeof M == "function" && M !== t.entries)
            for (var W = M.call(t), F; !(F = W.next()).done; )
              nt(F.value) && Nt(F.value, d);
        }
      }
    }
    function mr(t) {
      {
        var d = t.type;
        if (d == null || typeof d == "string")
          return;
        var b;
        if (typeof d == "function")
          b = d.propTypes;
        else if (typeof d == "object" && (d.$$typeof === u || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        d.$$typeof === C))
          b = d.propTypes;
        else
          return;
        if (b) {
          var E = $(d);
          Xt(b, t.props, "prop", E, t);
        } else if (d.PropTypes !== void 0 && !at) {
          at = !0;
          var M = $(d);
          S("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", M || "Unknown");
        }
        typeof d.getDefaultProps == "function" && !d.getDefaultProps.isReactClassApproved && S("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function gr(t) {
      {
        for (var d = Object.keys(t.props), b = 0; b < d.length; b++) {
          var E = d[b];
          if (E !== "children" && E !== "key") {
            Ce(t), S("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", E), Ce(null);
            break;
          }
        }
        t.ref !== null && (Ce(t), S("Invalid attribute `ref` supplied to `React.Fragment`."), Ce(null));
      }
    }
    var _t = {};
    function Ct(t, d, b, E, M, W) {
      {
        var F = y(t);
        if (!F) {
          var A = "";
          (t === void 0 || typeof t == "object" && t !== null && Object.keys(t).length === 0) && (A += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var ee = hr();
          ee ? A += ee : A += wt();
          var G;
          t === null ? G = "null" : rt(t) ? G = "array" : t !== void 0 && t.$$typeof === n ? (G = "<" + ($(t.type) || "Unknown") + " />", A = " Did you accidentally export a JSX literal instead of a component?") : G = typeof t, S("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", G, A);
        }
        var J = cr(t, d, b, M, W);
        if (J == null)
          return J;
        if (F) {
          var ie = d.children;
          if (ie !== void 0)
            if (E)
              if (rt(ie)) {
                for (var Te = 0; Te < ie.length; Te++)
                  kt(ie[Te], t);
                Object.freeze && Object.freeze(ie);
              } else
                S("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              kt(ie, t);
        }
        if (Ae.call(d, "key")) {
          var ve = $(t), re = Object.keys(d).filter(function(vr) {
            return vr !== "key";
          }), ot = re.length > 0 ? "{key: someKey, " + re.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!_t[ve + ot]) {
            var yr = re.length > 0 ? "{" + re.join(": ..., ") + ": ...}" : "{}";
            S(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, ot, ve, yr, ve), _t[ve + ot] = !0;
          }
        }
        return t === h ? gr(J) : mr(J), J;
      }
    }
    function pr(t, d, b) {
      return Ct(t, d, b, !0);
    }
    function fr(t, d, b) {
      return Ct(t, d, b, !1);
    }
    var xr = fr, br = pr;
    Le.Fragment = h, Le.jsx = xr, Le.jsxs = br;
  }()), Le;
}
process.env.NODE_ENV === "production" ? it.exports = Br() : it.exports = Hr();
var e = it.exports;
function ne(...s) {
  return Ut(Wt(s));
}
const Gr = It(void 0), Vr = () => {
  const s = zt(Gr);
  if (s === void 0)
    throw new Error("useAuth must be used within an AuthProvider");
  return s;
}, pe = {}, lt = typeof window < "u", Ie = (pe == null ? void 0 : pe.VITE_SUPABASE_URL) || process.env.VITE_SUPABASE_URL || "", tt = (pe == null ? void 0 : pe.VITE_SUPABASE_ANON_KEY) || process.env.VITE_SUPABASE_ANON_KEY || "";
console.log("DEBUG: supabaseUrl (raw):", Ie);
console.log("DEBUG: supabaseAnonKey (raw):", tt);
((pe == null ? void 0 : pe.VITE_DEBUG) === "true" || process.env.VITE_DEBUG === "true") && (console.log("Supabase URL:", Ie ? "✅ Set" : "❌ Missing"), console.log("Supabase Anon Key:", tt ? "✅ Set" : "❌ Missing"));
if ((!Ie || !tt) && lt) {
  const s = `
    Missing Supabase environment variables.
    Please check your .env file and ensure the following are set:
    - VITE_SUPABASE_URL
    - VITE_SUPABASE_ANON_KEY
  `;
  throw console.error(s), new Error(s);
}
let ae;
var Rt;
try {
  ae = kr(Ie, tt, {
    auth: {
      persistSession: !0,
      autoRefreshToken: !0,
      detectSessionInUrl: !0,
      storage: lt ? window.localStorage : void 0
    }
  }), typeof process < "u" && ((Rt = process.env) == null ? void 0 : Rt.NODE_ENV) === "development" && lt && console.log("Supabase client initialized with URL:", Ie);
} catch (s) {
  throw console.error("Error initializing Supabase client:", s), s;
}
const Vt = It(void 0), Jt = () => {
  const s = zt(Vt);
  if (!s)
    throw new Error("useAdminSideNav must be used within AdminSideNavProvider");
  return s;
}, nn = ({ children: s }) => {
  const [n, i] = p(!1), h = () => {
    console.log("AdminSideNav: toggle called, current state:", n), i(!n);
  }, m = () => {
    console.log("AdminSideNav: close called, current state:", n), i(!1);
  };
  return /* @__PURE__ */ e.jsx(Vt.Provider, { value: { isOpen: n, toggle: h, close: m }, children: s });
}, Jr = [
  { name: "Dashboard", href: "/account/admin", icon: _r },
  { name: "Products", href: "/account/admin/products", icon: je },
  { name: "Orders", href: "/account/admin/orders", icon: Ne },
  { name: "Inventory", href: "/account/admin/inventory", icon: Cr },
  { name: "Analytics", href: "/account/admin/analytics", icon: Ve },
  { name: "Posts", href: "/account/admin/posts", icon: ye },
  { name: "Works", href: "/account/admin/works", icon: Ze },
  { name: "Timeline", href: "/account/admin/timeline/events", icon: dt },
  { name: "Users", href: "/account/admin/users", icon: Qe },
  { name: "Beta Applications", href: "/account/admin/beta-applications", icon: Qe },
  { name: "Webhooks", href: "/account/admin/webhooks", icon: Tr },
  { name: "Media", href: "/account/admin/media", icon: xe },
  { name: "Settings", href: "/account/admin/settings", icon: ct }
], on = () => {
  const { isOpen: s, toggle: n } = Jt();
  return s ? null : /* @__PURE__ */ e.jsx(
    "button",
    {
      onClick: n,
      className: "fixed top-4 left-4 z-[10000] p-3 rounded-lg bg-slate-800 border border-amber-500/50 shadow-xl hover:bg-slate-700 hover:border-amber-400 text-amber-300 hover:text-amber-200 transition-all duration-300 group",
      "aria-label": "Toggle navigation menu",
      children: /* @__PURE__ */ e.jsx(Er, { size: 20, className: "transition-transform duration-200 group-hover:scale-110" })
    }
  );
}, ln = () => {
  var g, u;
  const { isOpen: s, close: n } = Jt(), i = $t(), { user: h, userProfile: m } = Vr(), f = async () => {
    await ae.auth.signOut(), i("/");
  }, N = () => {
    console.log("AdminSideNav: handleLinkClick called"), n();
  };
  return he(() => {
    const v = (x) => {
      x.key === "Escape" && s && (console.log("AdminSideNav: Escape key pressed"), n());
    };
    return document.addEventListener("keydown", v), () => document.removeEventListener("keydown", v);
  }, [s, n]), s ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      "div",
      {
        className: "fixed inset-0 bg-black/50 z-[9998]",
        onClick: n
      }
    ),
    /* @__PURE__ */ e.jsx(
      "aside",
      {
        className: "fixed top-0 left-0 z-[9999] h-screen w-80 border-r border-amber-500 shadow-2xl animate-in slide-in-from-left duration-300",
        style: { backgroundColor: "#0f172a", backdropFilter: "none" },
        children: /* @__PURE__ */ e.jsxs("div", { className: "h-full flex flex-col relative", style: { backgroundColor: "#0f172a", backdropFilter: "none" }, children: [
          /* @__PURE__ */ e.jsx("div", { className: "absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600" }),
          /* @__PURE__ */ e.jsx("div", { className: "p-6 border-b border-amber-500", style: { backgroundColor: "#1e293b", backdropFilter: "none" }, children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center space-x-3", children: [
              /* @__PURE__ */ e.jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg", children: /* @__PURE__ */ e.jsx("span", { className: "text-slate-900 font-bold text-lg", children: "Z" }) }),
              /* @__PURE__ */ e.jsxs("div", { children: [
                /* @__PURE__ */ e.jsx("h2", { className: "text-xl font-bold text-amber-300", children: "Zoroaster" }),
                /* @__PURE__ */ e.jsx("p", { className: "text-xs text-slate-400 font-medium", children: "Admin Panel" })
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                onClick: n,
                className: "p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-amber-300 transition-colors duration-200",
                "aria-label": "Close menu",
                children: /* @__PURE__ */ e.jsx(ge, { size: 20, className: "transition-transform duration-200 hover:rotate-90" })
              }
            )
          ] }) }),
          /* @__PURE__ */ e.jsx("nav", { className: "flex-1 overflow-y-auto py-4 px-3", style: { backgroundColor: "#0f172a", backdropFilter: "none" }, children: /* @__PURE__ */ e.jsx("ul", { className: "space-y-2", children: Jr.map((v) => /* @__PURE__ */ e.jsx("li", { children: /* @__PURE__ */ e.jsx(
            Ge,
            {
              to: v.href,
              end: v.href === "/account/admin",
              onClick: N,
              className: ({ isActive: x }) => ne(
                "group flex items-center p-3 rounded-xl transition-all duration-200 relative overflow-hidden space-x-3",
                x ? "bg-amber-600 text-amber-100 border border-amber-500 shadow-md" : "text-slate-300 hover:bg-slate-700 hover:text-amber-200 border border-transparent hover:border-amber-500"
              ),
              children: ({ isActive: x }) => /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                x && /* @__PURE__ */ e.jsx("div", { className: "absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-r" }),
                /* @__PURE__ */ e.jsx(
                  v.icon,
                  {
                    size: 20,
                    className: ne(
                      "flex-shrink-0 transition-all duration-200",
                      x ? "text-amber-400 drop-shadow-sm" : "group-hover:text-amber-300"
                    )
                  }
                ),
                /* @__PURE__ */ e.jsx("span", { className: ne(
                  "font-medium transition-all duration-200",
                  x ? "text-amber-200" : "group-hover:text-amber-200"
                ), children: v.name })
              ] })
            }
          ) }, v.name)) }) }),
          /* @__PURE__ */ e.jsx("div", { className: "p-4 border-t border-amber-500", style: { backgroundColor: "#1e293b", backdropFilter: "none" }, children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center space-x-3", children: [
              /* @__PURE__ */ e.jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-slate-900 font-bold shadow-lg ring-2 ring-amber-400/30", children: ((g = m == null ? void 0 : m.display_name) == null ? void 0 : g.charAt(0)) || ((u = h == null ? void 0 : h.email) == null ? void 0 : u.charAt(0).toUpperCase()) }),
              /* @__PURE__ */ e.jsxs("div", { children: [
                /* @__PURE__ */ e.jsx("p", { className: "text-sm font-semibold text-amber-200 truncate max-w-[160px]", children: (m == null ? void 0 : m.display_name) || "Admin User" }),
                /* @__PURE__ */ e.jsx("p", { className: "text-xs text-slate-400 truncate max-w-[160px]", children: h == null ? void 0 : h.email })
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                onClick: f,
                className: "p-2 rounded-lg hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/10 text-slate-400 hover:text-red-300 transition-all duration-200 border border-transparent hover:border-red-500/30",
                title: "Sign out",
                children: /* @__PURE__ */ e.jsx(Sr, { size: 18 })
              }
            )
          ] }) })
        ] })
      }
    )
  ] }) : null;
}, dn = ({ children: s }) => {
  var N, g;
  const [n, i] = p(!0), [h, m] = p({ isAuthenticated: !1, isAdmin: !1 }), f = wr();
  return he(() => {
    (async () => {
      console.log("⏳ [AdminProtectedRoute] Checking session and admin status...");
      const { data: { session: v }, error: x } = await ae.auth.getSession();
      if (x || !v) {
        console.log("🔒 [AdminProtectedRoute] No authenticated session found."), m({ isAuthenticated: !1, isAdmin: !1 }), i(!1);
        return;
      }
      console.log("✅ [AdminProtectedRoute] Session found. User:", v.user.email);
      const { data: C, error: P } = await ae.rpc("is_admin");
      P && console.error("❌ [AdminProtectedRoute] Error calling is_admin RPC:", P);
      const T = {
        isAuthenticated: !0,
        isAdmin: C === !0,
        user: v.user
      };
      console.log("✅ [AdminProtectedRoute] Final auth state:", T), m(T), i(!1);
    })();
  }, []), n ? /* @__PURE__ */ e.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-900 text-white", children: /* @__PURE__ */ e.jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ e.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto" }),
    /* @__PURE__ */ e.jsx("p", { className: "mt-4", children: "Verifying Admin Privileges..." })
  ] }) }) : h.isAuthenticated ? h.isAdmin ? /* @__PURE__ */ e.jsx(e.Fragment, { children: s }) : (console.log("❌ [AdminProtectedRoute] Access Denied. User is not an admin."), /* @__PURE__ */ e.jsx("div", { className: "min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 text-white", children: /* @__PURE__ */ e.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ e.jsxs("div", { className: "bg-gray-800 shadow-lg rounded-lg overflow-hidden", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "bg-red-600 p-6", children: [
      /* @__PURE__ */ e.jsx("h1", { className: "text-2xl font-bold", children: "Access Denied" }),
      /* @__PURE__ */ e.jsx("p", { className: "text-red-100", children: "You do not have the necessary permissions to view this page." })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "p-6 space-y-4", children: [
      /* @__PURE__ */ e.jsx("p", { children: "The page you are trying to access is restricted to administrators only." }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-lg font-medium text-gray-300 mb-2", children: "Your Account Details" }),
        /* @__PURE__ */ e.jsxs("dl", { className: "bg-gray-700/50 rounded-lg p-4 space-y-2 text-sm", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ e.jsx("dt", { className: "text-gray-400", children: "User ID" }),
            /* @__PURE__ */ e.jsx("dd", { className: "font-mono", children: ((N = h.user) == null ? void 0 : N.id) || "N/A" })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ e.jsx("dt", { className: "text-gray-400", children: "Email" }),
            /* @__PURE__ */ e.jsx("dd", { children: ((g = h.user) == null ? void 0 : g.email) || "N/A" })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ e.jsx("dt", { className: "text-gray-400", children: "Admin Status" }),
            /* @__PURE__ */ e.jsx("dd", { className: "font-semibold text-red-400", children: "Not an Admin" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("p", { children: "If you believe this is an error, please contact support." }),
      /* @__PURE__ */ e.jsx("div", { className: "pt-4", children: /* @__PURE__ */ e.jsx("a", { href: "/", className: "px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700", children: "Go to Homepage" }) })
    ] })
  ] }) }) })) : (console.log("🛑 [AdminProtectedRoute] Not authenticated, redirecting to login."), /* @__PURE__ */ e.jsx(jr, { to: "/login", state: { from: f }, replace: !0 }));
}, we = ({ title: s, value: n, icon: i, color: h, trend: m }) => /* @__PURE__ */ e.jsx("div", { className: "bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
  /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: s }),
    /* @__PURE__ */ e.jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: n }),
    m && /* @__PURE__ */ e.jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: m })
  ] }),
  /* @__PURE__ */ e.jsx("div", { className: `p-3 rounded-lg bg-${h}-100 dark:bg-${h}-900/20`, children: /* @__PURE__ */ e.jsx(i, { className: `w-6 h-6 text-${h}-600 dark:text-${h}-400` }) })
] }) }), me = ({ title: s, description: n, icon: i, href: h, color: m }) => /* @__PURE__ */ e.jsx(
  "a",
  {
    href: h,
    className: "block bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all hover:border-blue-300 dark:hover:border-blue-600 group",
    children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center space-x-4", children: [
      /* @__PURE__ */ e.jsx("div", { className: `p-3 rounded-lg bg-${m}-100 dark:bg-${m}-900/20 group-hover:bg-${m}-200 dark:group-hover:bg-${m}-900/40 transition-colors`, children: /* @__PURE__ */ e.jsx(i, { className: `w-6 h-6 text-${m}-600 dark:text-${m}-400` }) }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("h3", { className: "font-semibold text-gray-900 dark:text-white", children: s }),
        /* @__PURE__ */ e.jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: n })
      ] })
    ] })
  }
), cn = () => {
  const [s, n] = p(null), [i, h] = p(!0), [m, f] = p(null);
  return he(() => {
    (async () => {
      try {
        const [
          { count: g },
          { count: u },
          { data: v },
          { data: x },
          { count: C },
          { count: P },
          { count: Y }
        ] = await Promise.all([
          ae.from("profiles").select("id", { count: "exact", head: !0 }),
          ae.from("subscriptions").select("id", { count: "exact", head: !0 }).eq("status", "active"),
          ae.from("pages").select("view_count"),
          ae.from("orders").select("total_amount, status").eq("status", "completed"),
          ae.from("products").select("id", { count: "exact", head: !0 }).eq("active", !0),
          ae.from("orders").select("id", { count: "exact", head: !0 }),
          ae.from("orders").select("id", { count: "exact", head: !0 }).eq("status", "pending")
        ]), T = (v == null ? void 0 : v.reduce((I, R) => I + (R.view_count || 0), 0)) || 0, q = (x == null ? void 0 : x.reduce((I, R) => I + R.total_amount, 0)) || 0;
        n({
          totalUsers: g || 0,
          activeSubscribers: u || 0,
          totalRevenue: q,
          totalViews: T,
          totalProducts: C || 0,
          totalOrders: P || 0,
          pendingOrders: Y || 0
        });
      } catch (g) {
        f(g instanceof Error ? g.message : "Failed to fetch dashboard metrics");
      } finally {
        h(!1);
      }
    })();
  }, []), i ? /* @__PURE__ */ e.jsx("div", { className: "p-6 space-y-6", children: /* @__PURE__ */ e.jsxs("div", { className: "animate-pulse space-y-6", children: [
    /* @__PURE__ */ e.jsx("div", { className: "h-8 bg-gray-200 dark:bg-gray-700 rounded w-64" }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: [...Array(4)].map((N, g) => /* @__PURE__ */ e.jsx("div", { className: "h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" }, g)) })
  ] }) }) : m ? /* @__PURE__ */ e.jsx("div", { className: "p-6", children: /* @__PURE__ */ e.jsx("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4", children: /* @__PURE__ */ e.jsxs("div", { className: "flex", children: [
    /* @__PURE__ */ e.jsx(Re, { className: "w-5 h-5 text-red-600 dark:text-red-400" }),
    /* @__PURE__ */ e.jsxs("div", { className: "ml-3", children: [
      /* @__PURE__ */ e.jsx("h3", { className: "text-sm font-medium text-red-800 dark:text-red-200", children: "Error Loading Dashboard" }),
      /* @__PURE__ */ e.jsx("p", { className: "text-sm text-red-700 dark:text-red-300 mt-1", children: m })
    ] })
  ] }) }) }) : /* @__PURE__ */ e.jsxs("div", { className: "p-6 space-y-6", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "border-b border-gray-200 dark:border-gray-700 pb-6", children: [
      /* @__PURE__ */ e.jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white", children: "Welcome to Zoroasterverse Admin" }),
      /* @__PURE__ */ e.jsx("p", { className: "text-gray-600 dark:text-gray-300 mt-2", children: "Manage your worldbuilding platform with powerful admin tools" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ e.jsx(
        we,
        {
          title: "Total Users",
          value: (s == null ? void 0 : s.totalUsers.toLocaleString()) ?? "0",
          icon: Qe,
          color: "blue",
          trend: "↑ Growing community"
        }
      ),
      /* @__PURE__ */ e.jsx(
        we,
        {
          title: "Active Subscribers",
          value: (s == null ? void 0 : s.activeSubscribers.toLocaleString()) ?? "0",
          icon: Tt,
          color: "green",
          trend: "Premium members"
        }
      ),
      /* @__PURE__ */ e.jsx(
        we,
        {
          title: "Total Revenue",
          value: `$${(s == null ? void 0 : s.totalRevenue.toFixed(2)) ?? "0.00"}`,
          icon: ht,
          color: "yellow",
          trend: "All-time earnings"
        }
      ),
      /* @__PURE__ */ e.jsx(
        we,
        {
          title: "Page Views",
          value: (s == null ? void 0 : s.totalViews.toLocaleString()) ?? "0",
          icon: ke,
          color: "purple",
          trend: "Content engagement"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ e.jsx(
        we,
        {
          title: "Active Products",
          value: (s == null ? void 0 : s.totalProducts.toLocaleString()) ?? "0",
          icon: je,
          color: "indigo",
          trend: "Available for sale"
        }
      ),
      /* @__PURE__ */ e.jsx(
        we,
        {
          title: "Total Orders",
          value: (s == null ? void 0 : s.totalOrders.toLocaleString()) ?? "0",
          icon: Ne,
          color: "green",
          trend: "All-time orders"
        }
      ),
      /* @__PURE__ */ e.jsx(
        we,
        {
          title: "Pending Orders",
          value: (s == null ? void 0 : s.pendingOrders.toLocaleString()) ?? "0",
          icon: Re,
          color: "orange",
          trend: "Requires attention"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-xl font-bold text-gray-900 dark:text-white", children: "Quick Actions" }),
      /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ e.jsx(
          me,
          {
            title: "Manage Users",
            description: "View, edit, and manage user accounts",
            icon: Qe,
            href: "/account/admin/users",
            color: "blue"
          }
        ),
        /* @__PURE__ */ e.jsx(
          me,
          {
            title: "Content Management",
            description: "Create and manage posts and pages",
            icon: ye,
            href: "/account/admin/posts",
            color: "green"
          }
        ),
        /* @__PURE__ */ e.jsx(
          me,
          {
            title: "Product Catalog",
            description: "Manage your store products",
            icon: je,
            href: "/account/admin/products",
            color: "purple"
          }
        ),
        /* @__PURE__ */ e.jsx(
          me,
          {
            title: "Order Processing",
            description: "View and process customer orders",
            icon: Ne,
            href: "/account/admin/orders",
            color: "orange"
          }
        ),
        /* @__PURE__ */ e.jsx(
          me,
          {
            title: "Beta Applications",
            description: "Review beta reader applications",
            icon: Tt,
            href: "/account/admin/beta-applications",
            color: "indigo"
          }
        ),
        /* @__PURE__ */ e.jsx(
          me,
          {
            title: "Timeline Events",
            description: "Manage worldbuilding timeline",
            icon: dt,
            href: "/account/admin/timeline/events",
            color: "red"
          }
        ),
        /* @__PURE__ */ e.jsx(
          me,
          {
            title: "Works & Chapters",
            description: "Manage your literary works",
            icon: Ze,
            href: "/account/admin/works",
            color: "teal"
          }
        ),
        /* @__PURE__ */ e.jsx(
          me,
          {
            title: "Analytics",
            description: "View detailed performance metrics",
            icon: Se,
            href: "/account/admin/analytics",
            color: "pink"
          }
        ),
        /* @__PURE__ */ e.jsx(
          me,
          {
            title: "Settings",
            description: "Configure admin preferences",
            icon: ct,
            href: "/account/admin/settings",
            color: "gray"
          }
        )
      ] })
    ] })
  ] });
}, Kr = "_zoroHeader_6lzsp_2", Zr = "_logo_6lzsp_16", Qr = "_navbar_6lzsp_23", Xr = "_navMenu_6lzsp_27", es = "_navLink_6lzsp_39", ts = "_dropdownMenu_6lzsp_53", rs = "_dropdownMenuItem_6lzsp_73", ss = "_dropdown_6lzsp_53", as = "_headerControls_6lzsp_96", ns = "_searchForm_6lzsp_121", os = "_themeToggle_6lzsp_165", is = "_icon_6lzsp_186", ls = "_iconSun_6lzsp_197", ds = "_iconMoon_6lzsp_203", Q = {
  zoroHeader: Kr,
  logo: Zr,
  navbar: Qr,
  navMenu: Xr,
  navLink: es,
  dropdownMenu: ts,
  dropdownMenuItem: rs,
  dropdown: ss,
  headerControls: as,
  searchForm: ns,
  themeToggle: os,
  icon: is,
  iconSun: ls,
  iconMoon: ds
}, Mt = "zoro-theme", cs = () => {
  const [s, n] = p(() => {
    if (typeof window < "u") {
      const h = localStorage.getItem(Mt), m = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return h ?? (m ? "dark" : "light");
    }
    return "dark";
  });
  he(() => {
    const h = window.document.documentElement;
    h.setAttribute("data-theme", s), localStorage.setItem(Mt, s), s === "dark" ? (h.classList.add("dark"), h.classList.remove("light")) : (h.classList.add("light"), h.classList.remove("dark"));
  }, [s]);
  const i = () => {
    n((h) => h === "dark" ? "light" : "dark");
  };
  return e.jsxs("button", { id: "theme-toggle", className: Q.themeToggle, "aria-label": "Toggle dark mode", "aria-pressed": s === "dark" ? "true" : "false", title: s === "dark" ? "Switch to light mode" : "Switch to dark mode", onClick: i, children: [e.jsxs("svg", { className: `${Q.icon} ${Q.iconSun}`, viewBox: "0 0 24 24", width: "22", height: "22", "aria-hidden": "true", children: [e.jsx("circle", { cx: "12", cy: "12", r: "4", fill: "currentColor" }), e.jsxs("g", { stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: [e.jsx("line", { x1: "12", y1: "2", x2: "12", y2: "5" }), e.jsx("line", { x1: "12", y1: "19", x2: "12", y2: "22" }), e.jsx("line", { x1: "2", y1: "12", x2: "5", y2: "12" }), e.jsx("line", { x1: "19", y1: "12", x2: "22", y2: "12" }), e.jsx("line", { x1: "4.2", y1: "4.2", x2: "6.3", y2: "6.3" }), e.jsx("line", { x1: "17.7", y1: "17.7", x2: "19.8", y2: "19.8" }), e.jsx("line", { x1: "4.2", y1: "19.8", x2: "6.3", y2: "17.7" }), e.jsx("line", { x1: "17.7", y1: "6.3", x2: "19.8", y2: "4.2" })] })] }), e.jsx("svg", { className: `${Q.icon} ${Q.iconMoon}`, viewBox: "0 0 24 24", width: "22", height: "22", "aria-hidden": "true", children: e.jsx("path", { d: `M21 14.5a9 9 0 1 1-8.5-12
                 a8 8 0 0 0 8.5 12z`, fill: "currentColor" }) })] });
}, hs = ({
  isAuthenticated: s = !1,
  betaApplicationStatus: n = "none",
  onLogout: i
}) => {
  const [h, m] = p(!1), f = () => {
    i && i();
  }, N = [
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
  if (s) {
    const g = [];
    g.push({ name: "Store", path: "/store" }), g.push({ name: "Subscriptions", path: "/subscriptions" }), n === "accepted" && g.push({ name: "Beta Portal", path: "/beta/portal" }), g.push({ name: "My Account", path: "/account" }), N.push({ name: "Account", path: "#", children: g }), N.push({ name: "Logout", path: "#", onClick: f });
  } else
    N.push({ name: "Login", path: "/login" });
  return /* @__PURE__ */ e.jsxs("header", { className: Q.zoroHeader, children: [
    /* @__PURE__ */ e.jsx("div", { className: Q.logo, children: /* @__PURE__ */ e.jsx(Ge, { to: "/", children: /* @__PURE__ */ e.jsx("h1", { children: "Zoroasterverse" }) }) }),
    /* @__PURE__ */ e.jsxs("div", { className: Q.headerControls, children: [
      /* @__PURE__ */ e.jsxs("form", { className: Q.searchForm, children: [
        /* @__PURE__ */ e.jsx("input", { type: "text", placeholder: "Search..." }),
        /* @__PURE__ */ e.jsx("button", { type: "submit", children: /* @__PURE__ */ e.jsx(Pe, {}) })
      ] }),
      /* @__PURE__ */ e.jsx(cs, {})
    ] }),
    /* @__PURE__ */ e.jsx("nav", { className: Q.navbar, children: /* @__PURE__ */ e.jsx("ul", { className: Q.navMenu, children: N.map((g) => /* @__PURE__ */ e.jsxs("li", { className: g.children ? Q.dropdown : "", children: [
      g.onClick ? /* @__PURE__ */ e.jsx("button", { onClick: g.onClick, className: Q.navLink, children: g.name }) : /* @__PURE__ */ e.jsxs(Ge, { to: g.path, className: Q.navLink, children: [
        g.name,
        " ",
        g.children ? "▾" : ""
      ] }),
      g.children && /* @__PURE__ */ e.jsx("ul", { className: Q.dropdownMenu, children: g.children.map((u) => /* @__PURE__ */ e.jsx("li", { children: /* @__PURE__ */ e.jsx(Ge, { to: u.path, className: Q.dropdownMenuItem, children: u.name }) }, u.name)) })
    ] }, g.name)) }) })
  ] });
}, us = "_zoroFooter_8qpog_1", ms = "_footerContent_8qpog_8", gs = "_footerColumns_8qpog_13", ps = "_column_8qpog_20", fs = "_socialIcons_8qpog_50", xs = "_footerQuote_8qpog_59", fe = {
  zoroFooter: us,
  footerContent: ms,
  footerColumns: gs,
  column: ps,
  socialIcons: fs,
  footerQuote: xs
}, bs = () => /* @__PURE__ */ e.jsx("footer", { className: fe.zoroFooter, children: /* @__PURE__ */ e.jsxs("div", { className: fe.footerContent, children: [
  /* @__PURE__ */ e.jsxs("div", { className: fe.footerColumns, children: [
    /* @__PURE__ */ e.jsxs("div", { className: fe.column, children: [
      /* @__PURE__ */ e.jsx("h4", { children: "Zoroasterverse" }),
      /* @__PURE__ */ e.jsx("p", { children: "“Truth is the architect of happiness.”" }),
      /* @__PURE__ */ e.jsxs("p", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Zoroasterverse. All rights reserved."
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: fe.column, children: [
      /* @__PURE__ */ e.jsx("h4", { children: "Explore" }),
      /* @__PURE__ */ e.jsxs("ul", { children: [
        /* @__PURE__ */ e.jsx("li", { children: /* @__PURE__ */ e.jsx("a", { href: "/about", children: "About" }) }),
        /* @__PURE__ */ e.jsx("li", { children: /* @__PURE__ */ e.jsx("a", { href: "/books", children: "Books" }) }),
        /* @__PURE__ */ e.jsx("li", { children: /* @__PURE__ */ e.jsx("a", { href: "/collaborate", children: "Artist Collaboration" }) }),
        /* @__PURE__ */ e.jsx("li", { children: /* @__PURE__ */ e.jsx("a", { href: "/contact", children: "Contact" }) })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: fe.column, children: [
      /* @__PURE__ */ e.jsx("h4", { children: "Connect" }),
      /* @__PURE__ */ e.jsxs("ul", { className: fe.socialIcons, children: [
        /* @__PURE__ */ e.jsx("li", { children: /* @__PURE__ */ e.jsx("a", { href: "#", children: /* @__PURE__ */ e.jsx(Pr, {}) }) }),
        /* @__PURE__ */ e.jsx("li", { children: /* @__PURE__ */ e.jsx("a", { href: "#", children: /* @__PURE__ */ e.jsx(Yr, {}) }) }),
        /* @__PURE__ */ e.jsx("li", { children: /* @__PURE__ */ e.jsx("a", { href: "#", children: /* @__PURE__ */ e.jsx(Ar, {}) }) })
      ] })
    ] })
  ] }),
  /* @__PURE__ */ e.jsx("div", { className: fe.footerQuote, children: /* @__PURE__ */ e.jsx("em", { children: "“Let your conscience be the altar where right intention dwells.”" }) })
] }) }), hn = ({
  isAuthenticated: s = !1,
  betaApplicationStatus: n = "none",
  onLogout: i
}) => /* @__PURE__ */ e.jsxs("div", { className: "min-h-screen flex flex-col", children: [
  /* @__PURE__ */ e.jsx(
    hs,
    {
      isAuthenticated: s,
      betaApplicationStatus: n,
      onLogout: i
    }
  ),
  /* @__PURE__ */ e.jsx("main", { className: "flex-1", children: /* @__PURE__ */ e.jsx(Nr, {}) }),
  /* @__PURE__ */ e.jsx(bs, {})
] }), ys = "_zrHero_14v3a_1", vs = "_parchmentCard_14v3a_12", ws = "_zrHeroContent_14v3a_70", js = "_zrTitle_14v3a_74", Ns = "_zrQuote_14v3a_88", ks = "_zrIntro_14v3a_97", _s = "_zrCta_14v3a_105", Cs = "_zrHeroArt_14v3a_123", Ts = "_videoFire_14v3a_156", Ss = "_prophecyMask_14v3a_168", Es = "_prophecyReel_14v3a_183", Ps = "_prophecyItem_14v3a_193", Ys = "_englishText_14v3a_203", As = "_spinsIndicator_14v3a_212", Fs = "_spinDot_14v3a_221", Ls = "_spinDotActive_14v3a_230", Ms = "_zrSection_14v3a_237", Rs = "_zrH2_14v3a_243", O = {
  zrHero: ys,
  parchmentCard: vs,
  zrHeroContent: ws,
  zrTitle: js,
  zrQuote: Ns,
  zrIntro: ks,
  zrCta: _s,
  zrHeroArt: Cs,
  videoFire: Ts,
  prophecyMask: Ss,
  prophecyReel: Es,
  prophecyItem: Ps,
  englishText: Ys,
  spinsIndicator: As,
  spinDot: Fs,
  spinDotActive: Ls,
  zrSection: Ms,
  zrH2: Rs
}, Os = ({ spinsLeft: s, setSpinsLeft: n, onSpin: i }) => {
  const h = Dt(null), [m, f] = p(!1), N = 150, g = [
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
  ], u = 5, v = g.length, x = [];
  for (let Y = 0; Y < u; Y++)
    x.push(...g);
  const C = [
    ...x.slice(x.length - v),
    ...x,
    ...x.slice(0, v)
    // Append for smooth loop
  ], P = async () => {
    if (m || !h.current || s <= 0) {
      console.log("No spins left or already spinning.");
      return;
    }
    console.log("handleSpin called");
    try {
      new Audio("/gear-click-351962.mp3").play().catch((R) => console.error("Error playing sound:", R));
    } catch (I) {
      console.error("Error creating Audio object:", I);
    }
    if (f(!0), n((I) => I - 1), i)
      try {
        await i(3 - s + 1);
      } catch (I) {
        console.error("Error updating spin count:", I);
      }
    const Y = Math.floor(Math.random() * g.length), q = (v + Y + g.length * Math.floor(u / 2)) * N;
    h.current.classList.add("prophecy-reel-spinning"), h.current.style.transform = `translateY(-${q}px)`, setTimeout(() => {
      if (!h.current) return;
      h.current.classList.remove("prophecy-reel-spinning"), h.current.style.transition = "none";
      const I = Y * N;
      h.current.style.transform = `translateY(-${I}px)`, h.current.offsetHeight, h.current.style.transition = "transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)", f(!1);
    }, 1600);
  };
  return /* @__PURE__ */ e.jsx(e.Fragment, { children: /* @__PURE__ */ e.jsx("div", { className: O.prophecyMask, onClick: P, children: /* @__PURE__ */ e.jsx("div", { ref: h, className: O.prophecyReel, children: C.map((Y, T) => /* @__PURE__ */ e.jsx("div", { className: O.prophecyItem, children: /* @__PURE__ */ e.jsx("span", { className: O.englishText, children: Y.english }) }, T)) }) }) });
}, Is = ({ contentMap: s, spinsLeft: n, setSpinsLeft: i, onSpin: h }) => {
  var g, u, v;
  const m = ((g = s.get("hero_title")) == null ? void 0 : g.content) || "Zoroasterverse", f = ((u = s.get("hero_quote")) == null ? void 0 : u.content) || "“Happiness comes to them who bring happiness to others.”", N = ((v = s.get("hero_description")) == null ? void 0 : v.content) || "Learn about the teachings of the prophet Zarathustra, the history of one of the world’s oldest religions, and the principles of Good Thoughts, Good Words, and Good Deeds.";
  return /* @__PURE__ */ e.jsxs("section", { id: "home", className: O.zrHero, children: [
    /* @__PURE__ */ e.jsxs("div", { className: O.zrHeroContent, children: [
      /* @__PURE__ */ e.jsx("h1", { className: O.zrTitle, children: m }),
      /* @__PURE__ */ e.jsx("p", { className: O.zrQuote, children: f }),
      /* @__PURE__ */ e.jsx("p", { className: O.zrIntro, children: N }),
      /* @__PURE__ */ e.jsx(ze, { className: O.zrCta, to: "/blog/about", children: "Learn More" })
    ] }),
    /* @__PURE__ */ e.jsxs("figure", { className: O.zrHeroArt, "aria-labelledby": "art-caption", children: [
      /* @__PURE__ */ e.jsx(
        "video",
        {
          src: "/200716-913538378.mp4",
          autoPlay: !0,
          loop: !0,
          muted: !0,
          playsInline: !0,
          className: O.videoFire
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: O.spinsIndicator, children: [...Array(3)].map((x, C) => /* @__PURE__ */ e.jsx("div", { className: `${O.spinDot} ${C < n ? O.spinDotActive : ""}` }, C)) }),
      /* @__PURE__ */ e.jsx(Os, { spinsLeft: n, setSpinsLeft: i, onSpin: h }),
      /* @__PURE__ */ e.jsx("figcaption", { id: "art-caption", className: "sr-only", children: "A stylized winged figure above a sacred fire." })
    ] })
  ] });
}, zs = ({ posts: s }) => /* @__PURE__ */ e.jsxs("section", { className: O.zrSection, children: [
  /* @__PURE__ */ e.jsx("h2", { className: O.zrH2, children: "Latest News & Updates" }),
  /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: s.map((n) => {
    const i = n.content.length > 100 ? n.content.substring(0, 100) + "..." : n.content;
    return /* @__PURE__ */ e.jsxs("div", { className: O.parchmentCard, children: [
      /* @__PURE__ */ e.jsx("h3", { children: n.title }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-2", dangerouslySetInnerHTML: { __html: i } }),
      /* @__PURE__ */ e.jsx(ze, { to: `/blog/${n.slug}`, className: "mt-4 inline-block", children: "Read More" })
    ] }, n.id);
  }) })
] }), Ds = ({ releases: s }) => /* @__PURE__ */ e.jsxs("section", { className: O.zrSection, children: [
  /* @__PURE__ */ e.jsx("h2", { className: O.zrH2, children: "Latest Releases" }),
  /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: s.map((n) => /* @__PURE__ */ e.jsxs("div", { className: O.parchmentCard, children: [
    /* @__PURE__ */ e.jsx("h3", { children: n.title }),
    /* @__PURE__ */ e.jsxs("p", { className: "mt-2", children: [
      "Type: ",
      n.type
    ] }),
    /* @__PURE__ */ e.jsx("a", { href: n.link || "#", className: "mt-4 inline-block", children: "View Details / Purchase" })
  ] }, n.id)) })
] }), un = ({
  homepageData: s = [],
  latestPosts: n = [],
  releaseData: i = [],
  spinsLeft: h = 0,
  isLoading: m = !1,
  isError: f = !1,
  onSpin: N
}) => {
  var x, C, P, Y;
  const [g, u] = p(h);
  if (m) return /* @__PURE__ */ e.jsx("div", { className: "text-center py-8", children: "Loading homepage content..." });
  if (f) return /* @__PURE__ */ e.jsx("div", { className: "text-center py-8 text-red-400", children: "Error loading homepage content." });
  const v = new Map(s == null ? void 0 : s.map((T) => [T.section, T]));
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx(Is, { contentMap: v, spinsLeft: g, setSpinsLeft: u, onSpin: N }),
    /* @__PURE__ */ e.jsxs("section", { className: O.zrSection, children: [
      /* @__PURE__ */ e.jsx("h2", { className: O.zrH2, children: "Our Progress" }),
      /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-8 text-center", children: [
        /* @__PURE__ */ e.jsxs("div", { className: O.parchmentCard, children: [
          /* @__PURE__ */ e.jsx("h3", { className: "text-4xl font-bold text-primary", children: ((x = v.get("statistics_words_written")) == null ? void 0 : x.content) || "0" }),
          /* @__PURE__ */ e.jsx("p", { className: "text-muted-foreground", children: "Words Written" })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: O.parchmentCard, children: [
          /* @__PURE__ */ e.jsx("h3", { className: "text-4xl font-bold text-primary", children: ((C = v.get("statistics_beta_readers")) == null ? void 0 : C.content) || "0" }),
          /* @__PURE__ */ e.jsx("p", { className: "text-muted-foreground", children: "Beta Readers" })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: O.parchmentCard, children: [
          /* @__PURE__ */ e.jsx("h3", { className: "text-4xl font-bold text-primary", children: ((P = v.get("statistics_average_rating")) == null ? void 0 : P.content) || "0" }),
          /* @__PURE__ */ e.jsx("p", { className: "text-muted-foreground", children: "Average Rating" })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: O.parchmentCard, children: [
          /* @__PURE__ */ e.jsx("h3", { className: "text-4xl font-bold text-primary", children: ((Y = v.get("statistics_books_published")) == null ? void 0 : Y.content) || "0" }),
          /* @__PURE__ */ e.jsx("p", { className: "text-muted-foreground", children: "Books Published" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(zs, { posts: n || [] }),
    /* @__PURE__ */ e.jsx(Ds, { releases: i || [] }),
    /* @__PURE__ */ e.jsxs("section", { className: O.zrSection, children: [
      /* @__PURE__ */ e.jsx("h2", { className: O.zrH2, children: "Artist Collaboration" }),
      /* @__PURE__ */ e.jsxs("div", { className: "relative rounded-lg shadow-lg overflow-hidden w-full", children: [
        /* @__PURE__ */ e.jsx("img", { src: "/images/invite_to_Colab_card.png", alt: "Artist Collaboration Invitation", className: "w-full h-full object-contain" }),
        /* @__PURE__ */ e.jsxs("div", { className: "absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-8", children: [
          /* @__PURE__ */ e.jsx("h3", { className: "text-2xl font-bold text-white mb-4 text-shadow-md", children: "Join Our Creative Team!" }),
          /* @__PURE__ */ e.jsx("p", { className: "text-white mb-6 text-shadow-sm", children: "We're looking for talented artists to help shape the visual identity of the Zangar/Spandam Series. Explore revenue-share opportunities and bring your vision to life." }),
          /* @__PURE__ */ e.jsx(ze, { to: "/artist-collaboration", className: "inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105", children: "Apply Now" })
        ] })
      ] })
    ] })
  ] });
}, mn = ({ children: s, icon: n, variant: i = "primary", className: h = "", onClick: m, type: f = "button" }) => {
  const N = "group relative inline-flex items-center gap-3 rounded-2xl px-8 py-4 font-semibold tracking-wide transition-all duration-300 transform", g = {
    // Add index signature
    primary: "border border-amber-600/60 bg-gradient-to-r from-amber-600/20 to-orange-600/20 text-amber-100 shadow-[0_0_30px_rgba(251,191,36,0.15)] hover:shadow-[0_0_50px_rgba(251,191,36,0.3)] hover:-translate-y-1",
    secondary: "border border-slate-600/60 bg-gradient-to-r from-slate-800/80 to-slate-900/80 text-slate-200 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(251,191,36,0.2)] hover:border-amber-600/40 hover:-translate-y-1"
  };
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      className: `${N} ${g[i]} ${h}`,
      onClick: m,
      type: f,
      children: [
        n && /* @__PURE__ */ e.jsx(n, { className: "w-5 h-5" }),
        /* @__PURE__ */ e.jsx("span", { className: "relative z-10", children: s }),
        /* @__PURE__ */ e.jsx(Fr, { className: "w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" }),
        /* @__PURE__ */ e.jsx("div", { className: "absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-600/10 via-orange-600/10 to-amber-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-xl" })
      ]
    }
  );
}, gn = () => /* @__PURE__ */ e.jsxs("div", { className: "relative flex items-center justify-center my-12", children: [
  /* @__PURE__ */ e.jsx("div", { className: "h-px w-32 bg-gradient-to-r from-transparent via-amber-600/60 to-transparent" }),
  /* @__PURE__ */ e.jsxs("svg", { width: "80", height: "32", viewBox: "0 0 80 32", className: "mx-4 text-amber-500", children: [
    /* @__PURE__ */ e.jsx("path", { d: "M8 16L16 8L24 16L32 8L40 16L48 8L56 16L64 8L72 16", stroke: "currentColor", strokeWidth: "1", fill: "none" }),
    /* @__PURE__ */ e.jsx("circle", { cx: "16", cy: "8", r: "2", fill: "currentColor" }),
    /* @__PURE__ */ e.jsx("circle", { cx: "40", cy: "16", r: "2", fill: "currentColor" }),
    /* @__PURE__ */ e.jsx("circle", { cx: "64", cy: "8", r: "2", fill: "currentColor" })
  ] }),
  /* @__PURE__ */ e.jsx("div", { className: "h-px w-32 bg-gradient-to-r from-transparent via-amber-600/60 to-transparent" })
] }), pn = () => {
  const [s] = p(
    () => Array.from({ length: 60 }, (n, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 4 + 2,
      opacity: Math.random() * 0.5 + 0.1
    }))
  );
  return /* @__PURE__ */ e.jsx("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: s.map((n) => /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "absolute rounded-full bg-amber-400/30",
      style: {
        left: `${n.x}%`,
        top: `${n.y}%`,
        width: `${n.size}px`,
        height: `${n.size}px`,
        opacity: n.opacity,
        animation: `float ${n.speed + 8}s linear infinite`,
        boxShadow: `0 0 ${n.size * 4}px rgba(251, 191, 36, 0.4)`
      }
    },
    n.id
  )) });
};
function $s(...s) {
  return Ut(Wt(s));
}
const fn = ({ count: s = 4, viewMode: n = "grid", className: i }) => {
  const h = Array.from({ length: s }, (m, f) => /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: `${n === "grid" ? "bg-background-light/30 backdrop-blur-sm rounded-2xl border border-border/30 overflow-hidden" : "bg-background-light/30 backdrop-blur-sm rounded-2xl p-6 border border-border/30"}`,
      children: [
        /* @__PURE__ */ e.jsx("div", { className: "h-64 bg-gradient-to-r from-border/20 to-border/40 skeleton" }),
        /* @__PURE__ */ e.jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ e.jsx("div", { className: "h-6 bg-border/20 rounded skeleton mb-3" }),
          /* @__PURE__ */ e.jsxs("div", { className: "space-y-2 mb-4", children: [
            /* @__PURE__ */ e.jsx("div", { className: "h-4 bg-border/20 rounded skeleton" }),
            /* @__PURE__ */ e.jsx("div", { className: "h-4 bg-border/20 rounded skeleton w-3/4" }),
            /* @__PURE__ */ e.jsx("div", { className: "h-4 bg-border/20 rounded skeleton w-1/2" })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ e.jsx("div", { className: "h-4 bg-border/20 rounded skeleton w-24 mb-2" }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex space-x-2", children: [
              /* @__PURE__ */ e.jsx("div", { className: "h-6 bg-border/20 rounded-full skeleton w-16" }),
              /* @__PURE__ */ e.jsx("div", { className: "h-6 bg-border/20 rounded-full skeleton w-20" })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "mb-6", children: [
            /* @__PURE__ */ e.jsx("div", { className: "h-8 bg-border/20 rounded skeleton w-20 mb-2" }),
            /* @__PURE__ */ e.jsx("div", { className: "h-4 bg-border/20 rounded skeleton w-32" })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ e.jsx("div", { className: "h-12 bg-border/20 rounded-xl skeleton" }),
            /* @__PURE__ */ e.jsx("div", { className: "h-10 bg-border/20 rounded-xl skeleton" })
          ] })
        ] })
      ]
    },
    f
  ));
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      className: $s(
        n === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4",
        i
      ),
      children: h
    }
  );
}, xn = () => {
  const s = Dt(null);
  return he(() => {
    const n = s.current;
    if (!n) return;
    const i = 50, h = () => {
      const f = document.createElement("div");
      f.className = "star", f.style.position = "absolute", f.style.backgroundColor = "#ffffff", f.style.borderRadius = "50%", f.style.left = Math.random() * 100 + "%", f.style.top = Math.random() * 100 + "%";
      const N = Math.random() * 3 + 1;
      f.style.width = f.style.height = N + "px", f.style.animationDelay = Math.random() * 3 + "s", f.style.animationDuration = Math.random() * 2 + 2 + "s", f.style.pointerEvents = "none", n.appendChild(f);
    };
    n.innerHTML = "";
    for (let f = 0; f < i; f++)
      h();
    const m = () => {
      const N = window.pageYOffset * -0.1;
      n && (n.style.transform = `translateY(${N}px)`);
    };
    return window.addEventListener("scroll", m), () => {
      window.removeEventListener("scroll", m);
    };
  }, []), /* @__PURE__ */ e.jsx("div", { ref: s, className: "stars fixed top-0 left-0 w-full h-full pointer-events-none -z-10", children: " " });
}, Ws = ({
  item: s,
  isActive: n = !1,
  level: i = 0,
  onClick: h
}) => {
  const { title: m, slug: f, type: N, children: g = [] } = s, u = g && g.length > 0, v = `${i * 16 + 8}px`, x = (C) => {
    C.preventDefault(), h && h(f);
  };
  return /* @__PURE__ */ e.jsxs("div", { className: `wiki-nav-item ${n ? "active" : ""}`, style: { paddingLeft: v }, children: [
    /* @__PURE__ */ e.jsxs(
      ze,
      {
        to: `/wiki/${f}`,
        className: `nav-link ${N}`,
        onClick: x,
        children: [
          m,
          u && /* @__PURE__ */ e.jsx("span", { className: "nav-toggle", children: n ? "▼" : "▶" })
        ]
      }
    ),
    u && n && /* @__PURE__ */ e.jsx("div", { className: "nav-children", children: g.map((C, P) => /* @__PURE__ */ e.jsx(
      Ws,
      {
        item: C,
        level: i + 1,
        isActive: n,
        onClick: h
      },
      C.slug
    )) })
  ] });
}, bn = () => {
  const { state: s, removeItem: n, updateQuantity: i, clearCart: h } = Ur(), [m, f] = p(!1), N = (u, v) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: v.toUpperCase()
  }).format(u), g = () => {
    f(!1);
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        onClick: () => f(!m),
        className: "relative p-2 text-text-light hover:text-secondary transition-colors",
        "aria-label": "Shopping Cart",
        children: [
          /* @__PURE__ */ e.jsx(Ne, { className: "w-6 h-6" }),
          s.itemCount > 0 && /* @__PURE__ */ e.jsx("span", { className: "absolute -top-1 -right-1 bg-secondary text-background text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium", children: s.itemCount > 99 ? "99+" : s.itemCount })
        ]
      }
    ),
    m && /* @__PURE__ */ e.jsxs("div", { className: "absolute right-0 top-full mt-2 w-80 bg-background-light rounded-2xl shadow-2xl border border-border/30 z-50 glass-effect", children: [
      /* @__PURE__ */ e.jsx("div", { className: "p-4 border-b border-border/30", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h3", { className: "text-lg font-medium text-text-light", children: "Shopping Cart" }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            onClick: () => f(!1),
            className: "text-text-dark hover:text-text-light transition-colors",
            children: /* @__PURE__ */ e.jsx(ge, { className: "w-5 h-5" })
          }
        )
      ] }) }),
      /* @__PURE__ */ e.jsx("div", { className: "max-h-96 overflow-y-auto", children: s.items.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "p-6 text-center", children: [
        /* @__PURE__ */ e.jsx(Ne, { className: "w-12 h-12 text-text-dark mx-auto mb-3" }),
        /* @__PURE__ */ e.jsx("p", { className: "text-text-dark", children: "Your cart is empty" }),
        /* @__PURE__ */ e.jsx("p", { className: "text-text-dark text-sm", children: "Add some products to get started!" })
      ] }) : /* @__PURE__ */ e.jsx("div", { className: "p-4 space-y-3", children: s.items.map((u) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center space-x-3 p-3 bg-background/30 rounded-xl", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ e.jsx("h4", { className: "text-sm font-medium text-text-light truncate", children: u.title }),
          /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-dark", children: u.format.toUpperCase() }),
          /* @__PURE__ */ e.jsx("p", { className: "text-sm text-secondary font-medium", children: N(u.price, u.currency) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              onClick: () => i(u.id, u.quantity - 1),
              className: "p-1 text-text-dark hover:text-text-light transition-colors",
              "aria-label": "Decrease quantity",
              children: /* @__PURE__ */ e.jsx(Lr, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-sm text-text-light min-w-[2rem] text-center", children: u.quantity }),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              onClick: () => i(u.id, u.quantity + 1),
              className: "p-1 text-text-dark hover:text-text-light transition-colors",
              "aria-label": "Increase quantity",
              children: /* @__PURE__ */ e.jsx(Ee, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              onClick: () => n(u.id),
              className: "p-1 text-error hover:text-error-dark transition-colors",
              "aria-label": "Remove item",
              children: /* @__PURE__ */ e.jsx(et, { className: "w-4 h-4" })
            }
          )
        ] })
      ] }, u.id)) }) }),
      s.items.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "p-4 border-t border-border/30", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-text-light font-medium", children: "Total:" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-xl text-secondary font-bold", children: N(s.total, "USD") })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              onClick: g,
              className: "w-full bg-secondary text-background py-3 px-4 rounded-xl font-medium hover:bg-secondary-dark transition-colors",
              children: "Proceed to Checkout"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              onClick: h,
              className: "w-full bg-background/50 text-text-light py-2 px-4 rounded-xl font-medium hover:bg-background/70 transition-colors border border-border/30",
              children: "Clear Cart"
            }
          )
        ] })
      ] })
    ] }),
    m && /* @__PURE__ */ e.jsx(
      "div",
      {
        className: "fixed inset-0 z-40",
        onClick: () => f(!1)
      }
    )
  ] });
}, Us = "_body_1luq5_11", qs = "_patternShift_1luq5_1", Bs = "_sacredSymbols_1luq5_56", Hs = "_symbol_1luq5_65", Gs = "_floatSymbol_1luq5_1", Vs = "_portalContainer_1luq5_91", Js = "_cornerOrnament_1luq5_139", Ks = "_topLeft_1luq5_159", Zs = "_topRight_1luq5_160", Qs = "_bottomLeft_1luq5_161", Xs = "_bottomRight_1luq5_162", ea = "_header_1luq5_164", ta = "_title_1luq5_169", ra = "_subtitle_1luq5_179", sa = "_sacredQuote_1luq5_188", aa = "_tabContainer_1luq5_201", na = "_tab_1luq5_201", oa = "_activeTab_1luq5_226", ia = "_formContainer_1luq5_248", la = "_activeForm_1luq5_252", da = "_formGroup_1luq5_256", ca = "_formLabel_1luq5_261", ha = "_formInput_1luq5_271", ua = "_passwordStrength_1luq5_297", ma = "_visible_1luq5_308", ga = "_strengthBar_1luq5_312", pa = "_strengthWeak_1luq5_319", fa = "_strengthFair_1luq5_320", xa = "_strengthGood_1luq5_321", ba = "_strengthStrong_1luq5_322", ya = "_strengthText_1luq5_324", va = "_actionBtn_1luq5_332", wa = "_secondaryActions_1luq5_378", ja = "_message_1luq5_413", Na = "_show_1luq5_426", ka = "_success_1luq5_431", _a = "_error_1luq5_437", Ca = "_warning_1luq5_443", Ta = "_loading_1luq5_450", Sa = "_showLoading_1luq5_457", Ea = "_spinner_1luq5_461", Pa = "_spin_1luq5_461", Ya = "_sacredMethods_1luq5_478", Aa = "_sacredTitle_1luq5_483", Fa = "_sacredButtons_1luq5_492", La = "_sacredBtn_1luq5_499", Ma = "_invalid_1luq5_522", Ra = "_valid_1luq5_527", w = {
  body: Us,
  patternShift: qs,
  sacredSymbols: Bs,
  symbol: Hs,
  floatSymbol: Gs,
  portalContainer: Vs,
  cornerOrnament: Js,
  topLeft: Ks,
  topRight: Zs,
  bottomLeft: Qs,
  bottomRight: Xs,
  header: ea,
  title: ta,
  subtitle: ra,
  sacredQuote: sa,
  tabContainer: aa,
  tab: na,
  activeTab: oa,
  formContainer: ia,
  activeForm: la,
  formGroup: da,
  formLabel: ca,
  formInput: ha,
  passwordStrength: ua,
  visible: ma,
  strengthBar: ga,
  strengthWeak: pa,
  strengthFair: fa,
  strengthGood: xa,
  strengthStrong: ba,
  strengthText: ya,
  actionBtn: va,
  secondaryActions: wa,
  message: ja,
  show: Na,
  success: ka,
  error: _a,
  warning: Ca,
  loading: Ta,
  showLoading: Sa,
  spinner: Ea,
  spin: Pa,
  sacredMethods: Ya,
  sacredTitle: Aa,
  sacredButtons: Fa,
  sacredBtn: La,
  invalid: Ma,
  valid: Ra
}, yn = () => {
  const [s, n] = p("login"), [i, h] = p(null), [m, f] = p(!1), [N, g] = p(""), [u, v] = p(""), [x, C] = p(""), [P, Y] = p(""), [T, q] = p(""), [I, R] = p(""), [S, B] = p(null), z = $t(), D = (y, a = "info") => {
    h({ text: y, type: a });
    const _ = setTimeout(() => h(null), 6e3);
    return () => clearTimeout(_);
  }, se = async (y) => {
    if (y.preventDefault(), !N || !u) {
      D("Please enter both email and password", "error");
      return;
    }
    f(!0);
    try {
      const { error: a } = await ae.auth.signInWithPassword({
        email: N,
        password: u
      });
      if (a) throw a;
      D("Login successful! Redirecting...", "success"), z("/");
    } catch (a) {
      const _ = a instanceof Error ? a.message : "Failed to sign in";
      D(_, "error");
    } finally {
      f(!1);
    }
  }, V = async (y) => {
    if (y.preventDefault(), P !== I) {
      D("Passwords do not match", "error");
      return;
    }
    f(!0);
    try {
      const { error: a } = await ae.auth.signUp({
        email: x,
        password: P,
        options: {
          data: {
            display_name: T
          }
        }
      });
      if (a) throw a;
      D("Account created! Please check your email to confirm your account.", "success"), n("login");
    } catch (a) {
      const _ = a instanceof Error ? a.message : "Failed to create account";
      D(_, "error");
    } finally {
      f(!1);
    }
  }, k = (y) => {
    if (!y) {
      B(null);
      return;
    }
    let a = 0;
    y.length >= 8 && a++, /[A-Z]/.test(y) && a++, /[a-z]/.test(y) && a++, /[0-9]/.test(y) && a++, /[^A-Za-z0-9]/.test(y) && a++, y.length >= 12 && a++;
    const _ = [
      { text: "Weak", className: "weak" },
      { text: "Fair", className: "fair" },
      { text: "Good", className: "good" },
      { text: "Strong", className: "strong" },
      { text: "Very Strong", className: "very-strong" }
    ], $ = Math.min(a, _.length - 1);
    B(_[$]);
  }, l = ["☽", "☿", "♃", "⊙", "♆", "⚯", "☯", "✧", "◊", "⬟"];
  return console.log("LoginPage styles object:", w), /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: w.body,
      style: {
        fontFamily: "'Cormorant Garamond', serif",
        background: "linear-gradient(135deg, #8B4513 0%, #CD853F 25%, #DEB887 50%, #F4A460 75%, #D2691E 100%)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999
      },
      children: [
        /* @__PURE__ */ e.jsx("div", { className: w.sacredSymbols, children: Array.from({ length: 12 }, (y, a) => /* @__PURE__ */ e.jsx(
          "div",
          {
            className: w.symbol,
            style: {
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              fontSize: `${1.5 + Math.random()}em`
            },
            children: l[Math.floor(Math.random() * l.length)]
          },
          a
        )) }),
        /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: w.portalContainer,
            style: {
              background: "linear-gradient(145deg, #F5DEB3, #DEB887, #D2B48C)",
              border: "8px solid #8B4513",
              borderRadius: "20px",
              padding: "50px",
              width: "500px",
              maxWidth: "90vw",
              position: "relative",
              zIndex: 10,
              boxShadow: "0 0 50px rgba(139, 69, 19, 0.4), inset 0 0 30px rgba(245, 222, 179, 0.3)",
              maxHeight: "90vh",
              overflowY: "auto"
            },
            children: [
              /* @__PURE__ */ e.jsx("div", { className: `${w.cornerOrnament} ${w.topLeft}` }),
              /* @__PURE__ */ e.jsx("div", { className: `${w.cornerOrnament} ${w.topRight}` }),
              /* @__PURE__ */ e.jsx("div", { className: `${w.cornerOrnament} ${w.bottomLeft}` }),
              /* @__PURE__ */ e.jsx("div", { className: `${w.cornerOrnament} ${w.bottomRight}` }),
              /* @__PURE__ */ e.jsxs("div", { className: w.header, children: [
                /* @__PURE__ */ e.jsx("h1", { className: w.title, children: "Zoroasterverse" }),
                /* @__PURE__ */ e.jsx("p", { className: w.subtitle, children: "Sacred Portal of Ancient Wisdom" })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: w.sacredQuote, children: '"Truth is best (of all that is) good. As desired, what is being desired is truth for him who (represents) the best truth."' }),
              i && /* @__PURE__ */ e.jsx("div", { className: `${w.message} ${w[i.type]} ${w.show}`, children: i.text }),
              /* @__PURE__ */ e.jsxs("div", { className: w.tabContainer, children: [
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    className: `${w.tab} ${s === "login" ? w.activeTab : ""}`,
                    onClick: () => n("login"),
                    type: "button",
                    children: "Sacred Entry"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    className: `${w.tab} ${s === "signup" ? w.activeTab : ""}`,
                    onClick: () => n("signup"),
                    type: "button",
                    children: "Join the Light"
                  }
                )
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: `${w.formContainer} ${s === "login" ? w.activeForm : ""}`, children: /* @__PURE__ */ e.jsxs("form", { onSubmit: se, children: [
                /* @__PURE__ */ e.jsxs("div", { className: w.formGroup, children: [
                  /* @__PURE__ */ e.jsx("label", { className: w.formLabel, htmlFor: "loginEmail", children: "Sacred Email" }),
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      className: w.formInput,
                      type: "email",
                      id: "loginEmail",
                      value: N,
                      onChange: (y) => g(y.target.value),
                      placeholder: "Enter your sacred email",
                      required: !0,
                      disabled: m
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: w.formGroup, children: [
                  /* @__PURE__ */ e.jsx("label", { className: w.formLabel, htmlFor: "loginPassword", children: "Sacred Password" }),
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      className: w.formInput,
                      type: "password",
                      id: "loginPassword",
                      value: u,
                      onChange: (y) => v(y.target.value),
                      placeholder: "Enter your sacred password",
                      required: !0,
                      disabled: m
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "submit",
                    className: w.actionBtn,
                    disabled: m,
                    children: m ? "Entering Sacred Realm..." : "Enter Sacred Realm"
                  }
                ),
                /* @__PURE__ */ e.jsx("div", { className: w.secondaryActions, children: /* @__PURE__ */ e.jsx(ze, { to: "/forgot-password", children: "Forgotten Sacred Words?" }) })
              ] }) }),
              /* @__PURE__ */ e.jsx("div", { className: `${w.formContainer} ${s === "signup" ? w.activeForm : ""}`, children: /* @__PURE__ */ e.jsxs("form", { onSubmit: V, children: [
                /* @__PURE__ */ e.jsxs("div", { className: w.formGroup, children: [
                  /* @__PURE__ */ e.jsx("label", { className: w.formLabel, htmlFor: "signupDisplayName", children: "Sacred Name" }),
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      className: w.formInput,
                      type: "text",
                      id: "signupDisplayName",
                      value: T,
                      onChange: (y) => q(y.target.value),
                      placeholder: "Enter your sacred name",
                      required: !0,
                      disabled: m
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: w.formGroup, children: [
                  /* @__PURE__ */ e.jsx("label", { className: w.formLabel, htmlFor: "signupEmail", children: "Sacred Email" }),
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      className: w.formInput,
                      type: "email",
                      id: "signupEmail",
                      value: x,
                      onChange: (y) => C(y.target.value),
                      placeholder: "your.sacred@email.com",
                      required: !0,
                      disabled: m
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: w.formGroup, children: [
                  /* @__PURE__ */ e.jsx("label", { className: w.formLabel, htmlFor: "signupPassword", children: "Sacred Password" }),
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      className: w.formInput,
                      type: "password",
                      id: "signupPassword",
                      value: P,
                      onChange: (y) => {
                        Y(y.target.value), k(y.target.value);
                      },
                      placeholder: "Create a sacred password",
                      required: !0,
                      disabled: m
                    }
                  ),
                  S && /* @__PURE__ */ e.jsxs("div", { className: `${w.passwordStrength} ${w.visible}`, children: [
                    /* @__PURE__ */ e.jsx("div", { className: `${w.strengthBar} ${w[`strength${S.className.charAt(0).toUpperCase() + S.className.slice(1)}`]}` }),
                    /* @__PURE__ */ e.jsxs("div", { className: w.strengthText, children: [
                      "Sacred Power: ",
                      S.text
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: w.formGroup, children: [
                  /* @__PURE__ */ e.jsx("label", { className: w.formLabel, htmlFor: "confirmPassword", children: "Confirm Sacred Password" }),
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      className: w.formInput,
                      type: "password",
                      id: "confirmPassword",
                      value: I,
                      onChange: (y) => R(y.target.value),
                      placeholder: "Confirm your sacred password",
                      required: !0,
                      disabled: m
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "submit",
                    className: w.actionBtn,
                    disabled: m,
                    children: m ? "Joining Sacred Realm..." : "Join Sacred Realm"
                  }
                )
              ] }) }),
              /* @__PURE__ */ e.jsxs("div", { className: w.sacredMethods, children: [
                /* @__PURE__ */ e.jsx("div", { className: w.sacredTitle, children: "Sacred Methods" }),
                /* @__PURE__ */ e.jsxs("div", { className: w.sacredButtons, children: [
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      className: w.sacredBtn,
                      onClick: () => D("Google sacred connection is not yet available", "warning"),
                      disabled: m,
                      children: "Google Light"
                    }
                  ),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      className: w.sacredBtn,
                      onClick: () => D("GitHub sacred connection is not yet available", "warning"),
                      disabled: m,
                      children: "GitHub Wisdom"
                    }
                  )
                ] })
              ] }),
              m && /* @__PURE__ */ e.jsxs("div", { className: `${w.loading} ${m ? w.showLoading : ""}`, children: [
                /* @__PURE__ */ e.jsx("span", { className: w.spinner }),
                "Connecting to Sacred Realm..."
              ] })
            ]
          }
        )
      ]
    }
  );
}, vn = () => {
  const [s, n] = p([]), [i, h] = p(!0), [m, f] = p(null), [N, g] = p(""), [u, v] = p("all"), [x, C] = p(!1), [P, Y] = p(null), [T, q] = p({
    name: "",
    title: "",
    description: "",
    product_type: "book",
    cover_image_url: "",
    active: !0,
    status: "draft"
  }), [I, R] = p({
    amount: "",
    currency: "USD",
    interval: "",
    nickname: "",
    trial_period_days: 0
  }), S = async () => {
    try {
      h(!0);
      const a = await fetch("/api/products?include_prices=true");
      if (!a.ok) throw new Error("Failed to fetch products");
      const _ = await a.json();
      n(_.products || []);
    } catch (a) {
      f(a instanceof Error ? a.message : "Failed to fetch products");
    } finally {
      h(!1);
    }
  };
  he(() => {
    S();
  }, []);
  const B = s.filter((a) => {
    const _ = a.name.toLowerCase().includes(N.toLowerCase()) || a.title.toLowerCase().includes(N.toLowerCase()), $ = u === "all" || a.product_type === u;
    return _ && $;
  }), z = async (a) => {
    a.preventDefault();
    try {
      const _ = P ? `/api/products/${P.id}` : "/api/products", Z = await fetch(_, {
        method: P ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(T)
      });
      if (!Z.ok) {
        const c = await Z.json();
        throw new Error(c.message || "Failed to save product");
      }
      await S(), V(), C(!1);
    } catch (_) {
      f(_ instanceof Error ? _.message : "Failed to save product");
    }
  }, D = async (a) => {
    if (confirm(`Are you sure you want to delete "${a.name}"? This will deactivate it in Stripe but not permanently delete it.`))
      try {
        if (!(await fetch(`/api/products/${a.id}`, {
          method: "DELETE"
        })).ok) throw new Error("Failed to delete product");
        await S();
      } catch (_) {
        f(_ instanceof Error ? _.message : "Failed to delete product");
      }
  }, se = async (a) => {
    try {
      if (!(await fetch(`/api/products/${a.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !a.active })
      })).ok) throw new Error("Failed to update product");
      await S();
    } catch (_) {
      f(_ instanceof Error ? _.message : "Failed to update product");
    }
  }, V = () => {
    q({
      name: "",
      title: "",
      description: "",
      product_type: "book",
      cover_image_url: "",
      active: !0,
      status: "draft"
    }), Y(null);
  }, k = (a) => {
    Y(a), q({
      name: a.name,
      title: a.title,
      description: a.description,
      product_type: a.product_type,
      cover_image_url: a.cover_image_url || "",
      active: a.active,
      status: a.status
    }), C(!0);
  }, l = (a) => {
    switch (a) {
      case "book":
        return /* @__PURE__ */ e.jsx(be, { className: "w-4 h-4" });
      case "subscription":
        return /* @__PURE__ */ e.jsx(Oe, { className: "w-4 h-4" });
      case "bundle":
        return /* @__PURE__ */ e.jsx(je, { className: "w-4 h-4" });
      default:
        return /* @__PURE__ */ e.jsx(ye, { className: "w-4 h-4" });
    }
  }, y = (a, _) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: _.toUpperCase()
  }).format(a / 100);
  return i ? /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-center min-h-[400px]", children: [
    /* @__PURE__ */ e.jsx(de, { className: "w-8 h-8 animate-spin text-primary" }),
    /* @__PURE__ */ e.jsx("span", { className: "ml-3 text-lg", children: "Loading products..." })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-3", children: [
          /* @__PURE__ */ e.jsx(je, { className: "w-8 h-8 text-primary" }),
          "Product Management"
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-muted-foreground mt-2", children: "Manage your books, subscriptions, and bundles with integrated Stripe pricing" })
      ] }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          onClick: () => {
            V(), C(!0);
          },
          className: "bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center gap-2",
          children: [
            /* @__PURE__ */ e.jsx(Ee, { className: "w-5 h-5" }),
            "Add Product"
          ]
        }
      )
    ] }),
    m && /* @__PURE__ */ e.jsxs("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ e.jsx(Re, { className: "w-5 h-5 text-red-500 flex-shrink-0" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-red-700 dark:text-red-400", children: m }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          onClick: () => f(null),
          className: "ml-auto text-red-500 hover:text-red-600",
          children: /* @__PURE__ */ e.jsx(ge, { className: "w-5 h-5" })
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ e.jsx(Pe, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "text",
            placeholder: "Search products...",
            value: N,
            onChange: (a) => g(a.target.value),
            className: "w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ e.jsx(De, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
        /* @__PURE__ */ e.jsxs(
          "select",
          {
            value: u,
            onChange: (a) => v(a.target.value),
            className: "pl-10 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
            children: [
              /* @__PURE__ */ e.jsx("option", { value: "all", children: "All Types" }),
              /* @__PURE__ */ e.jsx("option", { value: "book", children: "Books" }),
              /* @__PURE__ */ e.jsx("option", { value: "subscription", children: "Subscriptions" }),
              /* @__PURE__ */ e.jsx("option", { value: "bundle", children: "Bundles" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: B.map((a) => /* @__PURE__ */ e.jsxs("div", { className: "bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow", children: [
      /* @__PURE__ */ e.jsx("div", { className: "aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 overflow-hidden", children: a.cover_image_url ? /* @__PURE__ */ e.jsx(
        "img",
        {
          src: a.cover_image_url,
          alt: a.title,
          className: "w-full h-full object-cover"
        }
      ) : /* @__PURE__ */ e.jsx("div", { className: "w-full h-full flex items-center justify-center", children: l(a.product_type) }) }),
      /* @__PURE__ */ e.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ e.jsx("h3", { className: "font-semibold text-foreground line-clamp-2", children: a.title }),
            /* @__PURE__ */ e.jsxs("p", { className: "text-sm text-muted-foreground capitalize flex items-center gap-2 mt-1", children: [
              l(a.product_type),
              a.product_type
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ e.jsx(
            "button",
            {
              onClick: () => se(a),
              className: `p-1.5 rounded-lg transition-colors ${a.active ? "bg-green-100 text-green-600 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`,
              title: a.active ? "Active" : "Inactive",
              children: a.active ? /* @__PURE__ */ e.jsx(ke, { className: "w-4 h-4" }) : /* @__PURE__ */ e.jsx(qt, { className: "w-4 h-4" })
            }
          ) })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-sm text-muted-foreground line-clamp-2", children: a.description || "No description available" }),
        /* @__PURE__ */ e.jsxs("div", { className: "space-y-2", children: [
          a.prices && a.prices.length > 0 ? a.prices.slice(0, 2).map((_) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ e.jsxs("span", { className: "text-muted-foreground", children: [
              _.nickname || "Standard",
              _.interval && ` (${_.interval}ly)`
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "font-medium text-foreground", children: y(_.amount_cents, _.currency) })
          ] }, _.id)) : /* @__PURE__ */ e.jsx("p", { className: "text-sm text-muted-foreground italic", children: "No prices set" }),
          a.prices && a.prices.length > 2 && /* @__PURE__ */ e.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "+",
            a.prices.length - 2,
            " more prices"
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ e.jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${a.status === "published" ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" : a.status === "draft" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"}`, children: a.status }),
          /* @__PURE__ */ e.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(a.updated_at).toLocaleDateString() })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between pt-2 border-t border-border", children: [
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              onClick: () => k(a),
              className: "text-primary hover:text-primary-dark flex items-center gap-2 text-sm font-medium",
              children: [
                /* @__PURE__ */ e.jsx(Je, { className: "w-4 h-4" }),
                "Edit"
              ]
            }
          ),
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              onClick: () => D(a),
              className: "text-red-500 hover:text-red-600 flex items-center gap-2 text-sm font-medium",
              children: [
                /* @__PURE__ */ e.jsx(et, { className: "w-4 h-4" }),
                "Delete"
              ]
            }
          )
        ] })
      ] })
    ] }, a.id)) }),
    B.length === 0 && !i && /* @__PURE__ */ e.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ e.jsx(je, { className: "w-16 h-16 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ e.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "No products found" }),
      /* @__PURE__ */ e.jsx("p", { className: "text-muted-foreground mb-4", children: N || u !== "all" ? "Try adjusting your search or filters" : "Get started by creating your first product" }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          onClick: () => {
            V(), C(!0);
          },
          className: "bg-primary text-white px-6 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors",
          children: "Create Product"
        }
      )
    ] }),
    x && /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ e.jsxs("div", { className: "bg-background rounded-xl shadow-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between p-6 border-b border-border", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-xl font-semibold text-foreground", children: P ? "Edit Product" : "Create Product" }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            onClick: () => {
              C(!1), V();
            },
            className: "text-muted-foreground hover:text-foreground",
            children: /* @__PURE__ */ e.jsx(ge, { className: "w-6 h-6" })
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("form", { onSubmit: z, className: "p-6 space-y-6", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Product Name *" }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "text",
                required: !0,
                value: T.name,
                onChange: (a) => q({ ...T, name: a.target.value }),
                className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                placeholder: "Internal product name"
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Display Title *" }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "text",
                required: !0,
                value: T.title,
                onChange: (a) => q({ ...T, title: a.target.value }),
                className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                placeholder: "Public display title"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Description" }),
          /* @__PURE__ */ e.jsx(
            "textarea",
            {
              value: T.description,
              onChange: (a) => q({ ...T, description: a.target.value }),
              rows: 3,
              className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              placeholder: "Product description..."
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Product Type" }),
            /* @__PURE__ */ e.jsxs(
              "select",
              {
                value: T.product_type,
                onChange: (a) => q({ ...T, product_type: a.target.value }),
                className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                children: [
                  /* @__PURE__ */ e.jsx("option", { value: "book", children: "Book (One-time purchase)" }),
                  /* @__PURE__ */ e.jsx("option", { value: "subscription", children: "Subscription" }),
                  /* @__PURE__ */ e.jsx("option", { value: "bundle", children: "Bundle" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Status" }),
            /* @__PURE__ */ e.jsxs(
              "select",
              {
                value: T.status,
                onChange: (a) => q({ ...T, status: a.target.value }),
                className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                children: [
                  /* @__PURE__ */ e.jsx("option", { value: "draft", children: "Draft" }),
                  /* @__PURE__ */ e.jsx("option", { value: "published", children: "Published" }),
                  /* @__PURE__ */ e.jsx("option", { value: "archived", children: "Archived" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Cover Image URL" }),
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "url",
              value: T.cover_image_url,
              onChange: (a) => q({ ...T, cover_image_url: a.target.value }),
              className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              placeholder: "https://example.com/cover.jpg"
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              id: "active",
              checked: T.active,
              onChange: (a) => q({ ...T, active: a.target.checked }),
              className: "w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            }
          ),
          /* @__PURE__ */ e.jsx("label", { htmlFor: "active", className: "ml-2 text-sm font-medium text-foreground", children: "Product is active (visible to customers)" })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-end gap-3 pt-4 border-t border-border", children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                C(!1), V();
              },
              className: "px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "submit",
              className: "bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2",
              children: [
                /* @__PURE__ */ e.jsx(Bt, { className: "w-4 h-4" }),
                P ? "Update Product" : "Create Product"
              ]
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}, wn = () => {
  const [s, n] = p("orders"), [i, h] = p([]), [m, f] = p([]), [N, g] = p(!0), [u, v] = p(null), [x, C] = p(""), [P, Y] = p("all"), [T, q] = p("all"), [I, R] = p(null), [S, B] = p(null), z = async () => {
    try {
      const c = await fetch("/api/admin/orders?include_details=true");
      if (!c.ok) throw new Error("Failed to fetch orders");
      const L = await c.json();
      h(L.orders || []);
    } catch (c) {
      v(c instanceof Error ? c.message : "Failed to fetch orders");
    }
  }, D = async () => {
    try {
      const c = await fetch("/api/admin/subscriptions?include_details=true");
      if (!c.ok) throw new Error("Failed to fetch subscriptions");
      const L = await c.json();
      f(L.subscriptions || []);
    } catch (c) {
      v(c instanceof Error ? c.message : "Failed to fetch subscriptions");
    }
  }, se = async () => {
    try {
      g(!0), v(null), await Promise.all([z(), D()]);
    } catch {
      v("Failed to fetch data");
    } finally {
      g(!1);
    }
  };
  he(() => {
    se();
  }, []);
  const V = i.filter((c) => {
    var H, K, le, ue, o;
    const L = c.id.toLowerCase().includes(x.toLowerCase()) || ((H = c.customer_email) == null ? void 0 : H.toLowerCase().includes(x.toLowerCase())) || ((le = (K = c.user) == null ? void 0 : K.email) == null ? void 0 : le.toLowerCase().includes(x.toLowerCase())) || ((o = (ue = c.product) == null ? void 0 : ue.title) == null ? void 0 : o.toLowerCase().includes(x.toLowerCase())), te = P === "all" || c.status === P;
    return L && te;
  }), k = m.filter((c) => {
    var H, K;
    const L = c.id.toLowerCase().includes(x.toLowerCase()) || c.provider_subscription_id.toLowerCase().includes(x.toLowerCase()) || ((K = (H = c.user) == null ? void 0 : H.email) == null ? void 0 : K.toLowerCase().includes(x.toLowerCase())), te = T === "all" || c.status === T;
    return L && te;
  }), l = (c, L = "USD") => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: L.toUpperCase()
  }).format(c / 100), y = (c) => new Date(c).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }), a = (c) => {
    switch (c) {
      case "completed":
        return { color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/20", icon: Xe };
      case "pending":
        return { color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/20", icon: Me };
      case "failed":
        return { color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/20", icon: qe };
      case "cancelled":
        return { color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-900/20", icon: qe };
      case "expired":
        return { color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/20", icon: Ke };
      default:
        return { color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-900/20", icon: Me };
    }
  }, _ = (c) => {
    switch (c) {
      case "active":
        return { color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/20", icon: Xe };
      case "trialing":
        return { color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/20", icon: Me };
      case "past_due":
        return { color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/20", icon: Ke };
      case "canceled":
        return { color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/20", icon: qe };
      default:
        return { color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-900/20", icon: Me };
    }
  }, $ = async (c) => {
    if (confirm("Are you sure you want to issue a refund for this order?"))
      try {
        if (!(await fetch(`/api/admin/orders/${c}/refund`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        })).ok) throw new Error("Failed to process refund");
        await z(), R(null);
      } catch (L) {
        v(L instanceof Error ? L.message : "Failed to process refund");
      }
  }, Z = async (c) => {
    if (confirm("Are you sure you want to cancel this subscription?"))
      try {
        if (!(await fetch(`/api/admin/subscriptions/${c}/cancel`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        })).ok) throw new Error("Failed to cancel subscription");
        await D(), B(null);
      } catch (L) {
        v(L instanceof Error ? L.message : "Failed to cancel subscription");
      }
  };
  return N ? /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-center min-h-[400px]", children: [
    /* @__PURE__ */ e.jsx(de, { className: "w-8 h-8 animate-spin text-primary" }),
    /* @__PURE__ */ e.jsx("span", { className: "ml-3 text-lg", children: "Loading orders and subscriptions..." })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-3", children: [
          /* @__PURE__ */ e.jsx(Ne, { className: "w-8 h-8 text-primary" }),
          "Order Management"
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-muted-foreground mt-2", children: "Track and manage customer orders, subscriptions, and payments" })
      ] }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          onClick: se,
          className: "bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center gap-2",
          children: [
            /* @__PURE__ */ e.jsx(de, { className: "w-5 h-5" }),
            "Refresh"
          ]
        }
      )
    ] }),
    u && /* @__PURE__ */ e.jsxs("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ e.jsx(Ke, { className: "w-5 h-5 text-red-500 flex-shrink-0" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-red-700 dark:text-red-400", children: u })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "border-b border-border", children: /* @__PURE__ */ e.jsxs("nav", { className: "-mb-px flex space-x-8", children: [
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          onClick: () => n("orders"),
          className: `py-2 px-1 border-b-2 font-medium text-sm ${s === "orders" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"}`,
          children: [
            "Orders (",
            i.length,
            ")"
          ]
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          onClick: () => n("subscriptions"),
          className: `py-2 px-1 border-b-2 font-medium text-sm ${s === "subscriptions" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"}`,
          children: [
            "Subscriptions (",
            m.length,
            ")"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ e.jsx(Pe, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "text",
            placeholder: `Search ${s}...`,
            value: x,
            onChange: (c) => C(c.target.value),
            className: "w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ e.jsx(De, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
        /* @__PURE__ */ e.jsxs(
          "select",
          {
            value: s === "orders" ? P : T,
            onChange: (c) => {
              s === "orders" ? Y(c.target.value) : q(c.target.value);
            },
            className: "pl-10 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
            children: [
              /* @__PURE__ */ e.jsx("option", { value: "all", children: "All Status" }),
              s === "orders" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                /* @__PURE__ */ e.jsx("option", { value: "completed", children: "Completed" }),
                /* @__PURE__ */ e.jsx("option", { value: "pending", children: "Pending" }),
                /* @__PURE__ */ e.jsx("option", { value: "failed", children: "Failed" }),
                /* @__PURE__ */ e.jsx("option", { value: "cancelled", children: "Cancelled" }),
                /* @__PURE__ */ e.jsx("option", { value: "expired", children: "Expired" })
              ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                /* @__PURE__ */ e.jsx("option", { value: "active", children: "Active" }),
                /* @__PURE__ */ e.jsx("option", { value: "trialing", children: "Trialing" }),
                /* @__PURE__ */ e.jsx("option", { value: "past_due", children: "Past Due" }),
                /* @__PURE__ */ e.jsx("option", { value: "canceled", children: "Canceled" })
              ] })
            ]
          }
        )
      ] })
    ] }),
    s === "orders" && /* @__PURE__ */ e.jsx("div", { className: "space-y-4", children: V.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ e.jsx(Ne, { className: "w-16 h-16 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ e.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "No orders found" }),
      /* @__PURE__ */ e.jsx("p", { className: "text-muted-foreground", children: x || P !== "all" ? "Try adjusting your search or filters" : "Orders will appear here when customers make purchases" })
    ] }) : /* @__PURE__ */ e.jsx("div", { className: "grid gap-4", children: V.map((c) => {
      var H, K;
      const L = a(c.status), te = L.icon;
      return /* @__PURE__ */ e.jsx("div", { className: "bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-start justify-between", children: /* @__PURE__ */ e.jsxs("div", { className: "flex-1 space-y-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ e.jsxs("h3", { className: "text-lg font-semibold text-foreground", children: [
              "Order #",
              c.id.slice(-8)
            ] }),
            /* @__PURE__ */ e.jsxs("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${L.bg} ${L.color}`, children: [
              /* @__PURE__ */ e.jsx(te, { className: "w-3 h-3 mr-1" }),
              c.status
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ e.jsx("p", { className: "text-lg font-bold text-foreground", children: l(c.amount_cents, c.currency) }),
            /* @__PURE__ */ e.jsx("p", { className: "text-sm text-muted-foreground", children: y(c.created_at) })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(St, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ e.jsx("span", { className: "text-foreground", children: c.customer_email || ((H = c.user) == null ? void 0 : H.email) || "No email" })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(je, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ e.jsx("span", { className: "text-foreground", children: ((K = c.product) == null ? void 0 : K.title) || "Unknown Product" })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(Et, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ e.jsxs("span", { className: "text-foreground capitalize", children: [
              c.provider,
              " Payment"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between pt-3 border-t border-border", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                onClick: () => R(c),
                className: "text-primary hover:text-primary-dark flex items-center gap-2 text-sm font-medium",
                children: [
                  /* @__PURE__ */ e.jsx(ke, { className: "w-4 h-4" }),
                  "View Details"
                ]
              }
            ),
            c.status === "completed" && /* @__PURE__ */ e.jsxs(
              "button",
              {
                onClick: () => $(c.id),
                className: "text-orange-600 hover:text-orange-700 flex items-center gap-2 text-sm font-medium",
                children: [
                  /* @__PURE__ */ e.jsx(ht, { className: "w-4 h-4" }),
                  "Refund"
                ]
              }
            )
          ] }),
          c.provider_payment_intent_id && /* @__PURE__ */ e.jsxs(
            "button",
            {
              onClick: () => window.open(`https://dashboard.stripe.com/payments/${c.provider_payment_intent_id}`, "_blank"),
              className: "text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm",
              children: [
                /* @__PURE__ */ e.jsx(Pt, { className: "w-4 h-4" }),
                "View in Stripe"
              ]
            }
          )
        ] })
      ] }) }) }, c.id);
    }) }) }),
    s === "subscriptions" && /* @__PURE__ */ e.jsx("div", { className: "space-y-4", children: k.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ e.jsx(Oe, { className: "w-16 h-16 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ e.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "No subscriptions found" }),
      /* @__PURE__ */ e.jsx("p", { className: "text-muted-foreground", children: x || T !== "all" ? "Try adjusting your search or filters" : "Subscriptions will appear here when customers subscribe" })
    ] }) : /* @__PURE__ */ e.jsx("div", { className: "grid gap-4", children: k.map((c) => {
      var H, K;
      const L = _(c.status), te = L.icon;
      return /* @__PURE__ */ e.jsx("div", { className: "bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-start justify-between", children: /* @__PURE__ */ e.jsxs("div", { className: "flex-1 space-y-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ e.jsxs("h3", { className: "text-lg font-semibold text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ e.jsx(Oe, { className: "w-5 h-5 text-primary" }),
              "Subscription #",
              c.id.slice(-8)
            ] }),
            /* @__PURE__ */ e.jsxs("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${L.bg} ${L.color}`, children: [
              /* @__PURE__ */ e.jsx(te, { className: "w-3 h-3 mr-1" }),
              c.status
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ e.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "Created ",
              y(c.created_at)
            ] }),
            c.current_period_end && /* @__PURE__ */ e.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "Next billing: ",
              y(c.current_period_end)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(St, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ e.jsx("span", { className: "text-foreground", children: ((H = c.user) == null ? void 0 : H.email) || "No email" })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(dt, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ e.jsxs("span", { className: "text-foreground", children: [
              ((K = c.plan) == null ? void 0 : K.interval) || "Unknown",
              " billing"
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ e.jsx(Et, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ e.jsxs("span", { className: "text-foreground capitalize", children: [
              c.provider,
              " Subscription"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between pt-3 border-t border-border", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                onClick: () => B(c),
                className: "text-primary hover:text-primary-dark flex items-center gap-2 text-sm font-medium",
                children: [
                  /* @__PURE__ */ e.jsx(ke, { className: "w-4 h-4" }),
                  "View Details"
                ]
              }
            ),
            c.status === "active" && !c.cancel_at_period_end && /* @__PURE__ */ e.jsxs(
              "button",
              {
                onClick: () => Z(c.id),
                className: "text-red-600 hover:text-red-700 flex items-center gap-2 text-sm font-medium",
                children: [
                  /* @__PURE__ */ e.jsx(qe, { className: "w-4 h-4" }),
                  "Cancel"
                ]
              }
            )
          ] }),
          c.provider_subscription_id && /* @__PURE__ */ e.jsxs(
            "button",
            {
              onClick: () => window.open(`https://dashboard.stripe.com/subscriptions/${c.provider_subscription_id}`, "_blank"),
              className: "text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm",
              children: [
                /* @__PURE__ */ e.jsx(Pt, { className: "w-4 h-4" }),
                "View in Stripe"
              ]
            }
          )
        ] })
      ] }) }) }, c.id);
    }) }) })
  ] });
}, jn = () => {
  const [s, n] = p([]), [i, h] = p(null), [m, f] = p(!0), [N, g] = p(null), [u, v] = p(""), [x, C] = p("all"), [P, Y] = p("sales"), [T, q] = p("desc"), I = async () => {
    try {
      const l = await fetch("/api/admin/inventory");
      if (!l.ok) throw new Error("Failed to fetch inventory data");
      const y = await l.json();
      n(y.inventory || []);
    } catch (l) {
      g(l instanceof Error ? l.message : "Failed to fetch inventory");
    }
  }, R = async () => {
    try {
      const l = await fetch("/api/admin/metrics");
      if (!l.ok) throw new Error("Failed to fetch metrics");
      const y = await l.json();
      h(y.metrics);
    } catch (l) {
      g(l instanceof Error ? l.message : "Failed to fetch metrics");
    }
  }, S = async () => {
    try {
      f(!0), g(null), await Promise.all([I(), R()]);
    } catch {
      g("Failed to fetch data");
    } finally {
      f(!1);
    }
  };
  he(() => {
    S();
  }, []);
  const B = s.filter((l) => {
    const y = l.product.name.toLowerCase().includes(u.toLowerCase()) || l.product.title.toLowerCase().includes(u.toLowerCase()), a = x === "all" || l.product.product_type === x;
    return y && a;
  }).sort((l, y) => {
    let a, _;
    switch (P) {
      case "name":
        a = l.product.title.toLowerCase(), _ = y.product.title.toLowerCase();
        break;
      case "sales":
        a = l.total_sales, _ = y.total_sales;
        break;
      case "revenue":
        a = l.revenue, _ = y.revenue;
        break;
      case "recent_activity":
        a = l.last_sale ? new Date(l.last_sale).getTime() : 0, _ = y.last_sale ? new Date(y.last_sale).getTime() : 0;
        break;
      default:
        a = l.total_sales, _ = y.total_sales;
    }
    return T === "asc" ? a > _ ? 1 : -1 : a < _ ? 1 : -1;
  }), z = (l) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(l), D = (l) => `${l >= 0 ? "+" : ""}${l.toFixed(1)}%`, se = (l) => new Date(l).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }), V = (l) => {
    switch (l) {
      case "book":
        return /* @__PURE__ */ e.jsx(be, { className: "w-4 h-4" });
      case "subscription":
        return /* @__PURE__ */ e.jsx(Oe, { className: "w-4 h-4" });
      case "bundle":
        return /* @__PURE__ */ e.jsx(Be, { className: "w-4 h-4" });
      default:
        return /* @__PURE__ */ e.jsx(ye, { className: "w-4 h-4" });
    }
  }, k = (l, y) => {
    const a = y > 0 ? (l - y) / y * 100 : 0;
    return a > 10 ? { icon: Se, color: "text-green-600", bg: "bg-green-100" } : a < -10 ? { icon: He, color: "text-red-600", bg: "bg-red-100" } : { icon: Ve, color: "text-yellow-600", bg: "bg-yellow-100" };
  };
  return m ? /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-center min-h-[400px]", children: [
    /* @__PURE__ */ e.jsx(de, { className: "w-8 h-8 animate-spin text-primary" }),
    /* @__PURE__ */ e.jsx("span", { className: "ml-3 text-lg", children: "Loading inventory data..." })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-3", children: [
          /* @__PURE__ */ e.jsx(Be, { className: "w-8 h-8 text-primary" }),
          "Inventory Management"
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-muted-foreground mt-2", children: "Track digital product performance, sales analytics, and inventory metrics" })
      ] }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          onClick: S,
          className: "bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center gap-2",
          children: [
            /* @__PURE__ */ e.jsx(de, { className: "w-5 h-5" }),
            "Refresh Data"
          ]
        }
      )
    ] }),
    N && /* @__PURE__ */ e.jsxs("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ e.jsx(Ke, { className: "w-5 h-5 text-red-500 flex-shrink-0" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-red-700 dark:text-red-400", children: N })
    ] }),
    i && /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ e.jsx("div", { className: "bg-card border border-border rounded-xl p-6", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Total Revenue" }),
          /* @__PURE__ */ e.jsx("p", { className: "text-2xl font-bold text-foreground", children: z(i.total_revenue) }),
          /* @__PURE__ */ e.jsxs("p", { className: `text-sm flex items-center gap-1 mt-1 ${i.revenue_growth >= 0 ? "text-green-600" : "text-red-600"}`, children: [
            i.revenue_growth >= 0 ? /* @__PURE__ */ e.jsx(Se, { className: "w-4 h-4" }) : /* @__PURE__ */ e.jsx(He, { className: "w-4 h-4" }),
            D(i.revenue_growth),
            " this month"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ e.jsx(ht, { className: "w-6 h-6 text-green-600" }) })
      ] }) }),
      /* @__PURE__ */ e.jsx("div", { className: "bg-card border border-border rounded-xl p-6", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Total Sales" }),
          /* @__PURE__ */ e.jsx("p", { className: "text-2xl font-bold text-foreground", children: i.total_sales.toLocaleString() }),
          /* @__PURE__ */ e.jsxs("p", { className: `text-sm flex items-center gap-1 mt-1 ${i.sales_growth >= 0 ? "text-green-600" : "text-red-600"}`, children: [
            i.sales_growth >= 0 ? /* @__PURE__ */ e.jsx(Se, { className: "w-4 h-4" }) : /* @__PURE__ */ e.jsx(He, { className: "w-4 h-4" }),
            D(i.sales_growth),
            " this month"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ e.jsx(Ve, { className: "w-6 h-6 text-blue-600" }) })
      ] }) }),
      /* @__PURE__ */ e.jsx("div", { className: "bg-card border border-border rounded-xl p-6", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Active Subscriptions" }),
          /* @__PURE__ */ e.jsx("p", { className: "text-2xl font-bold text-foreground", children: i.active_subscriptions.toLocaleString() }),
          /* @__PURE__ */ e.jsxs("p", { className: `text-sm flex items-center gap-1 mt-1 ${i.subscription_growth >= 0 ? "text-green-600" : "text-red-600"}`, children: [
            i.subscription_growth >= 0 ? /* @__PURE__ */ e.jsx(Se, { className: "w-4 h-4" }) : /* @__PURE__ */ e.jsx(He, { className: "w-4 h-4" }),
            D(i.subscription_growth),
            " this month"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ e.jsx(Oe, { className: "w-6 h-6 text-purple-600" }) })
      ] }) }),
      /* @__PURE__ */ e.jsx("div", { className: "bg-card border border-border rounded-xl p-6", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Total Products" }),
          /* @__PURE__ */ e.jsx("p", { className: "text-2xl font-bold text-foreground", children: i.total_products }),
          /* @__PURE__ */ e.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
            i.total_books,
            " books, ",
            i.total_subscriptions,
            " subscriptions"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ e.jsx(Be, { className: "w-6 h-6 text-orange-600" }) })
      ] }) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col lg:flex-row gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ e.jsx(Pe, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "text",
            placeholder: "Search products...",
            value: u,
            onChange: (l) => v(l.target.value),
            className: "w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ e.jsx(De, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
          /* @__PURE__ */ e.jsxs(
            "select",
            {
              value: x,
              onChange: (l) => C(l.target.value),
              className: "pl-10 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              children: [
                /* @__PURE__ */ e.jsx("option", { value: "all", children: "All Types" }),
                /* @__PURE__ */ e.jsx("option", { value: "book", children: "Books" }),
                /* @__PURE__ */ e.jsx("option", { value: "subscription", children: "Subscriptions" }),
                /* @__PURE__ */ e.jsx("option", { value: "bundle", children: "Bundles" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs(
          "select",
          {
            value: `${P}-${T}`,
            onChange: (l) => {
              const [y, a] = l.target.value.split("-");
              Y(y), q(a);
            },
            className: "px-3 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
            children: [
              /* @__PURE__ */ e.jsx("option", { value: "sales-desc", children: "Sales (High to Low)" }),
              /* @__PURE__ */ e.jsx("option", { value: "sales-asc", children: "Sales (Low to High)" }),
              /* @__PURE__ */ e.jsx("option", { value: "revenue-desc", children: "Revenue (High to Low)" }),
              /* @__PURE__ */ e.jsx("option", { value: "revenue-asc", children: "Revenue (Low to High)" }),
              /* @__PURE__ */ e.jsx("option", { value: "name-asc", children: "Name (A-Z)" }),
              /* @__PURE__ */ e.jsx("option", { value: "name-desc", children: "Name (Z-A)" }),
              /* @__PURE__ */ e.jsx("option", { value: "recent_activity-desc", children: "Most Recent Activity" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "bg-card border border-border rounded-xl overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ e.jsxs("table", { className: "w-full", children: [
      /* @__PURE__ */ e.jsx("thead", { className: "bg-muted/50 border-b border-border", children: /* @__PURE__ */ e.jsxs("tr", { children: [
        /* @__PURE__ */ e.jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Product" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Type" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Total Sales" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Recent Sales (30d)" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Revenue" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Performance" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Last Sale" }),
        /* @__PURE__ */ e.jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ e.jsx("tbody", { className: "divide-y divide-border", children: B.length === 0 ? /* @__PURE__ */ e.jsx("tr", { children: /* @__PURE__ */ e.jsxs("td", { colSpan: 8, className: "px-6 py-12 text-center", children: [
        /* @__PURE__ */ e.jsx(Be, { className: "w-12 h-12 text-muted-foreground mx-auto mb-3" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-lg font-medium text-foreground mb-1", children: "No products found" }),
        /* @__PURE__ */ e.jsx("p", { className: "text-muted-foreground", children: u || x !== "all" ? "Try adjusting your search or filters" : "Products will appear here once they have sales data" })
      ] }) }) : B.map((l) => {
        const y = k(l.recent_sales, l.total_sales - l.recent_sales), a = y.icon;
        return /* @__PURE__ */ e.jsxs("tr", { className: "hover:bg-muted/30", children: [
          /* @__PURE__ */ e.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center", children: /* @__PURE__ */ e.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ e.jsx("div", { className: "text-sm font-medium text-foreground", children: l.product.title }),
            /* @__PURE__ */ e.jsx("div", { className: "text-sm text-muted-foreground", children: l.product.name })
          ] }) }) }),
          /* @__PURE__ */ e.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
            V(l.product.product_type),
            /* @__PURE__ */ e.jsx("span", { className: "text-sm text-foreground capitalize", children: l.product.product_type })
          ] }) }),
          /* @__PURE__ */ e.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ e.jsx("div", { className: "text-sm font-medium text-foreground", children: l.total_sales.toLocaleString() }) }),
          /* @__PURE__ */ e.jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ e.jsx("div", { className: "text-sm font-medium text-foreground", children: l.recent_sales.toLocaleString() }),
            l.downloads && /* @__PURE__ */ e.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              l.downloads.toLocaleString(),
              " downloads"
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ e.jsx("div", { className: "text-sm font-medium text-foreground", children: z(l.revenue) }),
            /* @__PURE__ */ e.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              z(l.revenue_recent),
              " recent"
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ e.jsxs("div", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${y.bg} ${y.color}`, children: [
              /* @__PURE__ */ e.jsx(a, { className: "w-3 h-3 mr-1" }),
              l.recent_sales > l.total_sales - l.recent_sales ? "Growing" : l.recent_sales < (l.total_sales - l.recent_sales) / 2 ? "Declining" : "Stable"
            ] }),
            l.active_subscriptions !== void 0 && /* @__PURE__ */ e.jsxs("div", { className: "text-xs text-muted-foreground mt-1", children: [
              l.active_subscriptions,
              " active subs"
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ e.jsx("div", { className: "text-sm text-foreground", children: l.last_sale ? se(l.last_sale) : "Never" }) }),
          /* @__PURE__ */ e.jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ e.jsx("button", { className: "text-primary hover:text-primary-dark p-1", children: /* @__PURE__ */ e.jsx(ke, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ e.jsx("button", { className: "text-muted-foreground hover:text-foreground p-1", children: /* @__PURE__ */ e.jsx(Ve, { className: "w-4 h-4" }) })
          ] }) })
        ] }, l.id);
      }) })
    ] }) }) })
  ] });
}, Nn = () => {
  const [s, n] = p([]), [i, h] = p([]), [m, f] = p(!0), [N, g] = p(null), [u, v] = p("works"), [x, C] = p(""), [P, Y] = p("all"), [T, q] = p("all"), [I, R] = p(!1), [S, B] = p(null), [z, D] = p(null), [se, V] = p(!1), [k, l] = p({
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
  }), y = async () => {
    try {
      const r = await fetch("/api/admin/works?include_stats=true");
      if (!r.ok) throw new Error("Failed to fetch works");
      const j = await r.json();
      n(j.works || []);
    } catch (r) {
      g(r instanceof Error ? r.message : "Failed to fetch works");
    }
  }, a = async (r) => {
    try {
      const j = r ? `/api/admin/chapters?work_id=${r}` : "/api/admin/chapters", U = await fetch(j);
      if (!U.ok) throw new Error("Failed to fetch chapters");
      const X = await U.json();
      h(X.chapters || []);
    } catch (j) {
      g(j instanceof Error ? j.message : "Failed to fetch chapters");
    }
  };
  he(() => {
    (async () => {
      f(!0), g(null);
      try {
        await Promise.all([y(), a()]);
      } catch {
        g("Failed to load data");
      } finally {
        f(!1);
      }
    })();
  }, []);
  const _ = s.filter((r) => {
    var oe;
    const j = r.title.toLowerCase().includes(x.toLowerCase()) || ((oe = r.description) == null ? void 0 : oe.toLowerCase().includes(x.toLowerCase())), U = P === "all" || r.status === P, X = T === "all" || r.type === T;
    return j && U && X;
  }), $ = z ? i.filter((r) => r.work_id === z.id) : i, Z = async (r) => {
    r.preventDefault();
    try {
      const j = S ? `/api/admin/works/${S.id}` : "/api/admin/works", X = await fetch(j, {
        method: S ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...k,
          progress_percentage: k.progress_percentage || 0,
          target_word_count: k.target_word_count || null
        })
      });
      if (!X.ok) {
        const oe = await X.json();
        throw new Error(oe.message || "Failed to save work");
      }
      await y(), c(), R(!1);
    } catch (j) {
      g(j instanceof Error ? j.message : "Failed to save work");
    }
  }, c = () => {
    l({
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
    }), B(null);
  }, L = (r) => {
    B(r), l({
      title: r.title,
      type: r.type,
      parent_id: r.parent_id,
      description: r.description || "",
      status: r.status,
      progress_percentage: r.progress_percentage || 0,
      release_date: r.release_date || "",
      estimated_release: r.estimated_release || "",
      cover_image_url: r.cover_image_url || "",
      is_featured: r.is_featured,
      is_premium: r.is_premium,
      is_free: r.is_free,
      target_word_count: r.target_word_count
    }), R(!0);
  }, te = async (r) => {
    if (confirm(`Are you sure you want to delete "${r.title}"? This will also delete all associated chapters.`))
      try {
        if (!(await fetch(`/api/admin/works/${r.id}`, {
          method: "DELETE"
        })).ok) throw new Error("Failed to delete work");
        await y(), (z == null ? void 0 : z.id) === r.id && D(null);
      } catch (j) {
        g(j instanceof Error ? j.message : "Failed to delete work");
      }
  }, H = async (r, j) => {
    try {
      if (!(await fetch(`/api/admin/works/${r.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [j]: !r[j] })
      })).ok) throw new Error("Failed to update work");
      await y();
    } catch (U) {
      g(U instanceof Error ? U.message : "Failed to update work");
    }
  }, K = async (r) => {
    try {
      if (!(await fetch(`/api/admin/chapters/${r.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !r.is_published })
      })).ok) throw new Error("Failed to update chapter");
      await a(z == null ? void 0 : z.id);
    } catch (j) {
      g(j instanceof Error ? j.message : "Failed to update chapter");
    }
  }, le = (r) => {
    switch (r) {
      case "published":
        return { color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/20", icon: Xe };
      case "writing":
        return { color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/20", icon: Je };
      case "editing":
        return { color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/20", icon: ct };
      case "planning":
        return { color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/20", icon: Rr };
      case "on_hold":
        return { color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-900/20", icon: Mr };
      default:
        return { color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-900/20", icon: Me };
    }
  }, ue = (r) => {
    switch (r) {
      case "book":
        return /* @__PURE__ */ e.jsx(be, { className: "w-4 h-4" });
      case "volume":
        return /* @__PURE__ */ e.jsx(Ze, { className: "w-4 h-4" });
      case "saga":
        return /* @__PURE__ */ e.jsx(Or, { className: "w-4 h-4" });
      case "arc":
        return /* @__PURE__ */ e.jsx(Se, { className: "w-4 h-4" });
      case "issue":
        return /* @__PURE__ */ e.jsx(ye, { className: "w-4 h-4" });
      default:
        return /* @__PURE__ */ e.jsx(be, { className: "w-4 h-4" });
    }
  }, o = (r) => new Date(r).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  return m ? /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-center min-h-[400px]", children: [
    /* @__PURE__ */ e.jsx(de, { className: "w-8 h-8 animate-spin text-primary" }),
    /* @__PURE__ */ e.jsx("span", { className: "ml-3 text-lg", children: "Loading works and chapters..." })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-3", children: [
          /* @__PURE__ */ e.jsx(be, { className: "w-8 h-8 text-primary" }),
          "Works Management"
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-muted-foreground mt-2", children: "Create and manage your literary works, upload chapters for subscribers, and showcase in library" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            onClick: () => V(!0),
            className: "bg-secondary text-white px-6 py-3 rounded-xl font-medium hover:bg-secondary-dark transition-colors flex items-center gap-2",
            children: [
              /* @__PURE__ */ e.jsx(xe, { className: "w-5 h-5" }),
              "Upload Chapter"
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            onClick: () => {
              c(), R(!0);
            },
            className: "bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center gap-2",
            children: [
              /* @__PURE__ */ e.jsx(Ee, { className: "w-5 h-5" }),
              "New Work"
            ]
          }
        )
      ] })
    ] }),
    N && /* @__PURE__ */ e.jsxs("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ e.jsx(Re, { className: "w-5 h-5 text-red-500 flex-shrink-0" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-red-700 dark:text-red-400", children: N }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          onClick: () => g(null),
          className: "ml-auto text-red-500 hover:text-red-600",
          children: /* @__PURE__ */ e.jsx(ge, { className: "w-5 h-5" })
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "border-b border-border", children: /* @__PURE__ */ e.jsxs("nav", { className: "-mb-px flex space-x-8", children: [
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          onClick: () => {
            v("works"), D(null);
          },
          className: `py-2 px-1 border-b-2 font-medium text-sm ${u === "works" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"}`,
          children: [
            "Works (",
            s.length,
            ")"
          ]
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          onClick: () => v("chapters"),
          className: `py-2 px-1 border-b-2 font-medium text-sm ${u === "chapters" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"}`,
          children: [
            "Chapters (",
            i.length,
            ")"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col lg:flex-row gap-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ e.jsx(Pe, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "text",
            placeholder: `Search ${u}...`,
            value: x,
            onChange: (r) => C(r.target.value),
            className: "w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          }
        )
      ] }),
      u === "works" && /* @__PURE__ */ e.jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ e.jsx(De, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
          /* @__PURE__ */ e.jsxs(
            "select",
            {
              value: P,
              onChange: (r) => Y(r.target.value),
              className: "pl-10 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              children: [
                /* @__PURE__ */ e.jsx("option", { value: "all", children: "All Status" }),
                /* @__PURE__ */ e.jsx("option", { value: "planning", children: "Planning" }),
                /* @__PURE__ */ e.jsx("option", { value: "writing", children: "Writing" }),
                /* @__PURE__ */ e.jsx("option", { value: "editing", children: "Editing" }),
                /* @__PURE__ */ e.jsx("option", { value: "published", children: "Published" }),
                /* @__PURE__ */ e.jsx("option", { value: "on_hold", children: "On Hold" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs(
          "select",
          {
            value: T,
            onChange: (r) => q(r.target.value),
            className: "px-3 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
            children: [
              /* @__PURE__ */ e.jsx("option", { value: "all", children: "All Types" }),
              /* @__PURE__ */ e.jsx("option", { value: "book", children: "Books" }),
              /* @__PURE__ */ e.jsx("option", { value: "volume", children: "Volumes" }),
              /* @__PURE__ */ e.jsx("option", { value: "saga", children: "Sagas" }),
              /* @__PURE__ */ e.jsx("option", { value: "arc", children: "Arcs" }),
              /* @__PURE__ */ e.jsx("option", { value: "issue", children: "Issues" })
            ]
          }
        )
      ] })
    ] }),
    u === "works" && /* @__PURE__ */ e.jsx("div", { className: "space-y-4", children: _.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ e.jsx(be, { className: "w-16 h-16 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ e.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "No works found" }),
      /* @__PURE__ */ e.jsx("p", { className: "text-muted-foreground mb-4", children: x || P !== "all" || T !== "all" ? "Try adjusting your search or filters" : "Create your first work to get started" }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          onClick: () => {
            c(), R(!0);
          },
          className: "bg-primary text-white px-6 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors",
          children: "Create First Work"
        }
      )
    ] }) : /* @__PURE__ */ e.jsx("div", { className: "grid gap-4", children: _.map((r) => {
      const j = le(r.status), U = j.icon;
      return /* @__PURE__ */ e.jsx("div", { className: "bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex-1 space-y-3", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                ue(r.type),
                /* @__PURE__ */ e.jsx("h3", { className: "text-lg font-semibold text-foreground", children: r.title })
              ] }),
              /* @__PURE__ */ e.jsxs("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${j.bg} ${j.color}`, children: [
                /* @__PURE__ */ e.jsx(U, { className: "w-3 h-3 mr-1" }),
                r.status
              ] }),
              r.is_featured && /* @__PURE__ */ e.jsx(Yt, { className: "w-4 h-4 text-yellow-500 fill-current" })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "text-right text-sm text-muted-foreground", children: [
              /* @__PURE__ */ e.jsxs("p", { children: [
                "Updated ",
                o(r.updated_at)
              ] }),
              r.chapters_count && /* @__PURE__ */ e.jsxs("p", { children: [
                r.published_chapters,
                "/",
                r.chapters_count,
                " chapters published"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 text-sm", children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-muted-foreground", children: "Type:" }),
              /* @__PURE__ */ e.jsx("span", { className: "ml-2 text-foreground capitalize", children: r.type })
            ] }),
            r.progress_percentage !== void 0 && /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-muted-foreground", children: "Progress:" }),
              /* @__PURE__ */ e.jsxs("span", { className: "ml-2 text-foreground", children: [
                r.progress_percentage,
                "%"
              ] })
            ] }),
            r.word_count && /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-muted-foreground", children: "Words:" }),
              /* @__PURE__ */ e.jsxs("span", { className: "ml-2 text-foreground", children: [
                r.word_count.toLocaleString(),
                r.target_word_count && ` / ${r.target_word_count.toLocaleString()}`
              ] })
            ] }),
            r.rating && /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-muted-foreground", children: "Rating:" }),
              /* @__PURE__ */ e.jsxs("span", { className: "ml-2 text-foreground", children: [
                r.rating.toFixed(1),
                " ⭐ (",
                r.reviews_count,
                ")"
              ] })
            ] })
          ] }),
          r.description && /* @__PURE__ */ e.jsx("p", { className: "text-sm text-muted-foreground line-clamp-2", children: r.description }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex gap-6 text-sm", children: [
            r.release_date && /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-muted-foreground", children: "Released:" }),
              /* @__PURE__ */ e.jsx("span", { className: "ml-2 text-foreground", children: o(r.release_date) })
            ] }),
            r.estimated_release && !r.release_date && /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-muted-foreground", children: "Est. Release:" }),
              /* @__PURE__ */ e.jsx("span", { className: "ml-2 text-foreground", children: r.estimated_release })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                onClick: () => H(r, "is_featured"),
                className: `flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${r.is_featured ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"}`,
                children: [
                  /* @__PURE__ */ e.jsx(Yt, { className: "w-3 h-3" }),
                  "Featured"
                ]
              }
            ),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                onClick: () => H(r, "is_premium"),
                className: `flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${r.is_premium ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"}`,
                children: "Premium"
              }
            ),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                onClick: () => H(r, "is_free"),
                className: `flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${r.is_free ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"}`,
                children: "Free"
              }
            )
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex items-center justify-between pt-3 border-t border-border", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                onClick: () => L(r),
                className: "text-primary hover:text-primary-dark flex items-center gap-2 text-sm font-medium",
                children: [
                  /* @__PURE__ */ e.jsx(Je, { className: "w-4 h-4" }),
                  "Edit"
                ]
              }
            ),
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                onClick: () => {
                  D(r), v("chapters"), a(r.id);
                },
                className: "text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm font-medium",
                children: [
                  /* @__PURE__ */ e.jsx(Ze, { className: "w-4 h-4" }),
                  "Chapters (",
                  r.chapters_count || 0,
                  ")"
                ]
              }
            ),
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                onClick: () => te(r),
                className: "text-red-500 hover:text-red-600 flex items-center gap-2 text-sm font-medium",
                children: [
                  /* @__PURE__ */ e.jsx(et, { className: "w-4 h-4" }),
                  "Delete"
                ]
              }
            )
          ] }) })
        ] }),
        r.cover_image_url && /* @__PURE__ */ e.jsx("div", { className: "ml-4 flex-shrink-0", children: /* @__PURE__ */ e.jsx(
          "img",
          {
            src: r.cover_image_url,
            alt: r.title,
            className: "w-16 h-20 object-cover rounded-lg border border-border"
          }
        ) })
      ] }) }, r.id);
    }) }) }),
    u === "chapters" && /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
      z && /* @__PURE__ */ e.jsx("div", { className: "bg-primary/5 border border-primary/20 rounded-xl p-4", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsxs("h3", { className: "font-semibold text-foreground", children: [
            "Chapters for: ",
            z.title
          ] }),
          /* @__PURE__ */ e.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            $.length,
            " chapters • ",
            $.filter((r) => r.is_published).length,
            " published"
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            onClick: () => V(!0),
            className: "bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2",
            children: [
              /* @__PURE__ */ e.jsx(Ee, { className: "w-4 h-4" }),
              "Add Chapter"
            ]
          }
        )
      ] }) }),
      $.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ e.jsx(ye, { className: "w-16 h-16 text-muted-foreground mx-auto mb-4" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "No chapters found" }),
        /* @__PURE__ */ e.jsx("p", { className: "text-muted-foreground mb-4", children: z ? `No chapters uploaded for "${z.title}" yet` : "Select a work to view its chapters or upload new content" })
      ] }) : /* @__PURE__ */ e.jsx("div", { className: "grid gap-3", children: $.sort((r, j) => r.chapter_number - j.chapter_number).map((r) => /* @__PURE__ */ e.jsxs("div", { className: "bg-card border border-border rounded-lg p-4 flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ e.jsxs("span", { className: "text-sm font-mono text-muted-foreground", children: [
              "Ch. ",
              r.chapter_number
            ] }),
            /* @__PURE__ */ e.jsx("h4", { className: "font-medium text-foreground", children: r.title }),
            /* @__PURE__ */ e.jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${r.is_published ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400"}`, children: r.is_published ? "Published" : "Draft" })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-4 mt-2 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ e.jsxs("span", { children: [
              "Updated ",
              o(r.updated_at)
            ] }),
            r.word_count && /* @__PURE__ */ e.jsxs("span", { children: [
              r.word_count.toLocaleString(),
              " words"
            ] }),
            r.estimated_read_time && /* @__PURE__ */ e.jsxs("span", { children: [
              r.estimated_read_time,
              " min read"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              onClick: () => K(r),
              className: `p-2 rounded-lg transition-colors ${r.is_published ? "text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}`,
              title: r.is_published ? "Unpublish chapter" : "Publish chapter",
              children: r.is_published ? /* @__PURE__ */ e.jsx(ke, { className: "w-4 h-4" }) : /* @__PURE__ */ e.jsx(qt, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ e.jsx("button", { className: "p-2 text-primary hover:bg-primary/10 rounded-lg", children: /* @__PURE__ */ e.jsx(Je, { className: "w-4 h-4" }) })
        ] })
      ] }, r.id)) })
    ] }),
    I && /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ e.jsxs("div", { className: "bg-background rounded-xl shadow-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between p-6 border-b border-border", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-xl font-semibold text-foreground", children: S ? "Edit Work" : "Create New Work" }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            onClick: () => {
              R(!1), c();
            },
            className: "text-muted-foreground hover:text-foreground",
            children: /* @__PURE__ */ e.jsx(ge, { className: "w-6 h-6" })
          }
        )
      ] }),
      /* @__PURE__ */ e.jsxs("form", { onSubmit: Z, className: "p-6 space-y-6", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Title *" }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "text",
                required: !0,
                value: k.title,
                onChange: (r) => l({ ...k, title: r.target.value }),
                className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Type" }),
            /* @__PURE__ */ e.jsxs(
              "select",
              {
                value: k.type,
                onChange: (r) => l({ ...k, type: r.target.value }),
                className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                children: [
                  /* @__PURE__ */ e.jsx("option", { value: "book", children: "Book" }),
                  /* @__PURE__ */ e.jsx("option", { value: "volume", children: "Volume" }),
                  /* @__PURE__ */ e.jsx("option", { value: "saga", children: "Saga" }),
                  /* @__PURE__ */ e.jsx("option", { value: "arc", children: "Arc" }),
                  /* @__PURE__ */ e.jsx("option", { value: "issue", children: "Issue" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Description" }),
          /* @__PURE__ */ e.jsx(
            "textarea",
            {
              value: k.description,
              onChange: (r) => l({ ...k, description: r.target.value }),
              rows: 3,
              className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Status" }),
            /* @__PURE__ */ e.jsxs(
              "select",
              {
                value: k.status,
                onChange: (r) => l({ ...k, status: r.target.value }),
                className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                children: [
                  /* @__PURE__ */ e.jsx("option", { value: "planning", children: "Planning" }),
                  /* @__PURE__ */ e.jsx("option", { value: "writing", children: "Writing" }),
                  /* @__PURE__ */ e.jsx("option", { value: "editing", children: "Editing" }),
                  /* @__PURE__ */ e.jsx("option", { value: "published", children: "Published" }),
                  /* @__PURE__ */ e.jsx("option", { value: "on_hold", children: "On Hold" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Progress %" }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "number",
                min: "0",
                max: "100",
                value: k.progress_percentage,
                onChange: (r) => l({ ...k, progress_percentage: parseInt(r.target.value) || 0 }),
                className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Release Date" }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "date",
                value: k.release_date,
                onChange: (r) => l({ ...k, release_date: r.target.value }),
                className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Estimated Release" }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "text",
                value: k.estimated_release,
                onChange: (r) => l({ ...k, estimated_release: r.target.value }),
                placeholder: "e.g., Spring 2024",
                className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Cover Image URL" }),
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "url",
              value: k.cover_image_url,
              onChange: (r) => l({ ...k, cover_image_url: r.target.value }),
              className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Target Word Count" }),
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "number",
              value: k.target_word_count || "",
              onChange: (r) => l({ ...k, target_word_count: r.target.value ? parseInt(r.target.value) : void 0 }),
              className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "checkbox",
                id: "is_featured",
                checked: k.is_featured,
                onChange: (r) => l({ ...k, is_featured: r.target.checked }),
                className: "w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
              }
            ),
            /* @__PURE__ */ e.jsx("label", { htmlFor: "is_featured", className: "ml-2 text-sm font-medium text-foreground", children: "Featured (highlight in library)" })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "checkbox",
                id: "is_premium",
                checked: k.is_premium,
                onChange: (r) => l({ ...k, is_premium: r.target.checked }),
                className: "w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
              }
            ),
            /* @__PURE__ */ e.jsx("label", { htmlFor: "is_premium", className: "ml-2 text-sm font-medium text-foreground", children: "Premium content (requires subscription/purchase)" })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "checkbox",
                id: "is_free",
                checked: k.is_free,
                onChange: (r) => l({ ...k, is_free: r.target.checked }),
                className: "w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
              }
            ),
            /* @__PURE__ */ e.jsx("label", { htmlFor: "is_free", className: "ml-2 text-sm font-medium text-foreground", children: "Free to read (no subscription required)" })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-end gap-3 pt-4 border-t border-border", children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                R(!1), c();
              },
              className: "px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "submit",
              className: "bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2",
              children: [
                /* @__PURE__ */ e.jsx(Bt, { className: "w-4 h-4" }),
                S ? "Update Work" : "Create Work"
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    se && /* @__PURE__ */ e.jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ e.jsx("div", { className: "bg-background rounded-xl shadow-xl border border-border max-w-md w-full", children: /* @__PURE__ */ e.jsxs("div", { className: "p-6 text-center", children: [
      /* @__PURE__ */ e.jsx(xe, { className: "w-16 h-16 text-primary mx-auto mb-4" }),
      /* @__PURE__ */ e.jsx("h3", { className: "text-lg font-semibold text-foreground mb-2", children: "Chapter Upload" }),
      /* @__PURE__ */ e.jsx("p", { className: "text-muted-foreground mb-4", children: "Use the existing Chapter Upload page or integrate the upload functionality here." }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            onClick: () => {
              V(!1), window.open("/account/admin/media", "_blank");
            },
            className: "flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors",
            children: "Go to Upload Page"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            onClick: () => V(!1),
            className: "flex-1 bg-gray-200 dark:bg-gray-700 text-foreground px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors",
            children: "Close"
          }
        )
      ] })
    ] }) }) })
  ] });
}, kn = () => {
  const [s, n] = p("upload"), [i, h] = p("chapter"), [m, f] = p([]), [N, g] = p([]), [u, v] = p(!1), [x, C] = p(null), [P, Y] = p(null), [T, q] = p(""), [I, R] = p("all"), [S, B] = p(null), [z, D] = p(!1), [se, V] = p({}), [k, l] = p({
    work_id: "",
    chapter_title: "",
    chapter_number: 1,
    is_published: !1
  });
  he(() => {
    y(), a();
  }, []);
  const y = async () => {
    try {
      const o = await fetch("/api/admin/works");
      if (o.ok) {
        const r = await o.json();
        f(r.works || []);
      }
    } catch (o) {
      console.error("Failed to fetch works:", o);
    }
  }, a = async () => {
    try {
      v(!0);
      const o = await fetch("/api/admin/media");
      if (o.ok) {
        const r = await o.json();
        g(r.files || []);
      }
    } catch {
      C("Failed to fetch media files");
    } finally {
      v(!1);
    }
  }, _ = (o) => {
    o.target.files && B(o.target.files);
  }, $ = (o) => {
    o.preventDefault(), o.stopPropagation(), o.type === "dragenter" || o.type === "dragover" ? D(!0) : o.type === "dragleave" && D(!1);
  }, Z = (o) => {
    o.preventDefault(), o.stopPropagation(), D(!1), o.dataTransfer.files && o.dataTransfer.files[0] && B(o.dataTransfer.files);
  }, c = async () => {
    var o, r;
    if (!S || S.length === 0) {
      C("Please select a file to upload");
      return;
    }
    if (!k.work_id || !k.chapter_title) {
      C("Please fill in all required chapter information");
      return;
    }
    v(!0), C(null), Y(null);
    try {
      const j = new FormData();
      j.append("file", S[0]), j.append("title", k.chapter_title), j.append("chapter_number", k.chapter_number.toString()), j.append("book_id", k.work_id), j.append("is_published", k.is_published.toString());
      const { data: { session: U }, error: X } = await ((r = (o = window.supabase) == null ? void 0 : o.auth) == null ? void 0 : r.getSession());
      if (X || !U)
        throw new Error("User session not found. Please log in.");
      const oe = await fetch("/api/chapters/upload", {
        method: "POST",
        body: j,
        headers: {
          Authorization: `Bearer ${U.access_token}`
        }
      });
      if (!oe.ok) {
        const _e = await oe.json();
        throw new Error(_e.message || _e.error || "Failed to upload chapter.");
      }
      const Ye = await oe.json();
      Y(`Chapter "${k.chapter_title}" uploaded successfully!`), B(null), l({
        work_id: "",
        chapter_title: "",
        chapter_number: 1,
        is_published: !1
      }), await a();
    } catch (j) {
      C(j instanceof Error ? j.message : "Failed to upload chapter");
    } finally {
      v(!1);
    }
  }, L = async () => {
    if (!S || S.length === 0) {
      C("Please select files to upload");
      return;
    }
    v(!0), C(null), Y(null);
    try {
      const o = Array.from(S).map(async (r, j) => {
        const U = new FormData();
        U.append("file", r), U.append("type", "media");
        const X = await fetch("/api/admin/media/upload", {
          method: "POST",
          body: U
        });
        if (!X.ok)
          throw new Error(`Failed to upload ${r.name}`);
        return X.json();
      });
      await Promise.all(o), Y(`Successfully uploaded ${S.length} file(s)`), B(null), await a();
    } catch (o) {
      C(o instanceof Error ? o.message : "Failed to upload files");
    } finally {
      v(!1);
    }
  }, te = async (o) => {
    if (confirm("Are you sure you want to delete this file?"))
      try {
        if (!(await fetch(`/api/admin/media/${o}`, {
          method: "DELETE"
        })).ok)
          throw new Error("Failed to delete file");
        Y("File deleted successfully"), await a();
      } catch (r) {
        C(r instanceof Error ? r.message : "Failed to delete file");
      }
  }, H = N.filter((o) => {
    var U;
    const r = o.filename.toLowerCase().includes(T.toLowerCase()) || ((U = o.chapter_title) == null ? void 0 : U.toLowerCase().includes(T.toLowerCase()));
    let j = !0;
    if (I !== "all")
      switch (I) {
        case "chapter":
          j = !!(o.work_id && o.chapter_number);
          break;
        case "image":
          j = o.file_type.startsWith("image/");
          break;
        case "video":
          j = o.file_type.startsWith("video/");
          break;
        case "audio":
          j = o.file_type.startsWith("audio/");
          break;
        case "document":
          j = o.file_type.includes("pdf") || o.file_type.includes("document") || o.file_type.includes("text");
          break;
      }
    return r && j;
  }), K = (o) => o.work_id && o.chapter_number ? /* @__PURE__ */ e.jsx(be, { className: "w-5 h-5 text-blue-600" }) : o.file_type.startsWith("image/") ? /* @__PURE__ */ e.jsx(At, { className: "w-5 h-5 text-green-600" }) : o.file_type.startsWith("video/") ? /* @__PURE__ */ e.jsx($r, { className: "w-5 h-5 text-purple-600" }) : o.file_type.startsWith("audio/") ? /* @__PURE__ */ e.jsx(Wr, { className: "w-5 h-5 text-pink-600" }) : /* @__PURE__ */ e.jsx(ye, { className: "w-5 h-5 text-gray-600" }), le = (o) => {
    if (o === 0) return "0 Bytes";
    const r = 1024, j = ["Bytes", "KB", "MB", "GB"], U = Math.floor(Math.log(o) / Math.log(r));
    return parseFloat((o / Math.pow(r, U)).toFixed(2)) + " " + j[U];
  }, ue = (o) => new Date(o).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-3", children: [
          /* @__PURE__ */ e.jsx(xe, { className: "w-8 h-8 text-primary" }),
          "Media Upload"
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-muted-foreground mt-2", children: "Upload chapters for subscribers and manage media files for your website" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            onClick: () => n("upload"),
            className: `px-6 py-3 rounded-xl font-medium transition-colors ${s === "upload" ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-foreground hover:bg-gray-300 dark:hover:bg-gray-600"}`,
            children: "Upload Files"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            onClick: () => n("library"),
            className: `px-6 py-3 rounded-xl font-medium transition-colors ${s === "library" ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-foreground hover:bg-gray-300 dark:hover:bg-gray-600"}`,
            children: "Media Library"
          }
        )
      ] })
    ] }),
    P && /* @__PURE__ */ e.jsxs("div", { className: "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ e.jsx(Xe, { className: "w-5 h-5 text-green-500 flex-shrink-0" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-green-700 dark:text-green-400", children: P }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          onClick: () => Y(null),
          className: "ml-auto text-green-500 hover:text-green-600",
          children: /* @__PURE__ */ e.jsx(ge, { className: "w-5 h-5" })
        }
      )
    ] }),
    x && /* @__PURE__ */ e.jsxs("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ e.jsx(Re, { className: "w-5 h-5 text-red-500 flex-shrink-0" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-red-700 dark:text-red-400", children: x }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          onClick: () => C(null),
          className: "ml-auto text-red-500 hover:text-red-600",
          children: /* @__PURE__ */ e.jsx(ge, { className: "w-5 h-5" })
        }
      )
    ] }),
    s === "upload" && /* @__PURE__ */ e.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex gap-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl", children: [
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            onClick: () => h("chapter"),
            className: `flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${i === "chapter" ? "bg-white dark:bg-gray-700 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
            children: [
              /* @__PURE__ */ e.jsx(be, { className: "w-4 h-4 inline mr-2" }),
              "Chapter Upload"
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            onClick: () => h("media"),
            className: `flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${i === "media" ? "bg-white dark:bg-gray-700 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
            children: [
              /* @__PURE__ */ e.jsx(At, { className: "w-4 h-4 inline mr-2" }),
              "Media Upload"
            ]
          }
        )
      ] }),
      i === "chapter" && /* @__PURE__ */ e.jsxs("div", { className: "bg-card border border-border rounded-xl p-6", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-xl font-semibold text-foreground mb-4", children: "Upload New Chapter" }),
        /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Select Work *" }),
            /* @__PURE__ */ e.jsxs(
              "select",
              {
                value: k.work_id,
                onChange: (o) => l({ ...k, work_id: o.target.value }),
                className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                required: !0,
                children: [
                  /* @__PURE__ */ e.jsx("option", { value: "", children: "-- Select a Work --" }),
                  m.map((o) => /* @__PURE__ */ e.jsxs("option", { value: o.id, children: [
                    o.title,
                    " (",
                    o.type,
                    ")"
                  ] }, o.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Chapter Number *" }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "number",
                min: "1",
                value: k.chapter_number,
                onChange: (o) => l({ ...k, chapter_number: parseInt(o.target.value) || 1 }),
                className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                required: !0
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ e.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Chapter Title *" }),
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "text",
              value: k.chapter_title,
              onChange: (o) => l({ ...k, chapter_title: o.target.value }),
              className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              placeholder: "Enter chapter title",
              required: !0
            }
          )
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "mb-6", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              id: "is_published",
              checked: k.is_published,
              onChange: (o) => l({ ...k, is_published: o.target.checked }),
              className: "w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            }
          ),
          /* @__PURE__ */ e.jsx("label", { htmlFor: "is_published", className: "ml-2 text-sm font-medium text-foreground", children: "Publish immediately (subscribers will get access)" })
        ] }) }),
        /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: `border-2 border-dashed rounded-xl p-8 text-center transition-colors ${z ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5"}`,
            onDragEnter: $,
            onDragLeave: $,
            onDragOver: $,
            onDrop: Z,
            children: [
              /* @__PURE__ */ e.jsx(xe, { className: "w-12 h-12 text-primary mx-auto mb-4" }),
              /* @__PURE__ */ e.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "Drop chapter file here or click to browse" }),
              /* @__PURE__ */ e.jsx("p", { className: "text-muted-foreground mb-4", children: "Supported formats: PDF, DOCX, TXT, HTML" }),
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "file",
                  onChange: _,
                  accept: ".pdf,.docx,.txt,.html",
                  className: "hidden",
                  id: "chapter-file-input"
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "label",
                {
                  htmlFor: "chapter-file-input",
                  className: "bg-primary text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-primary-dark transition-colors inline-flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ e.jsx(Ee, { className: "w-4 h-4" }),
                    "Choose File"
                  ]
                }
              )
            ]
          }
        ),
        S && /* @__PURE__ */ e.jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ e.jsx("h4", { className: "font-medium text-foreground mb-2", children: "Selected File:" }),
          Array.from(S).map((o, r) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ e.jsx(ye, { className: "w-4 h-4 text-gray-500" }),
              /* @__PURE__ */ e.jsx("span", { className: "text-sm font-medium", children: o.name }),
              /* @__PURE__ */ e.jsx("span", { className: "text-xs text-muted-foreground", children: le(o.size) })
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                onClick: () => B(null),
                className: "text-red-500 hover:text-red-600",
                children: /* @__PURE__ */ e.jsx(ge, { className: "w-4 h-4" })
              }
            )
          ] }, r))
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ e.jsx(
          "button",
          {
            onClick: c,
            disabled: u || !S || !k.work_id || !k.chapter_title,
            className: "bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
            children: u ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
              /* @__PURE__ */ e.jsx(de, { className: "w-4 h-4 animate-spin" }),
              "Uploading Chapter..."
            ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
              /* @__PURE__ */ e.jsx(xe, { className: "w-4 h-4" }),
              "Upload Chapter"
            ] })
          }
        ) })
      ] }),
      i === "media" && /* @__PURE__ */ e.jsxs("div", { className: "bg-card border border-border rounded-xl p-6", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-xl font-semibold text-foreground mb-4", children: "Upload Media Files" }),
        /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: `border-2 border-dashed rounded-xl p-8 text-center transition-colors ${z ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5"}`,
            onDragEnter: $,
            onDragLeave: $,
            onDragOver: $,
            onDrop: Z,
            children: [
              /* @__PURE__ */ e.jsx(xe, { className: "w-12 h-12 text-primary mx-auto mb-4" }),
              /* @__PURE__ */ e.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "Drop files here or click to browse" }),
              /* @__PURE__ */ e.jsx("p", { className: "text-muted-foreground mb-4", children: "Images, videos, documents, and other media files" }),
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "file",
                  onChange: _,
                  multiple: !0,
                  className: "hidden",
                  id: "media-file-input"
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "label",
                {
                  htmlFor: "media-file-input",
                  className: "bg-primary text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-primary-dark transition-colors inline-flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ e.jsx(Ee, { className: "w-4 h-4" }),
                    "Choose Files"
                  ]
                }
              )
            ]
          }
        ),
        S && /* @__PURE__ */ e.jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ e.jsxs("h4", { className: "font-medium text-foreground mb-2", children: [
            "Selected Files (",
            S.length,
            "):"
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "space-y-2 max-h-40 overflow-y-auto", children: Array.from(S).map((o, r) => /* @__PURE__ */ e.jsx("div", { className: "flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ e.jsx(Ir, { className: "w-4 h-4 text-gray-500" }),
            /* @__PURE__ */ e.jsx("span", { className: "text-sm font-medium", children: o.name }),
            /* @__PURE__ */ e.jsx("span", { className: "text-xs text-muted-foreground", children: le(o.size) })
          ] }) }, r)) })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ e.jsx(
          "button",
          {
            onClick: L,
            disabled: u || !S,
            className: "bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
            children: u ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
              /* @__PURE__ */ e.jsx(de, { className: "w-4 h-4 animate-spin" }),
              "Uploading Files..."
            ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
              /* @__PURE__ */ e.jsx(xe, { className: "w-4 h-4" }),
              "Upload Files"
            ] })
          }
        ) })
      ] })
    ] }),
    s === "library" && /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ e.jsx(Pe, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "text",
              placeholder: "Search files...",
              value: T,
              onChange: (o) => q(o.target.value),
              className: "w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ e.jsx(De, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
          /* @__PURE__ */ e.jsxs(
            "select",
            {
              value: I,
              onChange: (o) => R(o.target.value),
              className: "pl-10 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              children: [
                /* @__PURE__ */ e.jsx("option", { value: "all", children: "All Files" }),
                /* @__PURE__ */ e.jsx("option", { value: "chapter", children: "Chapters" }),
                /* @__PURE__ */ e.jsx("option", { value: "image", children: "Images" }),
                /* @__PURE__ */ e.jsx("option", { value: "video", children: "Videos" }),
                /* @__PURE__ */ e.jsx("option", { value: "audio", children: "Audio" }),
                /* @__PURE__ */ e.jsx("option", { value: "document", children: "Documents" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            onClick: a,
            className: "bg-primary text-white px-4 py-3 rounded-xl hover:bg-primary-dark transition-colors",
            children: /* @__PURE__ */ e.jsx(de, { className: "w-4 h-4" })
          }
        )
      ] }),
      u ? /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-center py-12", children: [
        /* @__PURE__ */ e.jsx(de, { className: "w-8 h-8 animate-spin text-primary" }),
        /* @__PURE__ */ e.jsx("span", { className: "ml-3", children: "Loading files..." })
      ] }) : H.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ e.jsx(zr, { className: "w-16 h-16 text-muted-foreground mx-auto mb-4" }),
        /* @__PURE__ */ e.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "No files found" }),
        /* @__PURE__ */ e.jsx("p", { className: "text-muted-foreground", children: T || I !== "all" ? "Try adjusting your search or filters" : "Upload your first file to get started" })
      ] }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: H.map((o) => {
        var r;
        return /* @__PURE__ */ e.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow", children: [
          /* @__PURE__ */ e.jsx("div", { className: "aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center", children: o.thumbnail_url ? /* @__PURE__ */ e.jsx(
            "img",
            {
              src: o.thumbnail_url,
              alt: o.filename,
              className: "w-full h-full object-cover rounded-lg"
            }
          ) : /* @__PURE__ */ e.jsxs("div", { className: "text-center", children: [
            K(o),
            /* @__PURE__ */ e.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: (r = o.file_type.split("/")[1]) == null ? void 0 : r.toUpperCase() })
          ] }) }),
          /* @__PURE__ */ e.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ e.jsx("h3", { className: "font-medium text-foreground truncate", title: o.filename, children: o.filename }),
            o.work_id && o.chapter_number && /* @__PURE__ */ e.jsxs("div", { className: "text-sm text-muted-foreground", children: [
              /* @__PURE__ */ e.jsxs("p", { children: [
                "Chapter ",
                o.chapter_number,
                ": ",
                o.chapter_title
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${o.is_published ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400"}`, children: o.is_published ? "Published" : "Draft" })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
              /* @__PURE__ */ e.jsx("span", { children: le(o.file_size) }),
              /* @__PURE__ */ e.jsx("span", { children: ue(o.upload_date) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between mt-4 pt-3 border-t border-border", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
              o.file_url && /* @__PURE__ */ e.jsx(
                "button",
                {
                  onClick: () => window.open(o.file_url, "_blank"),
                  className: "p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors",
                  title: "View file",
                  children: /* @__PURE__ */ e.jsx(ke, { className: "w-4 h-4" })
                }
              ),
              o.file_url && /* @__PURE__ */ e.jsx(
                "button",
                {
                  onClick: () => {
                    const j = document.createElement("a");
                    j.href = o.file_url, j.download = o.filename, j.click();
                  },
                  className: "p-1.5 text-blue-600 hover:bg-blue-600/10 rounded-lg transition-colors",
                  title: "Download file",
                  children: /* @__PURE__ */ e.jsx(Dr, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                onClick: () => te(o.id),
                className: "p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors",
                title: "Delete file",
                children: /* @__PURE__ */ e.jsx(et, { className: "w-4 h-4" })
              }
            )
          ] })
        ] }, o.id);
      }) })
    ] })
  ] });
}, Oa = Ht(
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
), Ia = ce.forwardRef(
  ({ className: s, variant: n, size: i, asChild: h = !1, ...m }, f) => {
    const N = h ? qr : "button";
    return /* @__PURE__ */ e.jsx(
      N,
      {
        className: ne(Oa({ variant: n, size: i, className: s })),
        ref: f,
        ...m
      }
    );
  }
);
Ia.displayName = "Button";
const za = ce.forwardRef(({ className: s, ...n }, i) => /* @__PURE__ */ e.jsx(
  "div",
  {
    ref: i,
    className: ne("rounded-lg border bg-card text-card-foreground shadow-sm", s),
    ...n
  }
));
za.displayName = "Card";
const Da = ce.forwardRef(({ className: s, ...n }, i) => /* @__PURE__ */ e.jsx(
  "div",
  {
    ref: i,
    className: ne("flex flex-col space-y-1.5 p-6", s),
    ...n
  }
));
Da.displayName = "CardHeader";
const $a = ce.forwardRef(({ className: s, ...n }, i) => /* @__PURE__ */ e.jsx(
  "h3",
  {
    ref: i,
    className: ne(
      "text-2xl font-semibold leading-none tracking-tight",
      s
    ),
    ...n
  }
));
$a.displayName = "CardTitle";
const Wa = ce.forwardRef(({ className: s, ...n }, i) => /* @__PURE__ */ e.jsx(
  "p",
  {
    ref: i,
    className: ne("text-sm text-muted-foreground", s),
    ...n
  }
));
Wa.displayName = "CardDescription";
const Ua = ce.forwardRef(({ className: s, ...n }, i) => /* @__PURE__ */ e.jsx("div", { ref: i, className: ne("p-6 pt-0", s), ...n }));
Ua.displayName = "CardContent";
const qa = ce.forwardRef(({ className: s, ...n }, i) => /* @__PURE__ */ e.jsx(
  "div",
  {
    ref: i,
    className: ne("flex items-center p-6 pt-0", s),
    ...n
  }
));
qa.displayName = "CardFooter";
const Ba = ce.forwardRef(
  ({ className: s, type: n, ...i }, h) => /* @__PURE__ */ e.jsx(
    "input",
    {
      type: n,
      className: ne(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        s
      ),
      ref: h,
      ...i
    }
  )
);
Ba.displayName = "Input";
const Ha = Ht(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
), Ga = ce.forwardRef(({ className: s, ...n }, i) => /* @__PURE__ */ e.jsx(
  Gt.Root,
  {
    ref: i,
    className: ne(Ha(), s),
    ...n
  }
));
Ga.displayName = Gt.Root.displayName;
const Va = {
  default: "bg-primary text-primary-foreground hover:bg-primary/80 border-transparent",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent",
  outline: "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
  success: "bg-green-500 text-white hover:bg-green-600 border-transparent"
}, Ja = ce.forwardRef(
  ({ className: s, variant: n = "default", ...i }, h) => /* @__PURE__ */ e.jsx(
    "div",
    {
      ref: h,
      className: ne(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        Va[n],
        s
      ),
      ...i
    }
  )
);
Ja.displayName = "Badge";
export {
  dn as AdminProtectedRoute,
  ln as AdminSideNav,
  nn as AdminSideNavProvider,
  on as AdminSideNavToggle,
  Ja as Badge,
  Ia as Button,
  za as Card,
  Ua as CardContent,
  Wa as CardDescription,
  qa as CardFooter,
  Da as CardHeader,
  $a as CardTitle,
  bn as CartIcon,
  bs as Footer,
  mn as GlowButton,
  un as HomePage,
  Ba as Input,
  jn as InventoryManagementPage,
  Ga as Label,
  hn as Layout,
  fn as LoadingSkeleton,
  yn as LoginPage,
  pn as MagicalParticles,
  kn as MediaUploadPage,
  hs as Navbar,
  wn as OrderManagementPage,
  gn as OrnateDivider,
  vn as ProductManagementPage,
  cn as SimpleDashboardPage,
  xn as StarsBackground,
  Ws as WikiNavItem,
  Nn as WorksManagementPage,
  Oa as buttonVariants,
  $s as cn,
  Jt as useAdminSideNav
};
