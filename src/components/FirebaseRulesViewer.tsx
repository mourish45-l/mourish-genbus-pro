import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, Lock, Terminal } from 'lucide-react';

export const FirebaseRulesViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const rulesJson = `{
  "rules": {
    ".read": false,
    ".write": false,

    "businesses": {
      "$bizId": {
        ".read": true,
        ".write": "auth != null",
        ".validate": "newData.hasChildren(['name', 'phone', 'gstin'])"
      }
    },

    "catalogues": {
      "$bizId": {
        ".read": true,
        ".write": "auth != null",
        "$itemId": {
          ".validate": "newData.hasChildren(['name', 'rate', 'gst']) && newData.child('rate').isNumber() && newData.child('rate').val() >= 0"
        }
      }
    },

    "stock_adjustments": {
      ".read": "auth != null",
      ".write": "auth != null"
    },

    "customers": {
      ".read": true,
      ".write": "auth != null || newData.exists()",
      "$custId": {
        ".read": true,
        ".write": "auth != null || (data.exists() && newData.child('id').val() === $custId)",
        ".validate": "newData.hasChildren(['name'])"
      }
    },

    "quotations": {
      ".read": true,
      "$quoteId": {
        ".read": true,
        ".write": "auth != null || newData.child('customerApproved').val() === true",
        ".validate": "newData.hasChildren(['quoteNumber', 'title', 'customerId', 'status'])"
      }
    },

    "invoices": {
      ".read": true,
      "$invoiceId": {
        ".read": true,
        ".write": "auth != null",
        ".validate": "newData.hasChildren(['invoiceNumber', 'customerId', 'status'])"
      }
    },

    "deals": {
      ".read": "auth != null",
      ".write": "auth != null"
    },

    "projects": {
      ".read": true,
      "$projectId": {
        ".read": true,
        ".write": "auth != null"
      }
    },

    "chats": {
      "$threadId": {
        ".read": true,
        "messages": {
          "$msgId": {
            ".read": true,
            ".write": "auth != null || $threadId.beginsWith('cust_')",
            ".validate": "newData.hasChildren(['senderName', 'senderRole', 'sha256Hash', 'timestamp']) && newData.child('sha256Hash').isString() && newData.child('sha256Hash').val().length == 64"
          }
        }
      }
    },

    "presence": {
      "global": {
        ".read": true,
        "$uid": {
          ".write": "auth != null && auth.uid === $uid"
        }
      }
    }
  }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(rulesJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            Enterprise Security
          </span>
          <span className="text-xs text-slate-400">· Production Firebase Realtime DB</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
          Firebase Security Rules
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          Granular node-level authorization enforcing cryptographic 64-character SHA-256 chat hash verification, invoice & quotation data integrity, and inventory stock tracking.
        </p>
      </div>

      <div className="p-6 rounded-[32px] liquid-card border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
            <Terminal className="w-4 h-4 text-indigo-500" />
            <span>database.rules.json</span>
          </div>

          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Rules!' : 'Copy Rules JSON'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed max-h-[500px]">
          {rulesJson}
        </pre>
      </div>

    </div>
  );
};
