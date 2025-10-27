from django.db import models
from wagtail.models import Page
from wagtail.fields import StreamField
from wagtail.admin.panels import FieldPanel
from wagtail.search import index
from wagtail.snippets.models import register_snippet

from home.blocks import (
    HeroBannerBlock, 
    FeatureBlock, 
    TestimonialBlock, 
    StatsBlock, 
    CTASectionBlock,
    ThemeSelectorBlock
)


class ThemeSettings(models.Model):
    """Theme settings model for managing site-wide theme preferences."""
    
    name = models.CharField(max_length=100, unique=True, help_text="Name for this theme configuration")
    is_active = models.BooleanField(default=False, help_text="Make this the active theme for the site")
    
    # Theme selection
    theme_mode = models.CharField(
        max_length=20,
        choices=[
            ('system', 'System Default'),
            ('light', 'Light Theme'),
            ('dark', 'Dark Theme'),
            ('blue', 'Ocean Breeze'),
            ('green', 'Forest Green'),
            ('contrast', 'High Contrast'),
            ('sunset', 'Sunset Glow'),
            ('custom', 'Custom Theme'),
        ],
        default='system',
        help_text='Select the theme mode for the website.'
    )
    
    # Custom color scheme
    primary_color = models.CharField(
        max_length=7,
        blank=True,
        help_text='Primary accent color in hex format (e.g., #3B82F6).'
    )
    
    secondary_color = models.CharField(
        max_length=7,
        blank=True,
        help_text='Secondary color in hex format (e.g., #10B981).'
    )
    
    background_color = models.CharField(
        max_length=7,
        blank=True,
        help_text='Main background color in hex format (e.g., #FFFFFF).'
    )
    
    surface_color = models.CharField(
        max_length=7,
        blank=True,
        help_text='Surface elements color in hex format (e.g., cards, panels).'
    )
    
    text_color = models.CharField(
        max_length=7,
        blank=True,
        help_text='Primary text color in hex format (e.g., #1E293B).'
    )
    
    text_secondary_color = models.CharField(
        max_length=7,
        blank=True,
        help_text='Secondary text color in hex format (e.g., #64748B).'
    )
    
    border_color = models.CharField(
        max_length=7,
        blank=True,
        help_text='Border and divider color in hex format (e.g., #E2E8F0).'
    )
    
    # Typography options
    font_family = models.CharField(
        max_length=20,
        choices=[
            ('system', 'System Default'),
            ('sans-serif', 'Sans Serif'),
            ('serif', 'Serif'),
            ('monospace', 'Monospace'),
        ],
        default='system',
        help_text='Select the font family for the website.'
    )
    
    font_size_scale = models.CharField(
        max_length=10,
        choices=[
            ('sm', 'Small'),
            ('md', 'Medium'),
            ('lg', 'Large'),
            ('xl', 'Extra Large'),
        ],
        default='md',
        help_text='Adjust the overall font size scale.'
    )
    
    # Display options
    switcher_position = models.CharField(
        max_length=20,
        choices=[
            ('top-left', 'Top Left'),
            ('top-right', 'Top Right'),
            ('bottom-left', 'Bottom Left'),
            ('bottom-right', 'Bottom Right'),
        ],
        default='bottom-right',
        help_text='Position of the theme switcher widget.'
    )
    
    switcher_style = models.CharField(
        max_length=20,
        choices=[
            ('compact', 'Compact'),
            ('full', 'Full'),
            ('expanded', 'Expanded'),
        ],
        default='full',
        help_text='Visual style of the theme switcher widget.'
    )
    
    # Animation settings
    enable_transitions = models.BooleanField(
        default=True,
        help_text='Enable smooth transitions between theme changes.'
    )
    
    transition_duration = models.CharField(
        max_length=10,
        choices=[
            ('fast', 'Fast'),
            ('normal', 'Normal'),
            ('slow', 'Slow'),
        ],
        default='normal',
        help_text='Duration of theme transition animations.'
    )
    
    # Advanced options
    enable_persistence = models.BooleanField(
        default=True,
        help_text='Save user theme preference across sessions.'
    )
    
    enable_auto_detect = models.BooleanField(
        default=True,
        help_text='Automatically detect system theme changes.'
    )
    
    auto_contrast_adjustment = models.BooleanField(
        default=True,
        help_text='Automatically adjust text colors for better contrast.'
    )
    
    # Accessibility options
    enable_high_contrast_mode = models.BooleanField(
        default=False,
        help_text='Enable high contrast mode for improved accessibility.'
    )
    
    focus_outline_style = models.CharField(
        max_length=20,
        choices=[
            ('default', 'Default'),
            ('thick', 'Thick'),
            ('colorful', 'Colorful'),
        ],
        default='default',
        help_text='Style of focus outlines for keyboard navigation.'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    panels = [
        FieldPanel('name'),
        FieldPanel('is_active'),
        FieldPanel('theme_mode'),
        FieldPanel('primary_color'),
        FieldPanel('secondary_color'),
        FieldPanel('background_color'),
        FieldPanel('surface_color'),
        FieldPanel('text_color'),
        FieldPanel('text_secondary_color'),
        FieldPanel('border_color'),
        FieldPanel('font_family'),
        FieldPanel('font_size_scale'),
        FieldPanel('switcher_position'),
        FieldPanel('switcher_style'),
        FieldPanel('enable_transitions'),
        FieldPanel('transition_duration'),
        FieldPanel('enable_persistence'),
        FieldPanel('enable_auto_detect'),
        FieldPanel('auto_contrast_adjustment'),
        FieldPanel('enable_high_contrast_mode'),
        FieldPanel('focus_outline_style'),
    ]
    
    def __str__(self):
        return str(self.name)
    
    class Meta:
        verbose_name = "Theme Setting"
        verbose_name_plural = "Theme Settings"


class HomePage(Page):
    """Home page model with advanced content blocks."""
    
    # SEO fields
    banner_title = models.CharField(
        max_length=255, 
        blank=True, 
        help_text="SEO-friendly title for the homepage"
    )
    banner_subtitle = models.CharField(
        max_length=500, 
        blank=True, 
        help_text="Subtitle for the homepage banner"
    )
    
    # Main content streamfield
    content = StreamField([
        ('hero_banner', HeroBannerBlock()),
        ('features', FeatureBlock()),
        ('testimonials', TestimonialBlock()),
        ('stats', StatsBlock()),
        ('cta_section', CTASectionBlock()),
        ('theme_selector', ThemeSelectorBlock()),
    ], use_json_field=True, blank=True)
    
    # Additional content sections
    about_title = models.CharField(
        max_length=255, 
        blank=True, 
        help_text="Title for the about section"
    )
    about_description = models.TextField(
        blank=True, 
        help_text="Description for the about section"
    )
    
    # Search index configuration
    search_fields = Page.search_fields + [
        index.SearchField('banner_title'),
        index.SearchField('banner_subtitle'),
        index.SearchField('about_title'),
        index.SearchField('about_description'),
        index.SearchField('content'),
    ]
    
    # Editor panels configuration
    content_panels = Page.content_panels + [
        FieldPanel('banner_title'),
        FieldPanel('banner_subtitle'),
        FieldPanel('content'),
        FieldPanel('about_title'),
        FieldPanel('about_description'),
    ]
    
    # Configuration
    subpage_types = ['home.HomePage']  # Allow child pages of this type
    parent_page_types = ['wagtailcore.Page']  # Allow this page type to be created under any page
    
    class PageMeta:
        verbose_name = "Home Page"
        verbose_name_plural = "Home Pages"