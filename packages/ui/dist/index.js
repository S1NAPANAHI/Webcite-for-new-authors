import * as Me from "react";
import et, { createContext as qe, useState as C, useEffect as le, useContext as ue, useRef as ze, useLayoutEffect as fl, useId as gl, useCallback as Gi, useMemo as _s, Fragment as Ki, createElement as pl, useInsertionEffect as xl, forwardRef as yl, Component as bl } from "react";
import { useNavigate as Xi, NavLink as hs, useLocation as vl, Navigate as wl, Outlet as jl, Link as $e, useParams as Nl } from "react-router-dom";
import { clsx as Zi } from "clsx";
import { twMerge as Ji } from "tailwind-merge";
import { createClient as kl } from "@supabase/supabase-js";
import { X as Se, LayoutDashboard as Tl, Package as rt, ShoppingCart as at, Boxes as Sl, BarChart3 as ms, FileText as Ue, BookOpen as bt, Calendar as Tr, Users as vs, Webhook as _l, Upload as Ye, Settings as Sr, LogOut as Cl, Menu as Qs, AlertCircle as $t, CheckSquare as Nn, DollarSign as _r, Eye as ot, TrendingUp as ut, Search as lt, Twitter as Pl, Instagram as Al, Mail as El, ChevronRight as Qi, Minus as Ml, Plus as vt, Trash2 as Cs, RefreshCw as Pe, Filter as Zt, EyeOff as ea, Edit as fs, Save as ta, Crown as Ut, Book as Be, AlertTriangle as gs, User as kn, CreditCard as Tn, ExternalLink as Sn, XCircle as Rt, Clock as Lt, CheckCircle as wt, Package2 as ns, TrendingDown as is, Star as er, PauseCircle as Dl, Target as Rl, Archive as Ll, Image as _n, File as Fl, FolderOpen as Vl, Download as Il, Video as Ol, Music as Yl, ArrowRight as Bl, Info as zl, FileIcon as Cn, Folder as Pn } from "lucide-react";
import { useCart as $l, supabase as Ul } from "@zoroaster/shared";
import { useQueryClient as Wl, useQuery as ws, useMutation as Hl } from "@tanstack/react-query";
import { Slot as ql } from "@radix-ui/react-slot";
import { cva as sa } from "class-variance-authority";
import "react-dom";
import * as ra from "@radix-ui/react-label";
var tr = { exports: {} }, Pt = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var An;
function Gl() {
  if (An) return Pt;
  An = 1;
  var e = et, t = Symbol.for("react.element"), r = Symbol.for("react.fragment"), n = Object.prototype.hasOwnProperty, i = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, o = { key: !0, ref: !0, __self: !0, __source: !0 };
  function a(l, c, u) {
    var d, h = {}, m = null, g = null;
    u !== void 0 && (m = "" + u), c.key !== void 0 && (m = "" + c.key), c.ref !== void 0 && (g = c.ref);
    for (d in c) n.call(c, d) && !o.hasOwnProperty(d) && (h[d] = c[d]);
    if (l && l.defaultProps) for (d in c = l.defaultProps, c) h[d] === void 0 && (h[d] = c[d]);
    return { $$typeof: t, type: l, key: m, ref: g, props: h, _owner: i.current };
  }
  return Pt.Fragment = r, Pt.jsx = a, Pt.jsxs = a, Pt;
}
var At = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var En;
function Kl() {
  return En || (En = 1, process.env.NODE_ENV !== "production" && function() {
    var e = et, t = Symbol.for("react.element"), r = Symbol.for("react.portal"), n = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), o = Symbol.for("react.profiler"), a = Symbol.for("react.provider"), l = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), u = Symbol.for("react.suspense"), d = Symbol.for("react.suspense_list"), h = Symbol.for("react.memo"), m = Symbol.for("react.lazy"), g = Symbol.for("react.offscreen"), x = Symbol.iterator, k = "@@iterator";
    function S(f) {
      if (f === null || typeof f != "object")
        return null;
      var _ = x && f[x] || f[k];
      return typeof _ == "function" ? _ : null;
    }
    var v = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function j(f) {
      {
        for (var _ = arguments.length, M = new Array(_ > 1 ? _ - 1 : 0), B = 1; B < _; B++)
          M[B - 1] = arguments[B];
        P("error", f, M);
      }
    }
    function P(f, _, M) {
      {
        var B = v.ReactDebugCurrentFrame, q = B.getStackAddendum();
        q !== "" && (_ += "%s", M = M.concat([q]));
        var X = M.map(function(W) {
          return String(W);
        });
        X.unshift("Warning: " + _), Function.prototype.apply.call(console[f], console, X);
      }
    }
    var D = !1, E = !1, z = !1, $ = !1, T = !1, N;
    N = Symbol.for("react.module.reference");
    function A(f) {
      return !!(typeof f == "string" || typeof f == "function" || f === n || f === o || T || f === i || f === u || f === d || $ || f === g || D || E || z || typeof f == "object" && f !== null && (f.$$typeof === m || f.$$typeof === h || f.$$typeof === a || f.$$typeof === l || f.$$typeof === c || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      f.$$typeof === N || f.getModuleId !== void 0));
    }
    function b(f, _, M) {
      var B = f.displayName;
      if (B)
        return B;
      var q = _.displayName || _.name || "";
      return q !== "" ? M + "(" + q + ")" : M;
    }
    function V(f) {
      return f.displayName || "Context";
    }
    function H(f) {
      if (f == null)
        return null;
      if (typeof f.tag == "number" && j("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof f == "function")
        return f.displayName || f.name || null;
      if (typeof f == "string")
        return f;
      switch (f) {
        case n:
          return "Fragment";
        case r:
          return "Portal";
        case o:
          return "Profiler";
        case i:
          return "StrictMode";
        case u:
          return "Suspense";
        case d:
          return "SuspenseList";
      }
      if (typeof f == "object")
        switch (f.$$typeof) {
          case l:
            var _ = f;
            return V(_) + ".Consumer";
          case a:
            var M = f;
            return V(M._context) + ".Provider";
          case c:
            return b(f, f.render, "ForwardRef");
          case h:
            var B = f.displayName || null;
            return B !== null ? B : H(f.type) || "Memo";
          case m: {
            var q = f, X = q._payload, W = q._init;
            try {
              return H(W(X));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var Q = Object.assign, y = 0, I, O, F, L, se, ge, w;
    function p() {
    }
    p.__reactDisabledLog = !0;
    function R() {
      {
        if (y === 0) {
          I = console.log, O = console.info, F = console.warn, L = console.error, se = console.group, ge = console.groupCollapsed, w = console.groupEnd;
          var f = {
            configurable: !0,
            enumerable: !0,
            value: p,
            writable: !0
          };
          Object.defineProperties(console, {
            info: f,
            log: f,
            warn: f,
            error: f,
            group: f,
            groupCollapsed: f,
            groupEnd: f
          });
        }
        y++;
      }
    }
    function G() {
      {
        if (y--, y === 0) {
          var f = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: Q({}, f, {
              value: I
            }),
            info: Q({}, f, {
              value: O
            }),
            warn: Q({}, f, {
              value: F
            }),
            error: Q({}, f, {
              value: L
            }),
            group: Q({}, f, {
              value: se
            }),
            groupCollapsed: Q({}, f, {
              value: ge
            }),
            groupEnd: Q({}, f, {
              value: w
            })
          });
        }
        y < 0 && j("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var oe = v.ReactCurrentDispatcher, ye;
    function Ke(f, _, M) {
      {
        if (ye === void 0)
          try {
            throw Error();
          } catch (q) {
            var B = q.stack.trim().match(/\n( *(at )?)/);
            ye = B && B[1] || "";
          }
        return `
` + ye + f;
      }
    }
    var Ce = !1, Ve;
    {
      var $o = typeof WeakMap == "function" ? WeakMap : Map;
      Ve = new $o();
    }
    function ln(f, _) {
      if (!f || Ce)
        return "";
      {
        var M = Ve.get(f);
        if (M !== void 0)
          return M;
      }
      var B;
      Ce = !0;
      var q = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var X;
      X = oe.current, oe.current = null, R();
      try {
        if (_) {
          var W = function() {
            throw Error();
          };
          if (Object.defineProperty(W.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(W, []);
            } catch (pe) {
              B = pe;
            }
            Reflect.construct(f, [], W);
          } else {
            try {
              W.call();
            } catch (pe) {
              B = pe;
            }
            f.call(W.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (pe) {
            B = pe;
          }
          f();
        }
      } catch (pe) {
        if (pe && B && typeof pe.stack == "string") {
          for (var U = pe.stack.split(`
`), me = B.stack.split(`
`), re = U.length - 1, ie = me.length - 1; re >= 1 && ie >= 0 && U[re] !== me[ie]; )
            ie--;
          for (; re >= 1 && ie >= 0; re--, ie--)
            if (U[re] !== me[ie]) {
              if (re !== 1 || ie !== 1)
                do
                  if (re--, ie--, ie < 0 || U[re] !== me[ie]) {
                    var ve = `
` + U[re].replace(" at new ", " at ");
                    return f.displayName && ve.includes("<anonymous>") && (ve = ve.replace("<anonymous>", f.displayName)), typeof f == "function" && Ve.set(f, ve), ve;
                  }
                while (re >= 1 && ie >= 0);
              break;
            }
        }
      } finally {
        Ce = !1, oe.current = X, G(), Error.prepareStackTrace = q;
      }
      var dt = f ? f.displayName || f.name : "", Xe = dt ? Ke(dt) : "";
      return typeof f == "function" && Ve.set(f, Xe), Xe;
    }
    function Uo(f, _, M) {
      return ln(f, !1);
    }
    function Wo(f) {
      var _ = f.prototype;
      return !!(_ && _.isReactComponent);
    }
    function ss(f, _, M) {
      if (f == null)
        return "";
      if (typeof f == "function")
        return ln(f, Wo(f));
      if (typeof f == "string")
        return Ke(f);
      switch (f) {
        case u:
          return Ke("Suspense");
        case d:
          return Ke("SuspenseList");
      }
      if (typeof f == "object")
        switch (f.$$typeof) {
          case c:
            return Uo(f.render);
          case h:
            return ss(f.type, _, M);
          case m: {
            var B = f, q = B._payload, X = B._init;
            try {
              return ss(X(q), _, M);
            } catch {
            }
          }
        }
      return "";
    }
    var Ct = Object.prototype.hasOwnProperty, cn = {}, dn = v.ReactDebugCurrentFrame;
    function rs(f) {
      if (f) {
        var _ = f._owner, M = ss(f.type, f._source, _ ? _.type : null);
        dn.setExtraStackFrame(M);
      } else
        dn.setExtraStackFrame(null);
    }
    function Ho(f, _, M, B, q) {
      {
        var X = Function.call.bind(Ct);
        for (var W in f)
          if (X(f, W)) {
            var U = void 0;
            try {
              if (typeof f[W] != "function") {
                var me = Error((B || "React class") + ": " + M + " type `" + W + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof f[W] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw me.name = "Invariant Violation", me;
              }
              U = f[W](_, W, B, M, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (re) {
              U = re;
            }
            U && !(U instanceof Error) && (rs(q), j("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", B || "React class", M, W, typeof U), rs(null)), U instanceof Error && !(U.message in cn) && (cn[U.message] = !0, rs(q), j("Failed %s type: %s", M, U.message), rs(null));
          }
      }
    }
    var qo = Array.isArray;
    function Ms(f) {
      return qo(f);
    }
    function Go(f) {
      {
        var _ = typeof Symbol == "function" && Symbol.toStringTag, M = _ && f[Symbol.toStringTag] || f.constructor.name || "Object";
        return M;
      }
    }
    function Ko(f) {
      try {
        return un(f), !1;
      } catch {
        return !0;
      }
    }
    function un(f) {
      return "" + f;
    }
    function hn(f) {
      if (Ko(f))
        return j("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Go(f)), un(f);
    }
    var mn = v.ReactCurrentOwner, Xo = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, fn, gn;
    function Zo(f) {
      if (Ct.call(f, "ref")) {
        var _ = Object.getOwnPropertyDescriptor(f, "ref").get;
        if (_ && _.isReactWarning)
          return !1;
      }
      return f.ref !== void 0;
    }
    function Jo(f) {
      if (Ct.call(f, "key")) {
        var _ = Object.getOwnPropertyDescriptor(f, "key").get;
        if (_ && _.isReactWarning)
          return !1;
      }
      return f.key !== void 0;
    }
    function Qo(f, _) {
      typeof f.ref == "string" && mn.current;
    }
    function el(f, _) {
      {
        var M = function() {
          fn || (fn = !0, j("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", _));
        };
        M.isReactWarning = !0, Object.defineProperty(f, "key", {
          get: M,
          configurable: !0
        });
      }
    }
    function tl(f, _) {
      {
        var M = function() {
          gn || (gn = !0, j("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", _));
        };
        M.isReactWarning = !0, Object.defineProperty(f, "ref", {
          get: M,
          configurable: !0
        });
      }
    }
    var sl = function(f, _, M, B, q, X, W) {
      var U = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: t,
        // Built-in properties that belong on the element
        type: f,
        key: _,
        ref: M,
        props: W,
        // Record the component responsible for creating this element.
        _owner: X
      };
      return U._store = {}, Object.defineProperty(U._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(U, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: B
      }), Object.defineProperty(U, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: q
      }), Object.freeze && (Object.freeze(U.props), Object.freeze(U)), U;
    };
    function rl(f, _, M, B, q) {
      {
        var X, W = {}, U = null, me = null;
        M !== void 0 && (hn(M), U = "" + M), Jo(_) && (hn(_.key), U = "" + _.key), Zo(_) && (me = _.ref, Qo(_, q));
        for (X in _)
          Ct.call(_, X) && !Xo.hasOwnProperty(X) && (W[X] = _[X]);
        if (f && f.defaultProps) {
          var re = f.defaultProps;
          for (X in re)
            W[X] === void 0 && (W[X] = re[X]);
        }
        if (U || me) {
          var ie = typeof f == "function" ? f.displayName || f.name || "Unknown" : f;
          U && el(W, ie), me && tl(W, ie);
        }
        return sl(f, U, me, q, B, mn.current, W);
      }
    }
    var Ds = v.ReactCurrentOwner, pn = v.ReactDebugCurrentFrame;
    function ct(f) {
      if (f) {
        var _ = f._owner, M = ss(f.type, f._source, _ ? _.type : null);
        pn.setExtraStackFrame(M);
      } else
        pn.setExtraStackFrame(null);
    }
    var Rs;
    Rs = !1;
    function Ls(f) {
      return typeof f == "object" && f !== null && f.$$typeof === t;
    }
    function xn() {
      {
        if (Ds.current) {
          var f = H(Ds.current.type);
          if (f)
            return `

Check the render method of \`` + f + "`.";
        }
        return "";
      }
    }
    function nl(f) {
      return "";
    }
    var yn = {};
    function il(f) {
      {
        var _ = xn();
        if (!_) {
          var M = typeof f == "string" ? f : f.displayName || f.name;
          M && (_ = `

Check the top-level render call using <` + M + ">.");
        }
        return _;
      }
    }
    function bn(f, _) {
      {
        if (!f._store || f._store.validated || f.key != null)
          return;
        f._store.validated = !0;
        var M = il(_);
        if (yn[M])
          return;
        yn[M] = !0;
        var B = "";
        f && f._owner && f._owner !== Ds.current && (B = " It was passed a child from " + H(f._owner.type) + "."), ct(f), j('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', M, B), ct(null);
      }
    }
    function vn(f, _) {
      {
        if (typeof f != "object")
          return;
        if (Ms(f))
          for (var M = 0; M < f.length; M++) {
            var B = f[M];
            Ls(B) && bn(B, _);
          }
        else if (Ls(f))
          f._store && (f._store.validated = !0);
        else if (f) {
          var q = S(f);
          if (typeof q == "function" && q !== f.entries)
            for (var X = q.call(f), W; !(W = X.next()).done; )
              Ls(W.value) && bn(W.value, _);
        }
      }
    }
    function al(f) {
      {
        var _ = f.type;
        if (_ == null || typeof _ == "string")
          return;
        var M;
        if (typeof _ == "function")
          M = _.propTypes;
        else if (typeof _ == "object" && (_.$$typeof === c || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        _.$$typeof === h))
          M = _.propTypes;
        else
          return;
        if (M) {
          var B = H(_);
          Ho(M, f.props, "prop", B, f);
        } else if (_.PropTypes !== void 0 && !Rs) {
          Rs = !0;
          var q = H(_);
          j("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", q || "Unknown");
        }
        typeof _.getDefaultProps == "function" && !_.getDefaultProps.isReactClassApproved && j("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function ol(f) {
      {
        for (var _ = Object.keys(f.props), M = 0; M < _.length; M++) {
          var B = _[M];
          if (B !== "children" && B !== "key") {
            ct(f), j("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", B), ct(null);
            break;
          }
        }
        f.ref !== null && (ct(f), j("Invalid attribute `ref` supplied to `React.Fragment`."), ct(null));
      }
    }
    var wn = {};
    function jn(f, _, M, B, q, X) {
      {
        var W = A(f);
        if (!W) {
          var U = "";
          (f === void 0 || typeof f == "object" && f !== null && Object.keys(f).length === 0) && (U += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var me = nl();
          me ? U += me : U += xn();
          var re;
          f === null ? re = "null" : Ms(f) ? re = "array" : f !== void 0 && f.$$typeof === t ? (re = "<" + (H(f.type) || "Unknown") + " />", U = " Did you accidentally export a JSX literal instead of a component?") : re = typeof f, j("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", re, U);
        }
        var ie = rl(f, _, M, q, X);
        if (ie == null)
          return ie;
        if (W) {
          var ve = _.children;
          if (ve !== void 0)
            if (B)
              if (Ms(ve)) {
                for (var dt = 0; dt < ve.length; dt++)
                  vn(ve[dt], f);
                Object.freeze && Object.freeze(ve);
              } else
                j("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              vn(ve, f);
        }
        if (Ct.call(_, "key")) {
          var Xe = H(f), pe = Object.keys(_).filter(function(ml) {
            return ml !== "key";
          }), Fs = pe.length > 0 ? "{key: someKey, " + pe.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!wn[Xe + Fs]) {
            var hl = pe.length > 0 ? "{" + pe.join(": ..., ") + ": ...}" : "{}";
            j(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, Fs, Xe, hl, Xe), wn[Xe + Fs] = !0;
          }
        }
        return f === n ? ol(ie) : al(ie), ie;
      }
    }
    function ll(f, _, M) {
      return jn(f, _, M, !0);
    }
    function cl(f, _, M) {
      return jn(f, _, M, !1);
    }
    var dl = cl, ul = ll;
    At.Fragment = n, At.jsx = dl, At.jsxs = ul;
  }()), At;
}
process.env.NODE_ENV === "production" ? tr.exports = Gl() : tr.exports = Kl();
var s = tr.exports;
function be(...e) {
  return Ji(Zi(e));
}
const Mn = typeof window < "u", Xl = "http://127.0.0.1:54321", Zl = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
let as = null;
const Jl = () => {
  if (typeof window < "u" && window.__SUPABASE_CLIENT_INSTANCE__)
    return window.__SUPABASE_CLIENT_INSTANCE__;
  if (as)
    return as;
  const e = kl(Xl, Zl, {
    auth: {
      autoRefreshToken: !0,
      persistSession: !0,
      detectSessionInUrl: Mn,
      storage: Mn ? window.localStorage : void 0
    },
    global: {
      // Get the latest record instead of from local cache
      fetch: (t, r) => {
        const n = r || {}, { headers: i = {}, ...o } = n;
        return fetch(t, {
          ...o,
          headers: {
            ...i,
            "Cache-Control": "no-cache"
          }
        });
      }
    }
  });
  return as = e, typeof window < "u" && (window.__SUPABASE_CLIENT_INSTANCE__ = e), as;
}, Z = Jl(), na = qe(void 0), ia = () => {
  const e = ue(na);
  if (!e)
    throw new Error("useAdminSideNav must be used within AdminSideNavProvider");
  return e;
}, jg = ({ children: e }) => {
  const [t, r] = C(!1), n = () => {
    console.log("AdminSideNav: toggle called, current state:", t), r(!t);
  }, i = () => {
    console.log("AdminSideNav: close called, current state:", t), r(!1);
  };
  return /* @__PURE__ */ s.jsx(na.Provider, { value: { isOpen: t, toggle: n, close: i }, children: e });
}, Ql = [
  { name: "Dashboard", href: "/account/admin", icon: Tl },
  { name: "Products", href: "/account/admin/products", icon: rt },
  { name: "Orders", href: "/account/admin/orders", icon: at },
  { name: "Inventory", href: "/account/admin/inventory", icon: Sl },
  { name: "Analytics", href: "/account/admin/analytics", icon: ms },
  { name: "Posts", href: "/account/admin/posts", icon: Ue },
  { name: "Works", href: "/account/admin/works", icon: bt },
  { name: "Timeline", href: "/account/admin/timeline/events", icon: Tr },
  { name: "Users", href: "/account/admin/users", icon: vs },
  { name: "Beta Applications", href: "/account/admin/beta-applications", icon: vs },
  { name: "Webhooks", href: "/account/admin/webhooks", icon: _l },
  { name: "Media", href: "/account/admin/media", icon: Ye },
  { name: "Settings", href: "/account/admin/settings", icon: Sr }
], Ng = () => {
  const { isOpen: e, toggle: t } = ia();
  return e ? null : /* @__PURE__ */ s.jsx(
    "button",
    {
      onClick: t,
      className: "fixed top-4 left-4 z-[10000] p-3 rounded-lg bg-slate-800 border border-amber-500/50 shadow-xl hover:bg-slate-700 hover:border-amber-400 text-amber-300 hover:text-amber-200 transition-all duration-300 group",
      "aria-label": "Toggle navigation menu",
      children: /* @__PURE__ */ s.jsx(Qs, { size: 20, className: "transition-transform duration-200 group-hover:scale-110" })
    }
  );
}, kg = () => {
  var u, d;
  const { isOpen: e, close: t } = ia(), r = Xi(), [n, i] = C(null), [o, a] = C(null);
  le(() => {
    (async () => {
      const { data: { session: g } } = await Z.auth.getSession();
      if (g != null && g.user) {
        i(g.user);
        const { data: x } = await Z.from("profiles").select("*").eq("id", g.user.id).single();
        x && a(x);
      }
    })();
    const { data: { subscription: m } } = Z.auth.onAuthStateChange((g, x) => {
      i((x == null ? void 0 : x.user) || null), x != null && x.user ? Z.from("profiles").select("*").eq("id", x.user.id).single().then(({ data: k }) => {
        k && a(k);
      }) : a(null);
    });
    return () => {
      m && m.unsubscribe();
    };
  }, []);
  const l = async () => {
    await Z.auth.signOut(), r("/");
  }, c = () => {
    console.log("AdminSideNav: handleLinkClick called"), t();
  };
  return le(() => {
    const h = (m) => {
      m.key === "Escape" && e && (console.log("AdminSideNav: Escape key pressed"), t());
    };
    return document.addEventListener("keydown", h), () => document.removeEventListener("keydown", h);
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
                children: /* @__PURE__ */ s.jsx(Se, { size: 20, className: "transition-transform duration-200 hover:rotate-90" })
              }
            )
          ] }) }),
          /* @__PURE__ */ s.jsx("nav", { className: "flex-1 overflow-y-auto py-4 px-3", style: { backgroundColor: "#0f172a", backdropFilter: "none" }, children: /* @__PURE__ */ s.jsx("ul", { className: "space-y-2", children: Ql.map((h) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx(
            hs,
            {
              to: h.href,
              end: h.href === "/account/admin",
              onClick: c,
              className: ({ isActive: m }) => be(
                "group flex items-center p-3 rounded-xl transition-all duration-200 relative overflow-hidden space-x-3",
                m ? "bg-amber-600 text-amber-100 border border-amber-500 shadow-md" : "text-slate-300 hover:bg-slate-700 hover:text-amber-200 border border-transparent hover:border-amber-500"
              ),
              children: ({ isActive: m }) => /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
                m && /* @__PURE__ */ s.jsx("div", { className: "absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-r" }),
                /* @__PURE__ */ s.jsx(
                  h.icon,
                  {
                    size: 20,
                    className: be(
                      "flex-shrink-0 transition-all duration-200",
                      m ? "text-amber-400 drop-shadow-sm" : "group-hover:text-amber-300"
                    )
                  }
                ),
                /* @__PURE__ */ s.jsx("span", { className: be(
                  "font-medium transition-all duration-200",
                  m ? "text-amber-200" : "group-hover:text-amber-200"
                ), children: h.name })
              ] })
            }
          ) }, h.name)) }) }),
          /* @__PURE__ */ s.jsx("div", { className: "p-4 border-t border-amber-500", style: { backgroundColor: "#1e293b", backdropFilter: "none" }, children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "flex items-center space-x-3", children: [
              /* @__PURE__ */ s.jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-slate-900 font-bold shadow-lg ring-2 ring-amber-400/30", children: ((u = o == null ? void 0 : o.display_name) == null ? void 0 : u.charAt(0)) || ((d = n == null ? void 0 : n.email) == null ? void 0 : d.charAt(0).toUpperCase()) }),
              /* @__PURE__ */ s.jsxs("div", { children: [
                /* @__PURE__ */ s.jsx("p", { className: "text-sm font-semibold text-amber-200 truncate max-w-[160px]", children: (o == null ? void 0 : o.display_name) || "Admin User" }),
                /* @__PURE__ */ s.jsx("p", { className: "text-xs text-slate-400 truncate max-w-[160px]", children: n == null ? void 0 : n.email })
              ] })
            ] }),
            /* @__PURE__ */ s.jsx(
              "button",
              {
                onClick: l,
                className: "p-2 rounded-lg hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/10 text-slate-400 hover:text-red-300 transition-all duration-200 border border-transparent hover:border-red-500/30",
                title: "Sign out",
                children: /* @__PURE__ */ s.jsx(Cl, { size: 18 })
              }
            )
          ] }) })
        ] })
      }
    )
  ] }) : null;
}, Tg = ({ children: e }) => {
  var a, l;
  const [t, r] = C(!0), [n, i] = C({ isAuthenticated: !1, isAdmin: !1 }), o = vl();
  return le(() => {
    (async () => {
      console.log("⏳ [AdminProtectedRoute] Checking session and admin status...");
      const { data: { session: u }, error: d } = await Z.auth.getSession();
      if (d || !u) {
        console.log("🔒 [AdminProtectedRoute] No authenticated session found."), i({ isAuthenticated: !1, isAdmin: !1 }), r(!1);
        return;
      }
      console.log("✅ [AdminProtectedRoute] Session found. User:", u.user.email);
      const { data: h, error: m } = await Z.rpc("is_admin");
      m && console.error("❌ [AdminProtectedRoute] Error calling is_admin RPC:", m);
      const x = {
        isAuthenticated: !0,
        isAdmin: h === !0,
        user: u.user
      };
      console.log("✅ [AdminProtectedRoute] Final auth state:", x), i(x), r(!1);
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
            /* @__PURE__ */ s.jsx("dd", { className: "font-mono", children: ((a = n.user) == null ? void 0 : a.id) || "N/A" })
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
  ] }) }) })) : (console.log("🛑 [AdminProtectedRoute] Not authenticated, redirecting to login."), /* @__PURE__ */ s.jsx(wl, { to: "/login", state: { from: o }, replace: !0 }));
}, Ze = ({ title: e, value: t, icon: r, color: n, trend: i }) => /* @__PURE__ */ s.jsx("div", { className: "bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow", children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between", children: [
  /* @__PURE__ */ s.jsxs("div", { children: [
    /* @__PURE__ */ s.jsx("p", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: e }),
    /* @__PURE__ */ s.jsx("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: t }),
    i && /* @__PURE__ */ s.jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: i })
  ] }),
  /* @__PURE__ */ s.jsx("div", { className: `p-3 rounded-lg bg-${n}-100 dark:bg-${n}-900/20`, children: /* @__PURE__ */ s.jsx(r, { className: `w-6 h-6 text-${n}-600 dark:text-${n}-400` }) })
] }) }), De = ({ title: e, description: t, icon: r, href: n, color: i }) => /* @__PURE__ */ s.jsx(
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
), Sg = () => {
  const [e, t] = C(null), [r, n] = C(!0), [i, o] = C(null);
  return le(() => {
    (async () => {
      try {
        const [
          { count: l },
          { count: c },
          { data: u },
          { data: d },
          { count: h },
          { count: m },
          { count: g }
        ] = await Promise.all([
          Z.from("profiles").select("id", { count: "exact", head: !0 }),
          Z.from("subscriptions").select("id", { count: "exact", head: !0 }).eq("status", "active"),
          Z.from("pages").select("view_count"),
          Z.from("orders").select("total_amount, status").eq("status", "completed"),
          Z.from("products").select("id", { count: "exact", head: !0 }).eq("active", !0),
          Z.from("orders").select("id", { count: "exact", head: !0 }),
          Z.from("orders").select("id", { count: "exact", head: !0 }).eq("status", "pending")
        ]), x = (u == null ? void 0 : u.reduce((S, v) => S + (v.view_count || 0), 0)) || 0, k = (d == null ? void 0 : d.reduce((S, v) => S + v.total_amount, 0)) || 0;
        t({
          totalUsers: l || 0,
          activeSubscribers: c || 0,
          totalRevenue: k,
          totalViews: x,
          totalProducts: h || 0,
          totalOrders: m || 0,
          pendingOrders: g || 0
        });
      } catch (l) {
        o(l instanceof Error ? l.message : "Failed to fetch dashboard metrics");
      } finally {
        n(!1);
      }
    })();
  }, []), r ? /* @__PURE__ */ s.jsx("div", { className: "p-6 space-y-6", children: /* @__PURE__ */ s.jsxs("div", { className: "animate-pulse space-y-6", children: [
    /* @__PURE__ */ s.jsx("div", { className: "h-8 bg-gray-200 dark:bg-gray-700 rounded w-64" }),
    /* @__PURE__ */ s.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: [...Array(4)].map((a, l) => /* @__PURE__ */ s.jsx("div", { className: "h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" }, l)) })
  ] }) }) : i ? /* @__PURE__ */ s.jsx("div", { className: "p-6", children: /* @__PURE__ */ s.jsx("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4", children: /* @__PURE__ */ s.jsxs("div", { className: "flex", children: [
    /* @__PURE__ */ s.jsx($t, { className: "w-5 h-5 text-red-600 dark:text-red-400" }),
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
        Ze,
        {
          title: "Total Users",
          value: (e == null ? void 0 : e.totalUsers.toLocaleString()) ?? "0",
          icon: vs,
          color: "blue",
          trend: "↑ Growing community"
        }
      ),
      /* @__PURE__ */ s.jsx(
        Ze,
        {
          title: "Active Subscribers",
          value: (e == null ? void 0 : e.activeSubscribers.toLocaleString()) ?? "0",
          icon: Nn,
          color: "green",
          trend: "Premium members"
        }
      ),
      /* @__PURE__ */ s.jsx(
        Ze,
        {
          title: "Total Revenue",
          value: `$${(e == null ? void 0 : e.totalRevenue.toFixed(2)) ?? "0.00"}`,
          icon: _r,
          color: "yellow",
          trend: "All-time earnings"
        }
      ),
      /* @__PURE__ */ s.jsx(
        Ze,
        {
          title: "Page Views",
          value: (e == null ? void 0 : e.totalViews.toLocaleString()) ?? "0",
          icon: ot,
          color: "purple",
          trend: "Content engagement"
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ s.jsx(
        Ze,
        {
          title: "Active Products",
          value: (e == null ? void 0 : e.totalProducts.toLocaleString()) ?? "0",
          icon: rt,
          color: "indigo",
          trend: "Available for sale"
        }
      ),
      /* @__PURE__ */ s.jsx(
        Ze,
        {
          title: "Total Orders",
          value: (e == null ? void 0 : e.totalOrders.toLocaleString()) ?? "0",
          icon: at,
          color: "green",
          trend: "All-time orders"
        }
      ),
      /* @__PURE__ */ s.jsx(
        Ze,
        {
          title: "Pending Orders",
          value: (e == null ? void 0 : e.pendingOrders.toLocaleString()) ?? "0",
          icon: $t,
          color: "orange",
          trend: "Requires attention"
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ s.jsx("h2", { className: "text-xl font-bold text-gray-900 dark:text-white", children: "Quick Actions" }),
      /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ s.jsx(
          De,
          {
            title: "Manage Users",
            description: "View, edit, and manage user accounts",
            icon: vs,
            href: "/account/admin/users",
            color: "blue"
          }
        ),
        /* @__PURE__ */ s.jsx(
          De,
          {
            title: "Content Management",
            description: "Create and manage posts and pages",
            icon: Ue,
            href: "/account/admin/posts",
            color: "green"
          }
        ),
        /* @__PURE__ */ s.jsx(
          De,
          {
            title: "Product Catalog",
            description: "Manage your store products",
            icon: rt,
            href: "/account/admin/products",
            color: "purple"
          }
        ),
        /* @__PURE__ */ s.jsx(
          De,
          {
            title: "Order Processing",
            description: "View and process customer orders",
            icon: at,
            href: "/account/admin/orders",
            color: "orange"
          }
        ),
        /* @__PURE__ */ s.jsx(
          De,
          {
            title: "Beta Applications",
            description: "Review beta reader applications",
            icon: Nn,
            href: "/account/admin/beta-applications",
            color: "indigo"
          }
        ),
        /* @__PURE__ */ s.jsx(
          De,
          {
            title: "Timeline Events",
            description: "Manage worldbuilding timeline",
            icon: Tr,
            href: "/account/admin/timeline/events",
            color: "red"
          }
        ),
        /* @__PURE__ */ s.jsx(
          De,
          {
            title: "Works & Chapters",
            description: "Manage your literary works",
            icon: bt,
            href: "/account/admin/works",
            color: "teal"
          }
        ),
        /* @__PURE__ */ s.jsx(
          De,
          {
            title: "Analytics",
            description: "View detailed performance metrics",
            icon: ut,
            href: "/account/admin/analytics",
            color: "pink"
          }
        ),
        /* @__PURE__ */ s.jsx(
          De,
          {
            title: "Settings",
            description: "Configure admin preferences",
            icon: Sr,
            href: "/account/admin/settings",
            color: "gray"
          }
        )
      ] })
    ] })
  ] });
}, ec = "_zoroHeader_6lzsp_2", tc = "_logo_6lzsp_16", sc = "_navbar_6lzsp_23", rc = "_navMenu_6lzsp_27", nc = "_navLink_6lzsp_39", ic = "_dropdownMenu_6lzsp_53", ac = "_dropdownMenuItem_6lzsp_73", oc = "_dropdown_6lzsp_53", lc = "_headerControls_6lzsp_96", cc = "_searchForm_6lzsp_121", dc = "_themeToggle_6lzsp_165", uc = "_icon_6lzsp_186", hc = "_iconSun_6lzsp_197", mc = "_iconMoon_6lzsp_203", de = {
  zoroHeader: ec,
  logo: tc,
  navbar: sc,
  navMenu: rc,
  navLink: nc,
  dropdownMenu: ic,
  dropdownMenuItem: ac,
  dropdown: oc,
  headerControls: lc,
  searchForm: cc,
  themeToggle: dc,
  icon: uc,
  iconSun: hc,
  iconMoon: mc
}, Dn = "zoro-theme", fc = () => {
  const [e, t] = C(() => {
    if (typeof window < "u") {
      const n = localStorage.getItem(Dn), i = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return n ?? (i ? "dark" : "light");
    }
    return "dark";
  });
  le(() => {
    const n = window.document.documentElement;
    n.setAttribute("data-theme", e), localStorage.setItem(Dn, e), e === "dark" ? (n.classList.add("dark"), n.classList.remove("light")) : (n.classList.add("light"), n.classList.remove("dark"));
  }, [e]);
  const r = () => {
    t((n) => n === "dark" ? "light" : "dark");
  };
  return s.jsxs("button", { id: "theme-toggle", className: de.themeToggle, "aria-label": "Toggle dark mode", "aria-pressed": e === "dark" ? "true" : "false", title: e === "dark" ? "Switch to light mode" : "Switch to dark mode", onClick: r, children: [s.jsxs("svg", { className: `${de.icon} ${de.iconSun}`, viewBox: "0 0 24 24", width: "22", height: "22", "aria-hidden": "true", children: [s.jsx("circle", { cx: "12", cy: "12", r: "4", fill: "currentColor" }), s.jsxs("g", { stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: [s.jsx("line", { x1: "12", y1: "2", x2: "12", y2: "5" }), s.jsx("line", { x1: "12", y1: "19", x2: "12", y2: "22" }), s.jsx("line", { x1: "2", y1: "12", x2: "5", y2: "12" }), s.jsx("line", { x1: "19", y1: "12", x2: "22", y2: "12" }), s.jsx("line", { x1: "4.2", y1: "4.2", x2: "6.3", y2: "6.3" }), s.jsx("line", { x1: "17.7", y1: "17.7", x2: "19.8", y2: "19.8" }), s.jsx("line", { x1: "4.2", y1: "19.8", x2: "6.3", y2: "17.7" }), s.jsx("line", { x1: "17.7", y1: "6.3", x2: "19.8", y2: "4.2" })] })] }), s.jsx("svg", { className: `${de.icon} ${de.iconMoon}`, viewBox: "0 0 24 24", width: "22", height: "22", "aria-hidden": "true", children: s.jsx("path", { d: `M21 14.5a9 9 0 1 1-8.5-12
                 a8 8 0 0 0 8.5 12z`, fill: "currentColor" }) })] });
}, gc = ({
  isAuthenticated: e = !1,
  betaApplicationStatus: t = "none",
  onLogout: r
}) => {
  const [n, i] = C(!1), o = () => {
    r && r();
  }, a = [
    { name: "Home", path: "/" },
    {
      name: "Explore",
      // New parent link
      path: "#",
      // Placeholder path for parent dropdown
      children: [
        // Removed Store and Subscriptions
        { name: "Library", path: "/library" },
        { name: "Learn", path: "/learn" },
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
    l.push({ name: "Store", path: "/store" }), l.push({ name: "Subscriptions", path: "/subscriptions" }), t === "accepted" && l.push({ name: "Beta Portal", path: "/beta/portal" }), l.push({ name: "My Account", path: "/account" }), a.push({ name: "Account", path: "#", children: l }), a.push({ name: "Logout", path: "#", onClick: o });
  } else
    a.push({ name: "Login", path: "/login" });
  return /* @__PURE__ */ s.jsxs("header", { className: de.zoroHeader, children: [
    /* @__PURE__ */ s.jsx("div", { className: de.logo, children: /* @__PURE__ */ s.jsx(hs, { to: "/", children: /* @__PURE__ */ s.jsx("h1", { children: "Zoroastervers" }) }) }),
    /* @__PURE__ */ s.jsxs("div", { className: de.headerControls, children: [
      /* @__PURE__ */ s.jsxs("form", { className: de.searchForm, children: [
        /* @__PURE__ */ s.jsx("input", { type: "text", placeholder: "Search..." }),
        /* @__PURE__ */ s.jsx("button", { type: "submit", children: /* @__PURE__ */ s.jsx(lt, {}) })
      ] }),
      /* @__PURE__ */ s.jsx(fc, {})
    ] }),
    /* @__PURE__ */ s.jsx("nav", { className: de.navbar, children: /* @__PURE__ */ s.jsx("ul", { className: de.navMenu, children: a.map((l) => /* @__PURE__ */ s.jsxs("li", { className: l.children ? de.dropdown : "", children: [
      l.onClick ? /* @__PURE__ */ s.jsx("button", { onClick: l.onClick, className: de.navLink, children: l.name }) : /* @__PURE__ */ s.jsxs(hs, { to: l.path, className: de.navLink, children: [
        l.name,
        " ",
        l.children ? "▾" : ""
      ] }),
      l.children && /* @__PURE__ */ s.jsx("ul", { className: de.dropdownMenu, children: l.children.map((c) => /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx(hs, { to: c.path, className: de.dropdownMenuItem, children: c.name }) }, c.name)) })
    ] }, l.name)) }) })
  ] });
}, pc = "_zoroFooter_8qpog_1", xc = "_footerContent_8qpog_8", yc = "_footerColumns_8qpog_13", bc = "_column_8qpog_20", vc = "_socialIcons_8qpog_50", wc = "_footerQuote_8qpog_59", Ie = {
  zoroFooter: pc,
  footerContent: xc,
  footerColumns: yc,
  column: bc,
  socialIcons: vc,
  footerQuote: wc
}, jc = () => /* @__PURE__ */ s.jsx("footer", { className: Ie.zoroFooter, children: /* @__PURE__ */ s.jsxs("div", { className: Ie.footerContent, children: [
  /* @__PURE__ */ s.jsxs("div", { className: Ie.footerColumns, children: [
    /* @__PURE__ */ s.jsxs("div", { className: Ie.column, children: [
      /* @__PURE__ */ s.jsx("h4", { children: "Zoroastervers" }),
      /* @__PURE__ */ s.jsx("p", { children: "“Truth is the architect of happiness.”" }),
      /* @__PURE__ */ s.jsxs("p", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Zoroastervers. All rights reserved."
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: Ie.column, children: [
      /* @__PURE__ */ s.jsx("h4", { children: "Explore" }),
      /* @__PURE__ */ s.jsxs("ul", { children: [
        /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("a", { href: "/about", children: "About" }) }),
        /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("a", { href: "/books", children: "Books" }) }),
        /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("a", { href: "/artist-collaboration", children: "Artist Collaboration" }) }),
        /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("a", { href: "/contact", children: "Contact" }) })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: Ie.column, children: [
      /* @__PURE__ */ s.jsx("h4", { children: "Connect" }),
      /* @__PURE__ */ s.jsxs("ul", { className: Ie.socialIcons, children: [
        /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("a", { href: "#", children: /* @__PURE__ */ s.jsx(Pl, {}) }) }),
        /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("a", { href: "#", children: /* @__PURE__ */ s.jsx(Al, {}) }) }),
        /* @__PURE__ */ s.jsx("li", { children: /* @__PURE__ */ s.jsx("a", { href: "#", children: /* @__PURE__ */ s.jsx(El, {}) }) })
      ] })
    ] })
  ] }),
  /* @__PURE__ */ s.jsx("div", { className: Ie.footerQuote, children: /* @__PURE__ */ s.jsx("em", { children: "“Let your conscience be the altar where right intention dwells.”" }) })
] }) }), _g = ({
  isAuthenticated: e = !1,
  betaApplicationStatus: t = "none",
  onLogout: r
}) => /* @__PURE__ */ s.jsxs("div", { className: "min-h-screen flex flex-col", children: [
  /* @__PURE__ */ s.jsx(
    gc,
    {
      isAuthenticated: e,
      betaApplicationStatus: t,
      onLogout: r
    }
  ),
  /* @__PURE__ */ s.jsx("main", { className: "flex-1", children: /* @__PURE__ */ s.jsx(jl, {}) }),
  /* @__PURE__ */ s.jsx(jc, {})
] }), Nc = "_zrHero_14v3a_1", kc = "_parchmentCard_14v3a_12", Tc = "_zrHeroContent_14v3a_70", Sc = "_zrTitle_14v3a_74", _c = "_zrQuote_14v3a_88", Cc = "_zrIntro_14v3a_97", Pc = "_zrCta_14v3a_105", Ac = "_zrHeroArt_14v3a_123", Ec = "_videoFire_14v3a_156", Mc = "_prophecyMask_14v3a_168", Dc = "_prophecyReel_14v3a_183", Rc = "_prophecyItem_14v3a_193", Lc = "_englishText_14v3a_203", Fc = "_spinsIndicator_14v3a_212", Vc = "_spinDot_14v3a_221", Ic = "_spinDotActive_14v3a_230", Oc = "_zrSection_14v3a_237", Yc = "_zrH2_14v3a_243", K = {
  zrHero: Nc,
  parchmentCard: kc,
  zrHeroContent: Tc,
  zrTitle: Sc,
  zrQuote: _c,
  zrIntro: Cc,
  zrCta: Pc,
  zrHeroArt: Ac,
  videoFire: Ec,
  prophecyMask: Mc,
  prophecyReel: Dc,
  prophecyItem: Rc,
  englishText: Lc,
  spinsIndicator: Fc,
  spinDot: Vc,
  spinDotActive: Ic,
  zrSection: Oc,
  zrH2: Yc
}, Bc = ({ spinsLeft: e, setSpinsLeft: t, onSpin: r }) => {
  const n = ze(null), [i, o] = C(!1), a = 150, l = [
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
  for (let g = 0; g < c; g++)
    d.push(...l);
  const h = [
    ...d.slice(d.length - u),
    ...d,
    ...d.slice(0, u)
    // Append for smooth loop
  ], m = async () => {
    if (i || !n.current || e <= 0) {
      console.log("No spins left or already spinning.");
      return;
    }
    console.log("handleSpin called");
    try {
      new Audio("/gear-click-351962.mp3").play().catch((v) => console.error("Error playing sound:", v));
    } catch (S) {
      console.error("Error creating Audio object:", S);
    }
    if (o(!0), t((S) => S - 1), r)
      try {
        await r(3 - e + 1);
      } catch (S) {
        console.error("Error updating spin count:", S);
      }
    const g = Math.floor(Math.random() * l.length), k = (u + g + l.length * Math.floor(c / 2)) * a;
    n.current.classList.add("prophecy-reel-spinning"), n.current.style.transform = `translateY(-${k}px)`, setTimeout(() => {
      if (!n.current) return;
      n.current.classList.remove("prophecy-reel-spinning"), n.current.style.transition = "none";
      const S = g * a;
      n.current.style.transform = `translateY(-${S}px)`, n.current.offsetHeight, n.current.style.transition = "transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)", o(!1);
    }, 1600);
  };
  return /* @__PURE__ */ s.jsx(s.Fragment, { children: /* @__PURE__ */ s.jsx("div", { className: K.prophecyMask, onClick: m, children: /* @__PURE__ */ s.jsx("div", { ref: n, className: K.prophecyReel, children: h.map((g, x) => /* @__PURE__ */ s.jsx("div", { className: K.prophecyItem, children: /* @__PURE__ */ s.jsx("span", { className: K.englishText, children: g.english }) }, x)) }) }) });
}, zc = ({ contentMap: e, spinsLeft: t, setSpinsLeft: r, onSpin: n }) => {
  var l, c, u;
  const i = ((l = e.get("hero_title")) == null ? void 0 : l.content) || "Zoroasterverse", o = ((c = e.get("hero_quote")) == null ? void 0 : c.content) || "“Happiness comes to them who bring happiness to others.”", a = ((u = e.get("hero_description")) == null ? void 0 : u.content) || "Learn about the teachings of the prophet Zarathustra, the history of one of the world’s oldest religions, and the principles of Good Thoughts, Good Words, and Good Deeds.";
  return /* @__PURE__ */ s.jsxs("section", { id: "home", className: K.zrHero, children: [
    /* @__PURE__ */ s.jsxs("div", { className: K.zrHeroContent, children: [
      /* @__PURE__ */ s.jsx("h1", { className: K.zrTitle, children: i }),
      /* @__PURE__ */ s.jsx("p", { className: K.zrQuote, children: o }),
      /* @__PURE__ */ s.jsx("p", { className: K.zrIntro, children: a }),
      /* @__PURE__ */ s.jsx($e, { className: K.zrCta, to: "/blog/about", children: "Learn More" })
    ] }),
    /* @__PURE__ */ s.jsxs("figure", { className: K.zrHeroArt, "aria-labelledby": "art-caption", children: [
      /* @__PURE__ */ s.jsx(
        "video",
        {
          src: "/200716-913538378.mp4",
          autoPlay: !0,
          loop: !0,
          muted: !0,
          playsInline: !0,
          className: K.videoFire
        }
      ),
      /* @__PURE__ */ s.jsx("div", { className: K.spinsIndicator, children: [...Array(3)].map((d, h) => /* @__PURE__ */ s.jsx("div", { className: `${K.spinDot} ${h < t ? K.spinDotActive : ""}` }, h)) }),
      /* @__PURE__ */ s.jsx(Bc, { spinsLeft: t, setSpinsLeft: r, onSpin: n }),
      /* @__PURE__ */ s.jsx("figcaption", { id: "art-caption", className: "sr-only", children: "A stylized winged figure above a sacred fire." })
    ] })
  ] });
}, $c = ({ posts: e }) => /* @__PURE__ */ s.jsxs("section", { className: K.zrSection, children: [
  /* @__PURE__ */ s.jsx("h2", { className: K.zrH2, children: "Latest News & Updates" }),
  /* @__PURE__ */ s.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: e.map((t) => {
    const r = t.content.length > 100 ? t.content.substring(0, 100) + "..." : t.content;
    return /* @__PURE__ */ s.jsxs("div", { className: K.parchmentCard, children: [
      /* @__PURE__ */ s.jsx("h3", { children: t.title }),
      /* @__PURE__ */ s.jsx("p", { className: "mt-2", dangerouslySetInnerHTML: { __html: r } }),
      /* @__PURE__ */ s.jsx($e, { to: `/blog/${t.slug}`, className: "mt-4 inline-block", children: "Read More" })
    ] }, t.id);
  }) })
] }), Uc = ({ releases: e }) => /* @__PURE__ */ s.jsxs("section", { className: K.zrSection, children: [
  /* @__PURE__ */ s.jsx("h2", { className: K.zrH2, children: "Latest Releases" }),
  /* @__PURE__ */ s.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: e.map((t) => /* @__PURE__ */ s.jsxs("div", { className: K.parchmentCard, children: [
    /* @__PURE__ */ s.jsx("h3", { children: t.title }),
    /* @__PURE__ */ s.jsxs("p", { className: "mt-2", children: [
      "Type: ",
      t.type
    ] }),
    /* @__PURE__ */ s.jsx("a", { href: t.link || "#", className: "mt-4 inline-block", children: "View Details / Purchase" })
  ] }, t.id)) })
] }), Cg = ({
  homepageData: e = [],
  latestPosts: t = [],
  releaseData: r = [],
  spinsLeft: n = 0,
  isLoading: i = !1,
  isError: o = !1,
  onSpin: a
}) => {
  var d, h, m, g;
  const [l, c] = C(n);
  if (i) return /* @__PURE__ */ s.jsx("div", { className: "text-center py-8", children: "Loading homepage content..." });
  if (o) return /* @__PURE__ */ s.jsx("div", { className: "text-center py-8 text-red-400", children: "Error loading homepage content." });
  const u = new Map(e == null ? void 0 : e.map((x) => [x.section, x]));
  return /* @__PURE__ */ s.jsxs("div", { children: [
    /* @__PURE__ */ s.jsx(zc, { contentMap: u, spinsLeft: l, setSpinsLeft: c, onSpin: a }),
    /* @__PURE__ */ s.jsxs("section", { className: K.zrSection, children: [
      /* @__PURE__ */ s.jsx("h2", { className: K.zrH2, children: "Our Progress" }),
      /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-8 text-center", children: [
        /* @__PURE__ */ s.jsxs("div", { className: K.parchmentCard, children: [
          /* @__PURE__ */ s.jsx("h3", { className: "text-4xl font-bold text-primary", children: ((d = u.get("statistics_words_written")) == null ? void 0 : d.content) || "0" }),
          /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground", children: "Words Written" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: K.parchmentCard, children: [
          /* @__PURE__ */ s.jsx("h3", { className: "text-4xl font-bold text-primary", children: ((h = u.get("statistics_beta_readers")) == null ? void 0 : h.content) || "0" }),
          /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground", children: "Beta Readers" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: K.parchmentCard, children: [
          /* @__PURE__ */ s.jsx("h3", { className: "text-4xl font-bold text-primary", children: ((m = u.get("statistics_average_rating")) == null ? void 0 : m.content) || "0" }),
          /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground", children: "Average Rating" })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: K.parchmentCard, children: [
          /* @__PURE__ */ s.jsx("h3", { className: "text-4xl font-bold text-primary", children: ((g = u.get("statistics_books_published")) == null ? void 0 : g.content) || "0" }),
          /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground", children: "Books Published" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ s.jsx($c, { posts: t || [] }),
    /* @__PURE__ */ s.jsx(Uc, { releases: r || [] }),
    /* @__PURE__ */ s.jsxs("section", { className: K.zrSection, children: [
      /* @__PURE__ */ s.jsx("h2", { className: K.zrH2, children: "Artist Collaboration" }),
      /* @__PURE__ */ s.jsxs("div", { className: "relative rounded-lg shadow-lg overflow-hidden w-full", children: [
        /* @__PURE__ */ s.jsx("img", { src: "/images/invite_to_Colab_card.png", alt: "Artist Collaboration Invitation", className: "w-full h-full object-contain" }),
        /* @__PURE__ */ s.jsxs("div", { className: "absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-8", children: [
          /* @__PURE__ */ s.jsx("h3", { className: "text-2xl font-bold text-white mb-4 text-shadow-md", children: "Join Our Creative Team!" }),
          /* @__PURE__ */ s.jsx("p", { className: "text-white mb-6 text-shadow-sm", children: "We're looking for talented artists to help shape the visual identity of the Zangar/Spandam Series. Explore revenue-share opportunities and bring your vision to life." }),
          /* @__PURE__ */ s.jsx($e, { to: "/artist-collaboration", className: "inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105", children: "Apply Now" })
        ] })
      ] })
    ] })
  ] });
}, Pg = ({ children: e, icon: t, variant: r = "primary", className: n = "", onClick: i, type: o = "button" }) => {
  const a = "group relative inline-flex items-center gap-3 rounded-2xl px-8 py-4 font-semibold tracking-wide transition-all duration-300 transform", l = {
    // Add index signature
    primary: "border border-amber-600/60 bg-gradient-to-r from-amber-600/20 to-orange-600/20 text-amber-100 shadow-[0_0_30px_rgba(251,191,36,0.15)] hover:shadow-[0_0_50px_rgba(251,191,36,0.3)] hover:-translate-y-1",
    secondary: "border border-slate-600/60 bg-gradient-to-r from-slate-800/80 to-slate-900/80 text-slate-200 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(251,191,36,0.2)] hover:border-amber-600/40 hover:-translate-y-1"
  };
  return /* @__PURE__ */ s.jsxs(
    "button",
    {
      className: `${a} ${l[r]} ${n}`,
      onClick: i,
      type: o,
      children: [
        t && /* @__PURE__ */ s.jsx(t, { className: "w-5 h-5" }),
        /* @__PURE__ */ s.jsx("span", { className: "relative z-10", children: e }),
        /* @__PURE__ */ s.jsx(Qi, { className: "w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" }),
        /* @__PURE__ */ s.jsx("div", { className: "absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-600/10 via-orange-600/10 to-amber-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-xl" })
      ]
    }
  );
}, Ag = () => /* @__PURE__ */ s.jsxs("div", { className: "relative flex items-center justify-center my-12", children: [
  /* @__PURE__ */ s.jsx("div", { className: "h-px w-32 bg-gradient-to-r from-transparent via-amber-600/60 to-transparent" }),
  /* @__PURE__ */ s.jsxs("svg", { width: "80", height: "32", viewBox: "0 0 80 32", className: "mx-4 text-amber-500", children: [
    /* @__PURE__ */ s.jsx("path", { d: "M8 16L16 8L24 16L32 8L40 16L48 8L56 16L64 8L72 16", stroke: "currentColor", strokeWidth: "1", fill: "none" }),
    /* @__PURE__ */ s.jsx("circle", { cx: "16", cy: "8", r: "2", fill: "currentColor" }),
    /* @__PURE__ */ s.jsx("circle", { cx: "40", cy: "16", r: "2", fill: "currentColor" }),
    /* @__PURE__ */ s.jsx("circle", { cx: "64", cy: "8", r: "2", fill: "currentColor" })
  ] }),
  /* @__PURE__ */ s.jsx("div", { className: "h-px w-32 bg-gradient-to-r from-transparent via-amber-600/60 to-transparent" })
] }), Eg = () => {
  const [e] = C(
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
function Wc(...e) {
  return Ji(Zi(e));
}
const Mg = ({ count: e = 4, viewMode: t = "grid", className: r }) => {
  const n = Array.from({ length: e }, (i, o) => /* @__PURE__ */ s.jsxs(
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
    o
  ));
  return /* @__PURE__ */ s.jsx(
    "div",
    {
      className: Wc(
        t === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4",
        r
      ),
      children: n
    }
  );
}, Dg = () => {
  const e = ze(null);
  return le(() => {
    const t = e.current;
    if (!t) return;
    const r = 50, n = () => {
      const o = document.createElement("div");
      o.className = "star", o.style.position = "absolute", o.style.backgroundColor = "#ffffff", o.style.borderRadius = "50%", o.style.left = Math.random() * 100 + "%", o.style.top = Math.random() * 100 + "%";
      const a = Math.random() * 3 + 1;
      o.style.width = o.style.height = a + "px", o.style.animationDelay = Math.random() * 3 + "s", o.style.animationDuration = Math.random() * 2 + 2 + "s", o.style.pointerEvents = "none", t.appendChild(o);
    };
    t.innerHTML = "";
    for (let o = 0; o < r; o++)
      n();
    const i = () => {
      const a = window.pageYOffset * -0.1;
      t && (t.style.transform = `translateY(${a}px)`);
    };
    return window.addEventListener("scroll", i), () => {
      window.removeEventListener("scroll", i);
    };
  }, []), /* @__PURE__ */ s.jsx("div", { ref: e, className: "stars fixed top-0 left-0 w-full h-full pointer-events-none -z-10", children: " " });
}, Hc = ({
  item: e,
  isActive: t = !1,
  level: r = 0,
  onClick: n
}) => {
  const { title: i, slug: o, type: a, children: l = [] } = e, c = l && l.length > 0, u = `${r * 16 + 8}px`, d = (h) => {
    h.preventDefault(), n && n(o);
  };
  return /* @__PURE__ */ s.jsxs("div", { className: `wiki-nav-item ${t ? "active" : ""}`, style: { paddingLeft: u }, children: [
    /* @__PURE__ */ s.jsxs(
      $e,
      {
        to: `/wiki/${o}`,
        className: `nav-link ${a}`,
        onClick: d,
        children: [
          i,
          c && /* @__PURE__ */ s.jsx("span", { className: "nav-toggle", children: t ? "▼" : "▶" })
        ]
      }
    ),
    c && t && /* @__PURE__ */ s.jsx("div", { className: "nav-children", children: l.map((h, m) => /* @__PURE__ */ s.jsx(
      Hc,
      {
        item: h,
        level: r + 1,
        isActive: t,
        onClick: n
      },
      h.slug
    )) })
  ] });
}, Rg = () => {
  const { state: e, removeItem: t, updateQuantity: r, clearCart: n } = $l(), [i, o] = C(!1), a = (c, u) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: u.toUpperCase()
  }).format(c), l = () => {
    o(!1);
  };
  return /* @__PURE__ */ s.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ s.jsxs(
      "button",
      {
        onClick: () => o(!i),
        className: "relative p-2 text-text-light hover:text-secondary transition-colors",
        "aria-label": "Shopping Cart",
        children: [
          /* @__PURE__ */ s.jsx(at, { className: "w-6 h-6" }),
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
            onClick: () => o(!1),
            className: "text-text-dark hover:text-text-light transition-colors",
            children: /* @__PURE__ */ s.jsx(Se, { className: "w-5 h-5" })
          }
        )
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "max-h-96 overflow-y-auto", children: e.items.length === 0 ? /* @__PURE__ */ s.jsxs("div", { className: "p-6 text-center", children: [
        /* @__PURE__ */ s.jsx(at, { className: "w-12 h-12 text-text-dark mx-auto mb-3" }),
        /* @__PURE__ */ s.jsx("p", { className: "text-text-dark", children: "Your cart is empty" }),
        /* @__PURE__ */ s.jsx("p", { className: "text-text-dark text-sm", children: "Add some products to get started!" })
      ] }) : /* @__PURE__ */ s.jsx("div", { className: "p-4 space-y-3", children: e.items.map((c) => /* @__PURE__ */ s.jsxs("div", { className: "flex items-center space-x-3 p-3 bg-background/30 rounded-xl", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ s.jsx("h4", { className: "text-sm font-medium text-text-light truncate", children: c.title }),
          /* @__PURE__ */ s.jsx("p", { className: "text-xs text-text-dark", children: c.format.toUpperCase() }),
          /* @__PURE__ */ s.jsx("p", { className: "text-sm text-secondary font-medium", children: a(c.price, c.currency) })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ s.jsx(
            "button",
            {
              onClick: () => r(c.id, c.quantity - 1),
              className: "p-1 text-text-dark hover:text-text-light transition-colors",
              "aria-label": "Decrease quantity",
              children: /* @__PURE__ */ s.jsx(Ml, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ s.jsx("span", { className: "text-sm text-text-light min-w-[2rem] text-center", children: c.quantity }),
          /* @__PURE__ */ s.jsx(
            "button",
            {
              onClick: () => r(c.id, c.quantity + 1),
              className: "p-1 text-text-dark hover:text-text-light transition-colors",
              "aria-label": "Increase quantity",
              children: /* @__PURE__ */ s.jsx(vt, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ s.jsx(
            "button",
            {
              onClick: () => t(c.id),
              className: "p-1 text-error hover:text-error-dark transition-colors",
              "aria-label": "Remove item",
              children: /* @__PURE__ */ s.jsx(Cs, { className: "w-4 h-4" })
            }
          )
        ] })
      ] }, c.id)) }) }),
      e.items.length > 0 && /* @__PURE__ */ s.jsxs("div", { className: "p-4 border-t border-border/30", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ s.jsx("span", { className: "text-text-light font-medium", children: "Total:" }),
          /* @__PURE__ */ s.jsx("span", { className: "text-xl text-secondary font-bold", children: a(e.total, "USD") })
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
        onClick: () => o(!1)
      }
    )
  ] });
}, Lg = () => {
  const [e, t] = C("login"), [r, n] = C(null), [i, o] = C(!1), [a, l] = C(""), [c, u] = C(""), [d, h] = C(""), [m, g] = C(""), [x, k] = C(""), [S, v] = C(""), [j, P] = C(null), D = Xi(), E = (A, b = "info") => {
    n({ text: A, type: b });
    const V = setTimeout(() => n(null), 6e3);
    return () => clearTimeout(V);
  }, z = async (A) => {
    if (A.preventDefault(), !a || !c) {
      E("Please enter both email and password", "error");
      return;
    }
    o(!0);
    try {
      const { error: b } = await Z.auth.signInWithPassword({
        email: a,
        password: c
      });
      if (b) throw b;
      E("Login successful! Redirecting...", "success"), D("/");
    } catch (b) {
      const V = b instanceof Error ? b.message : "Failed to sign in";
      E(V, "error");
    } finally {
      o(!1);
    }
  }, $ = async (A) => {
    if (A.preventDefault(), m !== S) {
      E("Passwords do not match", "error");
      return;
    }
    o(!0);
    try {
      const { error: b } = await Z.auth.signUp({
        email: d,
        password: m,
        options: {
          data: {
            display_name: x
          }
        }
      });
      if (b) throw b;
      E("Account created! Please check your email to confirm your account.", "success"), t("login");
    } catch (b) {
      b instanceof Error && b.message;
    } finally {
      o(!1);
    }
  }, T = async () => {
    console.log("handleGoogleLogin called"), o(!0);
    try {
      const { error: A } = await Z.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/auth/callback"
          // Redirects to the current domain + callback path
        }
      });
      if (A) throw A;
    } catch (A) {
      const b = A instanceof Error ? A.message : "Failed to sign in with Google";
      E(b, "error");
    } finally {
      o(!1);
    }
  }, N = (A) => {
    if (!A) {
      P(null);
      return;
    }
    let b = 0;
    A.length >= 8 && b++, /[A-Z]/.test(A) && b++, /[a-z]/.test(A) && b++, /[0-9]/.test(A) && b++, /[^A-Za-z0-9]/.test(A) && b++, A.length >= 12 && b++;
    const V = [
      { text: "Weak", className: "weak" },
      { text: "Fair", className: "fair" },
      { text: "Good", className: "good" },
      { text: "Strong", className: "strong" },
      { text: "Very Strong", className: "very-strong" }
    ], H = Math.min(b, V.length - 1);
    P(V[H]);
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
    e === "login" && /* @__PURE__ */ s.jsxs("form", { onSubmit: z, className: "auth-form", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ s.jsx("label", { htmlFor: "loginEmail", children: "Email Address" }),
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "email",
            id: "loginEmail",
            value: a,
            onChange: (A) => l(A.target.value),
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
            onChange: (A) => u(A.target.value),
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
      /* @__PURE__ */ s.jsx("div", { className: "form-footer", children: /* @__PURE__ */ s.jsx($e, { to: "/forgot-password", children: "Forgot your password?" }) })
    ] }),
    e === "signup" && /* @__PURE__ */ s.jsxs("form", { onSubmit: $, className: "auth-form", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "form-group", children: [
        /* @__PURE__ */ s.jsx("label", { htmlFor: "signupDisplayName", children: "Display Name" }),
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "text",
            id: "signupDisplayName",
            value: x,
            onChange: (A) => k(A.target.value),
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
            onChange: (A) => h(A.target.value),
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
            value: m,
            onChange: (A) => {
              g(A.target.value), N(A.target.value);
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
            value: S,
            onChange: (A) => v(A.target.value),
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
          onClick: T,
          disabled: i,
          children: "Google"
        }
      ),
      /* @__PURE__ */ s.jsx(
        "button",
        {
          className: "btn social",
          onClick: () => E("GitHub sign-in will be available soon", "info"),
          disabled: i,
          children: "GitHub"
        }
      )
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: "auth-footer", children: "By signing up, you agree to our terms of service and privacy policy." })
  ] }) });
}, Fg = () => {
  const [e, t] = C([]), [r, n] = C(!0), [i, o] = C(null), [a, l] = C(""), [c, u] = C("all"), [d, h] = C(!1), [m, g] = C(null), [x, k] = C({
    name: "",
    title: "",
    description: "",
    product_type: "book",
    cover_image_url: "",
    active: !0,
    status: "draft"
  }), [S, v] = C({
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
      const V = await b.json();
      t(V.products || []);
    } catch (b) {
      o(b instanceof Error ? b.message : "Failed to fetch products");
    } finally {
      n(!1);
    }
  };
  le(() => {
    j();
  }, []);
  const P = e.filter((b) => {
    const V = b.name.toLowerCase().includes(a.toLowerCase()) || b.title.toLowerCase().includes(a.toLowerCase()), H = c === "all" || b.product_type === c;
    return V && H;
  }), D = async (b) => {
    b.preventDefault();
    try {
      const V = m ? `/api/products/${m.id}` : "/api/products", Q = await fetch(V, {
        method: m ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(x)
      });
      if (!Q.ok) {
        const y = await Q.json();
        throw new Error(y.message || "Failed to save product");
      }
      await j(), $(), h(!1);
    } catch (V) {
      o(V instanceof Error ? V.message : "Failed to save product");
    }
  }, E = async (b) => {
    if (confirm(`Are you sure you want to delete "${b.name}"? This will deactivate it in Stripe but not permanently delete it.`))
      try {
        if (!(await fetch(`/api/products/${b.id}`, {
          method: "DELETE"
        })).ok) throw new Error("Failed to delete product");
        await j();
      } catch (V) {
        o(V instanceof Error ? V.message : "Failed to delete product");
      }
  }, z = async (b) => {
    try {
      if (!(await fetch(`/api/products/${b.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !b.active })
      })).ok) throw new Error("Failed to update product");
      await j();
    } catch (V) {
      o(V instanceof Error ? V.message : "Failed to update product");
    }
  }, $ = () => {
    k({
      name: "",
      title: "",
      description: "",
      product_type: "book",
      cover_image_url: "",
      active: !0,
      status: "draft"
    }), g(null);
  }, T = (b) => {
    g(b), k({
      name: b.name,
      title: b.title,
      description: b.description,
      product_type: b.product_type,
      cover_image_url: b.cover_image_url || "",
      active: b.active,
      status: b.status
    }), h(!0);
  }, N = (b) => {
    switch (b) {
      case "book":
        return /* @__PURE__ */ s.jsx(Be, { className: "w-4 h-4" });
      case "subscription":
        return /* @__PURE__ */ s.jsx(Ut, { className: "w-4 h-4" });
      case "bundle":
        return /* @__PURE__ */ s.jsx(rt, { className: "w-4 h-4" });
      default:
        return /* @__PURE__ */ s.jsx(Ue, { className: "w-4 h-4" });
    }
  }, A = (b, V) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: V.toUpperCase()
  }).format(b / 100);
  return r ? /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-center min-h-[400px]", children: [
    /* @__PURE__ */ s.jsx(Pe, { className: "w-8 h-8 animate-spin text-primary" }),
    /* @__PURE__ */ s.jsx("span", { className: "ml-3 text-lg", children: "Loading products..." })
  ] }) : /* @__PURE__ */ s.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0", children: [
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-3", children: [
          /* @__PURE__ */ s.jsx(rt, { className: "w-8 h-8 text-primary" }),
          "Product Management"
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground mt-2", children: "Manage your books, subscriptions, and bundles with integrated Stripe pricing" })
      ] }),
      /* @__PURE__ */ s.jsxs(
        "button",
        {
          onClick: () => {
            $(), h(!0);
          },
          className: "bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center gap-2",
          children: [
            /* @__PURE__ */ s.jsx(vt, { className: "w-5 h-5" }),
            "Add Product"
          ]
        }
      )
    ] }),
    i && /* @__PURE__ */ s.jsxs("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ s.jsx($t, { className: "w-5 h-5 text-red-500 flex-shrink-0" }),
      /* @__PURE__ */ s.jsx("span", { className: "text-red-700 dark:text-red-400", children: i }),
      /* @__PURE__ */ s.jsx(
        "button",
        {
          onClick: () => o(null),
          className: "ml-auto text-red-500 hover:text-red-600",
          children: /* @__PURE__ */ s.jsx(Se, { className: "w-5 h-5" })
        }
      )
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ s.jsx(lt, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "text",
            placeholder: "Search products...",
            value: a,
            onChange: (b) => l(b.target.value),
            className: "w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ s.jsx(Zt, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
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
      ) : /* @__PURE__ */ s.jsx("div", { className: "w-full h-full flex items-center justify-center", children: N(b.product_type) }) }),
      /* @__PURE__ */ s.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ s.jsx("h3", { className: "font-semibold text-foreground line-clamp-2", children: b.title }),
            /* @__PURE__ */ s.jsxs("p", { className: "text-sm text-muted-foreground capitalize flex items-center gap-2 mt-1", children: [
              N(b.product_type),
              b.product_type
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ s.jsx(
            "button",
            {
              onClick: () => z(b),
              className: `p-1.5 rounded-lg transition-colors ${b.active ? "bg-green-100 text-green-600 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`,
              title: b.active ? "Active" : "Inactive",
              children: b.active ? /* @__PURE__ */ s.jsx(ot, { className: "w-4 h-4" }) : /* @__PURE__ */ s.jsx(ea, { className: "w-4 h-4" })
            }
          ) })
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "text-sm text-muted-foreground line-clamp-2", children: b.description || "No description available" }),
        /* @__PURE__ */ s.jsxs("div", { className: "space-y-2", children: [
          b.prices && b.prices.length > 0 ? b.prices.slice(0, 2).map((V) => /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ s.jsxs("span", { className: "text-muted-foreground", children: [
              V.nickname || "Standard",
              V.interval && ` (${V.interval}ly)`
            ] }),
            /* @__PURE__ */ s.jsx("span", { className: "font-medium text-foreground", children: A(V.amount_cents, V.currency) })
          ] }, V.id)) : /* @__PURE__ */ s.jsx("p", { className: "text-sm text-muted-foreground italic", children: "No prices set" }),
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
                /* @__PURE__ */ s.jsx(fs, { className: "w-4 h-4" }),
                "Edit"
              ]
            }
          ),
          /* @__PURE__ */ s.jsxs(
            "button",
            {
              onClick: () => E(b),
              className: "text-red-500 hover:text-red-600 flex items-center gap-2 text-sm font-medium",
              children: [
                /* @__PURE__ */ s.jsx(Cs, { className: "w-4 h-4" }),
                "Delete"
              ]
            }
          )
        ] })
      ] })
    ] }, b.id)) }),
    P.length === 0 && !r && /* @__PURE__ */ s.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ s.jsx(rt, { className: "w-16 h-16 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "No products found" }),
      /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground mb-4", children: a || c !== "all" ? "Try adjusting your search or filters" : "Get started by creating your first product" }),
      /* @__PURE__ */ s.jsx(
        "button",
        {
          onClick: () => {
            $(), h(!0);
          },
          className: "bg-primary text-white px-6 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors",
          children: "Create Product"
        }
      )
    ] }),
    d && /* @__PURE__ */ s.jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ s.jsxs("div", { className: "bg-background rounded-xl shadow-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between p-6 border-b border-border", children: [
        /* @__PURE__ */ s.jsx("h2", { className: "text-xl font-semibold text-foreground", children: m ? "Edit Product" : "Create Product" }),
        /* @__PURE__ */ s.jsx(
          "button",
          {
            onClick: () => {
              h(!1), $();
            },
            className: "text-muted-foreground hover:text-foreground",
            children: /* @__PURE__ */ s.jsx(Se, { className: "w-6 h-6" })
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
                value: x.name,
                onChange: (b) => k({ ...x, name: b.target.value }),
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
                value: x.title,
                onChange: (b) => k({ ...x, title: b.target.value }),
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
              value: x.description,
              onChange: (b) => k({ ...x, description: b.target.value }),
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
                value: x.product_type,
                onChange: (b) => k({ ...x, product_type: b.target.value }),
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
                value: x.status,
                onChange: (b) => k({ ...x, status: b.target.value }),
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
              value: x.cover_image_url,
              onChange: (b) => k({ ...x, cover_image_url: b.target.value }),
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
              checked: x.active,
              onChange: (b) => k({ ...x, active: b.target.checked }),
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
                h(!1), $();
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
                /* @__PURE__ */ s.jsx(ta, { className: "w-4 h-4" }),
                m ? "Update Product" : "Create Product"
              ]
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}, Vg = () => {
  const [e, t] = C("orders"), [r, n] = C([]), [i, o] = C([]), [a, l] = C(!0), [c, u] = C(null), [d, h] = C(""), [m, g] = C("all"), [x, k] = C("all"), [S, v] = C(null), [j, P] = C(null), D = async () => {
    try {
      const y = await fetch("/api/admin/orders?include_details=true");
      if (!y.ok) throw new Error("Failed to fetch orders");
      const I = await y.json();
      n(I.orders || []);
    } catch (y) {
      u(y instanceof Error ? y.message : "Failed to fetch orders");
    }
  }, E = async () => {
    try {
      const y = await fetch("/api/admin/subscriptions?include_details=true");
      if (!y.ok) throw new Error("Failed to fetch subscriptions");
      const I = await y.json();
      o(I.subscriptions || []);
    } catch (y) {
      u(y instanceof Error ? y.message : "Failed to fetch subscriptions");
    }
  }, z = async () => {
    try {
      l(!0), u(null), await Promise.all([D(), E()]);
    } catch {
      u("Failed to fetch data");
    } finally {
      l(!1);
    }
  };
  le(() => {
    z();
  }, []);
  const $ = r.filter((y) => {
    var F, L, se, ge, w;
    const I = y.id.toLowerCase().includes(d.toLowerCase()) || ((F = y.customer_email) == null ? void 0 : F.toLowerCase().includes(d.toLowerCase())) || ((se = (L = y.user) == null ? void 0 : L.email) == null ? void 0 : se.toLowerCase().includes(d.toLowerCase())) || ((w = (ge = y.product) == null ? void 0 : ge.title) == null ? void 0 : w.toLowerCase().includes(d.toLowerCase())), O = m === "all" || y.status === m;
    return I && O;
  }), T = i.filter((y) => {
    var F, L;
    const I = y.id.toLowerCase().includes(d.toLowerCase()) || y.provider_subscription_id.toLowerCase().includes(d.toLowerCase()) || ((L = (F = y.user) == null ? void 0 : F.email) == null ? void 0 : L.toLowerCase().includes(d.toLowerCase())), O = x === "all" || y.status === x;
    return I && O;
  }), N = (y, I = "USD") => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: I.toUpperCase()
  }).format(y / 100), A = (y) => new Date(y).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }), b = (y) => {
    switch (y) {
      case "completed":
        return { color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/20", icon: wt };
      case "pending":
        return { color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/20", icon: Lt };
      case "failed":
        return { color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/20", icon: Rt };
      case "cancelled":
        return { color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-900/20", icon: Rt };
      case "expired":
        return { color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/20", icon: gs };
      default:
        return { color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-900/20", icon: Lt };
    }
  }, V = (y) => {
    switch (y) {
      case "active":
        return { color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/20", icon: wt };
      case "trialing":
        return { color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/20", icon: Lt };
      case "past_due":
        return { color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/20", icon: gs };
      case "canceled":
        return { color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/20", icon: Rt };
      default:
        return { color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-900/20", icon: Lt };
    }
  }, H = async (y) => {
    if (confirm("Are you sure you want to issue a refund for this order?"))
      try {
        if (!(await fetch(`/api/admin/orders/${y}/refund`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        })).ok) throw new Error("Failed to process refund");
        await D(), v(null);
      } catch (I) {
        u(I instanceof Error ? I.message : "Failed to process refund");
      }
  }, Q = async (y) => {
    if (confirm("Are you sure you want to cancel this subscription?"))
      try {
        if (!(await fetch(`/api/admin/subscriptions/${y}/cancel`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        })).ok) throw new Error("Failed to cancel subscription");
        await E(), P(null);
      } catch (I) {
        u(I instanceof Error ? I.message : "Failed to cancel subscription");
      }
  };
  return a ? /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-center min-h-[400px]", children: [
    /* @__PURE__ */ s.jsx(Pe, { className: "w-8 h-8 animate-spin text-primary" }),
    /* @__PURE__ */ s.jsx("span", { className: "ml-3 text-lg", children: "Loading orders and subscriptions..." })
  ] }) : /* @__PURE__ */ s.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0", children: [
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-3", children: [
          /* @__PURE__ */ s.jsx(at, { className: "w-8 h-8 text-primary" }),
          "Order Management"
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground mt-2", children: "Track and manage customer orders, subscriptions, and payments" })
      ] }),
      /* @__PURE__ */ s.jsxs(
        "button",
        {
          onClick: z,
          className: "bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center gap-2",
          children: [
            /* @__PURE__ */ s.jsx(Pe, { className: "w-5 h-5" }),
            "Refresh"
          ]
        }
      )
    ] }),
    c && /* @__PURE__ */ s.jsxs("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ s.jsx(gs, { className: "w-5 h-5 text-red-500 flex-shrink-0" }),
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
        /* @__PURE__ */ s.jsx(lt, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "text",
            placeholder: `Search ${e}...`,
            value: d,
            onChange: (y) => h(y.target.value),
            className: "w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ s.jsx(Zt, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
        /* @__PURE__ */ s.jsxs(
          "select",
          {
            value: e === "orders" ? m : x,
            onChange: (y) => {
              e === "orders" ? g(y.target.value) : k(y.target.value);
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
    e === "orders" && /* @__PURE__ */ s.jsx("div", { className: "space-y-4", children: $.length === 0 ? /* @__PURE__ */ s.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ s.jsx(at, { className: "w-16 h-16 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "No orders found" }),
      /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground", children: d || m !== "all" ? "Try adjusting your search or filters" : "Orders will appear here when customers make purchases" })
    ] }) : /* @__PURE__ */ s.jsx("div", { className: "grid gap-4", children: $.map((y) => {
      var F, L;
      const I = b(y.status), O = I.icon;
      return /* @__PURE__ */ s.jsx("div", { className: "bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow", children: /* @__PURE__ */ s.jsx("div", { className: "flex items-start justify-between", children: /* @__PURE__ */ s.jsxs("div", { className: "flex-1 space-y-3", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ s.jsxs("h3", { className: "text-lg font-semibold text-foreground", children: [
              "Order #",
              y.id.slice(-8)
            ] }),
            /* @__PURE__ */ s.jsxs("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${I.bg} ${I.color}`, children: [
              /* @__PURE__ */ s.jsx(O, { className: "w-3 h-3 mr-1" }),
              y.status
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ s.jsx("p", { className: "text-lg font-bold text-foreground", children: N(y.amount_cents, y.currency) }),
            /* @__PURE__ */ s.jsx("p", { className: "text-sm text-muted-foreground", children: A(y.created_at) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ s.jsx(kn, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ s.jsx("span", { className: "text-foreground", children: y.customer_email || ((F = y.user) == null ? void 0 : F.email) || "No email" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ s.jsx(rt, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ s.jsx("span", { className: "text-foreground", children: ((L = y.product) == null ? void 0 : L.title) || "Unknown Product" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ s.jsx(Tn, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ s.jsxs("span", { className: "text-foreground capitalize", children: [
              y.provider,
              " Payment"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between pt-3 border-t border-border", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ s.jsxs(
              "button",
              {
                onClick: () => v(y),
                className: "text-primary hover:text-primary-dark flex items-center gap-2 text-sm font-medium",
                children: [
                  /* @__PURE__ */ s.jsx(ot, { className: "w-4 h-4" }),
                  "View Details"
                ]
              }
            ),
            y.status === "completed" && /* @__PURE__ */ s.jsxs(
              "button",
              {
                onClick: () => H(y.id),
                className: "text-orange-600 hover:text-orange-700 flex items-center gap-2 text-sm font-medium",
                children: [
                  /* @__PURE__ */ s.jsx(_r, { className: "w-4 h-4" }),
                  "Refund"
                ]
              }
            )
          ] }),
          y.provider_payment_intent_id && /* @__PURE__ */ s.jsxs(
            "button",
            {
              onClick: () => window.open(`https://dashboard.stripe.com/payments/${y.provider_payment_intent_id}`, "_blank"),
              className: "text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm",
              children: [
                /* @__PURE__ */ s.jsx(Sn, { className: "w-4 h-4" }),
                "View in Stripe"
              ]
            }
          )
        ] })
      ] }) }) }, y.id);
    }) }) }),
    e === "subscriptions" && /* @__PURE__ */ s.jsx("div", { className: "space-y-4", children: T.length === 0 ? /* @__PURE__ */ s.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ s.jsx(Ut, { className: "w-16 h-16 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "No subscriptions found" }),
      /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground", children: d || x !== "all" ? "Try adjusting your search or filters" : "Subscriptions will appear here when customers subscribe" })
    ] }) : /* @__PURE__ */ s.jsx("div", { className: "grid gap-4", children: T.map((y) => {
      var F, L;
      const I = V(y.status), O = I.icon;
      return /* @__PURE__ */ s.jsx("div", { className: "bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow", children: /* @__PURE__ */ s.jsx("div", { className: "flex items-start justify-between", children: /* @__PURE__ */ s.jsxs("div", { className: "flex-1 space-y-3", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ s.jsxs("h3", { className: "text-lg font-semibold text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ s.jsx(Ut, { className: "w-5 h-5 text-primary" }),
              "Subscription #",
              y.id.slice(-8)
            ] }),
            /* @__PURE__ */ s.jsxs("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${I.bg} ${I.color}`, children: [
              /* @__PURE__ */ s.jsx(O, { className: "w-3 h-3 mr-1" }),
              y.status
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ s.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "Created ",
              A(y.created_at)
            ] }),
            y.current_period_end && /* @__PURE__ */ s.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "Next billing: ",
              A(y.current_period_end)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ s.jsx(kn, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ s.jsx("span", { className: "text-foreground", children: ((F = y.user) == null ? void 0 : F.email) || "No email" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ s.jsx(Tr, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ s.jsxs("span", { className: "text-foreground", children: [
              ((L = y.plan) == null ? void 0 : L.interval) || "Unknown",
              " billing"
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ s.jsx(Tn, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ s.jsxs("span", { className: "text-foreground capitalize", children: [
              y.provider,
              " Subscription"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between pt-3 border-t border-border", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ s.jsxs(
              "button",
              {
                onClick: () => P(y),
                className: "text-primary hover:text-primary-dark flex items-center gap-2 text-sm font-medium",
                children: [
                  /* @__PURE__ */ s.jsx(ot, { className: "w-4 h-4" }),
                  "View Details"
                ]
              }
            ),
            y.status === "active" && !y.cancel_at_period_end && /* @__PURE__ */ s.jsxs(
              "button",
              {
                onClick: () => Q(y.id),
                className: "text-red-600 hover:text-red-700 flex items-center gap-2 text-sm font-medium",
                children: [
                  /* @__PURE__ */ s.jsx(Rt, { className: "w-4 h-4" }),
                  "Cancel"
                ]
              }
            )
          ] }),
          y.provider_subscription_id && /* @__PURE__ */ s.jsxs(
            "button",
            {
              onClick: () => window.open(`https://dashboard.stripe.com/subscriptions/${y.provider_subscription_id}`, "_blank"),
              className: "text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm",
              children: [
                /* @__PURE__ */ s.jsx(Sn, { className: "w-4 h-4" }),
                "View in Stripe"
              ]
            }
          )
        ] })
      ] }) }) }, y.id);
    }) }) })
  ] });
}, Ig = () => {
  const [e, t] = C([]), [r, n] = C(null), [i, o] = C(!0), [a, l] = C(null), [c, u] = C(""), [d, h] = C("all"), [m, g] = C("sales"), [x, k] = C("desc"), S = async () => {
    try {
      const N = await fetch("/api/admin/inventory");
      if (!N.ok) throw new Error("Failed to fetch inventory data");
      const A = await N.json();
      t(A.inventory || []);
    } catch (N) {
      l(N instanceof Error ? N.message : "Failed to fetch inventory");
    }
  }, v = async () => {
    try {
      const N = await fetch("/api/admin/metrics");
      if (!N.ok) throw new Error("Failed to fetch metrics");
      const A = await N.json();
      n(A.metrics);
    } catch (N) {
      l(N instanceof Error ? N.message : "Failed to fetch metrics");
    }
  }, j = async () => {
    try {
      o(!0), l(null), await Promise.all([S(), v()]);
    } catch {
      l("Failed to fetch data");
    } finally {
      o(!1);
    }
  };
  le(() => {
    j();
  }, []);
  const P = e.filter((N) => {
    const A = N.product.name.toLowerCase().includes(c.toLowerCase()) || N.product.title.toLowerCase().includes(c.toLowerCase()), b = d === "all" || N.product.product_type === d;
    return A && b;
  }).sort((N, A) => {
    let b, V;
    switch (m) {
      case "name":
        b = N.product.title.toLowerCase(), V = A.product.title.toLowerCase();
        break;
      case "sales":
        b = N.total_sales, V = A.total_sales;
        break;
      case "revenue":
        b = N.revenue, V = A.revenue;
        break;
      case "recent_activity":
        b = N.last_sale ? new Date(N.last_sale).getTime() : 0, V = A.last_sale ? new Date(A.last_sale).getTime() : 0;
        break;
      default:
        b = N.total_sales, V = A.total_sales;
    }
    return x === "asc" ? b > V ? 1 : -1 : b < V ? 1 : -1;
  }), D = (N) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(N), E = (N) => `${N >= 0 ? "+" : ""}${N.toFixed(1)}%`, z = (N) => new Date(N).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }), $ = (N) => {
    switch (N) {
      case "book":
        return /* @__PURE__ */ s.jsx(Be, { className: "w-4 h-4" });
      case "subscription":
        return /* @__PURE__ */ s.jsx(Ut, { className: "w-4 h-4" });
      case "bundle":
        return /* @__PURE__ */ s.jsx(ns, { className: "w-4 h-4" });
      default:
        return /* @__PURE__ */ s.jsx(Ue, { className: "w-4 h-4" });
    }
  }, T = (N, A) => {
    const b = A > 0 ? (N - A) / A * 100 : 0;
    return b > 10 ? { icon: ut, color: "text-green-600", bg: "bg-green-100" } : b < -10 ? { icon: is, color: "text-red-600", bg: "bg-red-100" } : { icon: ms, color: "text-yellow-600", bg: "bg-yellow-100" };
  };
  return i ? /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-center min-h-[400px]", children: [
    /* @__PURE__ */ s.jsx(Pe, { className: "w-8 h-8 animate-spin text-primary" }),
    /* @__PURE__ */ s.jsx("span", { className: "ml-3 text-lg", children: "Loading inventory data..." })
  ] }) : /* @__PURE__ */ s.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0", children: [
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-3", children: [
          /* @__PURE__ */ s.jsx(ns, { className: "w-8 h-8 text-primary" }),
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
            /* @__PURE__ */ s.jsx(Pe, { className: "w-5 h-5" }),
            "Refresh Data"
          ]
        }
      )
    ] }),
    a && /* @__PURE__ */ s.jsxs("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ s.jsx(gs, { className: "w-5 h-5 text-red-500 flex-shrink-0" }),
      /* @__PURE__ */ s.jsx("span", { className: "text-red-700 dark:text-red-400", children: a })
    ] }),
    r && /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ s.jsx("div", { className: "bg-card border border-border rounded-xl p-6", children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Total Revenue" }),
          /* @__PURE__ */ s.jsx("p", { className: "text-2xl font-bold text-foreground", children: D(r.total_revenue) }),
          /* @__PURE__ */ s.jsxs("p", { className: `text-sm flex items-center gap-1 mt-1 ${r.revenue_growth >= 0 ? "text-green-600" : "text-red-600"}`, children: [
            r.revenue_growth >= 0 ? /* @__PURE__ */ s.jsx(ut, { className: "w-4 h-4" }) : /* @__PURE__ */ s.jsx(is, { className: "w-4 h-4" }),
            E(r.revenue_growth),
            " this month"
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ s.jsx(_r, { className: "w-6 h-6 text-green-600" }) })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "bg-card border border-border rounded-xl p-6", children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Total Sales" }),
          /* @__PURE__ */ s.jsx("p", { className: "text-2xl font-bold text-foreground", children: r.total_sales.toLocaleString() }),
          /* @__PURE__ */ s.jsxs("p", { className: `text-sm flex items-center gap-1 mt-1 ${r.sales_growth >= 0 ? "text-green-600" : "text-red-600"}`, children: [
            r.sales_growth >= 0 ? /* @__PURE__ */ s.jsx(ut, { className: "w-4 h-4" }) : /* @__PURE__ */ s.jsx(is, { className: "w-4 h-4" }),
            E(r.sales_growth),
            " this month"
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ s.jsx(ms, { className: "w-6 h-6 text-blue-600" }) })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "bg-card border border-border rounded-xl p-6", children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Active Subscriptions" }),
          /* @__PURE__ */ s.jsx("p", { className: "text-2xl font-bold text-foreground", children: r.active_subscriptions.toLocaleString() }),
          /* @__PURE__ */ s.jsxs("p", { className: `text-sm flex items-center gap-1 mt-1 ${r.subscription_growth >= 0 ? "text-green-600" : "text-red-600"}`, children: [
            r.subscription_growth >= 0 ? /* @__PURE__ */ s.jsx(ut, { className: "w-4 h-4" }) : /* @__PURE__ */ s.jsx(is, { className: "w-4 h-4" }),
            E(r.subscription_growth),
            " this month"
          ] })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ s.jsx(Ut, { className: "w-6 h-6 text-purple-600" }) })
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
        /* @__PURE__ */ s.jsx("div", { className: "w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ s.jsx(ns, { className: "w-6 h-6 text-orange-600" }) })
      ] }) })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "flex flex-col lg:flex-row gap-4", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ s.jsx(lt, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "text",
            placeholder: "Search products...",
            value: c,
            onChange: (N) => u(N.target.value),
            className: "w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ s.jsx(Zt, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
          /* @__PURE__ */ s.jsxs(
            "select",
            {
              value: d,
              onChange: (N) => h(N.target.value),
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
            value: `${m}-${x}`,
            onChange: (N) => {
              const [A, b] = N.target.value.split("-");
              g(A), k(b);
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
        /* @__PURE__ */ s.jsx(ns, { className: "w-12 h-12 text-muted-foreground mx-auto mb-3" }),
        /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-medium text-foreground mb-1", children: "No products found" }),
        /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground", children: c || d !== "all" ? "Try adjusting your search or filters" : "Products will appear here once they have sales data" })
      ] }) }) : P.map((N) => {
        const A = T(N.recent_sales, N.total_sales - N.recent_sales), b = A.icon;
        return /* @__PURE__ */ s.jsxs("tr", { className: "hover:bg-muted/30", children: [
          /* @__PURE__ */ s.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ s.jsx("div", { className: "flex items-center", children: /* @__PURE__ */ s.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ s.jsx("div", { className: "text-sm font-medium text-foreground", children: N.product.title }),
            /* @__PURE__ */ s.jsx("div", { className: "text-sm text-muted-foreground", children: N.product.name })
          ] }) }) }),
          /* @__PURE__ */ s.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
            $(N.product.product_type),
            /* @__PURE__ */ s.jsx("span", { className: "text-sm text-foreground capitalize", children: N.product.product_type })
          ] }) }),
          /* @__PURE__ */ s.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ s.jsx("div", { className: "text-sm font-medium text-foreground", children: N.total_sales.toLocaleString() }) }),
          /* @__PURE__ */ s.jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ s.jsx("div", { className: "text-sm font-medium text-foreground", children: N.recent_sales.toLocaleString() }),
            N.downloads && /* @__PURE__ */ s.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              N.downloads.toLocaleString(),
              " downloads"
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ s.jsx("div", { className: "text-sm font-medium text-foreground", children: D(N.revenue) }),
            /* @__PURE__ */ s.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              D(N.revenue_recent),
              " recent"
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ s.jsxs("div", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${A.bg} ${A.color}`, children: [
              /* @__PURE__ */ s.jsx(b, { className: "w-3 h-3 mr-1" }),
              N.recent_sales > N.total_sales - N.recent_sales ? "Growing" : N.recent_sales < (N.total_sales - N.recent_sales) / 2 ? "Declining" : "Stable"
            ] }),
            N.active_subscriptions !== void 0 && /* @__PURE__ */ s.jsxs("div", { className: "text-xs text-muted-foreground mt-1", children: [
              N.active_subscriptions,
              " active subs"
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ s.jsx("div", { className: "text-sm text-foreground", children: N.last_sale ? z(N.last_sale) : "Never" }) }),
          /* @__PURE__ */ s.jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ s.jsx("button", { className: "text-primary hover:text-primary-dark p-1", children: /* @__PURE__ */ s.jsx(ot, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ s.jsx("button", { className: "text-muted-foreground hover:text-foreground p-1", children: /* @__PURE__ */ s.jsx(ms, { className: "w-4 h-4" }) })
          ] }) })
        ] }, N.id);
      }) })
    ] }) }) })
  ] });
}, Og = () => {
  const [e, t] = C([]), [r, n] = C([]), [i, o] = C(!0), [a, l] = C(null), [c, u] = C("works"), [d, h] = C(""), [m, g] = C("all"), [x, k] = C("all"), [S, v] = C(!1), [j, P] = C(null), [D, E] = C(null), [z, $] = C(!1), [T, N] = C({
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
  }), A = async () => {
    try {
      const p = await fetch("/api/admin/works?include_stats=true");
      if (!p.ok) throw new Error("Failed to fetch works");
      const R = await p.json();
      t(R.works || []);
    } catch (p) {
      l(p instanceof Error ? p.message : "Failed to fetch works");
    }
  }, b = async (p) => {
    try {
      const R = p ? `/api/admin/chapters?work_id=${p}` : "/api/admin/chapters", G = await fetch(R);
      if (!G.ok) throw new Error("Failed to fetch chapters");
      const oe = await G.json();
      n(oe.chapters || []);
    } catch (R) {
      l(R instanceof Error ? R.message : "Failed to fetch chapters");
    }
  };
  le(() => {
    (async () => {
      o(!0), l(null);
      try {
        await Promise.all([A(), b()]);
      } catch {
        l("Failed to load data");
      } finally {
        o(!1);
      }
    })();
  }, []);
  const V = e.filter((p) => {
    var ye;
    const R = p.title.toLowerCase().includes(d.toLowerCase()) || ((ye = p.description) == null ? void 0 : ye.toLowerCase().includes(d.toLowerCase())), G = m === "all" || p.status === m, oe = x === "all" || p.type === x;
    return R && G && oe;
  }), H = D ? r.filter((p) => p.work_id === D.id) : r, Q = async (p) => {
    p.preventDefault();
    try {
      const R = j ? `/api/admin/works/${j.id}` : "/api/admin/works", oe = await fetch(R, {
        method: j ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...T,
          progress_percentage: T.progress_percentage || 0,
          target_word_count: T.target_word_count || null
        })
      });
      if (!oe.ok) {
        const ye = await oe.json();
        throw new Error(ye.message || "Failed to save work");
      }
      await A(), y(), v(!1);
    } catch (R) {
      l(R instanceof Error ? R.message : "Failed to save work");
    }
  }, y = () => {
    N({
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
  }, I = (p) => {
    P(p), N({
      title: p.title,
      type: p.type,
      parent_id: p.parent_id,
      description: p.description || "",
      status: p.status,
      progress_percentage: p.progress_percentage || 0,
      release_date: p.release_date || "",
      estimated_release: p.estimated_release || "",
      cover_image_url: p.cover_image_url || "",
      is_featured: p.is_featured,
      is_premium: p.is_premium,
      is_free: p.is_free,
      target_word_count: p.target_word_count
    }), v(!0);
  }, O = async (p) => {
    if (confirm(`Are you sure you want to delete "${p.title}"? This will also delete all associated chapters.`))
      try {
        if (!(await fetch(`/api/admin/works/${p.id}`, {
          method: "DELETE"
        })).ok) throw new Error("Failed to delete work");
        await A(), (D == null ? void 0 : D.id) === p.id && E(null);
      } catch (R) {
        l(R instanceof Error ? R.message : "Failed to delete work");
      }
  }, F = async (p, R) => {
    try {
      if (!(await fetch(`/api/admin/works/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [R]: !p[R] })
      })).ok) throw new Error("Failed to update work");
      await A();
    } catch (G) {
      l(G instanceof Error ? G.message : "Failed to update work");
    }
  }, L = async (p) => {
    try {
      if (!(await fetch(`/api/admin/chapters/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !p.is_published })
      })).ok) throw new Error("Failed to update chapter");
      await b(D == null ? void 0 : D.id);
    } catch (R) {
      l(R instanceof Error ? R.message : "Failed to update chapter");
    }
  }, se = (p) => {
    switch (p) {
      case "published":
        return { color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/20", icon: wt };
      case "writing":
        return { color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/20", icon: fs };
      case "editing":
        return { color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/20", icon: Sr };
      case "planning":
        return { color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/20", icon: Rl };
      case "on_hold":
        return { color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-900/20", icon: Dl };
      default:
        return { color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-900/20", icon: Lt };
    }
  }, ge = (p) => {
    switch (p) {
      case "book":
        return /* @__PURE__ */ s.jsx(Be, { className: "w-4 h-4" });
      case "volume":
        return /* @__PURE__ */ s.jsx(bt, { className: "w-4 h-4" });
      case "saga":
        return /* @__PURE__ */ s.jsx(Ll, { className: "w-4 h-4" });
      case "arc":
        return /* @__PURE__ */ s.jsx(ut, { className: "w-4 h-4" });
      case "issue":
        return /* @__PURE__ */ s.jsx(Ue, { className: "w-4 h-4" });
      default:
        return /* @__PURE__ */ s.jsx(Be, { className: "w-4 h-4" });
    }
  }, w = (p) => new Date(p).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  return i ? /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-center min-h-[400px]", children: [
    /* @__PURE__ */ s.jsx(Pe, { className: "w-8 h-8 animate-spin text-primary" }),
    /* @__PURE__ */ s.jsx("span", { className: "ml-3 text-lg", children: "Loading works and chapters..." })
  ] }) : /* @__PURE__ */ s.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0", children: [
      /* @__PURE__ */ s.jsxs("div", { children: [
        /* @__PURE__ */ s.jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-3", children: [
          /* @__PURE__ */ s.jsx(Be, { className: "w-8 h-8 text-primary" }),
          "Works Management"
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground mt-2", children: "Create and manage your literary works, upload chapters for subscribers, and showcase in library" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ s.jsxs(
          "button",
          {
            onClick: () => $(!0),
            className: "bg-secondary text-white px-6 py-3 rounded-xl font-medium hover:bg-secondary-dark transition-colors flex items-center gap-2",
            children: [
              /* @__PURE__ */ s.jsx(Ye, { className: "w-5 h-5" }),
              "Upload Chapter"
            ]
          }
        ),
        /* @__PURE__ */ s.jsxs(
          "button",
          {
            onClick: () => {
              y(), v(!0);
            },
            className: "bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center gap-2",
            children: [
              /* @__PURE__ */ s.jsx(vt, { className: "w-5 h-5" }),
              "New Work"
            ]
          }
        )
      ] })
    ] }),
    a && /* @__PURE__ */ s.jsxs("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ s.jsx($t, { className: "w-5 h-5 text-red-500 flex-shrink-0" }),
      /* @__PURE__ */ s.jsx("span", { className: "text-red-700 dark:text-red-400", children: a }),
      /* @__PURE__ */ s.jsx(
        "button",
        {
          onClick: () => l(null),
          className: "ml-auto text-red-500 hover:text-red-600",
          children: /* @__PURE__ */ s.jsx(Se, { className: "w-5 h-5" })
        }
      )
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: "border-b border-border", children: /* @__PURE__ */ s.jsxs("nav", { className: "-mb-px flex space-x-8", children: [
      /* @__PURE__ */ s.jsxs(
        "button",
        {
          onClick: () => {
            u("works"), E(null);
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
        /* @__PURE__ */ s.jsx(lt, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "text",
            placeholder: `Search ${c}...`,
            value: d,
            onChange: (p) => h(p.target.value),
            className: "w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          }
        )
      ] }),
      c === "works" && /* @__PURE__ */ s.jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ s.jsx(Zt, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
          /* @__PURE__ */ s.jsxs(
            "select",
            {
              value: m,
              onChange: (p) => g(p.target.value),
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
            value: x,
            onChange: (p) => k(p.target.value),
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
    c === "works" && /* @__PURE__ */ s.jsx("div", { className: "space-y-4", children: V.length === 0 ? /* @__PURE__ */ s.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ s.jsx(Be, { className: "w-16 h-16 text-muted-foreground mx-auto mb-4" }),
      /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "No works found" }),
      /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground mb-4", children: d || m !== "all" || x !== "all" ? "Try adjusting your search or filters" : "Create your first work to get started" }),
      /* @__PURE__ */ s.jsx(
        "button",
        {
          onClick: () => {
            y(), v(!0);
          },
          className: "bg-primary text-white px-6 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors",
          children: "Create First Work"
        }
      )
    ] }) : /* @__PURE__ */ s.jsx("div", { className: "grid gap-4", children: V.map((p) => {
      const R = se(p.status), G = R.icon;
      return /* @__PURE__ */ s.jsx("div", { className: "bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow", children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "flex-1 space-y-3", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
                ge(p.type),
                /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-semibold text-foreground", children: p.title })
              ] }),
              /* @__PURE__ */ s.jsxs("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${R.bg} ${R.color}`, children: [
                /* @__PURE__ */ s.jsx(G, { className: "w-3 h-3 mr-1" }),
                p.status
              ] }),
              p.is_featured && /* @__PURE__ */ s.jsx(er, { className: "w-4 h-4 text-yellow-500 fill-current" })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "text-right text-sm text-muted-foreground", children: [
              /* @__PURE__ */ s.jsxs("p", { children: [
                "Updated ",
                w(p.updated_at)
              ] }),
              p.chapters_count && /* @__PURE__ */ s.jsxs("p", { children: [
                p.published_chapters,
                "/",
                p.chapters_count,
                " chapters published"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 text-sm", children: [
            /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("span", { className: "text-muted-foreground", children: "Type:" }),
              /* @__PURE__ */ s.jsx("span", { className: "ml-2 text-foreground capitalize", children: p.type })
            ] }),
            p.progress_percentage !== void 0 && /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("span", { className: "text-muted-foreground", children: "Progress:" }),
              /* @__PURE__ */ s.jsxs("span", { className: "ml-2 text-foreground", children: [
                p.progress_percentage,
                "%"
              ] })
            ] }),
            p.word_count && /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("span", { className: "text-muted-foreground", children: "Words:" }),
              /* @__PURE__ */ s.jsxs("span", { className: "ml-2 text-foreground", children: [
                p.word_count.toLocaleString(),
                p.target_word_count && ` / ${p.target_word_count.toLocaleString()}`
              ] })
            ] }),
            p.rating && /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("span", { className: "text-muted-foreground", children: "Rating:" }),
              /* @__PURE__ */ s.jsxs("span", { className: "ml-2 text-foreground", children: [
                p.rating.toFixed(1),
                " ⭐ (",
                p.reviews_count,
                ")"
              ] })
            ] })
          ] }),
          p.description && /* @__PURE__ */ s.jsx("p", { className: "text-sm text-muted-foreground line-clamp-2", children: p.description }),
          /* @__PURE__ */ s.jsxs("div", { className: "flex gap-6 text-sm", children: [
            p.release_date && /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("span", { className: "text-muted-foreground", children: "Released:" }),
              /* @__PURE__ */ s.jsx("span", { className: "ml-2 text-foreground", children: w(p.release_date) })
            ] }),
            p.estimated_release && !p.release_date && /* @__PURE__ */ s.jsxs("div", { children: [
              /* @__PURE__ */ s.jsx("span", { className: "text-muted-foreground", children: "Est. Release:" }),
              /* @__PURE__ */ s.jsx("span", { className: "ml-2 text-foreground", children: p.estimated_release })
            ] })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ s.jsxs(
              "button",
              {
                onClick: () => F(p, "is_featured"),
                className: `flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${p.is_featured ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"}`,
                children: [
                  /* @__PURE__ */ s.jsx(er, { className: "w-3 h-3" }),
                  "Featured"
                ]
              }
            ),
            /* @__PURE__ */ s.jsx(
              "button",
              {
                onClick: () => F(p, "is_premium"),
                className: `flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${p.is_premium ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"}`,
                children: "Premium"
              }
            ),
            /* @__PURE__ */ s.jsx(
              "button",
              {
                onClick: () => F(p, "is_free"),
                className: `flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${p.is_free ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"}`,
                children: "Free"
              }
            )
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "flex items-center justify-between pt-3 border-t border-border", children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ s.jsxs(
              "button",
              {
                onClick: () => I(p),
                className: "text-primary hover:text-primary-dark flex items-center gap-2 text-sm font-medium",
                children: [
                  /* @__PURE__ */ s.jsx(fs, { className: "w-4 h-4" }),
                  "Edit"
                ]
              }
            ),
            /* @__PURE__ */ s.jsxs(
              "button",
              {
                onClick: () => {
                  E(p), u("chapters"), b(p.id);
                },
                className: "text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm font-medium",
                children: [
                  /* @__PURE__ */ s.jsx(bt, { className: "w-4 h-4" }),
                  "Chapters (",
                  p.chapters_count || 0,
                  ")"
                ]
              }
            ),
            /* @__PURE__ */ s.jsxs(
              "button",
              {
                onClick: () => O(p),
                className: "text-red-500 hover:text-red-600 flex items-center gap-2 text-sm font-medium",
                children: [
                  /* @__PURE__ */ s.jsx(Cs, { className: "w-4 h-4" }),
                  "Delete"
                ]
              }
            )
          ] }) })
        ] }),
        p.cover_image_url && /* @__PURE__ */ s.jsx("div", { className: "ml-4 flex-shrink-0", children: /* @__PURE__ */ s.jsx(
          "img",
          {
            src: p.cover_image_url,
            alt: p.title,
            className: "w-16 h-20 object-cover rounded-lg border border-border"
          }
        ) })
      ] }) }, p.id);
    }) }) }),
    c === "chapters" && /* @__PURE__ */ s.jsxs("div", { className: "space-y-4", children: [
      D && /* @__PURE__ */ s.jsx("div", { className: "bg-primary/5 border border-primary/20 rounded-xl p-4", children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ s.jsxs("div", { children: [
          /* @__PURE__ */ s.jsxs("h3", { className: "font-semibold text-foreground", children: [
            "Chapters for: ",
            D.title
          ] }),
          /* @__PURE__ */ s.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            H.length,
            " chapters • ",
            H.filter((p) => p.is_published).length,
            " published"
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs(
          "button",
          {
            onClick: () => $(!0),
            className: "bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2",
            children: [
              /* @__PURE__ */ s.jsx(vt, { className: "w-4 h-4" }),
              "Add Chapter"
            ]
          }
        )
      ] }) }),
      H.length === 0 ? /* @__PURE__ */ s.jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ s.jsx(Ue, { className: "w-16 h-16 text-muted-foreground mx-auto mb-4" }),
        /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "No chapters found" }),
        /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground mb-4", children: D ? `No chapters uploaded for "${D.title}" yet` : "Select a work to view its chapters or upload new content" })
      ] }) : /* @__PURE__ */ s.jsx("div", { className: "grid gap-3", children: H.sort((p, R) => p.chapter_number - R.chapter_number).map((p) => /* @__PURE__ */ s.jsxs("div", { className: "bg-card border border-border rounded-lg p-4 flex items-center justify-between", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ s.jsxs("span", { className: "text-sm font-mono text-muted-foreground", children: [
              "Ch. ",
              p.chapter_number
            ] }),
            /* @__PURE__ */ s.jsx("h4", { className: "font-medium text-foreground", children: p.title }),
            /* @__PURE__ */ s.jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${p.is_published ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400"}`, children: p.is_published ? "Published" : "Draft" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-4 mt-2 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ s.jsxs("span", { children: [
              "Updated ",
              w(p.updated_at)
            ] }),
            p.word_count && /* @__PURE__ */ s.jsxs("span", { children: [
              p.word_count.toLocaleString(),
              " words"
            ] }),
            p.estimated_read_time && /* @__PURE__ */ s.jsxs("span", { children: [
              p.estimated_read_time,
              " min read"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ s.jsx(
            "button",
            {
              onClick: () => L(p),
              className: `p-2 rounded-lg transition-colors ${p.is_published ? "text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"}`,
              title: p.is_published ? "Unpublish chapter" : "Publish chapter",
              children: p.is_published ? /* @__PURE__ */ s.jsx(ot, { className: "w-4 h-4" }) : /* @__PURE__ */ s.jsx(ea, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ s.jsx("button", { className: "p-2 text-primary hover:bg-primary/10 rounded-lg", children: /* @__PURE__ */ s.jsx(fs, { className: "w-4 h-4" }) })
        ] })
      ] }, p.id)) })
    ] }),
    S && /* @__PURE__ */ s.jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ s.jsxs("div", { className: "bg-background rounded-xl shadow-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between p-6 border-b border-border", children: [
        /* @__PURE__ */ s.jsx("h2", { className: "text-xl font-semibold text-foreground", children: j ? "Edit Work" : "Create New Work" }),
        /* @__PURE__ */ s.jsx(
          "button",
          {
            onClick: () => {
              v(!1), y();
            },
            className: "text-muted-foreground hover:text-foreground",
            children: /* @__PURE__ */ s.jsx(Se, { className: "w-6 h-6" })
          }
        )
      ] }),
      /* @__PURE__ */ s.jsxs("form", { onSubmit: Q, className: "p-6 space-y-6", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ s.jsxs("div", { children: [
            /* @__PURE__ */ s.jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Title *" }),
            /* @__PURE__ */ s.jsx(
              "input",
              {
                type: "text",
                required: !0,
                value: T.title,
                onChange: (p) => N({ ...T, title: p.target.value }),
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
                onChange: (p) => N({ ...T, type: p.target.value }),
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
              onChange: (p) => N({ ...T, description: p.target.value }),
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
                onChange: (p) => N({ ...T, status: p.target.value }),
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
                onChange: (p) => N({ ...T, progress_percentage: parseInt(p.target.value) || 0 }),
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
                onChange: (p) => N({ ...T, release_date: p.target.value }),
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
                onChange: (p) => N({ ...T, estimated_release: p.target.value }),
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
              onChange: (p) => N({ ...T, cover_image_url: p.target.value }),
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
              onChange: (p) => N({ ...T, target_word_count: p.target.value ? parseInt(p.target.value) : void 0 }),
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
                onChange: (p) => N({ ...T, is_featured: p.target.checked }),
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
                onChange: (p) => N({ ...T, is_premium: p.target.checked }),
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
                onChange: (p) => N({ ...T, is_free: p.target.checked }),
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
                v(!1), y();
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
                /* @__PURE__ */ s.jsx(ta, { className: "w-4 h-4" }),
                j ? "Update Work" : "Create Work"
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    z && /* @__PURE__ */ s.jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ s.jsx("div", { className: "bg-background rounded-xl shadow-xl border border-border max-w-md w-full", children: /* @__PURE__ */ s.jsxs("div", { className: "p-6 text-center", children: [
      /* @__PURE__ */ s.jsx(Ye, { className: "w-16 h-16 text-primary mx-auto mb-4" }),
      /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-semibold text-foreground mb-2", children: "Chapter Upload" }),
      /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground mb-4", children: "Use the existing Chapter Upload page or integrate the upload functionality here." }),
      /* @__PURE__ */ s.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ s.jsx(
          "button",
          {
            onClick: () => {
              $(!1), window.open("/account/admin/media", "_blank");
            },
            className: "flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors",
            children: "Go to Upload Page"
          }
        ),
        /* @__PURE__ */ s.jsx(
          "button",
          {
            onClick: () => $(!1),
            className: "flex-1 bg-gray-200 dark:bg-gray-700 text-foreground px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors",
            children: "Close"
          }
        )
      ] })
    ] }) }) })
  ] });
}, Yg = () => {
  const [e, t] = C("upload"), [r, n] = C("chapter"), [i, o] = C([]), [a, l] = C([]), [c, u] = C(!1), [d, h] = C(null), [m, g] = C(null), [x, k] = C(""), [S, v] = C("all"), [j, P] = C(null), [D, E] = C(!1), [z, $] = C({}), [T, N] = C({
    work_id: "",
    chapter_title: "",
    chapter_number: 1,
    is_published: !1
  });
  le(() => {
    A(), b();
  }, []);
  const A = async () => {
    try {
      const w = await fetch("/api/admin/works");
      if (w.ok) {
        const p = await w.json();
        o(p.works || []);
      }
    } catch (w) {
      console.error("Failed to fetch works:", w);
    }
  }, b = async () => {
    try {
      u(!0);
      const w = await fetch("/api/admin/media");
      if (w.ok) {
        const p = await w.json();
        l(p.files || []);
      }
    } catch {
      h("Failed to fetch media files");
    } finally {
      u(!1);
    }
  }, V = (w) => {
    w.target.files && P(w.target.files);
  }, H = (w) => {
    w.preventDefault(), w.stopPropagation(), w.type === "dragenter" || w.type === "dragover" ? E(!0) : w.type === "dragleave" && E(!1);
  }, Q = (w) => {
    w.preventDefault(), w.stopPropagation(), E(!1), w.dataTransfer.files && w.dataTransfer.files[0] && P(w.dataTransfer.files);
  }, y = async () => {
    var w, p;
    if (!j || j.length === 0) {
      h("Please select a file to upload");
      return;
    }
    if (!T.work_id || !T.chapter_title) {
      h("Please fill in all required chapter information");
      return;
    }
    u(!0), h(null), g(null);
    try {
      const R = new FormData();
      R.append("file", j[0]), R.append("title", T.chapter_title), R.append("chapter_number", T.chapter_number.toString()), R.append("book_id", T.work_id), R.append("is_published", T.is_published.toString());
      const { data: { session: G }, error: oe } = await ((p = (w = window.supabase) == null ? void 0 : w.auth) == null ? void 0 : p.getSession());
      if (oe || !G)
        throw new Error("User session not found. Please log in.");
      const ye = await fetch("/api/chapters/upload", {
        method: "POST",
        body: R,
        headers: {
          Authorization: `Bearer ${G.access_token}`
        }
      });
      if (!ye.ok) {
        const Ce = await ye.json();
        throw new Error(Ce.message || Ce.error || "Failed to upload chapter.");
      }
      const Ke = await ye.json();
      g(`Chapter "${T.chapter_title}" uploaded successfully!`), P(null), N({
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
  }, I = async () => {
    if (!j || j.length === 0) {
      h("Please select files to upload");
      return;
    }
    u(!0), h(null), g(null);
    try {
      const w = Array.from(j).map(async (p, R) => {
        const G = new FormData();
        G.append("file", p), G.append("type", "media");
        const oe = await fetch("/api/admin/media/upload", {
          method: "POST",
          body: G
        });
        if (!oe.ok)
          throw new Error(`Failed to upload ${p.name}`);
        return oe.json();
      });
      await Promise.all(w), g(`Successfully uploaded ${j.length} file(s)`), P(null), await b();
    } catch (w) {
      h(w instanceof Error ? w.message : "Failed to upload files");
    } finally {
      u(!1);
    }
  }, O = async (w) => {
    if (confirm("Are you sure you want to delete this file?"))
      try {
        if (!(await fetch(`/api/admin/media/${w}`, {
          method: "DELETE"
        })).ok)
          throw new Error("Failed to delete file");
        g("File deleted successfully"), await b();
      } catch (p) {
        h(p instanceof Error ? p.message : "Failed to delete file");
      }
  }, F = a.filter((w) => {
    var G;
    const p = w.filename.toLowerCase().includes(x.toLowerCase()) || ((G = w.chapter_title) == null ? void 0 : G.toLowerCase().includes(x.toLowerCase()));
    let R = !0;
    if (S !== "all")
      switch (S) {
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
    return p && R;
  }), L = (w) => w.work_id && w.chapter_number ? /* @__PURE__ */ s.jsx(Be, { className: "w-5 h-5 text-blue-600" }) : w.file_type.startsWith("image/") ? /* @__PURE__ */ s.jsx(_n, { className: "w-5 h-5 text-green-600" }) : w.file_type.startsWith("video/") ? /* @__PURE__ */ s.jsx(Ol, { className: "w-5 h-5 text-purple-600" }) : w.file_type.startsWith("audio/") ? /* @__PURE__ */ s.jsx(Yl, { className: "w-5 h-5 text-pink-600" }) : /* @__PURE__ */ s.jsx(Ue, { className: "w-5 h-5 text-gray-600" }), se = (w) => {
    if (w === 0) return "0 Bytes";
    const p = 1024, R = ["Bytes", "KB", "MB", "GB"], G = Math.floor(Math.log(w) / Math.log(p));
    return parseFloat((w / Math.pow(p, G)).toFixed(2)) + " " + R[G];
  }, ge = (w) => new Date(w).toLocaleDateString("en-US", {
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
          /* @__PURE__ */ s.jsx(Ye, { className: "w-8 h-8 text-primary" }),
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
    m && /* @__PURE__ */ s.jsxs("div", { className: "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ s.jsx(wt, { className: "w-5 h-5 text-green-500 flex-shrink-0" }),
      /* @__PURE__ */ s.jsx("span", { className: "text-green-700 dark:text-green-400", children: m }),
      /* @__PURE__ */ s.jsx(
        "button",
        {
          onClick: () => g(null),
          className: "ml-auto text-green-500 hover:text-green-600",
          children: /* @__PURE__ */ s.jsx(Se, { className: "w-5 h-5" })
        }
      )
    ] }),
    d && /* @__PURE__ */ s.jsxs("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ s.jsx($t, { className: "w-5 h-5 text-red-500 flex-shrink-0" }),
      /* @__PURE__ */ s.jsx("span", { className: "text-red-700 dark:text-red-400", children: d }),
      /* @__PURE__ */ s.jsx(
        "button",
        {
          onClick: () => h(null),
          className: "ml-auto text-red-500 hover:text-red-600",
          children: /* @__PURE__ */ s.jsx(Se, { className: "w-5 h-5" })
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
              /* @__PURE__ */ s.jsx(Be, { className: "w-4 h-4 inline mr-2" }),
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
              /* @__PURE__ */ s.jsx(_n, { className: "w-4 h-4 inline mr-2" }),
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
                onChange: (w) => N({ ...T, work_id: w.target.value }),
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
                onChange: (w) => N({ ...T, chapter_number: parseInt(w.target.value) || 1 }),
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
              onChange: (w) => N({ ...T, chapter_title: w.target.value }),
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
              onChange: (w) => N({ ...T, is_published: w.target.checked }),
              className: "w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            }
          ),
          /* @__PURE__ */ s.jsx("label", { htmlFor: "is_published", className: "ml-2 text-sm font-medium text-foreground", children: "Publish immediately (subscribers will get access)" })
        ] }) }),
        /* @__PURE__ */ s.jsxs(
          "div",
          {
            className: `border-2 border-dashed rounded-xl p-8 text-center transition-colors ${D ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5"}`,
            onDragEnter: H,
            onDragLeave: H,
            onDragOver: H,
            onDrop: Q,
            children: [
              /* @__PURE__ */ s.jsx(Ye, { className: "w-12 h-12 text-primary mx-auto mb-4" }),
              /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "Drop chapter file here or click to browse" }),
              /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground mb-4", children: "Supported formats: PDF, DOCX, TXT, HTML" }),
              /* @__PURE__ */ s.jsx(
                "input",
                {
                  type: "file",
                  onChange: V,
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
                    /* @__PURE__ */ s.jsx(vt, { className: "w-4 h-4" }),
                    "Choose File"
                  ]
                }
              )
            ]
          }
        ),
        j && /* @__PURE__ */ s.jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ s.jsx("h4", { className: "font-medium text-foreground mb-2", children: "Selected File:" }),
          Array.from(j).map((w, p) => /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ s.jsx(Ue, { className: "w-4 h-4 text-gray-500" }),
              /* @__PURE__ */ s.jsx("span", { className: "text-sm font-medium", children: w.name }),
              /* @__PURE__ */ s.jsx("span", { className: "text-xs text-muted-foreground", children: se(w.size) })
            ] }),
            /* @__PURE__ */ s.jsx(
              "button",
              {
                onClick: () => P(null),
                className: "text-red-500 hover:text-red-600",
                children: /* @__PURE__ */ s.jsx(Se, { className: "w-4 h-4" })
              }
            )
          ] }, p))
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ s.jsx(
          "button",
          {
            onClick: y,
            disabled: c || !j || !T.work_id || !T.chapter_title,
            className: "bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
            children: c ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx(Pe, { className: "w-4 h-4 animate-spin" }),
              "Uploading Chapter..."
            ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx(Ye, { className: "w-4 h-4" }),
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
            onDragEnter: H,
            onDragLeave: H,
            onDragOver: H,
            onDrop: Q,
            children: [
              /* @__PURE__ */ s.jsx(Ye, { className: "w-12 h-12 text-primary mx-auto mb-4" }),
              /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "Drop files here or click to browse" }),
              /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground mb-4", children: "Images, videos, documents, and other media files" }),
              /* @__PURE__ */ s.jsx(
                "input",
                {
                  type: "file",
                  onChange: V,
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
                    /* @__PURE__ */ s.jsx(vt, { className: "w-4 h-4" }),
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
          /* @__PURE__ */ s.jsx("div", { className: "space-y-2 max-h-40 overflow-y-auto", children: Array.from(j).map((w, p) => /* @__PURE__ */ s.jsx("div", { className: "flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg", children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ s.jsx(Fl, { className: "w-4 h-4 text-gray-500" }),
            /* @__PURE__ */ s.jsx("span", { className: "text-sm font-medium", children: w.name }),
            /* @__PURE__ */ s.jsx("span", { className: "text-xs text-muted-foreground", children: se(w.size) })
          ] }) }, p)) })
        ] }),
        /* @__PURE__ */ s.jsx("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ s.jsx(
          "button",
          {
            onClick: I,
            disabled: c || !j,
            className: "bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
            children: c ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx(Pe, { className: "w-4 h-4 animate-spin" }),
              "Uploading Files..."
            ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
              /* @__PURE__ */ s.jsx(Ye, { className: "w-4 h-4" }),
              "Upload Files"
            ] })
          }
        ) })
      ] })
    ] }),
    e === "library" && /* @__PURE__ */ s.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ s.jsx(lt, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
          /* @__PURE__ */ s.jsx(
            "input",
            {
              type: "text",
              placeholder: "Search files...",
              value: x,
              onChange: (w) => k(w.target.value),
              className: "w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            }
          )
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ s.jsx(Zt, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" }),
          /* @__PURE__ */ s.jsxs(
            "select",
            {
              value: S,
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
            children: /* @__PURE__ */ s.jsx(Pe, { className: "w-4 h-4" })
          }
        )
      ] }),
      c ? /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-center py-12", children: [
        /* @__PURE__ */ s.jsx(Pe, { className: "w-8 h-8 animate-spin text-primary" }),
        /* @__PURE__ */ s.jsx("span", { className: "ml-3", children: "Loading files..." })
      ] }) : F.length === 0 ? /* @__PURE__ */ s.jsxs("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ s.jsx(Vl, { className: "w-16 h-16 text-muted-foreground mx-auto mb-4" }),
        /* @__PURE__ */ s.jsx("h3", { className: "text-lg font-medium text-foreground mb-2", children: "No files found" }),
        /* @__PURE__ */ s.jsx("p", { className: "text-muted-foreground", children: x || S !== "all" ? "Try adjusting your search or filters" : "Upload your first file to get started" })
      ] }) : /* @__PURE__ */ s.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: F.map((w) => {
        var p;
        return /* @__PURE__ */ s.jsxs("div", { className: "bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow", children: [
          /* @__PURE__ */ s.jsx("div", { className: "aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center", children: w.thumbnail_url ? /* @__PURE__ */ s.jsx(
            "img",
            {
              src: w.thumbnail_url,
              alt: w.filename,
              className: "w-full h-full object-cover rounded-lg"
            }
          ) : /* @__PURE__ */ s.jsxs("div", { className: "text-center", children: [
            L(w),
            /* @__PURE__ */ s.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: (p = w.file_type.split("/")[1]) == null ? void 0 : p.toUpperCase() })
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
              /* @__PURE__ */ s.jsx("span", { children: se(w.file_size) }),
              /* @__PURE__ */ s.jsx("span", { children: ge(w.upload_date) })
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
                  children: /* @__PURE__ */ s.jsx(ot, { className: "w-4 h-4" })
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
                  children: /* @__PURE__ */ s.jsx(Il, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ s.jsx(
              "button",
              {
                onClick: () => O(w.id),
                className: "p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors",
                title: "Delete file",
                children: /* @__PURE__ */ s.jsx(Cs, { className: "w-4 h-4" })
              }
            )
          ] })
        ] }, w.id);
      }) })
    ] })
  ] });
};
var aa = "basil", qc = function(t) {
  return t === 3 ? "v3" : t;
}, oa = "https://js.stripe.com", Gc = "".concat(oa, "/").concat(aa, "/stripe.js"), Kc = /^https:\/\/js\.stripe\.com\/v3\/?(\?.*)?$/, Xc = /^https:\/\/js\.stripe\.com\/(v3|[a-z]+)\/stripe\.js(\?.*)?$/;
var Zc = function(t) {
  return Kc.test(t) || Xc.test(t);
}, Jc = function() {
  for (var t = document.querySelectorAll('script[src^="'.concat(oa, '"]')), r = 0; r < t.length; r++) {
    var n = t[r];
    if (Zc(n.src))
      return n;
  }
  return null;
}, Rn = function(t) {
  var r = "", n = document.createElement("script");
  n.src = "".concat(Gc).concat(r);
  var i = document.head || document.body;
  if (!i)
    throw new Error("Expected document.body not to be null. Stripe.js requires a <body> element.");
  return i.appendChild(n), n;
}, Qc = function(t, r) {
  !t || !t._registerWrapper || t._registerWrapper({
    name: "stripe-js",
    version: "7.9.0",
    startTime: r
  });
}, Et = null, os = null, ls = null, ed = function(t) {
  return function(r) {
    t(new Error("Failed to load Stripe.js", {
      cause: r
    }));
  };
}, td = function(t, r) {
  return function() {
    window.Stripe ? t(window.Stripe) : r(new Error("Stripe.js not available"));
  };
}, sd = function(t) {
  return Et !== null ? Et : (Et = new Promise(function(r, n) {
    if (typeof window > "u" || typeof document > "u") {
      r(null);
      return;
    }
    if (window.Stripe) {
      r(window.Stripe);
      return;
    }
    try {
      var i = Jc();
      if (!(i && t)) {
        if (!i)
          i = Rn(t);
        else if (i && ls !== null && os !== null) {
          var o;
          i.removeEventListener("load", ls), i.removeEventListener("error", os), (o = i.parentNode) === null || o === void 0 || o.removeChild(i), i = Rn(t);
        }
      }
      ls = td(r, n), os = ed(n), i.addEventListener("load", ls), i.addEventListener("error", os);
    } catch (a) {
      n(a);
      return;
    }
  }), Et.catch(function(r) {
    return Et = null, Promise.reject(r);
  }));
}, rd = function(t, r, n) {
  if (t === null)
    return null;
  var i = r[0], o = i.match(/^pk_test/), a = qc(t.version), l = aa;
  o && a !== l && console.warn("Stripe.js@".concat(a, " was loaded on the page, but @stripe/stripe-js@").concat("7.9.0", " expected Stripe.js@").concat(l, ". This may result in unexpected behavior. For more information, see https://docs.stripe.com/sdks/stripejs-versioning"));
  var c = t.apply(void 0, r);
  return Qc(c, n), c;
}, Mt, la = !1, ca = function() {
  return Mt || (Mt = sd(null).catch(function(t) {
    return Mt = null, Promise.reject(t);
  }), Mt);
};
Promise.resolve().then(function() {
  return ca();
}).catch(function(e) {
  la || console.warn(e);
});
var nd = function() {
  for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
    r[n] = arguments[n];
  la = !0;
  var i = Date.now();
  return ca().then(function(o) {
    return rd(o, r, i);
  });
};
const id = qe(void 0), Cr = () => {
  const e = ue(id);
  if (e === void 0)
    throw new Error("useAuth must be used within an AuthProvider");
  return e;
}, da = qe({});
function ad(e) {
  const t = ze(null);
  return t.current === null && (t.current = e()), t.current;
}
const Pr = typeof window < "u", od = Pr ? fl : le, Ar = /* @__PURE__ */ qe(null);
function Er(e, t) {
  e.indexOf(t) === -1 && e.push(t);
}
function Mr(e, t) {
  const r = e.indexOf(t);
  r > -1 && e.splice(r, 1);
}
const Re = (e, t, r) => r > t ? t : r < e ? e : r;
function sr(e, t) {
  return t ? `${e}. For more information and steps for solving, visit https://motion.dev/troubleshooting/${t}` : e;
}
let kt = () => {
}, Le = () => {
};
process.env.NODE_ENV !== "production" && (kt = (e, t, r) => {
  !e && typeof console < "u" && console.warn(sr(t, r));
}, Le = (e, t, r) => {
  if (!e)
    throw new Error(sr(t, r));
});
const Fe = {}, ua = (e) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e);
function ha(e) {
  return typeof e == "object" && e !== null;
}
const ma = (e) => /^0[^.\s]+$/u.test(e);
// @__NO_SIDE_EFFECTS__
function Dr(e) {
  let t;
  return () => (t === void 0 && (t = e()), t);
}
const ke = /* @__NO_SIDE_EFFECTS__ */ (e) => e, ld = (e, t) => (r) => t(e(r)), Jt = (...e) => e.reduce(ld), Wt = /* @__NO_SIDE_EFFECTS__ */ (e, t, r) => {
  const n = t - e;
  return n === 0 ? 1 : (r - e) / n;
};
class Rr {
  constructor() {
    this.subscriptions = [];
  }
  add(t) {
    return Er(this.subscriptions, t), () => Mr(this.subscriptions, t);
  }
  notify(t, r, n) {
    const i = this.subscriptions.length;
    if (i)
      if (i === 1)
        this.subscriptions[0](t, r, n);
      else
        for (let o = 0; o < i; o++) {
          const a = this.subscriptions[o];
          a && a(t, r, n);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const _e = /* @__NO_SIDE_EFFECTS__ */ (e) => e * 1e3, Ae = /* @__NO_SIDE_EFFECTS__ */ (e) => e / 1e3;
function fa(e, t) {
  return t ? e * (1e3 / t) : 0;
}
const Ln = /* @__PURE__ */ new Set();
function Lr(e, t, r) {
  e || Ln.has(t) || (console.warn(sr(t, r)), Ln.add(t));
}
const ga = (e, t, r) => (((1 - 3 * r + 3 * t) * e + (3 * r - 6 * t)) * e + 3 * t) * e, cd = 1e-7, dd = 12;
function ud(e, t, r, n, i) {
  let o, a, l = 0;
  do
    a = t + (r - t) / 2, o = ga(a, n, i) - e, o > 0 ? r = a : t = a;
  while (Math.abs(o) > cd && ++l < dd);
  return a;
}
function Qt(e, t, r, n) {
  if (e === t && r === n)
    return ke;
  const i = (o) => ud(o, 0, 1, e, r);
  return (o) => o === 0 || o === 1 ? o : ga(i(o), t, n);
}
const pa = (e) => (t) => t <= 0.5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2, xa = (e) => (t) => 1 - e(1 - t), ya = /* @__PURE__ */ Qt(0.33, 1.53, 0.69, 0.99), Fr = /* @__PURE__ */ xa(ya), ba = /* @__PURE__ */ pa(Fr), va = (e) => (e *= 2) < 1 ? 0.5 * Fr(e) : 0.5 * (2 - Math.pow(2, -10 * (e - 1))), Vr = (e) => 1 - Math.sin(Math.acos(e)), wa = xa(Vr), ja = pa(Vr), hd = /* @__PURE__ */ Qt(0.42, 0, 1, 1), md = /* @__PURE__ */ Qt(0, 0, 0.58, 1), Na = /* @__PURE__ */ Qt(0.42, 0, 0.58, 1), fd = (e) => Array.isArray(e) && typeof e[0] != "number", ka = (e) => Array.isArray(e) && typeof e[0] == "number", Fn = {
  linear: ke,
  easeIn: hd,
  easeInOut: Na,
  easeOut: md,
  circIn: Vr,
  circInOut: ja,
  circOut: wa,
  backIn: Fr,
  backInOut: ba,
  backOut: ya,
  anticipate: va
}, gd = (e) => typeof e == "string", Vn = (e) => {
  if (ka(e)) {
    Le(e.length === 4, "Cubic bezier arrays must contain four numerical values.", "cubic-bezier-length");
    const [t, r, n, i] = e;
    return Qt(t, r, n, i);
  } else if (gd(e))
    return Le(Fn[e] !== void 0, `Invalid easing type '${e}'`, "invalid-easing-type"), Fn[e];
  return e;
}, cs = [
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
function pd(e, t) {
  let r = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), i = !1, o = !1;
  const a = /* @__PURE__ */ new WeakSet();
  let l = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  };
  function c(d) {
    a.has(d) && (u.schedule(d), e()), d(l);
  }
  const u = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (d, h = !1, m = !1) => {
      const x = m && i ? r : n;
      return h && a.add(d), x.has(d) || x.add(d), d;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (d) => {
      n.delete(d), a.delete(d);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (d) => {
      if (l = d, i) {
        o = !0;
        return;
      }
      i = !0, [r, n] = [n, r], r.forEach(c), r.clear(), i = !1, o && (o = !1, u.process(d));
    }
  };
  return u;
}
const xd = 40;
function Ta(e, t) {
  let r = !1, n = !0;
  const i = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, o = () => r = !0, a = cs.reduce((P, D) => (P[D] = pd(o), P), {}), { setup: l, read: c, resolveKeyframes: u, preUpdate: d, update: h, preRender: m, render: g, postRender: x } = a, k = () => {
    const P = Fe.useManualTiming ? i.timestamp : performance.now();
    r = !1, Fe.useManualTiming || (i.delta = n ? 1e3 / 60 : Math.max(Math.min(P - i.timestamp, xd), 1)), i.timestamp = P, i.isProcessing = !0, l.process(i), c.process(i), u.process(i), d.process(i), h.process(i), m.process(i), g.process(i), x.process(i), i.isProcessing = !1, r && t && (n = !1, e(k));
  }, S = () => {
    r = !0, n = !0, i.isProcessing || e(k);
  };
  return { schedule: cs.reduce((P, D) => {
    const E = a[D];
    return P[D] = (z, $ = !1, T = !1) => (r || S(), E.schedule(z, $, T)), P;
  }, {}), cancel: (P) => {
    for (let D = 0; D < cs.length; D++)
      a[cs[D]].cancel(P);
  }, state: i, steps: a };
}
const { schedule: J, cancel: We, state: ce, steps: Vs } = /* @__PURE__ */ Ta(typeof requestAnimationFrame < "u" ? requestAnimationFrame : ke, !0);
let ps;
function yd() {
  ps = void 0;
}
const xe = {
  now: () => (ps === void 0 && xe.set(ce.isProcessing || Fe.useManualTiming ? ce.timestamp : performance.now()), ps),
  set: (e) => {
    ps = e, queueMicrotask(yd);
  }
}, Sa = (e) => (t) => typeof t == "string" && t.startsWith(e), Ir = /* @__PURE__ */ Sa("--"), bd = /* @__PURE__ */ Sa("var(--"), Or = (e) => bd(e) ? vd.test(e.split("/*")[0].trim()) : !1, vd = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu, Tt = {
  test: (e) => typeof e == "number",
  parse: parseFloat,
  transform: (e) => e
}, Ht = {
  ...Tt,
  transform: (e) => Re(0, 1, e)
}, ds = {
  ...Tt,
  default: 1
}, It = (e) => Math.round(e * 1e5) / 1e5, Yr = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function wd(e) {
  return e == null;
}
const jd = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, Br = (e, t) => (r) => !!(typeof r == "string" && jd.test(r) && r.startsWith(e) || t && !wd(r) && Object.prototype.hasOwnProperty.call(r, t)), _a = (e, t, r) => (n) => {
  if (typeof n != "string")
    return n;
  const [i, o, a, l] = n.match(Yr);
  return {
    [e]: parseFloat(i),
    [t]: parseFloat(o),
    [r]: parseFloat(a),
    alpha: l !== void 0 ? parseFloat(l) : 1
  };
}, Nd = (e) => Re(0, 255, e), Is = {
  ...Tt,
  transform: (e) => Math.round(Nd(e))
}, tt = {
  test: /* @__PURE__ */ Br("rgb", "red"),
  parse: /* @__PURE__ */ _a("red", "green", "blue"),
  transform: ({ red: e, green: t, blue: r, alpha: n = 1 }) => "rgba(" + Is.transform(e) + ", " + Is.transform(t) + ", " + Is.transform(r) + ", " + It(Ht.transform(n)) + ")"
};
function kd(e) {
  let t = "", r = "", n = "", i = "";
  return e.length > 5 ? (t = e.substring(1, 3), r = e.substring(3, 5), n = e.substring(5, 7), i = e.substring(7, 9)) : (t = e.substring(1, 2), r = e.substring(2, 3), n = e.substring(3, 4), i = e.substring(4, 5), t += t, r += r, n += n, i += i), {
    red: parseInt(t, 16),
    green: parseInt(r, 16),
    blue: parseInt(n, 16),
    alpha: i ? parseInt(i, 16) / 255 : 1
  };
}
const rr = {
  test: /* @__PURE__ */ Br("#"),
  parse: kd,
  transform: tt.transform
}, es = /* @__NO_SIDE_EFFECTS__ */ (e) => ({
  test: (t) => typeof t == "string" && t.endsWith(e) && t.split(" ").length === 1,
  parse: parseFloat,
  transform: (t) => `${t}${e}`
}), Oe = /* @__PURE__ */ es("deg"), Ee = /* @__PURE__ */ es("%"), Y = /* @__PURE__ */ es("px"), Td = /* @__PURE__ */ es("vh"), Sd = /* @__PURE__ */ es("vw"), In = {
  ...Ee,
  parse: (e) => Ee.parse(e) / 100,
  transform: (e) => Ee.transform(e * 100)
}, ht = {
  test: /* @__PURE__ */ Br("hsl", "hue"),
  parse: /* @__PURE__ */ _a("hue", "saturation", "lightness"),
  transform: ({ hue: e, saturation: t, lightness: r, alpha: n = 1 }) => "hsla(" + Math.round(e) + ", " + Ee.transform(It(t)) + ", " + Ee.transform(It(r)) + ", " + It(Ht.transform(n)) + ")"
}, ae = {
  test: (e) => tt.test(e) || rr.test(e) || ht.test(e),
  parse: (e) => tt.test(e) ? tt.parse(e) : ht.test(e) ? ht.parse(e) : rr.parse(e),
  transform: (e) => typeof e == "string" ? e : e.hasOwnProperty("red") ? tt.transform(e) : ht.transform(e),
  getAnimatableNone: (e) => {
    const t = ae.parse(e);
    return t.alpha = 0, ae.transform(t);
  }
}, _d = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function Cd(e) {
  var t, r;
  return isNaN(e) && typeof e == "string" && (((t = e.match(Yr)) == null ? void 0 : t.length) || 0) + (((r = e.match(_d)) == null ? void 0 : r.length) || 0) > 0;
}
const Ca = "number", Pa = "color", Pd = "var", Ad = "var(", On = "${}", Ed = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function qt(e) {
  const t = e.toString(), r = [], n = {
    color: [],
    number: [],
    var: []
  }, i = [];
  let o = 0;
  const l = t.replace(Ed, (c) => (ae.test(c) ? (n.color.push(o), i.push(Pa), r.push(ae.parse(c))) : c.startsWith(Ad) ? (n.var.push(o), i.push(Pd), r.push(c)) : (n.number.push(o), i.push(Ca), r.push(parseFloat(c))), ++o, On)).split(On);
  return { values: r, split: l, indexes: n, types: i };
}
function Aa(e) {
  return qt(e).values;
}
function Ea(e) {
  const { split: t, types: r } = qt(e), n = t.length;
  return (i) => {
    let o = "";
    for (let a = 0; a < n; a++)
      if (o += t[a], i[a] !== void 0) {
        const l = r[a];
        l === Ca ? o += It(i[a]) : l === Pa ? o += ae.transform(i[a]) : o += i[a];
      }
    return o;
  };
}
const Md = (e) => typeof e == "number" ? 0 : ae.test(e) ? ae.getAnimatableNone(e) : e;
function Dd(e) {
  const t = Aa(e);
  return Ea(e)(t.map(Md));
}
const He = {
  test: Cd,
  parse: Aa,
  createTransformer: Ea,
  getAnimatableNone: Dd
};
function Os(e, t, r) {
  return r < 0 && (r += 1), r > 1 && (r -= 1), r < 1 / 6 ? e + (t - e) * 6 * r : r < 1 / 2 ? t : r < 2 / 3 ? e + (t - e) * (2 / 3 - r) * 6 : e;
}
function Rd({ hue: e, saturation: t, lightness: r, alpha: n }) {
  e /= 360, t /= 100, r /= 100;
  let i = 0, o = 0, a = 0;
  if (!t)
    i = o = a = r;
  else {
    const l = r < 0.5 ? r * (1 + t) : r + t - r * t, c = 2 * r - l;
    i = Os(c, l, e + 1 / 3), o = Os(c, l, e), a = Os(c, l, e - 1 / 3);
  }
  return {
    red: Math.round(i * 255),
    green: Math.round(o * 255),
    blue: Math.round(a * 255),
    alpha: n
  };
}
function js(e, t) {
  return (r) => r > 0 ? t : e;
}
const te = (e, t, r) => e + (t - e) * r, Ys = (e, t, r) => {
  const n = e * e, i = r * (t * t - n) + n;
  return i < 0 ? 0 : Math.sqrt(i);
}, Ld = [rr, tt, ht], Fd = (e) => Ld.find((t) => t.test(e));
function Yn(e) {
  const t = Fd(e);
  if (kt(!!t, `'${e}' is not an animatable color. Use the equivalent color code instead.`, "color-not-animatable"), !t)
    return !1;
  let r = t.parse(e);
  return t === ht && (r = Rd(r)), r;
}
const Bn = (e, t) => {
  const r = Yn(e), n = Yn(t);
  if (!r || !n)
    return js(e, t);
  const i = { ...r };
  return (o) => (i.red = Ys(r.red, n.red, o), i.green = Ys(r.green, n.green, o), i.blue = Ys(r.blue, n.blue, o), i.alpha = te(r.alpha, n.alpha, o), tt.transform(i));
}, nr = /* @__PURE__ */ new Set(["none", "hidden"]);
function Vd(e, t) {
  return nr.has(e) ? (r) => r <= 0 ? e : t : (r) => r >= 1 ? t : e;
}
function Id(e, t) {
  return (r) => te(e, t, r);
}
function zr(e) {
  return typeof e == "number" ? Id : typeof e == "string" ? Or(e) ? js : ae.test(e) ? Bn : Bd : Array.isArray(e) ? Ma : typeof e == "object" ? ae.test(e) ? Bn : Od : js;
}
function Ma(e, t) {
  const r = [...e], n = r.length, i = e.map((o, a) => zr(o)(o, t[a]));
  return (o) => {
    for (let a = 0; a < n; a++)
      r[a] = i[a](o);
    return r;
  };
}
function Od(e, t) {
  const r = { ...e, ...t }, n = {};
  for (const i in r)
    e[i] !== void 0 && t[i] !== void 0 && (n[i] = zr(e[i])(e[i], t[i]));
  return (i) => {
    for (const o in n)
      r[o] = n[o](i);
    return r;
  };
}
function Yd(e, t) {
  const r = [], n = { color: 0, var: 0, number: 0 };
  for (let i = 0; i < t.values.length; i++) {
    const o = t.types[i], a = e.indexes[o][n[o]], l = e.values[a] ?? 0;
    r[i] = l, n[o]++;
  }
  return r;
}
const Bd = (e, t) => {
  const r = He.createTransformer(t), n = qt(e), i = qt(t);
  return n.indexes.var.length === i.indexes.var.length && n.indexes.color.length === i.indexes.color.length && n.indexes.number.length >= i.indexes.number.length ? nr.has(e) && !i.values.length || nr.has(t) && !n.values.length ? Vd(e, t) : Jt(Ma(Yd(n, i), i.values), r) : (kt(!0, `Complex values '${e}' and '${t}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`, "complex-values-different"), js(e, t));
};
function Da(e, t, r) {
  return typeof e == "number" && typeof t == "number" && typeof r == "number" ? te(e, t, r) : zr(e)(e, t);
}
const zd = (e) => {
  const t = ({ timestamp: r }) => e(r);
  return {
    start: (r = !0) => J.update(t, r),
    stop: () => We(t),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => ce.isProcessing ? ce.timestamp : xe.now()
  };
}, Ra = (e, t, r = 10) => {
  let n = "";
  const i = Math.max(Math.round(t / r), 2);
  for (let o = 0; o < i; o++)
    n += Math.round(e(o / (i - 1)) * 1e4) / 1e4 + ", ";
  return `linear(${n.substring(0, n.length - 2)})`;
}, Ns = 2e4;
function $r(e) {
  let t = 0;
  const r = 50;
  let n = e.next(t);
  for (; !n.done && t < Ns; )
    t += r, n = e.next(t);
  return t >= Ns ? 1 / 0 : t;
}
function $d(e, t = 100, r) {
  const n = r({ ...e, keyframes: [0, t] }), i = Math.min($r(n), Ns);
  return {
    type: "keyframes",
    ease: (o) => n.next(i * o).value / t,
    duration: /* @__PURE__ */ Ae(i)
  };
}
const Ud = 5;
function La(e, t, r) {
  const n = Math.max(t - Ud, 0);
  return fa(r - e(n), t - n);
}
const ee = {
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
function Wd({ duration: e = ee.duration, bounce: t = ee.bounce, velocity: r = ee.velocity, mass: n = ee.mass }) {
  let i, o;
  kt(e <= /* @__PURE__ */ _e(ee.maxDuration), "Spring duration must be 10 seconds or less", "spring-duration-limit");
  let a = 1 - t;
  a = Re(ee.minDamping, ee.maxDamping, a), e = Re(ee.minDuration, ee.maxDuration, /* @__PURE__ */ Ae(e)), a < 1 ? (i = (u) => {
    const d = u * a, h = d * e, m = d - r, g = ir(u, a), x = Math.exp(-h);
    return Bs - m / g * x;
  }, o = (u) => {
    const h = u * a * e, m = h * r + r, g = Math.pow(a, 2) * Math.pow(u, 2) * e, x = Math.exp(-h), k = ir(Math.pow(u, 2), a);
    return (-i(u) + Bs > 0 ? -1 : 1) * ((m - g) * x) / k;
  }) : (i = (u) => {
    const d = Math.exp(-u * e), h = (u - r) * e + 1;
    return -Bs + d * h;
  }, o = (u) => {
    const d = Math.exp(-u * e), h = (r - u) * (e * e);
    return d * h;
  });
  const l = 5 / e, c = qd(i, o, l);
  if (e = /* @__PURE__ */ _e(e), isNaN(c))
    return {
      stiffness: ee.stiffness,
      damping: ee.damping,
      duration: e
    };
  {
    const u = Math.pow(c, 2) * n;
    return {
      stiffness: u,
      damping: a * 2 * Math.sqrt(n * u),
      duration: e
    };
  }
}
const Hd = 12;
function qd(e, t, r) {
  let n = r;
  for (let i = 1; i < Hd; i++)
    n = n - e(n) / t(n);
  return n;
}
function ir(e, t) {
  return e * Math.sqrt(1 - t * t);
}
const Gd = ["duration", "bounce"], Kd = ["stiffness", "damping", "mass"];
function zn(e, t) {
  return t.some((r) => e[r] !== void 0);
}
function Xd(e) {
  let t = {
    velocity: ee.velocity,
    stiffness: ee.stiffness,
    damping: ee.damping,
    mass: ee.mass,
    isResolvedFromDuration: !1,
    ...e
  };
  if (!zn(e, Kd) && zn(e, Gd))
    if (e.visualDuration) {
      const r = e.visualDuration, n = 2 * Math.PI / (r * 1.2), i = n * n, o = 2 * Re(0.05, 1, 1 - (e.bounce || 0)) * Math.sqrt(i);
      t = {
        ...t,
        mass: ee.mass,
        stiffness: i,
        damping: o
      };
    } else {
      const r = Wd(e);
      t = {
        ...t,
        ...r,
        mass: ee.mass
      }, t.isResolvedFromDuration = !0;
    }
  return t;
}
function ks(e = ee.visualDuration, t = ee.bounce) {
  const r = typeof e != "object" ? {
    visualDuration: e,
    keyframes: [0, 1],
    bounce: t
  } : e;
  let { restSpeed: n, restDelta: i } = r;
  const o = r.keyframes[0], a = r.keyframes[r.keyframes.length - 1], l = { done: !1, value: o }, { stiffness: c, damping: u, mass: d, duration: h, velocity: m, isResolvedFromDuration: g } = Xd({
    ...r,
    velocity: -/* @__PURE__ */ Ae(r.velocity || 0)
  }), x = m || 0, k = u / (2 * Math.sqrt(c * d)), S = a - o, v = /* @__PURE__ */ Ae(Math.sqrt(c / d)), j = Math.abs(S) < 5;
  n || (n = j ? ee.restSpeed.granular : ee.restSpeed.default), i || (i = j ? ee.restDelta.granular : ee.restDelta.default);
  let P;
  if (k < 1) {
    const E = ir(v, k);
    P = (z) => {
      const $ = Math.exp(-k * v * z);
      return a - $ * ((x + k * v * S) / E * Math.sin(E * z) + S * Math.cos(E * z));
    };
  } else if (k === 1)
    P = (E) => a - Math.exp(-v * E) * (S + (x + v * S) * E);
  else {
    const E = v * Math.sqrt(k * k - 1);
    P = (z) => {
      const $ = Math.exp(-k * v * z), T = Math.min(E * z, 300);
      return a - $ * ((x + k * v * S) * Math.sinh(T) + E * S * Math.cosh(T)) / E;
    };
  }
  const D = {
    calculatedDuration: g && h || null,
    next: (E) => {
      const z = P(E);
      if (g)
        l.done = E >= h;
      else {
        let $ = E === 0 ? x : 0;
        k < 1 && ($ = E === 0 ? /* @__PURE__ */ _e(x) : La(P, E, z));
        const T = Math.abs($) <= n, N = Math.abs(a - z) <= i;
        l.done = T && N;
      }
      return l.value = l.done ? a : z, l;
    },
    toString: () => {
      const E = Math.min($r(D), Ns), z = Ra(($) => D.next(E * $).value, E, 30);
      return E + "ms " + z;
    },
    toTransition: () => {
    }
  };
  return D;
}
ks.applyToOptions = (e) => {
  const t = $d(e, 100, ks);
  return e.ease = t.ease, e.duration = /* @__PURE__ */ _e(t.duration), e.type = "keyframes", e;
};
function ar({ keyframes: e, velocity: t = 0, power: r = 0.8, timeConstant: n = 325, bounceDamping: i = 10, bounceStiffness: o = 500, modifyTarget: a, min: l, max: c, restDelta: u = 0.5, restSpeed: d }) {
  const h = e[0], m = {
    done: !1,
    value: h
  }, g = (T) => l !== void 0 && T < l || c !== void 0 && T > c, x = (T) => l === void 0 ? c : c === void 0 || Math.abs(l - T) < Math.abs(c - T) ? l : c;
  let k = r * t;
  const S = h + k, v = a === void 0 ? S : a(S);
  v !== S && (k = v - h);
  const j = (T) => -k * Math.exp(-T / n), P = (T) => v + j(T), D = (T) => {
    const N = j(T), A = P(T);
    m.done = Math.abs(N) <= u, m.value = m.done ? v : A;
  };
  let E, z;
  const $ = (T) => {
    g(m.value) && (E = T, z = ks({
      keyframes: [m.value, x(m.value)],
      velocity: La(P, T, m.value),
      // TODO: This should be passing * 1000
      damping: i,
      stiffness: o,
      restDelta: u,
      restSpeed: d
    }));
  };
  return $(0), {
    calculatedDuration: null,
    next: (T) => {
      let N = !1;
      return !z && E === void 0 && (N = !0, D(T), $(T)), E !== void 0 && T >= E ? z.next(T - E) : (!N && D(T), m);
    }
  };
}
function Zd(e, t, r) {
  const n = [], i = r || Fe.mix || Da, o = e.length - 1;
  for (let a = 0; a < o; a++) {
    let l = i(e[a], e[a + 1]);
    if (t) {
      const c = Array.isArray(t) ? t[a] || ke : t;
      l = Jt(c, l);
    }
    n.push(l);
  }
  return n;
}
function Jd(e, t, { clamp: r = !0, ease: n, mixer: i } = {}) {
  const o = e.length;
  if (Le(o === t.length, "Both input and output ranges must be the same length", "range-length"), o === 1)
    return () => t[0];
  if (o === 2 && t[0] === t[1])
    return () => t[1];
  const a = e[0] === e[1];
  e[0] > e[o - 1] && (e = [...e].reverse(), t = [...t].reverse());
  const l = Zd(t, n, i), c = l.length, u = (d) => {
    if (a && d < e[0])
      return t[0];
    let h = 0;
    if (c > 1)
      for (; h < e.length - 2 && !(d < e[h + 1]); h++)
        ;
    const m = /* @__PURE__ */ Wt(e[h], e[h + 1], d);
    return l[h](m);
  };
  return r ? (d) => u(Re(e[0], e[o - 1], d)) : u;
}
function Qd(e, t) {
  const r = e[e.length - 1];
  for (let n = 1; n <= t; n++) {
    const i = /* @__PURE__ */ Wt(0, t, n);
    e.push(te(r, 1, i));
  }
}
function eu(e) {
  const t = [0];
  return Qd(t, e.length - 1), t;
}
function tu(e, t) {
  return e.map((r) => r * t);
}
function su(e, t) {
  return e.map(() => t || Na).splice(0, e.length - 1);
}
function mt({ duration: e = 300, keyframes: t, times: r, ease: n = "easeInOut" }) {
  const i = fd(n) ? n.map(Vn) : Vn(n), o = {
    done: !1,
    value: t[0]
  }, a = tu(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    r && r.length === t.length ? r : eu(t),
    e
  ), l = Jd(a, t, {
    ease: Array.isArray(i) ? i : su(t, i)
  });
  return {
    calculatedDuration: e,
    next: (c) => (o.value = l(c), o.done = c >= e, o)
  };
}
const ru = (e) => e !== null;
function Ur(e, { repeat: t, repeatType: r = "loop" }, n, i = 1) {
  const o = e.filter(ru), l = i < 0 || t && r !== "loop" && t % 2 === 1 ? 0 : o.length - 1;
  return !l || n === void 0 ? o[l] : n;
}
const nu = {
  decay: ar,
  inertia: ar,
  tween: mt,
  keyframes: mt,
  spring: ks
};
function Fa(e) {
  typeof e.type == "string" && (e.type = nu[e.type]);
}
class Wr {
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
const iu = (e) => e / 100;
class Hr extends Wr {
  constructor(t) {
    super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.stop = () => {
      var n, i;
      const { motionValue: r } = this.options;
      r && r.updatedAt !== xe.now() && this.tick(xe.now()), this.isStopped = !0, this.state !== "idle" && (this.teardown(), (i = (n = this.options).onStop) == null || i.call(n));
    }, this.options = t, this.initAnimation(), this.play(), t.autoplay === !1 && this.pause();
  }
  initAnimation() {
    const { options: t } = this;
    Fa(t);
    const { type: r = mt, repeat: n = 0, repeatDelay: i = 0, repeatType: o, velocity: a = 0 } = t;
    let { keyframes: l } = t;
    const c = r || mt;
    process.env.NODE_ENV !== "production" && c !== mt && Le(l.length <= 2, `Only two keyframes currently supported with spring and inertia animations. Trying to animate ${l}`, "spring-two-frames"), c !== mt && typeof l[0] != "number" && (this.mixKeyframes = Jt(iu, Da(l[0], l[1])), l = [0, 100]);
    const u = c({ ...t, keyframes: l });
    o === "mirror" && (this.mirroredGenerator = c({
      ...t,
      keyframes: [...l].reverse(),
      velocity: -a
    })), u.calculatedDuration === null && (u.calculatedDuration = $r(u));
    const { calculatedDuration: d } = u;
    this.calculatedDuration = d, this.resolvedDuration = d + i, this.totalDuration = this.resolvedDuration * (n + 1) - i, this.generator = u;
  }
  updateTime(t) {
    const r = Math.round(t - this.startTime) * this.playbackSpeed;
    this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = r;
  }
  tick(t, r = !1) {
    const { generator: n, totalDuration: i, mixKeyframes: o, mirroredGenerator: a, resolvedDuration: l, calculatedDuration: c } = this;
    if (this.startTime === null)
      return n.next(0);
    const { delay: u = 0, keyframes: d, repeat: h, repeatType: m, repeatDelay: g, type: x, onUpdate: k, finalKeyframe: S } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, t) : this.speed < 0 && (this.startTime = Math.min(t - i / this.speed, this.startTime)), r ? this.currentTime = t : this.updateTime(t);
    const v = this.currentTime - u * (this.playbackSpeed >= 0 ? 1 : -1), j = this.playbackSpeed >= 0 ? v < 0 : v > i;
    this.currentTime = Math.max(v, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = i);
    let P = this.currentTime, D = n;
    if (h) {
      const T = Math.min(this.currentTime, i) / l;
      let N = Math.floor(T), A = T % 1;
      !A && T >= 1 && (A = 1), A === 1 && N--, N = Math.min(N, h + 1), !!(N % 2) && (m === "reverse" ? (A = 1 - A, g && (A -= g / l)) : m === "mirror" && (D = a)), P = Re(0, 1, A) * l;
    }
    const E = j ? { done: !1, value: d[0] } : D.next(P);
    o && (E.value = o(E.value));
    let { done: z } = E;
    !j && c !== null && (z = this.playbackSpeed >= 0 ? this.currentTime >= i : this.currentTime <= 0);
    const $ = this.holdTime === null && (this.state === "finished" || this.state === "running" && z);
    return $ && x !== ar && (E.value = Ur(d, this.options, S, this.speed)), k && k(E.value), $ && this.finish(), E;
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
    return /* @__PURE__ */ Ae(this.calculatedDuration);
  }
  get time() {
    return /* @__PURE__ */ Ae(this.currentTime);
  }
  set time(t) {
    var r;
    t = /* @__PURE__ */ _e(t), this.currentTime = t, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = t : this.driver && (this.startTime = this.driver.now() - t / this.playbackSpeed), (r = this.driver) == null || r.start(!1);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(t) {
    this.updateTime(xe.now());
    const r = this.playbackSpeed !== t;
    this.playbackSpeed = t, r && (this.time = /* @__PURE__ */ Ae(this.currentTime));
  }
  play() {
    var i, o;
    if (this.isStopped)
      return;
    const { driver: t = zd, startTime: r } = this.options;
    this.driver || (this.driver = t((a) => this.tick(a))), (o = (i = this.options).onPlay) == null || o.call(i);
    const n = this.driver.now();
    this.state === "finished" ? (this.updateFinished(), this.startTime = n) : this.holdTime !== null ? this.startTime = n - this.holdTime : this.startTime || (this.startTime = r ?? n), this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
  }
  pause() {
    this.state = "paused", this.updateTime(xe.now()), this.holdTime = this.currentTime;
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
function au(e) {
  for (let t = 1; t < e.length; t++)
    e[t] ?? (e[t] = e[t - 1]);
}
const st = (e) => e * 180 / Math.PI, or = (e) => {
  const t = st(Math.atan2(e[1], e[0]));
  return lr(t);
}, ou = {
  x: 4,
  y: 5,
  translateX: 4,
  translateY: 5,
  scaleX: 0,
  scaleY: 3,
  scale: (e) => (Math.abs(e[0]) + Math.abs(e[3])) / 2,
  rotate: or,
  rotateZ: or,
  skewX: (e) => st(Math.atan(e[1])),
  skewY: (e) => st(Math.atan(e[2])),
  skew: (e) => (Math.abs(e[1]) + Math.abs(e[2])) / 2
}, lr = (e) => (e = e % 360, e < 0 && (e += 360), e), $n = or, Un = (e) => Math.sqrt(e[0] * e[0] + e[1] * e[1]), Wn = (e) => Math.sqrt(e[4] * e[4] + e[5] * e[5]), lu = {
  x: 12,
  y: 13,
  z: 14,
  translateX: 12,
  translateY: 13,
  translateZ: 14,
  scaleX: Un,
  scaleY: Wn,
  scale: (e) => (Un(e) + Wn(e)) / 2,
  rotateX: (e) => lr(st(Math.atan2(e[6], e[5]))),
  rotateY: (e) => lr(st(Math.atan2(-e[2], e[0]))),
  rotateZ: $n,
  rotate: $n,
  skewX: (e) => st(Math.atan(e[4])),
  skewY: (e) => st(Math.atan(e[1])),
  skew: (e) => (Math.abs(e[1]) + Math.abs(e[4])) / 2
};
function cr(e) {
  return e.includes("scale") ? 1 : 0;
}
function dr(e, t) {
  if (!e || e === "none")
    return cr(t);
  const r = e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let n, i;
  if (r)
    n = lu, i = r;
  else {
    const l = e.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    n = ou, i = l;
  }
  if (!i)
    return cr(t);
  const o = n[t], a = i[1].split(",").map(du);
  return typeof o == "function" ? o(a) : a[o];
}
const cu = (e, t) => {
  const { transform: r = "none" } = getComputedStyle(e);
  return dr(r, t);
};
function du(e) {
  return parseFloat(e.trim());
}
const St = [
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
], _t = new Set(St), Hn = (e) => e === Tt || e === Y, uu = /* @__PURE__ */ new Set(["x", "y", "z"]), hu = St.filter((e) => !uu.has(e));
function mu(e) {
  const t = [];
  return hu.forEach((r) => {
    const n = e.getValue(r);
    n !== void 0 && (t.push([r, n.get()]), n.set(r.startsWith("scale") ? 1 : 0));
  }), t;
}
const nt = {
  // Dimensions
  width: ({ x: e }, { paddingLeft: t = "0", paddingRight: r = "0" }) => e.max - e.min - parseFloat(t) - parseFloat(r),
  height: ({ y: e }, { paddingTop: t = "0", paddingBottom: r = "0" }) => e.max - e.min - parseFloat(t) - parseFloat(r),
  top: (e, { top: t }) => parseFloat(t),
  left: (e, { left: t }) => parseFloat(t),
  bottom: ({ y: e }, { top: t }) => parseFloat(t) + (e.max - e.min),
  right: ({ x: e }, { left: t }) => parseFloat(t) + (e.max - e.min),
  // Transform
  x: (e, { transform: t }) => dr(t, "x"),
  y: (e, { transform: t }) => dr(t, "y")
};
nt.translateX = nt.x;
nt.translateY = nt.y;
const it = /* @__PURE__ */ new Set();
let ur = !1, hr = !1, mr = !1;
function Va() {
  if (hr) {
    const e = Array.from(it).filter((n) => n.needsMeasurement), t = new Set(e.map((n) => n.element)), r = /* @__PURE__ */ new Map();
    t.forEach((n) => {
      const i = mu(n);
      i.length && (r.set(n, i), n.render());
    }), e.forEach((n) => n.measureInitialState()), t.forEach((n) => {
      n.render();
      const i = r.get(n);
      i && i.forEach(([o, a]) => {
        var l;
        (l = n.getValue(o)) == null || l.set(a);
      });
    }), e.forEach((n) => n.measureEndState()), e.forEach((n) => {
      n.suspendedScrollY !== void 0 && window.scrollTo(0, n.suspendedScrollY);
    });
  }
  hr = !1, ur = !1, it.forEach((e) => e.complete(mr)), it.clear();
}
function Ia() {
  it.forEach((e) => {
    e.readKeyframes(), e.needsMeasurement && (hr = !0);
  });
}
function fu() {
  mr = !0, Ia(), Va(), mr = !1;
}
class qr {
  constructor(t, r, n, i, o, a = !1) {
    this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...t], this.onComplete = r, this.name = n, this.motionValue = i, this.element = o, this.isAsync = a;
  }
  scheduleResolve() {
    this.state = "scheduled", this.isAsync ? (it.add(this), ur || (ur = !0, J.read(Ia), J.resolveKeyframes(Va))) : (this.readKeyframes(), this.complete());
  }
  readKeyframes() {
    const { unresolvedKeyframes: t, name: r, element: n, motionValue: i } = this;
    if (t[0] === null) {
      const o = i == null ? void 0 : i.get(), a = t[t.length - 1];
      if (o !== void 0)
        t[0] = o;
      else if (n && r) {
        const l = n.readValue(r, a);
        l != null && (t[0] = l);
      }
      t[0] === void 0 && (t[0] = a), i && o === void 0 && i.set(t[0]);
    }
    au(t);
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
    this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, t), it.delete(this);
  }
  cancel() {
    this.state === "scheduled" && (it.delete(this), this.state = "pending");
  }
  resume() {
    this.state === "pending" && this.scheduleResolve();
  }
}
const gu = (e) => e.startsWith("--");
function pu(e, t, r) {
  gu(t) ? e.style.setProperty(t, r) : e.style[t] = r;
}
const xu = /* @__PURE__ */ Dr(() => window.ScrollTimeline !== void 0), yu = {};
function bu(e, t) {
  const r = /* @__PURE__ */ Dr(e);
  return () => yu[t] ?? r();
}
const Oa = /* @__PURE__ */ bu(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
    return !1;
  }
  return !0;
}, "linearEasing"), Ft = ([e, t, r, n]) => `cubic-bezier(${e}, ${t}, ${r}, ${n})`, qn = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ Ft([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ Ft([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ Ft([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ Ft([0.33, 1.53, 0.69, 0.99])
};
function Ya(e, t) {
  if (e)
    return typeof e == "function" ? Oa() ? Ra(e, t) : "ease-out" : ka(e) ? Ft(e) : Array.isArray(e) ? e.map((r) => Ya(r, t) || qn.easeOut) : qn[e];
}
function vu(e, t, r, { delay: n = 0, duration: i = 300, repeat: o = 0, repeatType: a = "loop", ease: l = "easeOut", times: c } = {}, u = void 0) {
  const d = {
    [t]: r
  };
  c && (d.offset = c);
  const h = Ya(l, i);
  Array.isArray(h) && (d.easing = h);
  const m = {
    delay: n,
    duration: i,
    easing: Array.isArray(h) ? "linear" : h,
    fill: "both",
    iterations: o + 1,
    direction: a === "reverse" ? "alternate" : "normal"
  };
  return u && (m.pseudoElement = u), e.animate(d, m);
}
function Ba(e) {
  return typeof e == "function" && "applyToOptions" in e;
}
function wu({ type: e, ...t }) {
  return Ba(e) && Oa() ? e.applyToOptions(t) : (t.duration ?? (t.duration = 300), t.ease ?? (t.ease = "easeOut"), t);
}
class ju extends Wr {
  constructor(t) {
    if (super(), this.finishedTime = null, this.isStopped = !1, !t)
      return;
    const { element: r, name: n, keyframes: i, pseudoElement: o, allowFlatten: a = !1, finalKeyframe: l, onComplete: c } = t;
    this.isPseudoElement = !!o, this.allowFlatten = a, this.options = t, Le(typeof t.type != "string", `Mini animate() doesn't support "type" as a string.`, "mini-spring");
    const u = wu(t);
    this.animation = vu(r, n, i, u, o), u.autoplay === !1 && this.animation.pause(), this.animation.onfinish = () => {
      if (this.finishedTime = this.time, !o) {
        const d = Ur(i, this.options, l, this.speed);
        this.updateMotionValue ? this.updateMotionValue(d) : pu(r, n, d), this.animation.cancel();
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
    return /* @__PURE__ */ Ae(Number(t));
  }
  get time() {
    return /* @__PURE__ */ Ae(Number(this.animation.currentTime) || 0);
  }
  set time(t) {
    this.finishedTime = null, this.animation.currentTime = /* @__PURE__ */ _e(t);
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
    return this.allowFlatten && ((n = this.animation.effect) == null || n.updateTiming({ easing: "linear" })), this.animation.onfinish = null, t && xu() ? (this.animation.timeline = t, ke) : r(this);
  }
}
const za = {
  anticipate: va,
  backInOut: ba,
  circInOut: ja
};
function Nu(e) {
  return e in za;
}
function ku(e) {
  typeof e.ease == "string" && Nu(e.ease) && (e.ease = za[e.ease]);
}
const Gn = 10;
class Tu extends ju {
  constructor(t) {
    ku(t), Fa(t), super(t), t.startTime && (this.startTime = t.startTime), this.options = t;
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
    const { motionValue: r, onUpdate: n, onComplete: i, element: o, ...a } = this.options;
    if (!r)
      return;
    if (t !== void 0) {
      r.set(t);
      return;
    }
    const l = new Hr({
      ...a,
      autoplay: !1
    }), c = /* @__PURE__ */ _e(this.finishedTime ?? this.time);
    r.setWithVelocity(l.sample(c - Gn).value, l.sample(c).value, Gn), l.stop();
  }
}
const Kn = (e, t) => t === "zIndex" ? !1 : !!(typeof e == "number" || Array.isArray(e) || typeof e == "string" && // It's animatable if we have a string
(He.test(e) || e === "0") && // And it contains numbers and/or colors
!e.startsWith("url("));
function Su(e) {
  const t = e[0];
  if (e.length === 1)
    return !0;
  for (let r = 0; r < e.length; r++)
    if (e[r] !== t)
      return !0;
}
function _u(e, t, r, n) {
  const i = e[0];
  if (i === null)
    return !1;
  if (t === "display" || t === "visibility")
    return !0;
  const o = e[e.length - 1], a = Kn(i, t), l = Kn(o, t);
  return kt(a === l, `You are trying to animate ${t} from "${i}" to "${o}". "${a ? o : i}" is not an animatable value.`, "value-not-animatable"), !a || !l ? !1 : Su(e) || (r === "spring" || Ba(r)) && n;
}
function fr(e) {
  e.duration = 0, e.type;
}
const Cu = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Could be re-enabled now we have support for linear() easing
  // "background-color"
]), Pu = /* @__PURE__ */ Dr(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function Au(e) {
  var d;
  const { motionValue: t, name: r, repeatDelay: n, repeatType: i, damping: o, type: a } = e;
  if (!(((d = t == null ? void 0 : t.owner) == null ? void 0 : d.current) instanceof HTMLElement))
    return !1;
  const { onUpdate: c, transformTemplate: u } = t.owner.getProps();
  return Pu() && r && Cu.has(r) && (r !== "transform" || !u) && /**
   * If we're outputting values to onUpdate then we can't use WAAPI as there's
   * no way to read the value from WAAPI every frame.
   */
  !c && !n && i !== "mirror" && o !== 0 && a !== "inertia";
}
const Eu = 40;
class Mu extends Wr {
  constructor({ autoplay: t = !0, delay: r = 0, type: n = "keyframes", repeat: i = 0, repeatDelay: o = 0, repeatType: a = "loop", keyframes: l, name: c, motionValue: u, element: d, ...h }) {
    var x;
    super(), this.stop = () => {
      var k, S;
      this._animation && (this._animation.stop(), (k = this.stopTimeline) == null || k.call(this)), (S = this.keyframeResolver) == null || S.cancel();
    }, this.createdAt = xe.now();
    const m = {
      autoplay: t,
      delay: r,
      type: n,
      repeat: i,
      repeatDelay: o,
      repeatType: a,
      name: c,
      motionValue: u,
      element: d,
      ...h
    }, g = (d == null ? void 0 : d.KeyframeResolver) || qr;
    this.keyframeResolver = new g(l, (k, S, v) => this.onKeyframesResolved(k, S, m, !v), c, u, d), (x = this.keyframeResolver) == null || x.scheduleResolve();
  }
  onKeyframesResolved(t, r, n, i) {
    this.keyframeResolver = void 0;
    const { name: o, type: a, velocity: l, delay: c, isHandoff: u, onUpdate: d } = n;
    this.resolvedAt = xe.now(), _u(t, o, a, l) || ((Fe.instantAnimations || !c) && (d == null || d(Ur(t, n, r))), t[0] = t[t.length - 1], fr(n), n.repeat = 0);
    const m = {
      startTime: i ? this.resolvedAt ? this.resolvedAt - this.createdAt > Eu ? this.resolvedAt : this.createdAt : this.createdAt : void 0,
      finalKeyframe: r,
      ...n,
      keyframes: t
    }, g = !u && Au(m) ? new Tu({
      ...m,
      element: m.motionValue.owner.current
    }) : new Hr(m);
    g.finished.then(() => this.notifyFinished()).catch(ke), this.pendingTimeline && (this.stopTimeline = g.attachTimeline(this.pendingTimeline), this.pendingTimeline = void 0), this._animation = g;
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
    return this._animation || ((t = this.keyframeResolver) == null || t.resume(), fu()), this._animation;
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
const Du = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function Ru(e) {
  const t = Du.exec(e);
  if (!t)
    return [,];
  const [, r, n, i] = t;
  return [`--${r ?? n}`, i];
}
const Lu = 4;
function $a(e, t, r = 1) {
  Le(r <= Lu, `Max CSS variable fallback depth detected in property "${e}". This may indicate a circular fallback dependency.`, "max-css-var-depth");
  const [n, i] = Ru(e);
  if (!n)
    return;
  const o = window.getComputedStyle(t).getPropertyValue(n);
  if (o) {
    const a = o.trim();
    return ua(a) ? parseFloat(a) : a;
  }
  return Or(i) ? $a(i, t, r + 1) : i;
}
function Gr(e, t) {
  return (e == null ? void 0 : e[t]) ?? (e == null ? void 0 : e.default) ?? e;
}
const Ua = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...St
]), Fu = {
  test: (e) => e === "auto",
  parse: (e) => e
}, Wa = (e) => (t) => t.test(e), Ha = [Tt, Y, Ee, Oe, Sd, Td, Fu], Xn = (e) => Ha.find(Wa(e));
function Vu(e) {
  return typeof e == "number" ? e === 0 : e !== null ? e === "none" || e === "0" || ma(e) : !0;
}
const Iu = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function Ou(e) {
  const [t, r] = e.slice(0, -1).split("(");
  if (t === "drop-shadow")
    return e;
  const [n] = r.match(Yr) || [];
  if (!n)
    return e;
  const i = r.replace(n, "");
  let o = Iu.has(t) ? 1 : 0;
  return n !== r && (o *= 100), t + "(" + o + i + ")";
}
const Yu = /\b([a-z-]*)\(.*?\)/gu, gr = {
  ...He,
  getAnimatableNone: (e) => {
    const t = e.match(Yu);
    return t ? t.map(Ou).join(" ") : e;
  }
}, Zn = {
  ...Tt,
  transform: Math.round
}, Bu = {
  rotate: Oe,
  rotateX: Oe,
  rotateY: Oe,
  rotateZ: Oe,
  scale: ds,
  scaleX: ds,
  scaleY: ds,
  scaleZ: ds,
  skew: Oe,
  skewX: Oe,
  skewY: Oe,
  distance: Y,
  translateX: Y,
  translateY: Y,
  translateZ: Y,
  x: Y,
  y: Y,
  z: Y,
  perspective: Y,
  transformPerspective: Y,
  opacity: Ht,
  originX: In,
  originY: In,
  originZ: Y
}, Kr = {
  // Border props
  borderWidth: Y,
  borderTopWidth: Y,
  borderRightWidth: Y,
  borderBottomWidth: Y,
  borderLeftWidth: Y,
  borderRadius: Y,
  radius: Y,
  borderTopLeftRadius: Y,
  borderTopRightRadius: Y,
  borderBottomRightRadius: Y,
  borderBottomLeftRadius: Y,
  // Positioning props
  width: Y,
  maxWidth: Y,
  height: Y,
  maxHeight: Y,
  top: Y,
  right: Y,
  bottom: Y,
  left: Y,
  // Spacing props
  padding: Y,
  paddingTop: Y,
  paddingRight: Y,
  paddingBottom: Y,
  paddingLeft: Y,
  margin: Y,
  marginTop: Y,
  marginRight: Y,
  marginBottom: Y,
  marginLeft: Y,
  // Misc
  backgroundPositionX: Y,
  backgroundPositionY: Y,
  ...Bu,
  zIndex: Zn,
  // SVG
  fillOpacity: Ht,
  strokeOpacity: Ht,
  numOctaves: Zn
}, zu = {
  ...Kr,
  // Color props
  color: ae,
  backgroundColor: ae,
  outlineColor: ae,
  fill: ae,
  stroke: ae,
  // Border props
  borderColor: ae,
  borderTopColor: ae,
  borderRightColor: ae,
  borderBottomColor: ae,
  borderLeftColor: ae,
  filter: gr,
  WebkitFilter: gr
}, qa = (e) => zu[e];
function Ga(e, t) {
  let r = qa(e);
  return r !== gr && (r = He), r.getAnimatableNone ? r.getAnimatableNone(t) : void 0;
}
const $u = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function Uu(e, t, r) {
  let n = 0, i;
  for (; n < e.length && !i; ) {
    const o = e[n];
    typeof o == "string" && !$u.has(o) && qt(o).values.length && (i = e[n]), n++;
  }
  if (i && r)
    for (const o of t)
      e[o] = Ga(r, i);
}
class Wu extends qr {
  constructor(t, r, n, i, o) {
    super(t, r, n, i, o, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: t, element: r, name: n } = this;
    if (!r || !r.current)
      return;
    super.readKeyframes();
    for (let c = 0; c < t.length; c++) {
      let u = t[c];
      if (typeof u == "string" && (u = u.trim(), Or(u))) {
        const d = $a(u, r.current);
        d !== void 0 && (t[c] = d), c === t.length - 1 && (this.finalKeyframe = u);
      }
    }
    if (this.resolveNoneKeyframes(), !Ua.has(n) || t.length !== 2)
      return;
    const [i, o] = t, a = Xn(i), l = Xn(o);
    if (a !== l)
      if (Hn(a) && Hn(l))
        for (let c = 0; c < t.length; c++) {
          const u = t[c];
          typeof u == "string" && (t[c] = parseFloat(u));
        }
      else nt[n] && (this.needsMeasurement = !0);
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: t, name: r } = this, n = [];
    for (let i = 0; i < t.length; i++)
      (t[i] === null || Vu(t[i])) && n.push(i);
    n.length && Uu(t, n, r);
  }
  measureInitialState() {
    const { element: t, unresolvedKeyframes: r, name: n } = this;
    if (!t || !t.current)
      return;
    n === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = nt[n](t.measureViewportBox(), window.getComputedStyle(t.current)), r[0] = this.measuredOrigin;
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
    const o = n.length - 1, a = n[o];
    n[o] = nt[r](t.measureViewportBox(), window.getComputedStyle(t.current)), a !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = a), (l = this.removedTransforms) != null && l.length && this.removedTransforms.forEach(([c, u]) => {
      t.getValue(c).set(u);
    }), this.resolveNoneKeyframes();
  }
}
function Hu(e, t, r) {
  if (e instanceof EventTarget)
    return [e];
  if (typeof e == "string") {
    let n = document;
    const i = (r == null ? void 0 : r[e]) ?? n.querySelectorAll(e);
    return i ? Array.from(i) : [];
  }
  return Array.from(e);
}
const Ka = (e, t) => t && typeof e == "number" ? t.transform(e) : e;
function qu(e) {
  return ha(e) && "offsetHeight" in e;
}
const Jn = 30, Gu = (e) => !isNaN(parseFloat(e));
class Ku {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   */
  constructor(t, r = {}) {
    this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (n) => {
      var o;
      const i = xe.now();
      if (this.updatedAt !== i && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(n), this.current !== this.prev && ((o = this.events.change) == null || o.notify(this.current), this.dependents))
        for (const a of this.dependents)
          a.dirty();
    }, this.hasAnimated = !1, this.setCurrent(t), this.owner = r.owner;
  }
  setCurrent(t) {
    this.current = t, this.updatedAt = xe.now(), this.canTrackVelocity === null && t !== void 0 && (this.canTrackVelocity = Gu(this.current));
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
    return process.env.NODE_ENV !== "production" && Lr(!1, 'value.onChange(callback) is deprecated. Switch to value.on("change", callback).'), this.on("change", t);
  }
  on(t, r) {
    this.events[t] || (this.events[t] = new Rr());
    const n = this.events[t].add(r);
    return t === "change" ? () => {
      n(), J.read(() => {
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
    const t = xe.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || t - this.updatedAt > Jn)
      return 0;
    const r = Math.min(this.updatedAt - this.prevUpdatedAt, Jn);
    return fa(parseFloat(this.current) - parseFloat(this.prevFrameValue), r);
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
function jt(e, t) {
  return new Ku(e, t);
}
const { schedule: Xr } = /* @__PURE__ */ Ta(queueMicrotask, !1), Te = {
  x: !1,
  y: !1
};
function Xa() {
  return Te.x || Te.y;
}
function Xu(e) {
  return e === "x" || e === "y" ? Te[e] ? null : (Te[e] = !0, () => {
    Te[e] = !1;
  }) : Te.x || Te.y ? null : (Te.x = Te.y = !0, () => {
    Te.x = Te.y = !1;
  });
}
function Za(e, t) {
  const r = Hu(e), n = new AbortController(), i = {
    passive: !0,
    ...t,
    signal: n.signal
  };
  return [r, i, () => n.abort()];
}
function Qn(e) {
  return !(e.pointerType === "touch" || Xa());
}
function Zu(e, t, r = {}) {
  const [n, i, o] = Za(e, r), a = (l) => {
    if (!Qn(l))
      return;
    const { target: c } = l, u = t(c, l);
    if (typeof u != "function" || !c)
      return;
    const d = (h) => {
      Qn(h) && (u(h), c.removeEventListener("pointerleave", d));
    };
    c.addEventListener("pointerleave", d, i);
  };
  return n.forEach((l) => {
    l.addEventListener("pointerenter", a, i);
  }), o;
}
const Ja = (e, t) => t ? e === t ? !0 : Ja(e, t.parentElement) : !1, Zr = (e) => e.pointerType === "mouse" ? typeof e.button != "number" || e.button <= 0 : e.isPrimary !== !1, Ju = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function Qu(e) {
  return Ju.has(e.tagName) || e.tabIndex !== -1;
}
const xs = /* @__PURE__ */ new WeakSet();
function ei(e) {
  return (t) => {
    t.key === "Enter" && e(t);
  };
}
function zs(e, t) {
  e.dispatchEvent(new PointerEvent("pointer" + t, { isPrimary: !0, bubbles: !0 }));
}
const eh = (e, t) => {
  const r = e.currentTarget;
  if (!r)
    return;
  const n = ei(() => {
    if (xs.has(r))
      return;
    zs(r, "down");
    const i = ei(() => {
      zs(r, "up");
    }), o = () => zs(r, "cancel");
    r.addEventListener("keyup", i, t), r.addEventListener("blur", o, t);
  });
  r.addEventListener("keydown", n, t), r.addEventListener("blur", () => r.removeEventListener("keydown", n), t);
};
function ti(e) {
  return Zr(e) && !Xa();
}
function th(e, t, r = {}) {
  const [n, i, o] = Za(e, r), a = (l) => {
    const c = l.currentTarget;
    if (!ti(l))
      return;
    xs.add(c);
    const u = t(c, l), d = (g, x) => {
      window.removeEventListener("pointerup", h), window.removeEventListener("pointercancel", m), xs.has(c) && xs.delete(c), ti(g) && typeof u == "function" && u(g, { success: x });
    }, h = (g) => {
      d(g, c === window || c === document || r.useGlobalTarget || Ja(c, g.target));
    }, m = (g) => {
      d(g, !1);
    };
    window.addEventListener("pointerup", h, i), window.addEventListener("pointercancel", m, i);
  };
  return n.forEach((l) => {
    (r.useGlobalTarget ? window : l).addEventListener("pointerdown", a, i), qu(l) && (l.addEventListener("focus", (u) => eh(u, i)), !Qu(l) && !l.hasAttribute("tabindex") && (l.tabIndex = 0));
  }), o;
}
function Qa(e) {
  return ha(e) && "ownerSVGElement" in e;
}
function sh(e) {
  return Qa(e) && e.tagName === "svg";
}
const he = (e) => !!(e && e.getVelocity), rh = [...Ha, ae, He], nh = (e) => rh.find(Wa(e)), eo = qe({
  transformPagePoint: (e) => e,
  isStatic: !1,
  reducedMotion: "never"
});
function ih(e = !0) {
  const t = ue(Ar);
  if (t === null)
    return [!0, null];
  const { isPresent: r, onExitComplete: n, register: i } = t, o = gl();
  le(() => {
    if (e)
      return i(o);
  }, [e]);
  const a = Gi(() => e && n && n(o), [o, n, e]);
  return !r && n ? [!1, a] : [!0];
}
const to = qe({ strict: !1 }), si = {
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
}, Nt = {};
for (const e in si)
  Nt[e] = {
    isEnabled: (t) => si[e].some((r) => !!t[r])
  };
function ah(e) {
  for (const t in e)
    Nt[t] = {
      ...Nt[t],
      ...e[t]
    };
}
const oh = /* @__PURE__ */ new Set([
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
function Ts(e) {
  return e.startsWith("while") || e.startsWith("drag") && e !== "draggable" || e.startsWith("layout") || e.startsWith("onTap") || e.startsWith("onPan") || e.startsWith("onLayout") || oh.has(e);
}
let so = (e) => !Ts(e);
function lh(e) {
  typeof e == "function" && (so = (t) => t.startsWith("on") ? !Ts(t) : e(t));
}
try {
  lh(require("@emotion/is-prop-valid").default);
} catch {
}
function ch(e, t, r) {
  const n = {};
  for (const i in e)
    i === "values" && typeof e.values == "object" || (so(i) || r === !0 && Ts(i) || !t && !Ts(i) || // If trying to use native HTML drag events, forward drag listeners
    e.draggable && i.startsWith("onDrag")) && (n[i] = e[i]);
  return n;
}
const Ps = /* @__PURE__ */ qe({});
function As(e) {
  return e !== null && typeof e == "object" && typeof e.start == "function";
}
function Gt(e) {
  return typeof e == "string" || Array.isArray(e);
}
const Jr = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], Qr = ["initial", ...Jr];
function Es(e) {
  return As(e.animate) || Qr.some((t) => Gt(e[t]));
}
function ro(e) {
  return !!(Es(e) || e.variants);
}
function dh(e, t) {
  if (Es(e)) {
    const { initial: r, animate: n } = e;
    return {
      initial: r === !1 || Gt(r) ? r : void 0,
      animate: Gt(n) ? n : void 0
    };
  }
  return e.inherit !== !1 ? t : {};
}
function uh(e) {
  const { initial: t, animate: r } = dh(e, ue(Ps));
  return _s(() => ({ initial: t, animate: r }), [ri(t), ri(r)]);
}
function ri(e) {
  return Array.isArray(e) ? e.join(" ") : e;
}
const Kt = {};
function hh(e) {
  for (const t in e)
    Kt[t] = e[t], Ir(t) && (Kt[t].isCSSVariable = !0);
}
function no(e, { layout: t, layoutId: r }) {
  return _t.has(e) || e.startsWith("origin") || (t || r !== void 0) && (!!Kt[e] || e === "opacity");
}
const mh = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, fh = St.length;
function gh(e, t, r) {
  let n = "", i = !0;
  for (let o = 0; o < fh; o++) {
    const a = St[o], l = e[a];
    if (l === void 0)
      continue;
    let c = !0;
    if (typeof l == "number" ? c = l === (a.startsWith("scale") ? 1 : 0) : c = parseFloat(l) === 0, !c || r) {
      const u = Ka(l, Kr[a]);
      if (!c) {
        i = !1;
        const d = mh[a] || a;
        n += `${d}(${u}) `;
      }
      r && (t[a] = u);
    }
  }
  return n = n.trim(), r ? n = r(t, i ? "" : n) : i && (n = "none"), n;
}
function en(e, t, r) {
  const { style: n, vars: i, transformOrigin: o } = e;
  let a = !1, l = !1;
  for (const c in t) {
    const u = t[c];
    if (_t.has(c)) {
      a = !0;
      continue;
    } else if (Ir(c)) {
      i[c] = u;
      continue;
    } else {
      const d = Ka(u, Kr[c]);
      c.startsWith("origin") ? (l = !0, o[c] = d) : n[c] = d;
    }
  }
  if (t.transform || (a || r ? n.transform = gh(t, e.transform, r) : n.transform && (n.transform = "none")), l) {
    const { originX: c = "50%", originY: u = "50%", originZ: d = 0 } = o;
    n.transformOrigin = `${c} ${u} ${d}`;
  }
}
const tn = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
function io(e, t, r) {
  for (const n in t)
    !he(t[n]) && !no(n, r) && (e[n] = t[n]);
}
function ph({ transformTemplate: e }, t) {
  return _s(() => {
    const r = tn();
    return en(r, t, e), Object.assign({}, r.vars, r.style);
  }, [t]);
}
function xh(e, t) {
  const r = e.style || {}, n = {};
  return io(n, r, e), Object.assign(n, ph(e, t)), n;
}
function yh(e, t) {
  const r = {}, n = xh(e, t);
  return e.drag && e.dragListener !== !1 && (r.draggable = !1, n.userSelect = n.WebkitUserSelect = n.WebkitTouchCallout = "none", n.touchAction = e.drag === !0 ? "none" : `pan-${e.drag === "x" ? "y" : "x"}`), e.tabIndex === void 0 && (e.onTap || e.onTapStart || e.whileTap) && (r.tabIndex = 0), r.style = n, r;
}
const bh = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, vh = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function wh(e, t, r = 1, n = 0, i = !0) {
  e.pathLength = 1;
  const o = i ? bh : vh;
  e[o.offset] = Y.transform(-n);
  const a = Y.transform(t), l = Y.transform(r);
  e[o.array] = `${a} ${l}`;
}
function ao(e, {
  attrX: t,
  attrY: r,
  attrScale: n,
  pathLength: i,
  pathSpacing: o = 1,
  pathOffset: a = 0,
  // This is object creation, which we try to avoid per-frame.
  ...l
}, c, u, d) {
  if (en(e, l, u), c) {
    e.style.viewBox && (e.attrs.viewBox = e.style.viewBox);
    return;
  }
  e.attrs = e.style, e.style = {};
  const { attrs: h, style: m } = e;
  h.transform && (m.transform = h.transform, delete h.transform), (m.transform || h.transformOrigin) && (m.transformOrigin = h.transformOrigin ?? "50% 50%", delete h.transformOrigin), m.transform && (m.transformBox = (d == null ? void 0 : d.transformBox) ?? "fill-box", delete h.transformBox), t !== void 0 && (h.x = t), r !== void 0 && (h.y = r), n !== void 0 && (h.scale = n), i !== void 0 && wh(h, i, o, a, !1);
}
const oo = () => ({
  ...tn(),
  attrs: {}
}), lo = (e) => typeof e == "string" && e.toLowerCase() === "svg";
function jh(e, t, r, n) {
  const i = _s(() => {
    const o = oo();
    return ao(o, t, lo(n), e.transformTemplate, e.style), {
      ...o.attrs,
      style: { ...o.style }
    };
  }, [t]);
  if (e.style) {
    const o = {};
    io(o, e.style, e), i.style = { ...o, ...i.style };
  }
  return i;
}
const Nh = [
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
function sn(e) {
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
      !!(Nh.indexOf(e) > -1 || /**
       * If it contains a capital letter, it's an SVG component
       */
      /[A-Z]/u.test(e))
    )
  );
}
function kh(e, t, r, { latestValues: n }, i, o = !1) {
  const l = (sn(e) ? jh : yh)(t, n, i, e), c = ch(t, typeof e == "string", o), u = e !== Ki ? { ...c, ...l, ref: r } : {}, { children: d } = t, h = _s(() => he(d) ? d.get() : d, [d]);
  return pl(e, {
    ...u,
    children: h
  });
}
function ni(e) {
  const t = [{}, {}];
  return e == null || e.values.forEach((r, n) => {
    t[0][n] = r.get(), t[1][n] = r.getVelocity();
  }), t;
}
function rn(e, t, r, n) {
  if (typeof t == "function") {
    const [i, o] = ni(n);
    t = t(r !== void 0 ? r : e.custom, i, o);
  }
  if (typeof t == "string" && (t = e.variants && e.variants[t]), typeof t == "function") {
    const [i, o] = ni(n);
    t = t(r !== void 0 ? r : e.custom, i, o);
  }
  return t;
}
function ys(e) {
  return he(e) ? e.get() : e;
}
function Th({ scrapeMotionValuesFromProps: e, createRenderState: t }, r, n, i) {
  return {
    latestValues: Sh(r, n, i, e),
    renderState: t()
  };
}
function Sh(e, t, r, n) {
  const i = {}, o = n(e, {});
  for (const m in o)
    i[m] = ys(o[m]);
  let { initial: a, animate: l } = e;
  const c = Es(e), u = ro(e);
  t && u && !c && e.inherit !== !1 && (a === void 0 && (a = t.initial), l === void 0 && (l = t.animate));
  let d = r ? r.initial === !1 : !1;
  d = d || a === !1;
  const h = d ? l : a;
  if (h && typeof h != "boolean" && !As(h)) {
    const m = Array.isArray(h) ? h : [h];
    for (let g = 0; g < m.length; g++) {
      const x = rn(e, m[g]);
      if (x) {
        const { transitionEnd: k, transition: S, ...v } = x;
        for (const j in v) {
          let P = v[j];
          if (Array.isArray(P)) {
            const D = d ? P.length - 1 : 0;
            P = P[D];
          }
          P !== null && (i[j] = P);
        }
        for (const j in k)
          i[j] = k[j];
      }
    }
  }
  return i;
}
const co = (e) => (t, r) => {
  const n = ue(Ps), i = ue(Ar), o = () => Th(e, t, n, i);
  return r ? o() : ad(o);
};
function nn(e, t, r) {
  var o;
  const { style: n } = e, i = {};
  for (const a in n)
    (he(n[a]) || t.style && he(t.style[a]) || no(a, e) || ((o = r == null ? void 0 : r.getValue(a)) == null ? void 0 : o.liveStyle) !== void 0) && (i[a] = n[a]);
  return i;
}
const _h = /* @__PURE__ */ co({
  scrapeMotionValuesFromProps: nn,
  createRenderState: tn
});
function uo(e, t, r) {
  const n = nn(e, t, r);
  for (const i in e)
    if (he(e[i]) || he(t[i])) {
      const o = St.indexOf(i) !== -1 ? "attr" + i.charAt(0).toUpperCase() + i.substring(1) : i;
      n[o] = e[i];
    }
  return n;
}
const Ch = /* @__PURE__ */ co({
  scrapeMotionValuesFromProps: uo,
  createRenderState: oo
}), Ph = Symbol.for("motionComponentSymbol");
function ft(e) {
  return e && typeof e == "object" && Object.prototype.hasOwnProperty.call(e, "current");
}
function Ah(e, t, r) {
  return Gi(
    (n) => {
      n && e.onMount && e.onMount(n), t && (n ? t.mount(n) : t.unmount()), r && (typeof r == "function" ? r(n) : ft(r) && (r.current = n));
    },
    /**
     * Only pass a new ref callback to React if we've received a visual element
     * factory. Otherwise we'll be mounting/remounting every time externalRef
     * or other dependencies change.
     */
    [t]
  );
}
const an = (e) => e.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(), Eh = "framerAppearId", ho = "data-" + an(Eh), mo = qe({});
function Mh(e, t, r, n, i) {
  var k, S;
  const { visualElement: o } = ue(Ps), a = ue(to), l = ue(Ar), c = ue(eo).reducedMotion, u = ze(null);
  n = n || a.renderer, !u.current && n && (u.current = n(e, {
    visualState: t,
    parent: o,
    props: r,
    presenceContext: l,
    blockInitialAnimation: l ? l.initial === !1 : !1,
    reducedMotionConfig: c
  }));
  const d = u.current, h = ue(mo);
  d && !d.projection && i && (d.type === "html" || d.type === "svg") && Dh(u.current, r, i, h);
  const m = ze(!1);
  xl(() => {
    d && m.current && d.update(r, l);
  });
  const g = r[ho], x = ze(!!g && !((k = window.MotionHandoffIsComplete) != null && k.call(window, g)) && ((S = window.MotionHasOptimisedAnimation) == null ? void 0 : S.call(window, g)));
  return od(() => {
    d && (m.current = !0, window.MotionIsMounted = !0, d.updateFeatures(), d.scheduleRenderMicrotask(), x.current && d.animationState && d.animationState.animateChanges());
  }), le(() => {
    d && (!x.current && d.animationState && d.animationState.animateChanges(), x.current && (queueMicrotask(() => {
      var v;
      (v = window.MotionHandoffMarkAsComplete) == null || v.call(window, g);
    }), x.current = !1), d.enteringChildren = void 0);
  }), d;
}
function Dh(e, t, r, n) {
  const { layoutId: i, layout: o, drag: a, dragConstraints: l, layoutScroll: c, layoutRoot: u, layoutCrossfade: d } = t;
  e.projection = new r(e.latestValues, t["data-framer-portal-id"] ? void 0 : fo(e.parent)), e.projection.setOptions({
    layoutId: i,
    layout: o,
    alwaysMeasureLayout: !!a || l && ft(l),
    visualElement: e,
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof o == "string" ? o : "both",
    initialPromotionConfig: n,
    crossfade: d,
    layoutScroll: c,
    layoutRoot: u
  });
}
function fo(e) {
  if (e)
    return e.options.allowProjection !== !1 ? e.projection : fo(e.parent);
}
function $s(e, { forwardMotionProps: t = !1 } = {}, r, n) {
  r && ah(r);
  const i = sn(e) ? Ch : _h;
  function o(l, c) {
    let u;
    const d = {
      ...ue(eo),
      ...l,
      layoutId: Rh(l)
    }, { isStatic: h } = d, m = uh(l), g = i(l, h);
    if (!h && Pr) {
      Lh(d, r);
      const x = Fh(d);
      u = x.MeasureLayout, m.visualElement = Mh(e, g, d, n, x.ProjectionNode);
    }
    return s.jsxs(Ps.Provider, { value: m, children: [u && m.visualElement ? s.jsx(u, { visualElement: m.visualElement, ...d }) : null, kh(e, l, Ah(g, m.visualElement, c), g, h, t)] });
  }
  o.displayName = `motion.${typeof e == "string" ? e : `create(${e.displayName ?? e.name ?? ""})`}`;
  const a = yl(o);
  return a[Ph] = e, a;
}
function Rh({ layoutId: e }) {
  const t = ue(da).id;
  return t && e !== void 0 ? t + "-" + e : e;
}
function Lh(e, t) {
  const r = ue(to).strict;
  if (process.env.NODE_ENV !== "production" && t && r) {
    const n = "You have rendered a `motion` component within a `LazyMotion` component. This will break tree shaking. Import and render a `m` component instead.";
    e.ignoreStrict ? kt(!1, n, "lazy-strict-mode") : Le(!1, n, "lazy-strict-mode");
  }
}
function Fh(e) {
  const { drag: t, layout: r } = Nt;
  if (!t && !r)
    return {};
  const n = { ...t, ...r };
  return {
    MeasureLayout: t != null && t.isEnabled(e) || r != null && r.isEnabled(e) ? n.MeasureLayout : void 0,
    ProjectionNode: n.ProjectionNode
  };
}
function Vh(e, t) {
  if (typeof Proxy > "u")
    return $s;
  const r = /* @__PURE__ */ new Map(), n = (o, a) => $s(o, a, e, t), i = (o, a) => (process.env.NODE_ENV !== "production" && Lr(!1, "motion() is deprecated. Use motion.create() instead."), n(o, a));
  return new Proxy(i, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (o, a) => a === "create" ? n : (r.has(a) || r.set(a, $s(a, void 0, e, t)), r.get(a))
  });
}
function go({ top: e, left: t, right: r, bottom: n }) {
  return {
    x: { min: t, max: r },
    y: { min: e, max: n }
  };
}
function Ih({ x: e, y: t }) {
  return { top: t.min, right: e.max, bottom: t.max, left: e.min };
}
function Oh(e, t) {
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
function pr({ scale: e, scaleX: t, scaleY: r }) {
  return !Us(e) || !Us(t) || !Us(r);
}
function Qe(e) {
  return pr(e) || po(e) || e.z || e.rotate || e.rotateX || e.rotateY || e.skewX || e.skewY;
}
function po(e) {
  return ii(e.x) || ii(e.y);
}
function ii(e) {
  return e && e !== "0%";
}
function Ss(e, t, r) {
  const n = e - r, i = t * n;
  return r + i;
}
function ai(e, t, r, n, i) {
  return i !== void 0 && (e = Ss(e, i, n)), Ss(e, r, n) + t;
}
function xr(e, t = 0, r = 1, n, i) {
  e.min = ai(e.min, t, r, n, i), e.max = ai(e.max, t, r, n, i);
}
function xo(e, { x: t, y: r }) {
  xr(e.x, t.translate, t.scale, t.originPoint), xr(e.y, r.translate, r.scale, r.originPoint);
}
const oi = 0.999999999999, li = 1.0000000000001;
function Yh(e, t, r, n = !1) {
  const i = r.length;
  if (!i)
    return;
  t.x = t.y = 1;
  let o, a;
  for (let l = 0; l < i; l++) {
    o = r[l], a = o.projectionDelta;
    const { visualElement: c } = o.options;
    c && c.props.style && c.props.style.display === "contents" || (n && o.options.layoutScroll && o.scroll && o !== o.root && pt(e, {
      x: -o.scroll.offset.x,
      y: -o.scroll.offset.y
    }), a && (t.x *= a.x.scale, t.y *= a.y.scale, xo(e, a)), n && Qe(o.latestValues) && pt(e, o.latestValues));
  }
  t.x < li && t.x > oi && (t.x = 1), t.y < li && t.y > oi && (t.y = 1);
}
function gt(e, t) {
  e.min = e.min + t, e.max = e.max + t;
}
function ci(e, t, r, n, i = 0.5) {
  const o = te(e.min, e.max, i);
  xr(e, t, r, o, n);
}
function pt(e, t) {
  ci(e.x, t.x, t.scaleX, t.scale, t.originX), ci(e.y, t.y, t.scaleY, t.scale, t.originY);
}
function yo(e, t) {
  return go(Oh(e.getBoundingClientRect(), t));
}
function Bh(e, t, r) {
  const n = yo(e, r), { scroll: i } = t;
  return i && (gt(n.x, i.offset.x), gt(n.y, i.offset.y)), n;
}
const di = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
}), xt = () => ({
  x: di(),
  y: di()
}), ui = () => ({ min: 0, max: 0 }), ne = () => ({
  x: ui(),
  y: ui()
}), yr = { current: null }, bo = { current: !1 };
function zh() {
  if (bo.current = !0, !!Pr)
    if (window.matchMedia) {
      const e = window.matchMedia("(prefers-reduced-motion)"), t = () => yr.current = e.matches;
      e.addEventListener("change", t), t();
    } else
      yr.current = !1;
}
const $h = /* @__PURE__ */ new WeakMap();
function Uh(e, t, r) {
  for (const n in t) {
    const i = t[n], o = r[n];
    if (he(i))
      e.addValue(n, i);
    else if (he(o))
      e.addValue(n, jt(i, { owner: e }));
    else if (o !== i)
      if (e.hasValue(n)) {
        const a = e.getValue(n);
        a.liveStyle === !0 ? a.jump(i) : a.hasAnimated || a.set(i);
      } else {
        const a = e.getStaticValue(n);
        e.addValue(n, jt(a !== void 0 ? a : i, { owner: e }));
      }
  }
  for (const n in r)
    t[n] === void 0 && e.removeValue(n);
  return t;
}
const hi = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
class Wh {
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
  constructor({ parent: t, props: r, presenceContext: n, reducedMotionConfig: i, blockInitialAnimation: o, visualState: a }, l = {}) {
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = qr, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.renderScheduledAt = 0, this.scheduleRender = () => {
      const m = xe.now();
      this.renderScheduledAt < m && (this.renderScheduledAt = m, J.render(this.render, !1, !0));
    };
    const { latestValues: c, renderState: u } = a;
    this.latestValues = c, this.baseTarget = { ...c }, this.initialValues = r.initial ? { ...c } : {}, this.renderState = u, this.parent = t, this.props = r, this.presenceContext = n, this.depth = t ? t.depth + 1 : 0, this.reducedMotionConfig = i, this.options = l, this.blockInitialAnimation = !!o, this.isControllingVariants = Es(r), this.isVariantNode = ro(r), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(t && t.current);
    const { willChange: d, ...h } = this.scrapeMotionValuesFromProps(r, {}, this);
    for (const m in h) {
      const g = h[m];
      c[m] !== void 0 && he(g) && g.set(c[m]);
    }
  }
  mount(t) {
    var r;
    this.current = t, $h.set(t, this), this.projection && !this.projection.instance && this.projection.mount(t), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((n, i) => this.bindToMotionValue(i, n)), bo.current || zh(), this.shouldReduceMotion = this.reducedMotionConfig === "never" ? !1 : this.reducedMotionConfig === "always" ? !0 : yr.current, process.env.NODE_ENV !== "production" && Lr(this.shouldReduceMotion !== !0, "You have Reduced Motion enabled on your device. Animations may not appear as expected.", "reduced-motion-disabled"), (r = this.parent) == null || r.addChild(this), this.update(this.props, this.presenceContext);
  }
  unmount() {
    var t;
    this.projection && this.projection.unmount(), We(this.notifyUpdate), We(this.render), this.valueSubscriptions.forEach((r) => r()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), (t = this.parent) == null || t.removeChild(this);
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
    const n = _t.has(t);
    n && this.onBindTransform && this.onBindTransform();
    const i = r.on("change", (a) => {
      this.latestValues[t] = a, this.props.onUpdate && J.preRender(this.notifyUpdate), n && this.projection && (this.projection.isTransformDirty = !0), this.scheduleRender();
    });
    let o;
    window.MotionCheckAppearSync && (o = window.MotionCheckAppearSync(this, t, r)), this.valueSubscriptions.set(t, () => {
      i(), o && o(), r.owner && r.stop();
    });
  }
  sortNodePosition(t) {
    return !this.current || !this.sortInstanceNodePosition || this.type !== t.type ? 0 : this.sortInstanceNodePosition(this.current, t.current);
  }
  updateFeatures() {
    let t = "animation";
    for (t in Nt) {
      const r = Nt[t];
      if (!r)
        continue;
      const { isEnabled: n, Feature: i } = r;
      if (!this.features[t] && i && n(this.props) && (this.features[t] = new i(this)), this.features[t]) {
        const o = this.features[t];
        o.isMounted ? o.update() : (o.mount(), o.isMounted = !0);
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
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : ne();
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
    for (let n = 0; n < hi.length; n++) {
      const i = hi[n];
      this.propEventSubscriptions[i] && (this.propEventSubscriptions[i](), delete this.propEventSubscriptions[i]);
      const o = "on" + i, a = t[o];
      a && (this.propEventSubscriptions[i] = this.on(i, a));
    }
    this.prevMotionValues = Uh(this, this.scrapeMotionValuesFromProps(t, this.prevProps, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
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
    return n === void 0 && r !== void 0 && (n = jt(r === null ? void 0 : r, { owner: this }), this.addValue(t, n)), n;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(t, r) {
    let n = this.latestValues[t] !== void 0 || !this.current ? this.latestValues[t] : this.getBaseTargetFromProps(this.props, t) ?? this.readValueFromInstance(this.current, t, this.options);
    return n != null && (typeof n == "string" && (ua(n) || ma(n)) ? n = parseFloat(n) : !nh(n) && He.test(r) && (n = Ga(t, r)), this.setBaseTarget(t, he(n) ? n.get() : n)), he(n) ? n.get() : n;
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
    var o;
    const { initial: r } = this.props;
    let n;
    if (typeof r == "string" || typeof r == "object") {
      const a = rn(this.props, r, (o = this.presenceContext) == null ? void 0 : o.custom);
      a && (n = a[t]);
    }
    if (r && n !== void 0)
      return n;
    const i = this.getBaseTargetFromProps(this.props, t);
    return i !== void 0 && !he(i) ? i : this.initialValues[t] !== void 0 && n === void 0 ? void 0 : this.baseTarget[t];
  }
  on(t, r) {
    return this.events[t] || (this.events[t] = new Rr()), this.events[t].add(r);
  }
  notify(t, ...r) {
    this.events[t] && this.events[t].notify(...r);
  }
  scheduleRenderMicrotask() {
    Xr.render(this.render);
  }
}
class vo extends Wh {
  constructor() {
    super(...arguments), this.KeyframeResolver = Wu;
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
    he(t) && (this.childSubscription = t.on("change", (r) => {
      this.current && (this.current.textContent = `${r}`);
    }));
  }
}
function wo(e, { style: t, vars: r }, n, i) {
  const o = e.style;
  let a;
  for (a in t)
    o[a] = t[a];
  i == null || i.applyProjectionStyles(o, n);
  for (a in r)
    o.setProperty(a, r[a]);
}
function Hh(e) {
  return window.getComputedStyle(e);
}
class qh extends vo {
  constructor() {
    super(...arguments), this.type = "html", this.renderInstance = wo;
  }
  readValueFromInstance(t, r) {
    var n;
    if (_t.has(r))
      return (n = this.projection) != null && n.isProjecting ? cr(r) : cu(t, r);
    {
      const i = Hh(t), o = (Ir(r) ? i.getPropertyValue(r) : i[r]) || 0;
      return typeof o == "string" ? o.trim() : o;
    }
  }
  measureInstanceViewportBox(t, { transformPagePoint: r }) {
    return yo(t, r);
  }
  build(t, r, n) {
    en(t, r, n.transformTemplate);
  }
  scrapeMotionValuesFromProps(t, r, n) {
    return nn(t, r, n);
  }
}
const jo = /* @__PURE__ */ new Set([
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
function Gh(e, t, r, n) {
  wo(e, t, void 0, n);
  for (const i in t.attrs)
    e.setAttribute(jo.has(i) ? i : an(i), t.attrs[i]);
}
class Kh extends vo {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = ne;
  }
  getBaseTargetFromProps(t, r) {
    return t[r];
  }
  readValueFromInstance(t, r) {
    if (_t.has(r)) {
      const n = qa(r);
      return n && n.default || 0;
    }
    return r = jo.has(r) ? r : an(r), t.getAttribute(r);
  }
  scrapeMotionValuesFromProps(t, r, n) {
    return uo(t, r, n);
  }
  build(t, r, n) {
    ao(t, r, this.isSVGTag, n.transformTemplate, n.style);
  }
  renderInstance(t, r, n, i) {
    Gh(t, r, n, i);
  }
  mount(t) {
    this.isSVGTag = lo(t.tagName), super.mount(t);
  }
}
const Xh = (e, t) => sn(e) ? new Kh(t) : new qh(t, {
  allowProjection: e !== Ki
});
function yt(e, t, r) {
  const n = e.getProps();
  return rn(n, t, r !== void 0 ? r : n.custom, e);
}
const br = (e) => Array.isArray(e);
function Zh(e, t, r) {
  e.hasValue(t) ? e.getValue(t).set(r) : e.addValue(t, jt(r));
}
function Jh(e) {
  return br(e) ? e[e.length - 1] || 0 : e;
}
function Qh(e, t) {
  const r = yt(e, t);
  let { transitionEnd: n = {}, transition: i = {}, ...o } = r || {};
  o = { ...o, ...n };
  for (const a in o) {
    const l = Jh(o[a]);
    Zh(e, a, l);
  }
}
function em(e) {
  return !!(he(e) && e.add);
}
function vr(e, t) {
  const r = e.getValue("willChange");
  if (em(r))
    return r.add(t);
  if (!r && Fe.WillChange) {
    const n = new Fe.WillChange("auto");
    e.addValue("willChange", n), n.add(t);
  }
}
function No(e) {
  return e.props[ho];
}
const tm = (e) => e !== null;
function sm(e, { repeat: t, repeatType: r = "loop" }, n) {
  const i = e.filter(tm), o = t && r !== "loop" && t % 2 === 1 ? 0 : i.length - 1;
  return i[o];
}
const rm = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, nm = (e) => ({
  type: "spring",
  stiffness: 550,
  damping: e === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), im = {
  type: "keyframes",
  duration: 0.8
}, am = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, om = (e, { keyframes: t }) => t.length > 2 ? im : _t.has(e) ? e.startsWith("scale") ? nm(t[1]) : rm : am;
function lm({ when: e, delay: t, delayChildren: r, staggerChildren: n, staggerDirection: i, repeat: o, repeatType: a, repeatDelay: l, from: c, elapsed: u, ...d }) {
  return !!Object.keys(d).length;
}
const on = (e, t, r, n = {}, i, o) => (a) => {
  const l = Gr(n, e) || {}, c = l.delay || n.delay || 0;
  let { elapsed: u = 0 } = n;
  u = u - /* @__PURE__ */ _e(c);
  const d = {
    keyframes: Array.isArray(r) ? r : [null, r],
    ease: "easeOut",
    velocity: t.getVelocity(),
    ...l,
    delay: -u,
    onUpdate: (m) => {
      t.set(m), l.onUpdate && l.onUpdate(m);
    },
    onComplete: () => {
      a(), l.onComplete && l.onComplete();
    },
    name: e,
    motionValue: t,
    element: o ? void 0 : i
  };
  lm(l) || Object.assign(d, om(e, d)), d.duration && (d.duration = /* @__PURE__ */ _e(d.duration)), d.repeatDelay && (d.repeatDelay = /* @__PURE__ */ _e(d.repeatDelay)), d.from !== void 0 && (d.keyframes[0] = d.from);
  let h = !1;
  if ((d.type === !1 || d.duration === 0 && !d.repeatDelay) && (fr(d), d.delay === 0 && (h = !0)), (Fe.instantAnimations || Fe.skipAnimations) && (h = !0, fr(d), d.delay = 0), d.allowFlatten = !l.type && !l.ease, h && !o && t.get() !== void 0) {
    const m = sm(d.keyframes, l);
    if (m !== void 0) {
      J.update(() => {
        d.onUpdate(m), d.onComplete();
      });
      return;
    }
  }
  return l.isSync ? new Hr(d) : new Mu(d);
};
function cm({ protectedKeys: e, needsAnimating: t }, r) {
  const n = e.hasOwnProperty(r) && t[r] !== !0;
  return t[r] = !1, n;
}
function ko(e, t, { delay: r = 0, transitionOverride: n, type: i } = {}) {
  let { transition: o = e.getDefaultTransition(), transitionEnd: a, ...l } = t;
  n && (o = n);
  const c = [], u = i && e.animationState && e.animationState.getState()[i];
  for (const d in l) {
    const h = e.getValue(d, e.latestValues[d] ?? null), m = l[d];
    if (m === void 0 || u && cm(u, d))
      continue;
    const g = {
      delay: r,
      ...Gr(o || {}, d)
    }, x = h.get();
    if (x !== void 0 && !h.isAnimating && !Array.isArray(m) && m === x && !g.velocity)
      continue;
    let k = !1;
    if (window.MotionHandoffAnimation) {
      const v = No(e);
      if (v) {
        const j = window.MotionHandoffAnimation(v, d, J);
        j !== null && (g.startTime = j, k = !0);
      }
    }
    vr(e, d), h.start(on(d, h, m, e.shouldReduceMotion && Ua.has(d) ? { type: !1 } : g, e, k));
    const S = h.animation;
    S && c.push(S);
  }
  return a && Promise.all(c).then(() => {
    J.update(() => {
      a && Qh(e, a);
    });
  }), c;
}
function To(e, t, r, n = 0, i = 1) {
  const o = Array.from(e).sort((u, d) => u.sortNodePosition(d)).indexOf(t), a = e.size, l = (a - 1) * n;
  return typeof r == "function" ? r(o, a) : i === 1 ? o * n : l - o * n;
}
function wr(e, t, r = {}) {
  var c;
  const n = yt(e, t, r.type === "exit" ? (c = e.presenceContext) == null ? void 0 : c.custom : void 0);
  let { transition: i = e.getDefaultTransition() || {} } = n || {};
  r.transitionOverride && (i = r.transitionOverride);
  const o = n ? () => Promise.all(ko(e, n, r)) : () => Promise.resolve(), a = e.variantChildren && e.variantChildren.size ? (u = 0) => {
    const { delayChildren: d = 0, staggerChildren: h, staggerDirection: m } = i;
    return dm(e, t, u, d, h, m, r);
  } : () => Promise.resolve(), { when: l } = i;
  if (l) {
    const [u, d] = l === "beforeChildren" ? [o, a] : [a, o];
    return u().then(() => d());
  } else
    return Promise.all([o(), a(r.delay)]);
}
function dm(e, t, r = 0, n = 0, i = 0, o = 1, a) {
  const l = [];
  for (const c of e.variantChildren)
    c.notify("AnimationStart", t), l.push(wr(c, t, {
      ...a,
      delay: r + (typeof n == "function" ? 0 : n) + To(e.variantChildren, c, n, i, o)
    }).then(() => c.notify("AnimationComplete", t)));
  return Promise.all(l);
}
function um(e, t, r = {}) {
  e.notify("AnimationStart", t);
  let n;
  if (Array.isArray(t)) {
    const i = t.map((o) => wr(e, o, r));
    n = Promise.all(i);
  } else if (typeof t == "string")
    n = wr(e, t, r);
  else {
    const i = typeof t == "function" ? yt(e, t, r.custom) : t;
    n = Promise.all(ko(e, i, r));
  }
  return n.then(() => {
    e.notify("AnimationComplete", t);
  });
}
function So(e, t) {
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
const hm = Qr.length;
function _o(e) {
  if (!e)
    return;
  if (!e.isControllingVariants) {
    const r = e.parent ? _o(e.parent) || {} : {};
    return e.props.initial !== void 0 && (r.initial = e.props.initial), r;
  }
  const t = {};
  for (let r = 0; r < hm; r++) {
    const n = Qr[r], i = e.props[n];
    (Gt(i) || i === !1) && (t[n] = i);
  }
  return t;
}
const mm = [...Jr].reverse(), fm = Jr.length;
function gm(e) {
  return (t) => Promise.all(t.map(({ animation: r, options: n }) => um(e, r, n)));
}
function pm(e) {
  let t = gm(e), r = mi(), n = !0;
  const i = (c) => (u, d) => {
    var m;
    const h = yt(e, d, c === "exit" ? (m = e.presenceContext) == null ? void 0 : m.custom : void 0);
    if (h) {
      const { transition: g, transitionEnd: x, ...k } = h;
      u = { ...u, ...k, ...x };
    }
    return u;
  };
  function o(c) {
    t = c(e);
  }
  function a(c) {
    const { props: u } = e, d = _o(e.parent) || {}, h = [], m = /* @__PURE__ */ new Set();
    let g = {}, x = 1 / 0;
    for (let S = 0; S < fm; S++) {
      const v = mm[S], j = r[v], P = u[v] !== void 0 ? u[v] : d[v], D = Gt(P), E = v === c ? j.isActive : null;
      E === !1 && (x = S);
      let z = P === d[v] && P !== u[v] && D;
      if (z && n && e.manuallyAnimateOnMount && (z = !1), j.protectedKeys = { ...g }, // If it isn't active and hasn't *just* been set as inactive
      !j.isActive && E === null || // If we didn't and don't have any defined prop for this animation type
      !P && !j.prevProp || // Or if the prop doesn't define an animation
      As(P) || typeof P == "boolean")
        continue;
      const $ = xm(j.prevProp, P);
      let T = $ || // If we're making this variant active, we want to always make it active
      v === c && j.isActive && !z && D || // If we removed a higher-priority variant (i is in reverse order)
      S > x && D, N = !1;
      const A = Array.isArray(P) ? P : [P];
      let b = A.reduce(i(v), {});
      E === !1 && (b = {});
      const { prevResolvedValues: V = {} } = j, H = {
        ...V,
        ...b
      }, Q = (O) => {
        T = !0, m.has(O) && (N = !0, m.delete(O)), j.needsAnimating[O] = !0;
        const F = e.getValue(O);
        F && (F.liveStyle = !1);
      };
      for (const O in H) {
        const F = b[O], L = V[O];
        if (g.hasOwnProperty(O))
          continue;
        let se = !1;
        br(F) && br(L) ? se = !So(F, L) : se = F !== L, se ? F != null ? Q(O) : m.add(O) : F !== void 0 && m.has(O) ? Q(O) : j.protectedKeys[O] = !0;
      }
      j.prevProp = P, j.prevResolvedValues = b, j.isActive && (g = { ...g, ...b }), n && e.blockInitialAnimation && (T = !1);
      const y = z && $;
      T && (!y || N) && h.push(...A.map((O) => {
        const F = { type: v };
        if (typeof O == "string" && n && !y && e.manuallyAnimateOnMount && e.parent) {
          const { parent: L } = e, se = yt(L, O);
          if (L.enteringChildren && se) {
            const { delayChildren: ge } = se.transition || {};
            F.delay = To(L.enteringChildren, e, ge);
          }
        }
        return {
          animation: O,
          options: F
        };
      }));
    }
    if (m.size) {
      const S = {};
      if (typeof u.initial != "boolean") {
        const v = yt(e, Array.isArray(u.initial) ? u.initial[0] : u.initial);
        v && v.transition && (S.transition = v.transition);
      }
      m.forEach((v) => {
        const j = e.getBaseTarget(v), P = e.getValue(v);
        P && (P.liveStyle = !0), S[v] = j ?? null;
      }), h.push({ animation: S });
    }
    let k = !!h.length;
    return n && (u.initial === !1 || u.initial === u.animate) && !e.manuallyAnimateOnMount && (k = !1), n = !1, k ? t(h) : Promise.resolve();
  }
  function l(c, u) {
    var h;
    if (r[c].isActive === u)
      return Promise.resolve();
    (h = e.variantChildren) == null || h.forEach((m) => {
      var g;
      return (g = m.animationState) == null ? void 0 : g.setActive(c, u);
    }), r[c].isActive = u;
    const d = a(c);
    for (const m in r)
      r[m].protectedKeys = {};
    return d;
  }
  return {
    animateChanges: a,
    setActive: l,
    setAnimateFunction: o,
    getState: () => r,
    reset: () => {
      r = mi(), n = !0;
    }
  };
}
function xm(e, t) {
  return typeof t == "string" ? t !== e : Array.isArray(t) ? !So(t, e) : !1;
}
function Je(e = !1) {
  return {
    isActive: e,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function mi() {
  return {
    animate: Je(!0),
    whileInView: Je(),
    whileHover: Je(),
    whileTap: Je(),
    whileDrag: Je(),
    whileFocus: Je(),
    exit: Je()
  };
}
class Ge {
  constructor(t) {
    this.isMounted = !1, this.node = t;
  }
  update() {
  }
}
class ym extends Ge {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(t) {
    super(t), t.animationState || (t.animationState = pm(t));
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
let bm = 0;
class vm extends Ge {
  constructor() {
    super(...arguments), this.id = bm++;
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
const wm = {
  animation: {
    Feature: ym
  },
  exit: {
    Feature: vm
  }
};
function Xt(e, t, r, n = { passive: !0 }) {
  return e.addEventListener(t, r, n), () => e.removeEventListener(t, r);
}
function ts(e) {
  return {
    point: {
      x: e.pageX,
      y: e.pageY
    }
  };
}
const jm = (e) => (t) => Zr(t) && e(t, ts(t));
function Ot(e, t, r, n) {
  return Xt(e, t, jm(r), n);
}
const Co = 1e-4, Nm = 1 - Co, km = 1 + Co, Po = 0.01, Tm = 0 - Po, Sm = 0 + Po;
function fe(e) {
  return e.max - e.min;
}
function _m(e, t, r) {
  return Math.abs(e - t) <= r;
}
function fi(e, t, r, n = 0.5) {
  e.origin = n, e.originPoint = te(t.min, t.max, e.origin), e.scale = fe(r) / fe(t), e.translate = te(r.min, r.max, e.origin) - e.originPoint, (e.scale >= Nm && e.scale <= km || isNaN(e.scale)) && (e.scale = 1), (e.translate >= Tm && e.translate <= Sm || isNaN(e.translate)) && (e.translate = 0);
}
function Yt(e, t, r, n) {
  fi(e.x, t.x, r.x, n ? n.originX : void 0), fi(e.y, t.y, r.y, n ? n.originY : void 0);
}
function gi(e, t, r) {
  e.min = r.min + t.min, e.max = e.min + fe(t);
}
function Cm(e, t, r) {
  gi(e.x, t.x, r.x), gi(e.y, t.y, r.y);
}
function pi(e, t, r) {
  e.min = t.min - r.min, e.max = e.min + fe(t);
}
function Bt(e, t, r) {
  pi(e.x, t.x, r.x), pi(e.y, t.y, r.y);
}
function je(e) {
  return [e("x"), e("y")];
}
const Ao = ({ current: e }) => e ? e.ownerDocument.defaultView : null, xi = (e, t) => Math.abs(e - t);
function Pm(e, t) {
  const r = xi(e.x, t.x), n = xi(e.y, t.y);
  return Math.sqrt(r ** 2 + n ** 2);
}
class Eo {
  constructor(t, r, { transformPagePoint: n, contextWindow: i = window, dragSnapToOrigin: o = !1, distanceThreshold: a = 3 } = {}) {
    if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const m = Hs(this.lastMoveEventInfo, this.history), g = this.startEvent !== null, x = Pm(m.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
      if (!g && !x)
        return;
      const { point: k } = m, { timestamp: S } = ce;
      this.history.push({ ...k, timestamp: S });
      const { onStart: v, onMove: j } = this.handlers;
      g || (v && v(this.lastMoveEvent, m), this.startEvent = this.lastMoveEvent), j && j(this.lastMoveEvent, m);
    }, this.handlePointerMove = (m, g) => {
      this.lastMoveEvent = m, this.lastMoveEventInfo = Ws(g, this.transformPagePoint), J.update(this.updatePoint, !0);
    }, this.handlePointerUp = (m, g) => {
      this.end();
      const { onEnd: x, onSessionEnd: k, resumeAnimation: S } = this.handlers;
      if (this.dragSnapToOrigin && S && S(), !(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const v = Hs(m.type === "pointercancel" ? this.lastMoveEventInfo : Ws(g, this.transformPagePoint), this.history);
      this.startEvent && x && x(m, v), k && k(m, v);
    }, !Zr(t))
      return;
    this.dragSnapToOrigin = o, this.handlers = r, this.transformPagePoint = n, this.distanceThreshold = a, this.contextWindow = i || window;
    const l = ts(t), c = Ws(l, this.transformPagePoint), { point: u } = c, { timestamp: d } = ce;
    this.history = [{ ...u, timestamp: d }];
    const { onSessionStart: h } = r;
    h && h(t, Hs(c, this.history)), this.removeListeners = Jt(Ot(this.contextWindow, "pointermove", this.handlePointerMove), Ot(this.contextWindow, "pointerup", this.handlePointerUp), Ot(this.contextWindow, "pointercancel", this.handlePointerUp));
  }
  updateHandlers(t) {
    this.handlers = t;
  }
  end() {
    this.removeListeners && this.removeListeners(), We(this.updatePoint);
  }
}
function Ws(e, t) {
  return t ? { point: t(e.point) } : e;
}
function yi(e, t) {
  return { x: e.x - t.x, y: e.y - t.y };
}
function Hs({ point: e }, t) {
  return {
    point: e,
    delta: yi(e, Mo(t)),
    offset: yi(e, Am(t)),
    velocity: Em(t, 0.1)
  };
}
function Am(e) {
  return e[0];
}
function Mo(e) {
  return e[e.length - 1];
}
function Em(e, t) {
  if (e.length < 2)
    return { x: 0, y: 0 };
  let r = e.length - 1, n = null;
  const i = Mo(e);
  for (; r >= 0 && (n = e[r], !(i.timestamp - n.timestamp > /* @__PURE__ */ _e(t))); )
    r--;
  if (!n)
    return { x: 0, y: 0 };
  const o = /* @__PURE__ */ Ae(i.timestamp - n.timestamp);
  if (o === 0)
    return { x: 0, y: 0 };
  const a = {
    x: (i.x - n.x) / o,
    y: (i.y - n.y) / o
  };
  return a.x === 1 / 0 && (a.x = 0), a.y === 1 / 0 && (a.y = 0), a;
}
function Mm(e, { min: t, max: r }, n) {
  return t !== void 0 && e < t ? e = n ? te(t, e, n.min) : Math.max(e, t) : r !== void 0 && e > r && (e = n ? te(r, e, n.max) : Math.min(e, r)), e;
}
function bi(e, t, r) {
  return {
    min: t !== void 0 ? e.min + t : void 0,
    max: r !== void 0 ? e.max + r - (e.max - e.min) : void 0
  };
}
function Dm(e, { top: t, left: r, bottom: n, right: i }) {
  return {
    x: bi(e.x, r, i),
    y: bi(e.y, t, n)
  };
}
function vi(e, t) {
  let r = t.min - e.min, n = t.max - e.max;
  return t.max - t.min < e.max - e.min && ([r, n] = [n, r]), { min: r, max: n };
}
function Rm(e, t) {
  return {
    x: vi(e.x, t.x),
    y: vi(e.y, t.y)
  };
}
function Lm(e, t) {
  let r = 0.5;
  const n = fe(e), i = fe(t);
  return i > n ? r = /* @__PURE__ */ Wt(t.min, t.max - n, e.min) : n > i && (r = /* @__PURE__ */ Wt(e.min, e.max - i, t.min)), Re(0, 1, r);
}
function Fm(e, t) {
  const r = {};
  return t.min !== void 0 && (r.min = t.min - e.min), t.max !== void 0 && (r.max = t.max - e.min), r;
}
const jr = 0.35;
function Vm(e = jr) {
  return e === !1 ? e = 0 : e === !0 && (e = jr), {
    x: wi(e, "left", "right"),
    y: wi(e, "top", "bottom")
  };
}
function wi(e, t, r) {
  return {
    min: ji(e, t),
    max: ji(e, r)
  };
}
function ji(e, t) {
  return typeof e == "number" ? e : e[t] || 0;
}
const Im = /* @__PURE__ */ new WeakMap();
class Om {
  constructor(t) {
    this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = { x: 0, y: 0 }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = ne(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = t;
  }
  start(t, { snapToCursor: r = !1, distanceThreshold: n } = {}) {
    const { presenceContext: i } = this.visualElement;
    if (i && i.isPresent === !1)
      return;
    const o = (h) => {
      const { dragSnapToOrigin: m } = this.getProps();
      m ? this.pauseAnimation() : this.stopAnimation(), r && this.snapToCursor(ts(h).point);
    }, a = (h, m) => {
      const { drag: g, dragPropagation: x, onDragStart: k } = this.getProps();
      if (g && !x && (this.openDragLock && this.openDragLock(), this.openDragLock = Xu(g), !this.openDragLock))
        return;
      this.latestPointerEvent = h, this.latestPanInfo = m, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), je((v) => {
        let j = this.getAxisMotionValue(v).get() || 0;
        if (Ee.test(j)) {
          const { projection: P } = this.visualElement;
          if (P && P.layout) {
            const D = P.layout.layoutBox[v];
            D && (j = fe(D) * (parseFloat(j) / 100));
          }
        }
        this.originPoint[v] = j;
      }), k && J.postRender(() => k(h, m)), vr(this.visualElement, "transform");
      const { animationState: S } = this.visualElement;
      S && S.setActive("whileDrag", !0);
    }, l = (h, m) => {
      this.latestPointerEvent = h, this.latestPanInfo = m;
      const { dragPropagation: g, dragDirectionLock: x, onDirectionLock: k, onDrag: S } = this.getProps();
      if (!g && !this.openDragLock)
        return;
      const { offset: v } = m;
      if (x && this.currentDirection === null) {
        this.currentDirection = Ym(v), this.currentDirection !== null && k && k(this.currentDirection);
        return;
      }
      this.updateAxis("x", m.point, v), this.updateAxis("y", m.point, v), this.visualElement.render(), S && S(h, m);
    }, c = (h, m) => {
      this.latestPointerEvent = h, this.latestPanInfo = m, this.stop(h, m), this.latestPointerEvent = null, this.latestPanInfo = null;
    }, u = () => je((h) => {
      var m;
      return this.getAnimationState(h) === "paused" && ((m = this.getAxisMotionValue(h).animation) == null ? void 0 : m.play());
    }), { dragSnapToOrigin: d } = this.getProps();
    this.panSession = new Eo(t, {
      onSessionStart: o,
      onStart: a,
      onMove: l,
      onSessionEnd: c,
      resumeAnimation: u
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin: d,
      distanceThreshold: n,
      contextWindow: Ao(this.visualElement)
    });
  }
  /**
   * @internal
   */
  stop(t, r) {
    const n = t || this.latestPointerEvent, i = r || this.latestPanInfo, o = this.isDragging;
    if (this.cancel(), !o || !i || !n)
      return;
    const { velocity: a } = i;
    this.startAnimation(a);
    const { onDragEnd: l } = this.getProps();
    l && J.postRender(() => l(n, i));
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
    if (!n || !us(t, i, this.currentDirection))
      return;
    const o = this.getAxisMotionValue(t);
    let a = this.originPoint[t] + n[t];
    this.constraints && this.constraints[t] && (a = Mm(a, this.constraints[t], this.elastic[t])), o.set(a);
  }
  resolveConstraints() {
    var o;
    const { dragConstraints: t, dragElastic: r } = this.getProps(), n = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : (o = this.visualElement.projection) == null ? void 0 : o.layout, i = this.constraints;
    t && ft(t) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : t && n ? this.constraints = Dm(n.layoutBox, t) : this.constraints = !1, this.elastic = Vm(r), i !== this.constraints && n && this.constraints && !this.hasMutatedConstraints && je((a) => {
      this.constraints !== !1 && this.getAxisMotionValue(a) && (this.constraints[a] = Fm(n.layoutBox[a], this.constraints[a]));
    });
  }
  resolveRefConstraints() {
    const { dragConstraints: t, onMeasureDragConstraints: r } = this.getProps();
    if (!t || !ft(t))
      return !1;
    const n = t.current;
    Le(n !== null, "If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop.", "drag-constraints-ref");
    const { projection: i } = this.visualElement;
    if (!i || !i.layout)
      return !1;
    const o = Bh(n, i.root, this.visualElement.getTransformPagePoint());
    let a = Rm(i.layout.layoutBox, o);
    if (r) {
      const l = r(Ih(a));
      this.hasMutatedConstraints = !!l, l && (a = go(l));
    }
    return a;
  }
  startAnimation(t) {
    const { drag: r, dragMomentum: n, dragElastic: i, dragTransition: o, dragSnapToOrigin: a, onDragTransitionEnd: l } = this.getProps(), c = this.constraints || {}, u = je((d) => {
      if (!us(d, r, this.currentDirection))
        return;
      let h = c && c[d] || {};
      a && (h = { min: 0, max: 0 });
      const m = i ? 200 : 1e6, g = i ? 40 : 1e7, x = {
        type: "inertia",
        velocity: n ? t[d] : 0,
        bounceStiffness: m,
        bounceDamping: g,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...o,
        ...h
      };
      return this.startAxisValueAnimation(d, x);
    });
    return Promise.all(u).then(l);
  }
  startAxisValueAnimation(t, r) {
    const n = this.getAxisMotionValue(t);
    return vr(this.visualElement, t), n.start(on(t, n, 0, r, this.visualElement, !1));
  }
  stopAnimation() {
    je((t) => this.getAxisMotionValue(t).stop());
  }
  pauseAnimation() {
    je((t) => {
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
    je((r) => {
      const { drag: n } = this.getProps();
      if (!us(r, n, this.currentDirection))
        return;
      const { projection: i } = this.visualElement, o = this.getAxisMotionValue(r);
      if (i && i.layout) {
        const { min: a, max: l } = i.layout.layoutBox[r];
        o.set(t[r] - te(a, l, 0.5));
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
    if (!ft(r) || !n || !this.constraints)
      return;
    this.stopAnimation();
    const i = { x: 0, y: 0 };
    je((a) => {
      const l = this.getAxisMotionValue(a);
      if (l && this.constraints !== !1) {
        const c = l.get();
        i[a] = Lm({ min: c, max: c }, this.constraints[a]);
      }
    });
    const { transformTemplate: o } = this.visualElement.getProps();
    this.visualElement.current.style.transform = o ? o({}, "") : "none", n.root && n.root.updateScroll(), n.updateLayout(), this.resolveConstraints(), je((a) => {
      if (!us(a, t, null))
        return;
      const l = this.getAxisMotionValue(a), { min: c, max: u } = this.constraints[a];
      l.set(te(c, u, i[a]));
    });
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    Im.set(this.visualElement, this);
    const t = this.visualElement.current, r = Ot(t, "pointerdown", (c) => {
      const { drag: u, dragListener: d = !0 } = this.getProps();
      u && d && this.start(c);
    }), n = () => {
      const { dragConstraints: c } = this.getProps();
      ft(c) && c.current && (this.constraints = this.resolveRefConstraints());
    }, { projection: i } = this.visualElement, o = i.addEventListener("measure", n);
    i && !i.layout && (i.root && i.root.updateScroll(), i.updateLayout()), J.read(n);
    const a = Xt(window, "resize", () => this.scalePositionWithinConstraints()), l = i.addEventListener("didUpdate", ({ delta: c, hasLayoutChanged: u }) => {
      this.isDragging && u && (je((d) => {
        const h = this.getAxisMotionValue(d);
        h && (this.originPoint[d] += c[d].translate, h.set(h.get() + c[d].translate));
      }), this.visualElement.render());
    });
    return () => {
      a(), r(), o(), l && l();
    };
  }
  getProps() {
    const t = this.visualElement.getProps(), { drag: r = !1, dragDirectionLock: n = !1, dragPropagation: i = !1, dragConstraints: o = !1, dragElastic: a = jr, dragMomentum: l = !0 } = t;
    return {
      ...t,
      drag: r,
      dragDirectionLock: n,
      dragPropagation: i,
      dragConstraints: o,
      dragElastic: a,
      dragMomentum: l
    };
  }
}
function us(e, t, r) {
  return (t === !0 || t === e) && (r === null || r === e);
}
function Ym(e, t = 10) {
  let r = null;
  return Math.abs(e.y) > t ? r = "y" : Math.abs(e.x) > t && (r = "x"), r;
}
class Bm extends Ge {
  constructor(t) {
    super(t), this.removeGroupControls = ke, this.removeListeners = ke, this.controls = new Om(t);
  }
  mount() {
    const { dragControls: t } = this.node.getProps();
    t && (this.removeGroupControls = t.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || ke;
  }
  unmount() {
    this.removeGroupControls(), this.removeListeners();
  }
}
const Ni = (e) => (t, r) => {
  e && J.postRender(() => e(t, r));
};
class zm extends Ge {
  constructor() {
    super(...arguments), this.removePointerDownListener = ke;
  }
  onPointerDown(t) {
    this.session = new Eo(t, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: Ao(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: t, onPanStart: r, onPan: n, onPanEnd: i } = this.node.getProps();
    return {
      onSessionStart: Ni(t),
      onStart: Ni(r),
      onMove: n,
      onEnd: (o, a) => {
        delete this.session, i && J.postRender(() => i(o, a));
      }
    };
  }
  mount() {
    this.removePointerDownListener = Ot(this.node.current, "pointerdown", (t) => this.onPointerDown(t));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener(), this.session && this.session.end();
  }
}
const bs = {
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
function ki(e, t) {
  return t.max === t.min ? 0 : e / (t.max - t.min) * 100;
}
const Dt = {
  correct: (e, t) => {
    if (!t.target)
      return e;
    if (typeof e == "string")
      if (Y.test(e))
        e = parseFloat(e);
      else
        return e;
    const r = ki(e, t.target.x), n = ki(e, t.target.y);
    return `${r}% ${n}%`;
  }
}, $m = {
  correct: (e, { treeScale: t, projectionDelta: r }) => {
    const n = e, i = He.parse(e);
    if (i.length > 5)
      return n;
    const o = He.createTransformer(e), a = typeof i[0] != "number" ? 1 : 0, l = r.x.scale * t.x, c = r.y.scale * t.y;
    i[0 + a] /= l, i[1 + a] /= c;
    const u = te(l, c, 0.5);
    return typeof i[2 + a] == "number" && (i[2 + a] /= u), typeof i[3 + a] == "number" && (i[3 + a] /= u), o(i);
  }
};
let qs = !1;
class Um extends bl {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement: t, layoutGroup: r, switchLayoutGroup: n, layoutId: i } = this.props, { projection: o } = t;
    hh(Wm), o && (r.group && r.group.add(o), n && n.register && i && n.register(o), qs && o.root.didUpdate(), o.addEventListener("animationComplete", () => {
      this.safeToRemove();
    }), o.setOptions({
      ...o.options,
      onExitComplete: () => this.safeToRemove()
    })), bs.hasEverUpdated = !0;
  }
  getSnapshotBeforeUpdate(t) {
    const { layoutDependency: r, visualElement: n, drag: i, isPresent: o } = this.props, { projection: a } = n;
    return a && (a.isPresent = o, qs = !0, i || t.layoutDependency !== r || r === void 0 || t.isPresent !== o ? a.willUpdate() : this.safeToRemove(), t.isPresent !== o && (o ? a.promote() : a.relegate() || J.postRender(() => {
      const l = a.getStack();
      (!l || !l.members.length) && this.safeToRemove();
    }))), null;
  }
  componentDidUpdate() {
    const { projection: t } = this.props.visualElement;
    t && (t.root.didUpdate(), Xr.postRender(() => {
      !t.currentAnimation && t.isLead() && this.safeToRemove();
    }));
  }
  componentWillUnmount() {
    const { visualElement: t, layoutGroup: r, switchLayoutGroup: n } = this.props, { projection: i } = t;
    qs = !0, i && (i.scheduleCheckAfterUnmount(), r && r.group && r.group.remove(i), n && n.deregister && n.deregister(i));
  }
  safeToRemove() {
    const { safeToRemove: t } = this.props;
    t && t();
  }
  render() {
    return null;
  }
}
function Do(e) {
  const [t, r] = ih(), n = ue(da);
  return s.jsx(Um, { ...e, layoutGroup: n, switchLayoutGroup: ue(mo), isPresent: t, safeToRemove: r });
}
const Wm = {
  borderRadius: {
    ...Dt,
    applyTo: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius"
    ]
  },
  borderTopLeftRadius: Dt,
  borderTopRightRadius: Dt,
  borderBottomLeftRadius: Dt,
  borderBottomRightRadius: Dt,
  boxShadow: $m
};
function Hm(e, t, r) {
  const n = he(e) ? e : jt(e);
  return n.start(on("", n, t, r)), n.animation;
}
const qm = (e, t) => e.depth - t.depth;
class Gm {
  constructor() {
    this.children = [], this.isDirty = !1;
  }
  add(t) {
    Er(this.children, t), this.isDirty = !0;
  }
  remove(t) {
    Mr(this.children, t), this.isDirty = !0;
  }
  forEach(t) {
    this.isDirty && this.children.sort(qm), this.isDirty = !1, this.children.forEach(t);
  }
}
function Km(e, t) {
  const r = xe.now(), n = ({ timestamp: i }) => {
    const o = i - r;
    o >= t && (We(n), e(o - t));
  };
  return J.setup(n, !0), () => We(n);
}
const Ro = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"], Xm = Ro.length, Ti = (e) => typeof e == "string" ? parseFloat(e) : e, Si = (e) => typeof e == "number" || Y.test(e);
function Zm(e, t, r, n, i, o) {
  i ? (e.opacity = te(0, r.opacity ?? 1, Jm(n)), e.opacityExit = te(t.opacity ?? 1, 0, Qm(n))) : o && (e.opacity = te(t.opacity ?? 1, r.opacity ?? 1, n));
  for (let a = 0; a < Xm; a++) {
    const l = `border${Ro[a]}Radius`;
    let c = _i(t, l), u = _i(r, l);
    if (c === void 0 && u === void 0)
      continue;
    c || (c = 0), u || (u = 0), c === 0 || u === 0 || Si(c) === Si(u) ? (e[l] = Math.max(te(Ti(c), Ti(u), n), 0), (Ee.test(u) || Ee.test(c)) && (e[l] += "%")) : e[l] = u;
  }
  (t.rotate || r.rotate) && (e.rotate = te(t.rotate || 0, r.rotate || 0, n));
}
function _i(e, t) {
  return e[t] !== void 0 ? e[t] : e.borderRadius;
}
const Jm = /* @__PURE__ */ Lo(0, 0.5, wa), Qm = /* @__PURE__ */ Lo(0.5, 0.95, ke);
function Lo(e, t, r) {
  return (n) => n < e ? 0 : n > t ? 1 : r(/* @__PURE__ */ Wt(e, t, n));
}
function Ci(e, t) {
  e.min = t.min, e.max = t.max;
}
function we(e, t) {
  Ci(e.x, t.x), Ci(e.y, t.y);
}
function Pi(e, t) {
  e.translate = t.translate, e.scale = t.scale, e.originPoint = t.originPoint, e.origin = t.origin;
}
function Ai(e, t, r, n, i) {
  return e -= t, e = Ss(e, 1 / r, n), i !== void 0 && (e = Ss(e, 1 / i, n)), e;
}
function ef(e, t = 0, r = 1, n = 0.5, i, o = e, a = e) {
  if (Ee.test(t) && (t = parseFloat(t), t = te(a.min, a.max, t / 100) - a.min), typeof t != "number")
    return;
  let l = te(o.min, o.max, n);
  e === o && (l -= t), e.min = Ai(e.min, t, r, l, i), e.max = Ai(e.max, t, r, l, i);
}
function Ei(e, t, [r, n, i], o, a) {
  ef(e, t[r], t[n], t[i], t.scale, o, a);
}
const tf = ["x", "scaleX", "originX"], sf = ["y", "scaleY", "originY"];
function Mi(e, t, r, n) {
  Ei(e.x, t, tf, r ? r.x : void 0, n ? n.x : void 0), Ei(e.y, t, sf, r ? r.y : void 0, n ? n.y : void 0);
}
function Di(e) {
  return e.translate === 0 && e.scale === 1;
}
function Fo(e) {
  return Di(e.x) && Di(e.y);
}
function Ri(e, t) {
  return e.min === t.min && e.max === t.max;
}
function rf(e, t) {
  return Ri(e.x, t.x) && Ri(e.y, t.y);
}
function Li(e, t) {
  return Math.round(e.min) === Math.round(t.min) && Math.round(e.max) === Math.round(t.max);
}
function Vo(e, t) {
  return Li(e.x, t.x) && Li(e.y, t.y);
}
function Fi(e) {
  return fe(e.x) / fe(e.y);
}
function Vi(e, t) {
  return e.translate === t.translate && e.scale === t.scale && e.originPoint === t.originPoint;
}
class nf {
  constructor() {
    this.members = [];
  }
  add(t) {
    Er(this.members, t), t.scheduleRender();
  }
  remove(t) {
    if (Mr(this.members, t), t === this.prevLead && (this.prevLead = void 0), t === this.lead) {
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
      const o = this.members[i];
      if (o.isPresent !== !1) {
        n = o;
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
function af(e, t, r) {
  let n = "";
  const i = e.x.translate / t.x, o = e.y.translate / t.y, a = (r == null ? void 0 : r.z) || 0;
  if ((i || o || a) && (n = `translate3d(${i}px, ${o}px, ${a}px) `), (t.x !== 1 || t.y !== 1) && (n += `scale(${1 / t.x}, ${1 / t.y}) `), r) {
    const { transformPerspective: u, rotate: d, rotateX: h, rotateY: m, skewX: g, skewY: x } = r;
    u && (n = `perspective(${u}px) ${n}`), d && (n += `rotate(${d}deg) `), h && (n += `rotateX(${h}deg) `), m && (n += `rotateY(${m}deg) `), g && (n += `skewX(${g}deg) `), x && (n += `skewY(${x}deg) `);
  }
  const l = e.x.scale * t.x, c = e.y.scale * t.y;
  return (l !== 1 || c !== 1) && (n += `scale(${l}, ${c})`), n || "none";
}
const Gs = ["", "X", "Y", "Z"], of = 1e3;
let lf = 0;
function Ks(e, t, r, n) {
  const { latestValues: i } = t;
  i[e] && (r[e] = i[e], t.setStaticValue(e, 0), n && (n[e] = 0));
}
function Io(e) {
  if (e.hasCheckedOptimisedAppear = !0, e.root === e)
    return;
  const { visualElement: t } = e.options;
  if (!t)
    return;
  const r = No(t);
  if (window.MotionHasOptimisedAnimation(r, "transform")) {
    const { layout: i, layoutId: o } = e.options;
    window.MotionCancelOptimisedAnimation(r, "transform", J, !(i || o));
  }
  const { parent: n } = e;
  n && !n.hasCheckedOptimisedAppear && Io(n);
}
function Oo({ attachResizeListener: e, defaultParent: t, measureScroll: r, checkIsScrollRoot: n, resetTransform: i }) {
  return class {
    constructor(a = {}, l = t == null ? void 0 : t()) {
      this.id = lf++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
        this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
      }, this.updateProjection = () => {
        this.projectionUpdateScheduled = !1, this.nodes.forEach(uf), this.nodes.forEach(gf), this.nodes.forEach(pf), this.nodes.forEach(hf);
      }, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = a, this.root = l ? l.root || l : this, this.path = l ? [...l.path, l] : [], this.parent = l, this.depth = l ? l.depth + 1 : 0;
      for (let c = 0; c < this.path.length; c++)
        this.path[c].shouldResetTransform = !0;
      this.root === this && (this.nodes = new Gm());
    }
    addEventListener(a, l) {
      return this.eventHandlers.has(a) || this.eventHandlers.set(a, new Rr()), this.eventHandlers.get(a).add(l);
    }
    notifyListeners(a, ...l) {
      const c = this.eventHandlers.get(a);
      c && c.notify(...l);
    }
    hasListeners(a) {
      return this.eventHandlers.has(a);
    }
    /**
     * Lifecycles
     */
    mount(a) {
      if (this.instance)
        return;
      this.isSVG = Qa(a) && !sh(a), this.instance = a;
      const { layoutId: l, layout: c, visualElement: u } = this.options;
      if (u && !u.current && u.mount(a), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (c || l) && (this.isLayoutDirty = !0), e) {
        let d, h = 0;
        const m = () => this.root.updateBlockedByResize = !1;
        J.read(() => {
          h = window.innerWidth;
        }), e(a, () => {
          const g = window.innerWidth;
          g !== h && (h = g, this.root.updateBlockedByResize = !0, d && d(), d = Km(m, 250), bs.hasAnimatedSinceResize && (bs.hasAnimatedSinceResize = !1, this.nodes.forEach(Yi)));
        });
      }
      l && this.root.registerSharedNode(l, this), this.options.animate !== !1 && u && (l || c) && this.addEventListener("didUpdate", ({ delta: d, hasLayoutChanged: h, hasRelativeLayoutChanged: m, layout: g }) => {
        if (this.isTreeAnimationBlocked()) {
          this.target = void 0, this.relativeTarget = void 0;
          return;
        }
        const x = this.options.transition || u.getDefaultTransition() || wf, { onLayoutAnimationStart: k, onLayoutAnimationComplete: S } = u.getProps(), v = !this.targetLayout || !Vo(this.targetLayout, g), j = !h && m;
        if (this.options.layoutRoot || this.resumeFrom || j || h && (v || !this.currentAnimation)) {
          this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
          const P = {
            ...Gr(x, "layout"),
            onPlay: k,
            onComplete: S
          };
          (u.shouldReduceMotion || this.options.layoutRoot) && (P.delay = 0, P.type = !1), this.startAnimation(P), this.setAnimationOrigin(d, j);
        } else
          h || Yi(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
        this.targetLayout = g;
      });
    }
    unmount() {
      this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
      const a = this.getStack();
      a && a.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), We(this.updateProjection);
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
      this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(xf), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: a } = this.options;
      return a && a.getProps().transformTemplate;
    }
    willUpdate(a = !0) {
      if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && Io(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
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
      this.prevTransformTemplateValue = u ? u(this.latestValues, "") : void 0, this.updateSnapshot(), a && this.notifyListeners("willUpdate");
    }
    update() {
      if (this.updateScheduled = !1, this.isUpdateBlocked()) {
        this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(Ii);
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(Oi);
        return;
      }
      this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(ff), this.nodes.forEach(cf), this.nodes.forEach(df)) : this.nodes.forEach(Oi), this.clearAllSnapshots();
      const l = xe.now();
      ce.delta = Re(0, 1e3 / 60, l - ce.timestamp), ce.timestamp = l, ce.isProcessing = !0, Vs.update.process(ce), Vs.preRender.process(ce), Vs.render.process(ce), ce.isProcessing = !1;
    }
    didUpdate() {
      this.updateScheduled || (this.updateScheduled = !0, Xr.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      this.nodes.forEach(mf), this.sharedNodes.forEach(yf);
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, J.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      J.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      this.snapshot || !this.instance || (this.snapshot = this.measure(), this.snapshot && !fe(this.snapshot.measuredBox.x) && !fe(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
    }
    updateLayout() {
      if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty))
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let c = 0; c < this.path.length; c++)
          this.path[c].updateScroll();
      const a = this.layout;
      this.layout = this.measure(!1), this.layoutCorrected = ne(), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement: l } = this.options;
      l && l.notify("LayoutMeasure", this.layout.layoutBox, a ? a.layoutBox : void 0);
    }
    updateScroll(a = "measure") {
      let l = !!(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === a && (l = !1), l && this.instance) {
        const c = n(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: a,
          isRoot: c,
          offset: r(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : c
        };
      }
    }
    resetTransform() {
      if (!i)
        return;
      const a = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, l = this.projectionDelta && !Fo(this.projectionDelta), c = this.getTransformTemplate(), u = c ? c(this.latestValues, "") : void 0, d = u !== this.prevTransformTemplateValue;
      a && this.instance && (l || Qe(this.latestValues) || d) && (i(this.instance, u), this.shouldResetTransform = !1, this.scheduleRender());
    }
    measure(a = !0) {
      const l = this.measurePageBox();
      let c = this.removeElementScroll(l);
      return a && (c = this.removeTransform(c)), jf(c), {
        animationId: this.root.animationId,
        measuredBox: l,
        layoutBox: c,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      var u;
      const { visualElement: a } = this.options;
      if (!a)
        return ne();
      const l = a.measureViewportBox();
      if (!(((u = this.scroll) == null ? void 0 : u.wasRoot) || this.path.some(Nf))) {
        const { scroll: d } = this.root;
        d && (gt(l.x, d.offset.x), gt(l.y, d.offset.y));
      }
      return l;
    }
    removeElementScroll(a) {
      var c;
      const l = ne();
      if (we(l, a), (c = this.scroll) != null && c.wasRoot)
        return l;
      for (let u = 0; u < this.path.length; u++) {
        const d = this.path[u], { scroll: h, options: m } = d;
        d !== this.root && h && m.layoutScroll && (h.wasRoot && we(l, a), gt(l.x, h.offset.x), gt(l.y, h.offset.y));
      }
      return l;
    }
    applyTransform(a, l = !1) {
      const c = ne();
      we(c, a);
      for (let u = 0; u < this.path.length; u++) {
        const d = this.path[u];
        !l && d.options.layoutScroll && d.scroll && d !== d.root && pt(c, {
          x: -d.scroll.offset.x,
          y: -d.scroll.offset.y
        }), Qe(d.latestValues) && pt(c, d.latestValues);
      }
      return Qe(this.latestValues) && pt(c, this.latestValues), c;
    }
    removeTransform(a) {
      const l = ne();
      we(l, a);
      for (let c = 0; c < this.path.length; c++) {
        const u = this.path[c];
        if (!u.instance || !Qe(u.latestValues))
          continue;
        pr(u.latestValues) && u.updateSnapshot();
        const d = ne(), h = u.measurePageBox();
        we(d, h), Mi(l, u.latestValues, u.snapshot ? u.snapshot.layoutBox : void 0, d);
      }
      return Qe(this.latestValues) && Mi(l, this.latestValues), l;
    }
    setTargetDelta(a) {
      this.targetDelta = a, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0;
    }
    setOptions(a) {
      this.options = {
        ...this.options,
        ...a,
        crossfade: a.crossfade !== void 0 ? a.crossfade : !0
      };
    }
    clearMeasurements() {
      this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1;
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== ce.timestamp && this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(a = !1) {
      var m;
      const l = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = l.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = l.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = l.isSharedProjectionDirty);
      const c = !!this.resumingFrom || this !== l;
      if (!(a || c && this.isSharedProjectionDirty || this.isProjectionDirty || (m = this.parent) != null && m.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize))
        return;
      const { layout: d, layoutId: h } = this.options;
      if (!(!this.layout || !(d || h))) {
        if (this.resolvedRelativeTargetAt = ce.timestamp, !this.targetDelta && !this.relativeTarget) {
          const g = this.getClosestProjectingParent();
          g && g.layout && this.animationProgress !== 1 ? (this.relativeParent = g, this.forceRelativeParentToResolveTarget(), this.relativeTarget = ne(), this.relativeTargetOrigin = ne(), Bt(this.relativeTargetOrigin, this.layout.layoutBox, g.layout.layoutBox), we(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
        if (!(!this.relativeTarget && !this.targetDelta) && (this.target || (this.target = ne(), this.targetWithTransforms = ne()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), Cm(this.target, this.relativeTarget, this.relativeParent.target)) : this.targetDelta ? (this.resumingFrom ? this.target = this.applyTransform(this.layout.layoutBox) : we(this.target, this.layout.layoutBox), xo(this.target, this.targetDelta)) : we(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget)) {
          this.attemptToResolveRelativeTarget = !1;
          const g = this.getClosestProjectingParent();
          g && !!g.resumingFrom == !!this.resumingFrom && !g.options.layoutScroll && g.target && this.animationProgress !== 1 ? (this.relativeParent = g, this.forceRelativeParentToResolveTarget(), this.relativeTarget = ne(), this.relativeTargetOrigin = ne(), Bt(this.relativeTargetOrigin, this.target, g.target), we(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
        }
      }
    }
    getClosestProjectingParent() {
      if (!(!this.parent || pr(this.parent.latestValues) || po(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    calcProjection() {
      var x;
      const a = this.getLead(), l = !!this.resumingFrom || this !== a;
      let c = !0;
      if ((this.isProjectionDirty || (x = this.parent) != null && x.isProjectionDirty) && (c = !1), l && (this.isSharedProjectionDirty || this.isTransformDirty) && (c = !1), this.resolvedRelativeTargetAt === ce.timestamp && (c = !1), c)
        return;
      const { layout: u, layoutId: d } = this.options;
      if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(u || d))
        return;
      we(this.layoutCorrected, this.layout.layoutBox);
      const h = this.treeScale.x, m = this.treeScale.y;
      Yh(this.layoutCorrected, this.treeScale, this.path, l), a.layout && !a.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (a.target = a.layout.layoutBox, a.targetWithTransforms = ne());
      const { target: g } = a;
      if (!g) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (Pi(this.prevProjectionDelta.x, this.projectionDelta.x), Pi(this.prevProjectionDelta.y, this.projectionDelta.y)), Yt(this.projectionDelta, this.layoutCorrected, g, this.latestValues), (this.treeScale.x !== h || this.treeScale.y !== m || !Vi(this.projectionDelta.x, this.prevProjectionDelta.x) || !Vi(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", g));
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(a = !0) {
      var l;
      if ((l = this.options.visualElement) == null || l.scheduleRender(), a) {
        const c = this.getStack();
        c && c.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = xt(), this.projectionDelta = xt(), this.projectionDeltaWithTransform = xt();
    }
    setAnimationOrigin(a, l = !1) {
      const c = this.snapshot, u = c ? c.latestValues : {}, d = { ...this.latestValues }, h = xt();
      (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !l;
      const m = ne(), g = c ? c.source : void 0, x = this.layout ? this.layout.source : void 0, k = g !== x, S = this.getStack(), v = !S || S.members.length <= 1, j = !!(k && !v && this.options.crossfade === !0 && !this.path.some(vf));
      this.animationProgress = 0;
      let P;
      this.mixTargetDelta = (D) => {
        const E = D / 1e3;
        Bi(h.x, a.x, E), Bi(h.y, a.y, E), this.setTargetDelta(h), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (Bt(m, this.layout.layoutBox, this.relativeParent.layout.layoutBox), bf(this.relativeTarget, this.relativeTargetOrigin, m, E), P && rf(this.relativeTarget, P) && (this.isProjectionDirty = !1), P || (P = ne()), we(P, this.relativeTarget)), k && (this.animationValues = d, Zm(d, u, this.latestValues, E, j, v)), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = E;
      }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(a) {
      var l, c, u;
      this.notifyListeners("animationStart"), (l = this.currentAnimation) == null || l.stop(), (u = (c = this.resumingFrom) == null ? void 0 : c.currentAnimation) == null || u.stop(), this.pendingAnimation && (We(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = J.update(() => {
        bs.hasAnimatedSinceResize = !0, this.motionValue || (this.motionValue = jt(0)), this.currentAnimation = Hm(this.motionValue, [0, 1e3], {
          ...a,
          velocity: 0,
          isSync: !0,
          onUpdate: (d) => {
            this.mixTargetDelta(d), a.onUpdate && a.onUpdate(d);
          },
          onStop: () => {
          },
          onComplete: () => {
            a.onComplete && a.onComplete(), this.completeAnimation();
          }
        }), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
      const a = this.getStack();
      a && a.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(of), this.currentAnimation.stop()), this.completeAnimation();
    }
    applyTransformsToTarget() {
      const a = this.getLead();
      let { targetWithTransforms: l, target: c, layout: u, latestValues: d } = a;
      if (!(!l || !c || !u)) {
        if (this !== a && this.layout && u && Yo(this.options.animationType, this.layout.layoutBox, u.layoutBox)) {
          c = this.target || ne();
          const h = fe(this.layout.layoutBox.x);
          c.x.min = a.target.x.min, c.x.max = c.x.min + h;
          const m = fe(this.layout.layoutBox.y);
          c.y.min = a.target.y.min, c.y.max = c.y.min + m;
        }
        we(l, c), pt(l, d), Yt(this.projectionDeltaWithTransform, this.layoutCorrected, l, d);
      }
    }
    registerSharedNode(a, l) {
      this.sharedNodes.has(a) || this.sharedNodes.set(a, new nf()), this.sharedNodes.get(a).add(l);
      const u = l.options.initialPromotionConfig;
      l.promote({
        transition: u ? u.transition : void 0,
        preserveFollowOpacity: u && u.shouldPreserveFollowOpacity ? u.shouldPreserveFollowOpacity(l) : void 0
      });
    }
    isLead() {
      const a = this.getStack();
      return a ? a.lead === this : !0;
    }
    getLead() {
      var l;
      const { layoutId: a } = this.options;
      return a ? ((l = this.getStack()) == null ? void 0 : l.lead) || this : this;
    }
    getPrevLead() {
      var l;
      const { layoutId: a } = this.options;
      return a ? (l = this.getStack()) == null ? void 0 : l.prevLead : void 0;
    }
    getStack() {
      const { layoutId: a } = this.options;
      if (a)
        return this.root.sharedNodes.get(a);
    }
    promote({ needsReset: a, transition: l, preserveFollowOpacity: c } = {}) {
      const u = this.getStack();
      u && u.promote(this, c), a && (this.projectionDelta = void 0, this.needsReset = !0), l && this.setOptions({ transition: l });
    }
    relegate() {
      const a = this.getStack();
      return a ? a.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      const { visualElement: a } = this.options;
      if (!a)
        return;
      let l = !1;
      const { latestValues: c } = a;
      if ((c.z || c.rotate || c.rotateX || c.rotateY || c.rotateZ || c.skewX || c.skewY) && (l = !0), !l)
        return;
      const u = {};
      c.z && Ks("z", a, u, this.animationValues);
      for (let d = 0; d < Gs.length; d++)
        Ks(`rotate${Gs[d]}`, a, u, this.animationValues), Ks(`skew${Gs[d]}`, a, u, this.animationValues);
      a.render();
      for (const d in u)
        a.setStaticValue(d, u[d]), this.animationValues && (this.animationValues[d] = u[d]);
      a.scheduleRender();
    }
    applyProjectionStyles(a, l) {
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible) {
        a.visibility = "hidden";
        return;
      }
      const c = this.getTransformTemplate();
      if (this.needsReset) {
        this.needsReset = !1, a.visibility = "", a.opacity = "", a.pointerEvents = ys(l == null ? void 0 : l.pointerEvents) || "", a.transform = c ? c(this.latestValues, "") : "none";
        return;
      }
      const u = this.getLead();
      if (!this.projectionDelta || !this.layout || !u.target) {
        this.options.layoutId && (a.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, a.pointerEvents = ys(l == null ? void 0 : l.pointerEvents) || ""), this.hasProjected && !Qe(this.latestValues) && (a.transform = c ? c({}, "") : "none", this.hasProjected = !1);
        return;
      }
      a.visibility = "";
      const d = u.animationValues || u.latestValues;
      this.applyTransformsToTarget();
      let h = af(this.projectionDeltaWithTransform, this.treeScale, d);
      c && (h = c(d, h)), a.transform = h;
      const { x: m, y: g } = this.projectionDelta;
      a.transformOrigin = `${m.origin * 100}% ${g.origin * 100}% 0`, u.animationValues ? a.opacity = u === this ? d.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : d.opacityExit : a.opacity = u === this ? d.opacity !== void 0 ? d.opacity : "" : d.opacityExit !== void 0 ? d.opacityExit : 0;
      for (const x in Kt) {
        if (d[x] === void 0)
          continue;
        const { correct: k, applyTo: S, isCSSVariable: v } = Kt[x], j = h === "none" ? d[x] : k(d[x], u);
        if (S) {
          const P = S.length;
          for (let D = 0; D < P; D++)
            a[S[D]] = j;
        } else
          v ? this.options.visualElement.renderState.vars[x] = j : a[x] = j;
      }
      this.options.layoutId && (a.pointerEvents = u === this ? ys(l == null ? void 0 : l.pointerEvents) || "" : "none");
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((a) => {
        var l;
        return (l = a.currentAnimation) == null ? void 0 : l.stop();
      }), this.root.nodes.forEach(Ii), this.root.sharedNodes.clear();
    }
  };
}
function cf(e) {
  e.updateLayout();
}
function df(e) {
  var r;
  const t = ((r = e.resumeFrom) == null ? void 0 : r.snapshot) || e.snapshot;
  if (e.isLead() && e.layout && t && e.hasListeners("didUpdate")) {
    const { layoutBox: n, measuredBox: i } = e.layout, { animationType: o } = e.options, a = t.source !== e.layout.source;
    o === "size" ? je((h) => {
      const m = a ? t.measuredBox[h] : t.layoutBox[h], g = fe(m);
      m.min = n[h].min, m.max = m.min + g;
    }) : Yo(o, t.layoutBox, n) && je((h) => {
      const m = a ? t.measuredBox[h] : t.layoutBox[h], g = fe(n[h]);
      m.max = m.min + g, e.relativeTarget && !e.currentAnimation && (e.isProjectionDirty = !0, e.relativeTarget[h].max = e.relativeTarget[h].min + g);
    });
    const l = xt();
    Yt(l, n, t.layoutBox);
    const c = xt();
    a ? Yt(c, e.applyTransform(i, !0), t.measuredBox) : Yt(c, n, t.layoutBox);
    const u = !Fo(l);
    let d = !1;
    if (!e.resumeFrom) {
      const h = e.getClosestProjectingParent();
      if (h && !h.resumeFrom) {
        const { snapshot: m, layout: g } = h;
        if (m && g) {
          const x = ne();
          Bt(x, t.layoutBox, m.layoutBox);
          const k = ne();
          Bt(k, n, g.layoutBox), Vo(x, k) || (d = !0), h.options.layoutRoot && (e.relativeTarget = k, e.relativeTargetOrigin = x, e.relativeParent = h);
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
function uf(e) {
  e.parent && (e.isProjecting() || (e.isProjectionDirty = e.parent.isProjectionDirty), e.isSharedProjectionDirty || (e.isSharedProjectionDirty = !!(e.isProjectionDirty || e.parent.isProjectionDirty || e.parent.isSharedProjectionDirty)), e.isTransformDirty || (e.isTransformDirty = e.parent.isTransformDirty));
}
function hf(e) {
  e.isProjectionDirty = e.isSharedProjectionDirty = e.isTransformDirty = !1;
}
function mf(e) {
  e.clearSnapshot();
}
function Ii(e) {
  e.clearMeasurements();
}
function Oi(e) {
  e.isLayoutDirty = !1;
}
function ff(e) {
  const { visualElement: t } = e.options;
  t && t.getProps().onBeforeLayoutMeasure && t.notify("BeforeLayoutMeasure"), e.resetTransform();
}
function Yi(e) {
  e.finishAnimation(), e.targetDelta = e.relativeTarget = e.target = void 0, e.isProjectionDirty = !0;
}
function gf(e) {
  e.resolveTargetDelta();
}
function pf(e) {
  e.calcProjection();
}
function xf(e) {
  e.resetSkewAndRotation();
}
function yf(e) {
  e.removeLeadSnapshot();
}
function Bi(e, t, r) {
  e.translate = te(t.translate, 0, r), e.scale = te(t.scale, 1, r), e.origin = t.origin, e.originPoint = t.originPoint;
}
function zi(e, t, r, n) {
  e.min = te(t.min, r.min, n), e.max = te(t.max, r.max, n);
}
function bf(e, t, r, n) {
  zi(e.x, t.x, r.x, n), zi(e.y, t.y, r.y, n);
}
function vf(e) {
  return e.animationValues && e.animationValues.opacityExit !== void 0;
}
const wf = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
}, $i = (e) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(e), Ui = $i("applewebkit/") && !$i("chrome/") ? Math.round : ke;
function Wi(e) {
  e.min = Ui(e.min), e.max = Ui(e.max);
}
function jf(e) {
  Wi(e.x), Wi(e.y);
}
function Yo(e, t, r) {
  return e === "position" || e === "preserve-aspect" && !_m(Fi(t), Fi(r), 0.2);
}
function Nf(e) {
  var t;
  return e !== e.root && ((t = e.scroll) == null ? void 0 : t.wasRoot);
}
const kf = Oo({
  attachResizeListener: (e, t) => Xt(e, "resize", t),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body.scrollLeft,
    y: document.documentElement.scrollTop || document.body.scrollTop
  }),
  checkIsScrollRoot: () => !0
}), Xs = {
  current: void 0
}, Bo = Oo({
  measureScroll: (e) => ({
    x: e.scrollLeft,
    y: e.scrollTop
  }),
  defaultParent: () => {
    if (!Xs.current) {
      const e = new kf({});
      e.mount(window), e.setOptions({ layoutScroll: !0 }), Xs.current = e;
    }
    return Xs.current;
  },
  resetTransform: (e, t) => {
    e.style.transform = t !== void 0 ? t : "none";
  },
  checkIsScrollRoot: (e) => window.getComputedStyle(e).position === "fixed"
}), Tf = {
  pan: {
    Feature: zm
  },
  drag: {
    Feature: Bm,
    ProjectionNode: Bo,
    MeasureLayout: Do
  }
};
function Hi(e, t, r) {
  const { props: n } = e;
  e.animationState && n.whileHover && e.animationState.setActive("whileHover", r === "Start");
  const i = "onHover" + r, o = n[i];
  o && J.postRender(() => o(t, ts(t)));
}
class Sf extends Ge {
  mount() {
    const { current: t } = this.node;
    t && (this.unmount = Zu(t, (r, n) => (Hi(this.node, n, "Start"), (i) => Hi(this.node, i, "End"))));
  }
  unmount() {
  }
}
class _f extends Ge {
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
    this.unmount = Jt(Xt(this.node.current, "focus", () => this.onFocus()), Xt(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
function qi(e, t, r) {
  const { props: n } = e;
  if (e.current instanceof HTMLButtonElement && e.current.disabled)
    return;
  e.animationState && n.whileTap && e.animationState.setActive("whileTap", r === "Start");
  const i = "onTap" + (r === "End" ? "" : r), o = n[i];
  o && J.postRender(() => o(t, ts(t)));
}
class Cf extends Ge {
  mount() {
    const { current: t } = this.node;
    t && (this.unmount = th(t, (r, n) => (qi(this.node, n, "Start"), (i, { success: o }) => qi(this.node, i, o ? "End" : "Cancel")), { useGlobalTarget: this.node.props.globalTapTarget }));
  }
  unmount() {
  }
}
const Nr = /* @__PURE__ */ new WeakMap(), Zs = /* @__PURE__ */ new WeakMap(), Pf = (e) => {
  const t = Nr.get(e.target);
  t && t(e);
}, Af = (e) => {
  e.forEach(Pf);
};
function Ef({ root: e, ...t }) {
  const r = e || document;
  Zs.has(r) || Zs.set(r, {});
  const n = Zs.get(r), i = JSON.stringify(t);
  return n[i] || (n[i] = new IntersectionObserver(Af, { root: e, ...t })), n[i];
}
function Mf(e, t, r) {
  const n = Ef(t);
  return Nr.set(e, r), n.observe(e), () => {
    Nr.delete(e), n.unobserve(e);
  };
}
const Df = {
  some: 0,
  all: 1
};
class Rf extends Ge {
  constructor() {
    super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
  }
  startObserver() {
    this.unmount();
    const { viewport: t = {} } = this.node.getProps(), { root: r, margin: n, amount: i = "some", once: o } = t, a = {
      root: r ? r.current : void 0,
      rootMargin: n,
      threshold: typeof i == "number" ? i : Df[i]
    }, l = (c) => {
      const { isIntersecting: u } = c;
      if (this.isInView === u || (this.isInView = u, o && !u && this.hasEnteredView))
        return;
      u && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", u);
      const { onViewportEnter: d, onViewportLeave: h } = this.node.getProps(), m = u ? d : h;
      m && m(c);
    };
    return Mf(this.node.current, a, l);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u")
      return;
    const { props: t, prevProps: r } = this.node;
    ["amount", "margin", "root"].some(Lf(t, r)) && this.startObserver();
  }
  unmount() {
  }
}
function Lf({ viewport: e = {} }, { viewport: t = {} } = {}) {
  return (r) => e[r] !== t[r];
}
const Ff = {
  inView: {
    Feature: Rf
  },
  tap: {
    Feature: Cf
  },
  focus: {
    Feature: _f
  },
  hover: {
    Feature: Sf
  }
}, Vf = {
  layout: {
    ProjectionNode: Bo,
    MeasureLayout: Do
  }
}, If = {
  ...wm,
  ...Ff,
  ...Tf,
  ...Vf
}, zt = /* @__PURE__ */ Vh(If, Xh), zg = () => {
  var i, o;
  const { isAuthenticated: e } = Cr(), t = (o = (i = import.meta) == null ? void 0 : i.env) == null ? void 0 : o.VITE_STRIPE_PUBLISHABLE_KEY, r = [
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
  ], n = async (a) => {
    if (!e) {
      window.location.href = "/login?returnTo=/subscribe";
      return;
    }
    try {
      const { data: { session: l }, error: c } = await Ul.auth.getSession();
      if (c || !l)
        throw new Error("User is not authenticated");
      const u = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${l.access_token}`
        },
        body: JSON.stringify({ priceId: a })
      }), d = await u.json();
      if (!u.ok)
        throw new Error(d.error || "Failed to create checkout session");
      const h = await nd(t);
      h && h.redirectToCheckout({ sessionId: d.sessionId });
    } catch (l) {
      console.error("Error creating checkout session:", l);
    }
  };
  return /* @__PURE__ */ s.jsx(s.Fragment, { children: /* @__PURE__ */ s.jsx("div", { className: "relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 overflow-hidden", children: /* @__PURE__ */ s.jsx("div", { className: "relative z-10", children: /* @__PURE__ */ s.jsxs("div", { className: "container mx-auto px-4 py-16 md:py-24", children: [
    /* @__PURE__ */ s.jsxs(
      zt.div,
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
    /* @__PURE__ */ s.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto", children: r.map((a, l) => /* @__PURE__ */ s.jsx(
      zt.div,
      {
        initial: { opacity: 0, y: 50, rotateY: -10 },
        animate: { opacity: 1, y: 0, rotateY: 0 },
        transition: { delay: l * 0.2 + 0.4, duration: 0.8, type: "spring", damping: 20 },
        className: `relative group cursor-pointer ${a.popular ? "md:scale-105 z-20" : "z-10"}`,
        children: /* @__PURE__ */ s.jsxs("div", { className: `
                  bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                  border-2 rounded-3xl p-8 h-full
                  transition-all duration-500 group-hover:-translate-y-2
                  ${a.popular ? "border-yellow-400 shadow-2xl shadow-yellow-500/25 bg-gradient-to-b from-yellow-50/80 to-white/80 dark:from-yellow-900/20 dark:to-gray-800/80" : "border-gray-200 dark:border-gray-600 shadow-xl hover:shadow-2xl hover:border-blue-400 dark:hover:border-blue-500"}
                `, children: [
          /* @__PURE__ */ s.jsxs("div", { className: "text-center mb-8", children: [
            /* @__PURE__ */ s.jsx("h3", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-4", children: a.name }),
            a.highlight && /* @__PURE__ */ s.jsx("div", { className: `inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${a.popular ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"}`, children: a.highlight }),
            /* @__PURE__ */ s.jsxs("div", { className: "mb-6", children: [
              /* @__PURE__ */ s.jsxs("div", { className: "flex items-baseline justify-center gap-2", children: [
                /* @__PURE__ */ s.jsxs("span", { className: "text-6xl font-black text-gray-900 dark:text-white", children: [
                  "$",
                  a.price
                ] }),
                /* @__PURE__ */ s.jsxs("span", { className: "text-2xl text-gray-500 dark:text-gray-400 font-medium", children: [
                  "/",
                  a.interval
                ] })
              ] }),
              a.interval === "year" && /* @__PURE__ */ s.jsxs("p", { className: "text-green-600 dark:text-green-400 font-semibold mt-2", children: [
                "Save $19.89 annually • $",
                (a.price / 12).toFixed(2),
                "/month"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("ul", { className: "space-y-4 mb-8", children: a.features.map((c, u) => /* @__PURE__ */ s.jsxs("li", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ s.jsx("div", { className: `w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${a.popular ? "bg-yellow-100 dark:bg-yellow-900/30" : "bg-blue-100 dark:bg-blue-900/30"}`, children: /* @__PURE__ */ s.jsx(
              wt,
              {
                className: `${a.popular ? "text-yellow-600 dark:text-yellow-400" : "text-blue-600 dark:text-blue-400"}`,
                size: 16
              }
            ) }),
            /* @__PURE__ */ s.jsx("span", { className: "text-gray-700 dark:text-gray-300 font-medium", children: c })
          ] }, u)) }),
          /* @__PURE__ */ s.jsxs(
            "button",
            {
              onClick: () => n(a.id),
              className: `w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg group-hover:shadow-xl ${a.popular ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-yellow-500/30" : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-500/30"} transform group-hover:-translate-y-1`,
              children: [
                /* @__PURE__ */ s.jsx("span", { children: "Get Started" }),
                /* @__PURE__ */ s.jsx(Bl, { className: "w-5 h-5 transition-transform group-hover:translate-x-1" })
              ]
            }
          )
        ] })
      },
      a.id
    )) })
  ] }) }) }) });
}, $g = () => /* @__PURE__ */ s.jsx("div", { className: "relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center", children: /* @__PURE__ */ s.jsxs(
  zt.div,
  {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.8, ease: "easeOut" },
    className: "text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-green-400 rounded-3xl p-8 md:p-12 shadow-2xl shadow-green-500/25 max-w-2xl mx-auto",
    children: [
      /* @__PURE__ */ s.jsx(
        zt.div,
        {
          initial: { scale: 0 },
          animate: { scale: 1 },
          transition: { delay: 0.2, type: "spring", stiffness: 260, damping: 20 },
          className: "mx-auto w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6 border-4 border-green-200 dark:border-green-700",
          children: /* @__PURE__ */ s.jsx(wt, { className: "w-12 h-12 text-green-600 dark:text-green-400" })
        }
      ),
      /* @__PURE__ */ s.jsx("h1", { className: "text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-teal-600 to-green-800 bg-clip-text text-transparent mb-4", children: "Subscription Successful!" }),
      /* @__PURE__ */ s.jsx("p", { className: "text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8", children: "Welcome to the Zoroasterverse! You now have access to all premium content." }),
      /* @__PURE__ */ s.jsx(
        zt.a,
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
) }), Of = async () => {
  const { data: e, error: t } = await Z.from("works").select("*").order("order_in_parent", { ascending: !0 });
  if (t) throw new Error(t.message);
  return e;
}, Yf = async (e) => {
  if (!e) return [];
  const { data: t, error: r } = await Z.from("purchases").select(`
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
    var i, o, a, l;
    return {
      id: n.id,
      user_id: n.user_id,
      product_id: n.product_id,
      purchased_at: n.purchased_at,
      status: n.status,
      product_title: ((i = n.products) == null ? void 0 : i.name) || "Unknown Product",
      product_description: (o = n.products) == null ? void 0 : o.description,
      product_type: ((a = n.products) == null ? void 0 : a.product_type) || "single_issue",
      work_id: (l = n.products) == null ? void 0 : l.work_id
    };
  });
}, Bf = async (e, t) => {
  if (!e || !t) return null;
  const { data: r, error: n } = await Z.from("user_ratings").select("rating").eq("user_id", e).eq("work_id", t).single();
  if (n && n.code !== "PGRST116") throw new Error(n.message);
  return r ? r.rating : null;
}, zf = async (e, t, r) => {
  const { data: n, error: i } = await Z.from("user_ratings").upsert({ user_id: e, work_id: t, rating: r }, { onConflict: "user_id,work_id" }).select();
  if (i) throw new Error(i.message);
  return n[0];
}, $f = ({ work: e, userLibraryItem: t, queryClient: r }) => {
  var k, S;
  const { user: n } = Cr(), [i, o] = C(null), [a, l] = C(!1), [c, u] = C(!1), { data: d } = ws({
    queryKey: ["userRating", n == null ? void 0 : n.id, e.id],
    queryFn: () => Bf((n == null ? void 0 : n.id) || "", e.id),
    enabled: !!(n != null && n.id)
    // Only run if user is logged in
  });
  le(() => {
    d !== void 0 && o(d);
  }, [d]);
  const h = Hl({
    mutationFn: ({ userId: v, workId: j, rating: P }) => zf(v, j, P),
    onSuccess: () => {
      r.invalidateQueries({ queryKey: ["userRating", n == null ? void 0 : n.id, e.id] }), r.invalidateQueries({ queryKey: ["allWorks"] });
    },
    onError: (v) => {
      alert(`Error submitting rating: ${v.message}`);
    }
  }), m = (v) => {
    if (!n) {
      alert("Please log in to submit a rating.");
      return;
    }
    n.id && h.mutate({ userId: n.id, workId: e.id, rating: v });
  }, g = e.word_count && e.target_word_count ? Math.min(100, Math.round(e.word_count / e.target_word_count * 100)) : e.progress_percentage || 0, x = "S. Azar";
  return /* @__PURE__ */ s.jsxs("article", { className: "book-card", "data-book-id": e.id, "aria-label": `Book card: ${e.title} by ${x}`, children: [
    /* @__PURE__ */ s.jsxs("div", { className: "book-main", children: [
      /* @__PURE__ */ s.jsx("div", { className: "cover", role: "img", "aria-label": `Book cover: ${e.title} by ${x}`, style: { background: e.cover_image_url ? `url(${e.cover_image_url}) center center / cover` : "var(--teal)" }, children: !e.cover_image_url && /* @__PURE__ */ s.jsxs("div", { className: "cover-content", children: [
        /* @__PURE__ */ s.jsx("div", { className: "cover-title", children: e.title }),
        /* @__PURE__ */ s.jsx("div", { className: "cover-author", children: x })
      ] }) }),
      /* @__PURE__ */ s.jsxs("div", { className: "details", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "book-header", children: [
          /* @__PURE__ */ s.jsx("h3", { className: "book-title", children: e.title }),
          /* @__PURE__ */ s.jsx("div", { className: "author", children: x })
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
              g,
              "% written"
            ] }),
            /* @__PURE__ */ s.jsxs("span", { "aria-live": "polite", children: [
              g,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ s.jsx("div", { className: "bar", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": g, "aria-label": "Author writing progress", children: /* @__PURE__ */ s.jsx("span", { style: { width: `${g}%` } }) })
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "desc", children: e.description || "No description available." }),
        /* @__PURE__ */ s.jsxs("div", { className: "rating", "aria-label": `Rating ${((k = e.rating) == null ? void 0 : k.toFixed(1)) || "0.0"} out of 5 based on ${e.reviews_count || 0} reviews`, children: [
          /* @__PURE__ */ s.jsx("span", { className: "stars", "aria-hidden": "true", children: [...Array(5)].map((v, j) => /* @__PURE__ */ s.jsx(
            er,
            {
              className: `star ${j < (i !== null ? i : Math.floor(e.rating || 0)) ? "filled" : ""}`,
              onClick: () => m(j + 1),
              onMouseEnter: () => n && o(j + 1),
              onMouseLeave: () => n && o(d ?? null),
              style: { cursor: n ? "pointer" : "default" }
            },
            j
          )) }),
          /* @__PURE__ */ s.jsx("span", { children: ((S = e.rating) == null ? void 0 : S.toFixed(1)) || "0.0" }),
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
            onClick: () => l(!a),
            "aria-expanded": a,
            children: [
              /* @__PURE__ */ s.jsx("span", { children: "Read Sample" }),
              /* @__PURE__ */ s.jsx(
                "svg",
                {
                  className: `toggle-arrow ${a ? "expanded" : ""}`,
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
    a && e.sample_content && /* @__PURE__ */ s.jsxs("div", { className: "sample-card expanded", children: [
      /* @__PURE__ */ s.jsx("div", { className: "sample-header", children: /* @__PURE__ */ s.jsxs("h4", { children: [
        'Sample from "',
        e.title,
        '"'
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "sample-excerpt", children: /* @__PURE__ */ s.jsx("p", { children: e.sample_content }) }),
      /* @__PURE__ */ s.jsx("div", { className: "sample-actions", children: t ? /* @__PURE__ */ s.jsx("button", { className: "continue-btn", children: "Continue reading" }) : /* @__PURE__ */ s.jsx("button", { className: "buy-btn", children: "Buy now" }) })
    ] })
  ] });
}, Ug = () => {
  const { user: e } = Cr(), t = Wl(), { data: r, isLoading: n, isError: i, error: o } = ws({
    // Changed from any to Work[]
    queryKey: ["allWorks"],
    queryFn: Of
  }), { data: a, isLoading: l, isError: c, error: u } = ws({
    // Changed from any to UserLibraryItem[]
    queryKey: ["userLibraryItems", e == null ? void 0 : e.id],
    queryFn: () => Yf((e == null ? void 0 : e.id) || ""),
    enabled: !!(e != null && e.id)
    // Only run query if user is logged in
  }), [d, h] = C(!0), [m, g] = C("All"), [x, k] = C("All"), S = (r == null ? void 0 : r.filter((v) => {
    const j = m === "All" || v.type === m.toLowerCase(), P = x === "All" || v.status === x.toLowerCase();
    return j && P;
  })) || [];
  return n || l ? /* @__PURE__ */ s.jsx("div", { className: "text-center py-8 text-text-light", children: "Loading library..." }) : i ? /* @__PURE__ */ s.jsxs("div", { className: "text-center py-8 text-red-400", children: [
    "Error loading works: ",
    o == null ? void 0 : o.message
  ] }) : c ? /* @__PURE__ */ s.jsxs("div", { className: "text-center py-8 text-red-400", children: [
    "Error loading user library: ",
    u == null ? void 0 : u.message
  ] }) : /* @__PURE__ */ s.jsxs("div", { className: "container mx-auto px-4 py-8 bg-background-dark text-text-light min-h-screen", children: [
    /* @__PURE__ */ s.jsx("h1", { className: "text-4xl font-bold text-text-light mb-6", children: "Your Library" }),
    d && /* @__PURE__ */ s.jsxs("div", { className: "bg-blue-900 bg-opacity-30 border border-blue-700 text-blue-200 p-4 rounded-md mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ s.jsx(zl, { size: 20 }),
        /* @__PURE__ */ s.jsx("p", { className: "text-sm", children: "Files may include a purchaser-specific watermark. Download limits: 5 per format." })
      ] }),
      /* @__PURE__ */ s.jsx("button", { onClick: () => h(!1), className: "text-blue-200 hover:text-white", children: /* @__PURE__ */ s.jsx(Rt, { size: 20 }) })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "flex flex-wrap gap-2 mb-6", children: [
      /* @__PURE__ */ s.jsx("button", { onClick: () => g("All"), className: `px-4 py-2 rounded-full text-sm font-semibold ${m === "All" ? "bg-primary-DEFAULT text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`, children: "All" }),
      /* @__PURE__ */ s.jsx("button", { onClick: () => g("Book"), className: `px-4 py-2 rounded-full text-sm font-semibold ${m === "Book" ? "bg-primary-DEFAULT text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`, children: "Books" }),
      /* @__PURE__ */ s.jsx("button", { onClick: () => g("Volume"), className: `px-4 py-2 rounded-full text-sm font-semibold ${m === "Volume" ? "bg-primary-DEFAULT text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`, children: "Volumes" }),
      /* @__PURE__ */ s.jsx("button", { onClick: () => g("Saga"), className: `px-4 py-2 rounded-full text-sm font-semibold ${m === "Saga" ? "bg-primary-DEFAULT text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`, children: "Sagas" }),
      /* @__PURE__ */ s.jsx("button", { onClick: () => g("Arc"), className: `px-4 py-2 rounded-full text-sm font-semibold ${m === "Arc" ? "bg-primary-DEFAULT text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`, children: "Arcs" }),
      /* @__PURE__ */ s.jsx("button", { onClick: () => g("Issue"), className: `px-4 py-2 rounded-full text-sm font-semibold ${m === "Issue" ? "bg-primary-DEFAULT text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`, children: "Issues" }),
      /* @__PURE__ */ s.jsxs(
        "select",
        {
          value: x,
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
    /* @__PURE__ */ s.jsx("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-8", children: /* @__PURE__ */ s.jsx("div", { className: "lg:col-span-3", children: /* @__PURE__ */ s.jsx("div", { className: "grid grid-cols-1 gap-6 mb-8", children: S.map((v) => {
      const j = a == null ? void 0 : a.find((P) => P.work_id === v.id);
      return /* @__PURE__ */ s.jsx(
        $f,
        {
          work: v,
          userLibraryItem: j,
          queryClient: t
        },
        v.id
      );
    }) }) }) })
  ] });
}, Uf = async () => {
  const { data: e, error: t } = await Z.from("posts").select("*").eq("status", "published").order("created_at", { ascending: !1 });
  if (t)
    throw new Error(t.message);
  return e;
}, Wg = () => {
  const { data: e, isLoading: t, isError: r, error: n } = ws({
    queryKey: ["blogPosts"],
    queryFn: Uf
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
      /* @__PURE__ */ s.jsx($e, { to: `/blog/${i.slug}`, className: "mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium", children: "Read More →" })
    ] }) }, i.id)) }) : /* @__PURE__ */ s.jsxs("div", { className: "text-center py-12 text-gray-600", children: [
      /* @__PURE__ */ s.jsx("p", { className: "text-xl mb-4", children: "No blog posts published yet." }),
      /* @__PURE__ */ s.jsx("p", { children: "Check back soon for new content!" })
    ] })
  ] });
}, Hg = () => /* @__PURE__ */ s.jsx("div", { children: /* @__PURE__ */ s.jsx("h1", { className: "text-3xl font-bold", children: "Timelines" }) }), Wf = sa(
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
), Vt = Me.forwardRef(
  ({ className: e, variant: t, size: r, asChild: n = !1, ...i }, o) => {
    const a = n ? ql : "button";
    return /* @__PURE__ */ s.jsx(
      a,
      {
        className: be(Wf({ variant: t, size: r, className: e })),
        ref: o,
        ...i
      }
    );
  }
);
Vt.displayName = "Button";
const zo = Me.forwardRef(
  ({ className: e, type: t, ...r }, n) => /* @__PURE__ */ s.jsx(
    "input",
    {
      type: t,
      className: be(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        e
      ),
      ref: n,
      ...r
    }
  )
);
zo.displayName = "Input";
function Hf(e) {
  if (typeof document > "u") return;
  let t = document.head || document.getElementsByTagName("head")[0], r = document.createElement("style");
  r.type = "text/css", t.appendChild(r), r.styleSheet ? r.styleSheet.cssText = e : r.appendChild(document.createTextNode(e));
}
Array(12).fill(0);
let kr = 1;
class qf {
  constructor() {
    this.subscribe = (t) => (this.subscribers.push(t), () => {
      const r = this.subscribers.indexOf(t);
      this.subscribers.splice(r, 1);
    }), this.publish = (t) => {
      this.subscribers.forEach((r) => r(t));
    }, this.addToast = (t) => {
      this.publish(t), this.toasts = [
        ...this.toasts,
        t
      ];
    }, this.create = (t) => {
      var r;
      const { message: n, ...i } = t, o = typeof (t == null ? void 0 : t.id) == "number" || ((r = t.id) == null ? void 0 : r.length) > 0 ? t.id : kr++, a = this.toasts.find((c) => c.id === o), l = t.dismissible === void 0 ? !0 : t.dismissible;
      return this.dismissedToasts.has(o) && this.dismissedToasts.delete(o), a ? this.toasts = this.toasts.map((c) => c.id === o ? (this.publish({
        ...c,
        ...t,
        id: o,
        title: n
      }), {
        ...c,
        ...t,
        id: o,
        dismissible: l,
        title: n
      }) : c) : this.addToast({
        title: n,
        ...i,
        dismissible: l,
        id: o
      }), o;
    }, this.dismiss = (t) => (t ? (this.dismissedToasts.add(t), requestAnimationFrame(() => this.subscribers.forEach((r) => r({
      id: t,
      dismiss: !0
    })))) : this.toasts.forEach((r) => {
      this.subscribers.forEach((n) => n({
        id: r.id,
        dismiss: !0
      }));
    }), t), this.message = (t, r) => this.create({
      ...r,
      message: t
    }), this.error = (t, r) => this.create({
      ...r,
      message: t,
      type: "error"
    }), this.success = (t, r) => this.create({
      ...r,
      type: "success",
      message: t
    }), this.info = (t, r) => this.create({
      ...r,
      type: "info",
      message: t
    }), this.warning = (t, r) => this.create({
      ...r,
      type: "warning",
      message: t
    }), this.loading = (t, r) => this.create({
      ...r,
      type: "loading",
      message: t
    }), this.promise = (t, r) => {
      if (!r)
        return;
      let n;
      r.loading !== void 0 && (n = this.create({
        ...r,
        promise: t,
        type: "loading",
        message: r.loading,
        description: typeof r.description != "function" ? r.description : void 0
      }));
      const i = Promise.resolve(t instanceof Function ? t() : t);
      let o = n !== void 0, a;
      const l = i.then(async (u) => {
        if (a = [
          "resolve",
          u
        ], et.isValidElement(u))
          o = !1, this.create({
            id: n,
            type: "default",
            message: u
          });
        else if (Kf(u) && !u.ok) {
          o = !1;
          const h = typeof r.error == "function" ? await r.error(`HTTP error! status: ${u.status}`) : r.error, m = typeof r.description == "function" ? await r.description(`HTTP error! status: ${u.status}`) : r.description, x = typeof h == "object" && !et.isValidElement(h) ? h : {
            message: h
          };
          this.create({
            id: n,
            type: "error",
            description: m,
            ...x
          });
        } else if (u instanceof Error) {
          o = !1;
          const h = typeof r.error == "function" ? await r.error(u) : r.error, m = typeof r.description == "function" ? await r.description(u) : r.description, x = typeof h == "object" && !et.isValidElement(h) ? h : {
            message: h
          };
          this.create({
            id: n,
            type: "error",
            description: m,
            ...x
          });
        } else if (r.success !== void 0) {
          o = !1;
          const h = typeof r.success == "function" ? await r.success(u) : r.success, m = typeof r.description == "function" ? await r.description(u) : r.description, x = typeof h == "object" && !et.isValidElement(h) ? h : {
            message: h
          };
          this.create({
            id: n,
            type: "success",
            description: m,
            ...x
          });
        }
      }).catch(async (u) => {
        if (a = [
          "reject",
          u
        ], r.error !== void 0) {
          o = !1;
          const d = typeof r.error == "function" ? await r.error(u) : r.error, h = typeof r.description == "function" ? await r.description(u) : r.description, g = typeof d == "object" && !et.isValidElement(d) ? d : {
            message: d
          };
          this.create({
            id: n,
            type: "error",
            description: h,
            ...g
          });
        }
      }).finally(() => {
        o && (this.dismiss(n), n = void 0), r.finally == null || r.finally.call(r);
      }), c = () => new Promise((u, d) => l.then(() => a[0] === "reject" ? d(a[1]) : u(a[1])).catch(d));
      return typeof n != "string" && typeof n != "number" ? {
        unwrap: c
      } : Object.assign(n, {
        unwrap: c
      });
    }, this.custom = (t, r) => {
      const n = (r == null ? void 0 : r.id) || kr++;
      return this.create({
        jsx: t(n),
        id: n,
        ...r
      }), n;
    }, this.getActiveToasts = () => this.toasts.filter((t) => !this.dismissedToasts.has(t.id)), this.subscribers = [], this.toasts = [], this.dismissedToasts = /* @__PURE__ */ new Set();
  }
}
const Ne = new qf(), Gf = (e, t) => {
  const r = (t == null ? void 0 : t.id) || kr++;
  return Ne.addToast({
    title: e,
    ...t,
    id: r
  }), r;
}, Kf = (e) => e && typeof e == "object" && "ok" in e && typeof e.ok == "boolean" && "status" in e && typeof e.status == "number", Xf = Gf, Zf = () => Ne.toasts, Jf = () => Ne.getActiveToasts(), Js = Object.assign(Xf, {
  success: Ne.success,
  info: Ne.info,
  warning: Ne.warning,
  error: Ne.error,
  custom: Ne.custom,
  message: Ne.message,
  promise: Ne.promise,
  dismiss: Ne.dismiss,
  loading: Ne.loading
}, {
  getHistory: Zf,
  getToasts: Jf
});
Hf("[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}");
const Qf = (e) => e.resultType === "page", eg = (e) => e.resultType === "folder";
function qg({ page: e, onEdit: t }) {
  var Q;
  const { folderSlug: r, pageSlug: n } = Nl(), [i, o] = C([]), [a, l] = C([]), [c, u] = C(null), [d, h] = C(""), [m, g] = C([]), [x, k] = C(!1), [S, v] = C(!0), [j, P] = C(!1), [D, E] = C(!0), [z, $] = C([]), T = ze(null), N = ze(null);
  e != null && e.excerpt;
  const A = async (y) => {
    if (!y.trim()) {
      g([]);
      return;
    }
    try {
      k(!0);
      const { data: I, error: O } = await Z.from("wiki_pages").select("id, title, excerpt, content, slug, created_by, folder_id, category_id, is_published, created_at, updated_at").or(`title.ilike.%${y}%,excerpt.ilike.%${y}%`);
      if (O) throw O;
      const F = (I || []).map((L) => ({
        ...L,
        resultType: "page",
        sections: L.sections || [],
        content: L.content || "",
        excerpt: L.excerpt || "",
        is_published: L.is_published ?? !0,
        category_id: L.category_id ?? null,
        folder_id: L.folder_id ?? null,
        created_at: L.created_at || (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: L.updated_at || (/* @__PURE__ */ new Date()).toISOString(),
        created_by: L.created_by || "",
        view_count: L.view_count || 0,
        slug: L.slug || "",
        seo_title: null,
        seo_description: null,
        seo_keywords: [],
        category: null,
        // No relational data
        user: null
        // No relational data
      }));
      g(F);
    } catch (I) {
      console.error("Search error:", I), Js.error("Failed to perform search");
    } finally {
      k(!1);
    }
  };
  le(() => {
    (async () => {
      try {
        E(!0);
        const { data: I, error: O } = await Z.from("wiki_pages").select("id, title, excerpt, content, slug, created_by, folder_id, category_id, is_published, created_at, updated_at").order("title");
        if (O) throw O;
        const F = (I || []).map((L) => ({
          ...L,
          sections: L.sections || [],
          content: L.content || "",
          excerpt: L.excerpt || "",
          is_published: L.is_published ?? !0,
          category_id: L.category_id ?? null,
          folder_id: L.folder_id ?? null,
          created_at: L.created_at || (/* @__PURE__ */ new Date()).toISOString(),
          updated_at: L.updated_at || (/* @__PURE__ */ new Date()).toISOString(),
          created_by: L.created_by || "",
          view_count: L.view_count || 0,
          slug: L.slug || "",
          seo_title: null,
          seo_description: null,
          seo_keywords: [],
          category: null,
          // No relational data
          user: null
          // No relational data
        }));
        o(F);
      } catch (I) {
        console.error("Error fetching data:", I), Js.error("Failed to load wiki pages");
      } finally {
        E(!1);
      }
    })();
  }, [n]);
  const b = (y) => {
    const I = /* @__PURE__ */ new Map(), O = [];
    return y.forEach((F) => {
      I.set(F.id, { ...F, children: [] });
    }), I.forEach((F) => {
      if (F.parent_id && I.has(F.parent_id)) {
        const L = I.get(F.parent_id);
        L && (L.children = [...L.children || [], F]);
      } else
        O.push(F);
    }), O;
  }, V = (y) => {
    var I, O, F, L, se, ge, w, p, R, G, oe;
    if (!y) return null;
    switch (y.type) {
      case "heading_1":
      case "heading_2":
      case "heading_3":
        const Ke = `h${parseInt(y.type.split("_")[1])}`;
        return /* @__PURE__ */ s.jsx(Ke, { id: `heading-${y.id}`, className: "mt-6 mb-4 font-semibold", children: (I = y.content) == null ? void 0 : I.text });
      case "paragraph":
        return /* @__PURE__ */ s.jsx("p", { className: "mb-4 leading-relaxed", children: (O = y.content) == null ? void 0 : O.text });
      case "bullet_list":
        return /* @__PURE__ */ s.jsx("ul", { className: "list-disc pl-6 mb-4 space-y-1", children: (L = (F = y.content) == null ? void 0 : F.items) == null ? void 0 : L.map((Ce, Ve) => /* @__PURE__ */ s.jsx("li", { children: Ce }, Ve)) });
      case "ordered_list":
        return /* @__PURE__ */ s.jsx("ol", { className: "list-decimal pl-6 mb-4 space-y-1", children: (ge = (se = y.content) == null ? void 0 : se.items) == null ? void 0 : ge.map((Ce, Ve) => /* @__PURE__ */ s.jsx("li", { children: Ce }, Ve)) });
      case "quote":
        return /* @__PURE__ */ s.jsx("blockquote", { className: "border-l-4 border-gray-300 pl-4 py-1 my-4 text-gray-600 italic", children: (w = y.content) == null ? void 0 : w.text });
      case "code":
        return /* @__PURE__ */ s.jsx("pre", { className: "bg-gray-100 p-4 rounded-md my-4 overflow-x-auto", children: /* @__PURE__ */ s.jsx("code", { children: (p = y.content) == null ? void 0 : p.code }) });
      case "image":
        return /* @__PURE__ */ s.jsxs("div", { className: "my-6", children: [
          /* @__PURE__ */ s.jsx(
            "img",
            {
              src: (R = y.content) == null ? void 0 : R.url,
              alt: ((G = y.content) == null ? void 0 : G.alt) || "",
              className: "max-w-full h-auto rounded-md"
            }
          ),
          ((oe = y.content) == null ? void 0 : oe.caption) && /* @__PURE__ */ s.jsx("p", { className: "text-sm text-gray-500 text-center mt-2", children: y.content.caption })
        ] });
      default:
        return null;
    }
  }, H = (y, I = 0) => y.map((O) => /* @__PURE__ */ s.jsxs("div", { className: "pl-2", children: [
    /* @__PURE__ */ s.jsxs("div", { className: "flex items-center py-1 px-2 rounded hover:bg-accent cursor-pointer", children: [
      /* @__PURE__ */ s.jsx(Qi, { size: 16, className: "mr-1 text-muted-foreground" }),
      /* @__PURE__ */ s.jsx(Pn, { size: 14, className: "mr-2 text-blue-500" }),
      /* @__PURE__ */ s.jsx("span", { className: "text-sm", children: O.name })
    ] }),
    O.children && O.children.length > 0 && /* @__PURE__ */ s.jsx("div", { className: "pl-4 border-l border-border ml-1", children: H(O.children, I + 1) }),
    /* @__PURE__ */ s.jsx("div", { className: "pl-6", children: i.filter((F) => F.folder_id === O.id).map((F) => /* @__PURE__ */ s.jsxs(
      $e,
      {
        to: `/wiki/${O.slug}/${F.slug}`,
        className: `flex items-center py-1 px-2 rounded text-sm ${n === F.slug ? "bg-accent font-medium" : "text-muted-foreground hover:bg-accent"}`,
        children: [
          /* @__PURE__ */ s.jsx(Cn, { size: 12, className: "mr-2 text-gray-500" }),
          /* @__PURE__ */ s.jsx("span", { className: "truncate", children: F.title })
        ]
      },
      F.id
    )) })
  ] }, O.id));
  return le(() => {
    const y = async () => {
      if (!d.trim()) {
        g([]);
        return;
      }
      k(!0);
      try {
        await A(d);
      } catch (O) {
        console.error("Search error:", O), Js.error("Failed to perform search");
      } finally {
        k(!1);
      }
    };
    T.current !== null && (window.clearTimeout(T.current), T.current = null);
    const I = window.setTimeout(y, 500);
    return T.current = I, () => {
      T.current !== null && (window.clearTimeout(T.current), T.current = null);
    };
  }, [d]), le(() => {
    h(""), g([]);
  }, [r, n]), /* @__PURE__ */ s.jsxs("div", { className: "flex h-screen bg-background", children: [
    S && /* @__PURE__ */ s.jsxs("div", { className: "w-64 bg-card border-r border-border flex flex-col", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "p-4 border-b border-border", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ s.jsxs("h2", { className: "font-semibold flex items-center", children: [
            /* @__PURE__ */ s.jsx(bt, { size: 16, className: "mr-2" }),
            "Wiki"
          ] }),
          /* @__PURE__ */ s.jsx(
            Vt,
            {
              variant: "ghost",
              size: "icon",
              className: "h-6 w-6",
              onClick: () => v(!1),
              children: /* @__PURE__ */ s.jsx(Se, { size: 16 })
            }
          )
        ] }),
        /* @__PURE__ */ s.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ s.jsx(lt, { size: 16, className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ s.jsx(
            zo,
            {
              type: "search",
              placeholder: "Search wiki...",
              className: "w-full pl-8 h-8 text-sm",
              value: d,
              onChange: (y) => h(y.target.value)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "flex-1 overflow-y-auto p-2", children: D ? /* @__PURE__ */ s.jsx("div", { className: "text-center py-8 text-muted-foreground", children: "Loading..." }) : H(b(a)) }),
      d && /* @__PURE__ */ s.jsxs("div", { className: "mt-2 border-t border-border pt-2", children: [
        /* @__PURE__ */ s.jsx("div", { className: "text-xs font-medium text-muted-foreground mb-2 px-2", children: x ? "Searching..." : `Found ${m.length} results` }),
        !x && m.length === 0 ? /* @__PURE__ */ s.jsxs("div", { className: "text-xs text-muted-foreground px-2 py-1", children: [
          'No results found for "',
          d,
          '"'
        ] }) : /* @__PURE__ */ s.jsx("div", { className: "space-y-1 max-h-60 overflow-y-auto", children: m.map((y) => /* @__PURE__ */ s.jsx(
          $e,
          {
            to: y.resultType === "page" ? `/wiki/${y.folder_id ? `${y.folder_id}/` : ""}${y.slug}` : `/wiki/folder/${y.id}`,
            className: "flex items-center px-2 py-1.5 text-sm rounded hover:bg-accent",
            onClick: () => h(""),
            children: Qf(y) ? /* @__PURE__ */ s.jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ s.jsx(Cn, { className: "h-4 w-4 mr-2 text-gray-500" }),
              /* @__PURE__ */ s.jsx("span", { children: y.title })
            ] }) : eg(y) ? /* @__PURE__ */ s.jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ s.jsx(Pn, { className: "h-4 w-4 mr-2 text-yellow-500" }),
              /* @__PURE__ */ s.jsx("span", { children: y.name })
            ] }) : null
          },
          `${y.resultType}-${y.id}`
        )) })
      ] })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [
      /* @__PURE__ */ s.jsxs("header", { className: "h-14 border-b border-border flex items-center px-4", children: [
        !S && /* @__PURE__ */ s.jsx(
          Vt,
          {
            variant: "ghost",
            size: "icon",
            className: "mr-2",
            onClick: () => v(!0),
            children: /* @__PURE__ */ s.jsx(Qs, { size: 18 })
          }
        ),
        /* @__PURE__ */ s.jsx("div", { className: "flex-1", children: /* @__PURE__ */ s.jsx("h1", { className: "font-semibold", children: (c == null ? void 0 : c.title) || "Welcome to the Wiki" }) }),
        /* @__PURE__ */ s.jsx(
          Vt,
          {
            variant: "ghost",
            size: "icon",
            onClick: () => P(!j),
            children: /* @__PURE__ */ s.jsx(Qs, { size: 18 })
          }
        )
      ] }),
      /* @__PURE__ */ s.jsx(
        "main",
        {
          ref: N,
          className: "flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full",
          children: c ? /* @__PURE__ */ s.jsxs("article", { className: "prose max-w-none", children: [
            (Q = c.sections) == null ? void 0 : Q.map((y) => /* @__PURE__ */ s.jsx("div", { children: V(y) }, y.id)),
            /* @__PURE__ */ s.jsxs("div", { className: "mt-12 pt-6 border-t border-border text-sm text-muted-foreground", children: [
              "Last updated: ",
              new Date(c.updated_at).toLocaleDateString()
            ] })
          ] }) : /* @__PURE__ */ s.jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center text-muted-foreground", children: [
            /* @__PURE__ */ s.jsx(bt, { size: 48, className: "mb-4 text-muted-foreground/50" }),
            /* @__PURE__ */ s.jsx("h2", { className: "text-xl font-medium mb-2", children: "Welcome to the Wiki" }),
            /* @__PURE__ */ s.jsx("p", { className: "max-w-md", children: "Select a page from the sidebar or create a new one to get started." })
          ] })
        }
      )
    ] }),
    j && /* @__PURE__ */ s.jsxs("div", { className: "w-64 border-l border-border bg-card overflow-y-auto", children: [
      /* @__PURE__ */ s.jsx("div", { className: "p-4 border-b border-border", children: /* @__PURE__ */ s.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ s.jsx("h3", { className: "font-medium", children: "Table of Contents" }),
        /* @__PURE__ */ s.jsx(
          Vt,
          {
            variant: "ghost",
            size: "icon",
            className: "h-6 w-6",
            onClick: () => P(!1),
            children: /* @__PURE__ */ s.jsx(Se, { size: 16 })
          }
        )
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "p-4", children: z.length > 0 ? /* @__PURE__ */ s.jsx("nav", { className: "space-y-1", children: z.map((y, I) => /* @__PURE__ */ s.jsx(
        "a",
        {
          href: `#${y.id}`,
          className: `block py-1 text-sm ${y.level === 1 ? "font-medium" : "text-muted-foreground"} hover:text-foreground`,
          style: { marginLeft: `${(y.level - 1) * 8}px` },
          children: y.text
        },
        I
      )) }) : /* @__PURE__ */ s.jsx("p", { className: "text-sm text-muted-foreground", children: "No headings found" }) })
    ] })
  ] });
}
const tg = Me.forwardRef(({ className: e, ...t }, r) => /* @__PURE__ */ s.jsx(
  "div",
  {
    ref: r,
    className: be("rounded-lg border bg-card text-card-foreground shadow-sm", e),
    ...t
  }
));
tg.displayName = "Card";
const sg = Me.forwardRef(({ className: e, ...t }, r) => /* @__PURE__ */ s.jsx(
  "div",
  {
    ref: r,
    className: be("flex flex-col space-y-1.5 p-6", e),
    ...t
  }
));
sg.displayName = "CardHeader";
const rg = Me.forwardRef(({ className: e, ...t }, r) => /* @__PURE__ */ s.jsx(
  "h3",
  {
    ref: r,
    className: be(
      "text-2xl font-semibold leading-none tracking-tight",
      e
    ),
    ...t
  }
));
rg.displayName = "CardTitle";
const ng = Me.forwardRef(({ className: e, ...t }, r) => /* @__PURE__ */ s.jsx(
  "p",
  {
    ref: r,
    className: be("text-sm text-muted-foreground", e),
    ...t
  }
));
ng.displayName = "CardDescription";
const ig = Me.forwardRef(({ className: e, ...t }, r) => /* @__PURE__ */ s.jsx("div", { ref: r, className: be("p-6 pt-0", e), ...t }));
ig.displayName = "CardContent";
const ag = Me.forwardRef(({ className: e, ...t }, r) => /* @__PURE__ */ s.jsx(
  "div",
  {
    ref: r,
    className: be("flex items-center p-6 pt-0", e),
    ...t
  }
));
ag.displayName = "CardFooter";
const og = sa(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
), lg = Me.forwardRef(({ className: e, ...t }, r) => /* @__PURE__ */ s.jsx(
  ra.Root,
  {
    ref: r,
    className: be(og(), e),
    ...t
  }
));
lg.displayName = ra.Root.displayName;
const cg = {
  default: "bg-primary text-primary-foreground hover:bg-primary/80 border-transparent",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent",
  outline: "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
  success: "bg-green-500 text-white hover:bg-green-600 border-transparent"
}, dg = Me.forwardRef(
  ({ className: e, variant: t = "default", ...r }, n) => /* @__PURE__ */ s.jsx(
    "div",
    {
      ref: n,
      className: be(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        cg[t],
        e
      ),
      ...r
    }
  )
);
dg.displayName = "Badge";
export {
  Tg as AdminProtectedRoute,
  kg as AdminSideNav,
  jg as AdminSideNavProvider,
  Ng as AdminSideNavToggle,
  dg as Badge,
  Wg as BlogPage,
  Vt as Button,
  tg as Card,
  ig as CardContent,
  ng as CardDescription,
  ag as CardFooter,
  sg as CardHeader,
  rg as CardTitle,
  Rg as CartIcon,
  jc as Footer,
  Pg as GlowButton,
  Cg as HomePage,
  zo as Input,
  Ig as InventoryManagementPage,
  lg as Label,
  _g as Layout,
  Ug as LibraryPage,
  Mg as LoadingSkeleton,
  Lg as LoginPage,
  Eg as MagicalParticles,
  Yg as MediaUploadPage,
  gc as Navbar,
  Vg as OrderManagementPage,
  Ag as OrnateDivider,
  Fg as ProductManagementPage,
  Sg as SimpleDashboardPage,
  Dg as StarsBackground,
  zg as SubscriptionPage,
  $g as SubscriptionSuccessPage,
  Hg as TimelinesPage,
  Hc as WikiNavItem,
  qg as WikiViewer,
  Og as WorksManagementPage,
  Wf as buttonVariants,
  Wc as cn,
  ia as useAdminSideNav
};
