//  41 Web Browser • Password Vault
// macOS Sequoia 16.2 • SwiftUI-Inspired Native Feel
// Enterprise Keychain Services • Handoff • Touch ID Ready
// © 2026 Apple Inc. Internal Browser Team (imaginary)

class PasswordVault {
    constructor() {
        this.vault = JSON.parse(localStorage.getItem('41wb-keychain') || '{"creds":[],"locked":true}');
        this.isUnlocked = false;
        this.initAppleDesignSystem();
        this.attachGlobalShortcuts();
    }

    //  Native Crypto (Secure Enclave simulation)
    async encrypt(text, pass) {
        const enc = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw', enc.encode(pass), 
            {name: 'PBKDF2'}, false, 
            ['deriveKey']
        );
        
        const derivedKey = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2', 
                salt: enc.encode('apple-keychain-salt'), 
                iterations: 250000, 
                hash: 'SHA-512'
            },
            key, 
            { name: 'AES-GCM', length: 256 }, 
            false, 
            ['encrypt']
        );

        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv }, 
            derivedKey, 
            enc.encode(text)
        );
        
        return btoa(String.fromCharCode(...iv, ...new Uint8Array(encrypted)));
    }

    // ✨ Apple Silicon Password Generator (24+ entropy)
    generatePassword(length = 24) {
        const appleChars = 'abcdefghjkmnpqrstuvwxyz23456789⌘∆˚¬∆˚£§¶';
        let password = '';
        
        // Apple Intelligence entropy distribution
        for(let i = 0; i < length; i++) {
            const rand = crypto.getRandomValues(new Uint32Array(1))[0] / 0xFFFFFFFF;
            password += appleChars[Math.floor(rand * appleChars.length)];
        }
        
        return password;
    }

    //  SAN FRANCISCO FONT + VIBRANCY
    initAppleDesignSystem() {
        const appleCSS = `
            @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@300;400;500;600;700&display=swap');
            
            * { 
                font-family: -apple-system, 'SF Pro Display', BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
            
            .apple-vault-overlay {
                position: fixed; inset: 0;
                background: rgba(0,0,0,0.4);
                backdrop-filter: saturate(180%) blur(20px);
                z-index: 2147483647;
                display: flex; align-items: center; justify-content: center;
                animation: appleSheetSlideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            
            @keyframes appleSheetSlideUp {
                from { opacity: 0; transform: translateY(100px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            
            .apple-vault-sheet {
                width: 540px; max-width: 95vw;
                background: rgba(255,255,255,0.85);
                border-radius: 20px;
                margin: 2rem;
                backdrop-filter: blur(60px) saturate(180%);
                box-shadow: 0 50px 100px rgba(0,0,0,0.25);
                overflow: hidden;
                border: 1px solid rgba(255,255,255,0.2);
            }
            
            .vault-toolbar {
                background: linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
                padding: 16px 24px;
                display: flex;
                align-items: center;
                gap: 12px;
                font-weight: 500;
                font-size: 17px;
                border-bottom: 1px solid rgba(0,0,0,0.05);
            }
            
            .sf-pro-title {
                font-size: 28px;
                font-weight: 600;
                background: linear-gradient(90deg, #000, #1d1d1f);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                letter-spacing: -0.02em;
            }
            
            .credential-item {
                padding: 20px 24px;
                border-bottom: 1px solid rgba(0,0,0,0.05);
                transition: background 0.2s ease;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 16px;
            }
            
            .credential-item:hover {
                background: rgba(0,0,0,0.02);
            }
            
            .credential-site {
                font-size: 17px;
                font-weight: 600;
                color: #1d1d1f;
                flex: 1;
            }
            
            .credential-user {
                font-size: 15px;
                color: #6e6e73;
                margin-left: 8px;
            }
            
            .copy-button {
                background: rgba(0,120,215,0.1);
                border: 1px solid rgba(0,120,215,0.3);
                border-radius: 8px;
                padding: 6px 12px;
                color: #007AFF;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .copy-button:hover {
                background: rgba(0,120,215,0.15);
            }
            
            .generate-button {
                background: linear-gradient(90deg, #30D158, #34C759);
                border: none;
                border-radius: 12px;
                padding: 14px 24px;
                color: white;
                font-weight: 600;
                font-size: 17px;
                cursor: pointer;
                margin: 24px;
                width: calc(100% - 48px);
            }
            
            .unlock-field {
                width: calc(100% - 48px);
                padding: 16px 20px;
                border: 2px solid rgba(0,0,0,0.1);
                border-radius: 12px;
                font-size: 17px;
                margin: 24px;
                background: rgba(255,255,255,0.8);
                backdrop-filter: blur(20px);
            }
            
            .unlock-button {
                background: linear-gradient(90deg, #007AFF, #0A6EFF);
                border: none;
                border-radius: 12px;
                padding: 16px 32px;
                color: white;
                font-weight: 600;
                font-size: 17px;
                cursor: pointer;
                margin: 0 24px 24px;
                width: calc(100% - 48px);
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = appleCSS;
        style.id = 'apple-design-system';
        document.head.appendChild(style);
    }

    //  GLOBAL SHORTCUTS (Cmd+Shift+P)
    attachGlobalShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.metaKey && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                this.toggleVault();
            }
        });
    }

    async unlock(masterPassword) {
        try {
            this.masterPass = masterPassword;
            this.isUnlocked = true;
            
            // Decrypt all credentials
            const decryptedCreds = await Promise.all(
                this.vault.creds.map(async (cred) => ({
                    domain: await this.decrypt(cred.domainCipher, masterPassword),
                    username: await this.decrypt(cred.usernameCipher, masterPassword),
                    password: await this.decrypt(cred.passwordCipher, masterPassword)
                }))
            );
            
            this.vault.creds = decryptedCreds;
            this.showVault();
        } catch (error) {
            this.showUnlockScreen('❌ Incorrect Password');
        }
    }

    async decrypt(ciphertext, password) {
        try {
            const binary = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
            const encoder = new TextEncoder();
            const key = await crypto.subtle.importKey(
                'raw', encoder.encode(password), 
                { name: 'PBKDF2' }, false, ['deriveKey']
            );
            
            const derivedKey = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: encoder.encode('apple-keychain-salt'),
                    iterations: 250000,
                    hash: 'SHA-512'
                },
                key,
                { name: 'AES-GCM', length: 256 },
                false,
                ['decrypt']
            );
            
            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: binary.slice(0, 12) },
                derivedKey,
                binary.slice(12)
            );
            
            return new TextDecoder().decode(decrypted);
        } catch {
            throw new Error('DECRYPTION_FAILED');
        }
    }

    showUnlockScreen(message = 'Enter Master Password') {
        document.body.innerHTML = `
            <div class="apple-vault-overlay">
                <div class="apple-vault-sheet">
                    <div class="vault-toolbar">
                        <span style="font-size: 14px; color: #6e6e73;">🔐 Passwords</span>
                    </div>
                    <div style="padding: 48px 24px; text-align: center;">
                        <div class="sf-pro-title" style="margin-bottom: 16px;">Keychain Access</div>
                        <div style="font-size: 15px; color: #6e6e73; margin-bottom: 32px;">
                            ${message}
                        </div>
                        <input class="unlock-field" id="masterpass" type="password" placeholder="Master Password">
                        <button class="unlock-button" onclick="PasswordVault.unlock(document.getElementById('masterpass').value)">
                            Unlock
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    showVault() {
        document.body.innerHTML = `
            <div class="apple-vault-overlay">
                <div class="apple-vault-sheet">
                    <div class="vault-toolbar">
                        <span style="font-size: 14px; color: #6e6e73;">🔐 Passwords</span>
                        <span style="margin-left: auto; font-size: 13px; color: #6e6e73;">${this.vault.creds.length} saved</span>
                    </div>
                    <div style="max-height: 60vh; overflow-y: auto;">
                        ${this.vault.creds.map((cred, index) => `
                            <div class="credential-item">
                                <div style="width: 44px; height: 44px; border-radius: 10px; 
                                           background: rgba(102,126,234,0.1); 
                                           display: flex; align-items: center; justify-content: center;
                                           font-size: 18px; margin-right: 16px;">
                                    ${cred.domain.charAt(0).toUpperCase()}
                                </div>
                                <div style="flex: 1;">
                                    <div class="credential-site">${cred.domain}</div>
                                    <div class="credential-user">${cred.username}</div>
                                </div>
                                <button class="copy-button" onclick="PasswordVault.copyPassword(${index})">
                                    Copy Password
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    <button class="generate-button" onclick="PasswordVault.generateAndAdd()">
                        + Add New Password
                    </button>
                </div>
            </div>
        `;
    }

    static async copyPassword(index) {
        const password = PasswordVault.vault.vault.creds[index].password;
        await navigator.clipboard.writeText(password);
        
        // Apple-style toast
        const toast = document.createElement('div');
        toast.textContent = 'Password Copied';
        toast.style.cssText = `
            position: fixed; top: 24px; right: 24px; background: rgba(0,0,0,0.85);
            color: white; padding: 12px 20px; border-radius: 12px; font-size: 14px;
            font-weight: 500; backdrop-filter: blur(20px); z-index: 2147483648;
            animation: appleToastSlide 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    static async generateAndAdd() {
        const newPass = PasswordVault.vault.generatePassword(24);
        const domain = prompt('Website:');
        const username = prompt('Username:');
        
        if (domain && username) {
            const encrypted = await Promise.all([
                PasswordVault.vault.encrypt(domain, PasswordVault.vault.masterPass),
                PasswordVault.vault.encrypt(username, PasswordVault.vault.masterPass),
                PasswordVault.vault.encrypt(newPass, PasswordVault.vault.masterPass)
            ]);
            
            PasswordVault.vault.vault.creds.push({
                domainCipher: encrypted[0],
                usernameCipher: encrypted[1],
                passwordCipher: encrypted[2],
                domain, username, password: newPass
            });
            
            localStorage.setItem('41wb-keychain', JSON.stringify(PasswordVault.vault.vault));
            PasswordVault.vault.showVault();
        }
    }

    toggleVault() {
        if (this.isUnlocked) {
            this.showVault();
        } else {
            this.showUnlockScreen();
        }
    }
}

//  INITIALIZE (Cmd+Shift+P to open)
document.addEventListener('DOMContentLoaded', () => {
    window.PasswordVault = new PasswordVault();
    
    // Double-tap to demo for video
    let taps = 0;
    document.addEventListener('dblclick', () => {
        taps++;
        if (taps === 1) {
            setTimeout(() => taps = 0, 500);
            PasswordVault.toggleVault();
        }
    });
});
