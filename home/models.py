from django.db import models
from wagtail.models import Page
from wagtail.fields import StreamField
from wagtail.admin.panels import FieldPanel
from wagtail.search import index
from wagtail.snippets.models import register_snippet

from home.blocks import (
    HeroBannerBlock, 
    HeroCarouselBlock,
    HeroVideoBackgroundBlock,
    ServiceCardBlock,
    ServiceCardsBlock,
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


@register_snippet
class CarouselSettings(models.Model):
    """Settings for hero carousel components."""
    
    name = models.CharField(max_length=100, unique=True, help_text="Name for this carousel configuration")
    is_active = models.BooleanField(default=False, help_text="Make this the active carousel configuration")
    
    # Carousel settings
    auto_rotate = models.BooleanField(default=True, help_text="Automatically rotate slides every few seconds.")
    rotation_speed = models.IntegerField(
        choices=[
            (3000, '3 seconds'),
            (5000, '5 seconds'),
            (7000, '7 seconds'),
            (10000, '10 seconds'),
        ],
        default=5000,
        help_text='Time between slide transitions.'
    )
    
    show_indicators = models.BooleanField(default=True, help_text='Show slide position indicators.')
    show_navigation = models.BooleanField(default=True, help_text='Show previous/next navigation arrows.')
    pause_on_hover = models.BooleanField(default=True, help_text='Pause rotation when user hovers over carousel.')
    
    # AJAX settings
    ajax_url = models.URLField(blank=True, null=True, help_text='URL for AJAX requests. Leave blank to disable AJAX functionality.')
    ajax_method = models.CharField(
        max_length=10,
        choices=[
            ('GET', 'GET'),
            ('POST', 'POST'),
        ],
        default='POST',
        help_text='HTTP method for AJAX requests.'
    )
    
    # Visual effects
    overlay_opacity = models.CharField(
        max_length=10,
        choices=[('0', '0%'), ('25', '25%'), ('50', '50%'), ('75', '75%'), ('90', '90%')],
        default='50',
        help_text='Overlay opacity for better readability.'
    )
    
    text_alignment = models.CharField(
        max_length=10,
        choices=[
            ('left', 'Left'),
            ('center', 'Center'),
            ('right', 'Right'),
        ],
        default='center',
        help_text='Text alignment within slides.'
    )
    
    animation_style = models.CharField(
        max_length=20,
        choices=[
            ('fade', 'Fade'),
            ('slide', 'Slide'),
            ('zoom', 'Zoom'),
        ],
        default='fade',
        help_text='Transition animation style.'
    )
    
    content_width = models.CharField(
        max_length=20,
        choices=[
            ('narrow', 'Narrow (600px)'),
            ('medium', 'Medium (900px)'),
            ('wide', 'Wide (1200px)'),
            ('full', 'Full Width'),
        ],
        default='medium',
        help_text='Content container width.'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    panels = [
        FieldPanel('name'),
        FieldPanel('is_active'),
        FieldPanel('auto_rotate'),
        FieldPanel('rotation_speed'),
        FieldPanel('show_indicators'),
        FieldPanel('show_navigation'),
        FieldPanel('pause_on_hover'),
        FieldPanel('ajax_url'),
        FieldPanel('ajax_method'),
        FieldPanel('overlay_opacity'),
        FieldPanel('text_alignment'),
        FieldPanel('animation_style'),
        FieldPanel('content_width'),
    ]
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Carousel Setting"
        verbose_name_plural = "Carousel Settings"


@register_snippet
class VideoBackgroundSettings(models.Model):
    """Settings for hero video background components."""
    
    name = models.CharField(max_length=100, unique=True, help_text="Name for this video background configuration")
    is_active = models.BooleanField(default=False, help_text="Make this the active video background configuration")
    
    # Video settings
    background_video = models.URLField(help_text='URL to the background video (MP4 format recommended).')
    fallback_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text='Fallback image for mobile devices or when video is disabled.'
    )
    
    # Overlay options
    overlay_gradient = models.CharField(
        max_length=20,
        choices=[
            ('none', 'None'),
            ('dark', 'Dark Gradient'),
            ('light', 'Light Gradient'),
            ('blue', 'Blue Gradient'),
            ('green', 'Green Gradient'),
            ('purple', 'Purple Gradient'),
        ],
        default='dark',
        help_text='Gradient overlay for better text readability.'
    )
    
    overlay_opacity = models.CharField(
        max_length=10,
        choices=[('0', '0%'), ('10', '10%'), ('25', '25%'), ('50', '50%'), ('75', '75%'), ('90', '90%')],
        default='50',
        help_text='Overlay opacity for better readability.'
    )
    
    # Display options
    content_alignment = models.CharField(
        max_length=10,
        choices=[
            ('left', 'Left'),
            ('center', 'Center'),
            ('right', 'Right'),
        ],
        default='center',
        help_text='Content alignment within the hero section.'
    )
    
    content_vertical_position = models.CharField(
        max_length=10,
        choices=[
            ('top', 'Top'),
            ('middle', 'Middle'),
            ('bottom', 'Bottom'),
        ],
        default='middle',
        help_text='Vertical position of content within the hero section.'
    )
    
    content_width = models.CharField(
        max_length=20,
        choices=[
            ('narrow', 'Narrow (600px)'),
            ('medium', 'Medium (900px)'),
            ('wide', 'Wide (1200px)'),
            ('full', 'Full Width'),
        ],
        default='medium',
        help_text='Content container width.'
    )
    
    # Advanced options
    enable_mute = models.BooleanField(default=True, help_text='Mute the video by default (recommended for autoplay).')
    enable_loop = models.BooleanField(default=True, help_text='Loop the video continuously.')
    enable_autoplay = models.BooleanField(default=True, help_text='Autoplay the video when page loads.')
    disable_on_mobile = models.BooleanField(default=False, help_text='Disable video on mobile devices to save bandwidth.')
    
    # Animation
    animation_style = models.CharField(
        max_length=20,
        choices=[
            ('none', 'None'),
            ('fade-in', 'Fade In'),
            ('fade-in-up', 'Fade In Up'),
            ('fade-in-down', 'Fade In Down'),
            ('slide-in-up', 'Slide In Up'),
            ('slide-in-down', 'Slide In Down'),
        ],
        default='fade-in',
        help_text='Animation for the content.'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    panels = [
        FieldPanel('name'),
        FieldPanel('is_active'),
        FieldPanel('background_video'),
        FieldPanel('fallback_image'),
        FieldPanel('overlay_gradient'),
        FieldPanel('overlay_opacity'),
        FieldPanel('content_alignment'),
        FieldPanel('content_vertical_position'),
        FieldPanel('content_width'),
        FieldPanel('enable_mute'),
        FieldPanel('enable_loop'),
        FieldPanel('enable_autoplay'),
        FieldPanel('disable_on_mobile'),
        FieldPanel('animation_style'),
    ]
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Video Background Setting"
        verbose_name_plural = "Video Background Settings"


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
        ('hero_carousel', HeroCarouselBlock()),
        ('hero_video_background', HeroVideoBackgroundBlock()),
        ('service_card', ServiceCardBlock()),
        ('service_cards', ServiceCardsBlock()),
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