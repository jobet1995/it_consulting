from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import SnippetViewSet

from .models import HomePage, ThemeSettings


# Register HomePage as a snippet to make it accessible in the admin sidebar
@register_snippet
class HomePageSnippetViewSet(SnippetViewSet):
    model = HomePage
    menu_label = "Home Pages"
    icon = "home"
    list_display = ("title", "slug", "first_published_at", "last_published_at")
    search_fields = ("title", "slug")


# Register ThemeSettings as a snippet to make it accessible in the admin sidebar
@register_snippet
class ThemeSettingsSnippetViewSet(SnippetViewSet):
    model = ThemeSettings
    menu_label = "Theme Settings"
    icon = "paint"
    list_display = ("name", "is_active", "theme_mode")
    search_fields = ("name",)