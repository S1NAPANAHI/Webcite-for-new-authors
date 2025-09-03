import * as Pe from "react";
import $i, { createContext as $e, useContext as ce, useEffect as pe, useState as P, useRef as ht, useLayoutEffect as ll, useId as cl, useCallback as Ui, useMemo as Ts, Fragment as Wi, createElement as dl, useInsertionEffect as ul, forwardRef as hl, Component as ml } from "react";
import { useNavigate as Hi, NavLink as cs, useLocation as fl, Navigate as gl, Outlet as pl, Link as yt } from "react-router-dom";
import { clsx as Ki } from "clsx";
import { twMerge as Gi } from "tailwind-merge";
import { createClient as xl } from "@supabase/supabase-js";
import { X as Ee, LayoutDashboard as yl, Package as Ze, ShoppingCart as et, Boxes as bl, BarChart3 as ds, FileText as Ye, BookOpen as xs, Calendar as Nr, Users as ys, Webhook as vl, Upload as Ie, Settings as kr, LogOut as wl, Menu as jl, AlertCircle as Ot, CheckSquare as vn, DollarSign as Tr, Eye as tt, TrendingUp as it, Search as bt, Twitter as Nl, Instagram as kl, Mail as Tl, ChevronRight as Sl, Minus as Cl, Plus as ft, Trash2 as Ss, RefreshCw as Se, Filter as Gt, EyeOff as qi, Edit as us, Save as Xi, Crown as Yt, Book as Oe, AlertTriangle as hs, User as wn, CreditCard as jn, ExternalLink as Nn, XCircle as Et, Clock as Mt, CheckCircle as gt, Package2 as ss, TrendingDown as rs, Star as Js, PauseCircle as _l, Target as Pl, Archive as Al, Image as kn, File as El, FolderOpen as Ml, Download as Dl, Video as Rl, Music as Ll, ArrowRight as Vl, Info as Fl } from "lucide-react";
import { useCart as Il, supabase as Ol } from "@zoroaster/shared";
import { useQueryClient as Yl, useQuery as bs, useMutation as Bl } from "@tanstack/react-query";
import { Slot as zl } from "@radix-ui/react-slot";
import { cva as Zi } from "class-variance-authority";
import * as Ji from "@radix-ui/react-label";
var Qs = { exports: {} }, St = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Tn;
function $l() {
  if (Tn) return St;
  Tn = 1;
  var e = $i, t = Symbol.for("react.element"), r = Symbol.for("react.fragment"), n = Object.prototype.hasOwnProperty, i = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, a = { key: !0, ref: !0, __self: !0, __source: !0 };
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
var Sn;
function Ul() {
  return Sn || (Sn = 1, process.env.NODE_ENV !== "production" && function() {
    var e = $i, t = Symbol.for("react.element"), r = Symbol.for("react.portal"), n = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.provider"), l = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), u = Symbol.for("react.suspense"), d = Symbol.for("react.suspense_list"), h = Symbol.for("react.memo"), f = Symbol.for("react.lazy"), p = Symbol.for("react.offscreen"), y = Symbol.iterator, k = "@@iterator";
    function C(m) {
      if (m === null || typeof m != "object")
        return null;
      var N = y && m[y] || m[k];
      return typeof N == "function" ? N : null;
    }
    var v = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function j(m) {
      {
        for (var N = arguments.length, M = new Array(N > 1 ? N - 1 : 0), F = 1; F < N; F++)
          M[F - 1] = arguments[F];
        _("error", m, M);
      }
    }
    function _(m, N, M) {
      {
        var F = v.ReactDebugCurrentFrame, W = F.getStackAddendum();
        W !== "" && (N += "%s", M = M.concat([W]));
        var G = M.map(function(z) {
          return String(z);
        });
        G.unshift("Warning: " + N), Function.prototype.apply.call(console[m], console, G);
      }
    }
    var D = !1, A = !1, I = !1, O = !1, T = !1, x;
    x = Symbol.for("react.module.reference");
    function E(m) {
      return !!(typeof m == "string" || typeof m == "function" || m === n || m === a || T || m === i || m === u || m === d || O || m === p || D || A || I || typeof m == "object" && m !== null && (m.$$typeof === f || m.$$typeof === h || m.$$typeof === o || m.$$typeof === l || m.$$typeof === c || // This needs to include all possible module reference object
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
    function K(m) {
      if (m == null)
        return null;
      if (typeof m.tag == "number" && j("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof m == "function")
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
            return F !== null ? F : K(m.type) || "Memo";
          case f: {
            var W = m, G = W._payload, z = W._init;
            try {
              return K(z(G));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var se = Object.assign, S = 0, $, U, B, q, ie, Ne, w;
    function g() {
    }
    g.__reactDisabledLog = !0;
    function R() {
      {
        if (S === 0) {
          $ = console.log, U = console.info, B = console.warn, q = console.error, ie = console.group, Ne = console.groupCollapsed, w = console.groupEnd;
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
        S++;
      }
    }
    function X() {
      {
        if (S--, S === 0) {
          var m = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: se({}, m, {
              value: $
            }),
            info: se({}, m, {
              value: U
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
              value: w
            })
          });
        }
        S < 0 && j("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var ue = v.ReactCurrentDispatcher, ye;
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
    var st = !1, Qt;
    {
      var Fa = typeof WeakMap == "function" ? WeakMap : Map;
      Qt = new Fa();
    }
    function nn(m, N) {
      if (!m || st)
        return "";
      {
        var M = Qt.get(m);
        if (M !== void 0)
          return M;
      }
      var F;
      st = !0;
      var W = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var G;
      G = ue.current, ue.current = null, R();
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
            } catch (fe) {
              F = fe;
            }
            Reflect.construct(m, [], z);
          } else {
            try {
              z.call();
            } catch (fe) {
              F = fe;
            }
            m.call(z.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (fe) {
            F = fe;
          }
          m();
        }
      } catch (fe) {
        if (fe && F && typeof fe.stack == "string") {
          for (var Y = fe.stack.split(`
`), he = F.stack.split(`
`), ee = Y.length - 1, re = he.length - 1; ee >= 1 && re >= 0 && Y[ee] !== he[re]; )
            re--;
          for (; ee >= 1 && re >= 0; ee--, re--)
            if (Y[ee] !== he[re]) {
              if (ee !== 1 || re !== 1)
                do
                  if (ee--, re--, re < 0 || Y[ee] !== he[re]) {
                    var be = `
` + Y[ee].replace(" at new ", " at ");
                    return m.displayName && be.includes("<anonymous>") && (be = be.replace("<anonymous>", m.displayName)), typeof m == "function" && Qt.set(m, be), be;
                  }
                while (ee >= 1 && re >= 0);
              break;
            }
        }
      } finally {
        st = !1, ue.current = G, X(), Error.prepareStackTrace = W;
      }
      var nt = m ? m.displayName || m.name : "", We = nt ? kt(nt) : "";
      return typeof m == "function" && Qt.set(m, We), We;
    }
    function Ia(m, N, M) {
      return nn(m, !1);
    }
    function Oa(m) {
      var N = m.prototype;
      return !!(N && N.isReactComponent);
    }
    function es(m, N, M) {
      if (m == null)
        return "";
      if (typeof m == "function")
        return nn(m, Oa(m));
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
            return Ia(m.render);
          case h:
            return es(m.type, N, M);
          case f: {
            var F = m, W = F._payload, G = F._init;
            try {
              return es(G(W), N, M);
            } catch {
            }
          }
        }
      return "";
    }
    var Tt = Object.prototype.hasOwnProperty, on = {}, an = v.ReactDebugCurrentFrame;
    function ts(m) {
      if (m) {
        var N = m._owner, M = es(m.type, m._source, N ? N.type : null);
        an.setExtraStackFrame(M);
      } else
        an.setExtraStackFrame(null);
    }
    function Ya(m, N, M, F, W) {
      {
        var G = Function.call.bind(Tt);
        for (var z in m)
          if (G(m, z)) {
            var Y = void 0;
            try {
              if (typeof m[z] != "function") {
                var he = Error((F || "React class") + ": " + M + " type `" + z + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof m[z] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw he.name = "Invariant Violation", he;
              }
              Y = m[z](N, z, F, M, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (ee) {
              Y = ee;
            }
            Y && !(Y instanceof Error) && (ts(W), j("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", F || "React class", M, z, typeof Y), ts(null)), Y instanceof Error && !(Y.message in on) && (on[Y.message] = !0, ts(W), j("Failed %s type: %s", M, Y.message), ts(null));
          }
      }
    }
    var Ba = Array.isArray;
    function Ms(m) {
      return Ba(m);
    }
    function za(m) {
      {
        var N = typeof Symbol == "function" && Symbol.toStringTag, M = N && m[Symbol.toStringTag] || m.constructor.name || "Object";
        return M;
      }
    }
    function $a(m) {
      try {
        return ln(m), !1;
      } catch {
        return !0;
      }
    }
    function ln(m) {
      return "" + m;
    }
    function cn(m) {
      if ($a(m))
        return j("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", za(m)), ln(m);
    }
    var dn = v.ReactCurrentOwner, Ua = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, un, hn;
    function Wa(m) {
      if (Tt.call(m, "ref")) {
        var N = Object.getOwnPropertyDescriptor(m, "ref").get;
        if (N && N.isReactWarning)
          return !1;
      }
      return m.ref !== void 0;
    }
    function Ha(m) {
      if (Tt.call(m, "key")) {
        var N = Object.getOwnPropertyDescriptor(m, "key").get;
        if (N && N.isReactWarning)
          return !1;
      }
      return m.key !== void 0;
    }
    function Ka(m, N) {
      typeof m.ref == "string" && dn.current;
    }
    function Ga(m, N) {
      {
        var M = function() {
          un || (un = !0, j("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", N));
        };
        M.isReactWarning = !0, Object.defineProperty(m, "key", {
          get: M,
          configurable: !0
        });
      }
    }
    function qa(m, N) {
      {
        var M = function() {
          hn || (hn = !0, j("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", N));
        };
        M.isReactWarning = !0, Object.defineProperty(m, "ref", {
          get: M,
          configurable: !0
        });
      }
    }
    var Xa = function(m, N, M, F, W, G, z) {
      var Y = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: t,
        // Built-in properties that belong on the element
        type: m,
        key: N,
        ref: M,
        props: z,
        // Record the component responsible for creating this element.
        _owner: G
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
    function Za(m, N, M, F, W) {
      {
        var G, z = {}, Y = null, he = null;
        M !== void 0 && (cn(M), Y = "" + M), Ha(N) && (cn(N.key), Y = "" + N.key), Wa(N) && (he = N.ref, Ka(N, W));
        for (G in N)
          Tt.call(N, G) && !Ua.hasOwnProperty(G) && (z[G] = N[G]);
        if (m && m.defaultProps) {
          var ee = m.defaultProps;
          for (G in ee)
            z[G] === void 0 && (z[G] = ee[G]);
        }
        if (Y || he) {
          var re = typeof m == "function" ? m.displayName || m.name || "Unknown" : m;
          Y && Ga(z, re), he && qa(z, re);
        }
        return Xa(m, Y, he, W, F, dn.current, z);
      }
    }
    var Ds = v.ReactCurrentOwner, mn = v.ReactDebugCurrentFrame;
    function rt(m) {
      if (m) {
        var N = m._owner, M = es(m.type, m._source, N ? N.type : null);
        mn.setExtraStackFrame(M);
      } else
        mn.setExtraStackFrame(null);
    }
    var Rs;
    Rs = !1;
    function Ls(m) {
      return typeof m == "object" && m !== null && m.$$typeof === t;
    }
    function fn() {
      {
        if (Ds.current) {
          var m = K(Ds.current.type);
          if (m)
            return `

Check the render method of \`` + m + "`.";
        }
        return "";
      }
    }
    function Ja(m) {
      return "";
    }
    var gn = {};
    function Qa(m) {
      {
        var N = fn();
        if (!N) {
          var M = typeof m == "string" ? m : m.displayName || m.name;
          M && (N = `

Check the top-level render call using <` + M + ">.");
        }
        return N;
      }
    }
    function pn(m, N) {
      {
        if (!m._store || m._store.validated || m.key != null)
          return;
        m._store.validated = !0;
        var M = Qa(N);
        if (gn[M])
          return;
        gn[M] = !0;
        var F = "";
        m && m._owner && m._owner !== Ds.current && (F = " It was passed a child from " + K(m._owner.type) + "."), rt(m), j('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', M, F), rt(null);
      }
    }
    function xn(m, N) {
      {
        if (typeof m != "object")
          return;
        if (Ms(m))
          for (var M = 0; M < m.length; M++) {
            var F = m[M];
            Ls(F) && pn(F, N);
          }
        else if (Ls(m))
          m._store && (m._store.validated = !0);
        else if (m) {
          var W = C(m);
          if (typeof W == "function" && W !== m.entries)
            for (var G = W.call(m), z; !(z = G.next()).done; )
              Ls(z.value) && pn(z.value, N);
        }
      }
    }
    function el(m) {
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
          var F = K(N);
          Ya(M, m.props, "prop", F, m);
        } else if (N.PropTypes !== void 0 && !Rs) {
          Rs = !0;
          var W = K(N);
          j("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", W || "Unknown");
        }
        typeof N.getDefaultProps == "function" && !N.getDefaultProps.isReactClassApproved && j("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function tl(m) {
      {
        for (var N = Object.keys(m.props), M = 0; M < N.length; M++) {
          var F = N[M];
          if (F !== "children" && F !== "key") {
            rt(m), j("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", F), rt(null);
            break;
          }
        }
        m.ref !== null && (rt(m), j("Invalid attribute `ref` supplied to `React.Fragment`."), rt(null));
      }
    }
    var yn = {};
    function bn(m, N, M, F, W, G) {
      {
        var z = E(m);
        if (!z) {
          var Y = "";
          (m === void 0 || typeof m == "object" && m !== null && Object.keys(m).length === 0) && (Y += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var he = Ja();
          he ? Y += he : Y += fn();
          var ee;
          m === null ? ee = "null" : Ms(m) ? ee = "array" : m !== void 0 && m.$$typeof === t ? (ee = "<" + (K(m.type) || "Unknown") + " />", Y = " Did you accidentally export a JSX literal instead of a component?") : ee = typeof m, j("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", ee, Y);
        }
        var re = Za(m, N, M, W, G);
        if (re == null)
          return re;
        if (z) {
          var be = N.children;
          if (be !== void 0)
            if (F)
              if (Ms(be)) {
                for (var nt = 0; nt < be.length; nt++)
                  xn(be[nt], m);
                Object.freeze && Object.freeze(be);
              } else
                j("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              xn(be, m);
        }
        if (Tt.call(N, "key")) {
          var We = K(m), fe = Object.keys(N).filter(function(al) {
            return al !== "key";
          }), Vs = fe.length > 0 ? "{key: someKey, " + fe.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!yn[We + Vs]) {
            var ol = fe.length > 0 ? "{" + fe.join(": ..., ") + ": ...}" : "{}";
            j(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, Vs, We, ol, We), yn[We + Vs] = !0;
          }
        }
        return m === n ? tl(re) : el(re), re;
      }
    }
    function sl(m, N, M) {
      return bn(m, N, M, !0);
    }
    function rl(m, N, M) {
      return bn(m, N, M, !1);
    }
    var nl = rl, il = sl;
    Ct.Fragment = n, Ct.jsx = nl, Ct.jsxs = il;
  }()), Ct;
}
process.env.NODE_ENV === "production" ? Qs.exports = $l() : Qs.exports = Ul();
var s = Qs.exports;
function xe(...e) {
  return Gi(Ki(e));
}
const Wl = $e(void 0), Cs = () => {
  const e = ce(Wl);
  if (e === void 0)
    throw new Error("useAuth must be used within an AuthProvider");
  return e;
}, Me = {}, er = typeof window < "u", Bt = (Me == null ? void 0 : Me.VITE_SUPABASE_URL) || process.env.VITE_SUPABASE_URL || "", _s = (Me == null ? void 0 : Me.VITE_SUPABASE_ANON_KEY) || process.env.VITE_SUPABASE_ANON_KEY || "";
console.log("DEBUG: supabaseUrl (raw):", Bt);
console.log("DEBUG: supabaseAnonKey (raw):", _s);
((Me == null ? void 0 : Me.VITE_DEBUG) === "true" || process.env.VITE_DEBUG === "true") && (console.log("Supabase URL:", Bt ? "✅ Set" : "❌ Missing"), console.log("Supabase Anon Key:", _s ? "✅ Set" : "❌ Missing"));
if ((!Bt || !_s) && er) {
  const e = `
    Missing Supabase environment variables.
    Please check your .env file and ensure the following are set:
    - VITE_SUPABASE_URL
    - VITE_SUPABASE_ANON_KEY
  `;
  throw console.error(e), new Error(e);
}
let oe;
var zi;
try {
  oe = xl(Bt, _s, {
    auth: {
      persistSession: !0,
      autoRefreshToken: !0,
      detectSessionInUrl: !0,
      storage: er ? window.localStorage : void 0
    }
  }), typeof process < "u" && ((zi = process.env) == null ? void 0 : zi.NODE_ENV) === "development" && er && console.log("Supabase client initialized with URL:", Bt);
} catch (e) {
  throw console.error("Error initializing Supabase client:", e), e;
}
const Qi = $e(void 0), eo = () => {
  const e = ce(Qi);
  if (!e)
    throw new Error("useAdminSideNav must be used within AdminSideNavProvider");
  return e;
}, og = ({ children: e }) => {
  const [t, r] = P(!1), n = () => {
    console.log("AdminSideNav: toggle called, current state:", t), r(!t);
  }, i = () => {
    console.log("AdminSideNav: close called, current state:", t), r(!1);
  };
  return /* @__PURE__ */ s.jsx(Qi.Provider, { value: { isOpen: t, toggle: n, close: i }, children: e });
}, Hl = [
  { name: "Dashboard", href: "/account/admin", icon: yl },
  { name: "Products", href: "/account/admin/products", icon: Ze },
  { name: "Orders", href: "/account/admin/orders", icon: et },
  { name: "Inventory", href: "/account/admin/inventory", icon: bl },
  { name: "Analytics", href: "/account/admin/analytics", icon: ds },
  { name: "Posts", href: "/account/admin/posts", icon: Ye },
  { name: "Works", href: "/account/admin/works", icon: xs },
  { name: "Timeline", href: "/account/admin/timeline/events", icon: Nr },
  { name: "Users", href: "/account/admin/users", icon: ys },
  { name: "Beta Applications", href: "/account/admin/beta-applications", icon: ys },
  { name: "Webhooks", href: "/account/admin/webhooks", icon: vl },
  { name: "Media", href: "/account/admin/media", icon: Ie },
  { name: "Settings", href: "/account/admin/settings", icon: kr }
], ag = () => {
  const { isOpen: e, toggle: t } = eo();
  return e ? null : /* @__PURE__ */ s.jsx(
    "button",
    {
      onClick: t,
      className: "fixed top-4 left-4 z-[10000] p-3 rounded-lg bg-slate-800 border border-amber-500/50 shadow-xl hover:bg-slate-700 hover:border-amber-400 text-amber-300 hover:text-amber-200 transition-all duration-300 group",
      "aria-label": "Toggle navigation menu",
      children: /* @__PURE__ */ s.jsx(jl, { size: 20, className: "transition-transform duration-200 group-hover:scale-110" })
    }
  );
}, lg = () => {
  var l, c;
  const { isOpen: e, close: t } = eo(), r = Hi(), { user: n, userProfile: i } = Cs(), a = async () => {
    await oe.auth.signOut(), r("/");
  }, o = () => {
    console.log("AdminSideNav: handleLinkClick called"), t();
  };
  return pe(() => {
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
          /* @__PURE__ */ s.jsx("nav", { className: "flex-1 overflow-y-auto py-4 px-3", style: { backgroundColor: "#0f172a", backdropFilter: "none" }, children: /* @__PURE__ */ s.jsx("ul", { className: "space-y-2", children: Hl.map((u) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx(
            cs,
            {
              to: u.href,
              end: u.href === "/account/admin",
              onClick: o,
              className: ({ isActive: d }) => xe(
                "group flex items-center p-3 rounded-xl transition-all duration-200 relative overflow-hidden space-x-3",
                d ? "bg-amber-600 text-amber-100 border border-amber-500 shadow-md" : "text-slate-300 hover:bg-slate-700 hover:text-amber-200 border border-transparent hover:border-amber-500"
              ),
              children: ({ isActive: d }) => /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
                d && /* @__PURE__ */ s.jsx("div", { className: "absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-r" }),
                /* @__PURE__ */ s.jsx(
                  u.icon,
                  {
                    size: 20,
                    className: xe(
                      "flex-shrink-0 transition-all duration-200",
                      d ? "text-amber-400 drop-shadow-sm" : "group-hover:text-amber-300"
                    )
                  }
                ),
                /* @__PURE__ */ s.jsx("span", { className: xe(
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
                children: /* @__PURE__ */ s.jsx(wl, { size: 18 })
              }
            )
          ] }) })
        ] })
      }
    )
  ] }) : null;
}, cg = ({ children: e }) => {
  var o, l;
  const [t, r] = P(!0), [n, i] = P({ isAuthenticated: !1, isAdmin: !1 }), a = fl();
  return pe(() => {
    (async () => {
      console.log("⏳ [AdminProtectedRoute] Checking session and admin status...");
      const { data: { session: u }, error: d } = await oe.auth.getSession();
      if (d || !u) {
        console.log("🔒 [AdminProtectedRoute] No authenticated session found."), i({ isAuthenticated: !1, isAdmin: !1 }), r(!1);
        return;
      }
      console.log("✅ [AdminProtectedRoute] Session found. User:", u.user.email);
      const { data: h, error: f } = await oe.rpc("is_admin");
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
  ] }) }) })) : (console.log("🛑 [AdminProtectedRoute] Not authenticated, redirecting to login."), /* @__PURE__ */ s.jsx(gl, { to: "/login", state: { from: a }, replace: !0 }));
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
), dg = () => {
  const [e, t] = P(null), [r, n] = P(!0), [i, a] = P(null);
  return pe(() => {
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
          oe.from("profiles").select("id", { count: "exact", head: !0 }),
          oe.from("subscriptions").select("id", { count: "exact", head: !0 }).eq("status", "active"),
          oe.from("pages").select("view_count"),
          oe.from("orders").select("total_amount, status").eq("status", "completed"),
          oe.from("products").select("id", { count: "exact", head: !0 }).eq("active", !0),
          oe.from("orders").select("id", { count: "exact", head: !0 }),
          oe.from("orders").select("id", { count: "exact", head: !0 }).eq("status", "pending")
        ]), y = (u == null ? void 0 : u.reduce((C, v) => C + (v.view_count || 0), 0)) || 0, k = (d == null ? void 0 : d.reduce((C, v) => C + v.total_amount, 0)) || 0;
        t({
          totalUsers: l || 0,
          activeSubscribers: c || 0,
          totalRevenue: k,
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
    /* @__PURE__ */ s.jsx(Ot, { className: "w-5 h-5 text-red-600 dark:text-red-400" }),
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
          icon: vn,
          color: "green",
          trend: "Premium members"
        }
      ),
      /* @__PURE__ */ s.jsx(
        He,
        {
          title: "Total Revenue",
          value: `$${(e == null ? void 0 : e.totalRevenue.toFixed(2)) ?? "0.00"}`,
          icon: Tr,
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
          icon: Ot,
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
            icon: vn,
            href: "/account/admin/beta-applications",
            color: "indigo"
          }
        ),
        /* @__PURE__ */ s.jsx(
          Ae,
          {
            title: "Timeline Events",
            description: "Manage worldbuilding timeline",
            icon: Nr,
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
            icon: kr,
            href: "/account/admin/settings",
            color: "gray"
          }
        )
      ] })
    ] })
  ] });
}, Kl = "_zoroHeader_6lzsp_2", Gl = "_logo_6lzsp_16", ql = "_navbar_6lzsp_23", Xl = "_navMenu_6lzsp_27", Zl = "_navLink_6lzsp_39", Jl = "_dropdownMenu_6lzsp_53", Ql = "_dropdownMenuItem_6lzsp_73", ec = "_dropdown_6lzsp_53", tc = "_headerControls_6lzsp_96", sc = "_searchForm_6lzsp_121", rc = "_themeToggle_6lzsp_165", nc = "_icon_6lzsp_186", ic = "_iconSun_6lzsp_197", oc = "_iconMoon_6lzsp_203", le = {
  zoroHeader: Kl,
  logo: Gl,
  navbar: ql,
  navMenu: Xl,
  navLink: Zl,
  dropdownMenu: Jl,
  dropdownMenuItem: Ql,
  dropdown: ec,
  headerControls: tc,
  searchForm: sc,
  themeToggle: rc,
  icon: nc,
  iconSun: ic,
  iconMoon: oc
}, Cn = "zoro-theme", ac = () => {
  const [e, t] = P(() => {
    if (typeof window < "u") {
      const n = localStorage.getItem(Cn), i = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return n ?? (i ? "dark" : "light");
    }
    return "dark";
  });
  pe(() => {
    const n = window.document.documentElement;
    n.setAttribute("data-theme", e), localStorage.setItem(Cn, e), e === "dark" ? (n.classList.add("dark"), n.classList.remove("light")) : (n.classList.add("light"), n.classList.remove("dark"));
  }, [e]);
  const r = () => {
    t((n) => n === "dark" ? "light" : "dark");
  };
  return s.jsxs("button", { id: "theme-toggle", className: le.themeToggle, "aria-label": "Toggle dark mode", "aria-pressed": e === "dark" ? "true" : "false", title: e === "dark" ? "Switch to light mode" : "Switch to dark mode", onClick: r, children: [s.jsxs("svg", { className: `${le.icon} ${le.iconSun}`, viewBox: "0 0 24 24", width: "22", height: "22", "aria-hidden": "true", children: [s.jsx("circle", { cx: "12", cy: "12", r: "4", fill: "currentColor" }), s.jsxs("g", { stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: [s.jsx("line", { x1: "12", y1: "2", x2: "12", y2: "5" }), s.jsx("line", { x1: "12", y1: "19", x2: "12", y2: "22" }), s.jsx("line", { x1: "2", y1: "12", x2: "5", y2: "12" }), s.jsx("line", { x1: "19", y1: "12", x2: "22", y2: "12" }), s.jsx("line", { x1: "4.2", y1: "4.2", x2: "6.3", y2: "6.3" }), s.jsx("line", { x1: "17.7", y1: "17.7", x2: "19.8", y2: "19.8" }), s.jsx("line", { x1: "4.2", y1: "19.8", x2: "6.3", y2: "17.7" }), s.jsx("line", { x1: "17.7", y1: "6.3", x2: "19.8", y2: "4.2" })] })] }), s.jsx("svg", { className: `${le.icon} ${le.iconMoon}`, viewBox: "0 0 24 24", width: "22", height: "22", "aria-hidden": "true", children: s.jsx("path", { d: `M21 14.5a9 9 0 1 1-8.5-12
                 a8 8 0 0 0 8.5 12z`, fill: "currentColor" }) })] });
}, lc = ({
  isAuthenticated: e = !1,
  betaApplicationStatus: t = "none",
  onLogout: r
}) => {
  const [n, i] = P(!1), a = () => {
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
  return /* @__PURE__ */ s.jsxs("header", { className: le.zoroHeader, children: [
    /* @__PURE__ */ s.jsx("div", { className: le.logo, children: /* @__PURE__ */ s.jsx(cs, { to: "/", children: /* @__PURE__ */ s.jsx("h1", { children: "Zoroasterverse" }) }) }),
    /* @__PURE__ */ s.jsxs("div", { className: le.headerControls, children: [
      /* @__PURE__ */ s.jsxs("form", { className: le.searchForm, children: [
        /* @__PURE__ */ s.jsx("input", { type: "text", placeholder: "Search..." }),
        /* @__PURE__ */ s.jsx("button", { type: "submit", children: /* @__PURE__ */ s.jsx(bt, {}) })
      ] }),
      /* @__PURE__ */ s.jsx(ac, {})
    ] }),
    /* @__PURE__ */ s.jsx("nav", { className: le.navbar, children: /* @__PURE__ */ s.jsx("ul", { className: le.navMenu, children: o.map((l) => /* @__PURE__ */ s.jsxs("li", { className: l.children ? le.dropdown : "", children: [
      l.onClick ? /* @__PURE__ */ s.jsx("button", { onClick: l.onClick, className: le.navLink, children: l.name }) : /* @__PURE__ */ s.jsxs(cs, { to: l.path, className: le.navLink, children: [
        l.name,
        " ",
        l.children ? "▾" : ""
      ] }),
      l.children && /* @__PURE__ */ s.jsx("ul", { className: le.dropdownMenu, children: l.children.map((c) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx(cs, { to: c.path, className: le.dropdownMenuItem, children: c.name }) }, c.name)) })
    ] }, l.name)) }) })
  ] });
}, cc = "_zoroFooter_8qpog_1", dc = "_footerContent_8qpog_8", uc = "_footerColumns_8qpog_13", hc = "_column_8qpog_20", mc = "_socialIcons_8qpog_50", fc = "_footerQuote_8qpog_59", Ve = {
  zoroFooter: cc,
  footerContent: dc,
  footerColumns: uc,
  column: hc,
  socialIcons: mc,
  footerQuote: fc
}, gc = () => /* @__PURE__ */ s.jsx("footer", { className: Ve.zoroFooter, children: /* @__PURE__ */ s.jsxs("div", { className: Ve.footerContent, children: [
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
        /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("a", { href: "#", children: /* @__PURE__ */ s.jsx(Nl, {}) }) }),
        /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("a", { href: "#", children: /* @__PURE__ */ s.jsx(kl, {}) }) }),
        /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("a", { href: "#", children: /* @__PURE__ */ s.jsx(Tl, {}) }) })
      ] })
    ] })
  ] }),
  /* @__PURE__ */ s.jsx("div", { className: Ve.footerQuote, children: /* @__PURE__ */ s.jsx("em", { children: "“Let your conscience be the altar where right intention dwells.”" }) })
] }) }), ug = ({
  isAuthenticated: e = !1,
  betaApplicationStatus: t = "none",
  onLogout: r
}) => /* @__PURE__ */ s.jsxs("div", { className: "min-h-screen flex flex-col", children: [
  /* @__PURE__ */ s.jsx(
    lc,
    {
      isAuthenticated: e,
      betaApplicationStatus: t,
      onLogout: r
    }
  ),
  /* @__PURE__ */ s.jsx("main", { className: "flex-1", children: /* @__PURE__ */ s.jsx(pl, {}) }),
  /* @__PURE__ */ s.jsx(gc, {})
] }), pc = "_zrHero_14v3a_1", xc = "_parchmentCard_14v3a_12", yc = "_zrHeroContent_14v3a_70", bc = "_zrTitle_14v3a_74", vc = "_zrQuote_14v3a_88", wc = "_zrIntro_14v3a_97", jc = "_zrCta_14v3a_105", Nc = "_zrHeroArt_14v3a_123", kc = "_videoFire_14v3a_156", Tc = "_prophecyMask_14v3a_168", Sc = "_prophecyReel_14v3a_183", Cc = "_prophecyItem_14v3a_193", _c = "_englishText_14v3a_203", Pc = "_spinsIndicator_14v3a_212", Ac = "_spinDot_14v3a_221", Ec = "_spinDotActive_14v3a_230", Mc = "_zrSection_14v3a_237", Dc = "_zrH2_14v3a_243", H = {
  zrHero: pc,
  parchmentCard: xc,
  zrHeroContent: yc,
  zrTitle: bc,
  zrQuote: vc,
  zrIntro: wc,
  zrCta: jc,
  zrHeroArt: Nc,
  videoFire: kc,
  prophecyMask: Tc,
  prophecyReel: Sc,
  prophecyItem: Cc,
  englishText: _c,
  spinsIndicator: Pc,
  spinDot: Ac,
  spinDotActive: Ec,
  zrSection: Mc,
  zrH2: Dc
}, Rc = ({ spinsLeft: e, setSpinsLeft: t, onSpin: r }) => {
  const n = ht(null), [i, a] = P(!1), o = 150, l = [
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
      new Audio("/gear-click-351962.mp3").play().catch((v) => console.error("Error playing sound:", v));
    } catch (C) {
      console.error("Error creating Audio object:", C);
    }
    if (a(!0), t((C) => C - 1), r)
      try {
        await r(3 - e + 1);
      } catch (C) {
        console.error("Error updating spin count:", C);
      }
    const p = Math.floor(Math.random() * l.length), k = (u + p + l.length * Math.floor(c / 2)) * o;
    n.current.classList.add("prophecy-reel-spinning"), n.current.style.transform = `translateY(-${k}px)`, setTimeout(() => {
      if (!n.current) return;
      n.current.classList.remove("prophecy-reel-spinning"), n.current.style.transition = "none";
      const C = p * o;
      n.current.style.transform = `translateY(-${C}px)`, n.current.offsetHeight, n.current.style.transition = "transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)", a(!1);
    }, 1600);
  };
  return /* @__PURE__ */ s.jsx(s.Fragment, { children: /* @__PURE__ */ s.jsx("div", { className: H.prophecyMask, onClick: f, children: /* @__PURE__ */ s.jsx("div", { ref: n, className: H.prophecyReel, children: h.map((p, y) => /* @__PURE__ */ s.jsx("div", { className: H.prophecyItem, children: /* @__PURE__ */ s.jsx("span", { className: H.englishText, children: p.english }) }, y)) }) }) });
}, Lc = ({ contentMap: e, spinsLeft: t, setSpinsLeft: r, onSpin: n }) => {
  var l, c, u;
  const i = ((l = e.get("hero_title")) == null ? void 0 : l.content) || "Zoroasterverse", a = ((c = e.get("hero_quote")) == null ? void 0 : c.content) || "“Happiness comes to them who bring happiness to others.”", o = ((u = e.get("hero_description")) == null ? void 0 : u.content) || "Learn about the teachings of the prophet Zarathustra, the history of one of the world’s oldest religions, and the principles of Good Thoughts, Good Words, and Good Deeds.";
  return /* @__PURE__ */ s.jsxs("section", { id: "home", className: H.zrHero, children: [
    /* @__PURE__ */ s.jsxs("div", { className: H.zrHeroContent, children: [
      /* @__PURE__ */ s.jsx("h1", { className: H.zrTitle, children: i }),
      /* @__PURE__ */ s.jsx("p", { className: H.zrQuote, children: a }),
      /* @__PURE__ */ s.jsx("p", { className: H.zrIntro, children: o }),
      /* @__PURE__ */ s.jsx(yt, { className: H.zrCta, to: "/blog/about", children: "Learn More" })
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
      /* @__PURE__ */ s.jsx(Rc, { spinsLeft: t, setSpinsLeft: r, onSpin: n }),
      /* @__PURE__ */ s.jsx("figcaption", { id: "art-caption", className: "sr-only", children: "A stylized winged figure above a sacred fire." })
    ] })
  ] });
}, Vc = ({ posts: e }) => /* @__PURE__ */ s.jsxs("section", { className: H.zrSection, children: [
  /* @__PURE__ */ s.jsx("h2", { className: H.zrH2, children: "Latest News & Updates" }),
  /* @__PURE__ */ s.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: e.map((t) => {
    const r = t.content.length > 100 ? t.content.substring(0, 100) + "..." : t.content;
    return /* @__PURE__ */ s.jsxs("div", { className: H.parchmentCard, children: [
      /* @__PURE__ */ s.jsx("h3", { children: t.title }),
      /* @__PURE__ */ s.jsx("p", { className: "mt-2", dangerouslySetInnerHTML: { __html: r } }),
      /* @__PURE__ */ s.jsx(yt, { to: `/blog/${t.slug}`, className: "mt-4 inline-block", children: "Read More" })
    ] }, t.id);
  }) })
] }), Fc = ({ releases: e }) => /* @__PURE__ */ s.jsxs("section", { className: H.zrSection, children: [
  /* @__PURE__ */ s.jsx("h2", { className: H.zrH2, children: "Latest Releases" }),
  /* @__PURE__ */ s.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: e.map((t) => /* @__PURE__ */ s.jsxs("div", { className: H.parchmentCard, children: [
    /* @__PURE__ */ s.jsx("h3", { children: t.title }),
    /* @__PURE__ */ s.jsxs("p", { className: "mt-2", children: [
      "Type: ",
      t.type
    ] }),
    /* @__PURE__ */ s.jsx("a", { href: t.link || "#", className: "mt-4 inline-block", children: "View Details / Purchase" })
  ] }, t.id)) })
] }), hg = ({
  homepageData: e = [],
  latestPosts: t = [],
  releaseData: r = [],
  spinsLeft: n = 0,
  isLoading: i = !1,
  isError: a = !1,
  onSpin: o
}) => {
  var d, h, f, p;
  const [l, c] = P(n);
  if (i) return /* @__PURE__ */ s.jsx("div", { className: "text-center py-8", children: "Loading homepage content..." });
  if (a) return /* @__PURE__ */ s.jsx("div", { className: "text-center py-8 text-red-400", children: "Error loading homepage content." });
  const u = new Map(e == null ? void 0 : e.map((y) => [y.section, y]));
  return /* @__PURE__ */ s.jsxs("div", { children: [
    /* @__PURE__ */ s.jsx(Lc, { contentMap: u, spinsLeft: l, setSpinsLeft: c, onSpin: o }),
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
    /* @__PURE__ */ s.jsx(Vc, { posts: t || [] }),
    /* @__PURE__ */ s.jsx(Fc, { releases: r || [] }),
    /* @__PURE__ */ s.jsxs("section", { className: H.zrSection, children: [
      /* @__PURE__ */ s.jsx("h2", { className: H.zrH2, children: "Artist Collaboration" }),
      /* @__PURE__ */ s.jsxs("div", { className: "relative rounded-lg shadow-lg overflow-hidden w-full", children: [
        /* @__PURE__ */ s.jsx("img", { src: "/images/invite_to_Colab_card.png", alt: "Artist Collaboration Invitation", className: "w-full h-full object-contain" }),
        /* @__PURE__ */ s.jsxs("div", { className: "absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-8", children: [
          /* @__PURE__ */ s.jsx("h3", { className: "text-2xl font-bold text-white mb-4 text-shadow-md", children: "Join Our Creative Team!" }),
          /* @__PURE__ */ s.jsx("p", { className: "text-white mb-6 text-shadow-sm", children: "We're looking for talented artists to help shape the visual identity of the Zangar/Spandam Series. Explore revenue-share opportunities and bring your vision to life." }),
          /* @__PURE__ */ s.jsx(yt, { to: "/artist-collaboration", className: "inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105", children: "Apply Now" })
        ] })
      ] })
    ] })
  ] });
}, mg = ({ children: e, icon: t, variant: r = "primary", className: n = "", onClick: i, type: a = "button" }) => {
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
        /* @__PURE__ */ s.jsx(Sl, { className: "w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" }),
        /* @__PURE__ */ s.jsx("div", { className: "absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-600/10 via-orange-600/10 to-amber-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-xl" })
      ]
    }
  );
}, fg = () => /* @__PURE__ */ s.jsxs("div", { className: "relative flex items-center justify-center my-12", children: [
  /* @__PURE__ */ s.jsx("div", { className: "h-px w-32 bg-gradient-to-r from-transparent via-amber-600/60 to-transparent" }),
  /* @__PURE__ */ s.jsxs("svg", { width: "80", height: "32", viewBox: "0 0 80 32", className: "mx-4 text-amber-500", children: [
    /* @__PURE__ */ s.jsx("path", { d: "M8 16L16 8L24 16L32 8L40 16L48 8L56 16L64 8L72 16", stroke: "currentColor", strokeWidth: "1", fill: "none" }),
    /* @__PURE__ */ s.jsx("circle", { cx: "16", cy: "8", r: "2", fill: "currentColor" }),
    /* @__PURE__ */ s.jsx("circle", { cx: "40", cy: "16", r: "2", fill: "currentColor" }),
    /* @__PURE__ */ s.jsx("circle", { cx: "64", cy: "8", r: "2", fill: "currentColor" })
  ] }),
  /* @__PURE__ */ s.jsx("div", { className: "h-px w-32 bg-gradient-to-r from-transparent via-amber-600/60 to-transparent" })
] }), gg = () => {
  const [e] = P(
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
function Ic(...e) {
  return Gi(Ki(e));
}
const pg = ({ count: e = 4, viewMode: t = "grid", className: r }) => {
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
      className: Ic(
        t === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4",
        r
      ),
      children: n
    }
  );
}, xg = () => {
  const e = ht(null);
  return pe(() => {
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
}, Oc = ({
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
      yt,
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
      Oc,
      {
        item: h,
        level: r + 1,
        isActive: t,
        onClick: n
      },
      h.slug
    )) })
  ] });
}, yg = () => {
  const { state: e, removeItem: t, updateQuantity: r, clearCart: n } = Il(), [i, a] = P(!1), o = (c, u) => new Intl.NumberFormat("en-US", {
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
              children: /* @__PURE__ */ s.jsx(Cl, { className: "w-4 h-4" })
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
              children: /* @__PURE__ */ s.jsx(Ss, { className: "w-4 h-4" })
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
}, bg = () => {
  const [e, t] = P("login"), [r, n] = P(null), [i, a] = P(!1), [o, l] = P(""), [c, u] = P(""), [d, h] = P(""), [f, p] = P(""), [y, k] = P(""), [C, v] = P(""), [j, _] = P(null), D = Hi(), A = (x, E = "info") => {
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
      const { error: E } = await oe.auth.signInWithPassword({
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
      const { error: E } = await oe.auth.signUp({
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
  }, T = (x) => {
    if (!x) {
      _(null);
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
    _(b[L]);
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
      /* @__PURE__ */ s.jsx("div", { className: "form-footer", children: /* @__PURE__ */ s.jsx(yt, { to: "/forgot-password", children: "Forgot your password?" }) })
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
            onChange: (x) => k(x.target.value),
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
              p(x.target.value), T(x.target.value);
            },
            placeholder: "Create a password",
            required: !0,
            disabled: i
          }
        ),
        j && /* @__PURE__ */ s.jsxs("div", { className: `password-strength ${j.className}`, children: [
          "Password strength: ",
          j.text
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
            onChange: (x) => v(x.target.value),
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
}, vg = () => {
  const [e, t] = P([]), [r, n] = P(!0), [i, a] = P(null), [o, l] = P(""), [c, u] = P("all"), [d, h] = P(!1), [f, p] = P(null), [y, k] = P({
    name: "",
    title: "",
    description: "",
    product_type: "book",
    cover_image_url: "",
    active: !0,
    status: "draft"
  }), [C, v] = P({
    amount: "",
    currency: "USD",
    interval: "",
    nickname: "",
    trial_period_days: 0
  }), j = async () => {
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
  pe(() => {
    j();
  }, []);
  const _ = e.filter((b) => {
    const L = b.name.toLowerCase().includes(o.toLowerCase()) || b.title.toLowerCase().includes(o.toLowerCase()), K = c === "all" || b.product_type === c;
    return L && K;
  }), D = async (b) => {
    b.preventDefault();
    try {
      const L = f ? `/api/products/${f.id}` : "/api/products", se = await fetch(L, {
        method: f ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(y)
      });
      if (!se.ok) {
        const S = await se.json();
        throw new Error(S.message || "Failed to save product");
      }
      await j(), O(), h(!1);
    } catch (L) {
      a(L instanceof Error ? L.message : "Failed to save product");
    }
  }, A = async (b) => {
    if (confirm(`Are you sure you want to delete "${b.name}"? This will deactivate it in Stripe but not permanently delete it.`))
      try {
        if (!(await fetch(`/api/products/${b.id}`, {
          method: "DELETE"
        })).ok) throw new Error("Failed to delete product");
        await j();
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
      await j();
    } catch (L) {
      a(L instanceof Error ? L.message : "Failed to update product");
    }
  }, O = () => {
    k({
      name: "",
      title: "",
      description: "",
      product_type: "book",
      cover_image_url: "",
      active: !0,
      status: "draft"
    }), p(null);
  }, T = (b) => {
    p(b), k({
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
        return /* @__PURE__ */ s.jsx(Yt, { className: "w-4 h-4" });
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
      /* @__PURE__ */ s.jsx(Ot, { className: "w-5 h-5 text-red-500 flex-shrink-0" }),
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
    /* @__PURE__ */ s.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: _.map((b) => /* @__PURE__ */ s.jsxs("div", { className: "bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow", children: [
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
              children: b.active ? /* @__PURE__ */ s.jsx(tt, { className: "w-4 h-4" }) : /* @__PURE__ */ s.jsx(qi, { className: "w-4 h-4" })
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
              onClick: () => T(b),
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
                /* @__PURE__ */ s.jsx(Ss, { className: "w-4 h-4" }),
                "Delete"
              ]
            }
          )
        ] })
      ] })
    ] }, b.id)) }),
    _.length === 0 && !r && /* @__PURE__ */ s.jsxs("div", { className: "text-center py-12", children: [
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
                onChange: (b) => k({ ...y, name: b.target.value }),
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
                onChange: (b) => k({ ...y, title: b.target.value }),
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
              onChange: (b) => k({ ...y, description: b.target.value }),
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
                onChange: (b) => k({ ...y, product_type: b.target.value }),
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
                onChange: (b) => k({ ...y, status: b.target.value }),
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
              onChange: (b) => k({ ...y, cover_image_url: b.target.value }),
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
              onChange: (b) => k({ ...y, active: b.target.checked }),
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
                /* @__PURE__ */ s.jsx(Xi, { className: "w-4 h-4" }),
                f ? "Update Product" : "Create Product"
              ]
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}, wg = () => {
  const [e, t] = P("orders"), [r, n] = P([]), [i, a] = P([]), [o, l] = P(!0), [c, u] = P(null), [d, h] = P(""), [f, p] = P("all"), [y, k] = P("all"), [C, v] = P(null), [j, _] = P(null), D = async () => {
    try {
      const S = await fetch("/api/admin/orders?include_details=true");
      if (!S.ok) throw new Error("Failed to fetch orders");
      const $ = await S.json();
      n($.orders || []);
    } catch (S) {
      u(S instanceof Error ? S.message : "Failed to fetch orders");
    }
  }, A = async () => {
    try {
      const S = await fetch("/api/admin/subscriptions?include_details=true");
      if (!S.ok) throw new Error("Failed to fetch subscriptions");
      const $ = await S.json();
      a($.subscriptions || []);
    } catch (S) {
      u(S instanceof Error ? S.message : "Failed to fetch subscriptions");
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
  pe(() => {
    I();
  }, []);
  const O = r.filter((S) => {
    var B, q, ie, Ne, w;
    const $ = S.id.toLowerCase().includes(d.toLowerCase()) || ((B = S.customer_email) == null ? void 0 : B.toLowerCase().includes(d.toLowerCase())) || ((ie = (q = S.user) == null ? void 0 : q.email) == null ? void 0 : ie.toLowerCase().includes(d.toLowerCase())) || ((w = (Ne = S.product) == null ? void 0 : Ne.title) == null ? void 0 : w.toLowerCase().includes(d.toLowerCase())), U = f === "all" || S.status === f;
    return $ && U;
  }), T = i.filter((S) => {
    var B, q;
    const $ = S.id.toLowerCase().includes(d.toLowerCase()) || S.provider_subscription_id.toLowerCase().includes(d.toLowerCase()) || ((q = (B = S.user) == null ? void 0 : B.email) == null ? void 0 : q.toLowerCase().includes(d.toLowerCase())), U = y === "all" || S.status === y;
    return $ && U;
  }), x = (S, $ = "USD") => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: $.toUpperCase()
  }).format(S / 100), E = (S) => new Date(S).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }), b = (S) => {
    switch (S) {
      case "completed":
        return { color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/20", icon: gt };
      case "pending":
        return { color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/20", icon: Mt };
      case "failed":
        return { color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/20", icon: Et };
      case "cancelled":
        return { color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-900/20", icon: Et };
      case "expired":
        return { color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/20", icon: hs };
      default:
        return { color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-900/20", icon: Mt };
    }
  }, L = (S) => {
    switch (S) {
      case "active":
        return { color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/20", icon: gt };
      case "trialing":
        return { color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/20", icon: Mt };
      case "past_due":
        return { color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/20", icon: hs };
      case "canceled":
        return { color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/20", icon: Et };
      default:
        return { color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-900/20", icon: Mt };
    }
  }, K = async (S) => {
    if (confirm("Are you sure you want to issue a refund for this order?"))
      try {
        if (!(await fetch(`/api/admin/orders/${S}/refund`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        })).ok) throw new Error("Failed to process refund");
        await D(), v(null);
      } catch ($) {
        u($ instanceof Error ? $.message : "Failed to process refund");
      }
  }, se = async (S) => {
    if (confirm("Are you sure you want to cancel this subscription?"))
      try {
        if (!(await fetch(`/api/admin/subscriptions/${S}/cancel`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        })).ok) throw new Error("Failed to cancel subscription");
        await A(), _(null);
      } catch ($) {
        u($ instanceof Error ? $.message : "Failed to cancel subscription");
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
            onChange: (S) => h(S.target.value),
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
            onChange: (S) => {
              e === "orders" ? p(S.target.value) : k(S.target.value);
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
    ] }) : /* @__PURE__ */ s.jsx("div", { className: "grid gap-4", children: O.map((S) => {
      var B, q;
      const $ = b(S.status), U = $.icon;
      return /* @__PURE__ */ s.jsx("div", { className: "bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow", children: /* @__PURE__ */ s.jsx("div", { className: "flex items-start justify-between", children: /* @__PURE__ */ s.jsxs("div", { className: "flex-1 space-y-3", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ s.jsxs("h3", { className: "text-lg font-semibold text-foreground", children: [
              "Order #",
              S.id.slice(-8)
            ] }),
            /* @__PURE__ */ s.jsxs("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${$.bg} ${$.color}`, children: [
              /* @__PURE__ */ s.jsx(U, { className: "w-3 h-3 mr-1" }),
              S.status
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ s.jsx("p", { className: "text-lg font-bold text-foreground", children: x(S.amount_cents, S.currency) }),
            /* @__PURE__ */ s.jsx("p", { className: "text-sm text-muted-foreground", children: E(S.created_at) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ s.jsx(wn, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ s.jsx("span", { className: "text-foreground", children: S.customer_email || ((B = S.user) == null ? void 0 : B.email) || "No email" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ s.jsx(Ze, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ s.jsx("span", { className: "text-foreground", children: ((q = S.product) == null ? void 0 : q.title) || "Unknown Product" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ s.jsx(jn, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ s.jsxs("span", { className: "text-foreground capitalize", children: [
              S.provider,
              " Payment"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between pt-3 border-t border-border", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ s.jsxs(
              "button",
              {
                onClick: () => v(S),
                className: "text-primary hover:text-primary-dark flex items-center gap-2 text-sm font-medium",
                children: [
                  /* @__PURE__ */ s.jsx(tt, { className: "w-4 h-4" }),
                  "View Details"
                ]
              }
            ),
            S.status === "completed" && /* @__PURE__ */ s.jsxs(
              "button",
              {
                onClick: () => K(S.id),
                className: "text-orange-600 hover:text-orange-700 flex items-center gap-2 text-sm font-medium",
                children: [
                  /* @__PURE__ */ s.jsx(Tr, { className: "w-4 h-4" }),
                  "Refund"
                ]
              }
            )
          ] }),
          S.provider_payment_intent_id && /* @__PURE__ */ s.jsxs(
            "button",
            {
              onClick: () => window.open(`https://dashboard.stripe.com/payments/${S.provider_payment_intent_id}`, "_blank"),
              className: "text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm",
              children: [
                /* @__PURE__ */ s.jsx(Nn, { className: "w-4 h-4" }),
                "View in Stripe"
              ]
            }
          )
        ] })
      ] }) }) }, S.id);
    }) }) }),
    e === "subscriptions" && /* @__PURE__ */ s.jsx("div", { className: "space-y-4", children: T.length === 0 ? /* @__PURE__ */ s.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ s.jsx(Yt, { className: "w-16 h-16 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "No subscriptions found" }),
      /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground", children: d || y !== "all" ? "Try adjusting your search or filters" : "Subscriptions will appear here when customers subscribe" })
    ] }) : /* @__PURE__ */ s.jsx("div", { className: "grid gap-4", children: T.map((S) => {
      var B, q;
      const $ = L(S.status), U = $.icon;
      return /* @__PURE__ */ s.jsx("div", { className: "bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow", children: /* @__PURE__ */ s.jsx("div", { className: "flex items-start justify-between", children: /* @__PURE__ */ s.jsxs("div", { className: "flex-1 space-y-3", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ s.jsxs("h3", { className: "text-lg font-semibold text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ s.jsx(Yt, { className: "w-5 h-5 text-primary" }),
              "Subscription #",
              S.id.slice(-8)
            ] }),
            /* @__PURE__ */ s.jsxs("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${$.bg} ${$.color}`, children: [
              /* @__PURE__ */ s.jsx(U, { className: "w-3 h-3 mr-1" }),
              S.status
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ s.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "Created ",
              E(S.created_at)
            ] }),
            S.current_period_end && /* @__PURE__ */ s.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "Next billing: ",
              E(S.current_period_end)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ s.jsx(wn, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ s.jsx("span", { className: "text-foreground", children: ((B = S.user) == null ? void 0 : B.email) || "No email" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ s.jsx(Nr, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ s.jsxs("span", { className: "text-foreground", children: [
              ((q = S.plan) == null ? void 0 : q.interval) || "Unknown",
              " billing"
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ s.jsx(jn, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ s.jsxs("span", { className: "text-foreground capitalize", children: [
              S.provider,
              " Subscription"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between pt-3 border-t border-border", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ s.jsxs(
              "button",
              {
                onClick: () => _(S),
                className: "text-primary hover:text-primary-dark flex items-center gap-2 text-sm font-medium",
                children: [
                  /* @__PURE__ */ s.jsx(tt, { className: "w-4 h-4" }),
                  "View Details"
                ]
              }
            ),
            S.status === "active" && !S.cancel_at_period_end && /* @__PURE__ */ s.jsxs(
              "button",
              {
                onClick: () => se(S.id),
                className: "text-red-600 hover:text-red-700 flex items-center gap-2 text-sm font-medium",
                children: [
                  /* @__PURE__ */ s.jsx(Et, { className: "w-4 h-4" }),
                  "Cancel"
                ]
              }
            )
          ] }),
          S.provider_subscription_id && /* @__PURE__ */ s.jsxs(
            "button",
            {
              onClick: () => window.open(`https://dashboard.stripe.com/subscriptions/${S.provider_subscription_id}`, "_blank"),
              className: "text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm",
              children: [
                /* @__PURE__ */ s.jsx(Nn, { className: "w-4 h-4" }),
                "View in Stripe"
              ]
            }
          )
        ] })
      ] }) }) }, S.id);
    }) }) })
  ] });
}, jg = () => {
  const [e, t] = P([]), [r, n] = P(null), [i, a] = P(!0), [o, l] = P(null), [c, u] = P(""), [d, h] = P("all"), [f, p] = P("sales"), [y, k] = P("desc"), C = async () => {
    try {
      const x = await fetch("/api/admin/inventory");
      if (!x.ok) throw new Error("Failed to fetch inventory data");
      const E = await x.json();
      t(E.inventory || []);
    } catch (x) {
      l(x instanceof Error ? x.message : "Failed to fetch inventory");
    }
  }, v = async () => {
    try {
      const x = await fetch("/api/admin/metrics");
      if (!x.ok) throw new Error("Failed to fetch metrics");
      const E = await x.json();
      n(E.metrics);
    } catch (x) {
      l(x instanceof Error ? x.message : "Failed to fetch metrics");
    }
  }, j = async () => {
    try {
      a(!0), l(null), await Promise.all([C(), v()]);
    } catch {
      l("Failed to fetch data");
    } finally {
      a(!1);
    }
  };
  pe(() => {
    j();
  }, []);
  const _ = e.filter((x) => {
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
        return /* @__PURE__ */ s.jsx(Yt, { className: "w-4 h-4" });
      case "bundle":
        return /* @__PURE__ */ s.jsx(ss, { className: "w-4 h-4" });
      default:
        return /* @__PURE__ */ s.jsx(Ye, { className: "w-4 h-4" });
    }
  }, T = (x, E) => {
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
          onClick: j,
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
        /* @__PURE__ */ s.jsx("div", { className: "w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ s.jsx(Tr, { className: "w-6 h-6 text-green-600" }) })
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
        /* @__PURE__ */ s.jsx("div", { className: "w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ s.jsx(Yt, { className: "w-6 h-6 text-purple-600" }) })
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
              p(E), k(b);
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
      /* @__PURE__ */ s.jsx("tbody", { className: "divide-y divide-border", children: _.length === 0 ? /* @__PURE__ */ s.jsx("tr", { children: /* @__PURE__ */ s.jsxs("td", { colSpan: 8, className: "px-6 py-12 text-center", children: [
        /* @__PURE__ */ s.jsx(ss, { className: "w-12 h-12 text-muted-foreground mx-auto mb-3" }),
        /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-medium text-foreground mb-1", children: "No products found" }),
        /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground", children: c || d !== "all" ? "Try adjusting your search or filters" : "Products will appear here once they have sales data" })
      ] }) }) : _.map((x) => {
        const E = T(x.recent_sales, x.total_sales - x.recent_sales), b = E.icon;
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
}, Ng = () => {
  const [e, t] = P([]), [r, n] = P([]), [i, a] = P(!0), [o, l] = P(null), [c, u] = P("works"), [d, h] = P(""), [f, p] = P("all"), [y, k] = P("all"), [C, v] = P(!1), [j, _] = P(null), [D, A] = P(null), [I, O] = P(!1), [T, x] = P({
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
      const ue = await X.json();
      n(ue.chapters || []);
    } catch (R) {
      l(R instanceof Error ? R.message : "Failed to fetch chapters");
    }
  };
  pe(() => {
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
    const R = g.title.toLowerCase().includes(d.toLowerCase()) || ((ye = g.description) == null ? void 0 : ye.toLowerCase().includes(d.toLowerCase())), X = f === "all" || g.status === f, ue = y === "all" || g.type === y;
    return R && X && ue;
  }), K = D ? r.filter((g) => g.work_id === D.id) : r, se = async (g) => {
    g.preventDefault();
    try {
      const R = j ? `/api/admin/works/${j.id}` : "/api/admin/works", ue = await fetch(R, {
        method: j ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...T,
          progress_percentage: T.progress_percentage || 0,
          target_word_count: T.target_word_count || null
        })
      });
      if (!ue.ok) {
        const ye = await ue.json();
        throw new Error(ye.message || "Failed to save work");
      }
      await E(), S(), v(!1);
    } catch (R) {
      l(R instanceof Error ? R.message : "Failed to save work");
    }
  }, S = () => {
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
    }), _(null);
  }, $ = (g) => {
    _(g), x({
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
    }), v(!0);
  }, U = async (g) => {
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
        return { color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/20", icon: gt };
      case "writing":
        return { color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/20", icon: us };
      case "editing":
        return { color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/20", icon: kr };
      case "planning":
        return { color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/20", icon: Pl };
      case "on_hold":
        return { color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-900/20", icon: _l };
      default:
        return { color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-900/20", icon: Mt };
    }
  }, Ne = (g) => {
    switch (g) {
      case "book":
        return /* @__PURE__ */ s.jsx(Oe, { className: "w-4 h-4" });
      case "volume":
        return /* @__PURE__ */ s.jsx(xs, { className: "w-4 h-4" });
      case "saga":
        return /* @__PURE__ */ s.jsx(Al, { className: "w-4 h-4" });
      case "arc":
        return /* @__PURE__ */ s.jsx(it, { className: "w-4 h-4" });
      case "issue":
        return /* @__PURE__ */ s.jsx(Ye, { className: "w-4 h-4" });
      default:
        return /* @__PURE__ */ s.jsx(Oe, { className: "w-4 h-4" });
    }
  }, w = (g) => new Date(g).toLocaleDateString("en-US", {
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
              S(), v(!0);
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
      /* @__PURE__ */ s.jsx(Ot, { className: "w-5 h-5 text-red-500 flex-shrink-0" }),
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
            onChange: (g) => k(g.target.value),
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
            S(), v(!0);
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
              g.is_featured && /* @__PURE__ */ s.jsx(Js, { className: "w-4 h-4 text-yellow-500 fill-current" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "text-right text-sm text-muted-foreground", children: [
              /* @__PURE__ */ s.jsxs("p", { children: [
                "Updated ",
                w(g.updated_at)
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
              /* @__PURE__ */ s.jsx("span", { className: "ml-2 text-foreground", children: w(g.release_date) })
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
                  /* @__PURE__ */ s.jsx(Js, { className: "w-3 h-3" }),
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
                onClick: () => $(g),
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
                onClick: () => U(g),
                className: "text-red-500 hover:text-red-600 flex items-center gap-2 text-sm font-medium",
                children: [
                  /* @__PURE__ */ s.jsx(Ss, { className: "w-4 h-4" }),
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
            K.length,
            " chapters • ",
            K.filter((g) => g.is_published).length,
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
      K.length === 0 ? /* @__PURE__ */ s.jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ s.jsx(Ye, { className: "w-16 h-16 text-muted-foreground mx-auto mb-4" }),
        /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "No chapters found" }),
        /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground mb-4", children: D ? `No chapters uploaded for "${D.title}" yet` : "Select a work to view its chapters or upload new content" })
      ] }) : /* @__PURE__ */ s.jsx("div", { className: "grid gap-3", children: K.sort((g, R) => g.chapter_number - R.chapter_number).map((g) => /* @__PURE__ */ s.jsxs("div", { className: "bg-card border border-border rounded-lg p-4 flex items-center justify-between", children: [
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
              w(g.updated_at)
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
              children: g.is_published ? /* @__PURE__ */ s.jsx(tt, { className: "w-4 h-4" }) : /* @__PURE__ */ s.jsx(qi, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ s.jsx("button", { className: "p-2 text-primary hover:bg-primary/10 rounded-lg", children: /* @__PURE__ */ s.jsx(us, { className: "w-4 h-4" }) })
        ] })
      ] }, g.id)) })
    ] }),
    C && /* @__PURE__ */ s.jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ s.jsxs("div", { className: "bg-background rounded-xl shadow-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between p-6 border-b border-border", children: [
        /* @__PURE__ */ s.jsx("h2", { className: "text-xl font-semibold text-foreground", children: j ? "Edit Work" : "Create New Work" }),
        /* @__PURE__ */ s.jsx(
          "button",
          {
            onClick: () => {
              v(!1), S();
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
                value: T.title,
                onChange: (g) => x({ ...T, title: g.target.value }),
                className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              }
            )
          ] }),
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Type" }),
            /* @__PURE__ */ s.jsxs(
              "select",
              {
                value: T.type,
                onChange: (g) => x({ ...T, type: g.target.value }),
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
              value: T.description,
              onChange: (g) => x({ ...T, description: g.target.value }),
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
                value: T.status,
                onChange: (g) => x({ ...T, status: g.target.value }),
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
                value: T.progress_percentage,
                onChange: (g) => x({ ...T, progress_percentage: parseInt(g.target.value) || 0 }),
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
                value: T.release_date,
                onChange: (g) => x({ ...T, release_date: g.target.value }),
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
                value: T.estimated_release,
                onChange: (g) => x({ ...T, estimated_release: g.target.value }),
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
              value: T.cover_image_url,
              onChange: (g) => x({ ...T, cover_image_url: g.target.value }),
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
              value: T.target_word_count || "",
              onChange: (g) => x({ ...T, target_word_count: g.target.value ? parseInt(g.target.value) : void 0 }),
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
                checked: T.is_featured,
                onChange: (g) => x({ ...T, is_featured: g.target.checked }),
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
                checked: T.is_premium,
                onChange: (g) => x({ ...T, is_premium: g.target.checked }),
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
                checked: T.is_free,
                onChange: (g) => x({ ...T, is_free: g.target.checked }),
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
                v(!1), S();
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
                /* @__PURE__ */ s.jsx(Xi, { className: "w-4 h-4" }),
                j ? "Update Work" : "Create Work"
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
}, kg = () => {
  const [e, t] = P("upload"), [r, n] = P("chapter"), [i, a] = P([]), [o, l] = P([]), [c, u] = P(!1), [d, h] = P(null), [f, p] = P(null), [y, k] = P(""), [C, v] = P("all"), [j, _] = P(null), [D, A] = P(!1), [I, O] = P({}), [T, x] = P({
    work_id: "",
    chapter_title: "",
    chapter_number: 1,
    is_published: !1
  });
  pe(() => {
    E(), b();
  }, []);
  const E = async () => {
    try {
      const w = await fetch("/api/admin/works");
      if (w.ok) {
        const g = await w.json();
        a(g.works || []);
      }
    } catch (w) {
      console.error("Failed to fetch works:", w);
    }
  }, b = async () => {
    try {
      u(!0);
      const w = await fetch("/api/admin/media");
      if (w.ok) {
        const g = await w.json();
        l(g.files || []);
      }
    } catch {
      h("Failed to fetch media files");
    } finally {
      u(!1);
    }
  }, L = (w) => {
    w.target.files && _(w.target.files);
  }, K = (w) => {
    w.preventDefault(), w.stopPropagation(), w.type === "dragenter" || w.type === "dragover" ? A(!0) : w.type === "dragleave" && A(!1);
  }, se = (w) => {
    w.preventDefault(), w.stopPropagation(), A(!1), w.dataTransfer.files && w.dataTransfer.files[0] && _(w.dataTransfer.files);
  }, S = async () => {
    var w, g;
    if (!j || j.length === 0) {
      h("Please select a file to upload");
      return;
    }
    if (!T.work_id || !T.chapter_title) {
      h("Please fill in all required chapter information");
      return;
    }
    u(!0), h(null), p(null);
    try {
      const R = new FormData();
      R.append("file", j[0]), R.append("title", T.chapter_title), R.append("chapter_number", T.chapter_number.toString()), R.append("book_id", T.work_id), R.append("is_published", T.is_published.toString());
      const { data: { session: X }, error: ue } = await ((g = (w = window.supabase) == null ? void 0 : w.auth) == null ? void 0 : g.getSession());
      if (ue || !X)
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
      p(`Chapter "${T.chapter_title}" uploaded successfully!`), _(null), x({
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
  }, $ = async () => {
    if (!j || j.length === 0) {
      h("Please select files to upload");
      return;
    }
    u(!0), h(null), p(null);
    try {
      const w = Array.from(j).map(async (g, R) => {
        const X = new FormData();
        X.append("file", g), X.append("type", "media");
        const ue = await fetch("/api/admin/media/upload", {
          method: "POST",
          body: X
        });
        if (!ue.ok)
          throw new Error(`Failed to upload ${g.name}`);
        return ue.json();
      });
      await Promise.all(w), p(`Successfully uploaded ${j.length} file(s)`), _(null), await b();
    } catch (w) {
      h(w instanceof Error ? w.message : "Failed to upload files");
    } finally {
      u(!1);
    }
  }, U = async (w) => {
    if (confirm("Are you sure you want to delete this file?"))
      try {
        if (!(await fetch(`/api/admin/media/${w}`, {
          method: "DELETE"
        })).ok)
          throw new Error("Failed to delete file");
        p("File deleted successfully"), await b();
      } catch (g) {
        h(g instanceof Error ? g.message : "Failed to delete file");
      }
  }, B = o.filter((w) => {
    var X;
    const g = w.filename.toLowerCase().includes(y.toLowerCase()) || ((X = w.chapter_title) == null ? void 0 : X.toLowerCase().includes(y.toLowerCase()));
    let R = !0;
    if (C !== "all")
      switch (C) {
        case "chapter":
          R = !!(w.work_id && w.chapter_number);
          break;
        case "image":
          R = w.file_type.startsWith("image/");
          break;
        case "video":
          R = w.file_type.startsWith("video/");
          break;
        case "audio":
          R = w.file_type.startsWith("audio/");
          break;
        case "document":
          R = w.file_type.includes("pdf") || w.file_type.includes("document") || w.file_type.includes("text");
          break;
      }
    return g && R;
  }), q = (w) => w.work_id && w.chapter_number ? /* @__PURE__ */ s.jsx(Oe, { className: "w-5 h-5 text-blue-600" }) : w.file_type.startsWith("image/") ? /* @__PURE__ */ s.jsx(kn, { className: "w-5 h-5 text-green-600" }) : w.file_type.startsWith("video/") ? /* @__PURE__ */ s.jsx(Rl, { className: "w-5 h-5 text-purple-600" }) : w.file_type.startsWith("audio/") ? /* @__PURE__ */ s.jsx(Ll, { className: "w-5 h-5 text-pink-600" }) : /* @__PURE__ */ s.jsx(Ye, { className: "w-5 h-5 text-gray-600" }), ie = (w) => {
    if (w === 0) return "0 Bytes";
    const g = 1024, R = ["Bytes", "KB", "MB", "GB"], X = Math.floor(Math.log(w) / Math.log(g));
    return parseFloat((w / Math.pow(g, X)).toFixed(2)) + " " + R[X];
  }, Ne = (w) => new Date(w).toLocaleDateString("en-US", {
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
      /* @__PURE__ */ s.jsx(gt, { className: "w-5 h-5 text-green-500 flex-shrink-0" }),
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
      /* @__PURE__ */ s.jsx(Ot, { className: "w-5 h-5 text-red-500 flex-shrink-0" }),
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
              /* @__PURE__ */ s.jsx(kn, { className: "w-4 h-4 inline mr-2" }),
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
                value: T.work_id,
                onChange: (w) => x({ ...T, work_id: w.target.value }),
                className: "w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                required: !0,
                children: [
                  /* @__PURE__ */ s.jsx("option", { value: "", children: "-- Select a Work --" }),
                  i.map((w) => /* @__PURE__ */ s.jsxs("option", { value: w.id, children: [
                    w.title,
                    " (",
                    w.type,
                    ")"
                  ] }, w.id))
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
                value: T.chapter_number,
                onChange: (w) => x({ ...T, chapter_number: parseInt(w.target.value) || 1 }),
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
              value: T.chapter_title,
              onChange: (w) => x({ ...T, chapter_title: w.target.value }),
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
              checked: T.is_published,
              onChange: (w) => x({ ...T, is_published: w.target.checked }),
              className: "w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            }
          ),
          /* @__PURE__ */ s.jsx("label", { htmlFor: "is_published", className: "ml-2 text-sm font-medium text-foreground", children: "Publish immediately (subscribers will get access)" })
        ] }) }),
        /* @__PURE__ */ s.jsxs(
          "div",
          {
            className: `border-2 border-dashed rounded-xl p-8 text-center transition-colors ${D ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5"}`,
            onDragEnter: K,
            onDragLeave: K,
            onDragOver: K,
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
        j && /* @__PURE__ */ s.jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ s.jsx("h4", { className: "font-medium text-foreground mb-2", children: "Selected File:" }),
          Array.from(j).map((w, g) => /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ s.jsx(Ye, { className: "w-4 h-4 text-gray-500" }),
              /* @__PURE__ */ s.jsx("span", { className: "text-sm font-medium", children: w.name }),
              /* @__PURE__ */ s.jsx("span", { className: "text-xs text-muted-foreground", children: ie(w.size) })
            ] }),
            /* @__PURE__ */ s.jsx(
              "button",
              {
                onClick: () => _(null),
                className: "text-red-500 hover:text-red-600",
                children: /* @__PURE__ */ s.jsx(Ee, { className: "w-4 h-4" })
              }
            )
          ] }, g))
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ s.jsx(
          "button",
          {
            onClick: S,
            disabled: c || !j || !T.work_id || !T.chapter_title,
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
            onDragEnter: K,
            onDragLeave: K,
            onDragOver: K,
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
        j && /* @__PURE__ */ s.jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ s.jsxs("h4", { className: "font-medium text-foreground mb-2", children: [
            "Selected Files (",
            j.length,
            "):"
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "space-y-2 max-h-40 overflow-y-auto", children: Array.from(j).map((w, g) => /* @__PURE__ */ s.jsx("div", { className: "flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg", children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ s.jsx(El, { className: "w-4 h-4 text-gray-500" }),
            /* @__PURE__ */ s.jsx("span", { className: "text-sm font-medium", children: w.name }),
            /* @__PURE__ */ s.jsx("span", { className: "text-xs text-muted-foreground", children: ie(w.size) })
          ] }) }, g)) })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ s.jsx(
          "button",
          {
            onClick: $,
            disabled: c || !j,
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
              onChange: (w) => k(w.target.value),
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
              onChange: (w) => v(w.target.value),
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
        /* @__PURE__ */ s.jsx(Ml, { className: "w-16 h-16 text-muted-foreground mx-auto mb-4" }),
        /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "No files found" }),
        /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground", children: y || C !== "all" ? "Try adjusting your search or filters" : "Upload your first file to get started" })
      ] }) : /* @__PURE__ */ s.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: B.map((w) => {
        var g;
        return /* @__PURE__ */ s.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow", children: [
          /* @__PURE__ */ s.jsx("div", { className: "aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center", children: w.thumbnail_url ? /* @__PURE__ */ s.jsx(
            "img",
            {
              src: w.thumbnail_url,
              alt: w.filename,
              className: "w-full h-full object-cover rounded-lg"
            }
          ) : /* @__PURE__ */ s.jsxs("div", { className: "text-center", children: [
            q(w),
            /* @__PURE__ */ s.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: (g = w.file_type.split("/")[1]) == null ? void 0 : g.toUpperCase() })
          ] }) }),
          /* @__PURE__ */ s.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ s.jsx("h3", { className: "font-medium text-foreground truncate", title: w.filename, children: w.filename }),
            w.work_id && w.chapter_number && /* @__PURE__ */ s.jsxs("div", { className: "text-sm text-muted-foreground", children: [
              /* @__PURE__ */ s.jsxs("p", { children: [
                "Chapter ",
                w.chapter_number,
                ": ",
                w.chapter_title
              ] }),
              /* @__PURE__ */ s.jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${w.is_published ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400"}`, children: w.is_published ? "Published" : "Draft" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
              /* @__PURE__ */ s.jsx("span", { children: ie(w.file_size) }),
              /* @__PURE__ */ s.jsx("span", { children: Ne(w.upload_date) })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between mt-4 pt-3 border-t border-border", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
              w.file_url && /* @__PURE__ */ s.jsx(
                "button",
                {
                  onClick: () => window.open(w.file_url, "_blank"),
                  className: "p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors",
                  title: "View file",
                  children: /* @__PURE__ */ s.jsx(tt, { className: "w-4 h-4" })
                }
              ),
              w.file_url && /* @__PURE__ */ s.jsx(
                "button",
                {
                  onClick: () => {
                    const R = document.createElement("a");
                    R.href = w.file_url, R.download = w.filename, R.click();
                  },
                  className: "p-1.5 text-blue-600 hover:bg-blue-600/10 rounded-lg transition-colors",
                  title: "Download file",
                  children: /* @__PURE__ */ s.jsx(Dl, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ s.jsx(
              "button",
              {
                onClick: () => U(w.id),
                className: "p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors",
                title: "Delete file",
                children: /* @__PURE__ */ s.jsx(Ss, { className: "w-4 h-4" })
              }
            )
          ] })
        ] }, w.id);
      }) })
    ] })
  ] });
};
var to = "basil", Yc = function(t) {
  return t === 3 ? "v3" : t;
}, so = "https://js.stripe.com", Bc = "".concat(so, "/").concat(to, "/stripe.js"), zc = /^https:\/\/js\.stripe\.com\/v3\/?(\?.*)?$/, $c = /^https:\/\/js\.stripe\.com\/(v3|[a-z]+)\/stripe\.js(\?.*)?$/;
var Uc = function(t) {
  return zc.test(t) || $c.test(t);
}, Wc = function() {
  for (var t = document.querySelectorAll('script[src^="'.concat(so, '"]')), r = 0; r < t.length; r++) {
    var n = t[r];
    if (Uc(n.src))
      return n;
  }
  return null;
}, _n = function(t) {
  var r = "", n = document.createElement("script");
  n.src = "".concat(Bc).concat(r);
  var i = document.head || document.body;
  if (!i)
    throw new Error("Expected document.body not to be null. Stripe.js requires a <body> element.");
  return i.appendChild(n), n;
}, Hc = function(t, r) {
  !t || !t._registerWrapper || t._registerWrapper({
    name: "stripe-js",
    version: "7.9.0",
    startTime: r
  });
}, _t = null, ns = null, is = null, Kc = function(t) {
  return function(r) {
    t(new Error("Failed to load Stripe.js", {
      cause: r
    }));
  };
}, Gc = function(t, r) {
  return function() {
    window.Stripe ? t(window.Stripe) : r(new Error("Stripe.js not available"));
  };
}, qc = function(t) {
  return _t !== null ? _t : (_t = new Promise(function(r, n) {
    if (typeof window > "u" || typeof document > "u") {
      r(null);
      return;
    }
    if (window.Stripe) {
      r(window.Stripe);
      return;
    }
    try {
      var i = Wc();
      if (!(i && t)) {
        if (!i)
          i = _n(t);
        else if (i && is !== null && ns !== null) {
          var a;
          i.removeEventListener("load", is), i.removeEventListener("error", ns), (a = i.parentNode) === null || a === void 0 || a.removeChild(i), i = _n(t);
        }
      }
      is = Gc(r, n), ns = Kc(n), i.addEventListener("load", is), i.addEventListener("error", ns);
    } catch (o) {
      n(o);
      return;
    }
  }), _t.catch(function(r) {
    return _t = null, Promise.reject(r);
  }));
}, Xc = function(t, r, n) {
  if (t === null)
    return null;
  var i = r[0], a = i.match(/^pk_test/), o = Yc(t.version), l = to;
  a && o !== l && console.warn("Stripe.js@".concat(o, " was loaded on the page, but @stripe/stripe-js@").concat("7.9.0", " expected Stripe.js@").concat(l, ". This may result in unexpected behavior. For more information, see https://docs.stripe.com/sdks/stripejs-versioning"));
  var c = t.apply(void 0, r);
  return Hc(c, n), c;
}, Pt, ro = !1, no = function() {
  return Pt || (Pt = qc(null).catch(function(t) {
    return Pt = null, Promise.reject(t);
  }), Pt);
};
Promise.resolve().then(function() {
  return no();
}).catch(function(e) {
  ro || console.warn(e);
});
var Zc = function() {
  for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
    r[n] = arguments[n];
  ro = !0;
  var i = Date.now();
  return no().then(function(a) {
    return Xc(a, r, i);
  });
};
const io = $e({});
function Jc(e) {
  const t = ht(null);
  return t.current === null && (t.current = e()), t.current;
}
const Sr = typeof window < "u", Qc = Sr ? ll : pe, Cr = /* @__PURE__ */ $e(null);
function _r(e, t) {
  e.indexOf(t) === -1 && e.push(t);
}
function Pr(e, t) {
  const r = e.indexOf(t);
  r > -1 && e.splice(r, 1);
}
const De = (e, t, r) => r > t ? t : r < e ? e : r;
function tr(e, t) {
  return t ? `${e}. For more information and steps for solving, visit https://motion.dev/troubleshooting/${t}` : e;
}
let vt = () => {
}, Re = () => {
};
process.env.NODE_ENV !== "production" && (vt = (e, t, r) => {
  !e && typeof console < "u" && console.warn(tr(t, r));
}, Re = (e, t, r) => {
  if (!e)
    throw new Error(tr(t, r));
});
const Le = {}, oo = (e) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e);
function ao(e) {
  return typeof e == "object" && e !== null;
}
const lo = (e) => /^0[^.\s]+$/u.test(e);
// @__NO_SIDE_EFFECTS__
function Ar(e) {
  let t;
  return () => (t === void 0 && (t = e()), t);
}
const je = /* @__NO_SIDE_EFFECTS__ */ (e) => e, ed = (e, t) => (r) => t(e(r)), qt = (...e) => e.reduce(ed), zt = /* @__NO_SIDE_EFFECTS__ */ (e, t, r) => {
  const n = t - e;
  return n === 0 ? 1 : (r - e) / n;
};
class Er {
  constructor() {
    this.subscriptions = [];
  }
  add(t) {
    return _r(this.subscriptions, t), () => Pr(this.subscriptions, t);
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
function co(e, t) {
  return t ? e * (1e3 / t) : 0;
}
const Pn = /* @__PURE__ */ new Set();
function Mr(e, t, r) {
  e || Pn.has(t) || (console.warn(tr(t, r)), Pn.add(t));
}
const uo = (e, t, r) => (((1 - 3 * r + 3 * t) * e + (3 * r - 6 * t)) * e + 3 * t) * e, td = 1e-7, sd = 12;
function rd(e, t, r, n, i) {
  let a, o, l = 0;
  do
    o = t + (r - t) / 2, a = uo(o, n, i) - e, a > 0 ? r = o : t = o;
  while (Math.abs(a) > td && ++l < sd);
  return o;
}
function Xt(e, t, r, n) {
  if (e === t && r === n)
    return je;
  const i = (a) => rd(a, 0, 1, e, r);
  return (a) => a === 0 || a === 1 ? a : uo(i(a), t, n);
}
const ho = (e) => (t) => t <= 0.5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2, mo = (e) => (t) => 1 - e(1 - t), fo = /* @__PURE__ */ Xt(0.33, 1.53, 0.69, 0.99), Dr = /* @__PURE__ */ mo(fo), go = /* @__PURE__ */ ho(Dr), po = (e) => (e *= 2) < 1 ? 0.5 * Dr(e) : 0.5 * (2 - Math.pow(2, -10 * (e - 1))), Rr = (e) => 1 - Math.sin(Math.acos(e)), xo = mo(Rr), yo = ho(Rr), nd = /* @__PURE__ */ Xt(0.42, 0, 1, 1), id = /* @__PURE__ */ Xt(0, 0, 0.58, 1), bo = /* @__PURE__ */ Xt(0.42, 0, 0.58, 1), od = (e) => Array.isArray(e) && typeof e[0] != "number", vo = (e) => Array.isArray(e) && typeof e[0] == "number", An = {
  linear: je,
  easeIn: nd,
  easeInOut: bo,
  easeOut: id,
  circIn: Rr,
  circInOut: yo,
  circOut: xo,
  backIn: Dr,
  backInOut: go,
  backOut: fo,
  anticipate: po
}, ad = (e) => typeof e == "string", En = (e) => {
  if (vo(e)) {
    Re(e.length === 4, "Cubic bezier arrays must contain four numerical values.", "cubic-bezier-length");
    const [t, r, n, i] = e;
    return Xt(t, r, n, i);
  } else if (ad(e))
    return Re(An[e] !== void 0, `Invalid easing type '${e}'`, "invalid-easing-type"), An[e];
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
function ld(e, t) {
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
const cd = 40;
function wo(e, t) {
  let r = !1, n = !0;
  const i = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, a = () => r = !0, o = os.reduce((_, D) => (_[D] = ld(a), _), {}), { setup: l, read: c, resolveKeyframes: u, preUpdate: d, update: h, preRender: f, render: p, postRender: y } = o, k = () => {
    const _ = Le.useManualTiming ? i.timestamp : performance.now();
    r = !1, Le.useManualTiming || (i.delta = n ? 1e3 / 60 : Math.max(Math.min(_ - i.timestamp, cd), 1)), i.timestamp = _, i.isProcessing = !0, l.process(i), c.process(i), u.process(i), d.process(i), h.process(i), f.process(i), p.process(i), y.process(i), i.isProcessing = !1, r && t && (n = !1, e(k));
  }, C = () => {
    r = !0, n = !0, i.isProcessing || e(k);
  };
  return { schedule: os.reduce((_, D) => {
    const A = o[D];
    return _[D] = (I, O = !1, T = !1) => (r || C(), A.schedule(I, O, T)), _;
  }, {}), cancel: (_) => {
    for (let D = 0; D < os.length; D++)
      o[os[D]].cancel(_);
  }, state: i, steps: o };
}
const { schedule: Z, cancel: Be, state: ae, steps: Fs } = /* @__PURE__ */ wo(typeof requestAnimationFrame < "u" ? requestAnimationFrame : je, !0);
let ms;
function dd() {
  ms = void 0;
}
const ge = {
  now: () => (ms === void 0 && ge.set(ae.isProcessing || Le.useManualTiming ? ae.timestamp : performance.now()), ms),
  set: (e) => {
    ms = e, queueMicrotask(dd);
  }
}, jo = (e) => (t) => typeof t == "string" && t.startsWith(e), Lr = /* @__PURE__ */ jo("--"), ud = /* @__PURE__ */ jo("var(--"), Vr = (e) => ud(e) ? hd.test(e.split("/*")[0].trim()) : !1, hd = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu, wt = {
  test: (e) => typeof e == "number",
  parse: parseFloat,
  transform: (e) => e
}, $t = {
  ...wt,
  transform: (e) => De(0, 1, e)
}, as = {
  ...wt,
  default: 1
}, Rt = (e) => Math.round(e * 1e5) / 1e5, Fr = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function md(e) {
  return e == null;
}
const fd = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, Ir = (e, t) => (r) => !!(typeof r == "string" && fd.test(r) && r.startsWith(e) || t && !md(r) && Object.prototype.hasOwnProperty.call(r, t)), No = (e, t, r) => (n) => {
  if (typeof n != "string")
    return n;
  const [i, a, o, l] = n.match(Fr);
  return {
    [e]: parseFloat(i),
    [t]: parseFloat(a),
    [r]: parseFloat(o),
    alpha: l !== void 0 ? parseFloat(l) : 1
  };
}, gd = (e) => De(0, 255, e), Is = {
  ...wt,
  transform: (e) => Math.round(gd(e))
}, qe = {
  test: /* @__PURE__ */ Ir("rgb", "red"),
  parse: /* @__PURE__ */ No("red", "green", "blue"),
  transform: ({ red: e, green: t, blue: r, alpha: n = 1 }) => "rgba(" + Is.transform(e) + ", " + Is.transform(t) + ", " + Is.transform(r) + ", " + Rt($t.transform(n)) + ")"
};
function pd(e) {
  let t = "", r = "", n = "", i = "";
  return e.length > 5 ? (t = e.substring(1, 3), r = e.substring(3, 5), n = e.substring(5, 7), i = e.substring(7, 9)) : (t = e.substring(1, 2), r = e.substring(2, 3), n = e.substring(3, 4), i = e.substring(4, 5), t += t, r += r, n += n, i += i), {
    red: parseInt(t, 16),
    green: parseInt(r, 16),
    blue: parseInt(n, 16),
    alpha: i ? parseInt(i, 16) / 255 : 1
  };
}
const sr = {
  test: /* @__PURE__ */ Ir("#"),
  parse: pd,
  transform: qe.transform
}, Zt = /* @__NO_SIDE_EFFECTS__ */ (e) => ({
  test: (t) => typeof t == "string" && t.endsWith(e) && t.split(" ").length === 1,
  parse: parseFloat,
  transform: (t) => `${t}${e}`
}), Fe = /* @__PURE__ */ Zt("deg"), _e = /* @__PURE__ */ Zt("%"), V = /* @__PURE__ */ Zt("px"), xd = /* @__PURE__ */ Zt("vh"), yd = /* @__PURE__ */ Zt("vw"), Mn = {
  ..._e,
  parse: (e) => _e.parse(e) / 100,
  transform: (e) => _e.transform(e * 100)
}, ot = {
  test: /* @__PURE__ */ Ir("hsl", "hue"),
  parse: /* @__PURE__ */ No("hue", "saturation", "lightness"),
  transform: ({ hue: e, saturation: t, lightness: r, alpha: n = 1 }) => "hsla(" + Math.round(e) + ", " + _e.transform(Rt(t)) + ", " + _e.transform(Rt(r)) + ", " + Rt($t.transform(n)) + ")"
}, ne = {
  test: (e) => qe.test(e) || sr.test(e) || ot.test(e),
  parse: (e) => qe.test(e) ? qe.parse(e) : ot.test(e) ? ot.parse(e) : sr.parse(e),
  transform: (e) => typeof e == "string" ? e : e.hasOwnProperty("red") ? qe.transform(e) : ot.transform(e),
  getAnimatableNone: (e) => {
    const t = ne.parse(e);
    return t.alpha = 0, ne.transform(t);
  }
}, bd = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function vd(e) {
  var t, r;
  return isNaN(e) && typeof e == "string" && (((t = e.match(Fr)) == null ? void 0 : t.length) || 0) + (((r = e.match(bd)) == null ? void 0 : r.length) || 0) > 0;
}
const ko = "number", To = "color", wd = "var", jd = "var(", Dn = "${}", Nd = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function Ut(e) {
  const t = e.toString(), r = [], n = {
    color: [],
    number: [],
    var: []
  }, i = [];
  let a = 0;
  const l = t.replace(Nd, (c) => (ne.test(c) ? (n.color.push(a), i.push(To), r.push(ne.parse(c))) : c.startsWith(jd) ? (n.var.push(a), i.push(wd), r.push(c)) : (n.number.push(a), i.push(ko), r.push(parseFloat(c))), ++a, Dn)).split(Dn);
  return { values: r, split: l, indexes: n, types: i };
}
function So(e) {
  return Ut(e).values;
}
function Co(e) {
  const { split: t, types: r } = Ut(e), n = t.length;
  return (i) => {
    let a = "";
    for (let o = 0; o < n; o++)
      if (a += t[o], i[o] !== void 0) {
        const l = r[o];
        l === ko ? a += Rt(i[o]) : l === To ? a += ne.transform(i[o]) : a += i[o];
      }
    return a;
  };
}
const kd = (e) => typeof e == "number" ? 0 : ne.test(e) ? ne.getAnimatableNone(e) : e;
function Td(e) {
  const t = So(e);
  return Co(e)(t.map(kd));
}
const ze = {
  test: vd,
  parse: So,
  createTransformer: Co,
  getAnimatableNone: Td
};
function Os(e, t, r) {
  return r < 0 && (r += 1), r > 1 && (r -= 1), r < 1 / 6 ? e + (t - e) * 6 * r : r < 1 / 2 ? t : r < 2 / 3 ? e + (t - e) * (2 / 3 - r) * 6 : e;
}
function Sd({ hue: e, saturation: t, lightness: r, alpha: n }) {
  e /= 360, t /= 100, r /= 100;
  let i = 0, a = 0, o = 0;
  if (!t)
    i = a = o = r;
  else {
    const l = r < 0.5 ? r * (1 + t) : r + t - r * t, c = 2 * r - l;
    i = Os(c, l, e + 1 / 3), a = Os(c, l, e), o = Os(c, l, e - 1 / 3);
  }
  return {
    red: Math.round(i * 255),
    green: Math.round(a * 255),
    blue: Math.round(o * 255),
    alpha: n
  };
}
function vs(e, t) {
  return (r) => r > 0 ? t : e;
}
const Q = (e, t, r) => e + (t - e) * r, Ys = (e, t, r) => {
  const n = e * e, i = r * (t * t - n) + n;
  return i < 0 ? 0 : Math.sqrt(i);
}, Cd = [sr, qe, ot], _d = (e) => Cd.find((t) => t.test(e));
function Rn(e) {
  const t = _d(e);
  if (vt(!!t, `'${e}' is not an animatable color. Use the equivalent color code instead.`, "color-not-animatable"), !t)
    return !1;
  let r = t.parse(e);
  return t === ot && (r = Sd(r)), r;
}
const Ln = (e, t) => {
  const r = Rn(e), n = Rn(t);
  if (!r || !n)
    return vs(e, t);
  const i = { ...r };
  return (a) => (i.red = Ys(r.red, n.red, a), i.green = Ys(r.green, n.green, a), i.blue = Ys(r.blue, n.blue, a), i.alpha = Q(r.alpha, n.alpha, a), qe.transform(i));
}, rr = /* @__PURE__ */ new Set(["none", "hidden"]);
function Pd(e, t) {
  return rr.has(e) ? (r) => r <= 0 ? e : t : (r) => r >= 1 ? t : e;
}
function Ad(e, t) {
  return (r) => Q(e, t, r);
}
function Or(e) {
  return typeof e == "number" ? Ad : typeof e == "string" ? Vr(e) ? vs : ne.test(e) ? Ln : Dd : Array.isArray(e) ? _o : typeof e == "object" ? ne.test(e) ? Ln : Ed : vs;
}
function _o(e, t) {
  const r = [...e], n = r.length, i = e.map((a, o) => Or(a)(a, t[o]));
  return (a) => {
    for (let o = 0; o < n; o++)
      r[o] = i[o](a);
    return r;
  };
}
function Ed(e, t) {
  const r = { ...e, ...t }, n = {};
  for (const i in r)
    e[i] !== void 0 && t[i] !== void 0 && (n[i] = Or(e[i])(e[i], t[i]));
  return (i) => {
    for (const a in n)
      r[a] = n[a](i);
    return r;
  };
}
function Md(e, t) {
  const r = [], n = { color: 0, var: 0, number: 0 };
  for (let i = 0; i < t.values.length; i++) {
    const a = t.types[i], o = e.indexes[a][n[a]], l = e.values[o] ?? 0;
    r[i] = l, n[a]++;
  }
  return r;
}
const Dd = (e, t) => {
  const r = ze.createTransformer(t), n = Ut(e), i = Ut(t);
  return n.indexes.var.length === i.indexes.var.length && n.indexes.color.length === i.indexes.color.length && n.indexes.number.length >= i.indexes.number.length ? rr.has(e) && !i.values.length || rr.has(t) && !n.values.length ? Pd(e, t) : qt(_o(Md(n, i), i.values), r) : (vt(!0, `Complex values '${e}' and '${t}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`, "complex-values-different"), vs(e, t));
};
function Po(e, t, r) {
  return typeof e == "number" && typeof t == "number" && typeof r == "number" ? Q(e, t, r) : Or(e)(e, t);
}
const Rd = (e) => {
  const t = ({ timestamp: r }) => e(r);
  return {
    start: (r = !0) => Z.update(t, r),
    stop: () => Be(t),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => ae.isProcessing ? ae.timestamp : ge.now()
  };
}, Ao = (e, t, r = 10) => {
  let n = "";
  const i = Math.max(Math.round(t / r), 2);
  for (let a = 0; a < i; a++)
    n += Math.round(e(a / (i - 1)) * 1e4) / 1e4 + ", ";
  return `linear(${n.substring(0, n.length - 2)})`;
}, ws = 2e4;
function Yr(e) {
  let t = 0;
  const r = 50;
  let n = e.next(t);
  for (; !n.done && t < ws; )
    t += r, n = e.next(t);
  return t >= ws ? 1 / 0 : t;
}
function Ld(e, t = 100, r) {
  const n = r({ ...e, keyframes: [0, t] }), i = Math.min(Yr(n), ws);
  return {
    type: "keyframes",
    ease: (a) => n.next(i * a).value / t,
    duration: /* @__PURE__ */ Ce(i)
  };
}
const Vd = 5;
function Eo(e, t, r) {
  const n = Math.max(t - Vd, 0);
  return co(r - e(n), t - n);
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
}, Bs = 1e-3;
function Fd({ duration: e = J.duration, bounce: t = J.bounce, velocity: r = J.velocity, mass: n = J.mass }) {
  let i, a;
  vt(e <= /* @__PURE__ */ Te(J.maxDuration), "Spring duration must be 10 seconds or less", "spring-duration-limit");
  let o = 1 - t;
  o = De(J.minDamping, J.maxDamping, o), e = De(J.minDuration, J.maxDuration, /* @__PURE__ */ Ce(e)), o < 1 ? (i = (u) => {
    const d = u * o, h = d * e, f = d - r, p = nr(u, o), y = Math.exp(-h);
    return Bs - f / p * y;
  }, a = (u) => {
    const h = u * o * e, f = h * r + r, p = Math.pow(o, 2) * Math.pow(u, 2) * e, y = Math.exp(-h), k = nr(Math.pow(u, 2), o);
    return (-i(u) + Bs > 0 ? -1 : 1) * ((f - p) * y) / k;
  }) : (i = (u) => {
    const d = Math.exp(-u * e), h = (u - r) * e + 1;
    return -Bs + d * h;
  }, a = (u) => {
    const d = Math.exp(-u * e), h = (r - u) * (e * e);
    return d * h;
  });
  const l = 5 / e, c = Od(i, a, l);
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
const Id = 12;
function Od(e, t, r) {
  let n = r;
  for (let i = 1; i < Id; i++)
    n = n - e(n) / t(n);
  return n;
}
function nr(e, t) {
  return e * Math.sqrt(1 - t * t);
}
const Yd = ["duration", "bounce"], Bd = ["stiffness", "damping", "mass"];
function Vn(e, t) {
  return t.some((r) => e[r] !== void 0);
}
function zd(e) {
  let t = {
    velocity: J.velocity,
    stiffness: J.stiffness,
    damping: J.damping,
    mass: J.mass,
    isResolvedFromDuration: !1,
    ...e
  };
  if (!Vn(e, Bd) && Vn(e, Yd))
    if (e.visualDuration) {
      const r = e.visualDuration, n = 2 * Math.PI / (r * 1.2), i = n * n, a = 2 * De(0.05, 1, 1 - (e.bounce || 0)) * Math.sqrt(i);
      t = {
        ...t,
        mass: J.mass,
        stiffness: i,
        damping: a
      };
    } else {
      const r = Fd(e);
      t = {
        ...t,
        ...r,
        mass: J.mass
      }, t.isResolvedFromDuration = !0;
    }
  return t;
}
function js(e = J.visualDuration, t = J.bounce) {
  const r = typeof e != "object" ? {
    visualDuration: e,
    keyframes: [0, 1],
    bounce: t
  } : e;
  let { restSpeed: n, restDelta: i } = r;
  const a = r.keyframes[0], o = r.keyframes[r.keyframes.length - 1], l = { done: !1, value: a }, { stiffness: c, damping: u, mass: d, duration: h, velocity: f, isResolvedFromDuration: p } = zd({
    ...r,
    velocity: -/* @__PURE__ */ Ce(r.velocity || 0)
  }), y = f || 0, k = u / (2 * Math.sqrt(c * d)), C = o - a, v = /* @__PURE__ */ Ce(Math.sqrt(c / d)), j = Math.abs(C) < 5;
  n || (n = j ? J.restSpeed.granular : J.restSpeed.default), i || (i = j ? J.restDelta.granular : J.restDelta.default);
  let _;
  if (k < 1) {
    const A = nr(v, k);
    _ = (I) => {
      const O = Math.exp(-k * v * I);
      return o - O * ((y + k * v * C) / A * Math.sin(A * I) + C * Math.cos(A * I));
    };
  } else if (k === 1)
    _ = (A) => o - Math.exp(-v * A) * (C + (y + v * C) * A);
  else {
    const A = v * Math.sqrt(k * k - 1);
    _ = (I) => {
      const O = Math.exp(-k * v * I), T = Math.min(A * I, 300);
      return o - O * ((y + k * v * C) * Math.sinh(T) + A * C * Math.cosh(T)) / A;
    };
  }
  const D = {
    calculatedDuration: p && h || null,
    next: (A) => {
      const I = _(A);
      if (p)
        l.done = A >= h;
      else {
        let O = A === 0 ? y : 0;
        k < 1 && (O = A === 0 ? /* @__PURE__ */ Te(y) : Eo(_, A, I));
        const T = Math.abs(O) <= n, x = Math.abs(o - I) <= i;
        l.done = T && x;
      }
      return l.value = l.done ? o : I, l;
    },
    toString: () => {
      const A = Math.min(Yr(D), ws), I = Ao((O) => D.next(A * O).value, A, 30);
      return A + "ms " + I;
    },
    toTransition: () => {
    }
  };
  return D;
}
js.applyToOptions = (e) => {
  const t = Ld(e, 100, js);
  return e.ease = t.ease, e.duration = /* @__PURE__ */ Te(t.duration), e.type = "keyframes", e;
};
function ir({ keyframes: e, velocity: t = 0, power: r = 0.8, timeConstant: n = 325, bounceDamping: i = 10, bounceStiffness: a = 500, modifyTarget: o, min: l, max: c, restDelta: u = 0.5, restSpeed: d }) {
  const h = e[0], f = {
    done: !1,
    value: h
  }, p = (T) => l !== void 0 && T < l || c !== void 0 && T > c, y = (T) => l === void 0 ? c : c === void 0 || Math.abs(l - T) < Math.abs(c - T) ? l : c;
  let k = r * t;
  const C = h + k, v = o === void 0 ? C : o(C);
  v !== C && (k = v - h);
  const j = (T) => -k * Math.exp(-T / n), _ = (T) => v + j(T), D = (T) => {
    const x = j(T), E = _(T);
    f.done = Math.abs(x) <= u, f.value = f.done ? v : E;
  };
  let A, I;
  const O = (T) => {
    p(f.value) && (A = T, I = js({
      keyframes: [f.value, y(f.value)],
      velocity: Eo(_, T, f.value),
      // TODO: This should be passing * 1000
      damping: i,
      stiffness: a,
      restDelta: u,
      restSpeed: d
    }));
  };
  return O(0), {
    calculatedDuration: null,
    next: (T) => {
      let x = !1;
      return !I && A === void 0 && (x = !0, D(T), O(T)), A !== void 0 && T >= A ? I.next(T - A) : (!x && D(T), f);
    }
  };
}
function $d(e, t, r) {
  const n = [], i = r || Le.mix || Po, a = e.length - 1;
  for (let o = 0; o < a; o++) {
    let l = i(e[o], e[o + 1]);
    if (t) {
      const c = Array.isArray(t) ? t[o] || je : t;
      l = qt(c, l);
    }
    n.push(l);
  }
  return n;
}
function Ud(e, t, { clamp: r = !0, ease: n, mixer: i } = {}) {
  const a = e.length;
  if (Re(a === t.length, "Both input and output ranges must be the same length", "range-length"), a === 1)
    return () => t[0];
  if (a === 2 && t[0] === t[1])
    return () => t[1];
  const o = e[0] === e[1];
  e[0] > e[a - 1] && (e = [...e].reverse(), t = [...t].reverse());
  const l = $d(t, n, i), c = l.length, u = (d) => {
    if (o && d < e[0])
      return t[0];
    let h = 0;
    if (c > 1)
      for (; h < e.length - 2 && !(d < e[h + 1]); h++)
        ;
    const f = /* @__PURE__ */ zt(e[h], e[h + 1], d);
    return l[h](f);
  };
  return r ? (d) => u(De(e[0], e[a - 1], d)) : u;
}
function Wd(e, t) {
  const r = e[e.length - 1];
  for (let n = 1; n <= t; n++) {
    const i = /* @__PURE__ */ zt(0, t, n);
    e.push(Q(r, 1, i));
  }
}
function Hd(e) {
  const t = [0];
  return Wd(t, e.length - 1), t;
}
function Kd(e, t) {
  return e.map((r) => r * t);
}
function Gd(e, t) {
  return e.map(() => t || bo).splice(0, e.length - 1);
}
function at({ duration: e = 300, keyframes: t, times: r, ease: n = "easeInOut" }) {
  const i = od(n) ? n.map(En) : En(n), a = {
    done: !1,
    value: t[0]
  }, o = Kd(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    r && r.length === t.length ? r : Hd(t),
    e
  ), l = Ud(o, t, {
    ease: Array.isArray(i) ? i : Gd(t, i)
  });
  return {
    calculatedDuration: e,
    next: (c) => (a.value = l(c), a.done = c >= e, a)
  };
}
const qd = (e) => e !== null;
function Br(e, { repeat: t, repeatType: r = "loop" }, n, i = 1) {
  const a = e.filter(qd), l = i < 0 || t && r !== "loop" && t % 2 === 1 ? 0 : a.length - 1;
  return !l || n === void 0 ? a[l] : n;
}
const Xd = {
  decay: ir,
  inertia: ir,
  tween: at,
  keyframes: at,
  spring: js
};
function Mo(e) {
  typeof e.type == "string" && (e.type = Xd[e.type]);
}
class zr {
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
const Zd = (e) => e / 100;
class $r extends zr {
  constructor(t) {
    super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.stop = () => {
      var n, i;
      const { motionValue: r } = this.options;
      r && r.updatedAt !== ge.now() && this.tick(ge.now()), this.isStopped = !0, this.state !== "idle" && (this.teardown(), (i = (n = this.options).onStop) == null || i.call(n));
    }, this.options = t, this.initAnimation(), this.play(), t.autoplay === !1 && this.pause();
  }
  initAnimation() {
    const { options: t } = this;
    Mo(t);
    const { type: r = at, repeat: n = 0, repeatDelay: i = 0, repeatType: a, velocity: o = 0 } = t;
    let { keyframes: l } = t;
    const c = r || at;
    process.env.NODE_ENV !== "production" && c !== at && Re(l.length <= 2, `Only two keyframes currently supported with spring and inertia animations. Trying to animate ${l}`, "spring-two-frames"), c !== at && typeof l[0] != "number" && (this.mixKeyframes = qt(Zd, Po(l[0], l[1])), l = [0, 100]);
    const u = c({ ...t, keyframes: l });
    a === "mirror" && (this.mirroredGenerator = c({
      ...t,
      keyframes: [...l].reverse(),
      velocity: -o
    })), u.calculatedDuration === null && (u.calculatedDuration = Yr(u));
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
    const { delay: u = 0, keyframes: d, repeat: h, repeatType: f, repeatDelay: p, type: y, onUpdate: k, finalKeyframe: C } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, t) : this.speed < 0 && (this.startTime = Math.min(t - i / this.speed, this.startTime)), r ? this.currentTime = t : this.updateTime(t);
    const v = this.currentTime - u * (this.playbackSpeed >= 0 ? 1 : -1), j = this.playbackSpeed >= 0 ? v < 0 : v > i;
    this.currentTime = Math.max(v, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = i);
    let _ = this.currentTime, D = n;
    if (h) {
      const T = Math.min(this.currentTime, i) / l;
      let x = Math.floor(T), E = T % 1;
      !E && T >= 1 && (E = 1), E === 1 && x--, x = Math.min(x, h + 1), !!(x % 2) && (f === "reverse" ? (E = 1 - E, p && (E -= p / l)) : f === "mirror" && (D = o)), _ = De(0, 1, E) * l;
    }
    const A = j ? { done: !1, value: d[0] } : D.next(_);
    a && (A.value = a(A.value));
    let { done: I } = A;
    !j && c !== null && (I = this.playbackSpeed >= 0 ? this.currentTime >= i : this.currentTime <= 0);
    const O = this.holdTime === null && (this.state === "finished" || this.state === "running" && I);
    return O && y !== ir && (A.value = Br(d, this.options, C, this.speed)), k && k(A.value), O && this.finish(), A;
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
    this.updateTime(ge.now());
    const r = this.playbackSpeed !== t;
    this.playbackSpeed = t, r && (this.time = /* @__PURE__ */ Ce(this.currentTime));
  }
  play() {
    var i, a;
    if (this.isStopped)
      return;
    const { driver: t = Rd, startTime: r } = this.options;
    this.driver || (this.driver = t((o) => this.tick(o))), (a = (i = this.options).onPlay) == null || a.call(i);
    const n = this.driver.now();
    this.state === "finished" ? (this.updateFinished(), this.startTime = n) : this.holdTime !== null ? this.startTime = n - this.holdTime : this.startTime || (this.startTime = r ?? n), this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
  }
  pause() {
    this.state = "paused", this.updateTime(ge.now()), this.holdTime = this.currentTime;
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
function Jd(e) {
  for (let t = 1; t < e.length; t++)
    e[t] ?? (e[t] = e[t - 1]);
}
const Xe = (e) => e * 180 / Math.PI, or = (e) => {
  const t = Xe(Math.atan2(e[1], e[0]));
  return ar(t);
}, Qd = {
  x: 4,
  y: 5,
  translateX: 4,
  translateY: 5,
  scaleX: 0,
  scaleY: 3,
  scale: (e) => (Math.abs(e[0]) + Math.abs(e[3])) / 2,
  rotate: or,
  rotateZ: or,
  skewX: (e) => Xe(Math.atan(e[1])),
  skewY: (e) => Xe(Math.atan(e[2])),
  skew: (e) => (Math.abs(e[1]) + Math.abs(e[2])) / 2
}, ar = (e) => (e = e % 360, e < 0 && (e += 360), e), Fn = or, In = (e) => Math.sqrt(e[0] * e[0] + e[1] * e[1]), On = (e) => Math.sqrt(e[4] * e[4] + e[5] * e[5]), eu = {
  x: 12,
  y: 13,
  z: 14,
  translateX: 12,
  translateY: 13,
  translateZ: 14,
  scaleX: In,
  scaleY: On,
  scale: (e) => (In(e) + On(e)) / 2,
  rotateX: (e) => ar(Xe(Math.atan2(e[6], e[5]))),
  rotateY: (e) => ar(Xe(Math.atan2(-e[2], e[0]))),
  rotateZ: Fn,
  rotate: Fn,
  skewX: (e) => Xe(Math.atan(e[4])),
  skewY: (e) => Xe(Math.atan(e[1])),
  skew: (e) => (Math.abs(e[1]) + Math.abs(e[4])) / 2
};
function lr(e) {
  return e.includes("scale") ? 1 : 0;
}
function cr(e, t) {
  if (!e || e === "none")
    return lr(t);
  const r = e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let n, i;
  if (r)
    n = eu, i = r;
  else {
    const l = e.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    n = Qd, i = l;
  }
  if (!i)
    return lr(t);
  const a = n[t], o = i[1].split(",").map(su);
  return typeof a == "function" ? a(o) : o[a];
}
const tu = (e, t) => {
  const { transform: r = "none" } = getComputedStyle(e);
  return cr(r, t);
};
function su(e) {
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
], Nt = new Set(jt), Yn = (e) => e === wt || e === V, ru = /* @__PURE__ */ new Set(["x", "y", "z"]), nu = jt.filter((e) => !ru.has(e));
function iu(e) {
  const t = [];
  return nu.forEach((r) => {
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
  x: (e, { transform: t }) => cr(t, "x"),
  y: (e, { transform: t }) => cr(t, "y")
};
Je.translateX = Je.x;
Je.translateY = Je.y;
const Qe = /* @__PURE__ */ new Set();
let dr = !1, ur = !1, hr = !1;
function Do() {
  if (ur) {
    const e = Array.from(Qe).filter((n) => n.needsMeasurement), t = new Set(e.map((n) => n.element)), r = /* @__PURE__ */ new Map();
    t.forEach((n) => {
      const i = iu(n);
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
  ur = !1, dr = !1, Qe.forEach((e) => e.complete(hr)), Qe.clear();
}
function Ro() {
  Qe.forEach((e) => {
    e.readKeyframes(), e.needsMeasurement && (ur = !0);
  });
}
function ou() {
  hr = !0, Ro(), Do(), hr = !1;
}
class Ur {
  constructor(t, r, n, i, a, o = !1) {
    this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...t], this.onComplete = r, this.name = n, this.motionValue = i, this.element = a, this.isAsync = o;
  }
  scheduleResolve() {
    this.state = "scheduled", this.isAsync ? (Qe.add(this), dr || (dr = !0, Z.read(Ro), Z.resolveKeyframes(Do))) : (this.readKeyframes(), this.complete());
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
    Jd(t);
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
const au = (e) => e.startsWith("--");
function lu(e, t, r) {
  au(t) ? e.style.setProperty(t, r) : e.style[t] = r;
}
const cu = /* @__PURE__ */ Ar(() => window.ScrollTimeline !== void 0), du = {};
function uu(e, t) {
  const r = /* @__PURE__ */ Ar(e);
  return () => du[t] ?? r();
}
const Lo = /* @__PURE__ */ uu(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
    return !1;
  }
  return !0;
}, "linearEasing"), Dt = ([e, t, r, n]) => `cubic-bezier(${e}, ${t}, ${r}, ${n})`, Bn = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ Dt([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ Dt([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ Dt([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ Dt([0.33, 1.53, 0.69, 0.99])
};
function Vo(e, t) {
  if (e)
    return typeof e == "function" ? Lo() ? Ao(e, t) : "ease-out" : vo(e) ? Dt(e) : Array.isArray(e) ? e.map((r) => Vo(r, t) || Bn.easeOut) : Bn[e];
}
function hu(e, t, r, { delay: n = 0, duration: i = 300, repeat: a = 0, repeatType: o = "loop", ease: l = "easeOut", times: c } = {}, u = void 0) {
  const d = {
    [t]: r
  };
  c && (d.offset = c);
  const h = Vo(l, i);
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
function Fo(e) {
  return typeof e == "function" && "applyToOptions" in e;
}
function mu({ type: e, ...t }) {
  return Fo(e) && Lo() ? e.applyToOptions(t) : (t.duration ?? (t.duration = 300), t.ease ?? (t.ease = "easeOut"), t);
}
class fu extends zr {
  constructor(t) {
    if (super(), this.finishedTime = null, this.isStopped = !1, !t)
      return;
    const { element: r, name: n, keyframes: i, pseudoElement: a, allowFlatten: o = !1, finalKeyframe: l, onComplete: c } = t;
    this.isPseudoElement = !!a, this.allowFlatten = o, this.options = t, Re(typeof t.type != "string", `Mini animate() doesn't support "type" as a string.`, "mini-spring");
    const u = mu(t);
    this.animation = hu(r, n, i, u, a), u.autoplay === !1 && this.animation.pause(), this.animation.onfinish = () => {
      if (this.finishedTime = this.time, !a) {
        const d = Br(i, this.options, l, this.speed);
        this.updateMotionValue ? this.updateMotionValue(d) : lu(r, n, d), this.animation.cancel();
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
    return this.allowFlatten && ((n = this.animation.effect) == null || n.updateTiming({ easing: "linear" })), this.animation.onfinish = null, t && cu() ? (this.animation.timeline = t, je) : r(this);
  }
}
const Io = {
  anticipate: po,
  backInOut: go,
  circInOut: yo
};
function gu(e) {
  return e in Io;
}
function pu(e) {
  typeof e.ease == "string" && gu(e.ease) && (e.ease = Io[e.ease]);
}
const zn = 10;
class xu extends fu {
  constructor(t) {
    pu(t), Mo(t), super(t), t.startTime && (this.startTime = t.startTime), this.options = t;
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
    const l = new $r({
      ...o,
      autoplay: !1
    }), c = /* @__PURE__ */ Te(this.finishedTime ?? this.time);
    r.setWithVelocity(l.sample(c - zn).value, l.sample(c).value, zn), l.stop();
  }
}
const $n = (e, t) => t === "zIndex" ? !1 : !!(typeof e == "number" || Array.isArray(e) || typeof e == "string" && // It's animatable if we have a string
(ze.test(e) || e === "0") && // And it contains numbers and/or colors
!e.startsWith("url("));
function yu(e) {
  const t = e[0];
  if (e.length === 1)
    return !0;
  for (let r = 0; r < e.length; r++)
    if (e[r] !== t)
      return !0;
}
function bu(e, t, r, n) {
  const i = e[0];
  if (i === null)
    return !1;
  if (t === "display" || t === "visibility")
    return !0;
  const a = e[e.length - 1], o = $n(i, t), l = $n(a, t);
  return vt(o === l, `You are trying to animate ${t} from "${i}" to "${a}". "${o ? a : i}" is not an animatable value.`, "value-not-animatable"), !o || !l ? !1 : yu(e) || (r === "spring" || Fo(r)) && n;
}
function mr(e) {
  e.duration = 0, e.type;
}
const vu = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Could be re-enabled now we have support for linear() easing
  // "background-color"
]), wu = /* @__PURE__ */ Ar(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function ju(e) {
  var d;
  const { motionValue: t, name: r, repeatDelay: n, repeatType: i, damping: a, type: o } = e;
  if (!(((d = t == null ? void 0 : t.owner) == null ? void 0 : d.current) instanceof HTMLElement))
    return !1;
  const { onUpdate: c, transformTemplate: u } = t.owner.getProps();
  return wu() && r && vu.has(r) && (r !== "transform" || !u) && /**
   * If we're outputting values to onUpdate then we can't use WAAPI as there's
   * no way to read the value from WAAPI every frame.
   */
  !c && !n && i !== "mirror" && a !== 0 && o !== "inertia";
}
const Nu = 40;
class ku extends zr {
  constructor({ autoplay: t = !0, delay: r = 0, type: n = "keyframes", repeat: i = 0, repeatDelay: a = 0, repeatType: o = "loop", keyframes: l, name: c, motionValue: u, element: d, ...h }) {
    var y;
    super(), this.stop = () => {
      var k, C;
      this._animation && (this._animation.stop(), (k = this.stopTimeline) == null || k.call(this)), (C = this.keyframeResolver) == null || C.cancel();
    }, this.createdAt = ge.now();
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
    }, p = (d == null ? void 0 : d.KeyframeResolver) || Ur;
    this.keyframeResolver = new p(l, (k, C, v) => this.onKeyframesResolved(k, C, f, !v), c, u, d), (y = this.keyframeResolver) == null || y.scheduleResolve();
  }
  onKeyframesResolved(t, r, n, i) {
    this.keyframeResolver = void 0;
    const { name: a, type: o, velocity: l, delay: c, isHandoff: u, onUpdate: d } = n;
    this.resolvedAt = ge.now(), bu(t, a, o, l) || ((Le.instantAnimations || !c) && (d == null || d(Br(t, n, r))), t[0] = t[t.length - 1], mr(n), n.repeat = 0);
    const f = {
      startTime: i ? this.resolvedAt ? this.resolvedAt - this.createdAt > Nu ? this.resolvedAt : this.createdAt : this.createdAt : void 0,
      finalKeyframe: r,
      ...n,
      keyframes: t
    }, p = !u && ju(f) ? new xu({
      ...f,
      element: f.motionValue.owner.current
    }) : new $r(f);
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
    return this._animation || ((t = this.keyframeResolver) == null || t.resume(), ou()), this._animation;
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
const Tu = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function Su(e) {
  const t = Tu.exec(e);
  if (!t)
    return [,];
  const [, r, n, i] = t;
  return [`--${r ?? n}`, i];
}
const Cu = 4;
function Oo(e, t, r = 1) {
  Re(r <= Cu, `Max CSS variable fallback depth detected in property "${e}". This may indicate a circular fallback dependency.`, "max-css-var-depth");
  const [n, i] = Su(e);
  if (!n)
    return;
  const a = window.getComputedStyle(t).getPropertyValue(n);
  if (a) {
    const o = a.trim();
    return oo(o) ? parseFloat(o) : o;
  }
  return Vr(i) ? Oo(i, t, r + 1) : i;
}
function Wr(e, t) {
  return (e == null ? void 0 : e[t]) ?? (e == null ? void 0 : e.default) ?? e;
}
const Yo = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...jt
]), _u = {
  test: (e) => e === "auto",
  parse: (e) => e
}, Bo = (e) => (t) => t.test(e), zo = [wt, V, _e, Fe, yd, xd, _u], Un = (e) => zo.find(Bo(e));
function Pu(e) {
  return typeof e == "number" ? e === 0 : e !== null ? e === "none" || e === "0" || lo(e) : !0;
}
const Au = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function Eu(e) {
  const [t, r] = e.slice(0, -1).split("(");
  if (t === "drop-shadow")
    return e;
  const [n] = r.match(Fr) || [];
  if (!n)
    return e;
  const i = r.replace(n, "");
  let a = Au.has(t) ? 1 : 0;
  return n !== r && (a *= 100), t + "(" + a + i + ")";
}
const Mu = /\b([a-z-]*)\(.*?\)/gu, fr = {
  ...ze,
  getAnimatableNone: (e) => {
    const t = e.match(Mu);
    return t ? t.map(Eu).join(" ") : e;
  }
}, Wn = {
  ...wt,
  transform: Math.round
}, Du = {
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
  opacity: $t,
  originX: Mn,
  originY: Mn,
  originZ: V
}, Hr = {
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
  ...Du,
  zIndex: Wn,
  // SVG
  fillOpacity: $t,
  strokeOpacity: $t,
  numOctaves: Wn
}, Ru = {
  ...Hr,
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
  filter: fr,
  WebkitFilter: fr
}, $o = (e) => Ru[e];
function Uo(e, t) {
  let r = $o(e);
  return r !== fr && (r = ze), r.getAnimatableNone ? r.getAnimatableNone(t) : void 0;
}
const Lu = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function Vu(e, t, r) {
  let n = 0, i;
  for (; n < e.length && !i; ) {
    const a = e[n];
    typeof a == "string" && !Lu.has(a) && Ut(a).values.length && (i = e[n]), n++;
  }
  if (i && r)
    for (const a of t)
      e[a] = Uo(r, i);
}
class Fu extends Ur {
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
      if (typeof u == "string" && (u = u.trim(), Vr(u))) {
        const d = Oo(u, r.current);
        d !== void 0 && (t[c] = d), c === t.length - 1 && (this.finalKeyframe = u);
      }
    }
    if (this.resolveNoneKeyframes(), !Yo.has(n) || t.length !== 2)
      return;
    const [i, a] = t, o = Un(i), l = Un(a);
    if (o !== l)
      if (Yn(o) && Yn(l))
        for (let c = 0; c < t.length; c++) {
          const u = t[c];
          typeof u == "string" && (t[c] = parseFloat(u));
        }
      else Je[n] && (this.needsMeasurement = !0);
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: t, name: r } = this, n = [];
    for (let i = 0; i < t.length; i++)
      (t[i] === null || Pu(t[i])) && n.push(i);
    n.length && Vu(t, n, r);
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
function Iu(e, t, r) {
  if (e instanceof EventTarget)
    return [e];
  if (typeof e == "string") {
    let n = document;
    const i = (r == null ? void 0 : r[e]) ?? n.querySelectorAll(e);
    return i ? Array.from(i) : [];
  }
  return Array.from(e);
}
const Wo = (e, t) => t && typeof e == "number" ? t.transform(e) : e;
function Ou(e) {
  return ao(e) && "offsetHeight" in e;
}
const Hn = 30, Yu = (e) => !isNaN(parseFloat(e));
class Bu {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   */
  constructor(t, r = {}) {
    this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (n) => {
      var a;
      const i = ge.now();
      if (this.updatedAt !== i && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(n), this.current !== this.prev && ((a = this.events.change) == null || a.notify(this.current), this.dependents))
        for (const o of this.dependents)
          o.dirty();
    }, this.hasAnimated = !1, this.setCurrent(t), this.owner = r.owner;
  }
  setCurrent(t) {
    this.current = t, this.updatedAt = ge.now(), this.canTrackVelocity === null && t !== void 0 && (this.canTrackVelocity = Yu(this.current));
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
    return process.env.NODE_ENV !== "production" && Mr(!1, 'value.onChange(callback) is deprecated. Switch to value.on("change", callback).'), this.on("change", t);
  }
  on(t, r) {
    this.events[t] || (this.events[t] = new Er());
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
    const t = ge.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || t - this.updatedAt > Hn)
      return 0;
    const r = Math.min(this.updatedAt - this.prevUpdatedAt, Hn);
    return co(parseFloat(this.current) - parseFloat(this.prevFrameValue), r);
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
function pt(e, t) {
  return new Bu(e, t);
}
const { schedule: Kr } = /* @__PURE__ */ wo(queueMicrotask, !1), ke = {
  x: !1,
  y: !1
};
function Ho() {
  return ke.x || ke.y;
}
function zu(e) {
  return e === "x" || e === "y" ? ke[e] ? null : (ke[e] = !0, () => {
    ke[e] = !1;
  }) : ke.x || ke.y ? null : (ke.x = ke.y = !0, () => {
    ke.x = ke.y = !1;
  });
}
function Ko(e, t) {
  const r = Iu(e), n = new AbortController(), i = {
    passive: !0,
    ...t,
    signal: n.signal
  };
  return [r, i, () => n.abort()];
}
function Kn(e) {
  return !(e.pointerType === "touch" || Ho());
}
function $u(e, t, r = {}) {
  const [n, i, a] = Ko(e, r), o = (l) => {
    if (!Kn(l))
      return;
    const { target: c } = l, u = t(c, l);
    if (typeof u != "function" || !c)
      return;
    const d = (h) => {
      Kn(h) && (u(h), c.removeEventListener("pointerleave", d));
    };
    c.addEventListener("pointerleave", d, i);
  };
  return n.forEach((l) => {
    l.addEventListener("pointerenter", o, i);
  }), a;
}
const Go = (e, t) => t ? e === t ? !0 : Go(e, t.parentElement) : !1, Gr = (e) => e.pointerType === "mouse" ? typeof e.button != "number" || e.button <= 0 : e.isPrimary !== !1, Uu = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function Wu(e) {
  return Uu.has(e.tagName) || e.tabIndex !== -1;
}
const fs = /* @__PURE__ */ new WeakSet();
function Gn(e) {
  return (t) => {
    t.key === "Enter" && e(t);
  };
}
function zs(e, t) {
  e.dispatchEvent(new PointerEvent("pointer" + t, { isPrimary: !0, bubbles: !0 }));
}
const Hu = (e, t) => {
  const r = e.currentTarget;
  if (!r)
    return;
  const n = Gn(() => {
    if (fs.has(r))
      return;
    zs(r, "down");
    const i = Gn(() => {
      zs(r, "up");
    }), a = () => zs(r, "cancel");
    r.addEventListener("keyup", i, t), r.addEventListener("blur", a, t);
  });
  r.addEventListener("keydown", n, t), r.addEventListener("blur", () => r.removeEventListener("keydown", n), t);
};
function qn(e) {
  return Gr(e) && !Ho();
}
function Ku(e, t, r = {}) {
  const [n, i, a] = Ko(e, r), o = (l) => {
    const c = l.currentTarget;
    if (!qn(l))
      return;
    fs.add(c);
    const u = t(c, l), d = (p, y) => {
      window.removeEventListener("pointerup", h), window.removeEventListener("pointercancel", f), fs.has(c) && fs.delete(c), qn(p) && typeof u == "function" && u(p, { success: y });
    }, h = (p) => {
      d(p, c === window || c === document || r.useGlobalTarget || Go(c, p.target));
    }, f = (p) => {
      d(p, !1);
    };
    window.addEventListener("pointerup", h, i), window.addEventListener("pointercancel", f, i);
  };
  return n.forEach((l) => {
    (r.useGlobalTarget ? window : l).addEventListener("pointerdown", o, i), Ou(l) && (l.addEventListener("focus", (u) => Hu(u, i)), !Wu(l) && !l.hasAttribute("tabindex") && (l.tabIndex = 0));
  }), a;
}
function qo(e) {
  return ao(e) && "ownerSVGElement" in e;
}
function Gu(e) {
  return qo(e) && e.tagName === "svg";
}
const de = (e) => !!(e && e.getVelocity), qu = [...zo, ne, ze], Xu = (e) => qu.find(Bo(e)), Xo = $e({
  transformPagePoint: (e) => e,
  isStatic: !1,
  reducedMotion: "never"
});
function Zu(e = !0) {
  const t = ce(Cr);
  if (t === null)
    return [!0, null];
  const { isPresent: r, onExitComplete: n, register: i } = t, a = cl();
  pe(() => {
    if (e)
      return i(a);
  }, [e]);
  const o = Ui(() => e && n && n(a), [a, n, e]);
  return !r && n ? [!1, o] : [!0];
}
const Zo = $e({ strict: !1 }), Xn = {
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
}, xt = {};
for (const e in Xn)
  xt[e] = {
    isEnabled: (t) => Xn[e].some((r) => !!t[r])
  };
function Ju(e) {
  for (const t in e)
    xt[t] = {
      ...xt[t],
      ...e[t]
    };
}
const Qu = /* @__PURE__ */ new Set([
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
function Ns(e) {
  return e.startsWith("while") || e.startsWith("drag") && e !== "draggable" || e.startsWith("layout") || e.startsWith("onTap") || e.startsWith("onPan") || e.startsWith("onLayout") || Qu.has(e);
}
let Jo = (e) => !Ns(e);
function eh(e) {
  typeof e == "function" && (Jo = (t) => t.startsWith("on") ? !Ns(t) : e(t));
}
try {
  eh(require("@emotion/is-prop-valid").default);
} catch {
}
function th(e, t, r) {
  const n = {};
  for (const i in e)
    i === "values" && typeof e.values == "object" || (Jo(i) || r === !0 && Ns(i) || !t && !Ns(i) || // If trying to use native HTML drag events, forward drag listeners
    e.draggable && i.startsWith("onDrag")) && (n[i] = e[i]);
  return n;
}
const Ps = /* @__PURE__ */ $e({});
function As(e) {
  return e !== null && typeof e == "object" && typeof e.start == "function";
}
function Wt(e) {
  return typeof e == "string" || Array.isArray(e);
}
const qr = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], Xr = ["initial", ...qr];
function Es(e) {
  return As(e.animate) || Xr.some((t) => Wt(e[t]));
}
function Qo(e) {
  return !!(Es(e) || e.variants);
}
function sh(e, t) {
  if (Es(e)) {
    const { initial: r, animate: n } = e;
    return {
      initial: r === !1 || Wt(r) ? r : void 0,
      animate: Wt(n) ? n : void 0
    };
  }
  return e.inherit !== !1 ? t : {};
}
function rh(e) {
  const { initial: t, animate: r } = sh(e, ce(Ps));
  return Ts(() => ({ initial: t, animate: r }), [Zn(t), Zn(r)]);
}
function Zn(e) {
  return Array.isArray(e) ? e.join(" ") : e;
}
const Ht = {};
function nh(e) {
  for (const t in e)
    Ht[t] = e[t], Lr(t) && (Ht[t].isCSSVariable = !0);
}
function ea(e, { layout: t, layoutId: r }) {
  return Nt.has(e) || e.startsWith("origin") || (t || r !== void 0) && (!!Ht[e] || e === "opacity");
}
const ih = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, oh = jt.length;
function ah(e, t, r) {
  let n = "", i = !0;
  for (let a = 0; a < oh; a++) {
    const o = jt[a], l = e[o];
    if (l === void 0)
      continue;
    let c = !0;
    if (typeof l == "number" ? c = l === (o.startsWith("scale") ? 1 : 0) : c = parseFloat(l) === 0, !c || r) {
      const u = Wo(l, Hr[o]);
      if (!c) {
        i = !1;
        const d = ih[o] || o;
        n += `${d}(${u}) `;
      }
      r && (t[o] = u);
    }
  }
  return n = n.trim(), r ? n = r(t, i ? "" : n) : i && (n = "none"), n;
}
function Zr(e, t, r) {
  const { style: n, vars: i, transformOrigin: a } = e;
  let o = !1, l = !1;
  for (const c in t) {
    const u = t[c];
    if (Nt.has(c)) {
      o = !0;
      continue;
    } else if (Lr(c)) {
      i[c] = u;
      continue;
    } else {
      const d = Wo(u, Hr[c]);
      c.startsWith("origin") ? (l = !0, a[c] = d) : n[c] = d;
    }
  }
  if (t.transform || (o || r ? n.transform = ah(t, e.transform, r) : n.transform && (n.transform = "none")), l) {
    const { originX: c = "50%", originY: u = "50%", originZ: d = 0 } = a;
    n.transformOrigin = `${c} ${u} ${d}`;
  }
}
const Jr = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
function ta(e, t, r) {
  for (const n in t)
    !de(t[n]) && !ea(n, r) && (e[n] = t[n]);
}
function lh({ transformTemplate: e }, t) {
  return Ts(() => {
    const r = Jr();
    return Zr(r, t, e), Object.assign({}, r.vars, r.style);
  }, [t]);
}
function ch(e, t) {
  const r = e.style || {}, n = {};
  return ta(n, r, e), Object.assign(n, lh(e, t)), n;
}
function dh(e, t) {
  const r = {}, n = ch(e, t);
  return e.drag && e.dragListener !== !1 && (r.draggable = !1, n.userSelect = n.WebkitUserSelect = n.WebkitTouchCallout = "none", n.touchAction = e.drag === !0 ? "none" : `pan-${e.drag === "x" ? "y" : "x"}`), e.tabIndex === void 0 && (e.onTap || e.onTapStart || e.whileTap) && (r.tabIndex = 0), r.style = n, r;
}
const uh = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, hh = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function mh(e, t, r = 1, n = 0, i = !0) {
  e.pathLength = 1;
  const a = i ? uh : hh;
  e[a.offset] = V.transform(-n);
  const o = V.transform(t), l = V.transform(r);
  e[a.array] = `${o} ${l}`;
}
function sa(e, {
  attrX: t,
  attrY: r,
  attrScale: n,
  pathLength: i,
  pathSpacing: a = 1,
  pathOffset: o = 0,
  // This is object creation, which we try to avoid per-frame.
  ...l
}, c, u, d) {
  if (Zr(e, l, u), c) {
    e.style.viewBox && (e.attrs.viewBox = e.style.viewBox);
    return;
  }
  e.attrs = e.style, e.style = {};
  const { attrs: h, style: f } = e;
  h.transform && (f.transform = h.transform, delete h.transform), (f.transform || h.transformOrigin) && (f.transformOrigin = h.transformOrigin ?? "50% 50%", delete h.transformOrigin), f.transform && (f.transformBox = (d == null ? void 0 : d.transformBox) ?? "fill-box", delete h.transformBox), t !== void 0 && (h.x = t), r !== void 0 && (h.y = r), n !== void 0 && (h.scale = n), i !== void 0 && mh(h, i, a, o, !1);
}
const ra = () => ({
  ...Jr(),
  attrs: {}
}), na = (e) => typeof e == "string" && e.toLowerCase() === "svg";
function fh(e, t, r, n) {
  const i = Ts(() => {
    const a = ra();
    return sa(a, t, na(n), e.transformTemplate, e.style), {
      ...a.attrs,
      style: { ...a.style }
    };
  }, [t]);
  if (e.style) {
    const a = {};
    ta(a, e.style, e), i.style = { ...a, ...i.style };
  }
  return i;
}
const gh = [
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
function Qr(e) {
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
      !!(gh.indexOf(e) > -1 || /**
       * If it contains a capital letter, it's an SVG component
       */
      /[A-Z]/u.test(e))
    )
  );
}
function ph(e, t, r, { latestValues: n }, i, a = !1) {
  const l = (Qr(e) ? fh : dh)(t, n, i, e), c = th(t, typeof e == "string", a), u = e !== Wi ? { ...c, ...l, ref: r } : {}, { children: d } = t, h = Ts(() => de(d) ? d.get() : d, [d]);
  return dl(e, {
    ...u,
    children: h
  });
}
function Jn(e) {
  const t = [{}, {}];
  return e == null || e.values.forEach((r, n) => {
    t[0][n] = r.get(), t[1][n] = r.getVelocity();
  }), t;
}
function en(e, t, r, n) {
  if (typeof t == "function") {
    const [i, a] = Jn(n);
    t = t(r !== void 0 ? r : e.custom, i, a);
  }
  if (typeof t == "string" && (t = e.variants && e.variants[t]), typeof t == "function") {
    const [i, a] = Jn(n);
    t = t(r !== void 0 ? r : e.custom, i, a);
  }
  return t;
}
function gs(e) {
  return de(e) ? e.get() : e;
}
function xh({ scrapeMotionValuesFromProps: e, createRenderState: t }, r, n, i) {
  return {
    latestValues: yh(r, n, i, e),
    renderState: t()
  };
}
function yh(e, t, r, n) {
  const i = {}, a = n(e, {});
  for (const f in a)
    i[f] = gs(a[f]);
  let { initial: o, animate: l } = e;
  const c = Es(e), u = Qo(e);
  t && u && !c && e.inherit !== !1 && (o === void 0 && (o = t.initial), l === void 0 && (l = t.animate));
  let d = r ? r.initial === !1 : !1;
  d = d || o === !1;
  const h = d ? l : o;
  if (h && typeof h != "boolean" && !As(h)) {
    const f = Array.isArray(h) ? h : [h];
    for (let p = 0; p < f.length; p++) {
      const y = en(e, f[p]);
      if (y) {
        const { transitionEnd: k, transition: C, ...v } = y;
        for (const j in v) {
          let _ = v[j];
          if (Array.isArray(_)) {
            const D = d ? _.length - 1 : 0;
            _ = _[D];
          }
          _ !== null && (i[j] = _);
        }
        for (const j in k)
          i[j] = k[j];
      }
    }
  }
  return i;
}
const ia = (e) => (t, r) => {
  const n = ce(Ps), i = ce(Cr), a = () => xh(e, t, n, i);
  return r ? a() : Jc(a);
};
function tn(e, t, r) {
  var a;
  const { style: n } = e, i = {};
  for (const o in n)
    (de(n[o]) || t.style && de(t.style[o]) || ea(o, e) || ((a = r == null ? void 0 : r.getValue(o)) == null ? void 0 : a.liveStyle) !== void 0) && (i[o] = n[o]);
  return i;
}
const bh = /* @__PURE__ */ ia({
  scrapeMotionValuesFromProps: tn,
  createRenderState: Jr
});
function oa(e, t, r) {
  const n = tn(e, t, r);
  for (const i in e)
    if (de(e[i]) || de(t[i])) {
      const a = jt.indexOf(i) !== -1 ? "attr" + i.charAt(0).toUpperCase() + i.substring(1) : i;
      n[a] = e[i];
    }
  return n;
}
const vh = /* @__PURE__ */ ia({
  scrapeMotionValuesFromProps: oa,
  createRenderState: ra
}), wh = Symbol.for("motionComponentSymbol");
function lt(e) {
  return e && typeof e == "object" && Object.prototype.hasOwnProperty.call(e, "current");
}
function jh(e, t, r) {
  return Ui(
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
const sn = (e) => e.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(), Nh = "framerAppearId", aa = "data-" + sn(Nh), la = $e({});
function kh(e, t, r, n, i) {
  var k, C;
  const { visualElement: a } = ce(Ps), o = ce(Zo), l = ce(Cr), c = ce(Xo).reducedMotion, u = ht(null);
  n = n || o.renderer, !u.current && n && (u.current = n(e, {
    visualState: t,
    parent: a,
    props: r,
    presenceContext: l,
    blockInitialAnimation: l ? l.initial === !1 : !1,
    reducedMotionConfig: c
  }));
  const d = u.current, h = ce(la);
  d && !d.projection && i && (d.type === "html" || d.type === "svg") && Th(u.current, r, i, h);
  const f = ht(!1);
  ul(() => {
    d && f.current && d.update(r, l);
  });
  const p = r[aa], y = ht(!!p && !((k = window.MotionHandoffIsComplete) != null && k.call(window, p)) && ((C = window.MotionHasOptimisedAnimation) == null ? void 0 : C.call(window, p)));
  return Qc(() => {
    d && (f.current = !0, window.MotionIsMounted = !0, d.updateFeatures(), d.scheduleRenderMicrotask(), y.current && d.animationState && d.animationState.animateChanges());
  }), pe(() => {
    d && (!y.current && d.animationState && d.animationState.animateChanges(), y.current && (queueMicrotask(() => {
      var v;
      (v = window.MotionHandoffMarkAsComplete) == null || v.call(window, p);
    }), y.current = !1), d.enteringChildren = void 0);
  }), d;
}
function Th(e, t, r, n) {
  const { layoutId: i, layout: a, drag: o, dragConstraints: l, layoutScroll: c, layoutRoot: u, layoutCrossfade: d } = t;
  e.projection = new r(e.latestValues, t["data-framer-portal-id"] ? void 0 : ca(e.parent)), e.projection.setOptions({
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
function ca(e) {
  if (e)
    return e.options.allowProjection !== !1 ? e.projection : ca(e.parent);
}
function $s(e, { forwardMotionProps: t = !1 } = {}, r, n) {
  r && Ju(r);
  const i = Qr(e) ? vh : bh;
  function a(l, c) {
    let u;
    const d = {
      ...ce(Xo),
      ...l,
      layoutId: Sh(l)
    }, { isStatic: h } = d, f = rh(l), p = i(l, h);
    if (!h && Sr) {
      Ch(d, r);
      const y = _h(d);
      u = y.MeasureLayout, f.visualElement = kh(e, p, d, n, y.ProjectionNode);
    }
    return s.jsxs(Ps.Provider, { value: f, children: [u && f.visualElement ? s.jsx(u, { visualElement: f.visualElement, ...d }) : null, ph(e, l, jh(p, f.visualElement, c), p, h, t)] });
  }
  a.displayName = `motion.${typeof e == "string" ? e : `create(${e.displayName ?? e.name ?? ""})`}`;
  const o = hl(a);
  return o[wh] = e, o;
}
function Sh({ layoutId: e }) {
  const t = ce(io).id;
  return t && e !== void 0 ? t + "-" + e : e;
}
function Ch(e, t) {
  const r = ce(Zo).strict;
  if (process.env.NODE_ENV !== "production" && t && r) {
    const n = "You have rendered a `motion` component within a `LazyMotion` component. This will break tree shaking. Import and render a `m` component instead.";
    e.ignoreStrict ? vt(!1, n, "lazy-strict-mode") : Re(!1, n, "lazy-strict-mode");
  }
}
function _h(e) {
  const { drag: t, layout: r } = xt;
  if (!t && !r)
    return {};
  const n = { ...t, ...r };
  return {
    MeasureLayout: t != null && t.isEnabled(e) || r != null && r.isEnabled(e) ? n.MeasureLayout : void 0,
    ProjectionNode: n.ProjectionNode
  };
}
function Ph(e, t) {
  if (typeof Proxy > "u")
    return $s;
  const r = /* @__PURE__ */ new Map(), n = (a, o) => $s(a, o, e, t), i = (a, o) => (process.env.NODE_ENV !== "production" && Mr(!1, "motion() is deprecated. Use motion.create() instead."), n(a, o));
  return new Proxy(i, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (a, o) => o === "create" ? n : (r.has(o) || r.set(o, $s(o, void 0, e, t)), r.get(o))
  });
}
function da({ top: e, left: t, right: r, bottom: n }) {
  return {
    x: { min: t, max: r },
    y: { min: e, max: n }
  };
}
function Ah({ x: e, y: t }) {
  return { top: t.min, right: e.max, bottom: t.max, left: e.min };
}
function Eh(e, t) {
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
function Us(e) {
  return e === void 0 || e === 1;
}
function gr({ scale: e, scaleX: t, scaleY: r }) {
  return !Us(e) || !Us(t) || !Us(r);
}
function Ge(e) {
  return gr(e) || ua(e) || e.z || e.rotate || e.rotateX || e.rotateY || e.skewX || e.skewY;
}
function ua(e) {
  return Qn(e.x) || Qn(e.y);
}
function Qn(e) {
  return e && e !== "0%";
}
function ks(e, t, r) {
  const n = e - r, i = t * n;
  return r + i;
}
function ei(e, t, r, n, i) {
  return i !== void 0 && (e = ks(e, i, n)), ks(e, r, n) + t;
}
function pr(e, t = 0, r = 1, n, i) {
  e.min = ei(e.min, t, r, n, i), e.max = ei(e.max, t, r, n, i);
}
function ha(e, { x: t, y: r }) {
  pr(e.x, t.translate, t.scale, t.originPoint), pr(e.y, r.translate, r.scale, r.originPoint);
}
const ti = 0.999999999999, si = 1.0000000000001;
function Mh(e, t, r, n = !1) {
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
    }), o && (t.x *= o.x.scale, t.y *= o.y.scale, ha(e, o)), n && Ge(a.latestValues) && dt(e, a.latestValues));
  }
  t.x < si && t.x > ti && (t.x = 1), t.y < si && t.y > ti && (t.y = 1);
}
function ct(e, t) {
  e.min = e.min + t, e.max = e.max + t;
}
function ri(e, t, r, n, i = 0.5) {
  const a = Q(e.min, e.max, i);
  pr(e, t, r, a, n);
}
function dt(e, t) {
  ri(e.x, t.x, t.scaleX, t.scale, t.originX), ri(e.y, t.y, t.scaleY, t.scale, t.originY);
}
function ma(e, t) {
  return da(Eh(e.getBoundingClientRect(), t));
}
function Dh(e, t, r) {
  const n = ma(e, r), { scroll: i } = t;
  return i && (ct(n.x, i.offset.x), ct(n.y, i.offset.y)), n;
}
const ni = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
}), ut = () => ({
  x: ni(),
  y: ni()
}), ii = () => ({ min: 0, max: 0 }), te = () => ({
  x: ii(),
  y: ii()
}), xr = { current: null }, fa = { current: !1 };
function Rh() {
  if (fa.current = !0, !!Sr)
    if (window.matchMedia) {
      const e = window.matchMedia("(prefers-reduced-motion)"), t = () => xr.current = e.matches;
      e.addEventListener("change", t), t();
    } else
      xr.current = !1;
}
const Lh = /* @__PURE__ */ new WeakMap();
function Vh(e, t, r) {
  for (const n in t) {
    const i = t[n], a = r[n];
    if (de(i))
      e.addValue(n, i);
    else if (de(a))
      e.addValue(n, pt(i, { owner: e }));
    else if (a !== i)
      if (e.hasValue(n)) {
        const o = e.getValue(n);
        o.liveStyle === !0 ? o.jump(i) : o.hasAnimated || o.set(i);
      } else {
        const o = e.getStaticValue(n);
        e.addValue(n, pt(o !== void 0 ? o : i, { owner: e }));
      }
  }
  for (const n in r)
    t[n] === void 0 && e.removeValue(n);
  return t;
}
const oi = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
class Fh {
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
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = Ur, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.renderScheduledAt = 0, this.scheduleRender = () => {
      const f = ge.now();
      this.renderScheduledAt < f && (this.renderScheduledAt = f, Z.render(this.render, !1, !0));
    };
    const { latestValues: c, renderState: u } = o;
    this.latestValues = c, this.baseTarget = { ...c }, this.initialValues = r.initial ? { ...c } : {}, this.renderState = u, this.parent = t, this.props = r, this.presenceContext = n, this.depth = t ? t.depth + 1 : 0, this.reducedMotionConfig = i, this.options = l, this.blockInitialAnimation = !!a, this.isControllingVariants = Es(r), this.isVariantNode = Qo(r), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(t && t.current);
    const { willChange: d, ...h } = this.scrapeMotionValuesFromProps(r, {}, this);
    for (const f in h) {
      const p = h[f];
      c[f] !== void 0 && de(p) && p.set(c[f]);
    }
  }
  mount(t) {
    var r;
    this.current = t, Lh.set(t, this), this.projection && !this.projection.instance && this.projection.mount(t), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((n, i) => this.bindToMotionValue(i, n)), fa.current || Rh(), this.shouldReduceMotion = this.reducedMotionConfig === "never" ? !1 : this.reducedMotionConfig === "always" ? !0 : xr.current, process.env.NODE_ENV !== "production" && Mr(this.shouldReduceMotion !== !0, "You have Reduced Motion enabled on your device. Animations may not appear as expected.", "reduced-motion-disabled"), (r = this.parent) == null || r.addChild(this), this.update(this.props, this.presenceContext);
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
    for (t in xt) {
      const r = xt[t];
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
    for (let n = 0; n < oi.length; n++) {
      const i = oi[n];
      this.propEventSubscriptions[i] && (this.propEventSubscriptions[i](), delete this.propEventSubscriptions[i]);
      const a = "on" + i, o = t[a];
      o && (this.propEventSubscriptions[i] = this.on(i, o));
    }
    this.prevMotionValues = Vh(this, this.scrapeMotionValuesFromProps(t, this.prevProps, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
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
    return n === void 0 && r !== void 0 && (n = pt(r === null ? void 0 : r, { owner: this }), this.addValue(t, n)), n;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(t, r) {
    let n = this.latestValues[t] !== void 0 || !this.current ? this.latestValues[t] : this.getBaseTargetFromProps(this.props, t) ?? this.readValueFromInstance(this.current, t, this.options);
    return n != null && (typeof n == "string" && (oo(n) || lo(n)) ? n = parseFloat(n) : !Xu(n) && ze.test(r) && (n = Uo(t, r)), this.setBaseTarget(t, de(n) ? n.get() : n)), de(n) ? n.get() : n;
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
      const o = en(this.props, r, (a = this.presenceContext) == null ? void 0 : a.custom);
      o && (n = o[t]);
    }
    if (r && n !== void 0)
      return n;
    const i = this.getBaseTargetFromProps(this.props, t);
    return i !== void 0 && !de(i) ? i : this.initialValues[t] !== void 0 && n === void 0 ? void 0 : this.baseTarget[t];
  }
  on(t, r) {
    return this.events[t] || (this.events[t] = new Er()), this.events[t].add(r);
  }
  notify(t, ...r) {
    this.events[t] && this.events[t].notify(...r);
  }
  scheduleRenderMicrotask() {
    Kr.render(this.render);
  }
}
class ga extends Fh {
  constructor() {
    super(...arguments), this.KeyframeResolver = Fu;
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
    de(t) && (this.childSubscription = t.on("change", (r) => {
      this.current && (this.current.textContent = `${r}`);
    }));
  }
}
function pa(e, { style: t, vars: r }, n, i) {
  const a = e.style;
  let o;
  for (o in t)
    a[o] = t[o];
  i == null || i.applyProjectionStyles(a, n);
  for (o in r)
    a.setProperty(o, r[o]);
}
function Ih(e) {
  return window.getComputedStyle(e);
}
class Oh extends ga {
  constructor() {
    super(...arguments), this.type = "html", this.renderInstance = pa;
  }
  readValueFromInstance(t, r) {
    var n;
    if (Nt.has(r))
      return (n = this.projection) != null && n.isProjecting ? lr(r) : tu(t, r);
    {
      const i = Ih(t), a = (Lr(r) ? i.getPropertyValue(r) : i[r]) || 0;
      return typeof a == "string" ? a.trim() : a;
    }
  }
  measureInstanceViewportBox(t, { transformPagePoint: r }) {
    return ma(t, r);
  }
  build(t, r, n) {
    Zr(t, r, n.transformTemplate);
  }
  scrapeMotionValuesFromProps(t, r, n) {
    return tn(t, r, n);
  }
}
const xa = /* @__PURE__ */ new Set([
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
function Yh(e, t, r, n) {
  pa(e, t, void 0, n);
  for (const i in t.attrs)
    e.setAttribute(xa.has(i) ? i : sn(i), t.attrs[i]);
}
class Bh extends ga {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = te;
  }
  getBaseTargetFromProps(t, r) {
    return t[r];
  }
  readValueFromInstance(t, r) {
    if (Nt.has(r)) {
      const n = $o(r);
      return n && n.default || 0;
    }
    return r = xa.has(r) ? r : sn(r), t.getAttribute(r);
  }
  scrapeMotionValuesFromProps(t, r, n) {
    return oa(t, r, n);
  }
  build(t, r, n) {
    sa(t, r, this.isSVGTag, n.transformTemplate, n.style);
  }
  renderInstance(t, r, n, i) {
    Yh(t, r, n, i);
  }
  mount(t) {
    this.isSVGTag = na(t.tagName), super.mount(t);
  }
}
const zh = (e, t) => Qr(e) ? new Bh(t) : new Oh(t, {
  allowProjection: e !== Wi
});
function mt(e, t, r) {
  const n = e.getProps();
  return en(n, t, r !== void 0 ? r : n.custom, e);
}
const yr = (e) => Array.isArray(e);
function $h(e, t, r) {
  e.hasValue(t) ? e.getValue(t).set(r) : e.addValue(t, pt(r));
}
function Uh(e) {
  return yr(e) ? e[e.length - 1] || 0 : e;
}
function Wh(e, t) {
  const r = mt(e, t);
  let { transitionEnd: n = {}, transition: i = {}, ...a } = r || {};
  a = { ...a, ...n };
  for (const o in a) {
    const l = Uh(a[o]);
    $h(e, o, l);
  }
}
function Hh(e) {
  return !!(de(e) && e.add);
}
function br(e, t) {
  const r = e.getValue("willChange");
  if (Hh(r))
    return r.add(t);
  if (!r && Le.WillChange) {
    const n = new Le.WillChange("auto");
    e.addValue("willChange", n), n.add(t);
  }
}
function ya(e) {
  return e.props[aa];
}
const Kh = (e) => e !== null;
function Gh(e, { repeat: t, repeatType: r = "loop" }, n) {
  const i = e.filter(Kh), a = t && r !== "loop" && t % 2 === 1 ? 0 : i.length - 1;
  return i[a];
}
const qh = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, Xh = (e) => ({
  type: "spring",
  stiffness: 550,
  damping: e === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), Zh = {
  type: "keyframes",
  duration: 0.8
}, Jh = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, Qh = (e, { keyframes: t }) => t.length > 2 ? Zh : Nt.has(e) ? e.startsWith("scale") ? Xh(t[1]) : qh : Jh;
function em({ when: e, delay: t, delayChildren: r, staggerChildren: n, staggerDirection: i, repeat: a, repeatType: o, repeatDelay: l, from: c, elapsed: u, ...d }) {
  return !!Object.keys(d).length;
}
const rn = (e, t, r, n = {}, i, a) => (o) => {
  const l = Wr(n, e) || {}, c = l.delay || n.delay || 0;
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
  em(l) || Object.assign(d, Qh(e, d)), d.duration && (d.duration = /* @__PURE__ */ Te(d.duration)), d.repeatDelay && (d.repeatDelay = /* @__PURE__ */ Te(d.repeatDelay)), d.from !== void 0 && (d.keyframes[0] = d.from);
  let h = !1;
  if ((d.type === !1 || d.duration === 0 && !d.repeatDelay) && (mr(d), d.delay === 0 && (h = !0)), (Le.instantAnimations || Le.skipAnimations) && (h = !0, mr(d), d.delay = 0), d.allowFlatten = !l.type && !l.ease, h && !a && t.get() !== void 0) {
    const f = Gh(d.keyframes, l);
    if (f !== void 0) {
      Z.update(() => {
        d.onUpdate(f), d.onComplete();
      });
      return;
    }
  }
  return l.isSync ? new $r(d) : new ku(d);
};
function tm({ protectedKeys: e, needsAnimating: t }, r) {
  const n = e.hasOwnProperty(r) && t[r] !== !0;
  return t[r] = !1, n;
}
function ba(e, t, { delay: r = 0, transitionOverride: n, type: i } = {}) {
  let { transition: a = e.getDefaultTransition(), transitionEnd: o, ...l } = t;
  n && (a = n);
  const c = [], u = i && e.animationState && e.animationState.getState()[i];
  for (const d in l) {
    const h = e.getValue(d, e.latestValues[d] ?? null), f = l[d];
    if (f === void 0 || u && tm(u, d))
      continue;
    const p = {
      delay: r,
      ...Wr(a || {}, d)
    }, y = h.get();
    if (y !== void 0 && !h.isAnimating && !Array.isArray(f) && f === y && !p.velocity)
      continue;
    let k = !1;
    if (window.MotionHandoffAnimation) {
      const v = ya(e);
      if (v) {
        const j = window.MotionHandoffAnimation(v, d, Z);
        j !== null && (p.startTime = j, k = !0);
      }
    }
    br(e, d), h.start(rn(d, h, f, e.shouldReduceMotion && Yo.has(d) ? { type: !1 } : p, e, k));
    const C = h.animation;
    C && c.push(C);
  }
  return o && Promise.all(c).then(() => {
    Z.update(() => {
      o && Wh(e, o);
    });
  }), c;
}
function va(e, t, r, n = 0, i = 1) {
  const a = Array.from(e).sort((u, d) => u.sortNodePosition(d)).indexOf(t), o = e.size, l = (o - 1) * n;
  return typeof r == "function" ? r(a, o) : i === 1 ? a * n : l - a * n;
}
function vr(e, t, r = {}) {
  var c;
  const n = mt(e, t, r.type === "exit" ? (c = e.presenceContext) == null ? void 0 : c.custom : void 0);
  let { transition: i = e.getDefaultTransition() || {} } = n || {};
  r.transitionOverride && (i = r.transitionOverride);
  const a = n ? () => Promise.all(ba(e, n, r)) : () => Promise.resolve(), o = e.variantChildren && e.variantChildren.size ? (u = 0) => {
    const { delayChildren: d = 0, staggerChildren: h, staggerDirection: f } = i;
    return sm(e, t, u, d, h, f, r);
  } : () => Promise.resolve(), { when: l } = i;
  if (l) {
    const [u, d] = l === "beforeChildren" ? [a, o] : [o, a];
    return u().then(() => d());
  } else
    return Promise.all([a(), o(r.delay)]);
}
function sm(e, t, r = 0, n = 0, i = 0, a = 1, o) {
  const l = [];
  for (const c of e.variantChildren)
    c.notify("AnimationStart", t), l.push(vr(c, t, {
      ...o,
      delay: r + (typeof n == "function" ? 0 : n) + va(e.variantChildren, c, n, i, a)
    }).then(() => c.notify("AnimationComplete", t)));
  return Promise.all(l);
}
function rm(e, t, r = {}) {
  e.notify("AnimationStart", t);
  let n;
  if (Array.isArray(t)) {
    const i = t.map((a) => vr(e, a, r));
    n = Promise.all(i);
  } else if (typeof t == "string")
    n = vr(e, t, r);
  else {
    const i = typeof t == "function" ? mt(e, t, r.custom) : t;
    n = Promise.all(ba(e, i, r));
  }
  return n.then(() => {
    e.notify("AnimationComplete", t);
  });
}
function wa(e, t) {
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
const nm = Xr.length;
function ja(e) {
  if (!e)
    return;
  if (!e.isControllingVariants) {
    const r = e.parent ? ja(e.parent) || {} : {};
    return e.props.initial !== void 0 && (r.initial = e.props.initial), r;
  }
  const t = {};
  for (let r = 0; r < nm; r++) {
    const n = Xr[r], i = e.props[n];
    (Wt(i) || i === !1) && (t[n] = i);
  }
  return t;
}
const im = [...qr].reverse(), om = qr.length;
function am(e) {
  return (t) => Promise.all(t.map(({ animation: r, options: n }) => rm(e, r, n)));
}
function lm(e) {
  let t = am(e), r = ai(), n = !0;
  const i = (c) => (u, d) => {
    var f;
    const h = mt(e, d, c === "exit" ? (f = e.presenceContext) == null ? void 0 : f.custom : void 0);
    if (h) {
      const { transition: p, transitionEnd: y, ...k } = h;
      u = { ...u, ...k, ...y };
    }
    return u;
  };
  function a(c) {
    t = c(e);
  }
  function o(c) {
    const { props: u } = e, d = ja(e.parent) || {}, h = [], f = /* @__PURE__ */ new Set();
    let p = {}, y = 1 / 0;
    for (let C = 0; C < om; C++) {
      const v = im[C], j = r[v], _ = u[v] !== void 0 ? u[v] : d[v], D = Wt(_), A = v === c ? j.isActive : null;
      A === !1 && (y = C);
      let I = _ === d[v] && _ !== u[v] && D;
      if (I && n && e.manuallyAnimateOnMount && (I = !1), j.protectedKeys = { ...p }, // If it isn't active and hasn't *just* been set as inactive
      !j.isActive && A === null || // If we didn't and don't have any defined prop for this animation type
      !_ && !j.prevProp || // Or if the prop doesn't define an animation
      As(_) || typeof _ == "boolean")
        continue;
      const O = cm(j.prevProp, _);
      let T = O || // If we're making this variant active, we want to always make it active
      v === c && j.isActive && !I && D || // If we removed a higher-priority variant (i is in reverse order)
      C > y && D, x = !1;
      const E = Array.isArray(_) ? _ : [_];
      let b = E.reduce(i(v), {});
      A === !1 && (b = {});
      const { prevResolvedValues: L = {} } = j, K = {
        ...L,
        ...b
      }, se = (U) => {
        T = !0, f.has(U) && (x = !0, f.delete(U)), j.needsAnimating[U] = !0;
        const B = e.getValue(U);
        B && (B.liveStyle = !1);
      };
      for (const U in K) {
        const B = b[U], q = L[U];
        if (p.hasOwnProperty(U))
          continue;
        let ie = !1;
        yr(B) && yr(q) ? ie = !wa(B, q) : ie = B !== q, ie ? B != null ? se(U) : f.add(U) : B !== void 0 && f.has(U) ? se(U) : j.protectedKeys[U] = !0;
      }
      j.prevProp = _, j.prevResolvedValues = b, j.isActive && (p = { ...p, ...b }), n && e.blockInitialAnimation && (T = !1);
      const S = I && O;
      T && (!S || x) && h.push(...E.map((U) => {
        const B = { type: v };
        if (typeof U == "string" && n && !S && e.manuallyAnimateOnMount && e.parent) {
          const { parent: q } = e, ie = mt(q, U);
          if (q.enteringChildren && ie) {
            const { delayChildren: Ne } = ie.transition || {};
            B.delay = va(q.enteringChildren, e, Ne);
          }
        }
        return {
          animation: U,
          options: B
        };
      }));
    }
    if (f.size) {
      const C = {};
      if (typeof u.initial != "boolean") {
        const v = mt(e, Array.isArray(u.initial) ? u.initial[0] : u.initial);
        v && v.transition && (C.transition = v.transition);
      }
      f.forEach((v) => {
        const j = e.getBaseTarget(v), _ = e.getValue(v);
        _ && (_.liveStyle = !0), C[v] = j ?? null;
      }), h.push({ animation: C });
    }
    let k = !!h.length;
    return n && (u.initial === !1 || u.initial === u.animate) && !e.manuallyAnimateOnMount && (k = !1), n = !1, k ? t(h) : Promise.resolve();
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
      r = ai(), n = !0;
    }
  };
}
function cm(e, t) {
  return typeof t == "string" ? t !== e : Array.isArray(t) ? !wa(t, e) : !1;
}
function Ke(e = !1) {
  return {
    isActive: e,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function ai() {
  return {
    animate: Ke(!0),
    whileInView: Ke(),
    whileHover: Ke(),
    whileTap: Ke(),
    whileDrag: Ke(),
    whileFocus: Ke(),
    exit: Ke()
  };
}
class Ue {
  constructor(t) {
    this.isMounted = !1, this.node = t;
  }
  update() {
  }
}
class dm extends Ue {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(t) {
    super(t), t.animationState || (t.animationState = lm(t));
  }
  updateAnimationControlsSubscription() {
    const { animate: t } = this.node.getProps();
    As(t) && (this.unmountControls = t.subscribe(this.node));
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
let um = 0;
class hm extends Ue {
  constructor() {
    super(...arguments), this.id = um++;
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
const mm = {
  animation: {
    Feature: dm
  },
  exit: {
    Feature: hm
  }
};
function Kt(e, t, r, n = { passive: !0 }) {
  return e.addEventListener(t, r, n), () => e.removeEventListener(t, r);
}
function Jt(e) {
  return {
    point: {
      x: e.pageX,
      y: e.pageY
    }
  };
}
const fm = (e) => (t) => Gr(t) && e(t, Jt(t));
function Lt(e, t, r, n) {
  return Kt(e, t, fm(r), n);
}
const Na = 1e-4, gm = 1 - Na, pm = 1 + Na, ka = 0.01, xm = 0 - ka, ym = 0 + ka;
function me(e) {
  return e.max - e.min;
}
function bm(e, t, r) {
  return Math.abs(e - t) <= r;
}
function li(e, t, r, n = 0.5) {
  e.origin = n, e.originPoint = Q(t.min, t.max, e.origin), e.scale = me(r) / me(t), e.translate = Q(r.min, r.max, e.origin) - e.originPoint, (e.scale >= gm && e.scale <= pm || isNaN(e.scale)) && (e.scale = 1), (e.translate >= xm && e.translate <= ym || isNaN(e.translate)) && (e.translate = 0);
}
function Vt(e, t, r, n) {
  li(e.x, t.x, r.x, n ? n.originX : void 0), li(e.y, t.y, r.y, n ? n.originY : void 0);
}
function ci(e, t, r) {
  e.min = r.min + t.min, e.max = e.min + me(t);
}
function vm(e, t, r) {
  ci(e.x, t.x, r.x), ci(e.y, t.y, r.y);
}
function di(e, t, r) {
  e.min = t.min - r.min, e.max = e.min + me(t);
}
function Ft(e, t, r) {
  di(e.x, t.x, r.x), di(e.y, t.y, r.y);
}
function we(e) {
  return [e("x"), e("y")];
}
const Ta = ({ current: e }) => e ? e.ownerDocument.defaultView : null, ui = (e, t) => Math.abs(e - t);
function wm(e, t) {
  const r = ui(e.x, t.x), n = ui(e.y, t.y);
  return Math.sqrt(r ** 2 + n ** 2);
}
class Sa {
  constructor(t, r, { transformPagePoint: n, contextWindow: i = window, dragSnapToOrigin: a = !1, distanceThreshold: o = 3 } = {}) {
    if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const f = Hs(this.lastMoveEventInfo, this.history), p = this.startEvent !== null, y = wm(f.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
      if (!p && !y)
        return;
      const { point: k } = f, { timestamp: C } = ae;
      this.history.push({ ...k, timestamp: C });
      const { onStart: v, onMove: j } = this.handlers;
      p || (v && v(this.lastMoveEvent, f), this.startEvent = this.lastMoveEvent), j && j(this.lastMoveEvent, f);
    }, this.handlePointerMove = (f, p) => {
      this.lastMoveEvent = f, this.lastMoveEventInfo = Ws(p, this.transformPagePoint), Z.update(this.updatePoint, !0);
    }, this.handlePointerUp = (f, p) => {
      this.end();
      const { onEnd: y, onSessionEnd: k, resumeAnimation: C } = this.handlers;
      if (this.dragSnapToOrigin && C && C(), !(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const v = Hs(f.type === "pointercancel" ? this.lastMoveEventInfo : Ws(p, this.transformPagePoint), this.history);
      this.startEvent && y && y(f, v), k && k(f, v);
    }, !Gr(t))
      return;
    this.dragSnapToOrigin = a, this.handlers = r, this.transformPagePoint = n, this.distanceThreshold = o, this.contextWindow = i || window;
    const l = Jt(t), c = Ws(l, this.transformPagePoint), { point: u } = c, { timestamp: d } = ae;
    this.history = [{ ...u, timestamp: d }];
    const { onSessionStart: h } = r;
    h && h(t, Hs(c, this.history)), this.removeListeners = qt(Lt(this.contextWindow, "pointermove", this.handlePointerMove), Lt(this.contextWindow, "pointerup", this.handlePointerUp), Lt(this.contextWindow, "pointercancel", this.handlePointerUp));
  }
  updateHandlers(t) {
    this.handlers = t;
  }
  end() {
    this.removeListeners && this.removeListeners(), Be(this.updatePoint);
  }
}
function Ws(e, t) {
  return t ? { point: t(e.point) } : e;
}
function hi(e, t) {
  return { x: e.x - t.x, y: e.y - t.y };
}
function Hs({ point: e }, t) {
  return {
    point: e,
    delta: hi(e, Ca(t)),
    offset: hi(e, jm(t)),
    velocity: Nm(t, 0.1)
  };
}
function jm(e) {
  return e[0];
}
function Ca(e) {
  return e[e.length - 1];
}
function Nm(e, t) {
  if (e.length < 2)
    return { x: 0, y: 0 };
  let r = e.length - 1, n = null;
  const i = Ca(e);
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
function km(e, { min: t, max: r }, n) {
  return t !== void 0 && e < t ? e = n ? Q(t, e, n.min) : Math.max(e, t) : r !== void 0 && e > r && (e = n ? Q(r, e, n.max) : Math.min(e, r)), e;
}
function mi(e, t, r) {
  return {
    min: t !== void 0 ? e.min + t : void 0,
    max: r !== void 0 ? e.max + r - (e.max - e.min) : void 0
  };
}
function Tm(e, { top: t, left: r, bottom: n, right: i }) {
  return {
    x: mi(e.x, r, i),
    y: mi(e.y, t, n)
  };
}
function fi(e, t) {
  let r = t.min - e.min, n = t.max - e.max;
  return t.max - t.min < e.max - e.min && ([r, n] = [n, r]), { min: r, max: n };
}
function Sm(e, t) {
  return {
    x: fi(e.x, t.x),
    y: fi(e.y, t.y)
  };
}
function Cm(e, t) {
  let r = 0.5;
  const n = me(e), i = me(t);
  return i > n ? r = /* @__PURE__ */ zt(t.min, t.max - n, e.min) : n > i && (r = /* @__PURE__ */ zt(e.min, e.max - i, t.min)), De(0, 1, r);
}
function _m(e, t) {
  const r = {};
  return t.min !== void 0 && (r.min = t.min - e.min), t.max !== void 0 && (r.max = t.max - e.min), r;
}
const wr = 0.35;
function Pm(e = wr) {
  return e === !1 ? e = 0 : e === !0 && (e = wr), {
    x: gi(e, "left", "right"),
    y: gi(e, "top", "bottom")
  };
}
function gi(e, t, r) {
  return {
    min: pi(e, t),
    max: pi(e, r)
  };
}
function pi(e, t) {
  return typeof e == "number" ? e : e[t] || 0;
}
const Am = /* @__PURE__ */ new WeakMap();
class Em {
  constructor(t) {
    this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = { x: 0, y: 0 }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = te(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = t;
  }
  start(t, { snapToCursor: r = !1, distanceThreshold: n } = {}) {
    const { presenceContext: i } = this.visualElement;
    if (i && i.isPresent === !1)
      return;
    const a = (h) => {
      const { dragSnapToOrigin: f } = this.getProps();
      f ? this.pauseAnimation() : this.stopAnimation(), r && this.snapToCursor(Jt(h).point);
    }, o = (h, f) => {
      const { drag: p, dragPropagation: y, onDragStart: k } = this.getProps();
      if (p && !y && (this.openDragLock && this.openDragLock(), this.openDragLock = zu(p), !this.openDragLock))
        return;
      this.latestPointerEvent = h, this.latestPanInfo = f, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), we((v) => {
        let j = this.getAxisMotionValue(v).get() || 0;
        if (_e.test(j)) {
          const { projection: _ } = this.visualElement;
          if (_ && _.layout) {
            const D = _.layout.layoutBox[v];
            D && (j = me(D) * (parseFloat(j) / 100));
          }
        }
        this.originPoint[v] = j;
      }), k && Z.postRender(() => k(h, f)), br(this.visualElement, "transform");
      const { animationState: C } = this.visualElement;
      C && C.setActive("whileDrag", !0);
    }, l = (h, f) => {
      this.latestPointerEvent = h, this.latestPanInfo = f;
      const { dragPropagation: p, dragDirectionLock: y, onDirectionLock: k, onDrag: C } = this.getProps();
      if (!p && !this.openDragLock)
        return;
      const { offset: v } = f;
      if (y && this.currentDirection === null) {
        this.currentDirection = Mm(v), this.currentDirection !== null && k && k(this.currentDirection);
        return;
      }
      this.updateAxis("x", f.point, v), this.updateAxis("y", f.point, v), this.visualElement.render(), C && C(h, f);
    }, c = (h, f) => {
      this.latestPointerEvent = h, this.latestPanInfo = f, this.stop(h, f), this.latestPointerEvent = null, this.latestPanInfo = null;
    }, u = () => we((h) => {
      var f;
      return this.getAnimationState(h) === "paused" && ((f = this.getAxisMotionValue(h).animation) == null ? void 0 : f.play());
    }), { dragSnapToOrigin: d } = this.getProps();
    this.panSession = new Sa(t, {
      onSessionStart: a,
      onStart: o,
      onMove: l,
      onSessionEnd: c,
      resumeAnimation: u
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin: d,
      distanceThreshold: n,
      contextWindow: Ta(this.visualElement)
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
    this.constraints && this.constraints[t] && (o = km(o, this.constraints[t], this.elastic[t])), a.set(o);
  }
  resolveConstraints() {
    var a;
    const { dragConstraints: t, dragElastic: r } = this.getProps(), n = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : (a = this.visualElement.projection) == null ? void 0 : a.layout, i = this.constraints;
    t && lt(t) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : t && n ? this.constraints = Tm(n.layoutBox, t) : this.constraints = !1, this.elastic = Pm(r), i !== this.constraints && n && this.constraints && !this.hasMutatedConstraints && we((o) => {
      this.constraints !== !1 && this.getAxisMotionValue(o) && (this.constraints[o] = _m(n.layoutBox[o], this.constraints[o]));
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
    const a = Dh(n, i.root, this.visualElement.getTransformPagePoint());
    let o = Sm(i.layout.layoutBox, a);
    if (r) {
      const l = r(Ah(o));
      this.hasMutatedConstraints = !!l, l && (o = da(l));
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
    return br(this.visualElement, t), n.start(rn(t, n, 0, r, this.visualElement, !1));
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
        i[o] = Cm({ min: c, max: c }, this.constraints[o]);
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
    Am.set(this.visualElement, this);
    const t = this.visualElement.current, r = Lt(t, "pointerdown", (c) => {
      const { drag: u, dragListener: d = !0 } = this.getProps();
      u && d && this.start(c);
    }), n = () => {
      const { dragConstraints: c } = this.getProps();
      lt(c) && c.current && (this.constraints = this.resolveRefConstraints());
    }, { projection: i } = this.visualElement, a = i.addEventListener("measure", n);
    i && !i.layout && (i.root && i.root.updateScroll(), i.updateLayout()), Z.read(n);
    const o = Kt(window, "resize", () => this.scalePositionWithinConstraints()), l = i.addEventListener("didUpdate", ({ delta: c, hasLayoutChanged: u }) => {
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
    const t = this.visualElement.getProps(), { drag: r = !1, dragDirectionLock: n = !1, dragPropagation: i = !1, dragConstraints: a = !1, dragElastic: o = wr, dragMomentum: l = !0 } = t;
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
function Mm(e, t = 10) {
  let r = null;
  return Math.abs(e.y) > t ? r = "y" : Math.abs(e.x) > t && (r = "x"), r;
}
class Dm extends Ue {
  constructor(t) {
    super(t), this.removeGroupControls = je, this.removeListeners = je, this.controls = new Em(t);
  }
  mount() {
    const { dragControls: t } = this.node.getProps();
    t && (this.removeGroupControls = t.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || je;
  }
  unmount() {
    this.removeGroupControls(), this.removeListeners();
  }
}
const xi = (e) => (t, r) => {
  e && Z.postRender(() => e(t, r));
};
class Rm extends Ue {
  constructor() {
    super(...arguments), this.removePointerDownListener = je;
  }
  onPointerDown(t) {
    this.session = new Sa(t, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: Ta(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: t, onPanStart: r, onPan: n, onPanEnd: i } = this.node.getProps();
    return {
      onSessionStart: xi(t),
      onStart: xi(r),
      onMove: n,
      onEnd: (a, o) => {
        delete this.session, i && Z.postRender(() => i(a, o));
      }
    };
  }
  mount() {
    this.removePointerDownListener = Lt(this.node.current, "pointerdown", (t) => this.onPointerDown(t));
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
function yi(e, t) {
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
    const r = yi(e, t.target.x), n = yi(e, t.target.y);
    return `${r}% ${n}%`;
  }
}, Lm = {
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
let Ks = !1;
class Vm extends ml {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement: t, layoutGroup: r, switchLayoutGroup: n, layoutId: i } = this.props, { projection: a } = t;
    nh(Fm), a && (r.group && r.group.add(a), n && n.register && i && n.register(a), Ks && a.root.didUpdate(), a.addEventListener("animationComplete", () => {
      this.safeToRemove();
    }), a.setOptions({
      ...a.options,
      onExitComplete: () => this.safeToRemove()
    })), ps.hasEverUpdated = !0;
  }
  getSnapshotBeforeUpdate(t) {
    const { layoutDependency: r, visualElement: n, drag: i, isPresent: a } = this.props, { projection: o } = n;
    return o && (o.isPresent = a, Ks = !0, i || t.layoutDependency !== r || r === void 0 || t.isPresent !== a ? o.willUpdate() : this.safeToRemove(), t.isPresent !== a && (a ? o.promote() : o.relegate() || Z.postRender(() => {
      const l = o.getStack();
      (!l || !l.members.length) && this.safeToRemove();
    }))), null;
  }
  componentDidUpdate() {
    const { projection: t } = this.props.visualElement;
    t && (t.root.didUpdate(), Kr.postRender(() => {
      !t.currentAnimation && t.isLead() && this.safeToRemove();
    }));
  }
  componentWillUnmount() {
    const { visualElement: t, layoutGroup: r, switchLayoutGroup: n } = this.props, { projection: i } = t;
    Ks = !0, i && (i.scheduleCheckAfterUnmount(), r && r.group && r.group.remove(i), n && n.deregister && n.deregister(i));
  }
  safeToRemove() {
    const { safeToRemove: t } = this.props;
    t && t();
  }
  render() {
    return null;
  }
}
function _a(e) {
  const [t, r] = Zu(), n = ce(io);
  return s.jsx(Vm, { ...e, layoutGroup: n, switchLayoutGroup: ce(la), isPresent: t, safeToRemove: r });
}
const Fm = {
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
  boxShadow: Lm
};
function Im(e, t, r) {
  const n = de(e) ? e : pt(e);
  return n.start(rn("", n, t, r)), n.animation;
}
const Om = (e, t) => e.depth - t.depth;
class Ym {
  constructor() {
    this.children = [], this.isDirty = !1;
  }
  add(t) {
    _r(this.children, t), this.isDirty = !0;
  }
  remove(t) {
    Pr(this.children, t), this.isDirty = !0;
  }
  forEach(t) {
    this.isDirty && this.children.sort(Om), this.isDirty = !1, this.children.forEach(t);
  }
}
function Bm(e, t) {
  const r = ge.now(), n = ({ timestamp: i }) => {
    const a = i - r;
    a >= t && (Be(n), e(a - t));
  };
  return Z.setup(n, !0), () => Be(n);
}
const Pa = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"], zm = Pa.length, bi = (e) => typeof e == "string" ? parseFloat(e) : e, vi = (e) => typeof e == "number" || V.test(e);
function $m(e, t, r, n, i, a) {
  i ? (e.opacity = Q(0, r.opacity ?? 1, Um(n)), e.opacityExit = Q(t.opacity ?? 1, 0, Wm(n))) : a && (e.opacity = Q(t.opacity ?? 1, r.opacity ?? 1, n));
  for (let o = 0; o < zm; o++) {
    const l = `border${Pa[o]}Radius`;
    let c = wi(t, l), u = wi(r, l);
    if (c === void 0 && u === void 0)
      continue;
    c || (c = 0), u || (u = 0), c === 0 || u === 0 || vi(c) === vi(u) ? (e[l] = Math.max(Q(bi(c), bi(u), n), 0), (_e.test(u) || _e.test(c)) && (e[l] += "%")) : e[l] = u;
  }
  (t.rotate || r.rotate) && (e.rotate = Q(t.rotate || 0, r.rotate || 0, n));
}
function wi(e, t) {
  return e[t] !== void 0 ? e[t] : e.borderRadius;
}
const Um = /* @__PURE__ */ Aa(0, 0.5, xo), Wm = /* @__PURE__ */ Aa(0.5, 0.95, je);
function Aa(e, t, r) {
  return (n) => n < e ? 0 : n > t ? 1 : r(/* @__PURE__ */ zt(e, t, n));
}
function ji(e, t) {
  e.min = t.min, e.max = t.max;
}
function ve(e, t) {
  ji(e.x, t.x), ji(e.y, t.y);
}
function Ni(e, t) {
  e.translate = t.translate, e.scale = t.scale, e.originPoint = t.originPoint, e.origin = t.origin;
}
function ki(e, t, r, n, i) {
  return e -= t, e = ks(e, 1 / r, n), i !== void 0 && (e = ks(e, 1 / i, n)), e;
}
function Hm(e, t = 0, r = 1, n = 0.5, i, a = e, o = e) {
  if (_e.test(t) && (t = parseFloat(t), t = Q(o.min, o.max, t / 100) - o.min), typeof t != "number")
    return;
  let l = Q(a.min, a.max, n);
  e === a && (l -= t), e.min = ki(e.min, t, r, l, i), e.max = ki(e.max, t, r, l, i);
}
function Ti(e, t, [r, n, i], a, o) {
  Hm(e, t[r], t[n], t[i], t.scale, a, o);
}
const Km = ["x", "scaleX", "originX"], Gm = ["y", "scaleY", "originY"];
function Si(e, t, r, n) {
  Ti(e.x, t, Km, r ? r.x : void 0, n ? n.x : void 0), Ti(e.y, t, Gm, r ? r.y : void 0, n ? n.y : void 0);
}
function Ci(e) {
  return e.translate === 0 && e.scale === 1;
}
function Ea(e) {
  return Ci(e.x) && Ci(e.y);
}
function _i(e, t) {
  return e.min === t.min && e.max === t.max;
}
function qm(e, t) {
  return _i(e.x, t.x) && _i(e.y, t.y);
}
function Pi(e, t) {
  return Math.round(e.min) === Math.round(t.min) && Math.round(e.max) === Math.round(t.max);
}
function Ma(e, t) {
  return Pi(e.x, t.x) && Pi(e.y, t.y);
}
function Ai(e) {
  return me(e.x) / me(e.y);
}
function Ei(e, t) {
  return e.translate === t.translate && e.scale === t.scale && e.originPoint === t.originPoint;
}
class Xm {
  constructor() {
    this.members = [];
  }
  add(t) {
    _r(this.members, t), t.scheduleRender();
  }
  remove(t) {
    if (Pr(this.members, t), t === this.prevLead && (this.prevLead = void 0), t === this.lead) {
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
function Zm(e, t, r) {
  let n = "";
  const i = e.x.translate / t.x, a = e.y.translate / t.y, o = (r == null ? void 0 : r.z) || 0;
  if ((i || a || o) && (n = `translate3d(${i}px, ${a}px, ${o}px) `), (t.x !== 1 || t.y !== 1) && (n += `scale(${1 / t.x}, ${1 / t.y}) `), r) {
    const { transformPerspective: u, rotate: d, rotateX: h, rotateY: f, skewX: p, skewY: y } = r;
    u && (n = `perspective(${u}px) ${n}`), d && (n += `rotate(${d}deg) `), h && (n += `rotateX(${h}deg) `), f && (n += `rotateY(${f}deg) `), p && (n += `skewX(${p}deg) `), y && (n += `skewY(${y}deg) `);
  }
  const l = e.x.scale * t.x, c = e.y.scale * t.y;
  return (l !== 1 || c !== 1) && (n += `scale(${l}, ${c})`), n || "none";
}
const Gs = ["", "X", "Y", "Z"], Jm = 1e3;
let Qm = 0;
function qs(e, t, r, n) {
  const { latestValues: i } = t;
  i[e] && (r[e] = i[e], t.setStaticValue(e, 0), n && (n[e] = 0));
}
function Da(e) {
  if (e.hasCheckedOptimisedAppear = !0, e.root === e)
    return;
  const { visualElement: t } = e.options;
  if (!t)
    return;
  const r = ya(t);
  if (window.MotionHasOptimisedAnimation(r, "transform")) {
    const { layout: i, layoutId: a } = e.options;
    window.MotionCancelOptimisedAnimation(r, "transform", Z, !(i || a));
  }
  const { parent: n } = e;
  n && !n.hasCheckedOptimisedAppear && Da(n);
}
function Ra({ attachResizeListener: e, defaultParent: t, measureScroll: r, checkIsScrollRoot: n, resetTransform: i }) {
  return class {
    constructor(o = {}, l = t == null ? void 0 : t()) {
      this.id = Qm++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
        this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
      }, this.updateProjection = () => {
        this.projectionUpdateScheduled = !1, this.nodes.forEach(sf), this.nodes.forEach(af), this.nodes.forEach(lf), this.nodes.forEach(rf);
      }, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = o, this.root = l ? l.root || l : this, this.path = l ? [...l.path, l] : [], this.parent = l, this.depth = l ? l.depth + 1 : 0;
      for (let c = 0; c < this.path.length; c++)
        this.path[c].shouldResetTransform = !0;
      this.root === this && (this.nodes = new Ym());
    }
    addEventListener(o, l) {
      return this.eventHandlers.has(o) || this.eventHandlers.set(o, new Er()), this.eventHandlers.get(o).add(l);
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
      this.isSVG = qo(o) && !Gu(o), this.instance = o;
      const { layoutId: l, layout: c, visualElement: u } = this.options;
      if (u && !u.current && u.mount(o), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (c || l) && (this.isLayoutDirty = !0), e) {
        let d, h = 0;
        const f = () => this.root.updateBlockedByResize = !1;
        Z.read(() => {
          h = window.innerWidth;
        }), e(o, () => {
          const p = window.innerWidth;
          p !== h && (h = p, this.root.updateBlockedByResize = !0, d && d(), d = Bm(f, 250), ps.hasAnimatedSinceResize && (ps.hasAnimatedSinceResize = !1, this.nodes.forEach(Ri)));
        });
      }
      l && this.root.registerSharedNode(l, this), this.options.animate !== !1 && u && (l || c) && this.addEventListener("didUpdate", ({ delta: d, hasLayoutChanged: h, hasRelativeLayoutChanged: f, layout: p }) => {
        if (this.isTreeAnimationBlocked()) {
          this.target = void 0, this.relativeTarget = void 0;
          return;
        }
        const y = this.options.transition || u.getDefaultTransition() || mf, { onLayoutAnimationStart: k, onLayoutAnimationComplete: C } = u.getProps(), v = !this.targetLayout || !Ma(this.targetLayout, p), j = !h && f;
        if (this.options.layoutRoot || this.resumeFrom || j || h && (v || !this.currentAnimation)) {
          this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
          const _ = {
            ...Wr(y, "layout"),
            onPlay: k,
            onComplete: C
          };
          (u.shouldReduceMotion || this.options.layoutRoot) && (_.delay = 0, _.type = !1), this.startAnimation(_), this.setAnimationOrigin(d, j);
        } else
          h || Ri(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
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
      this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(cf), this.animationId++);
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
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && Da(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
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
        this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(Mi);
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(Di);
        return;
      }
      this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(of), this.nodes.forEach(ef), this.nodes.forEach(tf)) : this.nodes.forEach(Di), this.clearAllSnapshots();
      const l = ge.now();
      ae.delta = De(0, 1e3 / 60, l - ae.timestamp), ae.timestamp = l, ae.isProcessing = !0, Fs.update.process(ae), Fs.preRender.process(ae), Fs.render.process(ae), ae.isProcessing = !1;
    }
    didUpdate() {
      this.updateScheduled || (this.updateScheduled = !0, Kr.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      this.nodes.forEach(nf), this.sharedNodes.forEach(df);
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
      this.snapshot || !this.instance || (this.snapshot = this.measure(), this.snapshot && !me(this.snapshot.measuredBox.x) && !me(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
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
      const o = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, l = this.projectionDelta && !Ea(this.projectionDelta), c = this.getTransformTemplate(), u = c ? c(this.latestValues, "") : void 0, d = u !== this.prevTransformTemplateValue;
      o && this.instance && (l || Ge(this.latestValues) || d) && (i(this.instance, u), this.shouldResetTransform = !1, this.scheduleRender());
    }
    measure(o = !0) {
      const l = this.measurePageBox();
      let c = this.removeElementScroll(l);
      return o && (c = this.removeTransform(c)), ff(c), {
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
      if (!(((u = this.scroll) == null ? void 0 : u.wasRoot) || this.path.some(gf))) {
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
        }), Ge(d.latestValues) && dt(c, d.latestValues);
      }
      return Ge(this.latestValues) && dt(c, this.latestValues), c;
    }
    removeTransform(o) {
      const l = te();
      ve(l, o);
      for (let c = 0; c < this.path.length; c++) {
        const u = this.path[c];
        if (!u.instance || !Ge(u.latestValues))
          continue;
        gr(u.latestValues) && u.updateSnapshot();
        const d = te(), h = u.measurePageBox();
        ve(d, h), Si(l, u.latestValues, u.snapshot ? u.snapshot.layoutBox : void 0, d);
      }
      return Ge(this.latestValues) && Si(l, this.latestValues), l;
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
      this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== ae.timestamp && this.relativeParent.resolveTargetDelta(!0);
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
        if (this.resolvedRelativeTargetAt = ae.timestamp, !this.targetDelta && !this.relativeTarget) {
          const p = this.getClosestProjectingParent();
          p && p.layout && this.animationProgress !== 1 ? (this.relativeParent = p, this.forceRelativeParentToResolveTarget(), this.relativeTarget = te(), this.relativeTargetOrigin = te(), Ft(this.relativeTargetOrigin, this.layout.layoutBox, p.layout.layoutBox), ve(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
        if (!(!this.relativeTarget && !this.targetDelta) && (this.target || (this.target = te(), this.targetWithTransforms = te()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), vm(this.target, this.relativeTarget, this.relativeParent.target)) : this.targetDelta ? (this.resumingFrom ? this.target = this.applyTransform(this.layout.layoutBox) : ve(this.target, this.layout.layoutBox), ha(this.target, this.targetDelta)) : ve(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget)) {
          this.attemptToResolveRelativeTarget = !1;
          const p = this.getClosestProjectingParent();
          p && !!p.resumingFrom == !!this.resumingFrom && !p.options.layoutScroll && p.target && this.animationProgress !== 1 ? (this.relativeParent = p, this.forceRelativeParentToResolveTarget(), this.relativeTarget = te(), this.relativeTargetOrigin = te(), Ft(this.relativeTargetOrigin, this.target, p.target), ve(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
      }
    }
    getClosestProjectingParent() {
      if (!(!this.parent || gr(this.parent.latestValues) || ua(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    calcProjection() {
      var y;
      const o = this.getLead(), l = !!this.resumingFrom || this !== o;
      let c = !0;
      if ((this.isProjectionDirty || (y = this.parent) != null && y.isProjectionDirty) && (c = !1), l && (this.isSharedProjectionDirty || this.isTransformDirty) && (c = !1), this.resolvedRelativeTargetAt === ae.timestamp && (c = !1), c)
        return;
      const { layout: u, layoutId: d } = this.options;
      if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(u || d))
        return;
      ve(this.layoutCorrected, this.layout.layoutBox);
      const h = this.treeScale.x, f = this.treeScale.y;
      Mh(this.layoutCorrected, this.treeScale, this.path, l), o.layout && !o.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (o.target = o.layout.layoutBox, o.targetWithTransforms = te());
      const { target: p } = o;
      if (!p) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (Ni(this.prevProjectionDelta.x, this.projectionDelta.x), Ni(this.prevProjectionDelta.y, this.projectionDelta.y)), Vt(this.projectionDelta, this.layoutCorrected, p, this.latestValues), (this.treeScale.x !== h || this.treeScale.y !== f || !Ei(this.projectionDelta.x, this.prevProjectionDelta.x) || !Ei(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", p));
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
      const f = te(), p = c ? c.source : void 0, y = this.layout ? this.layout.source : void 0, k = p !== y, C = this.getStack(), v = !C || C.members.length <= 1, j = !!(k && !v && this.options.crossfade === !0 && !this.path.some(hf));
      this.animationProgress = 0;
      let _;
      this.mixTargetDelta = (D) => {
        const A = D / 1e3;
        Li(h.x, o.x, A), Li(h.y, o.y, A), this.setTargetDelta(h), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (Ft(f, this.layout.layoutBox, this.relativeParent.layout.layoutBox), uf(this.relativeTarget, this.relativeTargetOrigin, f, A), _ && qm(this.relativeTarget, _) && (this.isProjectionDirty = !1), _ || (_ = te()), ve(_, this.relativeTarget)), k && (this.animationValues = d, $m(d, u, this.latestValues, A, j, v)), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = A;
      }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(o) {
      var l, c, u;
      this.notifyListeners("animationStart"), (l = this.currentAnimation) == null || l.stop(), (u = (c = this.resumingFrom) == null ? void 0 : c.currentAnimation) == null || u.stop(), this.pendingAnimation && (Be(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = Z.update(() => {
        ps.hasAnimatedSinceResize = !0, this.motionValue || (this.motionValue = pt(0)), this.currentAnimation = Im(this.motionValue, [0, 1e3], {
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
      this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(Jm), this.currentAnimation.stop()), this.completeAnimation();
    }
    applyTransformsToTarget() {
      const o = this.getLead();
      let { targetWithTransforms: l, target: c, layout: u, latestValues: d } = o;
      if (!(!l || !c || !u)) {
        if (this !== o && this.layout && u && La(this.options.animationType, this.layout.layoutBox, u.layoutBox)) {
          c = this.target || te();
          const h = me(this.layout.layoutBox.x);
          c.x.min = o.target.x.min, c.x.max = c.x.min + h;
          const f = me(this.layout.layoutBox.y);
          c.y.min = o.target.y.min, c.y.max = c.y.min + f;
        }
        ve(l, c), dt(l, d), Vt(this.projectionDeltaWithTransform, this.layoutCorrected, l, d);
      }
    }
    registerSharedNode(o, l) {
      this.sharedNodes.has(o) || this.sharedNodes.set(o, new Xm()), this.sharedNodes.get(o).add(l);
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
      c.z && qs("z", o, u, this.animationValues);
      for (let d = 0; d < Gs.length; d++)
        qs(`rotate${Gs[d]}`, o, u, this.animationValues), qs(`skew${Gs[d]}`, o, u, this.animationValues);
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
        this.options.layoutId && (o.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, o.pointerEvents = gs(l == null ? void 0 : l.pointerEvents) || ""), this.hasProjected && !Ge(this.latestValues) && (o.transform = c ? c({}, "") : "none", this.hasProjected = !1);
        return;
      }
      o.visibility = "";
      const d = u.animationValues || u.latestValues;
      this.applyTransformsToTarget();
      let h = Zm(this.projectionDeltaWithTransform, this.treeScale, d);
      c && (h = c(d, h)), o.transform = h;
      const { x: f, y: p } = this.projectionDelta;
      o.transformOrigin = `${f.origin * 100}% ${p.origin * 100}% 0`, u.animationValues ? o.opacity = u === this ? d.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : d.opacityExit : o.opacity = u === this ? d.opacity !== void 0 ? d.opacity : "" : d.opacityExit !== void 0 ? d.opacityExit : 0;
      for (const y in Ht) {
        if (d[y] === void 0)
          continue;
        const { correct: k, applyTo: C, isCSSVariable: v } = Ht[y], j = h === "none" ? d[y] : k(d[y], u);
        if (C) {
          const _ = C.length;
          for (let D = 0; D < _; D++)
            o[C[D]] = j;
        } else
          v ? this.options.visualElement.renderState.vars[y] = j : o[y] = j;
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
      }), this.root.nodes.forEach(Mi), this.root.sharedNodes.clear();
    }
  };
}
function ef(e) {
  e.updateLayout();
}
function tf(e) {
  var r;
  const t = ((r = e.resumeFrom) == null ? void 0 : r.snapshot) || e.snapshot;
  if (e.isLead() && e.layout && t && e.hasListeners("didUpdate")) {
    const { layoutBox: n, measuredBox: i } = e.layout, { animationType: a } = e.options, o = t.source !== e.layout.source;
    a === "size" ? we((h) => {
      const f = o ? t.measuredBox[h] : t.layoutBox[h], p = me(f);
      f.min = n[h].min, f.max = f.min + p;
    }) : La(a, t.layoutBox, n) && we((h) => {
      const f = o ? t.measuredBox[h] : t.layoutBox[h], p = me(n[h]);
      f.max = f.min + p, e.relativeTarget && !e.currentAnimation && (e.isProjectionDirty = !0, e.relativeTarget[h].max = e.relativeTarget[h].min + p);
    });
    const l = ut();
    Vt(l, n, t.layoutBox);
    const c = ut();
    o ? Vt(c, e.applyTransform(i, !0), t.measuredBox) : Vt(c, n, t.layoutBox);
    const u = !Ea(l);
    let d = !1;
    if (!e.resumeFrom) {
      const h = e.getClosestProjectingParent();
      if (h && !h.resumeFrom) {
        const { snapshot: f, layout: p } = h;
        if (f && p) {
          const y = te();
          Ft(y, t.layoutBox, f.layoutBox);
          const k = te();
          Ft(k, n, p.layoutBox), Ma(y, k) || (d = !0), h.options.layoutRoot && (e.relativeTarget = k, e.relativeTargetOrigin = y, e.relativeParent = h);
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
function sf(e) {
  e.parent && (e.isProjecting() || (e.isProjectionDirty = e.parent.isProjectionDirty), e.isSharedProjectionDirty || (e.isSharedProjectionDirty = !!(e.isProjectionDirty || e.parent.isProjectionDirty || e.parent.isSharedProjectionDirty)), e.isTransformDirty || (e.isTransformDirty = e.parent.isTransformDirty));
}
function rf(e) {
  e.isProjectionDirty = e.isSharedProjectionDirty = e.isTransformDirty = !1;
}
function nf(e) {
  e.clearSnapshot();
}
function Mi(e) {
  e.clearMeasurements();
}
function Di(e) {
  e.isLayoutDirty = !1;
}
function of(e) {
  const { visualElement: t } = e.options;
  t && t.getProps().onBeforeLayoutMeasure && t.notify("BeforeLayoutMeasure"), e.resetTransform();
}
function Ri(e) {
  e.finishAnimation(), e.targetDelta = e.relativeTarget = e.target = void 0, e.isProjectionDirty = !0;
}
function af(e) {
  e.resolveTargetDelta();
}
function lf(e) {
  e.calcProjection();
}
function cf(e) {
  e.resetSkewAndRotation();
}
function df(e) {
  e.removeLeadSnapshot();
}
function Li(e, t, r) {
  e.translate = Q(t.translate, 0, r), e.scale = Q(t.scale, 1, r), e.origin = t.origin, e.originPoint = t.originPoint;
}
function Vi(e, t, r, n) {
  e.min = Q(t.min, r.min, n), e.max = Q(t.max, r.max, n);
}
function uf(e, t, r, n) {
  Vi(e.x, t.x, r.x, n), Vi(e.y, t.y, r.y, n);
}
function hf(e) {
  return e.animationValues && e.animationValues.opacityExit !== void 0;
}
const mf = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
}, Fi = (e) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(e), Ii = Fi("applewebkit/") && !Fi("chrome/") ? Math.round : je;
function Oi(e) {
  e.min = Ii(e.min), e.max = Ii(e.max);
}
function ff(e) {
  Oi(e.x), Oi(e.y);
}
function La(e, t, r) {
  return e === "position" || e === "preserve-aspect" && !bm(Ai(t), Ai(r), 0.2);
}
function gf(e) {
  var t;
  return e !== e.root && ((t = e.scroll) == null ? void 0 : t.wasRoot);
}
const pf = Ra({
  attachResizeListener: (e, t) => Kt(e, "resize", t),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body.scrollLeft,
    y: document.documentElement.scrollTop || document.body.scrollTop
  }),
  checkIsScrollRoot: () => !0
}), Xs = {
  current: void 0
}, Va = Ra({
  measureScroll: (e) => ({
    x: e.scrollLeft,
    y: e.scrollTop
  }),
  defaultParent: () => {
    if (!Xs.current) {
      const e = new pf({});
      e.mount(window), e.setOptions({ layoutScroll: !0 }), Xs.current = e;
    }
    return Xs.current;
  },
  resetTransform: (e, t) => {
    e.style.transform = t !== void 0 ? t : "none";
  },
  checkIsScrollRoot: (e) => window.getComputedStyle(e).position === "fixed"
}), xf = {
  pan: {
    Feature: Rm
  },
  drag: {
    Feature: Dm,
    ProjectionNode: Va,
    MeasureLayout: _a
  }
};
function Yi(e, t, r) {
  const { props: n } = e;
  e.animationState && n.whileHover && e.animationState.setActive("whileHover", r === "Start");
  const i = "onHover" + r, a = n[i];
  a && Z.postRender(() => a(t, Jt(t)));
}
class yf extends Ue {
  mount() {
    const { current: t } = this.node;
    t && (this.unmount = $u(t, (r, n) => (Yi(this.node, n, "Start"), (i) => Yi(this.node, i, "End"))));
  }
  unmount() {
  }
}
class bf extends Ue {
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
    this.unmount = qt(Kt(this.node.current, "focus", () => this.onFocus()), Kt(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
function Bi(e, t, r) {
  const { props: n } = e;
  if (e.current instanceof HTMLButtonElement && e.current.disabled)
    return;
  e.animationState && n.whileTap && e.animationState.setActive("whileTap", r === "Start");
  const i = "onTap" + (r === "End" ? "" : r), a = n[i];
  a && Z.postRender(() => a(t, Jt(t)));
}
class vf extends Ue {
  mount() {
    const { current: t } = this.node;
    t && (this.unmount = Ku(t, (r, n) => (Bi(this.node, n, "Start"), (i, { success: a }) => Bi(this.node, i, a ? "End" : "Cancel")), { useGlobalTarget: this.node.props.globalTapTarget }));
  }
  unmount() {
  }
}
const jr = /* @__PURE__ */ new WeakMap(), Zs = /* @__PURE__ */ new WeakMap(), wf = (e) => {
  const t = jr.get(e.target);
  t && t(e);
}, jf = (e) => {
  e.forEach(wf);
};
function Nf({ root: e, ...t }) {
  const r = e || document;
  Zs.has(r) || Zs.set(r, {});
  const n = Zs.get(r), i = JSON.stringify(t);
  return n[i] || (n[i] = new IntersectionObserver(jf, { root: e, ...t })), n[i];
}
function kf(e, t, r) {
  const n = Nf(t);
  return jr.set(e, r), n.observe(e), () => {
    jr.delete(e), n.unobserve(e);
  };
}
const Tf = {
  some: 0,
  all: 1
};
class Sf extends Ue {
  constructor() {
    super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
  }
  startObserver() {
    this.unmount();
    const { viewport: t = {} } = this.node.getProps(), { root: r, margin: n, amount: i = "some", once: a } = t, o = {
      root: r ? r.current : void 0,
      rootMargin: n,
      threshold: typeof i == "number" ? i : Tf[i]
    }, l = (c) => {
      const { isIntersecting: u } = c;
      if (this.isInView === u || (this.isInView = u, a && !u && this.hasEnteredView))
        return;
      u && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", u);
      const { onViewportEnter: d, onViewportLeave: h } = this.node.getProps(), f = u ? d : h;
      f && f(c);
    };
    return kf(this.node.current, o, l);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u")
      return;
    const { props: t, prevProps: r } = this.node;
    ["amount", "margin", "root"].some(Cf(t, r)) && this.startObserver();
  }
  unmount() {
  }
}
function Cf({ viewport: e = {} }, { viewport: t = {} } = {}) {
  return (r) => e[r] !== t[r];
}
const _f = {
  inView: {
    Feature: Sf
  },
  tap: {
    Feature: vf
  },
  focus: {
    Feature: bf
  },
  hover: {
    Feature: yf
  }
}, Pf = {
  layout: {
    ProjectionNode: Va,
    MeasureLayout: _a
  }
}, Af = {
  ...mm,
  ..._f,
  ...xf,
  ...Pf
}, It = /* @__PURE__ */ Ph(Af, zh), Sg = () => {
  var i, a;
  const { isAuthenticated: e } = Cs(), t = (a = (i = import.meta) == null ? void 0 : i.env) == null ? void 0 : a.VITE_STRIPE_PUBLISHABLE_KEY, r = [
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
      const l = Ol.auth.session();
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
      const d = await Zc(t);
      d && d.redirectToCheckout({ sessionId: u.sessionId });
    } catch (l) {
      console.error("Error creating checkout session:", l);
    }
  };
  return /* @__PURE__ */ s.jsx(s.Fragment, { children: /* @__PURE__ */ s.jsx("div", { className: "relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 overflow-hidden", children: /* @__PURE__ */ s.jsx("div", { className: "relative z-10", children: /* @__PURE__ */ s.jsxs("div", { className: "container mx-auto px-4 py-16 md:py-24", children: [
    /* @__PURE__ */ s.jsxs(
      It.div,
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
    /* @__PURE__ */ s.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto", children: r.map((o, l) => /* @__PURE__ */ s.jsx(
      It.div,
      {
        initial: { opacity: 0, y: 50, rotateY: -10 },
        animate: { opacity: 1, y: 0, rotateY: 0 },
        transition: { delay: l * 0.2 + 0.4, duration: 0.8, type: "spring", damping: 20 },
        className: `relative group cursor-pointer ${o.popular ? "md:scale-105 z-20" : "z-10"}`,
        children: /* @__PURE__ */ s.jsxs("div", { className: `
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
              gt,
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
                /* @__PURE__ */ s.jsx(Vl, { className: "w-5 h-5 transition-transform group-hover:translate-x-1" })
              ]
            }
          )
        ] })
      },
      o.id
    )) })
  ] }) }) }) });
}, Cg = () => /* @__PURE__ */ s.jsx("div", { className: "relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center", children: /* @__PURE__ */ s.jsxs(
  It.div,
  {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.8, ease: "easeOut" },
    className: "text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-green-400 rounded-3xl p-8 md:p-12 shadow-2xl shadow-green-500/25 max-w-2xl mx-auto",
    children: [
      /* @__PURE__ */ s.jsx(
        It.div,
        {
          initial: { scale: 0 },
          animate: { scale: 1 },
          transition: { delay: 0.2, type: "spring", stiffness: 260, damping: 20 },
          className: "mx-auto w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6 border-4 border-green-200 dark:border-green-700",
          children: /* @__PURE__ */ s.jsx(gt, { className: "w-12 h-12 text-green-600 dark:text-green-400" })
        }
      ),
      /* @__PURE__ */ s.jsx("h1", { className: "text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-teal-600 to-green-800 bg-clip-text text-transparent mb-4", children: "Subscription Successful!" }),
      /* @__PURE__ */ s.jsx("p", { className: "text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8", children: "Welcome to the Zoroasterverse! You now have access to all premium content." }),
      /* @__PURE__ */ s.jsx(
        It.a,
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
) }), Ef = async () => {
  const { data: e, error: t } = await oe.from("works").select("*").order("order_in_parent", { ascending: !0 });
  if (t) throw new Error(t.message);
  return e;
}, Mf = async (e) => {
  if (!e) return [];
  const { data: t, error: r } = await oe.from("purchases").select(`
      id,
      user_id,
      product_id,
      purchased_at,
      status,
      products (
        name,
        description,
        product_type,
        work_id
      )
    `).eq("user_id", e);
  if (r) throw new Error(r.message);
  return t.map((n) => {
    var i, a, o, l;
    return {
      id: n.id,
      user_id: n.user_id,
      product_id: n.product_id,
      purchased_at: n.purchased_at,
      status: n.status,
      product_title: ((i = n.products) == null ? void 0 : i.name) || "Unknown Product",
      product_description: (a = n.products) == null ? void 0 : a.description,
      product_type: ((o = n.products) == null ? void 0 : o.product_type) || "single_issue",
      work_id: (l = n.products) == null ? void 0 : l.work_id
    };
  });
}, Df = async (e, t) => {
  if (!e || !t) return null;
  const { data: r, error: n } = await oe.from("user_ratings").select("rating").eq("user_id", e).eq("work_id", t).single();
  if (n && n.code !== "PGRST116") throw new Error(n.message);
  return r ? r.rating : null;
}, Rf = async (e, t, r) => {
  const { data: n, error: i } = await oe.from("user_ratings").upsert({ user_id: e, work_id: t, rating: r }, { onConflict: "user_id,work_id" }).select();
  if (i) throw new Error(i.message);
  return n[0];
}, Lf = ({ work: e, userLibraryItem: t, queryClient: r }) => {
  var k, C;
  const { user: n } = Cs(), [i, a] = P(null), [o, l] = P(!1), [c, u] = P(!1), { data: d } = bs({
    queryKey: ["userRating", n == null ? void 0 : n.id, e.id],
    queryFn: () => Df((n == null ? void 0 : n.id) || "", e.id),
    enabled: !!(n != null && n.id)
    // Only run if user is logged in
  });
  pe(() => {
    d !== void 0 && a(d);
  }, [d]);
  const h = Bl({
    mutationFn: ({ userId: v, workId: j, rating: _ }) => Rf(v, j, _),
    onSuccess: () => {
      r.invalidateQueries({ queryKey: ["userRating", n == null ? void 0 : n.id, e.id] }), r.invalidateQueries({ queryKey: ["allWorks"] });
    },
    onError: (v) => {
      alert(`Error submitting rating: ${v.message}`);
    }
  }), f = (v) => {
    if (!n) {
      alert("Please log in to submit a rating.");
      return;
    }
    n.id && h.mutate({ userId: n.id, workId: e.id, rating: v });
  }, p = e.word_count && e.target_word_count ? Math.min(100, Math.round(e.word_count / e.target_word_count * 100)) : e.progress_percentage || 0, y = "S. Azar";
  return /* @__PURE__ */ s.jsxs("article", { className: "book-card", "data-book-id": e.id, "aria-label": `Book card: ${e.title} by ${y}`, children: [
    /* @__PURE__ */ s.jsxs("div", { className: "book-main", children: [
      /* @__PURE__ */ s.jsx("div", { className: "cover", role: "img", "aria-label": `Book cover: ${e.title} by ${y}`, style: { background: e.cover_image_url ? `url(${e.cover_image_url}) center center / cover` : "var(--teal)" }, children: !e.cover_image_url && /* @__PURE__ */ s.jsxs("div", { className: "cover-content", children: [
        /* @__PURE__ */ s.jsx("div", { className: "cover-title", children: e.title }),
        /* @__PURE__ */ s.jsx("div", { className: "cover-author", children: y })
      ] }) }),
      /* @__PURE__ */ s.jsxs("div", { className: "details", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "book-header", children: [
          /* @__PURE__ */ s.jsx("h3", { className: "book-title", children: e.title }),
          /* @__PURE__ */ s.jsx("div", { className: "author", children: y })
        ] }),
        (e.release_date || e.estimated_release) && /* @__PURE__ */ s.jsx("div", { className: "release-info text-sm text-muted mt-1", children: e.release_date ? /* @__PURE__ */ s.jsxs("span", { children: [
          "Released: ",
          new Date(e.release_date).toLocaleDateString()
        ] }) : /* @__PURE__ */ s.jsxs("span", { children: [
          "Estimated Release: ",
          e.estimated_release
        ] }) }),
        (e.status === "planning" || e.status === "writing" || e.status === "editing") && /* @__PURE__ */ s.jsxs("div", { className: "progress", "aria-label": "Author writing progress", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "progress-head", children: [
            /* @__PURE__ */ s.jsxs("span", { children: [
              p,
              "% written"
            ] }),
            /* @__PURE__ */ s.jsxs("span", { "aria-live": "polite", children: [
              p,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "bar", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": p, "aria-label": "Author writing progress", children: /* @__PURE__ */ s.jsx("span", { style: { width: `${p}%` } }) })
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "desc", children: e.description || "No description available." }),
        /* @__PURE__ */ s.jsxs("div", { className: "rating", "aria-label": `Rating ${((k = e.rating) == null ? void 0 : k.toFixed(1)) || "0.0"} out of 5 based on ${e.reviews_count || 0} reviews`, children: [
          /* @__PURE__ */ s.jsx("span", { className: "stars", "aria-hidden": "true", children: [...Array(5)].map((v, j) => /* @__PURE__ */ s.jsx(
            Js,
            {
              className: `star ${j < (i !== null ? i : Math.floor(e.rating || 0)) ? "filled" : ""}`,
              onClick: () => f(j + 1),
              onMouseEnter: () => n && a(j + 1),
              onMouseLeave: () => n && a(d ?? null),
              style: { cursor: n ? "pointer" : "default" }
            },
            j
          )) }),
          /* @__PURE__ */ s.jsx("span", { children: ((C = e.rating) == null ? void 0 : C.toFixed(1)) || "0.0" }),
          /* @__PURE__ */ s.jsxs("small", { children: [
            "• ",
            e.reviews_count || 0,
            " reviews"
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "actions", children: t ? /* @__PURE__ */ s.jsx(s.Fragment, { children: /* @__PURE__ */ s.jsx("button", { className: "btn primary", children: "Open" }) }) : /* @__PURE__ */ s.jsx("button", { className: "btn primary", children: "Buy now" }) }),
        e.sample_content && /* @__PURE__ */ s.jsxs(
          "button",
          {
            className: "sample-toggle-btn",
            onClick: () => l(!o),
            "aria-expanded": o,
            children: [
              /* @__PURE__ */ s.jsx("span", { children: "Read Sample" }),
              /* @__PURE__ */ s.jsx(
                "svg",
                {
                  className: `toggle-arrow ${o ? "expanded" : ""}`,
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: /* @__PURE__ */ s.jsx("polyline", { points: "6,9 12,15 18,9" })
                }
              )
            ]
          }
        )
      ] })
    ] }),
    o && e.sample_content && /* @__PURE__ */ s.jsxs("div", { className: "sample-card expanded", children: [
      /* @__PURE__ */ s.jsx("div", { className: "sample-header", children: /* @__PURE__ */ s.jsxs("h4", { children: [
        'Sample from "',
        e.title,
        '"'
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "sample-excerpt", children: /* @__PURE__ */ s.jsx("p", { children: e.sample_content }) }),
      /* @__PURE__ */ s.jsx("div", { className: "sample-actions", children: t ? /* @__PURE__ */ s.jsx("button", { className: "continue-btn", children: "Continue reading" }) : /* @__PURE__ */ s.jsx("button", { className: "buy-btn", children: "Buy now" }) })
    ] })
  ] });
}, _g = () => {
  const { user: e } = Cs(), t = Yl(), { data: r, isLoading: n, isError: i, error: a } = bs({
    // Changed from any to Work[]
    queryKey: ["allWorks"],
    queryFn: Ef
  }), { data: o, isLoading: l, isError: c, error: u } = bs({
    // Changed from any to UserLibraryItem[]
    queryKey: ["userLibraryItems", e == null ? void 0 : e.id],
    queryFn: () => Mf((e == null ? void 0 : e.id) || ""),
    enabled: !!(e != null && e.id)
    // Only run query if user is logged in
  }), [d, h] = P(!0), [f, p] = P("All"), [y, k] = P("All"), C = (r == null ? void 0 : r.filter((v) => {
    const j = f === "All" || v.type === f.toLowerCase(), _ = y === "All" || v.status === y.toLowerCase();
    return j && _;
  })) || [];
  return n || l ? /* @__PURE__ */ s.jsx("div", { className: "text-center py-8 text-text-light", children: "Loading library..." }) : i ? /* @__PURE__ */ s.jsxs("div", { className: "text-center py-8 text-red-400", children: [
    "Error loading works: ",
    a == null ? void 0 : a.message
  ] }) : c ? /* @__PURE__ */ s.jsxs("div", { className: "text-center py-8 text-red-400", children: [
    "Error loading user library: ",
    u == null ? void 0 : u.message
  ] }) : /* @__PURE__ */ s.jsxs("div", { className: "container mx-auto px-4 py-8 bg-background-dark text-text-light min-h-screen", children: [
    /* @__PURE__ */ s.jsx("h1", { className: "text-4xl font-bold text-text-light mb-6", children: "Your Library" }),
    d && /* @__PURE__ */ s.jsxs("div", { className: "bg-blue-900 bg-opacity-30 border border-blue-700 text-blue-200 p-4 rounded-md mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ s.jsx(Fl, { size: 20 }),
        /* @__PURE__ */ s.jsx("p", { className: "text-sm", children: "Files may include a purchaser-specific watermark. Download limits: 5 per format." })
      ] }),
      /* @__PURE__ */ s.jsx("button", { onClick: () => h(!1), className: "text-blue-200 hover:text-white", children: /* @__PURE__ */ s.jsx(Et, { size: 20 }) })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "flex flex-wrap gap-2 mb-6", children: [
      /* @__PURE__ */ s.jsx("button", { onClick: () => p("All"), className: `px-4 py-2 rounded-full text-sm font-semibold ${f === "All" ? "bg-primary-DEFAULT text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`, children: "All" }),
      /* @__PURE__ */ s.jsx("button", { onClick: () => p("Book"), className: `px-4 py-2 rounded-full text-sm font-semibold ${f === "Book" ? "bg-primary-DEFAULT text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`, children: "Books" }),
      /* @__PURE__ */ s.jsx("button", { onClick: () => p("Volume"), className: `px-4 py-2 rounded-full text-sm font-semibold ${f === "Volume" ? "bg-primary-DEFAULT text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`, children: "Volumes" }),
      /* @__PURE__ */ s.jsx("button", { onClick: () => p("Saga"), className: `px-4 py-2 rounded-full text-sm font-semibold ${f === "Saga" ? "bg-primary-DEFAULT text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`, children: "Sagas" }),
      /* @__PURE__ */ s.jsx("button", { onClick: () => p("Arc"), className: `px-4 py-2 rounded-full text-sm font-semibold ${f === "Arc" ? "bg-primary-DEFAULT text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`, children: "Arcs" }),
      /* @__PURE__ */ s.jsx("button", { onClick: () => p("Issue"), className: `px-4 py-2 rounded-full text-sm font-semibold ${f === "Issue" ? "bg-primary-DEFAULT text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`, children: "Issues" }),
      /* @__PURE__ */ s.jsxs(
        "select",
        {
          value: y,
          onChange: (v) => k(v.target.value),
          className: "px-3 py-2 rounded-full text-sm font-semibold bg-gray-700 text-gray-300 hover:bg-gray-600",
          children: [
            /* @__PURE__ */ s.jsx("option", { value: "All", children: "All Status" }),
            /* @__PURE__ */ s.jsx("option", { value: "Published", children: "Published" }),
            /* @__PURE__ */ s.jsx("option", { value: "Planning", children: "Planning" }),
            /* @__PURE__ */ s.jsx("option", { value: "Writing", children: "Writing" }),
            /* @__PURE__ */ s.jsx("option", { value: "Editing", children: "Editing" }),
            /* @__PURE__ */ s.jsx("option", { value: "On_hold", children: "On Hold" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-8", children: /* @__PURE__ */ s.jsx("div", { className: "lg:col-span-3", children: /* @__PURE__ */ s.jsx("div", { className: "grid grid-cols-1 gap-6 mb-8", children: C.map((v) => {
      const j = o == null ? void 0 : o.find((_) => _.work_id === v.id);
      return /* @__PURE__ */ s.jsx(
        Lf,
        {
          work: v,
          userLibraryItem: j,
          queryClient: t
        },
        v.id
      );
    }) }) }) })
  ] });
}, Vf = async () => {
  const { data: e, error: t } = await oe.from("posts").select("*").eq("status", "published").order("created_at", { ascending: !1 });
  if (t)
    throw new Error(t.message);
  return e;
}, Pg = () => {
  const { data: e, isLoading: t, isError: r, error: n } = bs({
    queryKey: ["blogPosts"],
    queryFn: Vf
  });
  return t ? /* @__PURE__ */ s.jsx("div", { className: "text-center py-8", children: "Loading blog posts..." }) : r ? /* @__PURE__ */ s.jsxs("div", { className: "text-center py-8 text-red-500", children: [
    "Error loading posts: ",
    n == null ? void 0 : n.message
  ] }) : /* @__PURE__ */ s.jsxs("div", { className: "container mx-auto px-4 py-8", children: [
    /* @__PURE__ */ s.jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-8", children: "Blog & News" }),
    e && e.length > 0 ? /* @__PURE__ */ s.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: e.map((i) => /* @__PURE__ */ s.jsx("div", { className: "bg-white rounded-lg shadow-md overflow-hidden", children: /* @__PURE__ */ s.jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ s.jsx("h2", { className: "text-2xl font-semibold text-gray-800 mb-2", children: i.title }),
      /* @__PURE__ */ s.jsxs("p", { className: "text-sm text-gray-500 mb-4", children: [
        "Published on ",
        new Date(i.created_at).toLocaleDateString()
      ] }),
      /* @__PURE__ */ s.jsx(
        "div",
        {
          className: "text-gray-700 leading-relaxed line-clamp-3",
          dangerouslySetInnerHTML: { __html: i.content }
        }
      ),
      /* @__PURE__ */ s.jsx(yt, { to: `/blog/${i.slug}`, className: "mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium", children: "Read More →" })
    ] }) }, i.id)) }) : /* @__PURE__ */ s.jsxs("div", { className: "text-center py-12 text-gray-600", children: [
      /* @__PURE__ */ s.jsx("p", { className: "text-xl mb-4", children: "No blog posts published yet." }),
      /* @__PURE__ */ s.jsx("p", { children: "Check back soon for new content!" })
    ] })
  ] });
}, Ff = Zi(
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
), If = Pe.forwardRef(
  ({ className: e, variant: t, size: r, asChild: n = !1, ...i }, a) => {
    const o = n ? zl : "button";
    return /* @__PURE__ */ s.jsx(
      o,
      {
        className: xe(Ff({ variant: t, size: r, className: e })),
        ref: a,
        ...i
      }
    );
  }
);
If.displayName = "Button";
const Of = Pe.forwardRef(({ className: e, ...t }, r) => /* @__PURE__ */ s.jsx(
  "div",
  {
    ref: r,
    className: xe("rounded-lg border bg-card text-card-foreground shadow-sm", e),
    ...t
  }
));
Of.displayName = "Card";
const Yf = Pe.forwardRef(({ className: e, ...t }, r) => /* @__PURE__ */ s.jsx(
  "div",
  {
    ref: r,
    className: xe("flex flex-col space-y-1.5 p-6", e),
    ...t
  }
));
Yf.displayName = "CardHeader";
const Bf = Pe.forwardRef(({ className: e, ...t }, r) => /* @__PURE__ */ s.jsx(
  "h3",
  {
    ref: r,
    className: xe(
      "text-2xl font-semibold leading-none tracking-tight",
      e
    ),
    ...t
  }
));
Bf.displayName = "CardTitle";
const zf = Pe.forwardRef(({ className: e, ...t }, r) => /* @__PURE__ */ s.jsx(
  "p",
  {
    ref: r,
    className: xe("text-sm text-muted-foreground", e),
    ...t
  }
));
zf.displayName = "CardDescription";
const $f = Pe.forwardRef(({ className: e, ...t }, r) => /* @__PURE__ */ s.jsx("div", { ref: r, className: xe("p-6 pt-0", e), ...t }));
$f.displayName = "CardContent";
const Uf = Pe.forwardRef(({ className: e, ...t }, r) => /* @__PURE__ */ s.jsx(
  "div",
  {
    ref: r,
    className: xe("flex items-center p-6 pt-0", e),
    ...t
  }
));
Uf.displayName = "CardFooter";
const Wf = Pe.forwardRef(
  ({ className: e, type: t, ...r }, n) => /* @__PURE__ */ s.jsx(
    "input",
    {
      type: t,
      className: xe(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        e
      ),
      ref: n,
      ...r
    }
  )
);
Wf.displayName = "Input";
const Hf = Zi(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
), Kf = Pe.forwardRef(({ className: e, ...t }, r) => /* @__PURE__ */ s.jsx(
  Ji.Root,
  {
    ref: r,
    className: xe(Hf(), e),
    ...t
  }
));
Kf.displayName = Ji.Root.displayName;
const Gf = {
  default: "bg-primary text-primary-foreground hover:bg-primary/80 border-transparent",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent",
  outline: "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
  success: "bg-green-500 text-white hover:bg-green-600 border-transparent"
}, qf = Pe.forwardRef(
  ({ className: e, variant: t = "default", ...r }, n) => /* @__PURE__ */ s.jsx(
    "div",
    {
      ref: n,
      className: xe(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        Gf[t],
        e
      ),
      ...r
    }
  )
);
qf.displayName = "Badge";
export {
  cg as AdminProtectedRoute,
  lg as AdminSideNav,
  og as AdminSideNavProvider,
  ag as AdminSideNavToggle,
  qf as Badge,
  Pg as BlogPage,
  If as Button,
  Of as Card,
  $f as CardContent,
  zf as CardDescription,
  Uf as CardFooter,
  Yf as CardHeader,
  Bf as CardTitle,
  yg as CartIcon,
  gc as Footer,
  mg as GlowButton,
  hg as HomePage,
  Wf as Input,
  jg as InventoryManagementPage,
  Kf as Label,
  ug as Layout,
  _g as LibraryPage,
  pg as LoadingSkeleton,
  bg as LoginPage,
  gg as MagicalParticles,
  kg as MediaUploadPage,
  lc as Navbar,
  wg as OrderManagementPage,
  fg as OrnateDivider,
  vg as ProductManagementPage,
  dg as SimpleDashboardPage,
  xg as StarsBackground,
  Sg as SubscriptionPage,
  Cg as SubscriptionSuccessPage,
  Oc as WikiNavItem,
  Ng as WorksManagementPage,
  Ff as buttonVariants,
  Ic as cn,
  eo as useAdminSideNav
};
