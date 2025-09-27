# 🔧 Supabase Email Configuration Fix

## **ISSUE: Still Receiving Magic Links Instead of OTP Codes**

### **Problem:**
Even though the code is set up for OTP-only authentication, Supabase is still sending magic links in emails instead of OTP codes.

### **Root Cause:**
This is a **Supabase dashboard configuration issue**, not a code issue. The email templates in your Supabase project are configured to send magic links.

---

## **🛠️ Solution: Configure Supabase Dashboard**

### **Step 1: Access Supabase Dashboard**
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: `eqjpdytmsohfpohecczz`
3. Navigate to **Authentication** → **Email Templates**

### **Step 2: Update Email Templates**

#### **A. Magic Link Template (Current Issue)**
- **Template**: `Magic Link`
- **Current Content**: Sends magic links
- **Action**: **DISABLE** this template or modify it

#### **B. OTP Template (What We Need)**
- **Template**: `OTP` or `Email OTP`
- **Current Status**: May be disabled or not configured
- **Action**: **ENABLE** and configure this template

### **Step 3: Configure OTP Email Template**

#### **OTP Template Content:**
```html
<h2>Your verification code</h2>
<p>Your verification code is: <strong>{{ .Token }}</strong></p>
<p>Enter this 6-digit code in the application to complete your authentication.</p>
<p>This code will expire in 1 hour.</p>
<p>If you didn't request this code, please ignore this email.</p>
```

#### **Template Settings:**
- **Subject**: `Your verification code`
- **From**: `Supabase Auth <noreply@mail.app.supabase.io>`
- **Template**: `OTP` or `Email OTP`

---

## **🔧 Alternative: Code-Level Configuration**

### **Option 1: Force OTP Mode in Code**
```typescript
// Try this approach in your sendOTP function:
async function sendOTP() {
  if (!email.trim()) {
    setError('Please enter your email address')
    return
  }

  setLoading(true)
  setError(null)

  try {
    const supabase = createClient()
    
    // Try to force OTP mode by using resend
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim()
    })

    if (error) throw error

    setSuccess('OTP code sent to your email address! Please check your email and enter the 6-digit code.')
    setStep('otp')
  } catch (err: any) {
    setError(err.message || 'Failed to send OTP')
  } finally {
    setLoading(false)
  }
}
```

### **Option 2: Use Different Supabase Method**
```typescript
// Alternative approach using signInWithPassword
async function sendOTP() {
  if (!email.trim()) {
    setError('Please enter your email address')
    return
  }

  setLoading(true)
  setError(null)

  try {
    const supabase = createClient()
    
    // Try using signInWithPassword with a temporary password
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: 'temp-password-' + Date.now()
    })

    if (error && error.message.includes('Invalid login credentials')) {
      // This is expected, now try OTP
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true
        }
      })
      
      if (otpError) throw otpError
    } else if (error) {
      throw error
    }

    setSuccess('OTP code sent to your email address! Please check your email and enter the 6-digit code.')
    setStep('otp')
  } catch (err: any) {
    setError(err.message || 'Failed to send OTP')
  } finally {
    setLoading(false)
  }
}
```

---

## **🎯 Recommended Approach:**

### **1. Check Supabase Dashboard Settings:**
- Go to **Authentication** → **Settings**
- Look for **Email** configuration
- Check if there's an option to choose between Magic Links and OTP
- Enable OTP mode if available

### **2. Update Email Templates:**
- Go to **Authentication** → **Email Templates**
- Find the **OTP** template
- Enable it and configure it to send codes
- Disable or modify the **Magic Link** template

### **3. Test Configuration:**
- Send a test OTP
- Check if you receive a 6-digit code instead of a magic link
- Verify the code works in your application

---

## **🔍 Troubleshooting:**

### **If Still Getting Magic Links:**

#### **Check Supabase Project Settings:**
1. **Authentication** → **Settings**
2. Look for **Email** configuration
3. Check **Site URL** and **Redirect URLs**
4. Look for **Email Template** settings

#### **Check Email Provider:**
1. **Authentication** → **Settings** → **Email**
2. Check if using custom SMTP or Supabase default
3. Custom SMTP might have different template settings

#### **Check API Configuration:**
1. Look for any environment variables
2. Check if there are specific OTP-related settings
3. Verify the Supabase client configuration

---

## **📱 Alternative: Accept Magic Links**

### **If OTP Configuration is Complex:**

#### **Option 1: Handle Magic Links in Code**
```typescript
// Add magic link handling back to your code
useEffect(() => {
  // Check for magic link parameters
  const urlParams = new URLSearchParams(window.location.search)
  const accessToken = urlParams.get('access_token')
  const refreshToken = urlParams.get('refresh_token')
  
  if (accessToken && refreshToken) {
    // Handle magic link authentication
    handleMagicLinkAuth(accessToken, refreshToken)
  }
}, [])

async function handleMagicLinkAuth(accessToken: string, refreshToken: string) {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    })
    
    if (error) throw error
    
    // Continue with profile creation
    setStep('profile')
  } catch (err: any) {
    setError('Authentication failed')
  }
}
```

#### **Option 2: Use Magic Links with Better UX**
- Keep the magic link flow
- Add better error handling
- Improve the user experience
- Add loading states and feedback

---

## **🎉 Final Recommendation:**

### **Best Approach:**
1. **First**: Try to configure Supabase to send OTP codes
2. **If that fails**: Implement magic link handling in your code
3. **As last resort**: Use a different authentication method

### **Quick Fix:**
- Accept that magic links are being sent
- Implement proper magic link handling in your code
- Provide a better user experience with magic links

---

## **📞 Next Steps:**

1. **Check your Supabase dashboard** for email template settings
2. **Try the code modifications** suggested above
3. **Test the authentication flow** to see what works
4. **Choose the approach** that works best for your setup

**The key is to either configure Supabase properly or handle the magic links correctly in your code!** 🚀
