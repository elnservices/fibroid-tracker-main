import { BookOpen, FileText, Heart, Info, Newspaper, ExternalLink, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import UserMenu from '@/components/UserMenu';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Education = () => {
  const resources = [
    {
      title: 'Understanding Uterine Fibroids',
      description: 'Learn about fibroid types, symptoms, and treatment options',
      icon: Heart,
    },
    {
      title: 'Living with Endometriosis',
      description: 'Comprehensive guide to managing endometriosis symptoms',
      icon: Info,
    },
    {
      title: 'PCOS Management',
      description: 'Information about Polycystic Ovary Syndrome and lifestyle tips',
      icon: FileText,
    },
  ];

  const medicalNews = [
    {
      title: 'New Treatment Options for Fibroids Show Promise',
      date: '2025-01-15',
      source: 'Medical Research Journal',
      summary: 'Recent clinical trials demonstrate effectiveness of minimally invasive procedures...',
    },
    {
      title: 'Understanding Hormonal Impacts on Fibroid Growth',
      date: '2025-01-10',
      source: 'Reproductive Health Today',
      summary: 'Latest research reveals how hormonal fluctuations affect fibroid development...',
    },
    {
      title: 'Lifestyle Changes That May Help Manage Symptoms',
      date: '2025-01-05',
      source: 'Women\'s Health Institute',
      summary: 'Evidence-based dietary and exercise recommendations for symptom management...',
    },
  ];

  const supportOrganizations = [
    {
      name: 'The Fibroid Foundation',
      description: 'Support, education, and advocacy for those affected by fibroids',
      url: 'https://fibroidfoundation.org',
    },
    {
      name: 'Endometriosis Association',
      description: 'Resources and support for endometriosis patients worldwide',
      url: 'https://endometriosisassn.org',
    },
    {
      name: 'PCOS Awareness Association',
      description: 'Information and community support for PCOS management',
      url: 'https://pcosaa.org',
    },
    {
      name: 'National Women\'s Health Network',
      description: 'Independent voice for women\'s health advocacy',
      url: 'https://nwhn.org',
    },
  ];

  const faqs = [
    {
      question: 'What are uterine fibroids?',
      answer: 'Uterine fibroids are non-cancerous growths that develop in or on the uterus. They are very common and can cause symptoms like heavy menstrual bleeding, pelvic pain, and pressure.',
    },
    {
      question: 'How is endometriosis diagnosed?',
      answer: 'Endometriosis is typically diagnosed through a combination of pelvic exams, imaging tests like ultrasound or MRI, and sometimes laparoscopy for definitive diagnosis.',
    },
    {
      question: 'What are the main symptoms of PCOS?',
      answer: 'Common PCOS symptoms include irregular periods, excess androgen (male hormone) levels, polycystic ovaries, weight gain, acne, and excess hair growth.',
    },
    {
      question: 'When should I see a doctor?',
      answer: 'Consult your doctor if you experience severe pelvic pain, very heavy bleeding, pain during intercourse, difficulty getting pregnant, or any symptoms that interfere with daily life.',
    },
    {
      question: 'How can tracking help my treatment?',
      answer: 'Tracking symptoms provides valuable data for your healthcare provider to understand patterns, evaluate treatment effectiveness, and make informed decisions about your care.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/5 to-secondary/10">
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Education & Resources</h1>
          </div>
          <UserMenu />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Newspaper className="h-5 w-5" />
              <CardTitle>Medical News & Research</CardTitle>
            </div>
            <CardDescription>Recent updates and research in reproductive health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {medicalNews.map((news, idx) => (
                <div key={idx} className="border-l-4 border-primary pl-4 py-2">
                  <h3 className="font-semibold text-sm mb-1">{news.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{news.source} • {news.date}</p>
                  <p className="text-sm text-muted-foreground">{news.summary}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning Resources</CardTitle>
            <CardDescription>Educational materials about reproductive health conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {resources.map((resource, idx) => {
                const Icon = resource.icon;
                return (
                  <Card key={idx} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <Icon className="h-12 w-12 text-primary mb-2" />
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle>Support Organizations</CardTitle>
            </div>
            <CardDescription>Connect with communities and resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {supportOrganizations.map((org, idx) => (
                <div key={idx} className="flex items-start justify-between border rounded-lg p-4 hover:bg-accent transition-colors">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">{org.name}</h3>
                    <p className="text-sm text-muted-foreground">{org.description}</p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={org.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Common questions about reproductive health</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Talking to Your Doctor</CardTitle>
            <CardDescription>Tips for effective healthcare communication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Bring your symptom logs and reports to appointments</li>
              <li>Write down questions before your visit</li>
              <li>Be specific about symptom severity and frequency</li>
              <li>Ask about all available treatment options</li>
              <li>Don't hesitate to seek a second opinion</li>
              <li>Request written summaries of your visit</li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Education;
