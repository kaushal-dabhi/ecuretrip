# 🔧 Supabase OTP Configuration Guide

## **CONFIGURING SUPABASE TO SEND OTP CODES INSTEAD OF MAGIC LINKS**

### **🐛 Current Issue:**
You're receiving magic links in email instead of OTP codes, even though the code is set up for OTP authentication.

### **🔧 Solution: Configure Supabase Email Templates**

---

## **📋 Step-by-Step Configuration:**

### **1. Access Supabase Dashboard:**
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: `eqjpdytmsohfpohecczz`
3. Navigate to **Authentication** → **Email Templates**

### **2. Configure Email Templates:**

#### **A. Magic Link Template (Disable or Modify):**
- **Template**: `Magic Link`
- **Action**: Either disable this template or modify it to send OTP codes
- **Status**: Currently sending magic links

#### **B. OTP Template (Enable and Configure):**
- **Template**: `OTP`
- **Action**: Enable and configure this template
- **Status**: Should send 6-digit codes

### **3. Email Template Settings:**

#### **Magic Link Template Configuration:**
```html
<!-- Current (sending magic links) -->
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your user:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>

<!-- Should be changed to (sending OTP codes) -->
<h2>Your verification code</h2>
<p>Your verification code is: <strong>{{ .Token }}</strong></p>
<p>Enter this code in the application to complete your signup.</p>
```

#### **OTP Template Configuration:**
```html
<h2>Your verification code</h2>
<p>Your verification code is: <strong>{{ .Token }}</strong></p>
<p>Enter this 6-digit code in the application to complete your authentication.</p>
<p>This code will expire in 1 hour.</p>
```

---

## **🔧 Alternative: Code-Level Configuration**

### **Option 1: Force OTP Mode in Code**
```typescript
// In your sendOTP function, try this approach:
async function sendOTP() {
  if (!email.trim()) {
    setError('Please enter your email address')
    return
  }

  setLoading(true)
  setError(null)

  try {
    const supabase = createClient()
    
    // Try to force OTP mode
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        // Force OTP mode
        emailRedirectTo: undefined
      }
    })

    if (error) throw error

    setSuccess('OTP sent to your email address! Please check your email and enter the 6-digit code.')
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
// Alternative approach using resend
async function sendOTP() {
  if (!email.trim()) {
    setError('Please enter your email address')
    return
  }

  setLoading(true)
  setError(null)

  try {
    const supabase = createClient()
    
    // Use resend method to force OTP
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim()
    })

    if (error) throw error

    setSuccess('OTP sent to your email address! Please check your email and enter the 6-digit code.')
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
- Look for **Email** settings
- Check if there's an option to choose between Magic Links and OTP
- Enable OTP mode if available

### **2. Update Email Templates:**
- Go to **Authentication** → **Email Templates**
- Modify the **Magic Link** template to send codes instead
- Or enable the **OTP** template if it exists

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
