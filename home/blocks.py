from wagtail import blocks
from wagtail.images.blocks import ImageChooserBlock
from wagtail.blocks import URLBlock, CharBlock, TextBlock, ChoiceBlock, BooleanBlock, RichTextBlock, IntegerBlock

class HeroBannerBlock(blocks.StructBlock):
    """Advanced Hero Banner Block with multiple layout options and effects."""
    
    # Layout options
    layout_style = ChoiceBlock(
        choices=[
            ('center', 'Center Aligned'),
            ('left', 'Left Aligned'),
            ('right', 'Right Aligned'),
            ('full', 'Full Width'),
            ('split', 'Split Layout'),
            ('overlap', 'Content Overlap'),
        ],
        default='center',
        help_text='Select the layout style for the hero banner.'
    )

    # Background options
    background_type = ChoiceBlock(
        choices=[
            ('image', 'Image'),
            ('video', 'Video'),
            ('color', 'Solid Color'),
            ('gradient', 'Gradient'),
        ],
        default='image',
        help_text='Select the background type.'
    )
    
    background_image = ImageChooserBlock(required=False, help_text='Background image for the hero banner.')
    background_color = CharBlock(required=False, max_length=7, help_text='Background color in hex format (e.g., #FF0000).')
    background_video = URLBlock(required=False, help_text='Background video URL (YouTube or Vimeo).')

    # Content
    headline = CharBlock(required=False, max_length=150, help_text='Main headline for the hero banner.')
    subtitle = TextBlock(required=False, max_length=300, help_text='Subtitle for the hero banner.')
    description = RichTextBlock(required=False, help_text='Detailed description for the hero banner.')

    # CTA buttons
    cta_primary = CharBlock(required=False, max_length=150, help_text='Primary CTA text.')
    cta_primary_link = URLBlock(required=False, help_text='Primary CTA link.')
    cta_primary_style = ChoiceBlock(
        choices=[
            ('primary', 'Primary'),
            ('secondary', 'Secondary'),
            ('outline', 'Outline'),
            ('ghost', 'Ghost'),
        ],
        default='primary',
        help_text='Primary CTA style.'
    )
    
    cta_secondary = CharBlock(required=False, max_length=150, help_text='Secondary CTA text.')
    cta_secondary_link = URLBlock(required=False, help_text='Secondary CTA link.')
    cta_secondary_style = ChoiceBlock(
        choices=[
            ('primary', 'Primary'),
            ('secondary', 'Secondary'),
            ('outline', 'Outline'),
            ('ghost', 'Ghost'),
        ],
        default='outline',
        help_text='Secondary CTA style.'
    )

    # Visual effects
    overlay_opacity = ChoiceBlock(
        choices=[('0', '0%'), ('25', '25%'), ('50', '50%'), ('75', '75%'), ('90', '90%')],
        default='50',
        help_text='Overlay opacity for better readability.'
    )
    
    text_alignment = ChoiceBlock(
        choices=[
            ('left', 'Left'),
            ('center', 'Center'),
            ('right', 'Right'),
        ],
        default='center',
        help_text='Text alignment within the hero banner.'
    )
    
    animation_style = ChoiceBlock(
        choices=[
            ('none', 'None'),
            ('fade-in', 'Fade In'),
            ('fade-in-up', 'Fade In Up'),
            ('fade-in-down', 'Fade In Down'),
            ('fade-in-left', 'Fade In Left'),
            ('fade-in-right', 'Fade In Right'),
            ('zoom-in', 'Zoom In'),
            ('zoom-in-up', 'Zoom In Up'),
            ('zoom-in-down', 'Zoom In Down'),
            ('slide-in-up', 'Slide In Up'),
            ('slide-in-down', 'Slide In Down'),
            ('slide-in-left', 'Slide In Left'),
            ('slide-in-right', 'Slide In Right')
        ],
        default='none',
        help_text='Choose the animation for the hero content.'
    )

    # Advanced options
    enable_parallax = BooleanBlock(required=False, default=False, help_text='Enable parallax effect for background.')
    enable_particles = BooleanBlock(required=False, default=False, help_text='Enable particle background effect.')
    content_width = ChoiceBlock(
        choices=[
            ('narrow', 'Narrow (600px)'),
            ('medium', 'Medium (900px)'),
            ('wide', 'Wide (1200px)'),
            ('full', 'Full Width'),
        ],
        default='medium',
        help_text='Content container width.'
    )
    
    padding_top = IntegerBlock(required=False, min_value=0, max_value=200, help_text='Top padding in pixels.')
    padding_bottom = IntegerBlock(required=False, min_value=0, max_value=200, help_text='Bottom padding in pixels.')


class FeatureBlock(blocks.StructBlock):
    """Feature block for showcasing services or products."""
    
    icon = ImageChooserBlock(required=False, help_text='Icon for the feature.')
    title = CharBlock(required=True, max_length=100, help_text='Feature title.')
    description = TextBlock(required=True, max_length=300, help_text='Feature description.')
    link = URLBlock(required=False, help_text='Optional link for the feature.')


class TestimonialBlock(blocks.StructBlock):
    """Testimonial block for customer reviews."""
    
    quote = TextBlock(required=True, max_length=500, help_text='Customer testimonial.')
    author = CharBlock(required=True, max_length=100, help_text='Customer name.')
    role = CharBlock(required=False, max_length=100, help_text='Customer role or position.')
    company = CharBlock(required=False, max_length=100, help_text='Customer company.')
    avatar = ImageChooserBlock(required=False, help_text='Customer avatar or photo.')
    rating = ChoiceBlock(
        choices=[
            ('5', '5 Stars'),
            ('4', '4 Stars'),
            ('3', '3 Stars'),
            ('2', '2 Stars'),
            ('1', '1 Star'),
        ],
        default='5',
        help_text='Customer rating.'
    )


class StatsBlock(blocks.StructBlock):
    """Statistics block for displaying key metrics."""
    
    stat = blocks.ListBlock(
        blocks.StructBlock([
            ('value', CharBlock(required=True, max_length=20, help_text='Statistical value (e.g., "1000+", "99%").')),
            ('label', CharBlock(required=True, max_length=50, help_text='Stat label (e.g., "Customers", "Satisfaction").')),
            ('description', TextBlock(required=False, max_length=150, help_text='Optional description.')),
        ]),
        min_num=1,
        max_num=6,
        help_text='Add statistics to display.'
    )


class CTASectionBlock(blocks.StructBlock):
    """Call to action section block."""
    
    title = CharBlock(required=True, max_length=150, help_text='Section title.')
    description = TextBlock(required=False, max_length=300, help_text='Section description.')
    button_text = CharBlock(required=True, max_length=50, help_text='CTA button text.')
    button_link = URLBlock(required=True, help_text='CTA button link.')
    button_style = ChoiceBlock(
        choices=[
            ('primary', 'Primary'),
            ('secondary', 'Secondary'),
            ('outline', 'Outline'),
        ],
        default='primary',
        help_text='Button style.'
    )
    background_color = CharBlock(required=False, max_length=7, help_text='Background color in hex format.')

class ThemeSelectorBlock(blocks.StructBlock):
    """Advanced Theme Selector Block with comprehensive theme management and customization options.
    
    This block provides content editors with powerful theme control capabilities,
    including preset themes, custom color schemes, and advanced display options.
    """
    
    # Theme selection
    theme_mode = ChoiceBlock(
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
        help_text='Select the theme mode for the website. "System Default" follows the user\'s OS preference.'
    )
    
    # Theme customization options
    enable_customization = BooleanBlock(
        required=False,
        default=False,
        help_text='Enable advanced theme customization options. Only applies to "Custom Theme" mode.'
    )
    
    # Custom color scheme
    primary_color = CharBlock(
        required=False,
        max_length=7,
        help_text='Primary accent color in hex format (e.g., #3B82F6). Used for buttons, links, and highlights.'
    )
    
    secondary_color = CharBlock(
        required=False,
        max_length=7,
        help_text='Secondary color in hex format (e.g., #10B981). Used for secondary elements and accents.'
    )
    
    background_color = CharBlock(
        required=False,
        max_length=7,
        help_text='Main background color in hex format (e.g., #FFFFFF).'
    )
    
    surface_color = CharBlock(
        required=False,
        max_length=7,
        help_text='Surface elements color in hex format (e.g., cards, panels).'
    )
    
    text_color = CharBlock(
        required=False,
        max_length=7,
        help_text='Primary text color in hex format (e.g., #1E293B).'
    )
    
    text_secondary_color = CharBlock(
        required=False,
        max_length=7,
        help_text='Secondary text color in hex format (e.g., #64748B).'
    )
    
    border_color = CharBlock(
        required=False,
        max_length=7,
        help_text='Border and divider color in hex format (e.g., #E2E8F0).'
    )
    
    # Typography options
    font_family = ChoiceBlock(
        choices=[
            ('system', 'System Default'),
            ('sans-serif', 'Sans Serif (Inter, Roboto, etc.)'),
            ('serif', 'Serif (Merriweather, Georgia, etc.)'),
            ('monospace', 'Monospace (Fira Code, Consolas, etc.)'),
        ],
        default='system',
        help_text='Select the font family for the website.'
    )
    
    font_size_scale = ChoiceBlock(
        choices=[
            ('sm', 'Small (14px base)'),
            ('md', 'Medium (16px base)'),
            ('lg', 'Large (18px base)'),
            ('xl', 'Extra Large (20px base)'),
        ],
        default='md',
        help_text='Adjust the overall font size scale for better readability.'
    )
    
    # Display options
    show_theme_switcher = BooleanBlock(
        required=False,
        default=True,
        help_text='Show the theme switcher widget on the page for user theme selection.'
    )
    
    switcher_position = ChoiceBlock(
        choices=[
            ('top-left', 'Top Left'),
            ('top-right', 'Top Right'),
            ('bottom-left', 'Bottom Left'),
            ('bottom-right', 'Bottom Right'),
        ],
        default='bottom-right',
        help_text='Position of the theme switcher widget on the page.'
    )
    
    switcher_style = ChoiceBlock(
        choices=[
            ('compact', 'Compact (Icon Only)'),
            ('full', 'Full (Icon + Text)'),
            ('expanded', 'Expanded (Full Options)'),
        ],
        default='full',
        help_text='Visual style of the theme switcher widget.'
    )
    
    # Animation and effects
    enable_transitions = BooleanBlock(
        required=False,
        default=True,
        help_text='Enable smooth transitions between theme changes.'
    )
    
    transition_duration = ChoiceBlock(
        choices=[
            ('fast', 'Fast (150ms)'),
            ('normal', 'Normal (300ms)'),
            ('slow', 'Slow (500ms)'),
        ],
        default='normal',
        help_text='Duration of theme transition animations.'
    )
    
    # Advanced options
    enable_persistence = BooleanBlock(
        required=False,
        default=True,
        help_text='Save user theme preference across browser sessions using localStorage.'
    )
    
    enable_server_persistence = BooleanBlock(
        required=False,
        default=False,
        help_text='Save user theme preference on the server (requires user authentication).'
    )
    
    enable_auto_detect = BooleanBlock(
        required=False,
        default=True,
        help_text='Automatically detect and adapt to system theme changes.'
    )
    
    auto_contrast_adjustment = BooleanBlock(
        required=False,
        default=True,
        help_text='Automatically adjust text colors for better contrast on custom backgrounds.'
    )
    
    # Accessibility options
    enable_high_contrast_mode = BooleanBlock(
        required=False,
        default=False,
        help_text='Enable high contrast mode for improved accessibility.'
    )
    
    focus_outline_style = ChoiceBlock(
        choices=[
            ('default', 'Default Browser Outline'),
            ('thick', 'Thick Visible Outline'),
            ('colorful', 'Colorful Enhanced Outline'),
        ],
        default='default',
        help_text='Style of focus outlines for keyboard navigation.'
    )