import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Upload, X } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import dayflowLogo from '@/assets/dayflow-logo.png';

const Signup: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [employeeIdError, setEmployeeIdError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateEmployeeID = (id: string) => {
    const pattern = /^[A-Z]{6}\d{8}$/;
    return pattern.test(id);
  };

  const handleEmployeeIdChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setEmployeeId(upperValue);
    // Clear error while typing
    if (employeeIdError) {
      setEmployeeIdError('');
    }
  };

  const handleEmployeeIdBlur = () => {
    if (employeeId && !validateEmployeeID(employeeId)) {
      setEmployeeIdError('Invalid format. Use the ID provided by HR (e.g., OIJODO20220001)');
    }
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an SVG, PNG, or JPG file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload a file smaller than 2MB.',
        variant: 'destructive',
      });
      return;
    }

    // Convert to base64 for preview and storage
    const reader = new FileReader();
    reader.onloadend = () => {
      setCompanyLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeLogo = () => {
    setCompanyLogo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please ensure both passwords are the same.',
        variant: 'destructive',
      });
      return;
    }

    if (!acceptTerms) {
      toast({
        title: 'Terms required',
        description: 'Please accept the terms and conditions.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await signup(fullName, email, companyName, password, companyLogo || undefined);
      if (success) {
        toast({
          title: 'Account created!',
          description: 'Welcome to Dayflow. Your account is ready.',
        });
        navigate('/employees');
      } else {
        toast({
          title: 'Signup failed',
          description: 'Password must be at least 8 characters.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      quote="The key is not to prioritize what's on your schedule, but to schedule your priorities."
      author="Stephen Covey"
    >
      <div className="bg-card rounded-2xl shadow-medium p-8 md:p-12 border border-border">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <img src={dayflowLogo} alt="Dayflow" className="h-10 w-auto object-contain" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Get Started
        </h1>
        <p className="text-muted-foreground mb-8">
          Create your Dayflow account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Company Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Company Logo (Optional)
            </label>
            {companyLogo ? (
              <div className="relative w-[100px] h-[100px] group">
                <img
                  src={companyLogo}
                  alt="Company logo preview"
                  className="w-full h-full object-contain rounded-xl border border-border bg-background p-2"
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-input bg-muted/30 hover:border-primary'
                }`}
              >
                <Upload size={32} className="mx-auto mb-3 text-primary" />
                <p className="text-sm text-foreground font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  SVG, PNG, JPG (max. 2MB)
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg,.png,.jpg,.jpeg"
              onChange={handleInputChange}
              className="hidden"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Inc."
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Work Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Work Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Use your company email address
            </p>
          </div>

 

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all pr-12"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">At least 8 characters</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Terms Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-input text-primary focus:ring-primary"
            />
            <span className="text-sm text-muted-foreground">
              I agree to the{' '}
              <button type="button" className="text-primary hover:underline">
                Terms of Service
              </button>{' '}
              and{' '}
              <button type="button" className="text-primary hover:underline">
                Privacy Policy
              </button>
            </span>
          </label>

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-orchid-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Login Link */}
        <p className="text-center text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;
