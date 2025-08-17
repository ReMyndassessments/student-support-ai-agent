import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search, Filter, BookOpen, Download, Settings, Clock, Users, Tag, ArrowLeft, Lightbulb, Copy, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import backend from '~backend/client';
import type { Resource } from '~backend/resources/list';
import type { CategoriesResponse } from '~backend/resources/categories';

export function ResourceLibrary() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<CategoriesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedConcernType, setSelectedConcernType] = useState('');
  const [selectedGradeLevel, setSelectedGradeLevel] = useState('');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isCustomizeDialogOpen, setIsCustomizeDialogOpen] = useState(false);
  const [customizationForm, setCustomizationForm] = useState({
    studentName: '',
    grade: '',
    specificGoals: [''],
    timeframe: '',
    additionalNotes: ''
  });
  const [customizedContent, setCustomizedContent] = useState('');
  const [customizationSuggestions, setCustomizationSuggestions] = useState<string[]>([]);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [copiedResourceId, setCopiedResourceId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
    loadResources();
  }, []);

  useEffect(() => {
    loadResources();
  }, [searchTerm, selectedCategory, selectedType, selectedConcernType, selectedGradeLevel]);

  const loadCategories = async () => {
    try {
      const response = await backend.resources.categories();
      setCategories(response);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "Error",
        description: "Failed to load resource categories.",
        variant: "destructive"
      });
    }
  };

  const loadResources = async () => {
    try {
      setLoading(true);
      const response = await backend.resources.list({
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
        type: selectedType || undefined,
        concernType: selectedConcernType || undefined,
        gradeLevel: selectedGradeLevel || undefined,
        limit: 50
      });
      setResources(response.resources);
    } catch (error) {
      console.error('Error loading resources:', error);
      toast({
        title: "Error",
        description: "Failed to load resources. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCustomizeResource = async () => {
    if (!selectedResource) return;

    setIsCustomizing(true);
    try {
      const goals = customizationForm.specificGoals.filter(goal => goal.trim() !== '');
      
      const response = await backend.resources.customize({
        resourceId: selectedResource.id,
        customizations: {
          studentName: customizationForm.studentName || undefined,
          grade: customizationForm.grade || undefined,
          specificGoals: goals.length > 0 ? goals : undefined,
          timeframe: customizationForm.timeframe || undefined,
          additionalNotes: customizationForm.additionalNotes || undefined
        }
      });

      setCustomizedContent(response.customizedContent);
      setCustomizationSuggestions(response.suggestions);
      
      toast({
        title: "Resource Customized",
        description: "The resource has been customized for your student."
      });
    } catch (error) {
      console.error('Error customizing resource:', error);
      toast({
        title: "Error",
        description: "Failed to customize resource. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCustomizing(false);
    }
  };

  const handleCopyContent = async (content: string, resourceId: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedResourceId(resourceId);
      setTimeout(() => setCopiedResourceId(null), 2000);
      toast({
        title: "Copied!",
        description: "Resource content copied to clipboard."
      });
    } catch (error) {
      console.error('Error copying content:', error);
      toast({
        title: "Error",
        description: "Failed to copy content to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadResource = (resource: Resource) => {
    const content = customizedContent || resource.content;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resource.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Resource downloaded successfully."
    });
  };

  const addGoalField = () => {
    setCustomizationForm(prev => ({
      ...prev,
      specificGoals: [...prev.specificGoals, '']
    }));
  };

  const updateGoal = (index: number, value: string) => {
    setCustomizationForm(prev => ({
      ...prev,
      specificGoals: prev.specificGoals.map((goal, i) => i === index ? value : goal)
    }));
  };

  const removeGoal = (index: number) => {
    setCustomizationForm(prev => ({
      ...prev,
      specificGoals: prev.specificGoals.filter((_, i) => i !== index)
    }));
  };

  const resetCustomizationForm = () => {
    setCustomizationForm({
      studentName: '',
      grade: '',
      specificGoals: [''],
      timeframe: '',
      additionalNotes: ''
    });
    setCustomizedContent('');
    setCustomizationSuggestions([]);
  };

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200';
      default:
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
    }
  };

  const formatContent = (content: string) => {
    const lines = content.split('\n');
    const formattedLines = lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) return <br key={index} />;
      
      if (trimmedLine.startsWith('# ')) {
        return (
          <h1 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-4 first:mt-0">
            {trimmedLine.replace('# ', '')}
          </h1>
        );
      }
      
      if (trimmedLine.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-semibold text-gray-800 mt-5 mb-3">
            {trimmedLine.replace('## ', '')}
          </h2>
        );
      }
      
      if (trimmedLine.startsWith('### ')) {
        return (
          <h3 key={index} className="text-lg font-medium text-gray-800 mt-4 mb-2">
            {trimmedLine.replace('### ', '')}
          </h3>
        );
      }
      
      if (trimmedLine.startsWith('#### ')) {
        return (
          <h4 key={index} className="text-base font-medium text-gray-700 mt-3 mb-2">
            {trimmedLine.replace('#### ', '')}
          </h4>
        );
      }
      
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        return (
          <p key={index} className="font-semibold text-gray-800 mt-3 mb-1">
            {trimmedLine.replace(/\*\*/g, '')}
          </p>
        );
      }
      
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        return (
          <div key={index} className="ml-4 mb-1 flex items-start">
            <span className="text-blue-500 mr-2 mt-1.5 text-xs">•</span>
            <span className="text-gray-700">{trimmedLine.replace(/^[-*]\s*/, '')}</span>
          </div>
        );
      }
      
      if (/^\d+\./.test(trimmedLine)) {
        return (
          <div key={index} className="mb-1">
            <span className="font-medium text-gray-800">{trimmedLine}</span>
          </div>
        );
      }
      
      if (trimmedLine.startsWith('☐ ')) {
        return (
          <div key={index} className="ml-4 mb-1 flex items-start">
            <span className="text-gray-400 mr-2 mt-1">☐</span>
            <span className="text-gray-700">{trimmedLine.replace('☐ ', '')}</span>
          </div>
        );
      }
      
      if (trimmedLine.startsWith('```')) {
        return null; // Skip code block markers for now
      }
      
      if (trimmedLine.startsWith('|')) {
        return (
          <div key={index} className="font-mono text-sm bg-gray-50 p-2 rounded mb-1">
            {trimmedLine}
          </div>
        );
      }
      
      return (
        <p key={index} className="text-gray-700 mb-2 leading-relaxed">
          {trimmedLine}
        </p>
      );
    });
    
    return formattedLines;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Back Button */}
        <div className="flex items-center">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors hover:bg-white/60 px-3 py-2 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center relative">
          <div className="absolute top-0 left-1/4 w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-5 right-1/3 w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
          
          <div className="relative">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl shadow-xl mb-4">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Resource Library
            </h1>
            <p className="text-gray-600">
              Intervention templates, strategies, and educational materials
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-600 via-slate-600 to-gray-700 text-white rounded-t-3xl">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                <Filter className="h-6 w-6" />
              </div>
              Search & Filter Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="search" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search
                </Label>
                <Input
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search resources..."
                  className="border-gray-200 rounded-xl focus:border-gray-500 focus:ring-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="border-gray-200 rounded-xl">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    {categories?.categories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name} ({category.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="border-gray-200 rounded-xl">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All types</SelectItem>
                    {categories?.types.map((type) => (
                      <SelectItem key={type.name} value={type.name}>
                        {type.name} ({type.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Concern Type</Label>
                <Select value={selectedConcernType} onValueChange={setSelectedConcernType}>
                  <SelectTrigger className="border-gray-200 rounded-xl">
                    <SelectValue placeholder="All concern types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All concern types</SelectItem>
                    {categories?.concernTypes.map((concernType) => (
                      <SelectItem key={concernType} value={concernType}>
                        {concernType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Grade Level</Label>
                <Select value={selectedGradeLevel} onValueChange={setSelectedGradeLevel}>
                  <SelectTrigger className="border-gray-200 rounded-xl">
                    <SelectValue placeholder="All grade levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All grade levels</SelectItem>
                    {categories?.gradeLevels.map((gradeLevel) => (
                      <SelectItem key={gradeLevel} value={gradeLevel}>
                        {gradeLevel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setSelectedType('');
                    setSelectedConcernType('');
                    setSelectedGradeLevel('');
                  }}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-white/80 rounded-xl"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center animate-pulse">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
              <p className="text-gray-600 font-medium">Loading resources...</p>
            </div>
          </div>
        ) : resources.length === 0 ? (
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl">
            <CardContent className="text-center py-16">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-500 text-lg">
                No resources found matching your criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {resources.map((resource) => (
              <Card key={resource.id} className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-t-3xl">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <CardTitle className="text-xl leading-tight">
                        {resource.title}
                      </CardTitle>
                      <p className="text-blue-100 text-sm leading-relaxed">
                        {resource.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30 rounded-xl px-3 py-1">
                          {resource.category}
                        </Badge>
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30 rounded-xl px-3 py-1">
                          {resource.type}
                        </Badge>
                        <Badge className={`${getDifficultyColor(resource.difficultyLevel)} rounded-xl px-3 py-1 font-medium`}>
                          {resource.difficultyLevel}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-6">
                  {/* Resource Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {resource.estimatedTime && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>{resource.estimatedTime}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4 text-green-500" />
                      <span>{resource.gradeLevels.join(', ')}</span>
                    </div>
                  </div>

                  {/* Concern Types */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Addresses
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {resource.concernTypes.map((type, index) => (
                        <Badge key={index} variant="outline" className="bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-purple-200 rounded-xl px-3 py-1">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  {resource.tags.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {resource.tags.slice(0, 4).map((tag, index) => (
                          <Badge key={index} variant="outline" className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200 rounded-xl px-2 py-1 text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {resource.tags.length > 4 && (
                          <Badge variant="outline" className="bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200 rounded-xl px-2 py-1 text-xs">
                            +{resource.tags.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Materials Needed */}
                  {resource.materialsNeeded && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Materials Needed</h4>
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-xl border border-amber-200">
                        <p className="text-sm text-amber-800">{resource.materialsNeeded}</p>
                      </div>
                    </div>
                  )}

                  {/* Content Preview */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Content Preview</h4>
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-200 max-h-40 overflow-y-auto">
                      <div className="prose prose-sm max-w-none">
                        {formatContent(resource.content.substring(0, 300) + '...')}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg rounded-xl px-4 py-2"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          View Full
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto rounded-3xl">
                        <DialogHeader>
                          <DialogTitle className="text-xl">{resource.title}</DialogTitle>
                          <DialogDescription>
                            {resource.description}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="prose max-w-none py-4">
                          {formatContent(resource.content)}
                        </div>
                        <DialogFooter className="gap-2">
                          <Button
                            onClick={() => handleCopyContent(resource.content, resource.id)}
                            variant="outline"
                            className="rounded-xl"
                          >
                            {copiedResourceId === resource.id ? (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => handleDownloadResource(resource)}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {resource.isCustomizable && (
                      <Dialog open={isCustomizeDialogOpen} onOpenChange={setIsCustomizeDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedResource(resource);
                              resetCustomizationForm();
                            }}
                            className="border-purple-300 text-purple-700 hover:bg-purple-50 rounded-xl px-4 py-2"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Customize
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto rounded-3xl">
                          <DialogHeader>
                            <DialogTitle className="text-xl">Customize Resource</DialogTitle>
                            <DialogDescription>
                              Personalize this resource for your specific student and situation.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="studentName">Student Name</Label>
                                <Input
                                  id="studentName"
                                  value={customizationForm.studentName}
                                  onChange={(e) => setCustomizationForm(prev => ({ ...prev, studentName: e.target.value }))}
                                  placeholder="Enter student's name"
                                  className="rounded-xl"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="grade">Grade</Label>
                                <Input
                                  id="grade"
                                  value={customizationForm.grade}
                                  onChange={(e) => setCustomizationForm(prev => ({ ...prev, grade: e.target.value }))}
                                  placeholder="e.g., 3rd, 7th, 11th"
                                  className="rounded-xl"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Specific Goals for This Student</Label>
                              {customizationForm.specificGoals.map((goal, index) => (
                                <div key={index} className="flex gap-2">
                                  <Input
                                    value={goal}
                                    onChange={(e) => updateGoal(index, e.target.value)}
                                    placeholder={`Goal ${index + 1}`}
                                    className="rounded-xl"
                                  />
                                  {customizationForm.specificGoals.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeGoal(index)}
                                      className="rounded-xl"
                                    >
                                      Remove
                                    </Button>
                                  )}
                                </div>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addGoalField}
                                className="rounded-xl"
                              >
                                Add Goal
                              </Button>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="timeframe">Implementation Timeframe</Label>
                              <Input
                                id="timeframe"
                                value={customizationForm.timeframe}
                                onChange={(e) => setCustomizationForm(prev => ({ ...prev, timeframe: e.target.value }))}
                                placeholder="e.g., 2 weeks, 1 month, ongoing"
                                className="rounded-xl"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="additionalNotes">Additional Notes</Label>
                              <Textarea
                                id="additionalNotes"
                                value={customizationForm.additionalNotes}
                                onChange={(e) => setCustomizationForm(prev => ({ ...prev, additionalNotes: e.target.value }))}
                                placeholder="Any additional context or modifications needed..."
                                rows={3}
                                className="rounded-xl resize-none"
                              />
                            </div>

                            {customizedContent && (
                              <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-lg font-semibold">Customized Resource</h3>
                                  <Badge className="bg-green-100 text-green-800 rounded-xl">
                                    Ready to Use
                                  </Badge>
                                </div>
                                
                                {customizationSuggestions.length > 0 && (
                                  <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl">
                                    <Lightbulb className="h-4 w-4 text-blue-600" />
                                    <AlertDescription className="text-blue-800">
                                      <strong>Implementation Tips:</strong>
                                      <ul className="mt-2 space-y-1">
                                        {customizationSuggestions.map((suggestion, index) => (
                                          <li key={index} className="text-sm">• {suggestion}</li>
                                        ))}
                                      </ul>
                                    </AlertDescription>
                                  </Alert>
                                )}

                                <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-2xl border border-gray-200 max-h-60 overflow-y-auto">
                                  <div className="prose max-w-none">
                                    {formatContent(customizedContent)}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <DialogFooter className="gap-2">
                            <Button
                              onClick={handleCustomizeResource}
                              disabled={isCustomizing}
                              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl"
                            >
                              {isCustomizing ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Customizing...
                                </>
                              ) : (
                                <>
                                  <Settings className="h-4 w-4 mr-2" />
                                  Customize Resource
                                </>
                              )}
                            </Button>
                            
                            {customizedContent && (
                              <>
                                <Button
                                  onClick={() => handleCopyContent(customizedContent, resource.id)}
                                  variant="outline"
                                  className="rounded-xl"
                                >
                                  {copiedResourceId === resource.id ? (
                                    <>
                                      <Check className="h-4 w-4 mr-2" />
                                      Copied!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-4 w-4 mr-2" />
                                      Copy
                                    </>
                                  )}
                                </Button>
                                <Button
                                  onClick={() => handleDownloadResource(resource)}
                                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </Button>
                              </>
                            )}
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyContent(resource.content, resource.id)}
                      className="border-gray-300 text-gray-700 hover:bg-white/80 rounded-xl px-4 py-2"
                    >
                      {copiedResourceId === resource.id ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadResource(resource)}
                      className="border-gray-300 text-gray-700 hover:bg-white/80 rounded-xl px-4 py-2"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
